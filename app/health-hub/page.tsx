import { Card } from "@/components/ui/card";

export default function HealthHubPage() {
  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Health Hub
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Your daily guide to a healthier lifestyle
          </p>
        </div>

        {/* Daily Water Intake */}
        <Card className="p-8 mb-8 dark:bg-neutral-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Daily Water Intake
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Stay hydrated with the right amount of water each day.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Recommended Daily Intake:
            </h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>• <strong>Adults:</strong> 8 glasses (2 liters) per day</li>
              <li>• <strong>Men:</strong> 3.7 liters (15.5 cups) per day</li>
              <li>• <strong>Women:</strong> 2.7 liters (11.5 cups) per day</li>
              <li>• <strong>Children:</strong> 1-1.5 liters (4-6 cups) per day</li>
            </ul>
          </div>

          <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">Tips for Staying Hydrated:</h3>
            <ul className="space-y-2">
              <li>• Drink a glass of water before each meal</li>
              <li>• Keep a water bottle with you throughout the day</li>
              <li>• Set reminders to drink water regularly</li>
              <li>• Eat water-rich foods like fruits and vegetables</li>
              <li>• Drink more water during exercise and hot weather</li>
            </ul>
          </div>
        </Card>

        {/* BMI Guidelines */}
        <Card className="p-8 mb-8 dark:bg-neutral-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                BMI Guidelines
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Body Mass Index (BMI) helps assess healthy weight ranges.
              </p>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              BMI Categories:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  <strong>Underweight:</strong> BMI &lt; 18.5
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  <strong>Normal:</strong> BMI 18.5 - 24.9
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  <strong>Overweight:</strong> BMI 25 - 29.9
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-neutral-600 dark:text-neutral-400">
                  <strong>Obese:</strong> BMI ≥ 30
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">BMI Calculation:</h3>
            <p className="font-mono bg-neutral-100 dark:bg-neutral-700 p-3 rounded">
              BMI = Weight (kg) / Height (m)²
            </p>
            <p className="text-sm">Example: 70kg / (1.75m)² = 22.9 (Normal weight)</p>
          </div>
        </Card>

        {/* Healthy Eating */}
        <Card className="p-8 mb-8 dark:bg-neutral-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Healthy Eating Habits
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Nourish your body with balanced nutrition.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Eat More:</h3>
              <ul className="space-y-1 text-neutral-600 dark:text-neutral-400 text-sm">
                <li>• Fruits and vegetables (5+ servings daily)</li>
                <li>• Whole grains (brown rice, oats, quinoa)</li>
                <li>• Lean proteins (chicken, fish, legumes)</li>
                <li>• Healthy fats (avocados, nuts, olive oil)</li>
                <li>• Dairy or fortified alternatives</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Limit:</h3>
              <ul className="space-y-1 text-neutral-600 dark:text-neutral-400 text-sm">
                <li>• Processed foods and sugars</li>
                <li>• Saturated and trans fats</li>
                <li>• Sodium (less than 2,300mg daily)</li>
                <li>• Red meat (limit to 1-2 servings weekly)</li>
                <li>• Alcohol (moderate consumption)</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">Daily Tips:</h3>
            <ul className="space-y-2">
              <li>• Start your day with a nutritious breakfast</li>
              <li>• Practice portion control and mindful eating</li>
              <li>• Plan meals ahead to avoid unhealthy choices</li>
              <li>• Cook at home more often</li>
              <li>• Stay hydrated with water instead of sugary drinks</li>
            </ul>
          </div>
        </Card>

        {/* Home Treatments */}
        <Card className="p-8 mb-8 dark:bg-neutral-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Home Remedies & Treatments
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Natural remedies for common health issues.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Common Cold:</h3>
              <ul className="space-y-1 text-neutral-600 dark:text-neutral-400 text-sm">
                <li>• Stay hydrated with warm fluids</li>
                <li>• Get plenty of rest</li>
                <li>• Gargle with salt water</li>
                <li>• Use honey for sore throat</li>
                <li>• Steam inhalation for congestion</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Headache Relief:</h3>
              <ul className="space-y-1 text-neutral-600 dark:text-neutral-400 text-sm">
                <li>• Rest in a dark, quiet room</li>
                <li>• Apply cold or warm compress</li>
                <li>• Stay hydrated</li>
                <li>• Practice relaxation techniques</li>
                <li>• Try acupressure points</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Digestive Issues:</h3>
              <ul className="space-y-1 text-neutral-600 dark:text-neutral-400 text-sm">
                <li>• Ginger for nausea</li>
                <li>• Peppermint for bloating</li>
                <li>• Probiotics for gut health</li>
                <li>• Chamomile tea for digestion</li>
                <li>• Avoid heavy meals before bed</li>
              </ul>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-2">Skin Care:</h3>
              <ul className="space-y-1 text-neutral-600 dark:text-neutral-400 text-sm">
                <li>• Aloe vera for burns</li>
                <li>• Honey for wound healing</li>
                <li>• Tea tree oil for acne</li>
                <li>• Oatmeal for skin irritation</li>
                <li>• Stay hydrated for healthy skin</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>⚠️ Disclaimer:</strong> These home remedies are for informational purposes only. 
              Always consult with a healthcare professional for serious conditions or if symptoms persist.
            </p>
          </div>
        </Card>

        {/* Exercise Tips */}
        <Card className="p-8 mb-8 dark:bg-neutral-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Exercise & Physical Activity
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Stay active for better health and well-being.
              </p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Recommended Activity:
            </h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>• <strong>Adults:</strong> 150 minutes moderate activity per week</li>
              <li>• <strong>Adults:</strong> 75 minutes vigorous activity per week</li>
              <li>• <strong>Children:</strong> 60 minutes daily physical activity</li>
              <li>• <strong>Older Adults:</strong> Focus on balance and flexibility</li>
            </ul>
          </div>

          <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">Exercise Tips:</h3>
            <ul className="space-y-2">
              <li>• Start slowly and gradually increase intensity</li>
              <li>• Find activities you enjoy for consistency</li>
              <li>• Mix cardio, strength, and flexibility training</li>
              <li>• Stay hydrated during exercise</li>
              <li>• Listen to your body and rest when needed</li>
              <li>• Include warm-up and cool-down routines</li>
            </ul>
          </div>
        </Card>

        {/* Sleep Health */}
        <Card className="p-8 mb-8 dark:bg-neutral-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Sleep Health
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Quality sleep is essential for overall health.
              </p>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6 mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Sleep Recommendations:
            </h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>• <strong>Adults (18-64):</strong> 7-9 hours per night</li>
              <li>• <strong>Teenagers (14-17):</strong> 8-10 hours per night</li>
              <li>• <strong>Children (6-13):</strong> 9-11 hours per night</li>
              <li>• <strong>Older Adults (65+):</strong> 7-8 hours per night</li>
            </ul>
          </div>

          <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">Sleep Tips:</h3>
            <ul className="space-y-2">
              <li>• Maintain a consistent sleep schedule</li>
              <li>• Create a relaxing bedtime routine</li>
              <li>• Keep your bedroom dark, cool, and quiet</li>
              <li>• Avoid screens 1 hour before bed</li>
              <li>• Limit caffeine and alcohol before bedtime</li>
              <li>• Exercise regularly but not too close to bedtime</li>
            </ul>
          </div>
        </Card>

        {/* Mental Health */}
        <Card className="p-8 dark:bg-neutral-800">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Mental Health & Well-being
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Take care of your mental health for overall wellness.
              </p>
            </div>
          </div>

          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-6 mb-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              Mental Health Tips:
            </h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>• Practice mindfulness and meditation</li>
              <li>• Stay connected with friends and family</li>
              <li>• Exercise regularly for mental clarity</li>
              <li>• Get enough sleep and maintain routine</li>
              <li>• Seek professional help when needed</li>
              <li>• Practice gratitude and positive thinking</li>
              <li>• Take breaks from social media</li>
              <li>• Engage in hobbies and activities you enjoy</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💙 Support:</strong> If you're struggling with mental health, reach out to a healthcare provider or mental health professional. You're not alone.
            </p>
          </div>
        </Card>
      </main>
    </div>
  );
}