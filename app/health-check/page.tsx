import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Server Component - this runs on the server
async function HealthCheckPage() {
  let healthData = null;
  let error = null;
  let loadingTime = 0;

  try {
    const startTime = Date.now();
    
    // Fetch sample data from JSONPlaceholder
    const response = await fetch('https://jsonplaceholder.typicode.com/users/1', {
      // Next.js caching options
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      // or use: cache: 'no-store' for no caching
    });

    loadingTime = Date.now() - startTime;

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    healthData = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Health Check
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            System status and connectivity test
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Server Status Card */}
          <Card className="p-6 dark:bg-neutral-800">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                error ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'
              }`}>
                {error ? (
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                  Server Status
                </h2>
                <p className={`text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {error ? 'Connection Failed' : 'System Healthy'}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <p>
                <span className="font-medium">Response Time:</span> {loadingTime}ms
              </p>
              <p>
                <span className="font-medium">Data Source:</span> JSONPlaceholder API
              </p>
              <p>
                <span className="font-medium">Caching:</span> 60 seconds
              </p>
            </div>
          </Card>

          {/* API Response Card */}
          <Card className="p-6 dark:bg-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              API Response
            </h2>
            {error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-900 dark:text-red-100 font-medium mb-2">
                  Error Details
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            ) : healthData ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-900 dark:text-green-100 font-medium mb-2">
                  User Data Retrieved
                </p>
                <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  <p><span className="font-medium">Name:</span> {healthData.name}</p>
                  <p><span className="font-medium">Email:</span> {healthData.email}</p>
                  <p><span className="font-medium">Company:</span> {healthData.company?.name}</p>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  No data available
                </p>
              </div>
            )}
          </Card>

          {/* System Information Card */}
          <Card className="p-6 dark:bg-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              System Information
            </h2>
            <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <p>
                <span className="font-medium">Framework:</span> Next.js 15/16
              </p>
              <p>
                <span className="font-medium">Component Type:</span> Server Component
              </p>
              <p>
                <span className="font-medium">Data Fetching:</span> Server-side
              </p>
              <p>
                <span className="font-medium">Environment:</span> {process.env.NODE_ENV || 'development'}
              </p>
            </div>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-6 p-6 dark:bg-neutral-800">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            Technical Details
          </h2>
          <div className="text-sm text-neutral-600 dark:text-neutral-400 space-y-3">
            <p>
              <span className="font-medium">Server Component Benefits:</span>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Data fetching happens on the server</li>
              <li>Reduced client-side JavaScript bundle</li>
              <li>Improved SEO and initial page load</li>
              <li>Direct database/API access</li>
              <li>Better performance for data-heavy pages</li>
            </ul>
            <p className="mt-4">
              <span className="font-medium">Current Fetch Configuration:</span>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Endpoint: https://jsonplaceholder.typicode.com/users/1</li>
              <li>Cache Strategy: revalidate every 60 seconds</li>
              <li>Error Handling: Try-catch with user-friendly messages</li>
              <li>Loading Time: {loadingTime}ms measured</li>
            </ul>
          </div>
        </Card>
      </main>
    </div>
  );
}

export default HealthCheckPage;