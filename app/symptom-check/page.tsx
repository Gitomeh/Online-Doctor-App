"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { doctors } from "@/utils/data/doctors";
import { analyzeSymptoms } from "@/lib/gemini-service";

export default function AIHealthCheckPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [matchedDoctors, setMatchedDoctors] = useState<any[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      showToast(`File uploaded: ${file.name}`, "success");
    }
  };

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim() && !uploadedFile) {
      showToast("Please describe your symptoms or upload lab results", "error");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Get lab results text if file is uploaded
      let labResultsText = "";
      if (uploadedFile) {
        labResultsText = await uploadedFile.text();
      }

      // Call Gemini API for analysis
      const diseases = await analyzeSymptoms(symptoms, labResultsText);
      setAnalysisResults(diseases);

      // Match doctors based on specialties
      const specialties = diseases.map(d => d.specialty);
      const matched = doctors.filter(d => 
        specialties.some(s => d.specialty.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(d.specialty.toLowerCase()))
      );
      setMatchedDoctors(matched.slice(0, 6)); // Limit to top 6 matches

      showToast("Analysis complete! Showing recommended doctors.", "success");
    } catch (error) {
      console.error("Analysis error:", error);
      showToast("Failed to analyze symptoms. Please try again.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBookAppointment = (doctor: any) => {
    // Store the selected doctor in sessionStorage for the booking page
    sessionStorage.setItem('selectedDoctorId', doctor.id.toString());
    sessionStorage.setItem('selectedDoctorName', doctor.name);
    // Navigate to booking page
    router.push('/booking');
  };

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Smart Health Scan
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Describe your symptoms or upload lab results to get matched with the right specialist
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Symptom Input Section */}
          <Card className="p-6 dark:bg-neutral-800">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Describe Your Symptoms
            </h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Symptom Description
                </label>
                <textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Please describe your symptoms in detail..."
                  className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50 min-h-[150px] resize-y"
                />
              </div>

              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Upload Lab Results (Optional)
                </label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full"
                />
                {uploadedFile && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    ✓ {uploadedFile.name}
                  </p>
                )}
              </div>

              <Button
                onClick={handleAnalyzeSymptoms}
                disabled={isAnalyzing}
                className="w-full"
                size="lg"
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Symptoms"}
              </Button>
            </div>
          </Card>

          {/* Results Section */}
          <Card className="p-6 dark:bg-neutral-800">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Analysis Results
            </h2>

            {!analysisResults ? (
              <div className="text-center py-12 text-neutral-600 dark:text-neutral-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p>Enter your symptoms and click analyze to see results</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Disease Analysis */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
                    Possible Conditions
                  </h3>
                  <div className="space-y-4">
                    {analysisResults.map((disease: any, index: number) => (
                      <div
                        key={index}
                        className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-5 border-l-4 border-primary-500"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-neutral-900 dark:text-neutral-50 mb-1">
                              {disease.name}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                {Math.round(disease.probability * 100)}% probability
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                disease.urgency === 'Emergency' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                disease.urgency === 'Urgent' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                disease.urgency === 'Soon' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              }`}>
                                {disease.urgency}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                disease.severity === 'Severe' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                disease.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {disease.severity}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                          {disease.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <h5 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Related Symptoms:</h5>
                            <ul className="text-xs text-neutral-600 dark:text-neutral-400 list-disc list-inside">
                              {disease.symptoms?.slice(0, 4).map((symptom: string, i: number) => (
                                <li key={i}>{symptom}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Possible Causes:</h5>
                            <ul className="text-xs text-neutral-600 dark:text-neutral-400 list-disc list-inside">
                              {disease.possibleCauses?.slice(0, 3).map((cause: string, i: number) => (
                                <li key={i}>{cause}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">Recommended Actions:</h5>
                          <ul className="text-xs text-neutral-600 dark:text-neutral-400 list-disc list-inside">
                            {disease.recommendedActions?.map((action: string, i: number) => (
                              <li key={i}>{action}</li>
                            ))}
                          </ul>
                        </div>
                        
                        {disease.symptomsToWatch && disease.symptomsToWatch.length > 0 && (
                          <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 mb-2">
                            <h5 className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">⚠️ Symptoms to Watch:</h5>
                            <ul className="text-xs text-red-600 dark:text-red-300 list-disc list-inside">
                              {disease.symptomsToWatch.map((symptom: string, i: number) => (
                                <li key={i}>{symptom}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          Recommended Specialist: {disease.specialty}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matched Doctors */}
                {matchedDoctors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
                      Recommended Doctors
                    </h3>
                    <div className="space-y-3">
                      {matchedDoctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
                                {doctor.name}
                              </h4>
                              <p className="text-sm text-primary-600 dark:text-primary-400">
                                {doctor.specialty}
                              </p>
                              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                {doctor.hospital}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleBookAppointment(doctor)}
                            >
                              Book
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}