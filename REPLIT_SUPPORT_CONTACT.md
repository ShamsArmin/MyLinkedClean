# How to Contact Replit Support

## Method 1: Help Center (Recommended)
1. Go to https://replit.com/support
2. Click "Submit a Request" or "Contact Support"
3. Fill out the support form with your issue details

## Method 2: Discord Community
1. Join Replit Discord: https://discord.gg/replit
2. Go to #help channel
3. Ask your question about custom domain SSL configuration

## Method 3: In-App Support
1. In your Replit project, click the "?" icon (Help)
2. Select "Contact Support"
3. Fill out the support form

## Method 4: Email Support
- Email: support@replit.com
- Include your project details and issue description

## What to Tell Replit Support

**Subject:** Custom Domain SSL Certificate Configuration

**Message:**
```
Hello,

I need help configuring SSL certificate for my custom domain on Replit.

Project Details:
- Project: personal-profile-pro-arminshams1367
- Custom Domain: www.mylinked.app
- Current Status: DNS CNAME working, HTTPS failing

DNS Configuration (Already Working):
- GoDaddy DNS: www.mylinked.app → personal-profile-pro-arminshams1367.replit.app (CNAME)
- HTTP works correctly (redirects to HTTPS)
- HTTPS connection fails

Issue:
The DNS CNAME record is configured correctly and verified by GoDaddy support. However, HTTPS fails because the SSL certificate doesn't cover my custom domain. I need Replit to generate/configure SSL certificate for www.mylinked.app.

Request:
Please enable SSL certificate for www.mylinked.app on my deployment personal-profile-pro-arminshams1367.replit.app.

Thank you!
```

## Expected Response Time
- **Standard Support**: 24-48 hours
- **Discord Community**: Usually within a few hours
- **Priority Support**: If you have a paid plan, faster response

## Alternative: Cloudflare SSL Proxy
While waiting for Replit support, you can use Cloudflare as an immediate solution:

1. Add domain to Cloudflare
2. Keep existing CNAME record
3. Enable SSL proxy
4. Get immediate HTTPS coverage

## Follow-up Actions
After contacting support:
1. Reference the ticket number in future communications
2. Provide any additional information they request
3. Test the domain once they confirm SSL is configured

Your DNS configuration is correct - this is just an SSL certificate coverage issue that Replit support can resolve quickly.