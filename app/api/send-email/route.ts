import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = body;

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
      return NextResponse.json(
        { error: 'Resend credentials not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const response = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });
    
    console.log('✅ Email sent successfully via Resend:', {
      to,
      subject,
      messageId: response.id,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { success: true, messageId: response.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error sending email via Resend:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
