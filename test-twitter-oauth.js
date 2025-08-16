// Test Twitter OAuth configuration and setup
const BASE_URL = 'https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev';

console.log('🐦 Testing Twitter OAuth Configuration\n');

async function testTwitterOAuth() {
  console.log('Step 1: Testing Twitter OAuth Authorization URL');
  
  try {
    // Test Twitter OAuth endpoint
    const authResponse = await fetch(`${BASE_URL}/api/auth/twitter`, { 
      redirect: 'manual' 
    });
    
    if (authResponse.status === 302) {
      const location = authResponse.headers.get('location');
      if (location && location.includes('twitter.com')) {
        console.log('✅ Twitter authorization URL generated successfully');
        console.log(`   Redirect URL: ${location.substring(0, 80)}...`);
        
        // Extract client ID from URL for verification
        const urlParams = new URLSearchParams(location.split('?')[1]);
        const clientId = urlParams.get('client_id');
        console.log(`   Client ID: ${clientId}`);
        
        if (clientId) {
          console.log('✅ Twitter OAuth properly configured');
        }
      } else {
        console.log('❌ Invalid Twitter authorization URL');
        return false;
      }
    } else if (authResponse.status === 400) {
      const error = await authResponse.json();
      console.log('❌ Twitter OAuth not configured:', error.error);
      return false;
    } else {
      console.log(`❌ Unexpected response status: ${authResponse.status}`);
      return false;
    }
    
    console.log('\nStep 2: Verifying Twitter Callback Endpoint');
    
    // Test callback endpoint exists
    const callbackResponse = await fetch(`${BASE_URL}/api/auth/twitter/callback`, {
      redirect: 'manual'
    });
    
    if (callbackResponse.status !== 404) {
      console.log('✅ Twitter callback endpoint configured');
    } else {
      console.log('❌ Twitter callback endpoint missing');
      return false;
    }
    
    console.log('\nStep 3: Twitter Registration Flow Overview');
    console.log('Registration process:');
    console.log('1. User clicks "Register with Twitter/X"');
    console.log('2. Redirects to Twitter OAuth authorization');
    console.log('3. User authorizes application on Twitter');
    console.log('4. Twitter redirects back with authorization code');
    console.log('5. Server exchanges code for access token');
    console.log('6. Server fetches user profile from Twitter API');
    console.log('7. Server creates username: twitter_[twitter_username]');
    console.log('8. Server creates user account with Twitter data');
    console.log('9. User logged in and redirected to dashboard');
    
    console.log('\n✅ Twitter OAuth Configuration Complete');
    console.log('Ready for testing Twitter registration flow');
    
    return true;
    
  } catch (error) {
    console.log(`❌ Twitter OAuth test failed: ${error.message}`);
    return false;
  }
}

testTwitterOAuth();