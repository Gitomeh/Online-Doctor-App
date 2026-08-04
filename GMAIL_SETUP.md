# Gmail Setup Instructions for DocBook Email Service

## Step 1: Enable 2-Factor Authentication (if not already enabled)

1. Go to [Google Account settings](https://myaccount.google.com/security)
2. Under "Signing in to Google", ensure "2-Step Verification" is enabled
3. If not enabled, click on it and follow the setup process

## Step 2: Generate an App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Sign in with your Google account if prompted
3. Under "Select app", choose "Mail" or "Custom name"
4. If you chose "Custom name", enter "DocBook" or "Next.js App"
5. Under "Select device", choose "Other (Custom name)" 
6. Enter a name like "Development" or "Localhost"
7. Click "Generate"
8. **Copy the 16-character password** (this is your app password)

## Step 3: Update Environment Variables

Open your `.env.local` file and update the following:

```env
GMAIL_EMAIL=your_actual_gmail@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
```

Replace:
- `your_actual_gmail@gmail.com` with your actual Gmail address
- `your_16_char_app_password` with the app password you generated

## Step 4: Restart the Development Server

After updating the `.env.local` file, restart your development server:

```bash
npm run dev
```

## Step 5: Test Email Sending

1. Try booking an appointment in the app
2. Check both:
   - Your Gmail inbox (for the confirmation email)
   - The doctor's email (for the notification email)
   - The server console for success messages

## Important Notes

- **Security**: Never commit your `.env.local` file to version control
- **App Passwords**: These are different from your regular Gmail password
- **Rate Limits**: Gmail has sending limits (typically 500 emails/day for free accounts)
- **Spam Folder**: Check your spam folder if emails don't appear in inbox

## Troubleshooting

### "Invalid login" error
- Double-check your app password (it's case-sensitive)
- Make sure 2-factor authentication is enabled
- Regenerate the app password if needed

### Emails not arriving
- Check spam/junk folders
- Verify the recipient email addresses are correct
- Check server console for error messages

### "Network timeout" error
- Check your internet connection
- Verify Gmail is accessible from your network
- Some corporate networks may block SMTP traffic

## Production Considerations

For production deployment, consider using:
- A dedicated email service (SendGrid, Mailgun, AWS SES)
- A dedicated Gmail account for the app
- Proper error handling and retry logic
- Email queue management for high-volume sending
