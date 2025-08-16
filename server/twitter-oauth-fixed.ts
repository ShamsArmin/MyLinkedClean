import { Router, Request, Response } from "express";
import crypto from "crypto";
import { isAuthenticated } from "./auth";
import { storage } from "./storage";
import { db } from "./db";
import { oauthStates } from "../shared/schema";
import { eq } from "drizzle-orm";

export const twitterOAuthRouter = Router();

// Twitter OAuth 2.0 configuration - using new credentials
const TWITTER_CONFIG = {
  clientId: process.env.TWITTER_CLIENT_ID_NEW || process.env.TWITTER_CLIENT_ID!,
  clientSecret: process.env.TWITTER_CLIENT_SECRET_NEW || process.env.TWITTER_CLIENT_SECRET!,
  redirectUri: `${process.env.BASE_URL}api/twitter/callback`,
  authUrl: "https://twitter.com/i/oauth2/authorize",
  tokenUrl: "https://api.twitter.com/2/oauth2/token",
  scope: "users.read offline.access"
};

// PKCE helper functions
function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

// Store PKCE state in database
async function storePKCEState(userId: number, state: string, codeVerifier: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour
  
  await db.insert(oauthStates).values({
    state,
    userId,
    platform: 'twitter',
    codeVerifier,
    expiresAt
  }).onConflictDoUpdate({
    target: oauthStates.state,
    set: { codeVerifier, expiresAt }
  });
  
  console.log('✓ Stored PKCE state in database:', { state, userId });
}

// Retrieve PKCE state from database
async function retrievePKCEState(state: string): Promise<{ userId: number; codeVerifier: string } | null> {
  const [result] = await db
    .select()
    .from(oauthStates)
    .where(eq(oauthStates.state, state))
    .limit(1);
    
  if (result && result.codeVerifier && new Date() < result.expiresAt) {
    console.log('✓ Retrieved PKCE state from database:', { state, userId: result.userId });
    return { userId: result.userId, codeVerifier: result.codeVerifier };
  }
  
  console.log('✗ PKCE state not found or expired:', { state });
  return null;
}

// Initiate Twitter OAuth flow
twitterOAuthRouter.get('/connect', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    
    // Generate PKCE parameters
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = crypto.randomBytes(32).toString('hex');
    
    // Store PKCE state
    await storePKCEState(userId, state, codeVerifier);
    
    // Build authorization URL
    const authUrl = new URL(TWITTER_CONFIG.authUrl);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', TWITTER_CONFIG.clientId);
    authUrl.searchParams.set('redirect_uri', TWITTER_CONFIG.redirectUri);
    authUrl.searchParams.set('scope', TWITTER_CONFIG.scope);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('code_challenge', codeChallenge);
    authUrl.searchParams.set('code_challenge_method', 'S256');
    
    const finalAuthUrl = authUrl.toString();
    console.log('🔄 Initiating Twitter OAuth:', {
      userId,
      state,
      redirectUri: TWITTER_CONFIG.redirectUri,
      scope: TWITTER_CONFIG.scope,
      fullAuthUrl: finalAuthUrl
    });
    
    console.log('📋 Twitter Authorization URL components:', {
      baseUrl: authUrl.origin + authUrl.pathname,
      clientId: authUrl.searchParams.get('client_id'),
      clientIdLength: authUrl.searchParams.get('client_id')?.length,
      redirectUri: authUrl.searchParams.get('redirect_uri'),
      scope: authUrl.searchParams.get('scope'),
      responseType: authUrl.searchParams.get('response_type'),
      state: authUrl.searchParams.get('state'),
      codeChallenge: authUrl.searchParams.get('code_challenge'),
      codeChallengeMethod: authUrl.searchParams.get('code_challenge_method')
    });
    
    console.log('🔍 Environment variables check:', {
      hasClientId: !!process.env.TWITTER_CLIENT_ID,
      hasClientSecret: !!process.env.TWITTER_CLIENT_SECRET,
      clientIdFirstChar: process.env.TWITTER_CLIENT_ID?.charAt(0),
      clientIdLastChar: process.env.TWITTER_CLIENT_ID?.slice(-1),
      baseUrl: process.env.BASE_URL
    });
    
    res.redirect(finalAuthUrl);
  } catch (error) {
    console.error('Error initiating Twitter OAuth:', error);
    res.redirect('/?error=oauth_init_failed');
  }
});

