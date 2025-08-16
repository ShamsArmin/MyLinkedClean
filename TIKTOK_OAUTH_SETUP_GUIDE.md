# TikTok OAuth 2.0 Setup Guide for MyLinked

## Overview

This guide provides step-by-step instructions to configure TikTok OAuth 2.0 authentication for the MyLinked platform. TikTok OAuth allows users to register and login using their TikTok accounts with secure token exchange and user profile retrieval.

## TikTok for Developers Setup

### 1. Create TikTok Developer Account
1. Visit [TikTok for Developers](https://developers.tiktok.com/)
2. Sign in with your TikTok account or create a new account
3. Complete the developer verification process
4. Accept the TikTok Developer Terms of Service

### 2. Create a New App
1. Go to the [TikTok Developer Console](https://developers.tiktok.com/apps/)
2. Click "Create an app"
3. Fill in your app information:
   - **App name**: MyLinked OAuth Integration
   - **App description**: Social link management platform with TikTok authentication
   - **Category**: Social Media or Productivity
   - **Platform**: Web

### 3. Configure OAuth Settings
1. Navigate to your app's settings
2. Go to "Login Kit" or "OAuth" section
3. Add the following redirect URIs:
   ```
   https://www.mylinked.app/api/auth/tiktok/callback
   ```
4. Set the required scopes:
   - `user.info.basic` - Basic user profile information
   - `user.info.profile` - Extended profile information

### 4. Get Your Credentials
1. In your app settings, locate the "Client Key" and "Client Secret"
2. Copy these values - you'll need them for environment variables
3. Note: Keep these credentials secure and never expose them publicly

## Environment Variable Configuration

### Required Environment Variables
Add these to your Replit Secrets or `.env` file:

```env
# TikTok OAuth Configuration
TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here

# Base URL (should already be configured)
BASE_URL=https://www.mylinked.app
```

### Example Values
```env
TIKTOK_CLIENT_KEY=awh9xyz123example
TIKTOK_CLIENT_SECRET=abc123xyz789secretexample
```

## Testing TikTok OAuth

### 1. Test OAuth Initiation
```bash
curl -I "https://www.mylinked.app/api/auth/tiktok"
```
Should return a 302 redirect to TikTok authorization URL.

### 2. OAuth Flow Components
- **Authorization URL**: `https://www.tiktok.com/v2/auth/authorize/`
- **Token URL**: `https://open.tiktokapis.com/v2/oauth/token/`
- **User Info URL**: `https://open.tiktokapis.com/v2/user/info/`

### 3. Required Parameters
- `client_key`: Your TikTok app's client key
- `redirect_uri`: Must match registered redirect URI
- `scope`: `user.info.basic,user.info.profile`
- `response_type`: `code`
- `state`: CSRF protection token

## Security Features

### 1. CSRF Protection
- State tokens are generated and verified for each request
- Tokens expire after 10 minutes for security
- Invalid or expired state tokens are rejected

### 2. Token Security
- Access tokens are securely stored in the database
- Refresh tokens are handled when provided by TikTok
- Token expiration is tracked and managed

### 3. Error Handling
- Comprehensive error messages for all failure scenarios
- Proper error codes and user-friendly messages
- Detailed logging for debugging without exposing sensitive data

## User Experience

### 1. Login Flow
1. User clicks "Continue with TikTok" button
2. Redirected to TikTok authorization page
3. User grants permissions to MyLinked
4. TikTok redirects back with authorization code
5. Server exchanges code for access token
6. User profile is retrieved and account created/logged in

### 2. Account Creation
- Username format: `tiktok_[user_open_id]`
- Display name from TikTok profile
- Profile image from TikTok avatar
- Automatic login after successful registration

### 3. Disconnect Feature
- Users can disconnect TikTok account from settings
- All TikTok connection data is removed from database
- User can reconnect with same or different TikTok account

## Common Issues and Solutions

### Issue 1: "TikTok login is not configured"
**Solution**: Verify `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET` are set in environment variables.

### Issue 2: "Invalid redirect URI"
**Solution**: Ensure redirect URI in TikTok Developer Console exactly matches:
```
https://www.mylinked.app/api/auth/tiktok/callback
```

### Issue 3: "Invalid request" error
**Solution**: 
- Check that all required parameters are being sent
- Verify client key and client secret are correct
- Ensure redirect URI is properly encoded

### Issue 4: "Access denied" error
**Solution**: User cancelled the authorization. This is normal behavior.

### Issue 5: Token exchange fails
**Solution**:
- Verify client secret is correct
- Check that authorization code hasn't expired (typically 10 minutes)
- Ensure redirect URI matches exactly

## Implementation Status

### ✅ Completed Features
- [x] TikTok OAuth 2.0 authorization flow
- [x] Secure token exchange and validation
- [x] User profile retrieval and account creation
- [x] CSRF protection with state tokens
- [x] Error handling and user feedback
- [x] Database integration for connection storage
- [x] Login and registration UI buttons
- [x] Disconnect functionality
- [x] Session management

### 🔄 Backend Implementation
The TikTok OAuth system is fully implemented in:
- `server/tiktok-oauth.ts` - Main OAuth handling
- `server/routes.ts` - Route registration
- `client/src/pages/auth-page.tsx` - Frontend UI
- Database schema supports TikTok platform

### 📝 Next Steps
1. Configure TikTok Developer Console with the settings above
2. Add environment variables to Replit Secrets
3. Test the OAuth flow end-to-end
4. Monitor for any authentication issues

## Support

For issues with TikTok OAuth setup:
1. Check the TikTok for Developers documentation
2. Verify all environment variables are correctly set
3. Review browser developer console for error messages
4. Check server logs for detailed error information

The TikTok OAuth integration is now ready for use once the TikTok Developer Console is properly configured!