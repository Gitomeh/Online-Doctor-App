"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doctors } from '@/utils/data/doctors';

export default function DoctorBookingRedirect({ params }: { params: Promise<{ doctorId: string }> }) {
  const router = useRouter();

  useEffect(() => {
    const initBooking = async () => {
      const { doctorId } = await params;
      const doctor = doctors.find(d => d.id === parseInt(doctorId));
      
      if (doctor) {
        // Store the selected doctor in sessionStorage for the booking page
        sessionStorage.setItem('selectedDoctorId', doctorId);
        sessionStorage.setItem('selectedDoctorName', doctor.name);
        router.push('/booking');
      } else {
        router.push('/booking');
      }
    };

    initBooking();
  }, [params, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600 dark:text-neutral-400">Loading booking...</p>
      </div>
    </div>
  );
}