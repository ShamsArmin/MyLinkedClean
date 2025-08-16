# OAuth Redirect URI Configuration Guide

## Current Status ✅
- **Backend Implementation**: Both Google and Facebook OAuth are fully implemented
- **Environment Variables**: All required secrets are configured in Replit
- **Custom Domain**: www.mylinked.app is working with SSL certificate
- **Issue**: OAuth redirect URIs need to be updated for custom domain

## Required Redirect URIs

### For Google OAuth Console
**Add these redirect URIs to your Google OAuth app:**

1. **Primary Domain (Custom)**:
   ```
   https://www.mylinked.app/api/auth/google/callback
   ```

2. **Development Domain (Replit)**:
   ```
   https://[your-replit-domain].replit.app/api/auth/google/callback
   ```

### For Facebook Developer Console  
**Add these redirect URIs to your Facebook app:**

1. **Primary Domain (Custom)**:
   ```
   https://www.mylinked.app/api/auth/facebook/callback
   ```

2. **Development Domain (Replit)**:
   ```
   https://[your-replit-domain].replit.app/api/auth/facebook/callback
   ```

## Google Console Setup Steps

### Step 1: Access Google Cloud Console
1. Go to https://console.cloud.google.com/
2. Select your project (or create a new one)
3. Navigate to "APIs & Services" → "Credentials"

### Step 2: Configure OAuth 2.0 Client
1. Find your OAuth 2.0 Client ID
2. Click "Edit" (pencil icon)
3. In "Authorized redirect URIs" section, add:
   - `https://www.mylinked.app/api/auth/google/callback`
   - Keep existing Replit domain for testing
4. Click "Save"

### Step 3: Verify Configuration
1. Test URL: `https://www.mylinked.app/api/auth/google`
2. Should redirect to Google login page
3. After login, should return to MyLinked dashboard

## Facebook Developer Console Setup Steps

### Step 1: Access Facebook Developer Console
1. Go to https://developers.facebook.com/
2. Navigate to "My Apps"
3. Select your MyLinked app

### Step 2: Configure Facebook Login
1. Go to "Facebook Login" → "Settings"
2. In "Valid OAuth Redirect URIs", add:
   - `https://www.mylinked.app/api/auth/facebook/callback`
   - Keep existing Replit domain for testing
3. Click "Save Changes"

### Step 3: App Domains Configuration
1. Go to "Settings" → "Basic"
2. In "App Domains", add:
   - `www.mylinked.app`
   - Your Replit domain for testing
3. Click "Save Changes"

### Step 4: Website Platform
1. In "Settings" → "Basic", scroll to "Add Platform"
2. Select "Website"
3. Set Site URL to: `https://www.mylinked.app`
4. Click "Save Changes"

### Step 5: Verify Configuration
1. Test URL: `https://www.mylinked.app/api/auth/facebook`
2. Should redirect to Facebook login page
3. After login, should return to MyLinked dashboard

## Testing OAuth Flow

### Test Google OAuth
```bash
# Open in browser
https://www.mylinked.app/api/auth/google
```

### Test Facebook OAuth  
```bash
# Open in browser
https://www.mylinked.app/api/auth/facebook
```

## Troubleshooting

### Common Issues

**Google OAuth Error: "redirect_uri_mismatch"**
- Ensure exact match in Google Console redirect URI
- Check for trailing slashes (should NOT have trailing slash)
- Verify HTTPS is used (not HTTP)

**Facebook OAuth Error: "URL Blocked"**
- Verify App Domains includes www.mylinked.app
- Check Valid OAuth Redirect URIs
- Ensure app is in Live Mode (not Development)

**Facebook OAuth Error: "Feature Unavailable"**
- Complete Privacy Policy URL in app settings
- Complete Terms of Service URL in app settings
- Add app icon and description
- Complete Data Use Checkup

### Debug Endpoints
Test OAuth status:
```bash
curl https://www.mylinked.app/api/oauth/status
```

## Environment Variables (Already Configured ✅)
```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id  
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
BASE_URL=https://www.mylinked.app
```

## Next Steps
1. Update Google OAuth redirect URIs
2. Update Facebook OAuth redirect URIs  
3. Test both OAuth flows on custom domain
4. Verify user registration/login works correctly

Once these redirect URIs are updated, both Google and Facebook OAuth will work seamlessly on your custom domain www.mylinked.app!