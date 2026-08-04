"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getUsers, deleteUser } from "@/utils/data/user-management";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setUsers(getUsers());
    setLoading(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This will also delete all their appointments.")) {
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Also delete user's appointments
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      const updatedAppointments = appointments.filter((apt: any) => apt.userId !== userId);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      
      setMessage("✅ User and their appointments deleted successfully");
      loadUsers();
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Manage Users
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            View and manage user accounts
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
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

        {users.length === 0 ? (
          <Card className="p-8 dark:bg-neutral-800">
            <p className="text-center text-neutral-600 dark:text-neutral-400">
              No users found
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <Card key={user.id} className="p-6 dark:bg-neutral-800">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                      {user.firstName} {user.lastName}
                    </h3>
                    <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Delete User
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="text-neutral-600 dark:text-neutral-400"
          >
            Back to Dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
