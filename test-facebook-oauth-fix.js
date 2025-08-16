// Test Facebook OAuth configuration
const testFacebookOAuth = async () => {
  console.log('Testing Facebook OAuth Configuration...\n');
  
  const baseUrl = 'https://personal-profile-pro-arminshams1367.replit.app';
  
  try {
    // Test Facebook debug endpoint
    const debugResponse = await fetch(`${baseUrl}/api/facebook/debug`);
    const debugData = await debugResponse.json();
    
    console.log('Facebook App Configuration:');
    console.log('- Client ID:', debugData.clientId);
    console.log('- Base URL:', debugData.baseUrl);
    console.log('- Redirect URI:', debugData.redirectUri);
    console.log('- App Token:', debugData.appToken);
    console.log('- App Details:', debugData.appDetails);
    
    // Test Facebook OAuth URL generation
    const authResponse = await fetch(`${baseUrl}/api/auth/facebook`, {
      method: 'GET',
      redirect: 'manual'
    });
    
    if (authResponse.status === 302) {
      const location = authResponse.headers.get('location');
      console.log('\nFacebook OAuth URL Generated:');
      console.log('- Status:', authResponse.status);
      console.log('- Redirect URL:', location);
      
      if (location && location.includes('facebook.com')) {
        console.log('✅ Facebook OAuth initialization working');
      } else {
        console.log('❌ Facebook OAuth redirect failed');
      }
    } else {
      console.log('❌ Facebook OAuth endpoint failed:', authResponse.status);
    }
    
  } catch (error) {
    console.error('Facebook OAuth test failed:', error.message);
  }
};

testFacebookOAuth();