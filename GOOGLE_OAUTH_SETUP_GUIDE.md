# Google OAuth Setup Guide for MyLinked

## Overview
Complete step-by-step guide to configure Google OAuth for MyLinked on your custom domain www.mylinked.app.

## Prerequisites ✅
- Custom domain www.mylinked.app is working
- SSL certificate is configured
- Google Cloud Console access

## Step-by-Step Setup

### Step 1: Create Google Cloud Project (If Needed)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project** (skip if you have one)
   - Click "Select a project" dropdown
   - Click "New Project"
   - Project Name: "MyLinked OAuth"
   - Click "Create"

### Step 2: Enable Google+ API

1. **Navigate to APIs & Services**
   - In Google Cloud Console, go to "APIs & Services" → "Library"
   
2. **Enable Required APIs**
   - Search for "Google+ API" → Click → Enable
   - Search for "People API" → Click → Enable
   - These APIs allow profile information access

### Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - Navigate to "APIs & Services" → "OAuth consent screen"

2. **Choose User Type**
   - Select "External" (for public app)
   - Click "Create"

3. **App Information**
   - App name: `MyLinked`
   - User support email: `your-email@example.com`
   - App logo: Upload MyLinked logo (optional)
   - App domain: `www.mylinked.app`

4. **App Domains**
   - Authorized domains: `mylinked.app`
   - Application homepage: `https://www.mylinked.app`
   - Application privacy policy: `https://www.mylinked.app/privacy`
   - Application terms of service: `https://www.mylinked.app/terms`

5. **Scopes**
   - Click "Add or Remove Scopes"
   - Add these scopes:
     - `../auth/userinfo.email`
     - `../auth/userinfo.profile`
     - `openid`
   - Click "Update"

6. **Test Users** (for development)
   - Add your email address
   - Add any other test emails

7. **Save and Continue** through all steps

### Step 4: Create OAuth 2.0 Credentials

1. **Navigate to Credentials**
   - Go to "APIs & Services" → "Credentials"

2. **Create OAuth Client ID**
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "MyLinked Web Client"

3. **Configure Authorized Origins**
   ```
   https://www.mylinked.app
   https://mylinked.app
   ```

4. **Configure Authorized Redirect URIs**
   ```
   https://www.mylinked.app/api/auth/google/callback
   ```
   
   **Important**: 
   - Use exact URL with HTTPS
   - No trailing slash
   - Case sensitive

5. **Create and Save Credentials**
   - Click "Create"
   - Copy Client ID and Client Secret
   - Save them securely

### Step 5: Update Environment Variables in Replit

1. **Go to Replit Secrets**
   - In your Replit project, click "Secrets" tab
   - Or access via https://replit.com/~/secrets

2. **Add/Update Google Credentials**
   ```
   GOOGLE_CLIENT_ID=your_copied_client_id
   GOOGLE_CLIENT_SECRET=your_copied_client_secret
   ```

3. **Verify BASE_URL**
   ```
   BASE_URL=https://www.mylinked.app
   ```

### Step 6: Test Google OAuth

1. **Test OAuth Initiation**
   - Go to: `https://www.mylinked.app/auth`
   - Click "Continue with Google" button
   - Should redirect to Google login

2. **Complete OAuth Flow**
   - Enter Google credentials
   - Grant permissions to MyLinked
   - Should redirect back to MyLinked dashboard

3. **Verify User Creation**
   - Check if user account was created
   - Profile should show Google profile picture
   - Username format: `email_prefix_randomid`

## Common Issues & Solutions

### Issue: "redirect_uri_mismatch"
**Solution**: 
- Double-check redirect URI in Google Console exactly matches:
  `https://www.mylinked.app/api/auth/google/callback`
- No trailing slash
- Must be HTTPS

### Issue: "This app isn't verified"
**Solution**:
- Normal for development apps
- Click "Advanced" → "Go to MyLinked (unsafe)"
- For production, submit app for verification

### Issue: "Access blocked" 
**Solution**:
- Ensure OAuth consent screen is properly configured
- Add your email as test user
- Check all required fields are filled

### Issue: "invalid_client"
**Solution**:
- Verify Client ID and Secret are correct in Replit Secrets
- Ensure no extra spaces in environment variables
- Check project is selected correctly in Google Console

## Advanced Configuration

### Enable Additional Scopes
If you need more user data:
```
../auth/userinfo.email
../auth/userinfo.profile  
../auth/user.birthday.read
../auth/user.phonenumbers.read
```

### App Verification (For Production)
1. Complete OAuth consent screen fully
2. Add privacy policy and terms of service
3. Submit for Google verification
4. Process takes 1-6 weeks

## Testing Checklist

- [ ] Google Cloud project created
- [ ] APIs enabled (Google+ API, People API)
- [ ] OAuth consent screen configured
- [ ] OAuth client credentials created
- [ ] Redirect URI added: `https://www.mylinked.app/api/auth/google/callback`
- [ ] Environment variables updated in Replit
- [ ] OAuth flow tested successfully
- [ ] User registration works
- [ ] Profile data populates correctly

## Backend Implementation (Already Complete ✅)

The Google OAuth backend is already implemented in `server/routes.ts`:

- **Initiation endpoint**: `/api/auth/google`
- **Callback endpoint**: `/api/auth/google/callback` 
- **User creation**: Automatic with Google profile data
- **Session management**: Handled by Passport.js
- **Error handling**: Comprehensive error flows

## Support

If you encounter any issues:

1. Check Google Cloud Console for detailed error messages
2. Verify all URLs use HTTPS and exact domain
3. Ensure environment variables are set correctly
4. Test with development domain first if needed

Your Google OAuth will be fully functional once these steps are completed!