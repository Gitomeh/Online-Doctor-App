"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { getAppointments, deleteAppointment } from "@/utils/data/user-management";
import { getUsers } from "@/utils/data/user-management";

export default function AdminAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAppointments(getAppointments());
    setUsers(getUsers());
    setLoading(false);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      deleteAppointment(appointmentId);
      setMessage("✅ Appointment cancelled successfully");
      loadData();
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleRescheduleAppointment = () => {
    if (!selectedAppointment || !newDate || !newTime) {
      setMessage("❌ Please fill in all fields");
      return;
    }

    const updatedAppointments = appointments.map(apt => {
      if (apt.id === selectedAppointment.id) {
        return {
          ...apt,
          date: newDate,
          time: newTime
        };
      }
      return apt;
    });

    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    setMessage("✅ Appointment rescheduled successfully");
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setNewDate("");
    setNewTime("");
    loadData();
    setTimeout(() => setMessage(""), 3000);
  };

  const getUserById = (userId: string) => {
    return users.find(u => u.id === userId);
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
            Manage Appointments
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            View, cancel, and reschedule patient appointments
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

        {appointments.length === 0 ? (
          <Card className="p-8 dark:bg-neutral-800">
            <p className="text-center text-neutral-600 dark:text-neutral-400">
              No appointments found
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              const user = getUserById(appointment.userId);
              return (
                <Card key={appointment.id} className="p-6 dark:bg-neutral-800">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                        {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
                      </h3>
                      <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                        <p><strong>Doctor:</strong> {appointment.doctorName || 'Not specified'}</p>
                        <p><strong>Date:</strong> {appointment.date}</p>
                        <p><strong>Time:</strong> {appointment.time || 'Not specified'}</p>
                        <p><strong>Reason:</strong> {appointment.reason}</p>
                        {appointment.phoneNumber && <p><strong>Phone:</strong> {appointment.phoneNumber}</p>}
                        {appointment.idNumber && <p><strong>ID:</strong> {appointment.idNumber}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setNewDate(appointment.date);
                          setNewTime(appointment.time || '');
                          setShowRescheduleModal(true);
                        }}
                      >
                        Reschedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="text-neutral-600 dark:text-neutral-400"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="p-6 dark:bg-neutral-800 max-w-md w-full">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Reschedule Appointment
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    New Time
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  >
                    <option value="">Select time</option>
                    <option value="8:00 AM - 12:00 PM">Morning (8:00 AM - 12:00 PM)</option>
                    <option value="2:00 PM - 5:00 PM">Afternoon (2:00 PM - 5:00 PM)</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleRescheduleAppointment}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRescheduleModal(false);
                      setSelectedAppointment(null);
                      setNewDate("");
                      setNewTime("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
