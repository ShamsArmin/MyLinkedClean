// Content Preview API Types
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

export interface ContentPreviewResponse {
  connected: boolean;
  platform: string;
  profile?: PlatformProfile;
  latestPost?: ContentPost;
  message?: string;
  tokenExpired?: boolean;
  lastSync?: string;
  connectionInfo?: {
    connectedAt?: string;
    platformUsername?: string;
  };
}