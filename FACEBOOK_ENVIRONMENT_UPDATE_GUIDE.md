# Facebook Environment Variables Update Guide

## Current Status
- ❌ Facebook OAuth showing "app isn't available" error
- ❌ Server using OLD Facebook app: 1047906810652246
- ✅ NEW Facebook app created and working: 1420319199160179

## Required Action
Update these environment variables in your **Replit Secrets tab**:

### Step 1: Open Secrets Tab
- Click the lock icon (🔒) in the left sidebar of your Replit project

### Step 2: Update Facebook Client ID
- Find: `FACEBOOK_CLIENT_ID`
- Change from: `1047906810652246`
- Change to: `1420319199160179`

### Step 3: Update Facebook Client Secret
- Find: `FACEBOOK_CLIENT_SECRET`
- Change from: (old secret)
- Change to: `3f1517707fb4ff0240ffad674cc41cb1`

### Step 4: Verify Update
After updating, visit: `/debug-oauth` in your browser
- Should show: "✅ Using NEW Facebook App"
- Facebook login/register will work immediately

## Why This Is Needed
- The new Facebook app (1420319199160179) is properly configured
- The old app (1047906810652246) has persistent configuration issues
- Environment variables control which app the server uses
- No code changes needed - just environment variable update

## Test Status
- ✅ New app credentials verified working
- ✅ OAuth redirect URIs configured correctly
- ✅ Facebook Graph API access confirmed
- ⏳ Waiting for environment variable update