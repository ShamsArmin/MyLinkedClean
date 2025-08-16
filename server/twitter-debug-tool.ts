import { Router } from "express";
import crypto from "crypto";

export const twitterDebugRouter = Router();

// Generate a simple test authorization URL to check configuration
twitterDebugRouter.get("/debug", (req, res) => {
  try {
    console.log('🔧 Twitter Debug Tool - Checking Configuration');
    
    const clientId = process.env.TWITTER_CLIENT_ID;
    const clientSecret = process.env.TWITTER_CLIENT_SECRET;
    const baseUrl = process.env.BASE_URL;
    
    if (!clientId || !clientSecret || !baseUrl) {
      return res.json({
        error: "Missing environment variables",
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        hasBaseUrl: !!baseUrl
      });
    }
    
    const redirectUri = `${baseUrl}api/twitter/callback`;
    const state = crypto.randomBytes(16).toString('hex');
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
    
    // Test with minimal scope first
    const authUrl = new URL("https://twitter.com/i/oauth2/authorize");
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'users.read');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    
    console.log('🔍 Debug Info:', {
      clientId: clientId,
      clientIdType: typeof clientId,
      clientIdLength: clientId.length,
      redirectUri: redirectUri,
      baseUrl: baseUrl,
      fullAuthUrl: authUrl.toString()
    });
    
    // Return diagnostic info
    res.json({
      success: true,
      diagnostics: {
        clientId: clientId,
        clientIdLength: clientId.length,
        redirectUri: redirectUri,
        baseUrl: baseUrl,
        authUrl: authUrl.toString(),
        troubleshootingSteps: [
          "1. Verify your Twitter app is set to 'Native App' type (not Web App)",
          "2. Confirm redirect URI exactly matches: " + redirectUri,
          "3. Ensure app has 'Read' permissions",
          "4. Check if Client ID starts with numbers/letters (not special chars)"
        ]
      }
    });
    
  } catch (error: any) {
    console.error('Debug tool error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test direct authorization without PKCE (for Web App type)
twitterDebugRouter.get("/test-auth", (req, res) => {
  try {
    const clientId = process.env.TWITTER_CLIENT_ID;
    const baseUrl = process.env.BASE_URL;
    const redirectUri = `${baseUrl}api/twitter/callback`;
    
    // Simple auth URL without PKCE (works for Web App type)
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${encodeURIComponent(clientId!)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=users.read&state=test123`;
    
    console.log('🧪 Testing Web App compatible auth URL:', authUrl);
    res.redirect(authUrl);
    
  } catch (error) {
    console.error('Test auth error:', error);
    res.redirect('/?error=test_auth_failed');
  }
});

// Test with offline.access scope (for apps requiring refresh tokens)
twitterDebugRouter.get("/test-offline", (req, res) => {
  try {
    const clientId = process.env.TWITTER_CLIENT_ID;
    const baseUrl = process.env.BASE_URL;
    const redirectUri = `${baseUrl}api/twitter/callback`;
    
    // With offline.access scope
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${encodeURIComponent(clientId!)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=users.read%20offline.access&state=test456`;
    
    console.log('🧪 Testing with offline.access scope:', authUrl);
    res.redirect(authUrl);
    
  } catch (error) {
    console.error('Test offline auth error:', error);
    res.redirect('/?error=test_offline_failed');
  }
});