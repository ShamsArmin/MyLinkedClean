# Facebook Desktop App Configuration Guide

## Complete Setup Steps for App ID: 1420319199160179

Follow these **exact steps** to configure your desktop Facebook app to work for both desktop and mobile users:

### Step 1: Access Facebook Developer Console
1. Go to https://developers.facebook.com/
2. Click "My Apps" in top navigation
3. Select your app "MyLinked App" (ID: 1420319199160179)

### Step 2: Basic Settings Configuration
Navigate to **Settings > Basic** and fill in these **required fields**:

```
App Name: MyLinked App
App ID: 1420319199160179 (already set)
App Secret: [already configured]
Category: Business
Website URL: https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/
Privacy Policy URL: https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/privacy
Terms of Service URL: https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/terms
Contact Email: [your email address]
App Domains: db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev
```

**Important**: Remove `https://` from App Domains field - use only the domain name.

### Step 3: Add Website Platform
1. Scroll down to **Add Platform** section
2. Click **Add Platform** button
3. Select **Website**
4. Enter Site URL: `https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/`

### Step 4: Add Facebook Login Product
1. In left sidebar, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Select **Web** platform
4. This will add Facebook Login to your products list

### Step 5: Configure Facebook Login Settings
1. Navigate to **Products > Facebook Login > Settings**
2. Configure these settings:

**Client OAuth Login**: ✅ ON
**Web OAuth Login**: ✅ ON
**Force Web OAuth Reauthentication**: ❌ OFF
**Embedded Browser OAuth Login**: ✅ ON
**Use Strict Mode for Redirect URIs**: ✅ ON

**Valid OAuth Redirect URIs**:
```
https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/auth/facebook/callback
```

### Step 6: Switch to Live Mode
1. In top navigation, you'll see a toggle switch
2. Switch from **Development** to **Live** mode
3. Facebook may ask you to review app information - click through the prompts

### Step 7: App Review (if prompted)
If Facebook shows an app review screen:
1. **Skip** any advanced permissions
2. **Accept** basic public profile and email permissions
3. Click **Submit for Review** or **Go Live**

### Step 8: Verify Configuration
After completing setup, verify these items are configured:

✅ App Name: MyLinked App
✅ Category: Business  
✅ Website URL: Your domain
✅ App Domains: Your domain (without https)
✅ Privacy Policy URL: Your privacy page
✅ Terms of Service URL: Your terms page
✅ Contact Email: Your email
✅ Facebook Login product added
✅ Valid OAuth Redirect URI configured
✅ Live Mode enabled

## Expected Results After Configuration

**Desktop Users**: ✅ Facebook login works immediately
**Mobile Users**: ✅ Facebook login works immediately (using same desktop app)
**No more errors**: Both "Connection denied" and "Feature Unavailable" errors resolved

## Troubleshooting

**If you see "Connection denied"**:
- Check App Domains field (no https://)
- Verify Website platform is added
- Confirm OAuth redirect URI is exact match

**If you see "Feature Unavailable"**:
- Ensure app is in Live Mode
- Check all required basic information is filled
- Verify Facebook Login product is added

**If login still fails**:
- Wait 5-10 minutes for Facebook changes to propagate
- Clear browser cache and test again
- Check that contact email is verified in Facebook

## Important Notes

1. **Single App Strategy**: Your server now uses this desktop app for ALL users (desktop + mobile)
2. **No Mobile App Needed**: The restricted mobile app (1479892119839281) is completely bypassed
3. **Immediate Fix**: Once configured, both platforms work immediately - no waiting for Facebook review
4. **Domain Updates**: If your Replit domain changes, update the URLs in Facebook settings

## Configuration Checklist

Before testing, ensure you've completed:
- [ ] Basic information filled (name, category, website, privacy, terms, email)
- [ ] App domains added (without https)
- [ ] Website platform added with site URL
- [ ] Facebook Login product added
- [ ] OAuth redirect URI configured
- [ ] App switched to Live Mode
- [ ] All settings saved

Once all items are checked, your Facebook OAuth will work on both desktop and mobile devices immediately.