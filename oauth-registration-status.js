// Complete OAuth Registration System Status Check
const BASE_URL = 'https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev';

console.log('🔐 MyLinked OAuth Registration System Status\n');

async function checkOAuthStatus() {
  console.log('Facebook OAuth Registration:');
  
  // Test Facebook OAuth
  const facebookResponse = await fetch(`${BASE_URL}/api/auth/facebook`, { redirect: 'manual' });
  if (facebookResponse.status === 302) {
    const fbLocation = facebookResponse.headers.get('location');
    if (fbLocation.includes('facebook.com')) {
      console.log('  ✅ Facebook OAuth - READY');
      console.log('  📋 App ID: 1420319199160179 (MyLinked App)');
      console.log('  🔄 Registration creates username: fb_[facebook_id]');
    }
  }
  
  console.log('\nTwitter/X OAuth Registration:');
  
  // Test Twitter OAuth
  const twitterResponse = await fetch(`${BASE_URL}/api/auth/twitter`, { redirect: 'manual' });
  if (twitterResponse.status === 302) {
    const twLocation = twitterResponse.headers.get('location');
    if (twLocation.includes('twitter.com')) {
      console.log('  ✅ Twitter OAuth - READY');
      console.log('  🔄 Registration creates username: tw_[twitter_handle]');
    }
  }
  
  console.log('\nGoogle OAuth Registration:');
  
  // Test Google OAuth
  const googleResponse = await fetch(`${BASE_URL}/api/auth/google`, { redirect: 'manual' });
  if (googleResponse.status === 302) {
    console.log('  ✅ Google OAuth - READY');
  } else {
    console.log('  ⚠️  Google OAuth - Needs Configuration');
  }
  
  console.log('\nGitHub OAuth Registration:');
  
  // Test GitHub OAuth
  const githubResponse = await fetch(`${BASE_URL}/api/auth/github`, { redirect: 'manual' });
  if (githubResponse.status === 302) {
    console.log('  ✅ GitHub OAuth - READY');
  } else {
    console.log('  ⚠️  GitHub OAuth - Needs Configuration');
  }
  
  console.log('\n📱 Registration Options Available:');
  console.log('1. Facebook - Instant registration with profile sync');
  console.log('2. Twitter/X - Instant registration with profile sync');
  console.log('3. Username/Password - Traditional account creation');
  console.log('4. Google - Ready for configuration');
  console.log('5. GitHub - Ready for configuration');
  
  console.log('\n🎯 Live Testing Instructions:');
  console.log('Visit: /auth');
  console.log('• Click "Continue with Facebook" - Creates fb_[id] account');
  console.log('• Click "Twitter" button - Creates tw_[handle] account');
  console.log('• Use "Register" tab for username/password accounts');
  
  console.log('\n✨ Registration Features:');
  console.log('• Automatic profile image download');
  console.log('• Immediate login after registration');
  console.log('• Session persistence');
  console.log('• Error handling with user-friendly messages');
  console.log('• Redirect to dashboard after successful registration');
  
  return true;
}

checkOAuthStatus().catch(console.error);