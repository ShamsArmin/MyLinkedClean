# Twitter (X) OAuth Setup Guide

## Steps to Fix Twitter App Configuration

**IMPORTANT: You need to check your Twitter app permissions!**

1. **Go to your Twitter App Settings**
   - Visit: https://developer.twitter.com/en/portal/dashboard
   - Select your app: `MyLinked Content Preview`

2. **Check App Permissions**
   - Go to "Settings" → "App permissions"
   - Make sure it's set to "Read" (not "Read and write")
   - If it shows "Read and write", change it to "Read"

3. **Verify OAuth 2.0 Settings**
   - Go to "Settings" → "Authentication Settings"
   - Make sure OAuth 2.0 is enabled
   - Callback URI should be:
     ```
     https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/social/callback/twitter
     ```

4. **Check User Authentication Settings**
   - In "User authentication settings", make sure you have:
   - ✅ OAuth 2.0 enabled
   - ✅ Request email address from users: OFF
   - ✅ Type of App: Web App
   - ✅ Callback URI: (same as above)
   - ✅ Website URL: Your app URL

5. **App Permissions Must Be "Read"**
   - This is critical - Twitter rejects "invalid_scope" if permissions are wrong
   - Go to Settings → App permissions → Select "Read"

## Environment Variables Needed:
- `TWITTER_CLIENT_ID`
- `TWITTER_CLIENT_SECRET`

Twitter's OAuth 2.0 is more straightforward than Facebook and should work without requiring app review for basic profile and tweet reading.