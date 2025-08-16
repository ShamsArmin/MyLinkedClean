# Replit Custom Domain SSL Setup Guide

## Issue Identified: SSL Certificate Problem

The GoDaddy agent correctly identified that:
- DNS CNAME record is working (www.mylinked.app → personal-profile-pro-arminshams1367.replit.app)
- SSL certificate is not configured for your custom domain on Replit side
- HTTP works (redirects to HTTPS) but HTTPS fails

## Solution: Configure Custom Domain in Replit

### Step 1: Access Replit Deployment Settings
1. Go to your Replit project
2. Click on **"Deploy"** button in top right
3. Select **"Autoscale"** deployment
4. Go to deployment settings/configuration

### Step 2: Add Custom Domain
1. In deployment settings, look for **"Custom Domain"** section
2. Add your domain: `www.mylinked.app`
3. Replit will automatically generate SSL certificate for your domain
4. Wait for SSL certificate provisioning (usually 5-10 minutes)

### Step 3: Alternative Method - Via Replit Dashboard
1. Go to https://replit.com/~/deployments
2. Find your deployment: `personal-profile-pro-arminshams1367`
3. Click **"Settings"** or **"Configure"**
4. Add custom domain: `www.mylinked.app`
5. Enable SSL certificate auto-generation

### Step 4: Verify SSL Certificate
After adding the domain, Replit will:
- Generate SSL certificate automatically
- Configure HTTPS for your custom domain
- Update routing to handle both domains

## Expected Timeline
- **Domain Addition**: Immediate
- **SSL Certificate**: 5-10 minutes
- **Full Propagation**: 1-2 hours

## What Happens Next
1. Replit generates SSL certificate for www.mylinked.app
2. Your domain will serve HTTPS traffic properly
3. Both domains will work:
   - https://personal-profile-pro-arminshams1367.replit.app
   - https://www.mylinked.app

## Response to GoDaddy Agent
You can tell the GoDaddy agent:

> "Thank you for identifying the SSL issue. The DNS CNAME record is working correctly. I need to configure the SSL certificate on the Replit side to cover my custom domain. I'm adding www.mylinked.app to my Replit deployment configuration now, which will automatically generate the SSL certificate. This should resolve the HTTPS connection issue within 5-10 minutes."

## Troubleshooting
If you can't find the custom domain option:
1. Ensure your project is deployed (not just running)
2. Check if you have a paid Replit plan (custom domains may require paid plan)
3. Contact Replit support if the option is not available

## After SSL Certificate is Active
Test your domain:
- https://www.mylinked.app should work
- SSL certificate should be valid
- All OAuth redirects will work with custom domain

## Update Facebook App
Once SSL is working, update your Facebook app settings:
- Change redirect URI to: https://www.mylinked.app/api/auth/facebook/callback
- Update app domains to: mylinked.app
- Test Facebook OAuth with custom domain

This will completely resolve your domain connection issue.