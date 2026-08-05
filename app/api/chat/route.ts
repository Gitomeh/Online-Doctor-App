import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    // Simulate AI response with mock data for now
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

    // Select a response based on message count to vary responses
    const index = messages.length % responses.length;
    const response = responses[index];

    // Return the response as text
    return new Response(response, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return a simple text response as fallback
    const fallbackResponse = `I apologize, but I'm experiencing technical difficulties. Please try again later. If you have urgent medical concerns, please consult a healthcare professional directly.`;
    
    return new Response(fallbackResponse, {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}
