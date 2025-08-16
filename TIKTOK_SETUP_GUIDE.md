# TikTok OAuth Setup Guide

## Steps to Create TikTok Developer App

1. **Go to TikTok for Developers**
   - Visit: https://developers.tiktok.com/
   - Sign in with your TikTok account

2. **Create a New App**
   - Click "Manage apps" → "Connect an app"
   - Fill in app details:
     - App Name: `MyLinked Content Preview`
     - Description: `Content preview integration for MyLinked platform`
     - Category: `Lifestyle`

3. **Configure Login Kit**
   - In your app dashboard, go to "Products" → "Login Kit"
   - Add "Login Kit" to your app
   - Configure redirect URIs:
     ```
     https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/social/callback/tiktok
     ```

4. **Get Your Credentials**
   - Go to "Basic info"
   - Copy your **Client Key** (this is the Client ID)
   - Copy your **Client Secret**

5. **Required Scopes**
   - `user.info.basic` - Basic user information
   - `video.list` - Access to user's videos

## Environment Variables Needed:
- `TIKTOK_CLIENT_ID` (Client Key from TikTok)
- `TIKTOK_CLIENT_SECRET`

TikTok's OAuth is generally more accessible than Twitter and should work without requiring lengthy app review processes.