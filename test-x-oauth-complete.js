import fetch from 'node-fetch';

async function testXOAuthFlow() {
  const domain = process.env.BASE_URL || 'https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev';
  
  console.log('🔍 Testing X OAuth Complete Flow\n');
  
  try {
    // Test 1: Check X OAuth initiation endpoint
    console.log('1. Testing X OAuth initiation...');
    const initResponse = await fetch(`${domain}/api/auth/twitter`, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'User-Agent': 'X-OAuth-Test/1.0'
      }
    });
    
    console.log(`   Status: ${initResponse.status}`);
    console.log(`   Type: ${initResponse.headers.get('content-type')}`);
    
    if (initResponse.status === 302) {
      const location = initResponse.headers.get('location');
      console.log(`   ✓ Redirect to: ${location?.substring(0, 80)}...`);
      
      // Verify it's a Twitter OAuth URL
      if (location?.includes('twitter.com/i/oauth2/authorize')) {
        console.log('   ✓ Valid X OAuth authorization URL generated');
        
        // Check URL parameters
        const url = new URL(location);
        const params = {
          response_type: url.searchParams.get('response_type'),
          client_id: url.searchParams.get('client_id'),
          redirect_uri: url.searchParams.get('redirect_uri'),
          scope: url.searchParams.get('scope'),
          state: url.searchParams.get('state')
        };
        
        console.log('   OAuth Parameters:');
        Object.entries(params).forEach(([key, value]) => {
          console.log(`     ${key}: ${value || 'missing'}`);
        });
        
        // Verify required parameters
        const requiredParams = ['response_type', 'client_id', 'redirect_uri', 'scope', 'state'];
        const missingParams = requiredParams.filter(param => !params[param]);
        
        if (missingParams.length === 0) {
          console.log('   ✓ All required OAuth parameters present');
        } else {
          console.log(`   ❌ Missing parameters: ${missingParams.join(', ')}`);
        }
      } else {
        console.log('   ❌ Invalid OAuth URL generated');
      }
    } else {
      console.log(`   ❌ Expected 302 redirect, got ${initResponse.status}`);
      const text = await initResponse.text();
      console.log(`   Response: ${text.substring(0, 200)}...`);
    }
    
    console.log('\n2. Testing environment variables...');
    const hasClientId = process.env.TWITTER_CLIENT_ID_NEW || process.env.TWITTER_CLIENT_ID;
    const hasClientSecret = process.env.TWITTER_CLIENT_SECRET_NEW || process.env.TWITTER_CLIENT_SECRET;
    
    console.log(`   Client ID: ${hasClientId ? '✓ Present' : '❌ Missing'}`);
    console.log(`   Client Secret: ${hasClientSecret ? '✓ Present' : '❌ Missing'}`);
    
    if (hasClientId) {
      console.log(`   Client ID (masked): ${hasClientId.substring(0, 10)}...`);
    }
    
    console.log('\n3. Testing callback endpoint structure...');
    // Test callback with missing parameters to verify error handling
    const callbackResponse = await fetch(`${domain}/api/auth/twitter/callback`, {
      method: 'GET',
      redirect: 'manual'
    });
    
    console.log(`   Callback status: ${callbackResponse.status}`);
    if (callbackResponse.status === 302) {
      const location = callbackResponse.headers.get('location');
      console.log(`   ✓ Proper error handling: ${location}`);
      
      if (location?.includes('error=twitter_no_code')) {
        console.log('   ✓ Correct error handling for missing parameters');
      }
    }
    
    console.log('\n4. Summary:');
    console.log('   X OAuth implementation status:');
    
    const status = {
      initiation: initResponse.status === 302 ? '✓' : '❌',
      credentials: (hasClientId && hasClientSecret) ? '✓' : '❌',
      errorHandling: callbackResponse.status === 302 ? '✓' : '❌'
    };
    
    Object.entries(status).forEach(([check, result]) => {
      console.log(`     ${check}: ${result}`);
    });
    
    const allGood = Object.values(status).every(s => s === '✓');
    console.log(`\n   Overall Status: ${allGood ? '✅ READY' : '⚠️  NEEDS ATTENTION'}`);
    
    if (allGood) {
      console.log('\n🎉 X OAuth is properly configured and ready for use!');
      console.log('   Users can now register and login using X OAuth.');
    } else {
      console.log('\n⚠️  X OAuth needs configuration:');
      if (!hasClientId || !hasClientSecret) {
        console.log('   - Add TWITTER_CLIENT_ID_NEW and TWITTER_CLIENT_SECRET_NEW to Secrets');
      }
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

// Run the test
testXOAuthFlow();