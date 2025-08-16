// Test current environment variables and OAuth flow
import fetch from 'node-fetch';

async function testCurrentConfig() {
  const baseUrl = 'https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev';
  
  console.log('🔍 Testing Current Facebook OAuth Configuration');
  console.log('Time:', new Date().toISOString());
  console.log('');
  
  try {
    // Test debug endpoint
    console.log('📝 Test 1: Checking debug endpoint...');
    const debugResponse = await fetch(`${baseUrl}/api/facebook/debug`);
    const debugData = await debugResponse.json();
    
    if (debugResponse.ok) {
      console.log('✅ Debug endpoint working');
      console.log('   Current App ID:', debugData.clientId);
      console.log('   App Token Status:', debugData.appToken);
      console.log('   App Name:', debugData.appDetails?.name || 'Unknown');
      
      // Check if using new credentials
      if (debugData.clientId === '1420319199160179') {
        console.log('🎉 NEW CREDENTIALS DETECTED!');
        console.log('   Successfully using new Facebook app');
      } else {
        console.log('⏳ Still using old credentials');
        console.log('   Waiting for environment variable update...');
      }
    } else {
      console.log('❌ Debug endpoint failed:', debugData.error);
    }
    
    // Test OAuth redirect
    console.log('📝 Test 2: Testing OAuth redirect...');
    const oauthResponse = await fetch(`${baseUrl}/api/auth/facebook`, {
      method: 'GET',
      redirect: 'manual'
    });
    
    if (oauthResponse.status === 302) {
      const location = oauthResponse.headers.get('location');
      if (location) {
        const url = new URL(location);
        const clientId = url.searchParams.get('client_id');
        
        console.log('✅ OAuth redirect working');
        console.log('   Redirect App ID:', clientId);
        
        if (clientId === '1420319199160179') {
          console.log('🎉 OAUTH USING NEW APP!');
          console.log('   Ready for user testing');
        } else {
          console.log('⏳ OAuth still using old app');
        }
      }
    } else {
      console.log('❌ OAuth redirect failed with status:', oauthResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
  
  console.log('');
  console.log('📋 Status Summary:');
  console.log('- Monitoring for environment variable updates');
  console.log('- Test pages available at /test-oauth and /test-oauth-advanced');
  console.log('- Ready to verify complete OAuth flow');
}

// Run test every 10 seconds to monitor changes
async function monitorChanges() {
  await testCurrentConfig();
  
  // Run once more after 30 seconds to catch updates
  setTimeout(async () => {
    console.log('\n🔄 Checking for updates...\n');
    await testCurrentConfig();
  }, 30000);
}

monitorChanges();