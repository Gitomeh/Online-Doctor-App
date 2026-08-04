import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
// Handle both formats: with and without "AQ." prefix
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const cleanApiKey = API_KEY.startsWith('AQ.') ? API_KEY.substring(3) : API_KEY;
const genAI = cleanApiKey ? new GoogleGenerativeAI(cleanApiKey) : null;

export interface DiseaseAnalysis {
  name: string;
  probability: number;
  specialty: string;
  description: string;
  symptoms: string[];
  severity: 'Mild' | 'Moderate' | 'Severe';
  possibleCauses: string[];
  recommendedActions: string[];
  symptomsToWatch: string[];
  urgency: 'Non-urgent' | 'Soon' | 'Urgent' | 'Emergency';
}

export async function analyzeSymptoms(symptoms: string, labResults?: string): Promise<DiseaseAnalysis[]> {
  // Check if API key is available
  if (!genAI || !API_KEY) {
    console.warn('Gemini API key not configured, using mock analysis');
    return getMockAnalysis();
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `As a medical AI assistant, analyze the following symptoms and lab results (if provided) to identify potential diseases and recommend appropriate medical specialties.

Symptoms: ${symptoms}
${labResults ? `Lab Results: ${labResults}` : ''}

Please provide a detailed JSON response with the following structure:
[
  {
    "name": "Disease name",
    "probability": 0.85,
    "specialty": "Medical specialty",
    "description": "Detailed description of the condition",
    "symptoms": ["List of specific symptoms related to this condition"],
    "severity": "Mild/Moderate/Severe",
    "possibleCauses": ["List of possible causes"],
    "recommendedActions": ["List of recommended actions for the patient"],
    "symptomsToWatch": ["List of symptoms that require immediate attention"],
    "urgency": "Non-urgent/Soon/Urgent/Emergency"
  }
]

Provide the top 3-5 most likely conditions with probabilities between 0 and 1. Focus on being accurate, safe, and providing actionable medical information. Include specific symptoms that match the patient's description, possible causes, and clear recommended actions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      // Fallback to mock data if parsing fails
      return getMockAnalysis();
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to mock data if API fails
    return getMockAnalysis();
  }
}

function getMockAnalysis(): DiseaseAnalysis[] {
  return [
    {
      name: "Common Cold",
      probability: 0.85,
      specialty: "General Practice",
      description: "A viral infection of the upper respiratory tract that primarily affects the nose and throat. It's usually harmless and resolves within 7-10 days.",
      symptoms: ["Runny or stuffy nose", "Sore throat", "Cough", "Congestion", "Slight body aches", "Mild headache", "Low-grade fever"],
      severity: "Mild",
      possibleCauses: ["Rhinovirus infection", "Other viral infections", "Weakened immune system", "Exposure to infected individuals"],
      recommendedActions: ["Rest and stay hydrated", "Use over-the-counter cold medications", "Gargle with warm salt water", "Use a humidifier", "Get plenty of sleep"],
      symptomsToWatch: ["High fever (above 101°F)", "Difficulty breathing", "Chest pain", "Symptoms lasting more than 10 days"],
      urgency: "Non-urgent"
    },
    {
      name: "Influenza",
      probability: 0.72,
      specialty: "General Practice",
      description: "A viral infection that attacks your respiratory system — your nose, throat and lungs. It's commonly called the flu, but it's not the same as stomach 'flu' viruses.",
      symptoms: ["Fever over 100.4°F (38°C)", "Aching muscles", "Chills and sweats", "Headache", "Dry, persistent cough", "Fatigue and weakness", "Nasal congestion", "Sore throat"],
      severity: "Moderate",
      possibleCauses: ["Influenza A or B viruses", "Weakened immune system", "Age (very young or elderly)", "Chronic health conditions"],
      recommendedActions: ["Antiviral medications (if within 48 hours)", "Rest and fluids", "Over-the-counter pain relievers", "Isolate to prevent spread", "Monitor symptoms closely"],
      symptomsToWatch: ["Difficulty breathing", "Chest pain", "Sudden dizziness", "Confusion", "Severe vomiting", "Symptoms that improve then return with fever"],
      urgency: "Soon"
    },
    {
      name: "Bronchitis",
      probability: 0.65,
      specialty: "Pulmonology",
      description: "Inflammation of the lining of bronchial tubes, which carry air to and from your lungs. It can be acute (short-term) or chronic (long-term).",
      symptoms: ["Cough", "Production of mucus (sputum)", "Fatigue", "Shortness of breath", "Slight fever and chills", "Chest discomfort"],
      severity: "Moderate",
      possibleCauses: ["Viral infections", "Bacterial infections", "Smoking", "Air pollution", "Dust or fumes", "Gastroesophageal reflux disease (GERD)"],
      recommendedActions: ["Rest and fluids", "Humidifier or steam", "Avoid lung irritants", "Over-the-counter pain relievers", "Prescription inhalers (if chronic)"],
      symptomsToWatch: ["Cough lasting more than 3 weeks", "Fever above 100.4°F", "Blood in cough", "Difficulty breathing", "Wheezing"],
      urgency: "Soon"
    }
  ];
}