# How to Add A Record and TXT Record from Replit to GoDaddy

## Step 1: Get DNS Records from Replit

After creating your new deployment:

1. Go to your Replit project
2. Click **Deployments** tab
3. Click **Settings** tab
4. Click **Link a domain**
5. Enter: `www.mylinked.app`
6. Replit will show you something like this:

```
Add these DNS records to your domain provider:

A Record:
Name: www
Value: 123.456.789.100 (example IP)
TTL: 3600

TXT Record:
Name: www
Value: replit-verification=abc123def456 (example verification code)
TTL: 3600
```

## Step 2: Add A Record to GoDaddy

1. Go to GoDaddy DNS Management
2. Click **Add Record**
3. Select **A** from dropdown
4. Fill in:
   - **Name**: `www`
   - **Value**: `[IP address from Replit]` (e.g., 123.456.789.100)
   - **TTL**: `1 Hour` (default)
5. Click **Save**

## Step 3: Add TXT Record to GoDaddy

1. Still in GoDaddy DNS Management
2. Click **Add Record** again
3. Select **TXT** from dropdown
4. Fill in:
   - **Name**: `www`
   - **Value**: `[verification code from Replit]` (e.g., replit-verification=abc123def456)
   - **TTL**: `1 Hour` (default)
5. Click **Save**

## Step 4: Verify Records Were Added

After adding both records, you should see:

```
Your DNS Records:
- A Record: www → 123.456.789.100
- TXT Record: www → replit-verification=abc123def456
- CNAME: zb909834657 → zmverify.zoho.eu (keep this)
- CNAME: _domainconnect → _domainconnect.gd.domaincontrol.com (keep this)
```

## Step 5: Wait for Verification

1. Go back to Replit deployment settings
2. Wait for DNS propagation (can take 1-48 hours)
3. Replit will show "Verified" when ready
4. Test your domain: `https://www.mylinked.app`

## Important Notes

- **Don't delete** existing CNAME records (Zoho Mail, domain services)
- **Use exact values** from Replit - don't modify IP addresses or verification codes
- **Both records required** - A record for routing, TXT record for verification
- **TTL can be 1 Hour** - this is fine for testing

## Troubleshooting

If domain doesn't work after 48 hours:
1. Check if both A and TXT records were added correctly
2. Verify Replit shows "Verified" status
3. Test with DNS checker tools
4. Contact Replit support with screenshots of your DNS records

## Example Final DNS Setup

```
Type    Name                Value
A       www                 123.456.789.100
TXT     www                 replit-verification=abc123def456
CNAME   zb909834657         zmverify.zoho.eu
CNAME   _domainconnect      _domainconnect.gd.domaincontrol.com
NS      @                   ns67.domaincontrol.com
NS      @                   ns68.domaincontrol.com
SOA     @                   Primary nameserver info
```

The key is using the **exact IP address and verification code** that Replit provides for your specific deployment.