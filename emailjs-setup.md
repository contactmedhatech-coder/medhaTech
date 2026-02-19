# EmailJS Setup Guide

To make the contact form work, you need to set up EmailJS and add your credentials to `.env.local`.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and sign up for a free account
2. Verify your email address

## Step 2: Create an Email Service

1. In the EmailJS dashboard, click **Email Services** in the left sidebar
2. Click **Add New Service**
3. Choose a provider (Gmail is recommended)
4. Connect your Gmail account
5. Copy the **Service ID** (e.g., `service_xxxxxxx`)

## Step 3: Create an Email Template

1. Click **Email Templates** in the left sidebar
2. Click **Create New Template**
3. Use the default template or create a custom one
4. Configure the template with these variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{subject}}` - Message subject
   - `{{message}}` - Message content
   - `{{to_email}}` - Recipient email (pasangworkspace@gmail.com)

5. In the "To Email" field of the template, use: `pasangworkspace@gmail.com`
6. Save the template
7. Copy the **Template ID** (e.g., `template_xxxxxxx`)

## Step 4: Get Your Public Key

1. Click **Account** in the left sidebar
2. Copy your **Public Key** (e.g., `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

## Step 5: Update Environment Variables

Edit `.env.local` and replace the placeholder values:

```env
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
VITE_EMAILJS_SERVICE_ID=your_actual_service_id
VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
```

## Step 6: Restart Your Development Server

```bash
npm run dev
```

## Testing

1. Fill out the contact form on your website
2. Click "Send Message"
3. Check your Gmail inbox (and spam folder) for the test email
4. If you don't receive an email, check the browser console for errors

## Troubleshooting

- **"Failed to send message"**: Check that all environment variables are correctly set
- **CORS errors**: Make sure your domain is authorized in EmailJS settings
- **Template variables not working**: Ensure the variable names in your template match exactly (case-sensitive)
