/**
 * Email Configuration
 * Centralized email settings for the application
 */

// Doctor email - all doctor notifications go to this email
export const DOCTOR_EMAIL = process.env.DOCTOR_EMAIL || 'YOUR_DOCTOR_EMAIL@example.com';

// Email service configuration
export const EMAIL_CONFIG = {
  // Default sender email
  fromEmail: process.env.EMAIL_FROM || 'noreply@docbook.com',
  fromName: process.env.EMAIL_FROM_NAME || 'DocBook',
  
  // Email service provider (emailjs, sendgrid, mailgun, ses, etc.)
  provider: process.env.EMAIL_PROVIDER || 'emailjs',
  
  // EmailJS Configuration
  emailjs: {
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
    doctorTemplateId: process.env.NEXT_PUBLIC_EMAILJS_DOCTOR_TEMPLATE_ID || ''
  },
  
  // Email templates
  templates: {
    bookingConfirmation: 'booking-confirmation',
    doctorNotification: 'doctor-notification',
    welcome: 'welcome-email'
  }
};

/**
 * Get patient email from current user
 * Falls back to a default if no user is logged in
 */
export function getPatientEmail(userEmail?: string): string {
  return userEmail || process.env.DEFAULT_PATIENT_EMAIL || 'patient@example.com';
}