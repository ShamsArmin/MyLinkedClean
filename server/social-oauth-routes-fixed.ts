import { Router } from "express";
import { isAuthenticated } from "./auth";
import { storage } from "./storage";
import crypto from "crypto";

export const socialOAuthRouter = Router();

// OAuth configuration for each platform
const OAUTH_CONFIGS = {
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    redirectUri: `${process.env.BASE_URL}/api/social/callback/instagram`,
    authUrl: "https://api.instagram.com/oauth/authorize",
    tokenUrl: "https://api.instagram.com/oauth/access_token",
    scope: "user_profile,user_media",
    userProfileUrl: "https://graph.instagram.com/me?fields=id,username&access_token="
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    redirectUri: `${process.env.BASE_URL}/api/social/callback/facebook`,
    authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
    scope: "public_profile,user_posts,user_photos"
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID_NEW || process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET_NEW || process.env.TWITTER_CLIENT_SECRET,
    redirectUri: `${process.env.BASE_URL}/api/social/callback/twitter`,
    authUrl: "https://twitter.com/i/oauth2/authorize",
    tokenUrl: "https://api.twitter.com/2/oauth2/token",
    scope: "tweet.read,users.read,offline.access"
  },
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_ID,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    redirectUri: `${process.env.BASE_URL}/api/social/callback/tiktok`,
    authUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    scope: "user.info.basic,video.list"
  }
};

// Store state tokens temporarily (in production, use Redis)
const stateStore = new Map<string, { userId: number, platform: string, timestamp: number }>();

// Clean up expired state tokens
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(stateStore.entries());
  for (const [key, value] of entries) {
    if (now - value.timestamp > 10 * 60 * 1000) { // 10 minutes
      stateStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// Initiate OAuth flow
socialOAuthRouter.get("/connect/:platform", isAuthenticated, async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user!.id;

    if (!OAUTH_CONFIGS[platform as keyof typeof OAUTH_CONFIGS]) {
      return res.status(400).json({ error: "Unsupported platform" });
    }

    const config = OAUTH_CONFIGS[platform as keyof typeof OAUTH_CONFIGS];
    
    // Generate state token for security
    const state = crypto.randomBytes(32).toString('hex');
    stateStore.set(state, { userId, platform, timestamp: Date.now() });

    // Build authorization URL
    const authUrl = new URL(config.authUrl);
    authUrl.searchParams.set('client_id', config.clientId!);
    authUrl.searchParams.set('redirect_uri', config.redirectUri);
    authUrl.searchParams.set('scope', config.scope);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('state', state);

    if (platform === 'twitter') {
      authUrl.searchParams.set('code_challenge', 'challenge');
      authUrl.searchParams.set('code_challenge_method', 'plain');
    }

    // Redirect directly to the OAuth provider
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

    console.log(`OAuth callback for ${platform}:`, { code: code ? 'present' : 'missing', state, error, error_reason, error_description });

    if (error) {
      console.error(`OAuth error for ${platform}:`, { error, error_reason, error_description });
      return res.redirect(`/?error=${encodeURIComponent(error as string)}&reason=${encodeURIComponent(error_description as string || error_reason as string || '')}`);
    }

    if (!code || !state) {
      console.error('Missing OAuth parameters:', { code: !!code, state: !!state });
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
    console.log(`Exchanging code for token: ${platform}`);
    const tokenResponse = await exchangeCodeForToken(platform, code as string, config);
    
    console.log(`Token response for ${platform}:`, { 
      hasAccessToken: !!tokenResponse.access_token, 
      hasError: !!tokenResponse.error,
      error: tokenResponse.error,
      errorDescription: tokenResponse.error_description 
    });
    
    if (!tokenResponse.access_token) {
      console.error(`Token exchange failed for ${platform}:`, tokenResponse);
      return res.redirect(`/?error=token_exchange_failed&details=${encodeURIComponent(tokenResponse.error || 'unknown')}`);
    }

    // Get user profile from the platform
    console.log(`Getting user profile: ${platform}`);
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
      platformUsername: userProfile.username || userProfile.name
    });

    console.log(`Successfully connected ${platform} for user ${stateData.userId}`);

    // Fetch initial posts
    try {
      await syncUserPosts(stateData.userId, platform, tokenResponse.access_token);
    } catch (syncError) {
      console.warn(`Failed to sync initial posts for ${platform}:`, syncError);
      // Don't fail the connection for sync errors
    }

    // Redirect back to dashboard with success message
    res.redirect("/?connected=" + platform);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect("/?error=callback_failed");
  }
});

