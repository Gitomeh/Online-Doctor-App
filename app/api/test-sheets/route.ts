import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const serviceAccountEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const projectId = process.env.GOOGLE_PROJECT_ID;

    return NextResponse.json({
      success: true,
      sheetsConfigured: !!spreadsheetId && !!serviceAccountEmail,
      spreadsheetId: spreadsheetId ? 'Configured' : 'Not configured',
      serviceAccountEmail: serviceAccountEmail ? serviceAccountEmail : 'Not configured',
      projectId: projectId ? projectId : 'Not configured',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
