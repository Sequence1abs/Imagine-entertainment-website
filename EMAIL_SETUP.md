# Email Setup Instructions

To enable email functionality for the contact form, follow these steps:

## 1. Install Nodemailer

Run one of these commands in your terminal:

```bash
npm install nodemailer @types/nodemailer
```

or

```bash
pnpm add nodemailer @types/nodemailer
```

## 2. Create Environment Variables

Create a `.env.local` file in the root of your project (same level as `package.json`) with the following:

```env
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 3. Gmail Setup (Recommended)

If you're using Gmail:

1. **Enable 2-Step Verification:**
   - Go to your Google Account settings
   - Navigate to Security
   - Enable 2-Step Verification

2. **Generate App Password:**
   Go to: https://myaccount.google.com/apppasswords
   Select "Mail" and "Other (Custom name)" 
   Enter "Imagine Entertainment Contact Form"
   click "Generate"
   Copy the 16-character password

3. **Add to .env.local:**
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx
   ```
   (Remove spaces from the app password)

## 4. Alternative Email Services

### Outlook/Hotmail:
```env
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

You may need to adjust the service in `app/api/contact/route.ts`:
```typescript
service: "hotmail", // instead of "gmail"
```

### Custom SMTP:
Update the transporter configuration in `app/api/contact/route.ts`:
```typescript
const transporter = nodemailer.createTransport({
  host: "smtp.your-provider.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})
```

## 5. Restart Development Server

After setting up environment variables, restart your Next.js development server:

```bash
npm run dev
```

or

```bash
pnpm dev
```

## Troubleshooting

- **"Email service not configured"**: Make sure `.env.local` exists and contains `SMTP_USER` and `SMTP_PASS`
- **"Email authentication failed"**: Check that your credentials are correct, especially the app password for Gmail
- **"Could not connect to email server"**: Check your internet connection and firewall settings
- **Module not found**: Make sure nodemailer is installed (`npm install nodemailer @types/nodemailer`)

## Testing

After setup, test the contact form. Emails will be sent to: **hasaldharmagunawardana@gmail.com**

