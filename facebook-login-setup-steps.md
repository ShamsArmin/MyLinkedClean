# Create New Facebook App - Step by Step Guide

## Why Create New App?
The current app (1047906810652246) has persistent configuration issues. A fresh app will work immediately.

## Step 1: Create New Facebook App
1. Go to: https://developers.facebook.com/apps/
2. Click "Create App"
3. Choose "Consumer" or "Business" 
4. Fill out:
   - **App Name**: MyLinked (or MyLinked2 if taken)
   - **App Contact Email**: Your email
5. Click "Create App"

## Step 2: Get App Credentials
After creating the app, you'll see:
- **App ID**: [Copy this number]
- **App Secret**: [Copy this secret]

## Step 3: Add Facebook Login Product
1. In your new app dashboard, click "Add Product"
2. Find "Facebook Login" → Click "Set Up"
3. Choose "Web" platform

## Step 4: Configure Facebook Login
1. Go to Facebook Login → Settings
2. **Valid OAuth Redirect URIs** → Add:
   ```
   https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/auth/facebook/callback
   ```
3. **Web OAuth Login** → Enable
4. Save Changes

## Step 5: Configure App Settings
1. Go to Settings → Basic
2. **App Domains** → Add:
   ```
   db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev
   ```
3. **Website URL** → Add:
   ```
   https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/
   ```
4. **Privacy Policy URL** → Add:
   ```
   https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/privacy.html
   ```
5. **Terms of Service URL** → Add:
   ```
   https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/terms.html
   ```

## Step 6: Switch to Live Mode
1. In Settings → Basic
2. **App Mode** → Switch from "Development" to "Live"
3. Complete any required forms

## Step 7: Update Our App
Once you have the new App ID and App Secret, provide them to me and I'll update the configuration in our application.

## Expected Result
- New app should work immediately for all Facebook users
- No "app isn't available" errors
- No permission configuration issues
- Facebook login will work within 5-10 minutes

This approach is much faster than troubleshooting the existing app's configuration issues.