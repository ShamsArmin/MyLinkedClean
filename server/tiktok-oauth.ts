import type { Express } from "express";
import { storage } from "./storage";
import { hashPassword } from "./auth";

interface TikTokUserInfo {
  open_id: string;
  union_id: string;
  avatar_url: string;
  display_name: string;
  username?: string;
}

interface TikTokTokenResponse {
  access_token: string;
  expires_in: number;
  open_id: string;
  refresh_expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

// Generate CSRF state token
function generateStateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Store state tokens temporarily (in production, use Redis or database)
const stateTokens = new Map<string, { expires: number; userId?: number }>();

// Clean expired state tokens
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of stateTokens.entries()) {
    if (data.expires < now) {
      stateTokens.delete(token);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

export function setupTikTokOAuth(app: Express) {
  
  // TikTok OAuth initiation
  app.get('/api/auth/tiktok', (req, res) => {
    try {
      const clientKey = process.env.TIKTOK_CLIENT_KEY;
      const baseUrl = (process.env.BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
      const redirectUri = `${baseUrl}/api/auth/tiktok/callback`;
      
      if (!clientKey) {
        console.error('TikTok OAuth: Missing client key');
        return res.redirect('/auth?error=tiktok_not_configured&message=' + encodeURIComponent('TikTok OAuth is not configured'));
      }
      
      // Generate CSRF protection state token
      const state = generateStateToken();
      stateTokens.set(state, {
        expires: Date.now() + (10 * 60 * 1000) // 10 minutes
      });
      
      console.log('TikTok OAuth request initiated:', {
        clientKey: clientKey.substring(0, 8) + '...',
        redirectUri,
        state: state.substring(0, 8) + '...',
        timestamp: new Date().toISOString()
      });
      
      // Build TikTok OAuth authorization URL
      const params = new URLSearchParams({
        client_key: clientKey,
        redirect_uri: redirectUri,
        scope: 'user.info.basic,user.info.profile', // Basic user info and profile
        response_type: 'code',
        state: state
      });
      
      const authUrl = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
      
      console.log('Redirecting to TikTok OAuth:', authUrl.substring(0, 100) + '...');
      
      res.redirect(authUrl);
    } catch (error) {
      console.error('TikTok OAuth initialization error:', error);
      res.redirect('/auth?error=tiktok_init_failed&message=' + encodeURIComponent('TikTok OAuth initialization failed'));
    }
  });

  // TikTok OAuth callback handler
  app.get('/api/auth/tiktok/callback', async (req, res) => {
    try {
      const { code, state, error, error_description: errorDescription } = req.query;
      
      console.log('TikTok OAuth callback received:', {
        hasCode: !!code,
        hasState: !!state,
        error: error || 'none',
        errorDescription: errorDescription || 'none'
      });

      // Handle TikTok OAuth errors
      if (error) {
        console.error('TikTok OAuth error:', { error, errorDescription });
        
        if (error === 'access_denied') {
          return res.redirect('/auth?error=tiktok_access_denied&message=' + encodeURIComponent('TikTok login was cancelled by user'));
        } else if (error === 'invalid_request') {
          return res.redirect('/auth?error=tiktok_invalid_request&message=' + encodeURIComponent('TikTok OAuth request was invalid. Please try again.'));
        } else if (error === 'invalid_client') {
          return res.redirect('/auth?error=tiktok_invalid_client&message=' + encodeURIComponent('TikTok app configuration error. Please contact support.'));
        }
        
        return res.redirect('/auth?error=tiktok_oauth_error&message=' + encodeURIComponent(errorDescription || `TikTok authentication failed: ${error}`));
      }

      if (!code || !state) {
        console.error('TikTok OAuth: Missing authorization code or state');
        return res.redirect('/auth?error=tiktok_missing_params&message=' + encodeURIComponent('Missing required parameters from TikTok'));
      }

      // Verify CSRF state token
      const stateData = stateTokens.get(state as string);
      if (!stateData) {
        console.error('TikTok OAuth: Invalid or expired state token');
        return res.redirect('/auth?error=tiktok_invalid_state&message=' + encodeURIComponent('Invalid or expired authentication state. Please try again.'));
      }
      
      // Clean up state token
      stateTokens.delete(state as string);

      if (stateData.expires < Date.now()) {
        console.error('TikTok OAuth: Expired state token');
        return res.redirect('/auth?error=tiktok_expired_state&message=' + encodeURIComponent('Authentication session expired. Please try again.'));
      }

      const clientKey = process.env.TIKTOK_CLIENT_KEY;
      const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
      const baseUrl = (process.env.BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
      const redirectUri = `${baseUrl}/api/auth/tiktok/callback`;

      console.log('Starting TikTok token exchange');

      // Exchange authorization code for access token
      const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
      const tokenParams = {
        client_key: clientKey!,
        client_secret: clientSecret!,
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      };

      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        },
        body: new URLSearchParams(tokenParams)
      });

      const tokenData: TikTokTokenResponse = await tokenResponse.json();
      
      console.log('TikTok token exchange result:', {
        success: !!tokenData.access_token,
        hasError: !tokenResponse.ok,
        openId: tokenData.open_id?.substring(0, 8) + '...' || 'missing',
        scope: tokenData.scope || 'missing'
      });

      if (!tokenResponse.ok || !tokenData.access_token) {
        console.error('TikTok token exchange failed:', tokenData);
        return res.redirect('/auth?error=tiktok_token_failed&message=' + encodeURIComponent('Failed to get access token from TikTok'));
      }

      // Get user profile from TikTok
      const profileUrl = 'https://open.tiktokapis.com/v2/user/info/';
      const profileParams = new URLSearchParams({
        fields: 'open_id,union_id,avatar_url,display_name'
      });
      
      const profileResponse = await fetch(`${profileUrl}?${profileParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      const profileResult = await profileResponse.json();
      
      console.log('TikTok profile result:', {
        success: profileResponse.ok,
        hasData: !!profileResult.data,
        openId: profileResult.data?.user?.open_id?.substring(0, 8) + '...' || 'missing'
      });

      if (!profileResponse.ok || !profileResult.data?.user) {
        console.error('TikTok profile fetch failed:', profileResult);
        return res.redirect('/auth?error=tiktok_profile_failed&message=' + encodeURIComponent('Failed to get profile from TikTok'));
      }

      const profile: TikTokUserInfo = profileResult.data.user;

      // Check if user exists by TikTok ID
      const tiktokUsername = `tiktok_${profile.open_id}`;
      let user = await storage.getUserByUsername(tiktokUsername);
      
      if (!user) {
        // Create new user with TikTok profile data
        console.log('Creating new user from TikTok profile');
        
        const randomPassword = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const hashedPassword = await hashPassword(randomPassword);
        
        user = await storage.createUser({
          username: tiktokUsername,
          password: hashedPassword,
          name: profile.display_name || 'TikTok User',
          email: null, // TikTok doesn't provide email in basic scope
          bio: 'Joined via TikTok',
          profileImage: profile.avatar_url || null
        });
        
        console.log('Created new TikTok user:', user.id);
      }

      // Save TikTok connection data
      await storage.saveSocialConnection({
        userId: user.id,
        platform: 'tiktok',
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: new Date(Date.now() + (tokenData.expires_in * 1000)),
        platformUserId: profile.open_id,
        platformUsername: profile.display_name
      });

      console.log('TikTok connection saved successfully');

      // Log user in
      req.login(user, (err) => {
        if (err) {
          console.error('Session login error:', err);
          return res.redirect('/auth?error=session_failed&message=' + 
            encodeURIComponent('Failed to create login session'));
        }
        
        console.log('TikTok OAuth login successful for user:', user.id);
        res.redirect('/dashboard?success=tiktok_connected');
      });
      
    } catch (error) {
      console.error('TikTok OAuth callback error:', error);
      res.redirect('/auth?error=tiktok_callback_error&message=' + 
        encodeURIComponent('TikTok authentication failed. Please try again.'));
    }
  });

  // Disconnect TikTok account endpoint
  app.delete('/api/social-connections/tiktok', async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      await storage.deleteSocialConnection(req.user.id, 'tiktok');
      
      console.log('TikTok connection deleted for user:', req.user.id);
      
      res.json({ success: true, message: 'TikTok account disconnected successfully' });
    } catch (error) {
      console.error('Error disconnecting TikTok:', error);
      res.status(500).json({ error: 'Failed to disconnect TikTok account' });
    }
  });
}