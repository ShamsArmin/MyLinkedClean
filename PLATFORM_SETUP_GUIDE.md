# Platform OAuth Setup Guide

Your MyLinked app needs to be registered on each social media platform to enable Content Preview. Here are the exact steps:

## Base Configuration
**Your App URL**: `https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/`

## 1. Facebook App Setup

### Steps:
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App" → Choose "Other" → "Business"
3. Fill in app details:
   - App Name: `MyLinked Content Preview`
   - Contact Email: `info@mylinked.app`
4. In the App Dashboard, add "Facebook Login" product
5. Configure OAuth Redirect URIs:
   ```
   https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/social/callback/facebook
   ```
6. Under "App Review" → Request permissions:
   - `public_profile` (automatically approved)
   - `user_posts` (requires review)
   - `user_photos` (requires review)

### Required Environment Variables:
- `FACEBOOK_CLIENT_ID`: Found in App Dashboard → Settings → Basic
- `FACEBOOK_CLIENT_SECRET`: Found in App Dashboard → Settings → Basic

## 2. Twitter (X) App Setup

### Steps:
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app
3. Configure OAuth 2.0 settings:
   - Type: Web App
   - Callback URLs:
   ```
   https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/social/callback/twitter
   ```
   - Website URL: `https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/`
4. Enable OAuth 2.0 scopes:
   - `tweet.read`
   - `users.read`
   - `offline.access`

### Required Environment Variables:
- `TWITTER_CLIENT_ID`: Found in App Settings → OAuth 2.0
- `TWITTER_CLIENT_SECRET`: Found in App Settings → OAuth 2.0

## 3. TikTok App Setup

### Steps:
1. Go to [TikTok Developers](https://developers.tiktok.com/)
2. Register as a developer and create an app
3. Configure OAuth settings:
   - Redirect URI:
   ```
   https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/social/callback/tiktok
   ```
4. Request scopes:
   - `user.info.basic`
   - `video.list`

### Required Environment Variables:
- `TIKTOK_CLIENT_ID`: Found in App Management
- `TIKTOK_CLIENT_SECRET`: Found in App Management

## Quick Test

After setting up each platform:

1. Add the Client ID and Secret to your environment variables
2. Try connecting the platform from your dashboard
3. You should be redirected to authenticate
4. After authorization, you'll return to the dashboard with the platform connected

## Need Help?

If you encounter issues:
1. Check that redirect URIs exactly match (including the trailing slash)
2. Ensure your app is in "Live" mode, not "Development"
3. Verify all required permissions are approved
4. Double-check environment variable names and values

Let me know which platform you'd like to set up first, and I can provide more detailed guidance!