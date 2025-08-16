import { Router } from "express";
import { isAuthenticated } from "./auth";
import { storage } from "./storage";
import crypto from "crypto";
import { db } from "./db";
import { oauthStates } from "../shared/schema";
import { eq, lt } from "drizzle-orm";

export const socialOAuthRouter = Router();

// OAuth configuration for each platform
const OAUTH_CONFIGS = {
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    redirectUri: `${process.env.BASE_URL}api/social/callback/facebook`,
    authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    scope: "public_profile,email"
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
    redirectUri: `${process.env.BASE_URL}api/social/callback/twitter`,
    authUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.twitter.com/2/oauth2/token",
    scope: "users.read"
  },
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_ID,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    redirectUri: `${process.env.BASE_URL}api/social/callback/tiktok`,
    authUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    scope: "user.info.basic,video.list"
  }
};

// Store state tokens and PKCE verifiers temporarily with database fallback
const stateStore = new Map<string, { userId: number, platform: string, timestamp: number, codeVerifier?: string }>();

// Database-backed PKCE storage functions
async function storeCodeVerifier(userId: number, state: string, codeVerifier: string) {
  // Store in both memory and database for redundancy
  stateStore.set(state, { userId, platform: 'twitter', timestamp: Date.now(), codeVerifier });
  
  // Persist to database with 1 hour expiration
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
  
  try {
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
    console.log('Stored PKCE data in database:', { state, userId, hasCodeVerifier: !!codeVerifier });
  } catch (error) {
    console.error('Failed to store PKCE data in database:', error);
  }
}

async function getCodeVerifier(state: string): Promise<string | null> {
  // First try memory store
  const memoryStored = stateStore.get(state);
  if (memoryStored && memoryStored.codeVerifier) {
    console.log('Retrieved PKCE data from memory store:', { state, hasCodeVerifier: true });
    return memoryStored.codeVerifier;
  }
  
  // Fall back to database
  try {
    const [dbStored] = await db
      .select()
      .from(oauthStates)
      .where(eq(oauthStates.state, state))
      .limit(1);
    
    if (dbStored && dbStored.codeVerifier && new Date() < dbStored.expiresAt) {
      console.log('Retrieved PKCE data from database:', { state, hasCodeVerifier: true });
      // Also restore to memory store
      stateStore.set(state, { 
        userId: dbStored.userId, 
        platform: dbStored.platform, 
        timestamp: Date.now(), 
        codeVerifier: dbStored.codeVerifier 
      });
      return dbStored.codeVerifier;
    }
  } catch (error) {
    console.error('Failed to retrieve PKCE data from database:', error);
  }
  
  console.log('PKCE data not found in memory or database:', { state, storeSize: stateStore.size });
  return null;
}

// Clean up expired OAuth states
async function cleanupExpiredStates() {
  try {
    await db.delete(oauthStates).where(lt(oauthStates.expiresAt, new Date()));
  } catch (error) {
    console.error('Failed to cleanup expired OAuth states:', error);
  }
}

// PKCE helper functions for Twitter
function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

// Clean up expired state tokens
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(stateStore.entries());
  for (const [key, value] of entries) {
    if (now - value.timestamp > 10 * 60 * 1000) { // 10 minutes
      stateStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Initiate OAuth flow
socialOAuthRouter.get("/connect/:platform", isAuthenticated, async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user!.id;

    const config = OAUTH_CONFIGS[platform as keyof typeof OAUTH_CONFIGS];
    if (!config) {
      return res.status(400).json({ error: "Unsupported platform" });
    }

    console.log(`Initiating ${platform} OAuth for user ${userId}`);
    console.log(`Client ID: ${config.clientId ? 'present' : 'missing'}`);
    console.log(`Redirect URI: ${config.redirectUri}`);
    console.log(`Scope: ${config.scope}`);

    // Generate state token for security
    const state = crypto.randomBytes(32).toString('hex');
    
    // Generate PKCE parameters for Twitter
    let codeVerifier: string | undefined;
    if (platform === 'twitter') {
      codeVerifier = generateCodeVerifier();
      await storeCodeVerifier(userId, state, codeVerifier);
      console.log('Generated PKCE for Twitter:', { state, userId, codeVerifierLength: codeVerifier.length });
    } else {
      stateStore.set(state, { userId, platform, timestamp: Date.now() });
    }

    // Build authorization URL
    const authUrl = new URL(config.authUrl);
    authUrl.searchParams.set('client_id', config.clientId!);
    authUrl.searchParams.set('redirect_uri', config.redirectUri);
    authUrl.searchParams.set('scope', config.scope);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('state', state);

    if (platform === 'twitter') {
      const codeChallenge = generateCodeChallenge(codeVerifier!);
      authUrl.searchParams.set('code_challenge', codeChallenge);
      authUrl.searchParams.set('code_challenge_method', 'S256');
    }

    console.log(`Redirecting to: ${authUrl.toString()}`);
    res.redirect(authUrl.toString());
  } catch (error) {
    console.error('OAuth initiation error:', error);
    res.status(500).json({ error: "Failed to initiate OAuth flow" });
  }
});

