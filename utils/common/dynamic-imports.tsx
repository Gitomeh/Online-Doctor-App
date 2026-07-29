/**
 * Dynamic imports for code splitting
 * Lazy load heavy components to improve initial load performance
 */
import dynamic from 'next/dynamic';

/**
 * Lazy load the appointment booking form
 */
export const AppointmentBookingForm = dynamic(
  () => import('@/components/forms/appointment-booking-form').then(mod => ({ default: mod.AppointmentBookingForm })),
  {
    loading: () => <p>Loading booking form...</p>,
    ssr: false,
  }
);

/**
 * Lazy load the doctor list component
 */
export const DoctorList = dynamic(
  () => import('@/components/doctors/doctor-list').then(mod => ({ default: mod.DoctorList })),
  {
    loading: () => <p>Loading doctors...</p>,
    ssr: false,
  }
);

/**
 * Lazy load the health check component
 */
export const HealthCheck = dynamic(
  () => import('@/app/health-check/page').then(mod => ({ default: mod.default })),
  {
    loading: () => <p>Loading health check...</p>,
    ssr: false,
  }
);