"use client";

import { useState, useRef } from "react";
import { Chat } from "@/components/chat/Chat";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Tesseract from 'tesseract.js';

export default function AIHealthCheckPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<string>("");
  const chatRef = useRef<any>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisResults("");

    try {
      // Process files and extract content
      const fileContents = await Promise.all(
        uploadedFiles.map(async (file) => {
          if (file.type.startsWith('image/')) {
            // Use OCR to extract text from images
            const { data: { text } } = await Tesseract.recognize(
              file,
              'eng',
              { logger: m => console.log(m) }
            );
            return `[Image: ${file.name}]\nExtracted Text:\n${text}`;
          } else if (file.type === 'application/pdf') {
            return `[PDF: ${file.name} (${(file.size / 1024).toFixed(2)} KB) - Type: ${file.type}]`;
          } else {
            const text = await file.text();
            return `[File: ${file.name}]\nContent:\n${text}`;
          }
        })
      );

      // Extract key points for summary (3 lines max)
      const keyPoints = await Promise.all(
        uploadedFiles.map(async (file) => {
          if (file.type.startsWith('image/')) {
            const { data: { text } } = await Tesseract.recognize(file, 'eng');
            // Extract first few meaningful lines from OCR text
            const lines = text.split('\n').filter(line => line.trim().length > 10).slice(0, 3);
            return `${file.name}: ${lines.join('; ')}`;
          } else {
            const sizeKB = (file.size / 1024).toFixed(2);
            const fileType = file.type.split('/')[1]?.toUpperCase() || 'FILE';
            return `${file.name} (${fileType}, ${sizeKB}KB)`;
          }
        })
      );

      setAnalysisResults(keyPoints.join(' | '));

      // Create a message with the file information
      const fileMessage = `I have uploaded ${uploadedFiles.length} document(s) for analysis:\n\n${fileContents.join('\n\n')}\n\nPlease analyze these documents and provide medical insights and recommendations.`;

      // Send to chat by adding it as a user message
      const chatHistory = localStorage.getItem('mediai-chat-history');
      const existingMessages = chatHistory ? JSON.parse(chatHistory) : [];
      
      const newMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: fileMessage,
        createdAt: new Date()
      };

      const updatedMessages = [...existingMessages, newMessage];
      localStorage.setItem('mediai-chat-history', JSON.stringify(updatedMessages));

      // Trigger a page reload to refresh the chat with the new message
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      console.error('Error analyzing files:', error);
      alert('Error analyzing files. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            MediAI Health Assessment
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Upload your lab results or describe your symptoms for AI-powered health insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Document Upload */}
          <div className="flex flex-col">
            <Card className="flex-1 p-6 bg-white dark:bg-neutral-800 shadow-lg">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                  Upload Lab Results
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Upload your medical documents, lab reports, or test results for analysis
                </p>
              </div>

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-neutral-300 dark:border-neutral-600 hover:border-primary-400 dark:hover:border-primary-500"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                    className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-2">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    PDF, JPG, PNG, DOC, DOCX, TXT (Max 10MB each)
                  </p>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-50 mb-3">
                    Uploaded Files
                  </h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <svg
                            className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm text-neutral-900 dark:text-neutral-50 truncate">
                            {file.name}
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 flex-shrink-0">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          aria-label={`Remove ${file.name}`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button - Always visible */}
              <Button
                onClick={handleAnalyze}
                disabled={uploadedFiles.length === 0 || isAnalyzing}
                className="w-full mt-6 bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Uploaded Documents'}
              </Button>

              {/* Analysis Results */}
              {analysisResults && (
                <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                  <h4 className="text-sm font-semibold text-primary-900 dark:text-primary-100 mb-2">
                    Analysis Summary
                  </h4>
                  <p className="text-sm text-primary-800 dark:text-primary-200 line-clamp-3">
                    {analysisResults}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Chat Interface */}
          <div className="flex flex-col">
            <Chat />
          </div>
        </div>
      </main>
    </div>
  );
}