"use client";

import { Chat } from "@/components/chat/Chat";

export default function AIHealthCheckPage() {
  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            MediAI Health Assessment
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Describe your symptoms in natural language and receive AI-powered health insights
          </p>
        </div>

        <Chat />
      </main>
    </div>
  );
}