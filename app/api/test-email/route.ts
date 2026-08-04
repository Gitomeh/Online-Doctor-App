import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const gmailEmail = process.env.GMAIL_EMAIL;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    return NextResponse.json({
      success: true,
      gmailConfigured: !!gmailEmail && !!gmailAppPassword,
      gmailEmail: gmailEmail ? `${gmailEmail.substring(0, 3)}***@gmail.com` : 'Not configured',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
