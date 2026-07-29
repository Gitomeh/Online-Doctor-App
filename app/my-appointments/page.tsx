"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getCurrentUser, getAppointmentsByUserId, deleteAppointment, logout } from "@/utils/data/user-management";
import { AppointmentCardSkeleton } from "@/components/skeletons/appointment-card-skeleton";
import { useToast } from "@/components/ui/toast";
import { formatDate, formatDateTime } from "@/utils/date";

interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName?: string;
  firstName: string;
  lastName: string;
  date: string;
  reason: string;
  createdAt: string;
}

export default function MyAppointmentsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    setUser({
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
    });

    // Load appointments
    loadAppointments();
  }, [router]);

  const loadAppointments = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const userAppointments = getAppointmentsByUserId(currentUser.id);
    setAppointments(userAppointments);
    setLoading(false);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        // Remove from localStorage
        deleteAppointment(appointmentId);
        
        // Update local state immediately for better UX
        setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
        
        // Show success toast
        showToast("Appointment cancelled successfully.", "success");
      } catch (error) {
        console.error("Error deleting appointment:", error);
        showToast("Failed to cancel appointment. Please try again.", "error");
        // Reload appointments as fallback
        loadAppointments();
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
              My Appointments
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Loading your appointments...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <AppointmentCardSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                My Appointments
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Welcome, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {appointments.length === 0 ? (
          /* No Appointments State */
          <Card className="p-12 text-center dark:bg-neutral-800">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-3">
              No Appointments Yet
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-2 max-w-md mx-auto">
              You haven't booked any appointments yet. Start by finding a doctor and scheduling your first appointment.
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-6">
              Your appointments will appear here once you book them.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/booking">
                <Button>Book an Appointment</Button>
              </Link>
              <Link href="/doctors">
                <Button variant="outline">Browse Doctors</Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Appointments List */
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
              </p>
              <Link href="/booking">
                <Button size="sm">Book New Appointment</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden dark:bg-neutral-800 hover:shadow-lg transition-shadow" role="article" aria-labelledby={`appointment-${appointment.id}`}>
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center" aria-hidden="true">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 id={`appointment-${appointment.id}`} className="text-lg font-semibold text-white">
                            {appointment.doctorName || 'Doctor'}
                          </h3>
                          <p className="text-sm text-white/80">
                            Appointment
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="bg-white/20 hover:bg-white/30 text-white border-0"
                          aria-label={`Cancel appointment with ${appointment.doctorName || 'doctor'}`}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    {/* Date Section */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                          Appointment Date
                        </p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                          {formatDate(appointment.date)}
                        </p>
                      </div>
                    </div>

                    {/* Reason Section */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                          Visit Reason
                        </p>
                        <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2">
                          {appointment.reason}
                        </p>
                      </div>
                    </div>

                    {/* Patient Section */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
                          Patient
                        </p>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                          {appointment.firstName} {appointment.lastName}
                        </p>
                      </div>
                    </div>

                    {/* Booking Date */}
                    <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Booked on {formatDateTime(appointment.createdAt)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}