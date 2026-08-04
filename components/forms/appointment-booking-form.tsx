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
import { sendBookingConfirmationViaEmailJS, sendDoctorNotificationViaEmailJS, initEmailJS } from "@/lib/emailjs-service";

// Doctor email configuration - all doctor notifications go to this email
const DOCTOR_EMAIL = 'YOUR_DOCTOR_EMAIL@example.com';

interface AppointmentFormData {
  phoneNumber: string;
  idNumber: string;
  date: string;
  time: string;
  reason: string;
}

interface StoredAppointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  idNumber?: string;
  date: string;
  time: string;
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
  const [currentUser, setCurrentUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [formData, setFormData] = useState<AppointmentFormData>({
    phoneNumber: "",
    idNumber: "",
    date: "",
    time: "",
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
      if (!currentUser) {
        // Redirect to sign-up page if not authenticated
        router.push("/sign-up");
        return;
      }
      // Set current user for form display
      setCurrentUser({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      });
      
      // Initialize EmailJS
      initEmailJS();
    } catch (error) {
      console.error("Error checking authentication:", error);
      // Redirect to sign-up page on error
      router.push("/sign-up");
    }
  }, [router]);

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

  // Save appointment to localStorage (this function is now handled inline in handleSubmit)
  const saveAppointmentToStorage = (data: AppointmentFormData): void => {
    // This function is now handled inline in handleSubmit to include currentUser data
    console.log('saveAppointmentToStorage called with:', data);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AppointmentFormData> = {};
    setDuplicateError(null);

    // Phone number validation
    if (!isRequired(formData.phoneNumber)) {
      newErrors.phoneNumber = VALIDATION_ERRORS.REQUIRED("Phone number");
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = "Please enter a valid phone number (10-15 digits)";
    }

    // ID number validation
    if (!isRequired(formData.idNumber)) {
      newErrors.idNumber = VALIDATION_ERRORS.REQUIRED("ID number");
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
      }
    }

    // Time validation
    if (!isRequired(formData.time)) {
      newErrors.time = VALIDATION_ERRORS.REQUIRED("Preferred time");
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
      // Get current user info
      const currentUser = getCurrentUser();
      const patientEmail = currentUser?.email || 'user@example.com';
      const patientName = `${currentUser?.firstName} ${currentUser?.lastName}`;

      // Save to localStorage with phone and ID info
      const appointmentData = {
        ...formData,
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || ''
      };
      
      // Manually save to localStorage
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const newAppointment: StoredAppointment = {
        id: Date.now().toString(),
        userId,
        doctorId,
        doctorName,
        firstName: currentUser?.firstName || '',
        lastName: currentUser?.lastName || '',
        phoneNumber: formData.phoneNumber,
        idNumber: formData.idNumber,
        date: formData.date,
        time: formData.time === 'morning' ? '8:00 AM - 12:00 PM' : '2:00 PM - 5:00 PM',
        reason: formData.reason,
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

      // Use single doctor email for all notifications
      const doctorEmail = DOCTOR_EMAIL;

      // Send confirmation email to user
      try {
        await sendBookingConfirmationViaEmailJS(
          patientName,
          patientEmail,
          doctorName || 'Selected Doctor',
          formData.date,
          formData.time === 'morning' ? '8:00 AM - 12:00 PM' : '2:00 PM - 5:00 PM',
          formData.reason
        );
        showToast("Confirmation email sent!", "info");
      } catch (emailError) {
        console.error("Failed to send user email:", emailError);
        // Continue anyway as email sending is not critical
      }

      // Send notification email to doctor
      try {
        await sendDoctorNotificationViaEmailJS(
          patientName,
          patientEmail,
          doctorName || 'Selected Doctor',
          doctorEmail,
          formData.date,
          formData.time === 'morning' ? '8:00 AM - 12:00 PM' : '2:00 PM - 5:00 PM',
          formData.reason
        );
        showToast("Doctor notification sent!", "info");
      } catch (emailError) {
        console.error("Failed to send doctor email:", emailError);
        // Continue anyway as email sending is not critical
      }

      // Save booking to Google Sheets via API
      try {
        const response = await fetch('/api/google-sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientName: patientName,
            patientEmail: patientEmail,
            phoneNumber: formData.phoneNumber,
            idNumber: formData.idNumber,
            doctorName: doctorName || 'Selected Doctor',
            date: formData.date,
            time: formData.time === 'morning' ? '8:00 AM - 12:00 PM' : '2:00 PM - 5:00 PM',
            reason: formData.reason
          }),
        });

        if (response.ok) {
          showToast("Booking saved to records!", "info");
        } else {
          console.error("Failed to save to Google Sheets:", await response.text());
        }
      } catch (sheetsError) {
        console.error("Failed to save to Google Sheets:", sheetsError);
        // Continue anyway as Sheets saving is not critical
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
        phoneNumber: "",
        idNumber: "",
        date: "",
        time: "",
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
            {/* Patient Name (Read-only from logged-in user) */}
            <div className="bg-neutral-100 dark:bg-neutral-700 rounded-lg p-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Patient Name</p>
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
            </div>

            {/* Contact Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Phone Number"
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                error={errors.phoneNumber}
                required
              />

              <FormField
                label="ID Number"
                id="idNumber"
                name="idNumber"
                type="text"
                placeholder="Enter ID number"
                value={formData.idNumber}
                onChange={handleInputChange}
                error={errors.idNumber}
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

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Preferred Time <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.time === 'morning' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500'
                }`}>
                  <input
                    type="radio"
                    name="time"
                    value="morning"
                    checked={formData.time === 'morning'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-50">Morning</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">8:00 AM - 12:00 PM</p>
                  </div>
                </label>
                <label className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.time === 'afternoon' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500'
                }`}>
                  <input
                    type="radio"
                    name="time"
                    value="afternoon"
                    checked={formData.time === 'afternoon'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-50">Afternoon</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">2:00 PM - 5:00 PM</p>
                  </div>
                </label>
              </div>
              {errors.time && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.time}</p>
              )}
            </div>

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
