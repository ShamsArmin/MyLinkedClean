// Force environment variable refresh and test
console.log('Checking if environment variables need manual refresh...');

// Test current environment
const currentFacebookId = process.env.FACEBOOK_CLIENT_ID;
const currentFacebookSecret = process.env.FACEBOOK_CLIENT_SECRET;

console.log('Current FACEBOOK_CLIENT_ID:', currentFacebookId);
console.log('Expected FACEBOOK_CLIENT_ID: 1420319199160179');

if (currentFacebookId === '1420319199160179') {
  console.log('✅ Environment variables are updated correctly');
  console.log('The server should now use the new Facebook app');
} else {
  console.log('⚠️ Environment variables still need updating in Secrets tab');
  console.log('Please update:');
  console.log('FACEBOOK_CLIENT_ID: 1420319199160179');
  console.log('FACEBOOK_CLIENT_SECRET: 3f1517707fb4ff0240ffad674cc41cb1');
}

// Test if app token works with new credentials
async function testNewCredentials() {
  const newAppId = '1420319199160179';
  const newAppSecret = '3f1517707fb4ff0240ffad674cc41cb1';
  
  try {
    const response = await fetch(`https://graph.facebook.com/oauth/access_token?client_id=${newAppId}&client_secret=${newAppSecret}&grant_type=client_credentials`);
    const data = await response.json();
    
    if (data.access_token) {
      console.log('✅ New Facebook app credentials are working');
      console.log('Ready to use once environment variables are updated');
    } else {
      console.log('❌ Issue with new app credentials:', data);
    }
  } catch (error) {
    console.log('Error testing new credentials:', error.message);
  }
}

testNewCredentials();