import { GoogleGenerativeAI } from '@google/generative-ai';
import { AI_MODEL, SYSTEM_PROMPT, validateApiKey, getApiKey, AI_PROVIDER } from '@/lib/ai-config';

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
      const providerName = AI_PROVIDER === 'gemini' ? 'Google Generative AI' : 'Anthropic';
      return new Response(
        JSON.stringify({ error: `${providerName} API key not configured` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response
    if (AI_PROVIDER === 'gemini') {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: AI_MODEL,
        systemInstruction: SYSTEM_PROMPT,
      });

      // Convert messages to Gemini format
      const history = messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

      const lastMessage = messages[messages.length - 1];
      const userPrompt = lastMessage?.content || '';

      const chat = model.startChat({ history });
      const result = await chat.sendMessageStream(userPrompt);

      // Create a readable stream for the response
      const encoder = new TextEncoder();
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            // Send message start
            const startChunk = {
              id: 'msg_' + Date.now(),
              type: 'message-start',
              message: {
                id: 'msg_' + Date.now(),
                role: 'assistant',
                content: [],
              },
            };
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(startChunk)}\n\n`));

            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                const textDelta = {
                  id: 'msg_' + Date.now(),
                  type: 'text-delta',
                  textDelta: text,
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(textDelta)}\n\n`));
              }
            }

            // Send done signal
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
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
    } else {
      // Fallback to Anthropic using direct API call
      const anthropicMessages = messages.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

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
    }
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
