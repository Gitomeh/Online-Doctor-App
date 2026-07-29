"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getCurrentUser, saveAppointment as saveAppointmentToStorage } from "@/utils/data/user-management";
import { useToast } from "@/components/ui/toast";
import { FormField, TextAreaField, FormActions, ErrorAlert } from "@/components/forms/form-components";
import { isRequired, hasMinLength, isNotPastDate, VALIDATION_ERRORS } from "@/utils/validation";
import { getMinDate } from "@/utils/date";
import { sendUserBookingConfirmation, sendDoctorBookingNotification } from "@/utils/common/email-service";
import { doctors } from "@/utils/data/doctors";

interface AppointmentFormData {
  firstName: string;
  lastName: string;
  date: string;
  reason: string;
}

interface StoredAppointment {
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

interface AppointmentBookingFormProps {
  doctorId: string;
  doctorName?: string;
  userId?: string;
  onSubmit?: (data: AppointmentFormData) => void;
  onBookingSuccess?: () => void;
}

export function AppointmentBookingForm({
  doctorId,
  doctorName,
  userId,
  onSubmit,
  onBookingSuccess,
}: AppointmentBookingFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<AppointmentFormData>({
    firstName: "",
    lastName: "",
    date: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Partial<AppointmentFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser && userId) {
        // Only redirect if userId is provided (meaning we need authentication)
        router.push("/login");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      // Continue without authentication if check fails
    }
  }, [router, userId]);

