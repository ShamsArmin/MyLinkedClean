# Email MX Records Setup for @mylinked.app

## MX Records by Email Provider

### Gmail/Google Workspace
If you use Gmail or Google Workspace for @mylinked.app:
```
Type: MX
Name: @
Content: aspmx.l.google.com
Priority: 1

Type: MX
Name: @
Content: alt1.aspmx.l.google.com
Priority: 5

Type: MX
Name: @
Content: alt2.aspmx.l.google.com
Priority: 5

Type: MX
Name: @
Content: alt3.aspmx.l.google.com
Priority: 10

Type: MX
Name: @
Content: alt4.aspmx.l.google.com
Priority: 10
```

### Microsoft 365/Outlook
If you use Microsoft 365 or Outlook:
```
Type: MX
Name: @
Content: mylinked-app.mail.protection.outlook.com
Priority: 0
```

### Other Email Providers
**Zoho Mail:**
```
Type: MX
Name: @
Content: mx.zoho.com
Priority: 10

Type: MX
Name: @
Content: mx2.zoho.com
Priority: 20
```

**ProtonMail:**
```
Type: MX
Name: @
Content: mail.protonmail.ch
Priority: 10

Type: MX
Name: @
Content: mailsec.protonmail.ch
Priority: 20
```

### Custom Email Provider
If you use a different provider, you'll need the MX records from:
- Your email hosting company
- Your domain registrar's email service
- Your web hosting provider

## How to Add MX Records
1. Go to Cloudflare → DNS
2. Click "Add record"
3. Select "MX" as type
4. Add each MX record with correct priority
5. Save all records

## Additional Email Records (Optional)
Some providers also require:
- **SPF Record** (TXT): For email authentication
- **DKIM Record** (TXT): For email signing
- **DMARC Record** (TXT): For email policy

Which email provider do you use for @mylinked.app emails?