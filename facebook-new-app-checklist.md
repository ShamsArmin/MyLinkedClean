# Facebook New App Setup Checklist

## ✅ Step 1: Delete Old App
- Delete the old MyLinked app (1420319199160179) ✓ (User doing this)

## ✅ Step 2: Create New App
- Go to: https://developers.facebook.com/apps/create/
- Choose "Business" as app type
- App Name: "MyLinked" 
- Contact Email: Your email
- Click "Create App"

## ✅ Step 3: Basic Configuration
**App Settings → Basic:**
- App Domains: `mylinked.app`
- Privacy Policy URL: `https://www.mylinked.app/privacy-policy`
- Terms of Service URL: `https://www.mylinked.app/terms-of-service`
- Category: Business
- Website URL: `https://www.mylinked.app`

## ✅ Step 4: Add Facebook Login
- Products → Add Product → Facebook Login → Set up
- Valid OAuth Redirect URIs: `https://www.mylinked.app/api/auth/facebook/callback`
- Deauthorize Callback URL: `https://www.mylinked.app/api/social/facebook/deauthorize`
- Data Deletion Request URL: `https://www.mylinked.app/api/social/facebook/data-deletion`

## ✅ Step 5: Switch to Live Mode
- App Settings → Basic → App Mode → Toggle to "Live"

## ✅ Step 6: Get Credentials
- Copy App ID and App Secret from Basic settings
- Share with system for immediate update

## Expected Result
New app will work immediately without "Feature Unavailable" errors!