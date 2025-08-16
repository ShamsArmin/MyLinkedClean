import { Router } from "express";

export const oauthSetupRouter = Router();

oauthSetupRouter.get("/setup-guide", (req, res) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:5000/";
  
  const setupInstructions = {
    currentBaseUrl: baseUrl,
    redirectUris: {
      instagram: `${baseUrl}api/social/callback/instagram`,
      facebook: `${baseUrl}api/social/callback/facebook`,
      twitter: `${baseUrl}api/social/callback/twitter`,
      tiktok: `${baseUrl}api/social/callback/tiktok`,
      linkedin: `${baseUrl}api/social/callback/linkedin`
    },
    instructions: {
      instagram: {
        platform: "Instagram Basic Display",
        consoleUrl: "https://developers.facebook.com/apps/",
        steps: [
          "Go to Facebook Developers Console",
          "Select your Instagram app",
          "Go to 'Instagram Basic Display' product",
          "Add the OAuth Redirect URI",
          "Set Valid OAuth Redirect URIs to: " + `${baseUrl}api/social/callback/instagram`
        ]
      },
      facebook: {
        platform: "Facebook Login",
        consoleUrl: "https://developers.facebook.com/apps/",
        steps: [
          "Go to Facebook Developers Console",
          "Select your Facebook app",
          "Go to 'Facebook Login' settings",
          "Add Valid OAuth Redirect URIs",
          "Set to: " + `${baseUrl}api/social/callback/facebook`
        ]
      },
      twitter: {
        platform: "Twitter API v2",
        consoleUrl: "https://developer.twitter.com/en/portal/dashboard",
        steps: [
          "Go to Twitter Developer Portal",
          "Select your app",
          "Go to 'Authentication settings'",
          "Enable OAuth 2.0",
          "Set Callback URI to: " + `${baseUrl}api/social/callback/twitter`
        ]
      },
      tiktok: {
        platform: "TikTok for Developers",
        consoleUrl: "https://developers.tiktok.com/apps/",
        steps: [
          "Go to TikTok Developers Console",
          "Select your app",
          "Go to 'Login Kit'",
          "Add Redirect URL",
          "Set to: " + `${baseUrl}api/social/callback/tiktok`
        ]
      }
    },
    credentialsStatus: {
      instagram: {
        clientId: !!process.env.INSTAGRAM_CLIENT_ID,
        clientSecret: !!process.env.INSTAGRAM_CLIENT_SECRET
      },
      facebook: {
        clientId: !!process.env.FACEBOOK_CLIENT_ID,
        clientSecret: !!process.env.FACEBOOK_CLIENT_SECRET
      },
      twitter: {
        clientId: !!process.env.TWITTER_CLIENT_ID,
        clientSecret: !!process.env.TWITTER_CLIENT_SECRET
      },
      tiktok: {
        clientId: !!process.env.TIKTOK_CLIENT_ID,
        clientSecret: !!process.env.TIKTOK_CLIENT_SECRET
      }
    }
  };

  res.json(setupInstructions);
});