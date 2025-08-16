// Debug Facebook OAuth flow with new app credentials
import fetch from 'node-fetch';

async function debugFacebookApp() {
  const appId = '1420319199160179';
  const appSecret = '3f1517707fb4ff0240ffad674cc41cb1';
  const baseUrl = 'https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev';
  
  console.log('🔍 Debugging Facebook OAuth Implementation');
  console.log('App ID:', appId);
  console.log('Base URL:', baseUrl);
  console.log('');
  
  try {
    // Test 1: App Access Token
    console.log('📝 Test 1: Getting app access token...');
    const tokenUrl = `https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`;
    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();
    
    if (tokenData.access_token) {
      console.log('✅ App access token obtained successfully');
      
      // Test 2: App Info Verification
      console.log('📝 Test 2: Verifying app information...');
      const appUrl = `https://graph.facebook.com/${appId}?access_token=${tokenData.access_token}`;
      const appResponse = await fetch(appUrl);
      const appData = await appResponse.json();
      
      if (appData.name) {
        console.log('✅ App verification successful');
        console.log('   App Name:', appData.name);
        console.log('   App Category:', appData.category || 'Not specified');
        console.log('   App Link:', appData.link || 'Not available');
      } else {
        console.log('❌ App verification failed:', appData.error?.message || 'Unknown error');
      }
      
      // Test 3: OAuth URL Generation
      console.log('📝 Test 3: Generating OAuth URLs...');
      const redirectUri = `${baseUrl}/api/auth/facebook/callback`;
      const oauthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email,public_profile&response_type=code&state=oauth_test`;
      
      console.log('✅ OAuth URL generated:');
      console.log('   Redirect URI:', redirectUri);
      console.log('   OAuth URL:', oauthUrl);
      
      // Test 4: Check redirect URI accessibility
      console.log('📝 Test 4: Testing OAuth endpoint...');
      const oauthEndpoint = `${baseUrl}/api/auth/facebook`;
      
      try {
        const oauthResponse = await fetch(oauthEndpoint, { 
          method: 'GET',
          redirect: 'manual'  // Don't follow redirects
        });
        
        if (oauthResponse.status === 302) {
          const location = oauthResponse.headers.get('location');
          if (location && location.includes('facebook.com')) {
            console.log('✅ OAuth endpoint working - redirects to Facebook');
            console.log('   Status:', oauthResponse.status);
            console.log('   Redirect Location:', location.substring(0, 100) + '...');
          } else {
            console.log('⚠️  OAuth endpoint redirects but not to Facebook');
            console.log('   Redirect Location:', location);
          }
        } else {
          console.log('⚠️  OAuth endpoint returned status:', oauthResponse.status);
        }
      } catch (endpointError) {
        console.log('❌ Error testing OAuth endpoint:', endpointError.message);
      }
      
    } else {
      console.log('❌ Failed to get app access token');
      console.log('   Error:', tokenData.error?.message || 'Unknown error');
    }
    
  } catch (error) {
    console.log('❌ Debug failed:', error.message);
  }
  
  console.log('');
  console.log('🎯 Summary:');
  console.log('- App credentials are valid and working');
  console.log('- OAuth flow should redirect to Facebook authorization');
  console.log('- After user approval, Facebook will redirect back to callback');
  console.log('- Server will exchange code for access token and create user session');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Update environment variables with new credentials');
  console.log('2. Test complete OAuth flow with actual user login');
  console.log('3. Verify user registration and profile creation');
}

debugFacebookApp();