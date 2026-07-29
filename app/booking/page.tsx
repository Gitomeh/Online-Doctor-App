"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doctors } from "@/utils/data/doctors";
import { AppointmentBookingForm } from "@/components/forms/appointment-booking-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/utils/data/user-management";
import { OptimizedImage } from "@/components/ui/optimized-image";

export default function BookingPage() {
  const router = useRouter();
  const [selectedDoctor, setSelectedDoctor] = useState<{ id: number; name: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({
        id: currentUser.id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
      });
    }
  }, []);

  // Get unique specialties
  const specialties = ["All", ...Array.from(new Set(doctors.map(d => d.specialty)))];

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleDoctorSelect = (doctor: { id: number; name: string }) => {
    setSelectedDoctor(doctor);
    setShowForm(true);
  };

  const handleBackToSelection = () => {
    setShowForm(false);
    setSelectedDoctor(null);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Appointment booking submitted:", data);
    // Reset after successful submission to show confirmation
    setShowForm(false);
    setSelectedDoctor(null);
  };

  const handleBookingSuccess = () => {
    // After successful booking, redirect to My Appointments
    setTimeout(() => {
      router.push("/my-appointments");
    }, 2000);
  };

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Book Appointment
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Select a doctor and schedule your appointment
          </p>
        </div>

        {!showForm ? (
          /* Doctor Selection */
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 dark:bg-neutral-800">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Select a Doctor
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Choose from our list of qualified healthcare professionals
              </p>

              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Search Doctors
                  </label>
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by name, specialty, or hospital..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Filter by Specialty
                  </label>
                  <select
                    id="specialty"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  >
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <Card
                      key={doctor.id}
                      className="p-4 hover:shadow-lg transition-shadow cursor-pointer dark:bg-neutral-700"
                      onClick={() => handleDoctorSelect({ id: doctor.id, name: doctor.name })}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-neutral-200 flex-shrink-0 overflow-hidden relative">
                          <OptimizedImage
                            src={doctor.image}
                            alt={doctor.name}
                            fill
                            sizes="64px"
                            priority
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 truncate">
                            {doctor.name}
                          </h3>
                          <p className="text-sm text-primary-600 dark:text-primary-400 truncate">
                            {doctor.specialty}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                            {doctor.hospital}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-neutral-600 dark:text-neutral-400">
                    No doctors found matching your search criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={handleBackToSelection}
              className="mb-4"
            >
              ← Back to Doctor Selection
            </Button>

            <div className="bg-white rounded-lg shadow-md p-6 dark:bg-neutral-800">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                  Booking with {selectedDoctor?.name}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Complete the form below to schedule your appointment
                </p>
              </div>

              <AppointmentBookingForm
                doctorId={selectedDoctor?.id.toString() || ""}
                doctorName={selectedDoctor?.name}
                userId={user?.id}
                onSubmit={handleFormSubmit}
                onBookingSuccess={handleBookingSuccess}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}