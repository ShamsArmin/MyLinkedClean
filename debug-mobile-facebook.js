// Comprehensive Facebook Mobile App Analysis
import fetch from 'node-fetch';

async function analyzeMobileFacebookApp() {
  const mobileAppId = process.env.FACEBOOK_MOBILE_APP_ID;
  const mobileSecret = process.env.FACEBOOK_MOBILE_APP_SECRET;
  const desktopAppId = process.env.FACEBOOK_APP_ID;
  const desktopSecret = process.env.FACEBOOK_APP_SECRET;

  console.log('=== FACEBOOK MOBILE APP COMPREHENSIVE ANALYSIS ===\n');

  // 1. Check app token validity
  try {
    console.log('1. Testing App Token Generation:');
    const mobileTokenRes = await fetch(`https://graph.facebook.com/oauth/access_token?client_id=${mobileAppId}&client_secret=${mobileSecret}&grant_type=client_credentials`);
    const mobileTokenData = await mobileTokenRes.json();
    
    console.log(`Mobile App Token: ${mobileTokenData.access_token ? 'SUCCESS' : 'FAILED'}`);
    if (mobileTokenData.error) {
      console.log(`Mobile Error: ${mobileTokenData.error.message}`);
    }

    // 2. Check app metadata
    if (mobileTokenData.access_token) {
      console.log('\n2. Mobile App Metadata:');
      const appMetaRes = await fetch(`https://graph.facebook.com/${mobileAppId}?access_token=${mobileTokenData.access_token}`);
      const appMeta = await appMetaRes.json();
      
      console.log(`Name: ${appMeta.name || 'Not set'}`);
      console.log(`Category: ${appMeta.category || 'Not set'}`);
      console.log(`Status: ${appMeta.id ? 'Active' : 'Inactive'}`);
      
      // 3. Check app restrictions/review status
      console.log('\n3. App Permissions & Review Status:');
      const appPermRes = await fetch(`https://graph.facebook.com/${mobileAppId}/permissions?access_token=${mobileTokenData.access_token}`);
      const permData = await appPermRes.json();
      
      if (permData.data) {
        console.log('Available Permissions:', permData.data.map(p => p.permission).join(', '));
      } else {
        console.log('Permissions Error:', permData.error?.message || 'Unknown');
      }
    }

    // 4. Test OAuth URL generation
    console.log('\n4. OAuth URL Generation Test:');
    const redirectUri = 'https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev/api/auth/facebook/callback';
    const mobileOAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${mobileAppId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=public_profile&response_type=code&state=test&display=touch`;
    
    console.log('Mobile OAuth URL Generated Successfully');
    console.log(`URL Length: ${mobileOAuthUrl.length} characters`);

    // 5. Compare with desktop app
    console.log('\n5. Desktop vs Mobile App Comparison:');
    const desktopTokenRes = await fetch(`https://graph.facebook.com/oauth/access_token?client_id=${desktopAppId}&client_secret=${desktopSecret}&grant_type=client_credentials`);
    const desktopTokenData = await desktopTokenRes.json();
    
    console.log(`Desktop App Token: ${desktopTokenData.access_token ? 'SUCCESS' : 'FAILED'}`);
    
    if (desktopTokenData.access_token) {
      const desktopMetaRes = await fetch(`https://graph.facebook.com/${desktopAppId}?access_token=${desktopTokenData.access_token}`);
      const desktopMeta = await desktopMetaRes.json();
      console.log(`Desktop App Name: ${desktopMeta.name || 'Not set'}`);
    }

    // 6. Debug OAuth flow
    console.log('\n6. OAuth Flow Debug Information:');
    console.log(`Mobile Redirect URI: ${redirectUri}`);
    console.log(`Mobile App configured for: Touch display (mobile)`);
    console.log(`Scope requested: public_profile (minimal)`);

    // 7. Potential issues analysis
    console.log('\n7. POTENTIAL ISSUES ANALYSIS:');
    
    if (!mobileTokenData.access_token) {
      console.log('❌ CRITICAL: Mobile app credentials invalid');
    } else {
      console.log('✅ Mobile app credentials valid');
    }
    
    console.log('\nCommon mobile OAuth failure causes:');
    console.log('- App not in Live Mode (restricts non-developers)');
    console.log('- Missing Facebook Login product configuration');
    console.log('- Invalid OAuth redirect URIs in app settings');
    console.log('- App domains not configured correctly');
    console.log('- Business verification required for Live Mode');

  } catch (error) {
    console.error('Analysis failed:', error.message);
  }
}

analyzeMobileFacebookApp();