import { AI_MODEL, SYSTEM_PROMPT, validateApiKey } from '@/lib/ai-config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    // Validate request
    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Validate API key
    if (!validateApiKey()) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    // Call Anthropic API with streaming
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Anthropic API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      } as HeadersInit,
      body: JSON.stringify({
        model: AI_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: anthropicMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return new Response(
        JSON.stringify({ error: 'Anthropic API request failed', details: error }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a readable stream for the response in AI SDK format
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  continue;
                }

                try {
                  const parsed = JSON.parse(data);
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    // Send in AI SDK format
                    const aiChunk = {
                      id: parsed.message_id || 'msg_' + Date.now(),
                      type: 'text-delta',
                      textDelta: parsed.delta.text,
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(aiChunk)}\n\n`));
                  } else if (parsed.type === 'message_start') {
                    const aiChunk = {
                      id: parsed.message.id,
                      type: 'message-start',
                      message: {
                        id: parsed.message.id,
                        role: 'assistant',
                        content: [],
                      },
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(aiChunk)}\n\n`));
                  } else if (parsed.type === 'message_delta') {
                    const aiChunk = {
                      type: 'message-delta',
                      delta: { usage: parsed.usage },
                      usage: parsed.usage,
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(aiChunk)}\n\n`));
                  } else if (parsed.type === 'message_stop') {
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
