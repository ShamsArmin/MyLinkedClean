# OAuth Setup Guide for MyLinked

This guide will help you set up OAuth authentication for Google, Facebook, X (Twitter), and GitHub so users can register and login using these social platforms.

## Required Environment Variables

Add these to your Replit Secrets:

### Google OAuth
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Facebook OAuth  
```
FACEBOOK_CLIENT_ID=your_facebook_app_id
FACEBOOK_CLIENT_SECRET=your_facebook_app_secret
```

### X (Twitter) OAuth
```
TWITTER_CLIENT_ID_NEW=your_twitter_client_id
TWITTER_CLIENT_SECRET_NEW=your_twitter_client_secret
```

### GitHub OAuth
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Setup Instructions

### 1. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URI: `https://your-replit-url.replit.app/api/auth/google/callback`
7. Copy Client ID and Client Secret to your Replit Secrets

### 2. Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select existing one
3. Add "Facebook Login" product
4. In Settings → Basic, copy App ID and App Secret
5. In Facebook Login → Settings, add redirect URI: `https://your-replit-url.replit.app/api/auth/facebook/callback`
6. Add your domain to App Domains
7. Copy App ID and App Secret to your Replit Secrets

### 3. X (Twitter) OAuth Setup
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app or select existing one
3. Go to App Settings → User authentication settings
4. Enable OAuth 2.0
5. Set callback URI: `https://your-replit-url.replit.app/api/auth/twitter/callback`
6. Copy Client ID and Client Secret to your Replit Secrets

### 4. GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in application details
4. Set Authorization callback URL: `https://your-replit-url.replit.app/api/auth/github/callback`
5. Copy Client ID and Client Secret to your Replit Secrets

## Testing OAuth

Once configured, users can:
1. Go to `/auth` page
2. Click any of the OAuth buttons:
   - "Continue with Google"
   - "Continue with Facebook" 
   - "Twitter"
   - "GitHub"
3. Complete the OAuth flow on the provider's site
4. Get automatically registered and logged in

## Features

- **Auto-registration**: New users are automatically created with profile data from OAuth providers
- **Profile photos**: User profile images are automatically imported from social accounts
- **Email handling**: Email addresses are imported when available (Twitter doesn't provide emails)
- **Secure**: All OAuth flows use proper state management and secure token exchange

## Current Status

The OAuth system is fully implemented and ready to use once you provide the API credentials in your Replit Secrets.