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
  if (!genAI || !cleanApiKey) {
    throw new Error('Gemini API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Build the prompt with system message and conversation
  const lastMessage = messages[messages.length - 1];
  const userContent = lastMessage?.content || '';

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
}
