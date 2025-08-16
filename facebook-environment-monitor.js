import fs from 'fs';

async function monitorEnvironmentVariables() {
    console.log('=== Facebook App Environment Monitor ===\n');
    
    // Check current environment variables
    const facebookAppId = process.env.FACEBOOK_APP_ID;
    const facebookAppSecret = process.env.FACEBOOK_APP_SECRET;
    const facebookMobileAppId = process.env.FACEBOOK_MOBILE_APP_ID;
    const facebookMobileAppSecret = process.env.FACEBOOK_MOBILE_APP_SECRET;
    
    console.log('Current Environment Variables:');
    console.log(`FACEBOOK_APP_ID: ${facebookAppId ? `${facebookAppId} (Desktop)` : 'Not set'}`);
    console.log(`FACEBOOK_APP_SECRET: ${facebookAppSecret ? 'Set' : 'Not set'}`);
    console.log(`FACEBOOK_MOBILE_APP_ID: ${facebookMobileAppId ? `${facebookMobileAppId} (Mobile)` : 'Not set'}`);
    console.log(`FACEBOOK_MOBILE_APP_SECRET: ${facebookMobileAppSecret ? 'Set' : 'Not set'}\n`);
    
    // Test desktop app configuration
    if (facebookAppId && facebookAppSecret) {
        console.log('Testing Desktop App (1420319199160179):');
        await testFacebookApp(facebookAppId, facebookAppSecret, 'desktop');
    }
    
    // Test mobile app configuration
    if (facebookMobileAppId && facebookMobileAppSecret) {
        console.log('\nTesting Mobile App (1479892119839281):');
        await testFacebookApp(facebookMobileAppId, facebookMobileAppSecret, 'mobile');
    }
    
    console.log('\n=== Recommendations ===');
    
    if (!facebookMobileAppId || !facebookMobileAppSecret) {
        console.log('⚠️  Mobile app credentials missing - using desktop app for all requests');
    }
    
    console.log('\n=== Current OAuth URLs ===');
    const baseUrl = 'https://db7e7862-12d2-42a3-94ed-8dde37129e5e-00-1t9k44b80d2ae.spock.replit.dev';
    
    if (facebookAppId) {
        const desktopUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${facebookAppId}&redirect_uri=${encodeURIComponent(baseUrl + '/api/auth/facebook/callback')}&scope=public_profile&response_type=code&display=popup`;
        console.log(`Desktop OAuth URL: ${desktopUrl}`);
    }
    
    if (facebookMobileAppId) {
        const mobileUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${facebookMobileAppId}&redirect_uri=${encodeURIComponent(baseUrl + '/api/auth/facebook/callback')}&scope=public_profile&response_type=code&display=touch`;
        console.log(`Mobile OAuth URL: ${mobileUrl}`);
    }
}

async function testFacebookApp(appId, appSecret, platform) {
    try {
        // Get app access token
        const tokenResponse = await fetch(`https://graph.facebook.com/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&grant_type=client_credentials`);
        const tokenData = await tokenResponse.json();
        
        if (tokenData.access_token) {
            console.log(`✅ ${platform} app access token: Valid`);
            
            // Get app details
            const appResponse = await fetch(`https://graph.facebook.com/${appId}?fields=name,category,link,restrictions&access_token=${tokenData.access_token}`);
            const appData = await appResponse.json();
            
            if (appData.error) {
                console.log(`❌ ${platform} app details: ${appData.error.message}`);
            } else {
                console.log(`✅ ${platform} app name: ${appData.name}`);
                console.log(`✅ ${platform} app category: ${appData.category}`);
                
                if (appData.restrictions) {
                    console.log(`⚠️  ${platform} app has restrictions: ${JSON.stringify(appData.restrictions)}`);
                } else {
                    console.log(`✅ ${platform} app: No restrictions detected`);
                }
            }
        } else {
            console.log(`❌ ${platform} app access token: Failed`);
            console.log(`   Error: ${tokenData.error?.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.log(`❌ ${platform} app test failed: ${error.message}`);
    }
}

// Run the monitor
monitorEnvironmentVariables().catch(console.error);