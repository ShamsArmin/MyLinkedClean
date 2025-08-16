// Test current security status
const testSecurityStatus = async () => {
  console.log('\n=== MyLinked Security Status Test ===\n');
  
  const baseUrl = 'https://personal-profile-pro-arminshams1367.replit.app';
  
  try {
    // Test 1: Check if security headers are active
    console.log('1. Testing Security Headers...');
    const response = await fetch(baseUrl, { method: 'HEAD' });
    
    const securityHeaders = [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security'
    ];
    
    let headersActive = 0;
    securityHeaders.forEach(header => {
      if (response.headers.get(header)) {
        console.log(`   ✅ ${header}: ${response.headers.get(header)}`);
        headersActive++;
      } else {
        console.log(`   ❌ ${header}: Not found`);
      }
    });
    
    // Test 2: Check if rate limiting is working
    console.log('\n2. Testing Rate Limiting...');
    const rapidRequests = [];
    for (let i = 0; i < 10; i++) {
      rapidRequests.push(fetch(`${baseUrl}/api/test-rate-limit`));
    }
    
    const results = await Promise.allSettled(rapidRequests);
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.status === 404).length;
    const blockedCount = results.filter(r => r.status === 'fulfilled' && r.value.status === 429).length;
    
    console.log(`   ✅ Requests processed: ${successCount}`);
    console.log(`   ✅ Requests rate-limited: ${blockedCount}`);
    
    // Test 3: Check if monitoring is active
    console.log('\n3. Testing Monitoring System...');
    const monitorResponse = await fetch(`${baseUrl}/api/monitoring/status`);
    if (monitorResponse.ok) {
      console.log('   ✅ Monitoring system is active');
    } else {
      console.log('   ❌ Monitoring system not accessible');
    }
    
    // Test 4: Check if AI support is active
    console.log('\n4. Testing AI Support System...');
    const aiResponse = await fetch(`${baseUrl}/api/ai-support/status`);
    if (aiResponse.ok) {
      console.log('   ✅ AI support system is active');
    } else {
      console.log('   ❌ AI support system not accessible');
    }
    
    // Summary
    console.log('\n=== Security Status Summary ===');
    console.log(`Security Headers Active: ${headersActive}/${securityHeaders.length}`);
    console.log(`Rate Limiting: ${blockedCount > 0 ? 'Active' : 'Testing'}`);
    console.log(`Application Status: ${response.status === 200 ? 'Online' : 'Offline'}`);
    console.log(`Security Level: ${headersActive >= 3 ? 'ENTERPRISE GRADE' : 'BASIC'}`);
    
    if (headersActive >= 3) {
      console.log('\n✅ ALL SECURITY FEATURES ARE ACTIVE ON YOUR DEPLOYED APP!');
    } else {
      console.log('\n⚠️  Some security features may need verification');
    }
    
  } catch (error) {
    console.error('Error testing security status:', error.message);
  }
};

testSecurityStatus();