  // Load existing appointments from localStorage on component mount
  const getExistingAppointments = (): StoredAppointment[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('appointments');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading appointments from localStorage:', error);
      return [];
    }
  };

  // Check for duplicate appointments
  const checkForDuplicate = (doctorId: string, date: string): boolean => {
    if (!userId) return false;
    
    const existingAppointments = getExistingAppointments();
    return existingAppointments.some(
      (appointment) => 
        appointment.userId === userId &&
        appointment.doctorId === doctorId && 
        appointment.date === date
    );
  };

  // Save appointment to localStorage
  // Save appointment to localStorage
  const saveAppointmentToStorage = (data: AppointmentFormData): void => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const newAppointment: StoredAppointment = {
      id: Date.now().toString(),
      userId,
      doctorId,
      doctorName,
      firstName: data.firstName,
      lastName: data.lastName,
      date: data.date,
      reason: data.reason,
      createdAt: new Date().toISOString(),
    };

    const existingAppointments = getExistingAppointments();
    const updatedAppointments = [...existingAppointments, newAppointment];
    
    try {
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    } catch (error) {
      console.error('Error saving appointment to localStorage:', error);
      throw new Error('Failed to save appointment');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AppointmentFormData> = {};
    setDuplicateError(null);

    // First name validation
    if (!isRequired(formData.firstName)) {
      newErrors.firstName = VALIDATION_ERRORS.REQUIRED("First name");
    }

    // Last name validation
    if (!isRequired(formData.lastName)) {
      newErrors.lastName = VALIDATION_ERRORS.REQUIRED("Last name");
    }

    // Date validation
    if (!isRequired(formData.date)) {
      newErrors.date = VALIDATION_ERRORS.REQUIRED("Appointment date");
    } else if (!isNotPastDate(formData.date)) {
      newErrors.date = VALIDATION_ERRORS.PAST_DATE;
    } else {
      // Duplicate appointment validation
      if (checkForDuplicate(doctorId, formData.date)) {
        setDuplicateError(VALIDATION_ERRORS.DUPLICATE_APPOINTMENT);
        newErrors.date = "Duplicate appointment";
      }
    }

    // Reason validation
    if (!isRequired(formData.reason)) {
      newErrors.reason = VALIDATION_ERRORS.REQUIRED("Reason for visit");
    } else if (!hasMinLength(formData.reason, 10)) {
      newErrors.reason = VALIDATION_ERRORS.MIN_LENGTH("Reason", 10);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Save to localStorage
      saveAppointmentToStorage(formData);

      // Get doctor email from doctors data
      const doctor = doctors.find(d => d.id === parseInt(doctorId));
      const doctorEmail = doctor?.email || 'doctor@example.com';

      // Send confirmation email to user
      try {
        await sendUserBookingConfirmation({
          userName: `${formData.firstName} ${formData.lastName}`,
          userEmail: getCurrentUser()?.email || 'user@example.com',
          doctorName: doctorName || 'Selected Doctor',
          doctorEmail: doctorEmail,
          date: formData.date,
          time: 'Not specified', // You may want to add time field to form
          reason: formData.reason
        });
        showToast("Confirmation email sent!", "info");
      } catch (emailError) {
        console.error("Failed to send user email:", emailError);
        // Continue anyway as email sending is not critical
      }

      // Send notification email to doctor
      try {
        await sendDoctorBookingNotification({
          userName: `${formData.firstName} ${formData.lastName}`,
          userEmail: getCurrentUser()?.email || 'user@example.com',
          doctorName: doctorName || 'Selected Doctor',
          doctorEmail: doctorEmail,
          date: formData.date,
          time: 'Not specified',
          reason: formData.reason
        });
        showToast("Doctor notification sent!", "info");
      } catch (emailError) {
        console.error("Failed to send doctor email:", emailError);
        // Continue anyway as email sending is not critical
      }

      // Call parent callback if provided
      if (onSubmit) {
        onSubmit(formData);
      }

      // Show success toast
      showToast("Appointment booked successfully!", "success");

      // Show confirmation
      setShowConfirmation(true);

      // Reset form after successful submission
      setFormData({
        firstName: "",
        lastName: "",
        date: "",
        reason: "",
      });

      // Call success callback if provided
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error) {
      console.error('Error during booking:', error);
      showToast("Failed to save appointment. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof AppointmentFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    
    // Clear duplicate error when user changes date
    if (name === 'date' && duplicateError) {
      setDuplicateError(null);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Duplicate Error Alert */}
        {duplicateError && (
          <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" role="alert" aria-live="assertive">
            <p className="text-sm text-red-900 dark:text-red-100 font-medium">
              ⚠️ {duplicateError}
            </p>
          </Card>
        )}

        {/* Doctor Information */}
        {doctorName && (
          <Card className="p-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800" role="region" aria-label="Doctor information">
            <p className="text-sm text-primary-900 dark:text-primary-100">
              <span className="font-semibold">Booking with:</span> {doctorName}
            </p>
          </Card>
        )}

        {/* Patient Information Section */}
        <Card className="p-6 dark:bg-neutral-800">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            Patient Information
          </h2>
          
          <div className="space-y-4">
            {/* Name Fields - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
              />

              <FormField
                label="Last Name"
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
              />
            </div>
          </div>
        </Card>

        {/* Appointment Details Section */}
        <Card className="p-6 dark:bg-neutral-800">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            Appointment Details
          </h2>

          <div className="space-y-4">
            {/* Date Selection */}
            <FormField
              label="Preferred Date"
              id="date"
              name="date"
              type="date"
              placeholder="Select a date for your appointment"
              value={formData.date}
              onChange={handleInputChange}
              error={errors.date}
              required
              min={getMinDate()}
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Select a date for your appointment
            </p>

            {/* Visit Reason */}
            <TextAreaField
              label="Reason for Visit"
              id="reason"
              name="reason"
              placeholder="Please describe the reason for your visit (symptoms, concerns, etc.)"
              value={formData.reason}
              onChange={handleInputChange}
              error={errors.reason}
              required
              minLength={10}
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Minimum 10 characters
            </p>
          </div>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none w-full sm:w-auto"
          >
            {isSubmitting ? "Submitting..." : "Book Appointment"}
          </Button>
        </div>

        {/* Hidden doctor info for submission */}
        <input type="hidden" name="doctorId" value={doctorId} />
      </form>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full bg-white dark:bg-neutral-800">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                Appointment Booked Successfully!
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Your appointment has been scheduled and saved to your device.
              </p>
              <Button onClick={closeConfirmation} className="w-full">
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
