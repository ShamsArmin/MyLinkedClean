// User types
export interface User {
  id: number;
  username: string;
  name: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  profileBackground?: string;
  font?: string;
  theme?: string;
  viewMode?: string;
  darkMode?: boolean;
  welcomeMessage?: string;

  socialScore?: number;
  isCollaborative?: boolean;
  collaborators?: string[];
  pitchMode?: boolean;
  pitchDescription?: string;
  profession?: string;
  industryId?: number;
  location?: string;
  interests?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Link types
export interface Link {
  id: number;
  userId: number;
  platform: string;
  title: string;
  url: string;
  description?: string;
  color?: string;
  clicks: number;
  views: number;
  featured: boolean;
  order: number;
  aiScore?: number;
  lastClickedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// Industry types
export interface Industry {
  id: number;
  name: string;
  icon?: string;
  createdAt?: string;
}

// Referral Link types
export interface ReferralLink {
  id: number;
  userId: number;
  title: string;
  url: string;
  description?: string;
  image?: string;
  linkType: 'friend' | 'sponsor' | 'affiliate';
  referenceUserId?: number;
  referenceCompany?: string;
  clicks: number;
  createdAt: string;
  updatedAt?: string;
}

// Profile Stats
export interface ProfileStats {
  views: number;
  clicks: number;
  ctr: number;
  score: number;
  followers?: number;
  following?: number;
}

// Spotlight Project types
export interface SpotlightProject {
  id: number;
  userId: number;
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
  isPinned: boolean;
  viewCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpotlightContributor {
  id: number;
  projectId: number;
  userId?: number;
  name: string;
  email?: string;
  role?: string;
  isRegisteredUser: boolean;
  addedAt: string;
  user?: User;
}

export interface SpotlightTag {
  id: number;
  projectId: number;
  label: string;
  icon?: string;
  type: string;
}