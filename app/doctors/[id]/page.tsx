import Link from "next/link";
import { Button } from "@/components/ui/button";
import { doctors } from "@/utils/data/doctors";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  image: string;
  email: string;
  biography: string;
}

interface DoctorDetailsPageProps {
  params: Promise<{ id: string }>;
}

function DoctorDetailsContent({ doctor }: { doctor: Doctor }) {
  "use client";
  
  const handleSaveDoctor = () => {
    // Implement save doctor functionality
    alert("Doctor saved to your favorites!");
  };

  const handleBookAppointment = () => {
    // Navigate to booking page with doctor selection
    window.location.href = `/booking`;
  };

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/doctors" className="text-primary-600 hover:text-primary-700">
            ← Back to Doctors
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 dark:bg-neutral-800">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-32 h-32 rounded-full bg-neutral-200 flex-shrink-0 overflow-hidden">
              <OptimizedImage
                src={doctor.image}
                alt={doctor.name}
                fill
                sizes="128px"
                priority
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
                {doctor.name}
              </h1>
              <p className="text-lg text-primary-600 mb-4">
                {doctor.specialty}
              </p>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-400">★★★★★</span>
                  <span className="ml-2 text-neutral-600 dark:text-neutral-400">
                    4.9 (120 reviews)
                  </span>
                </div>
              </div>
              <div className="flex gap-4">
                <Link href="/booking">
                  <Button>Book Appointment</Button>
                </Link>
                <Button variant="outline" onClick={handleSaveDoctor}>Save Doctor</Button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                About
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                {doctor.biography}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Information
              </h2>
              <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
                <li>• Hospital: {doctor.hospital}</li>
                <li>• Email: {doctor.email}</li>
                <li>• Specialty: {doctor.specialty}</li>
                <li>• Languages: English, Spanish</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Availability
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day) => (
                  <div key={day} className="text-center">
                    <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      {day}
                    </div>
                    <div className="space-y-1">
                      <div className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs cursor-pointer hover:bg-primary-200">
                        9:00 AM
                      </div>
                      <div className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs cursor-pointer hover:bg-primary-200">
                        10:00 AM
                      </div>
                      <div className="px-2 py-1 bg-neutral-100 text-neutral-500 rounded text-xs">
                        11:00 AM
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default async function DoctorDetailsPage({ params }: DoctorDetailsPageProps) {
  const { id } = await params;
  const doctorId = parseInt(id);
  const doctor = doctors.find((d) => d.id === doctorId);

  if (!doctor) {
    return (
      <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link href="/doctors" className="text-primary-600 hover:text-primary-700">
              ← Back to Doctors
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8 dark:bg-neutral-800 text-center">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
              Doctor Not Found
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              The doctor you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/doctors">
              <Button>Browse All Doctors</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return <DoctorDetailsContent doctor={doctor} />;
}
