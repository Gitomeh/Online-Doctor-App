/**
 * Real Email Service using API route
 * This replaces the mock email service with actual email sending via server API
 */

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface WelcomeEmailData {
  firstName: string;
  email: string;
}

export interface BookingConfirmationData {
  userName: string;
  userEmail: string;
  doctorName: string;
  doctorEmail: string;
  date: string;
  time: string;
  reason: string;
}

/**
 * Send real email using API route
 */
export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error('Failed to send email via API');
    }
    
    const result = await response.json();
    console.log('✅ Email sent successfully via API:', result);
    
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  const { firstName, email } = data;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to DocBook</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px;">🏥 DocBook</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Healthcare Made Simple</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Welcome to DocBook, ${firstName}! 👋</h2>
          
          <p style="color: #666; margin-bottom: 20px;">
            Thank you for signing up with DocBook. We're excited to help you take control of your healthcare journey.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
            <ul style="color: #666; padding-left: 20px;">
              <li>Browse our network of qualified doctors</li>
              <li>Book appointments at your convenience</li>
              <li>Manage your health records securely</li>
              <li>Access health tips and resources</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/booking" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Book Your First Appointment
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            If you have any questions, feel free to reach out to our support team.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 DocBook. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: email,
    subject: 'Welcome to DocBook! 🎉',
    html,
    text: `Welcome to DocBook, ${firstName}! Thank you for signing up. We're excited to help you take control of your healthcare journey.`
  });
}

/**
 * Send booking confirmation to user
 */
export async function sendUserBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
  const { userName, userEmail, doctorName, date, time, reason } = data;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Appointment Confirmation - DocBook</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px;">🏥 DocBook</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Healthcare Made Simple</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Appointment Confirmed! ✅</h2>
          
          <p style="color: #666; margin-bottom: 20px;">
            Hi ${userName}, your appointment has been successfully booked. Here are the details:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
            <h3 style="color: #333; margin-top: 0;">Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Doctor:</td>
                <td style="padding: 8px 0; color: #333;">${doctorName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0; color: #333;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Time:</td>
                <td style="padding: 8px 0; color: #333;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Reason:</td>
                <td style="padding: 8px 0; color: #333;">${reason}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ffc107;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Reminder:</strong> Please arrive 15 minutes before your appointment time. Bring your ID and insurance information if applicable.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/my-appointments" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View My Appointments
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center; margin-top: 30px;">
            Need to reschedule? Contact us or manage your appointment in your dashboard.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 DocBook. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: userEmail,
    subject: 'Appointment Confirmed - DocBook',
    html,
    text: `Your appointment with ${doctorName} on ${date} at ${time} has been confirmed. Reason: ${reason}`
  });
}

/**
 * Send booking notification to doctor
 */
export async function sendDoctorBookingNotification(data: BookingConfirmationData): Promise<boolean> {
  const { userName, userEmail, doctorName, doctorEmail, date, time, reason } = data;
  
  // Use the configured doctor email from environment variable
  const configuredDoctorEmail = process.env.DOCTOR_EMAIL || doctorEmail;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking - DocBook</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 32px;">🏥 DocBook</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Healthcare Made Simple</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">New Appointment Booking 📅</h2>
          
          <p style="color: #666; margin-bottom: 20px;">
            Hello ${doctorName}, you have a new appointment booking:
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Patient Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Patient Name:</td>
                <td style="padding: 8px 0; color: #333;">${userName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Patient Email:</td>
                <td style="padding: 8px 0; color: #333;">${userEmail}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #22c55e;">
            <h3 style="color: #333; margin-top: 0;">Appointment Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0; color: #333;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Time:</td>
                <td style="padding: 8px 0; color: #333;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Reason:</td>
                <td style="padding: 8px 0; color: #333;">${reason}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3000/my-appointments" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              View All Appointments
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              © 2024 DocBook. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return sendEmail({
    to: configuredDoctorEmail,
    subject: 'New Appointment Booking - DocBook',
    html,
    text: `New appointment booking from ${userName} (${userEmail}) on ${date} at ${time}. Reason: ${reason}`
  });
}
