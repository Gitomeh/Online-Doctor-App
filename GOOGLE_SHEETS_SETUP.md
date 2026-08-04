# Google Sheets Setup Guide

Since you've already enabled the Google Sheets API, follow these steps to complete the setup:

## Step 1: Create a Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the correct project: `949456890154`
3. Navigate to: **IAM & Admin** → **Service Accounts**
4. Click **"Create Service Account"**
5. Fill in the details:
   - **Service account name**: `YOUR_SERVICE_ACCOUNT_NAME`
   - **Service account description**: `Service account for DocBook Google Sheets integration`
   - Click **"Create and Continue"**
6. Skip adding roles for now (we'll add permissions later)
7. Click **"Done"**

## Step 2: Create and Download Credentials

1. In the Service Accounts list, click on the service account you just created (`YOUR_SERVICE_ACCOUNT_NAME`)
2. Go to the **"Keys"** tab
3. Click **"Add Key"** → **"Create new key"**
4. Select **"JSON"** key type
5. Click **"Create"**
6. The JSON file will be downloaded automatically
7. **Keep this file safe** - it contains sensitive credentials

## Step 3: Extract Credentials from JSON File

Open the downloaded JSON file and copy these values:

```json
{
  "type": "service_account",
  "project_id": "your_project_id",
  "private_key_id": "your_private_key_id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "YOUR_SERVICE_ACCOUNT_EMAIL@your_project_id.iam.gserviceaccount.com",
  "client_id": "your_client_id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/YOUR_SERVICE_ACCOUNT_EMAIL@your_project_id.iam.gserviceaccount.com"
}
```

## Step 4: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Click **"Blank"** to create a new spreadsheet
3. Name it: `DocBook Bookings`
4. The URL will look like: `https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID/edit`
5. Copy the **SPREADSHEET_ID** from the URL (the long string between `/d/` and `/edit`)

## Step 5: Share Sheet with Service Account

1. In your Google Sheet, click **"Share"** button
2. Paste the service account email from your JSON file (`docbook-sheets@your_project_id.iam.gserviceaccount.com`)
3. Give it **"Editor"** permissions
4. Click **"Send"**

## Step 6: Update Environment Variables

Once you have all the information, I'll help you update the `.env.local` file with:

- `GOOGLE_TYPE` (usually "service_account")
- `GOOGLE_PROJECT_ID` 
- `GOOGLE_PRIVATE_KEY_ID`
- `GOOGLE_PRIVATE_KEY` (the entire key including \n characters)
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_AUTH_URI`
- `GOOGLE_TOKEN_URI`
- `GOOGLE_AUTH_PROVIDER_X509_CERT_URL`
- `GOOGLE_CLIENT_X509_CERT_URL`
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SHEETS_SHEET_NAME` (use "Bookings")

## Step 7: Test the Integration

After configuration, test by:
1. Making a booking through the app
2. Check the Google Sheet for the new booking record
3. Verify all data is correctly saved

---

**Ready to proceed?** Once you have the service account JSON file and spreadsheet ID, share the values with me and I'll update the configuration for you.