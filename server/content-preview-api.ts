import fetch from 'node-fetch';

export interface ContentPost {
  id: string;
  platform: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  engagementCount?: number;
}

export interface PlatformProfile {
  id: string;
  username: string;
  displayName?: string;
  profileImageUrl?: string;
  followersCount?: number;
  mediaCount?: number;
}

export class ContentPreviewAPI {
  private accessToken: string;
  private platform: string;

  constructor(platform: string, accessToken: string) {
    this.platform = platform;
    this.accessToken = accessToken;
  }

  async getUserProfile(): Promise<PlatformProfile> {
    switch (this.platform) {
      case 'instagram':
        return this.getInstagramProfile();
      case 'facebook':
        return this.getFacebookProfile();
      case 'twitter':
        return this.getTwitterProfile();
      case 'tiktok':
        return this.getTikTokProfile();
      default:
        throw new Error(`Unsupported platform: ${this.platform}`);
    }
  }

  async getLatestPost(): Promise<ContentPost | null> {
    switch (this.platform) {
      case 'instagram':
        return this.getInstagramPost();
      case 'facebook':
        return this.getFacebookPost();
      case 'twitter':
        return this.getTwitterPost();
      case 'tiktok':
        return this.getTikTokPost();
      default:
        throw new Error(`Unsupported platform: ${this.platform}`);
    }
  }

  // Instagram API methods
  private async getInstagramProfile(): Promise<PlatformProfile> {
    const response = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;
    return {
      id: data.id,
      username: data.username,
      mediaCount: data.media_count
    };
  }

  private async getInstagramPost(): Promise<ContentPost | null> {
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&limit=1&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { data: any[] };
    
    if (data.data && data.data.length > 0) {
      const post = data.data[0];
      return {
        id: post.id,
        platform: 'instagram',
        mediaType: post.media_type,
        mediaUrl: post.media_url,
        thumbnailUrl: post.thumbnail_url,
        permalink: post.permalink,
        caption: post.caption,
        timestamp: post.timestamp
      };
    }

    return null;
  }

  // Facebook API methods
  private async getFacebookProfile(): Promise<PlatformProfile> {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,picture&access_token=${this.accessToken}`
    );

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;
    return {
      id: data.id,
      username: data.name,
      displayName: data.name,
      profileImageUrl: data.picture?.data?.url
    };
  }

  private async getFacebookPost(): Promise<ContentPost | null> {
    // First get user's pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/me/accounts?access_token=${this.accessToken}`
    );

    if (!pagesResponse.ok) {
      throw new Error(`Facebook Pages API error: ${pagesResponse.status} ${pagesResponse.statusText}`);
    }

    const pagesData = await pagesResponse.json() as { data: any[] };
    
    if (!pagesData.data || pagesData.data.length === 0) {
      // Try to get posts from personal profile (limited)
      const postsResponse = await fetch(
        `https://graph.facebook.com/me/posts?fields=id,message,created_time,permalink_url&limit=1&access_token=${this.accessToken}`
      );

      if (!postsResponse.ok) {
        return null;
      }

      const postsData = await postsResponse.json() as { data: any[] };
      
      if (postsData.data && postsData.data.length > 0) {
        const post = postsData.data[0];
        return {
          id: post.id,
          platform: 'facebook',
          mediaType: 'TEXT',
          mediaUrl: '',
          permalink: post.permalink_url,
          caption: post.message,
          timestamp: post.created_time
        };
      }
    } else {
      // Get posts from first page
      const pageId = pagesData.data[0].id;
      const pageToken = pagesData.data[0].access_token;
      
      const postsResponse = await fetch(
        `https://graph.facebook.com/${pageId}/posts?fields=id,message,created_time,permalink_url,attachments&limit=1&access_token=${pageToken}`
      );

      if (!postsResponse.ok) {
        return null;
      }

      const postsData = await postsResponse.json() as { data: any[] };
      
      if (postsData.data && postsData.data.length > 0) {
        const post = postsData.data[0];
        const attachment = post.attachments?.data?.[0];
        
        return {
          id: post.id,
          platform: 'facebook',
          mediaType: attachment?.type || 'TEXT',
          mediaUrl: attachment?.media?.image?.src || '',
          thumbnailUrl: attachment?.media?.image?.src,
          permalink: post.permalink_url,
          caption: post.message,
          timestamp: post.created_time
        };
      }
    }

