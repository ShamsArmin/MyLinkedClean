// Debug Instagram OAuth configuration
const fetch = require('node-fetch');

async function debugInstagramOAuth() {
  console.log('Instagram OAuth Debug Report:');
  console.log('============================');
  
  // Check environment variables
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  const baseUrl = process.env.BASE_URL;
  
  console.log('1. Environment Variables:');
  console.log(`   CLIENT_ID: ${clientId ? 'Set' : 'Missing'}`);
  console.log(`   CLIENT_SECRET: ${clientSecret ? 'Set' : 'Missing'}`);
  console.log(`   BASE_URL: ${baseUrl}`);
  
  if (!clientId || !clientSecret) {
    console.log('\n❌ Missing Instagram API credentials');
    return;
  }
  
  // Check redirect URI format
  const redirectUri = baseUrl + 'api/social/callback/instagram';
  console.log(`\n2. Redirect URI: ${redirectUri}`);
  
  // Generate test OAuth URL
  const authUrl = new URL('https://api.instagram.com/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', 'user_profile,user_media');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', 'test_state');
  
  console.log(`\n3. Generated OAuth URL:`);
  console.log(`   ${authUrl.toString()}`);
  
  // Check if Instagram app is configured correctly
  console.log(`\n4. Instagram App Configuration Check:`);
  console.log(`   - App must be in "Live" mode or you must be added as a Test User`);
  console.log(`   - Redirect URI must match exactly: ${redirectUri}`);
  console.log(`   - Valid OAuth redirect URIs must include this URL`);
  console.log(`   - Instagram Basic Display product must be added to your app`);
  
  console.log(`\n5. Common Issues:`);
  console.log(`   - App in Development mode but user not added as Test User`);
  console.log(`   - Redirect URI mismatch in Instagram app settings`);
  console.log(`   - Missing Instagram Basic Display product`);
  console.log(`   - App not submitted for review (if using business features)`);
  
  console.log(`\n6. Next Steps:`);
  console.log(`   - Visit Meta for Developers: developers.facebook.com`);
  console.log(`   - Check your Instagram Basic Display app configuration`);
  console.log(`   - Verify redirect URI matches exactly`);
  console.log(`   - Add yourself as a Test User if app is in Development mode`);
}

debugInstagramOAuth();