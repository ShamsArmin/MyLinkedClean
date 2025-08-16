// Quick check of current environment variables
async function checkEnv() {
  try {
    const response = await fetch('https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/facebook/debug');
    const data = await response.json();
    
    console.log('Current Facebook App Configuration:');
    console.log('App ID:', data.clientId);
    console.log('App Token Status:', data.appToken);
    console.log('App Name:', data.appDetails?.name);
    
    if (data.clientId === '1420319199160179') {
      console.log('✅ Environment variables updated - using NEW app');
      console.log('Facebook registration is now ready to use');
    } else {
      console.log('⏳ Still using old app - environment variables need updating');
      console.log('Expected: 1420319199160179');
      console.log('Current:', data.clientId);
    }
    
  } catch (error) {
    console.log('Error checking configuration:', error.message);
  }
}

checkEnv();