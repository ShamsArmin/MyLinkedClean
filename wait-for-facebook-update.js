// Wait for Facebook environment variables to be updated
const EXPECTED_ID = '1420319199160179';

function checkEnvironment() {
  const currentId = process.env.FACEBOOK_CLIENT_ID;
  
  console.log('\n=== Facebook Environment Status ===');
  console.log('Current ID:', currentId);
  console.log('Expected ID:', EXPECTED_ID);
  
  if (currentId === EXPECTED_ID) {
    console.log('✅ SUCCESS: Environment variables updated!');
    console.log('Facebook OAuth will now work correctly');
    return true;
  } else {
    console.log('❌ PENDING: Update required in Secrets tab');
    console.log('Update FACEBOOK_CLIENT_ID to:', EXPECTED_ID);
    console.log('Update FACEBOOK_CLIENT_SECRET to: 3f1517707fb4ff0240ffad674cc41cb1');
    return false;
  }
}

// Monitor every 10 seconds
function startMonitoring() {
  console.log('Monitoring Facebook environment variables...');
  
  const interval = setInterval(() => {
    if (checkEnvironment()) {
      console.log('Environment update detected - stopping monitor');
      clearInterval(interval);
    }
  }, 10000);
  
  // Initial check
  checkEnvironment();
}

startMonitoring();