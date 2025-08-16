# Zoho Mail MX Records Setup

## Add These MX Records in Cloudflare

### Primary MX Record
```
Type: MX
Name: @
Content: mx.zoho.com
Priority: 10
```

### Secondary MX Record (Backup)
```
Type: MX
Name: @
Content: mx2.zoho.com
Priority: 20
```

### Optional Third MX Record
```
Type: MX
Name: @
Content: mx3.zoho.com
Priority: 50
```

## How to Add Each Record
1. Go to Cloudflare → DNS
2. Click "Add record"
3. Select "MX" as type
4. Name: @ (for root domain)
5. Content: mx.zoho.com (first record)
6. Priority: 10
7. Save
8. Repeat for mx2.zoho.com and mx3.zoho.com

## Additional Records (Recommended)
Also add these TXT records for better email delivery:

### SPF Record
```
Type: TXT
Name: @
Content: v=spf1 include:zoho.com ~all
```

### DMARC Record
```
Type: TXT
Name: _dmarc
Content: v=DMARC1; p=none; rua=mailto:your-email@mylinked.app
```

## Verification
After adding MX records:
1. Wait 15-30 minutes for DNS propagation
2. Test email delivery to your @mylinked.app address
3. Check Zoho Mail control panel for domain verification

Your @mylinked.app email should work normally after adding these MX records.