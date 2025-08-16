# Create New Facebook App - Step by Step Guide

## Why Create a New App?
Your current Facebook app (1420319199160179) has persistent restrictions that can't be resolved by toggling modes. A fresh app will work immediately.

## Step-by-Step Instructions

### 1. Create New Facebook App
1. Go to: https://developers.facebook.com/apps/create/
2. Choose **"Business"** as app type
3. Fill in app details:
   - **App Name**: MyLinked Social
   - **App Contact Email**: Your email address
   - Click **"Create App"**

### 2. Configure Basic Settings
Once app is created, go to **"App Settings" → "Basic"**:
- **App Domains**: `mylinked.app`
- **Privacy Policy URL**: `https://www.mylinked.app/privacy-policy`
- **Terms of Service URL**: `https://www.mylinked.app/terms-of-service`
- **Category**: Business
- **Website URL**: `https://www.mylinked.app`

### 3. Add Facebook Login Product
1. Go to **"Products"** (left sidebar)
2. Click **"+ Add Product"**
3. Find **"Facebook Login"** and click **"Set up"**
4. In Facebook Login settings:
   - **Valid OAuth Redirect URIs**: `https://www.mylinked.app/api/auth/facebook/callback`
   - **Deauthorize Callback URL**: `https://www.mylinked.app/api/social/facebook/deauthorize`
   - **Data Deletion Request URL**: `https://www.mylinked.app/api/social/facebook/data-deletion`
   - Save changes

### 4. Switch to Live Mode
1. Go to **"App Settings" → "Basic"**
2. Find **"App Mode"** section (usually at bottom)
3. Toggle from **"Development"** to **"Live"**
4. Confirm the switch

### 5. Get App Credentials
1. In **"App Settings" → "Basic"**
2. Copy the **App ID** and **App Secret**
3. You'll need these for the next step

### 6. Update MyLinked Environment Variables
Once you have the new credentials, I'll update them in the system.

## What to Share With Me
After creating the app, share:
- **New App ID** (from Basic settings)
- **New App Secret** (from Basic settings)

## Expected Result
The new app will work immediately without any "Feature Unavailable" errors.

## Ready to Start?
Let me know when you're ready to create the new app, and I'll guide you through each step!