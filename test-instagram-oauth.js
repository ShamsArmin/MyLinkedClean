// Test Instagram OAuth URL generation
const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const BASE_URL = process.env.BASE_URL;

console.log('Instagram OAuth Test:');
console.log('CLIENT_ID:', INSTAGRAM_CLIENT_ID ? 'Set' : 'Missing');
console.log('BASE_URL:', BASE_URL);

if (INSTAGRAM_CLIENT_ID && BASE_URL) {
  const authUrl = new URL('https://api.instagram.com/oauth/authorize');
  authUrl.searchParams.set('client_id', INSTAGRAM_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', BASE_URL + '/api/social/callback/instagram');
  authUrl.searchParams.set('scope', 'user_profile,user_media');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', 'test_state_123');
  
  console.log('\nGenerated Instagram OAuth URL:');
  console.log(authUrl.toString());
  console.log('\nTo test: Click Connect button for Instagram in your dashboard');
} else {
  console.log('Missing required configuration');
}