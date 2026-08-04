"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clearAllUsers } from "@/utils/data/user-management";
import { useRouter } from "next/navigation";

export default function ClearDataPage() {
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_PASSWORD = "12345";

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setMessage("");
    } else {
      setMessage("❌ Incorrect password");
      setPassword("");
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all accounts and data? This action cannot be undone.")) {
      return;
    }

    if (!confirm("This will delete ALL user accounts, appointments, and sessions. Continue?")) {
      return;
    }

    setIsClearing(true);
    setMessage("");

    try {
      clearAllUsers();
      setMessage("✅ All accounts and data have been cleared successfully!");
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setMessage("❌ Failed to clear data. Please try again.");
      console.error("Error clearing data:", error);
    } finally {
      setIsClearing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
        <main className="flex-1 max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Admin Access
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Enter admin password to continue
            </p>
          </div>

          <Card className="p-6 dark:bg-neutral-800">
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Admin Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {message && (
                <div className={`p-3 rounded-lg ${
                  message.startsWith("❌") 
                    ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" 
                    : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                }`}>
                  <p className={`text-sm ${
                    message.startsWith("❌") 
                      ? "text-red-800 dark:text-red-200" 
                      : "text-green-800 dark:text-green-200"
                  }`}>
                    {message}
                  </p>
                </div>
              )}

              <Button
                onClick={handleLogin}
                disabled={!password}
                className="w-full"
                size="lg"
              >
                Access Admin Panel
              </Button>

              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="text-neutral-600 dark:text-neutral-400"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Admin: Clear All Data
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Clear all user accounts, appointments, and session data
          </p>
        </div>

        <Card className="p-6 dark:bg-neutral-800">
          <div className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                ⚠️ Warning
              </h2>
              <p className="text-sm text-red-800 dark:text-red-200">
                This action will permanently delete:
              </p>
              <ul className="mt-2 text-sm text-red-800 dark:text-red-200 list-disc list-inside space-y-1">
                <li>All user accounts</li>
                <li>All appointments</li>
                <li>All active sessions</li>
              </ul>
              <p className="mt-3 text-sm text-red-800 dark:text-red-200 font-medium">
                This action cannot be undone!
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.startsWith("✅") 
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              }`}>
                <p className={`text-sm ${
                  message.startsWith("✅") 
                    ? "text-green-800 dark:text-green-200" 
                    : "text-red-800 dark:text-red-200"
                }`}>
                  {message}
                </p>
              </div>
            )}

            <Button
              onClick={handleClearData}
              disabled={isClearing}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              {isClearing ? "Clearing Data..." : "Clear All Data"}
            </Button>

            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="text-neutral-600 dark:text-neutral-400"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
