'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Symptom check error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
          Something went wrong
        </h2>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          We encountered an unexpected error while processing your symptom check. This doesn't affect your medical records or appointments.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={reset}
            className="w-full bg-primary-600 hover:bg-primary-700"
            aria-label="Try again"
          >
            Try Again
          </Button>
          
          <Link href="/">
            <Button
              variant="outline"
              className="w-full border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              aria-label="Return to home page"
            >
              Return to Home
            </Button>
          </Link>
        </div>
        
        <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-6">
          If this problem persists, please contact support or try refreshing the page.
        </p>
      </div>
    </div>
  );
}
