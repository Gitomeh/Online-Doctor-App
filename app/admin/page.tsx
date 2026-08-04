"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

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

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
        <main className="flex-1 max-w-md mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Admin Dashboard
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
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
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
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Manage appointments, doctors, and system data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 dark:bg-neutral-800 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/appointments")}>
            <div className="text-center">
              <div className="text-4xl mb-4">📅</div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Appointments
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                View, cancel, and reschedule appointments
              </p>
            </div>
          </Card>

          <Card className="p-6 dark:bg-neutral-800 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/doctors")}>
            <div className="text-center">
              <div className="text-4xl mb-4">👨‍⚕️</div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Doctors
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Add, edit, and remove doctors
              </p>
            </div>
          </Card>

          <Card className="p-6 dark:bg-neutral-800 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/users")}>
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Users
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                View and manage user accounts
              </p>
            </div>
          </Card>

          <Card className="p-6 dark:bg-neutral-800 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push("/admin/clear-data")}>
            <div className="text-center">
              <div className="text-4xl mb-4">🗑️</div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Clear Data
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Delete all accounts and data
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="text-neutral-600 dark:text-neutral-400"
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
}
