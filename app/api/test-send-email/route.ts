import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testEmail } = body;

    const gmailEmail = process.env.GMAIL_EMAIL;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailEmail || !gmailAppPassword) {
      return NextResponse.json(
        { error: 'Gmail credentials not configured', gmailEmail: !!gmailEmail, password: !!gmailAppPassword },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailEmail,
        pass: gmailAppPassword,
      },
    });

    const mailOptions = {
      from: gmailEmail,
      to: testEmail || gmailEmail,
      subject: 'Test Email from DocBook',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from your DocBook application.</p>
        <p>If you receive this, email sending is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
      text: 'This is a test email from your DocBook application.',
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully:', {
      to: testEmail || gmailEmail,
      messageId: info.messageId,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { success: true, messageId: info.messageId, message: 'Test email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
