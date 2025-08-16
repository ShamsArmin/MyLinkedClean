# Facebook New App Complete Configuration Guide

## Current Status
Your new Facebook app (2696553390542098) is created but showing "Feature Unavailable" error because it needs complete configuration.

## Missing Configuration Steps

### 1. Complete Basic App Information
Go to **App Settings → Basic** and ensure ALL fields are filled:
- ✅ App Name: MyLinked
- ✅ App ID: 2696553390542098
- ❌ **Display Name**: MyLinked
- ❌ **App Icon**: Upload a 1024x1024 PNG icon
- ❌ **Category**: Social
- ❌ **Business Use Case**: Select "Authenticate and request data from users"
- ❌ **App Domains**: mylinked.app
- ❌ **Privacy Policy URL**: https://www.mylinked.app/privacy-policy
- ❌ **Terms of Service URL**: https://www.mylinked.app/terms-of-service
- ❌ **Website URL**: https://www.mylinked.app

### 2. Configure Facebook Login Product Properly
1. Go to **Products → Facebook Login → Settings**
2. Configure these URLs:
   - **Valid OAuth Redirect URIs**: https://www.mylinked.app/api/auth/facebook/callback
   - **Deauthorize Callback URL**: https://www.mylinked.app/api/social/facebook/deauthorize
   - **Data Deletion Request URL**: https://www.mylinked.app/api/social/facebook/data-deletion
3. **Client OAuth Settings**:
   - ✅ Enable "Use Strict Mode for Redirect URIs"
   - ✅ Enable "Login from Devices"

### 3. Switch to Live Mode (Critical)
1. Go to **App Settings → Basic**
2. Find **App Mode** section at bottom
3. Toggle from **"Development"** to **"Live"**
4. You may be prompted to complete additional fields - fill them all

### 4. Data Use Checkup (Required for Live Mode)
1. Go to **App Review → Data Use Checkup**
2. Complete all required sections:
   - Explain how you use Facebook Login
   - Confirm data handling practices
   - Submit for review if required

### 5. App Icon Requirement
Facebook requires a proper app icon for Live Mode:
- Size: 1024x1024 pixels
- Format: PNG
- No text overlay
- Clear, professional image

## Quick Fix Steps (In Order)
1. **Add App Icon** (use MyLinked logo or similar)
2. **Fill all Basic Information fields**
3. **Complete Facebook Login configuration**
4. **Switch to Live Mode**
5. **Complete Data Use Checkup**

## Expected Timeline
- Configuration: 10-15 minutes
- Facebook review (if required): 1-3 business days
- Live Mode activation: Immediate after approval

## Alternative Solution
If Facebook review takes too long, we can:
1. Keep app in Development Mode
2. Add your Facebook account as a Test User
3. OAuth will work for test users immediately

Let me know which approach you prefer!