// Handle OAuth callback
socialOAuthRouter.get("/callback/:platform", async (req, res) => {
  try {
    const { platform } = req.params;
    const { code, state, error, error_reason, error_description } = req.query;

    console.log(`OAuth callback for ${platform}:`, { 
      code: code ? 'present' : 'missing', 
      state, 
      error, 
      error_reason, 
      error_description 
    });

    if (error) {
      console.error(`OAuth error for ${platform}:`, { error, error_reason, error_description });
      return res.redirect(`/?error=${encodeURIComponent(error as string)}`);
    }

    if (!code || !state) {
      console.error('Missing OAuth parameters');
      return res.redirect("/?error=missing_parameters");
    }

    // Verify state token
    const stateData = stateStore.get(state as string);
    if (!stateData) {
      console.error('Invalid state token:', state);
      return res.redirect("/?error=invalid_state");
    }

    stateStore.delete(state as string);

    const config = OAUTH_CONFIGS[platform as keyof typeof OAUTH_CONFIGS];
    if (!config) {
      return res.redirect("/?error=unsupported_platform");
    }

    // Exchange code for access token
    const tokenResponse = await exchangeCodeForToken(platform, code as string, config, state as string);
    
    if (!tokenResponse.access_token) {
      console.error(`Token exchange failed for ${platform}:`, tokenResponse);
      return res.redirect(`/?error=token_exchange_failed`);
    }

    // Get user profile from the platform
    const userProfile = await getUserProfile(platform, tokenResponse.access_token);
    
    if (!userProfile.id) {
      console.error(`Failed to get user profile for ${platform}:`, userProfile);
      return res.redirect("/?error=profile_fetch_failed");
    }

    // Store connection in database
    await storage.saveSocialConnection({
      userId: stateData.userId,
      platform,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: tokenResponse.expires_in 
        ? new Date(Date.now() + tokenResponse.expires_in * 1000) 
        : null,
      platformUserId: userProfile.id,
      platformUsername: userProfile.username || userProfile.name || userProfile.display_name
    });

    console.log(`Successfully connected ${platform} for user ${stateData.userId}`);

    // Redirect back to dashboard with success message
    res.redirect("/?connected=" + platform);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect("/?error=callback_failed");
  }
});

// Disconnect social media account
socialOAuthRouter.delete("/disconnect/:platform", isAuthenticated, async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user!.id;

    await storage.removeSocialConnection(userId, platform);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({ error: "Failed to disconnect account" });
  }
});

// Get connected accounts
socialOAuthRouter.get("/connections", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user!.id;
    const connections = await storage.getSocialConnections(userId);
    
    res.json(connections.map(conn => ({
      platform: conn.platform,
      platformUsername: conn.platformUsername,
      connectedAt: conn.connectedAt,
      lastSyncAt: conn.lastSyncAt
    })));
  } catch (error) {
    console.error('Get connections error:', error);
    res.status(500).json({ error: "Failed to get connections" });
  }
});

// Helper functions
async function exchangeCodeForToken(platform: string, code: string, config: any, state?: string) {
  const params = new URLSearchParams({
    code,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code'
  });

  let headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json'
  };

  if (platform === 'twitter') {
    // Twitter Web app uses Basic authentication with client credentials
    const credentials = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
    headers['Authorization'] = `Basic ${credentials}`;
    
    // Use the stored code verifier from PKCE flow
    if (state) {
      const codeVerifier = await getCodeVerifier(state);
      if (codeVerifier) {
        params.set('code_verifier', codeVerifier);
        console.log('Twitter token exchange with PKCE (Web app):', {
          clientId: config.clientId,
          hasSecret: !!config.clientSecret,
          hasCodeVerifier: true,
          authMethod: 'basic_auth',
          authHeaderLength: credentials.length
        });
      } else {
        console.error('Missing code verifier for Twitter PKCE flow');
        return { error: 'missing_code_verifier' };
      }
    }
  } else {
    // Other platforms use client credentials in form data
    params.set('client_id', config.clientId);
    params.set('client_secret', config.clientSecret);
  }

  try {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers,
      body: params
    });

    const data = await response.json();
    console.log(`Token exchange response for ${platform}:`, data);
    return data;
  } catch (error) {
    console.error('Token exchange error:', error);
    return { error: 'token_exchange_failed' };
  }
}

async function getUserProfile(platform: string, accessToken: string) {
  try {
    let url = '';
    let headers: Record<string, string> = {};

    switch (platform) {
      case 'facebook':
        url = `https://graph.facebook.com/me?fields=id,name&access_token=${accessToken}`;
        break;
      case 'twitter':
        url = 'https://api.twitter.com/2/users/me';
        headers = { 'Authorization': `Bearer ${accessToken}` };
        break;
      case 'tiktok':
        url = 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name';
        headers = { 'Authorization': `Bearer ${accessToken}` };
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Normalize response format
    if (platform === 'twitter' && data.data) {
      return { id: data.data.id, username: data.data.username };
    }
    
    return data;
  } catch (error) {
    console.error('User profile fetch error:', error);
    return { error: 'profile_fetch_failed' };
  }
}