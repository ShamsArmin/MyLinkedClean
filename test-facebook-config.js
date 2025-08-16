// Test new Facebook app configuration
import fetch from 'node-fetch';

async function testFacebookConfig() {
  const appId = '1420319199160179';
  const appSecret = '3f1517707fb4ff0240ffad674cc41cb1';
  
  console.log('Testing new Facebook app configuration...');
  console.log('App ID:', appId);
  
  try {
    // Test 1: Get app access token
    const tokenResponse = await fetch(`https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`);
    const tokenData = await tokenResponse.json();
    
    if (tokenData.access_token) {
      console.log('✅ App access token obtained successfully');
      
      // Test 2: Verify app info
      const appResponse = await fetch(`https://graph.facebook.com/${appId}?access_token=${tokenData.access_token}`);
      const appData = await appResponse.json();
      
      if (appData.name) {
        console.log('✅ App verification successful');
        console.log('App Name:', appData.name);
        console.log('App Category:', appData.category || 'Not set');
      } else {
        console.log('❌ App verification failed:', appData);
      }
      
    } else {
      console.log('❌ Failed to get app access token:', tokenData);
    }
    
  } catch (error) {
    console.log('❌ Error testing Facebook config:', error.message);
  }
}

testFacebookConfig();