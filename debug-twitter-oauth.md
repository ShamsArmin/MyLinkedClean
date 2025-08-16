# Twitter OAuth Debug Guide

## Current Error: invalid_scope

This error typically occurs when:

1. **OAuth 2.0 is not enabled** in your Twitter app
2. **User Authentication Settings are incorrect**
3. **App type is set wrong**

## Fix Steps:

### Step 1: Enable User Authentication
1. Go to your Twitter app dashboard
2. Click "Set up" under "User authentication settings" (if not done)
3. Configure these settings:
   - **App permissions**: Read
   - **Type of App**: Web App, Automated App or Bot
   - **App info**:
     - Callback URI: `https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/social/callback/twitter`
     - Website URL: `https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev`
   - **Request email address**: NO (unchecked)

### Step 2: Verify OAuth 2.0 is Enabled
- Make sure "OAuth 2.0" toggle is ON in User authentication settings
- Make sure "OAuth 1.0a" is OFF (we're using OAuth 2.0)

### Step 3: Save and Test
- Save all settings
- Test the connection again

## Alternative: Try OAuth 1.0a
If OAuth 2.0 continues to fail, we can switch to OAuth 1.0a which is more stable for Twitter.