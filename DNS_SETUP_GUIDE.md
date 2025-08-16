# How to Configure DNS for MyLinked Domain

## Step 1: Find Your Domain Registrar
Your domain `mylinked.app` was purchased from one of these providers:
- GoDaddy
- Namecheap 
- Cloudflare
- Google Domains
- Other registrar

## Step 2: Access DNS Settings

### For GoDaddy:
1. Log into GoDaddy.com
2. Go to "My Products" → "Domains"
3. Click "DNS" next to mylinked.app
4. Click "Manage DNS"

### For Namecheap:
1. Log into Namecheap.com
2. Go to "Domain List"
3. Click "Manage" next to mylinked.app
4. Go to "Advanced DNS" tab

### For Cloudflare:
1. Log into Cloudflare.com
2. Select mylinked.app domain
3. Go to "DNS" tab

## Step 3: Delete Wrong Records
Look for and DELETE these records:
- **A Record**: @ or mylinked.app → 15.197.142.173
- **A Record**: @ or mylinked.app → 3.33.152.147
- Any other A records for the root domain

## Step 4: Add Correct CNAME Records

### Add Record 1:
- **Type**: CNAME
- **Name**: @ (or leave blank for root)
- **Value**: personal-profile-pro-arminshams1367.replit.app
- **TTL**: 300 seconds (or Auto)

### Add Record 2:
- **Type**: CNAME  
- **Name**: www
- **Value**: personal-profile-pro-arminshams1367.replit.app
- **TTL**: 300 seconds (or Auto)

## Step 5: Alternative if CNAME @ Doesn't Work

Some registrars don't allow CNAME for root domain. If you get an error:

### Keep the CNAME for www:
- **Type**: CNAME
- **Name**: www
- **Value**: personal-profile-pro-arminshams1367.replit.app

### Add URL Forwarding for root:
- **Type**: URL Redirect/Forwarding
- **From**: mylinked.app
- **To**: https://www.mylinked.app
- **Redirect Type**: 301 Permanent

## Step 6: Save and Test
1. Click "Save" or "Save Changes"
2. Wait 15-30 minutes for DNS propagation
3. Test: https://mylinked.app
4. Test: https://www.mylinked.app

## DNS Values Summary:
**DELETE**: All A records pointing to wrong IPs
**ADD**: CNAME records pointing to your Replit app

## Need Help Finding Your Registrar?
Check your email for domain purchase confirmation, or use whois lookup tools online.

## Expected Result:
Both mylinked.app and www.mylinked.app will load your MyLinked application with proper SSL certificates.