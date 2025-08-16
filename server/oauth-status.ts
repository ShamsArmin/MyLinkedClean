import { Request, Response } from 'express';

interface OAuthConfig {
  platform: string;
  clientId: string | undefined;
  clientSecret: string | undefined;
  authUrl: string;
  setupInstructions: string;
}

export function getOAuthConfigs(req: Request): OAuthConfig[] {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  return [
    {
      platform: 'Instagram',
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      authUrl: `${baseUrl}/api/auth/instagram`,
      setupInstructions: 'Configure app at developers.facebook.com with redirect URI: ' + `${baseUrl}/api/auth/instagram/callback`
    },
    {
      platform: 'Facebook',
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authUrl: `${baseUrl}/api/auth/facebook`,
      setupInstructions: 'Configure app at developers.facebook.com with redirect URI: ' + `${baseUrl}/api/auth/facebook/callback`
    },
    {
      platform: 'TikTok',
      clientId: process.env.TIKTOK_CLIENT_ID,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET,
      authUrl: `${baseUrl}/api/auth/tiktok`,
      setupInstructions: 'Configure app at developers.tiktok.com with redirect URI: ' + `${baseUrl}/api/auth/tiktok/callback`
    },
    {
      platform: 'Twitter',
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      authUrl: `${baseUrl}/api/auth/twitter`,
      setupInstructions: 'Configure app at developer.twitter.com with redirect URI: ' + `${baseUrl}/api/auth/twitter/callback`
    }
  ];
}

export function getOAuthStatus(req: Request, res: Response) {
  const configs = getOAuthConfigs(req);
  
  const status = configs.map(config => ({
    platform: config.platform.toLowerCase(),
    name: config.platform,
    configured: !!(config.clientId && config.clientSecret),
    authUrl: config.authUrl,
    setupInstructions: config.setupInstructions
  }));

  res.json(status);
}