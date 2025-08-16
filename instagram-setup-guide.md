# Instagram OAuth Connection Fix

## Current Configuration
- **Client ID**: 1413706469659815
- **Redirect URI**: https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/social/callback/instagram
- **OAuth URL**: Working correctly

## Issue Analysis
The OAuth URL generation is working, but the connection isn't completing. This indicates an Instagram app configuration issue.

## Required Instagram App Settings

### 1. Go to Meta for Developers
Visit: https://developers.facebook.com/apps/

### 2. Select Your Instagram App
App ID: 1413706469659815

### 3. Check Instagram Basic Display Settings
- Navigate to "Instagram Basic Display" in the left sidebar
- Verify these settings:

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

### 4. App Mode Configuration

**Option A: Live Mode (Recommended)**
- Switch app to "Live" mode
- Any Instagram user can connect

**Option B: Development Mode**
- Add yourself as a "Test User":
  1. Go to "Roles" > "Test Users"
  2. Click "Add Test Users"
  3. Add your Instagram account

### 5. Required Permissions
Ensure these permissions are enabled:
- `user_profile` - Basic profile information
- `user_media` - Access to user's media

## Testing Steps
1. Fix the app configuration above
2. Try connecting again from the dashboard
3. If you get permission errors, check the app mode and test user settings

## Common Error Messages
- "Invalid redirect URI" → Check exact URI match
- "App not authorized" → Switch to Live mode or add as Test User
- "Permission denied" → Check app permissions and scopes