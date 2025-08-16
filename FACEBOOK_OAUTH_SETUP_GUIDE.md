# Facebook OAuth Setup Guide for MyLinked

## Overview
Complete step-by-step guide to configure Facebook OAuth for MyLinked on your custom domain www.mylinked.app.

## Prerequisites ✅
- Custom domain www.mylinked.app is working
- SSL certificate is configured  
- Facebook Developer account

## Step-by-Step Setup

### Step 1: Create Facebook App

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/
   - Sign in with your Facebook account

2. **Create New App**
   - Click "Create App"
   - Choose "Consumer" (for user login)
   - Click "Next"

3. **App Details**
   - App Name: `MyLinked`
   - App Contact Email: `your-email@example.com`
   - Click "Create App"

### Step 2: Basic App Configuration

1. **Navigate to App Settings**
   - Go to "Settings" → "Basic"

2. **Complete Required Information**
   - **Display Name**: `MyLinked`
   - **App Domains**: `mylinked.app`
   - **Privacy Policy URL**: `https://www.mylinked.app/privacy`
   - **Terms of Service URL**: `https://www.mylinked.app/terms`
   - **Contact Email**: `your-email@example.com`

3. **Add Platform**
   - Scroll down to "Add Platform"
   - Select "Website"
   - **Site URL**: `https://www.mylinked.app`
   - Click "Save Changes"

### Step 3: Configure Facebook Login Product

1. **Add Facebook Login Product**
   - In left sidebar, click "Add Product"
   - Find "Facebook Login" → Click "Set Up"

2. **Configure Facebook Login Settings**
   - Go to "Facebook Login" → "Settings"

3. **Client OAuth Settings**
   - **Valid OAuth Redirect URIs**:
     ```
     https://www.mylinked.app/api/auth/facebook/callback
     ```
   - **Client OAuth Login**: ✅ Enabled
   - **Web OAuth Login**: ✅ Enabled
   - **Force Web OAuth Reauthentication**: ❌ Disabled
   - **Use Strict Mode for Redirect URIs**: ✅ Enabled

4. **Save Changes**

### Step 4: App Review and Permissions

1. **Configure Permissions**
   - Go to "App Review" → "Permissions and Features"
   - Ensure these are approved:
     - `email` (should be approved by default)
     - `public_profile` (should be approved by default)

2. **Login Permissions** (Already Granted)
   - `email`: Access to user's primary email
   - `public_profile`: Access to name, picture, etc.

### Step 5: Switch to Live Mode

1. **App Review**
   - Go to "Settings" → "Basic"
   - Find "App Mode" section
   - Toggle from "Development" to "Live"

2. **Requirements for Live Mode**
   - Privacy Policy URL ✅
   - Terms of Service URL ✅  
   - App Icon (recommended)
   - Category selection
   - Complete app description

3. **Verify Live Status**
   - App should show "Live" status
   - Available to all Facebook users

### Step 6: Get App Credentials

1. **Copy App ID and Secret**
   - Go to "Settings" → "Basic"
   - Copy **App ID** (Client ID)
   - Click "Show" next to **App Secret** (Client Secret)
   - Copy **App Secret**

2. **Save Credentials Securely**
   - Keep these credentials safe
   - You'll add them to Replit Secrets

### Step 7: Update Environment Variables in Replit

1. **Go to Replit Secrets**
   - In your Replit project, click "Secrets" tab
   - Or access via https://replit.com/~/secrets

2. **Add/Update Facebook Credentials**
   ```
   FACEBOOK_CLIENT_ID=your_facebook_app_id
   FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
   ```

3. **Verify BASE_URL**
   ```
   BASE_URL=https://www.mylinked.app
   ```

### Step 8: Test Facebook OAuth

1. **Test OAuth Initiation**
   - Go to: `https://www.mylinked.app/auth`
   - Click "Continue with Facebook" button
   - Should redirect to Facebook login

2. **Complete OAuth Flow**
   - Enter Facebook credentials
   - Grant permissions to MyLinked
   - Should redirect back to MyLinked dashboard

