import fetch from 'node-fetch';

export interface InstagramPost {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

export interface InstagramUserProfile {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export class InstagramAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getUserProfile(): Promise<InstagramUserProfile> {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    return await response.json() as InstagramUserProfile;
  }

  async getLatestPost(): Promise<InstagramPost | null> {
    try {
      // First get the user's media
      const mediaResponse = await fetch(
        `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&limit=1&access_token=${this.accessToken}`
      );

      if (!mediaResponse.ok) {
        throw new Error(`Instagram API error: ${mediaResponse.status} ${mediaResponse.statusText}`);
      }

      const mediaData = await mediaResponse.json() as { data: InstagramPost[] };

      if (mediaData.data && mediaData.data.length > 0) {
        return mediaData.data[0];
      }

      return null;
    } catch (error) {
      console.error('Error fetching Instagram posts:', error);
      throw error;
    }
  }

  async getUserMedia(limit: number = 10): Promise<InstagramPost[]> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&limit=${limit}&access_token=${this.accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as { data: InstagramPost[] };
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Instagram media:', error);
      throw error;
    }
  }

  static async exchangeCodeForToken(code: string, clientId: string, clientSecret: string, redirectUri: string): Promise<string> {
    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: code,
      }),
    });

    if (!response.ok) {
      throw new Error(`Instagram token exchange error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { access_token: string };
    return data.access_token;
  }

  static async getLongLivedToken(shortLivedToken: string, clientSecret: string): Promise<string> {
    const response = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${shortLivedToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram long-lived token error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { access_token: string };
    return data.access_token;
  }
}