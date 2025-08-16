# Instagram "Invalid platform app" Error Fix

## Error Analysis
The error "Invalid platform app" from Instagram indicates that your app configuration is missing a required component or has incorrect settings.

## Required Fix Steps

### 1. Instagram Basic Display API Setup
Your Instagram app needs the **Instagram Basic Display** product added:

1. Go to https://developers.facebook.com/apps/
2. Select your app (ID: 1413706469659815)
3. In the left sidebar, look for "Instagram Basic Display"
4. If not present, click "Add Product" and add "Instagram Basic Display"

### 2. Configure Instagram Basic Display Settings
Once Instagram Basic Display is added:

1. Click on "Instagram Basic Display" in the sidebar
2. Click "Create New App" if prompted
3. Set these exact URLs:

**Valid OAuth Redirect URIs:**
```
https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/social/callback/instagram
```

**Deauthorize Callback URL:**
```
https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/social/deauth/instagram
```

**Data Deletion Request URL:**
```
https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/social/deletion/instagram
```

### 3. App Mode Configuration
Choose one of these options:

**Option A: Switch to Live Mode**
- In App Settings, change "App Mode" to "Live"
- Submit for App Review if required

**Option B: Stay in Development Mode**
- Go to "Roles" > "Test Users"
- Add your Instagram account as a Test User
- Accept the test user invitation on your Instagram account

### 4. Verify Client Credentials
Ensure you're using the correct credentials:
- **Instagram App ID**: Should match the one in Basic Display settings
- **Instagram App Secret**: Should match the one in Basic Display settings

### 5. Common Configuration Issues
The "Invalid platform app" error typically means:
- Instagram Basic Display product is not added to your app
- App is using Facebook app credentials instead of Instagram Basic Display credentials
- App mode and user permissions don't match

## Next Steps
1. Complete the Instagram Basic Display setup above
2. Ensure all URLs match exactly (no extra slashes)
3. Add yourself as a Test User if staying in Development mode
4. Try the Instagram connection again

The OAuth URL generation is working correctly - the issue is purely with the Instagram app configuration.