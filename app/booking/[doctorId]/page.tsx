import { redirect } from 'next/navigation';

export default function DoctorBookingRedirect({ params }: { params: Promise<{ doctorId: string }> }) {
  // Redirect to the main booking page
  redirect('/booking');
}