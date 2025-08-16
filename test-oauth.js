// Test OAuth URL generation for Instagram
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;

console.log('Testing OAuth Configuration:');
console.log('BASE_URL:', BASE_URL);
console.log('INSTAGRAM_CLIENT_ID:', INSTAGRAM_CLIENT_ID ? 'Set' : 'Missing');

if (INSTAGRAM_CLIENT_ID) {
  const authUrl = new URL('https://api.instagram.com/oauth/authorize');
  authUrl.searchParams.set('client_id', INSTAGRAM_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', BASE_URL + '/api/social/callback/instagram');
  authUrl.searchParams.set('scope', 'user_profile,user_media');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', 'test_state_123');
  
  console.log('Instagram OAuth URL:');
  console.log(authUrl.toString());
  console.log('\nYou can test this URL in a browser after logging into the dashboard.');
} else {
  console.log('Missing Instagram client ID - OAuth cannot be tested');
}