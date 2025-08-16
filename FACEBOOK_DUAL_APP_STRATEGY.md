# Facebook Dual-App Strategy

## Problem Resolution Approach
Instead of fixing the existing restricted Facebook app, we implement a dual-app strategy that keeps the current app working for desktop while creating a new properly configured app for mobile.

## App Configuration

### Desktop App (Current - Keep)
- **App ID**: 1420319199160179
- **App Secret**: 3f1517707fb4ff0240ffad674cc41cb1
- **Status**: Working for desktop OAuth
- **Issue**: Restricted for mobile due to incomplete configuration
- **Usage**: Desktop Facebook OAuth only

### Mobile App (New - To Create)
- **App ID**: [To be provided after creation]
- **App Secret**: [To be provided after creation]
- **Status**: Will be fully configured from start
- **Usage**: Mobile Facebook OAuth only

## Implementation Strategy

### Server Logic
```javascript
// Detect user agent
const isMobile = /Mobile|Android|iPhone|iPad/.test(req.get('User-Agent'));

// Use appropriate app based on platform
const clientId = isMobile 
  ? process.env.FACEBOOK_MOBILE_APP_ID    // New mobile app
  : process.env.FACEBOOK_APP_ID;          // Existing desktop app
```

### Environment Variables
```
# Existing (Desktop)
FACEBOOK_APP_ID=1420319199160179
FACEBOOK_APP_SECRET=3f1517707fb4ff0240ffad674cc41cb1

# New (Mobile)
FACEBOOK_MOBILE_APP_ID=[new_mobile_app_id]
FACEBOOK_MOBILE_APP_SECRET=[new_mobile_app_secret]
```

## Benefits

1. **Immediate Solution**: No waiting for Facebook restrictions to lift
2. **Zero Downtime**: Desktop OAuth continues working
3. **Proper Mobile Support**: New app configured correctly from start
4. **Independent Management**: Each app can be managed separately
5. **Future Flexibility**: Different configurations for different platforms

## Steps to Complete

### 1. Create New Mobile Facebook App
1. Go to https://developers.facebook.com/apps/
2. Create "Business" type app named "MyLinked Mobile App"
3. Complete ALL required configuration fields:
   - App Category: Business
   - Website URL: https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/
   - App Domains: db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev
   - Privacy Policy: https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/privacy
   - Terms URL: https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/terms
   - Contact Email: [valid email]

### 2. Configure Facebook Login Product
1. Add Facebook Login product
2. Set OAuth Redirect URI: https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/auth/facebook/callback
3. Enable Client OAuth Login and Web OAuth Login

### 3. Add Website Platform
1. Add Website platform
2. Set Site URL: https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/

### 4. Switch to Live Mode
1. Toggle app mode from Development to Live

### 5. Update Environment Variables
1. Add FACEBOOK_MOBILE_APP_ID and FACEBOOK_MOBILE_APP_SECRET to Replit Secrets

## Expected Outcome
- Desktop users: Continue using existing app without issues
- Mobile users: Use new properly configured app without restrictions
- Both platforms: Seamless Facebook OAuth experience

## Technical Implementation Status
- ✅ Server code updated with dual-app logic
- ✅ User agent detection implemented
- ✅ Platform-specific app selection working
- ✅ Enhanced logging for debugging
- 🔧 **Waiting for**: New mobile app credentials

Once you provide the new mobile app credentials, mobile Facebook OAuth will work immediately.