    return null;
  }

  // Twitter API methods
  private async getTwitterProfile(): Promise<PlatformProfile> {
    try {
      const response = await fetch(
        'https://api.twitter.com/2/users/me?user.fields=public_metrics,profile_image_url',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        // Handle 403 Forbidden - limited API access
        if (response.status === 403) {
          console.log('Twitter API access limited - using basic connection info');
          return {
            id: 'connected',
            username: 'Twitter User',
            displayName: 'Connected Account',
            profileImageUrl: undefined,
            followersCount: undefined
          };
        }
        throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      return {
        id: data.data.id,
        username: data.data.username,
        displayName: data.data.name,
        profileImageUrl: data.data.profile_image_url,
        followersCount: data.data.public_metrics?.followers_count
      };
    } catch (error) {
      console.log('Twitter profile fetch failed, using basic connection status');
      return {
        id: 'connected',
        username: 'Twitter User',
        displayName: 'Connected Account',
        profileImageUrl: undefined,
        followersCount: undefined
      };
    }
  }

  private async getTwitterPost(): Promise<ContentPost | null> {
    // First get user info
    const userResponse = await fetch(
      'https://api.twitter.com/2/users/me',
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!userResponse.ok) {
      console.log('Twitter post fetch failed - limited API access');
      return null;
    }

    const userData = await userResponse.json() as any;
    const userId = userData.data.id;

    // Get user's tweets
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=5&tweet.fields=created_at,public_metrics,attachments&expansions=attachments.media_keys&media.fields=preview_image_url,url`,
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!tweetsResponse.ok) {
      return null;
    }

    const tweetsData = await tweetsResponse.json() as any;
    
    if (tweetsData.data && tweetsData.data.length > 0) {
      const tweet = tweetsData.data[0];
      const media = tweetsData.includes?.media?.[0];
      
      return {
        id: tweet.id,
        platform: 'twitter',
        mediaType: media?.type || 'TEXT',
        mediaUrl: media?.url || '',
        thumbnailUrl: media?.preview_image_url,
        permalink: `https://twitter.com/${userData.data.username}/status/${tweet.id}`,
        caption: tweet.text,
        timestamp: tweet.created_at,
        engagementCount: tweet.public_metrics?.like_count
      };
    }

    return null;
  }

  // TikTok API methods
  private async getTikTokProfile(): Promise<PlatformProfile> {
    const response = await fetch(
      'https://open-api.tiktok.com/user/info/?fields=open_id,union_id,avatar_url,display_name',
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TikTok API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as any;
    return {
      id: data.data.open_id,
      username: data.data.display_name,
      displayName: data.data.display_name,
      profileImageUrl: data.data.avatar_url
    };
  }

  private async getTikTokPost(): Promise<ContentPost | null> {
    const response = await fetch(
      'https://open-api.tiktok.com/video/list/?fields=id,title,cover_image_url,share_url,create_time&max_count=1',
      {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as any;
    
    if (data.data?.videos && data.data.videos.length > 0) {
      const video = data.data.videos[0];
      return {
        id: video.id,
        platform: 'tiktok',
        mediaType: 'VIDEO',
        mediaUrl: '',
        thumbnailUrl: video.cover_image_url,
        permalink: video.share_url,
        caption: video.title,
        timestamp: new Date(video.create_time * 1000).toISOString()
      };
    }

    return null;
  }

  // Token validation method
  async validateToken(): Promise<boolean> {
    try {
      await this.getUserProfile();
      return true;
    } catch (error) {
      console.error(`Token validation failed for ${this.platform}:`, error);
      return false;
    }
  }
}

// Factory function to create platform-specific API instances
export function createContentAPI(platform: string, accessToken: string): ContentPreviewAPI {
  return new ContentPreviewAPI(platform, accessToken);
}