3. **Verify User Creation**
   - Check if user account was created
   - Profile should show Facebook profile picture
   - Username format: `fb_facebook_id`

## Advanced Configuration

### Data Use Checkup (Recommended)

1. **Complete Data Use Checkup**
   - Go to "Settings" → "Advanced"
   - Find "Data Use Checkup"
   - Complete all sections about data usage

2. **Business Verification** (For Advanced Features)
   - Go to "Settings" → "Business Verification"
   - Complete business verification if needed

### App Icon and Branding

1. **Add App Icon**
   - Go to "Settings" → "Basic"
   - Upload app icon (1024x1024 recommended)
   - Use MyLinked logo

2. **Category Selection**
   - Choose appropriate category: "Business"
   - Add app description

## Common Issues & Solutions

### Issue: "Feature Unavailable"
**Root Cause**: App in Development Mode or incomplete configuration

**Solution**:
1. Complete Privacy Policy and Terms of Service URLs
2. Add app icon and description
3. Switch app to Live Mode
4. Complete Data Use Checkup

### Issue: "URL Blocked" or "Can't Load URL"
**Solution**:
- Verify App Domains includes `mylinked.app`
- Check Valid OAuth Redirect URIs exactly match:
  `https://www.mylinked.app/api/auth/facebook/callback`
- Ensure Website platform is configured

### Issue: "Invalid OAuth access token"
**Solution**:
- Verify Client ID and Secret are correct in Replit Secrets
- Ensure no extra spaces in environment variables
- Check app is in Live Mode

### Issue: "This app is in development mode"
**Solution**:
- Switch app to Live Mode in "Settings" → "Basic"
- Complete all required fields first

## Mobile Compatibility

Facebook OAuth automatically works on mobile browsers once configured properly:

- **Display Parameter**: Automatically set to `touch` for mobile
- **Mobile Web**: Works in mobile browsers
- **App Links**: Can integrate with Facebook mobile app

## Security Best Practices

1. **Secure Redirect URIs**
   - Only add exact redirect URIs needed
   - Use HTTPS only
   - Enable "Use Strict Mode for Redirect URIs"

2. **App Secret Security**
   - Never expose App Secret in client-side code
   - Store securely in environment variables
   - Regenerate if compromised

3. **Review Permissions**
   - Only request minimum permissions needed
   - `email` and `public_profile` are sufficient for MyLinked

## Testing Checklist

- [ ] Facebook app created
- [ ] Basic information completed (Privacy Policy, Terms, etc.)
- [ ] Website platform added with correct URL
- [ ] Facebook Login product configured
- [ ] OAuth redirect URI added: `https://www.mylinked.app/api/auth/facebook/callback`
- [ ] App switched to Live Mode
- [ ] Environment variables updated in Replit
- [ ] OAuth flow tested successfully
- [ ] User registration works
- [ ] Profile data populates correctly

## Backend Implementation (Already Complete ✅)

The Facebook OAuth backend is already implemented in `server/routes.ts`:

- **Initiation endpoint**: `/api/auth/facebook`
- **Callback endpoint**: `/api/auth/facebook/callback`
- **User creation**: Automatic with Facebook profile data
- **Session management**: Handled by Passport.js
- **Error handling**: Comprehensive error flows with user-friendly redirects

## Debug and Monitoring

### Test OAuth Status
```bash
curl https://www.mylinked.app/api/oauth/status
```

### Debug Facebook OAuth
1. Check "App Review" → "Current Submissions" for any pending reviews
2. Monitor "Analytics" → "App Events" for OAuth events
3. Use Facebook's OAuth debugging tool: https://developers.facebook.com/tools/debug/

## Support Resources

- Facebook for Developers Documentation: https://developers.facebook.com/docs/facebook-login/
- OAuth 2.0 Specification: https://oauth.net/2/
- MyLinked OAuth Status: https://www.mylinked.app/api/oauth/status

Your Facebook OAuth will be fully functional once these steps are completed!