// Handle Twitter OAuth callback
twitterOAuthRouter.get('/callback', async (req: Request, res: Response) => {
  try {
    const { code, state, error } = req.query;
    
    console.log('📥 Twitter OAuth callback:', { 
      hasCode: !!code, 
      hasState: !!state, 
      error 
    });
    
    if (error) {
      console.error('Twitter OAuth error:', error);
      return res.redirect('/?error=twitter_oauth_error');
    }
    
    if (!code || !state) {
      console.error('Missing code or state in callback');
      return res.redirect('/?error=missing_oauth_params');
    }
    
    // Retrieve PKCE state
    const pkceData = await retrievePKCEState(state as string);
    if (!pkceData) {
      console.error('Invalid or expired state token');
      return res.redirect('/?error=invalid_state');
    }
    
    // Exchange code for token
    const tokenData = await exchangeCodeForToken(code as string, pkceData.codeVerifier);
    
    if (tokenData.error) {
      console.error('Token exchange failed:', tokenData);
      return res.redirect('/?error=token_exchange_failed');
    }
    
    // Save Twitter connection to database
    try {
      await storage.saveSocialConnection({
        userId: pkceData.userId,
        platform: 'twitter',
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : undefined
      });
      console.log('✅ Twitter connection saved to database for user:', pkceData.userId);
    } catch (dbError) {
      console.error('Error saving Twitter connection:', dbError);
    }
    
    console.log('✅ Twitter OAuth successful for user:', pkceData.userId);
    res.redirect('/?twitter_connected=true');
    
  } catch (error) {
    console.error('Error in Twitter OAuth callback:', error);
    res.redirect('/?error=oauth_callback_error');
  }
});

// Exchange authorization code for access token
async function exchangeCodeForToken(code: string, codeVerifier: string) {
  try {
    // Prepare request body
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: TWITTER_CONFIG.redirectUri,
      code_verifier: codeVerifier
    });
    
    // Use Basic authentication header (required for some Twitter app configurations)
    const credentials = Buffer.from(`${TWITTER_CONFIG.clientId}:${TWITTER_CONFIG.clientSecret}`).toString('base64');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
      'Accept': 'application/json'
    };
    
    console.log('🔄 Twitter token exchange request:', {
      url: TWITTER_CONFIG.tokenUrl,
      method: 'POST',
      headers: headers,
      bodyParams: {
        grant_type: 'authorization_code',
        redirect_uri: TWITTER_CONFIG.redirectUri,
        client_id: TWITTER_CONFIG.clientId,
        hasCode: !!code,
        hasCodeVerifier: !!codeVerifier,
        hasClientSecret: !!TWITTER_CONFIG.clientSecret
      }
    });
    
    const response = await fetch(TWITTER_CONFIG.tokenUrl, {
      method: 'POST',
      headers,
      body: params.toString()
    });
    
    const responseText = await response.text();
    console.log('📨 Twitter token response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText
    });
    
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Twitter response as JSON:', responseText);
      return { error: 'invalid_response', details: responseText };
    }
    
    if (!response.ok || responseData.error) {
      console.error('❌ Twitter token exchange failed:', {
        status: response.status,
        error: responseData.error,
        error_description: responseData.error_description,
        fullResponse: responseData
      });
      return { error: responseData.error || 'token_exchange_failed', details: responseData };
    }
    
    console.log('✅ Twitter token exchange successful');
    return responseData;
    
  } catch (error) {
    console.error('❌ Network error during token exchange:', error);
    return { error: 'network_error', details: error instanceof Error ? error.message : 'Unknown error' };
  }
}