# Authentication Setup Guide

This guide will help you set up email and OAuth authentication for Featherweight.

## Email Authentication (Magic Links)

### Gmail SMTP Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the 16-character password (without spaces)

3. **Update Environment Variables**
   ```bash
   EMAIL_SERVER_USER="your-gmail@gmail.com"
   EMAIL_SERVER_PASSWORD="your-16-char-app-password"
   ```

### Alternative SMTP Providers

#### SendGrid

```bash
EMAIL_SERVER_HOST="smtp.sendgrid.net"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="your-sendgrid-api-key"
```

#### Mailgun

```bash
EMAIL_SERVER_HOST="smtp.mailgun.org"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-mailgun-username"
EMAIL_SERVER_PASSWORD="your-mailgun-password"
```

## OAuth Authentication

### GitHub OAuth Setup

1. **Create GitHub OAuth App**
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Click "New OAuth App"
   - Fill in:
     - **Application name**: `Featherweight Development`
     - **Homepage URL**: `http://localhost:3000`
     - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

2. **Get Credentials**
   - Copy the Client ID
   - Generate a new Client Secret
   - Update `.env.local`:
     ```bash
     GITHUB_CLIENT_ID="your-github-client-id"
     GITHUB_CLIENT_SECRET="your-github-client-secret"
     ```

### Google OAuth Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project or select existing

2. **Enable APIs**
   - Enable the "Google+ API" or "Google People API"

3. **Create OAuth 2.0 Client**
   - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: **Web application**
   - Name: `Featherweight Development`
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```

4. **Get Credentials**
   - Copy Client ID and Client Secret
   - Update `.env.local`:
     ```bash
     GOOGLE_CLIENT_ID="your-google-client-id"
     GOOGLE_CLIENT_SECRET="your-google-client-secret"
     ```

## Production Setup

### NextAuth Secret

For production, generate a secure secret:

```bash
openssl rand -base64 32
```

Update `NEXTAUTH_SECRET` in production environment.

### NEXTAUTH_URL

Update for production domain:

```bash
NEXTAUTH_URL="https://yourdomain.com"
```

## Testing Authentication

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Test Email Auth**:
   - Visit `http://localhost:3000/login`
   - Click "Continue with Email"
   - Enter your email address
   - Check your email for the magic link

3. **Test OAuth**:
   - Click "Continue with Google" or "Continue with GitHub"
   - Complete the OAuth flow
   - You should be redirected to the dashboard

## Troubleshooting

### Email Issues

- **"Invalid credentials"**: Check your app password is correct (16 characters, no spaces)
- **"SMTP connection failed"**: Verify Gmail 2FA is enabled and you're using an app password
- **No email received**: Check spam folder, verify FROM address

### OAuth Issues

- **"redirect_uri_mismatch"**: Ensure callback URLs match exactly in OAuth app settings
- **"unauthorized_client"**: Check client ID/secret are correct and app is not in development mode restrictions

### Database Issues

- **User creation fails**: Check database connection and run `npx prisma db push`
- **Session issues**: Clear browser cookies and try again

## User Registration Flow

1. **New User via Email**: User enters email → receives magic link → clicks link → user created in database → redirected to dashboard
2. **New User via OAuth**: User clicks OAuth button → completes OAuth flow → user created in database → redirected to dashboard
3. **Existing User**: Same flow but user record is updated instead of created

All authentication methods automatically create user accounts on first sign-in. No separate registration step is needed.
