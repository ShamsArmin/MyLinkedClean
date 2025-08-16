# Facebook OAuth Live Mode Setup Guide

## Current Issue
Your Facebook app (1420319199160179) shows "Feature Unavailable" because it's in Development Mode. To fix this, you need to switch it to Live Mode.

## Step-by-Step Solution

### 1. Go to Facebook Developer Console
- Visit: https://developers.facebook.com/apps/1420319199160179
- Log in with your Facebook account

### 2. Complete App Information
Go to "App Settings" → "Basic" and fill in:
- **App Name**: MyLinked App (already set)
- **App Category**: Business (already set)
- **Privacy Policy URL**: https://www.mylinked.app/privacy-policy
- **Terms of Service URL**: https://www.mylinked.app/terms-of-service
- **User Data Deletion**: https://www.mylinked.app/api/social/facebook/data-deletion

### 3. Add Facebook Login Product
- Go to "Products" → "Add Product"
- Click "Set up" on "Facebook Login"
- In Facebook Login settings:
  - **Valid OAuth Redirect URIs**: https://www.mylinked.app/api/auth/facebook/callback
  - **Deauthorize Callback URL**: https://www.mylinked.app/api/social/facebook/deauthorize
  - **Data Deletion Request URL**: https://www.mylinked.app/api/social/facebook/data-deletion

### 4. Configure App Domains
- In "App Settings" → "Basic"
- **App Domains**: mylinked.app
- **Website URL**: https://www.mylinked.app

### 5. Switch to Live Mode
- Go to "App Settings" → "Basic"
- Find "App Mode" section
- Toggle from "Development" to "Live"

### 6. Test OAuth Flow
After switching to Live Mode, test the Facebook login at:
https://www.mylinked.app/auth

## Alternative: Create New App
If the current app has restrictions, you can create a new Facebook app:

1. Go to https://developers.facebook.com/apps/create/
2. Choose "Consumer" or "Business"
3. Fill in app details
4. Follow steps 2-5 above
5. Update environment variables with new credentials

## Expected Result
Once in Live Mode, Facebook OAuth will work for all users without restrictions.

## Support
If you encounter issues, Facebook provides detailed error messages in their developer console.