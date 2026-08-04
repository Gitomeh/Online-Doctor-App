/**
 * EmailJS Service
 * Client-side email sending using EmailJS SDK
 */

import emailjs from '@emailjs/browser';

export interface EmailJSParams {
  to_email: string;
  to_name?: string;
  from_name: string;
  subject: string;
  message: string;
  [key: string]: string | undefined;
}

/**
 * Initialize EmailJS with public key
 */
export function initEmailJS() {
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  if (publicKey && publicKey !== 'your_emailjs_public_key_here') {
    emailjs.init(publicKey);
    console.log('✅ EmailJS initialized successfully');
  } else {
    console.warn('⚠️ EmailJS public key not configured');
  }
}

/**
 * Send email using EmailJS
 */
export async function sendEmailViaEmailJS(
  templateParams: EmailJSParams,
  templateId?: string,
  serviceId?: string
): Promise<boolean> {
  try {
    const serviceIdToUse = serviceId || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateIdToUse = templateId || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

    console.log('📧 EmailJS Configuration:', {
      serviceId: serviceIdToUse,
      templateId: templateIdToUse,
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    });

    console.log('📧 Template Parameters:', templateParams);

    if (!serviceIdToUse || serviceIdToUse === 'your_emailjs_service_id_here') {
      throw new Error('EmailJS Service ID not configured');
    }

    if (!templateIdToUse || templateIdToUse === 'your_emailjs_template_id_here') {
      throw new Error('EmailJS Template ID not configured');
    }

    const response = await emailjs.send(
      serviceIdToUse,
      templateIdToUse,
      templateParams
    );

    console.log('✅ Email sent successfully via EmailJS:', {
      status: response.status,
      text: response.text,
      timestamp: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('❌ Error sending email via EmailJS:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

/**
 * Send welcome email using EmailJS
 */
export async function sendWelcomeEmailViaEmailJS(
  firstName: string,
  email: string
): Promise<boolean> {
  return sendEmailViaEmailJS({
    to_email: email,
    to_name: firstName,
    from_name: 'DocBook',
    subject: 'Welcome to DocBook!',
    message: `Welcome ${firstName}! Thank you for signing up with DocBook.`
  });
}

/**
 * Send booking confirmation using EmailJS
 */
export async function sendBookingConfirmationViaEmailJS(
  userName: string,
  userEmail: string,
  doctorName: string,
  date: string,
  time: string,
  reason: string
): Promise<boolean> {
  return sendEmailViaEmailJS({
    to_email: userEmail,
    to_name: userName,
    from_name: 'DocBook',
    subject: 'Appointment Confirmed',
    message: `Your appointment with ${doctorName} on ${date} at ${time} has been confirmed. Reason: ${reason}`,
    doctor_name: doctorName,
    appointment_date: date,
    appointment_time: time,
    appointment_reason: reason
  });
}

/**
 * Send doctor notification using EmailJS
 */
export async function sendDoctorNotificationViaEmailJS(
  userName: string,
  userEmail: string,
  doctorName: string,
  doctorEmail: string,
  date: string,
  time: string,
  reason: string
): Promise<boolean> {
  const configuredDoctorEmail = process.env.DOCTOR_EMAIL || doctorEmail;
  const doctorTemplateId = process.env.NEXT_PUBLIC_EMAILJS_DOCTOR_TEMPLATE_ID;
  
  console.log('👨‍⚕️ Sending doctor notification to:', configuredDoctorEmail);
  console.log('👨‍⚕️ Patient info:', { userName, userEmail });
  console.log('👨‍⚕️ Using doctor template:', doctorTemplateId);
  
  return sendEmailViaEmailJS({
    to_email: configuredDoctorEmail,
    to_name: doctorName,
    from_name: 'DocBook',
    subject: 'New Appointment Booking',
    message: `New appointment from ${userName} (${userEmail}) on ${date} at ${time}. Reason: ${reason}`,
    patient_name: userName,
    patient_email: userEmail,
    appointment_date: date,
    appointment_time: time,
    appointment_reason: reason
  }, doctorTemplateId);
}