// Facebook Deauthorize Callback (required for compliance)
socialOAuthRouter.post("/deauthorize", async (req, res) => {
  try {
    const { signed_request } = req.body;
    
    // Parse the signed request to get user ID
    console.log('Deauthorize request received:', { signed_request });
    
    // Here you would:
    // 1. Parse the signed_request to get the user_id
    // 2. Remove the app authorization from your database
    // 3. Optionally clean up user data
    
    res.json({ success: true });
  } catch (error) {
    console.error('Deauthorize error:', error);
    res.status(500).json({ error: "Failed to process deauthorize request" });
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

// Sync posts manually
socialOAuthRouter.post("/sync/:platform", isAuthenticated, async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user!.id;

    const connection = await storage.getSocialConnection(userId, platform);
    if (!connection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    await syncUserPosts(userId, platform, connection.accessToken);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: "Failed to sync posts" });
  }
});

// Helper functions
async function exchangeCodeForToken(platform: string, code: string, config: any) {
  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code'
  });

  if (platform === 'twitter') {
    params.set('code_verifier', 'challenge');
  }

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: params
  });

  return await response.json();
}

async function getUserProfile(platform: string, accessToken: string) {
  const configs = {
    instagram: {
      url: 'https://graph.instagram.com/me?fields=id,username,account_type',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    },
    facebook: {
      url: `https://graph.facebook.com/me?fields=id,name&access_token=${accessToken}`,
      headers: {}
    },
    twitter: {
      url: 'https://api.twitter.com/2/users/me',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    },
    tiktok: {
      url: 'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  };

  const config = configs[platform as keyof typeof configs];
  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const response = await fetch(config.url, {
    headers: config.headers
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Normalize response format
  if (platform === 'twitter' && data.data) {
    return { id: data.data.id, username: data.data.username };
  }
  
  return data;
}

async function syncUserPosts(userId: number, platform: string, accessToken: string) {
  try {
    const posts = await fetchRecentPosts(platform, accessToken);
    
    for (const post of posts) {
      await storage.saveSocialPost({
        userId,
        platform,
        postUrl: post.permalink || post.url,
        postedAt: new Date(post.timestamp || post.created_time),
        thumbnailUrl: post.thumbnail_url || post.media_url,
        caption: post.caption || post.message
      });
    }
  } catch (error) {
    console.error(`Failed to sync posts for ${platform}:`, error);
    throw error;
  }
}

async function fetchRecentPosts(platform: string, accessToken: string) {
  const configs = {
    instagram: {
      url: `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&access_token=${accessToken}`
    },
    facebook: {
      url: `https://graph.facebook.com/me/posts?fields=id,message,created_time,full_picture&access_token=${accessToken}`
    },
    twitter: {
      url: 'https://api.twitter.com/2/users/me/tweets?tweet.fields=created_at,public_metrics&max_results=10',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    },
    tiktok: {
      url: 'https://open.tiktokapis.com/v2/video/list/?fields=id,title,video_description,duration,cover_image_url,share_url',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  };

  const config = configs[platform as keyof typeof configs];
  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const response = await fetch(config.url, {
    headers: 'headers' in config ? config.headers : {}
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data || data.posts || [];
}