// Facebook App Status Checker
const https = require('https');

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID || '2696553390542098';
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;

async function checkFacebookAppStatus() {
  console.log('🔍 Checking Facebook App Status...');
  console.log(`App ID: ${FACEBOOK_CLIENT_ID}`);
  
  if (!FACEBOOK_CLIENT_SECRET) {
    console.log('❌ Facebook Client Secret not found in environment variables');
    return;
  }

  try {
    // Check app token
    const appToken = `${FACEBOOK_CLIENT_ID}|${FACEBOOK_CLIENT_SECRET}`;
    const appDetailsUrl = `https://graph.facebook.com/v18.0/${FACEBOOK_CLIENT_ID}?access_token=${appToken}`;
    
    console.log('📡 Fetching app details from Facebook Graph API...');
    
    const response = await fetch(appDetailsUrl);
    const appData = await response.json();
    
    if (appData.error) {
      console.log('❌ Facebook API Error:', appData.error);
      
      if (appData.error.code === 190) {
        console.log('🔧 Fix: Check Facebook Client Secret in environment variables');
      } else if (appData.error.code === 102) {
        console.log('🔧 Fix: App may be in wrong mode or restricted');
      }
      
      return;
    }
    
    console.log('✅ Facebook App Details Retrieved:');
    console.log(`   Name: ${appData.name}`);
    console.log(`   Category: ${appData.category}`);
    console.log(`   Link: ${appData.link}`);
    console.log(`   ID: ${appData.id}`);
    
    // Check OAuth redirect URIs
    console.log('\n🌐 OAuth Configuration:');
    console.log('   Expected Redirect URI: https://www.mylinked.app/api/auth/facebook/callback');
    
    // Test OAuth URL generation
    const testOAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=https://www.mylinked.app/api/auth/facebook/callback&scope=public_profile&response_type=code&state=test123&display=page`;
    
    console.log('\n🧪 Test OAuth URL:');
    console.log(`   ${testOAuthUrl.substring(0, 100)}...`);
    
    // Recommendations
    console.log('\n📋 Configuration Checklist:');
    console.log('   ✅ App ID configured');
    console.log('   ✅ App Secret configured');
    console.log('   ⚠️  App Mode: Check if Live or Development');
    console.log('   ⚠️  OAuth Redirect URIs: Verify in Facebook Console');
    console.log('   ⚠️  Business Verification: Required for Live Mode unrestricted access');
    
    console.log('\n🔧 Next Steps:');
    console.log('   1. Go to Facebook Developer Console');
    console.log('   2. Check App Mode (Basic Settings)');
    console.log('   3. Verify OAuth Redirect URIs in Facebook Login product');
    console.log('   4. If Development Mode: Add yourself as developer');
    console.log('   5. If Live Mode: Complete Business Verification');
    
  } catch (error) {
    console.log('❌ Error checking Facebook app status:', error.message);
  }
}

// Run the check
checkFacebookAppStatus();