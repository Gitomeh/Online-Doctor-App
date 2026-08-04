import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Doctor email configuration - all doctor notifications go to this email
const DOCTOR_EMAIL = process.env.DOCTOR_EMAIL || 'YOUR_DOCTOR_EMAIL@example.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      patientName,
      patientEmail,
      doctorName,
      date,
      time,
      reason,
      symptoms,
      phoneNumber,
      idNumber
    } = body;

    // Initialize Google Sheets API
    const sheets = google.sheets('v4');

    // Authenticate using service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI,
        token_uri: process.env.GOOGLE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
        universe_domain: "googleapis.com",
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Bookings';

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Google Sheets Spreadsheet ID is not configured' },
        { status: 500 }
      );
    }

    // Create sheet if it doesn't exist
    try {
      await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: `${sheetName}!A1:K1`,
      });
    } catch (error) {
      // Sheet doesn't exist, create it with headers
      try {
        await sheets.spreadsheets.batchUpdate({
          auth,
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });

        // Add headers
        await sheets.spreadsheets.values.update({
          auth,
          spreadsheetId,
          range: `${sheetName}!A1:K1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [
              [
                'Timestamp',
                'Patient Name',
                'Patient Email',
                'Phone Number',
                'ID Number',
                'Doctor Name',
                'Doctor Email',
                'Date',
                'Time',
                'Reason',
                'Symptoms'
              ]
            ]
          }
        });
      } catch (createError) {
        console.error('Error creating sheet:', createError);
        // Continue anyway, sheet might already exist
      }
    }

    console.log('📊 Google Sheets Configuration:', {
      spreadsheetId,
      sheetName,
      doctorEmail: DOCTOR_EMAIL
    });

    console.log('📊 Booking data to add:', {
      patientName,
      patientEmail,
      doctorName,
      date,
      time,
      reason,
      symptoms,
      phoneNumber,
      idNumber
    });

    // Add the booking data to the sheet
    const response = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: `${sheetName}!A:K`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [
            new Date().toISOString(), // Timestamp
            patientName,
            patientEmail,
            phoneNumber || '',
            idNumber || '',
            doctorName,
            DOCTOR_EMAIL, // All doctor notifications go to YOUR_DOCTOR_EMAIL@example.com
            date,
            time,
            reason,
            symptoms || ''
          ]
        ]
      }
    });

    console.log('✅ Booking successfully added to Google Sheets:', response.data);

    return NextResponse.json(
      { success: true, message: 'Booking saved to Google Sheets' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error adding booking to Google Sheets:', error);
    return NextResponse.json(
      { error: 'Failed to add booking to Google Sheets' },
      { status: 500 }
    );
  }
}