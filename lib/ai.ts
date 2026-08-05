import { GoogleGenerativeAI } from '@google/generative-ai';
import { streamText, CoreMessage } from 'ai';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const cleanApiKey = API_KEY.startsWith('AQ.') ? API_KEY.substring(3) : API_KEY;
const genAI = cleanApiKey ? new GoogleGenerativeAI(cleanApiKey) : null;

export const SYSTEM_PROMPT = `You are MediAI, a medical assistant designed to help patients understand their symptoms before booking appointments.

IMPORTANT GUIDELINES:
- Never claim certainty in diagnoses
- Always recommend consulting a licensed doctor for proper diagnosis
- If symptoms suggest an emergency (chest pain, difficulty breathing, severe bleeding, loss of consciousness, etc.), advise immediate emergency care
- Provide general information only, not medical advice
- Be concise and professional in your responses

When analyzing symptoms:
1. Acknowledge the symptoms described
2. Suggest possible conditions with appropriate disclaimers
3. Recommend when urgent medical attention is needed
4. Suggest the most appropriate medical specialty from this list:
   - General Practitioner
   - Cardiologist
   - Neurologist
   - Dermatologist
   - Pediatrician
   - Orthopedic Surgeon
   - Gynecologist
   - Psychiatrist
   - Gastroenterologist
   - Pulmonologist
   - Endocrinologist
   - Ophthalmologist
   - Otolaryngologist (ENT)
   - Urologist
   - Oncologist
   - Nephrologist
   - Rheumatologist

Format your response clearly with sections when appropriate. Use bullet points for lists.`;

export async function generateAIResponse(messages: CoreMessage[]) {
  const lastMessage = messages[messages.length - 1];
  const userContent = String(lastMessage?.content || '');

  // Check if API key is configured
  if (!genAI || !cleanApiKey || cleanApiKey === 'your_gemini_api_key_here') {
    console.warn('Gemini API key not configured, using mock response');
    return getMockResponse(userContent);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Include system prompt and recent conversation context
    let fullPrompt = SYSTEM_PROMPT + '\n\n';
    
    // Add conversation history (last 5 messages for context)
    const recentMessages = messages.slice(-6, -1);
    for (const msg of recentMessages) {
      const role = msg.role === 'assistant' ? 'MediAI' : 'User';
      fullPrompt += `${role}: ${msg.content}\n\n`;
    }
    
    fullPrompt += `User: ${userContent}\n\nMediAI:`;

    const result = await model.generateContentStream(fullPrompt);
    
    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return {
      toDataStreamResponse: () => {
        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
          },
        });
      }
    } as any;
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to mock response if API fails
    return getMockResponse(userContent);
  }
}

function getMockResponse(userInput: string) {
  const responses = [
    `Based on your symptoms, I recommend consulting a General Practitioner for a proper evaluation. 

**Possible considerations:**
- Your symptoms may indicate a common condition that typically resolves on its own
- Rest and hydration are often helpful
- Monitor for any worsening symptoms

**When to seek urgent care:**
- If you experience difficulty breathing
- Chest pain or pressure
- Severe headache with vision changes
- High fever that doesn't respond to medication

Please schedule an appointment with a doctor for a proper diagnosis and treatment plan.`,
    
    `Thank you for describing your symptoms. Based on what you've shared, I suggest seeing a specialist.

**Recommended Specialist:** General Practitioner

**Next steps:**
1. Schedule an appointment with your primary care physician
2. Keep a symptom diary noting frequency and severity
3. Get adequate rest and stay hydrated
4. Avoid self-diagnosis - a proper medical evaluation is important

**Important:** If your symptoms worsen or you develop new concerning symptoms, seek medical attention promptly.`,
    
    `I understand you're experiencing these symptoms. While I can provide general information, please remember that I'm an AI assistant and not a substitute for professional medical advice.

**General guidance:**
- Many common symptoms resolve with rest and self-care
- Over-the-counter medications may help with discomfort
- Stay well-hydrated and get plenty of rest

**Red flags to watch for:**
- Symptoms that persist longer than expected
- Worsening condition despite self-care
- Any new or severe symptoms

I recommend booking an appointment with a General Practitioner for proper evaluation and personalized treatment advice.`
  ];

  // Select a response based on input length to vary responses
  const index = userInput.length % responses.length;
  const mockResponse = responses[index];

  const stream = new ReadableStream({
    async start(controller) {
      // Simulate streaming by sending chunks
      const chunks = mockResponse.split('').join('').match(/.{1,5}/g) || [mockResponse];
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      controller.close();
    }
  });

  return {
    toDataStreamResponse: () => {
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
        },
      });
    }
  } as any;
}
