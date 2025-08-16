import { useState, useEffect } from 'react';
import { Link } from '../types';

type SocialPost = {
  id: string;
  platform: string;
  imageUrl: string;
  title: string;
  timestamp: string;
  likes: number;
  url: string;
};

type SocialFeedPreviewProps = {
  links: Link[];
  className?: string;
};

export function SocialFeedPreview({ links, className = '' }: SocialFeedPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  
  // Find social media links
  const socialLinks = links.filter(link => 
    ['instagram', 'tiktok', 'youtube'].includes(link.platform.toLowerCase())
  );

  useEffect(() => {
    if (socialLinks.length > 0) {
      // Set the first social platform as default selected
      if (!selectedPlatform) {
        setSelectedPlatform(socialLinks[0].platform.toLowerCase());
      }
      
      // Simulate loading feed content
      setIsLoading(true);
      
      // In a real app, we would fetch actual data from social media APIs
      setTimeout(() => {
        const mockPosts = generateMockPosts(selectedPlatform || socialLinks[0].platform.toLowerCase());
        setSocialPosts(mockPosts);
        setIsLoading(false);
      }, 1200);
    } else {
      setSocialPosts([]);
      setIsLoading(false);
    }
  }, [selectedPlatform, socialLinks]);

  if (socialLinks.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-2">Live Social Feed</h3>
        <p className="text-gray-500">
          Add Instagram, TikTok, or YouTube links to see your latest posts here.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Live Social Feed</h3>
        <p className="text-sm text-gray-600 mb-4">
          View your latest posts without leaving your profile
        </p>
        
        {/* Platform selector */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          {socialLinks.map(link => (
            <button
              key={link.id}
              onClick={() => setSelectedPlatform(link.platform.toLowerCase())}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center ${
                selectedPlatform === link.platform.toLowerCase()
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PlatformIcon platform={link.platform.toLowerCase()} />
              <span className="ml-1.5">{getPlatformDisplayName(link.platform)}</span>
            </button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {socialPosts.map(post => (
            <div key={post.id} className="rounded-lg overflow-hidden border border-gray-200 transition-transform hover:scale-105">
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative pb-[100%]">
                  <img 
                    src={post.imageUrl} 
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs text-gray-500 truncate">{post.timestamp}</p>
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <div className="flex items-center mt-1">
                    <svg className="w-4 h-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs ml-1">{post.likes.toLocaleString()}</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <a 
          href={getProfileUrl(selectedPlatform || '', socialLinks)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
        >
          View all posts 
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// Helper function to generate platform-specific icon
function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'instagram':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298-.011.56.026.82.099v-3.68a7.2 7.2 0 00-1.15-.08c-3.9 0-6.6 3.18-5.95 7.08a6.21 6.21 0 006.95 5.31c3.97 0 6.59-3.41 6.59-7.5V8.11c1.23.81 2.62 1.25 4.07 1.26V6.69c-.18-.001-.36-.013-.54-.013a5.07 5.07 0 01-.68-.2z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return null;
  }
}

// Helper function to get platform display name
function getPlatformDisplayName(platform: string): string {
  const platformLower = platform.toLowerCase();
  if (platformLower.includes('instagram')) return 'Instagram';
  if (platformLower.includes('tiktok')) return 'TikTok';
  if (platformLower.includes('youtube')) return 'YouTube';
  return platform;
}

// Helper function to get profile URL
function getProfileUrl(platform: string, links: Link[]): string {
  const link = links.find(l => l.platform.toLowerCase() === platform.toLowerCase());
  return link ? link.url : '#';
}

// Helper function to generate mock posts based on platform
function generateMockPosts(platform: string): SocialPost[] {
  const now = new Date();
  
  switch (platform.toLowerCase()) {
    case 'instagram':
      return [
        {
          id: 'insta1',
          platform: 'instagram',
          imageUrl: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3',
          title: 'Coffee time in the morning ☕',
          timestamp: '2 hours ago',
          likes: 132,
          url: 'https://instagram.com'
        },
        {
          id: 'insta2',
          platform: 'instagram',
          imageUrl: 'https://images.unsplash.com/photo-1516575150278-77136aed6920',
          title: 'Weekend vibes #weekend',
          timestamp: '1 day ago',
          likes: 254,
          url: 'https://instagram.com'
        },
        {
          id: 'insta3',
          platform: 'instagram',
          imageUrl: 'https://images.unsplash.com/photo-1604537372111-13b1899b4044',
          title: 'Sunset at the beach 🌅',
          timestamp: '3 days ago',
          likes: 432,
          url: 'https://instagram.com'
        },
        {
          id: 'insta4',
          platform: 'instagram',
          imageUrl: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073',
          title: 'New project coming soon! #excited',
          timestamp: '1 week ago',
          likes: 189,
          url: 'https://instagram.com'
        }
      ];
    
    case 'tiktok':
      return [
        {
          id: 'tiktok1',
          platform: 'tiktok',
          imageUrl: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b',
          title: 'Dance tutorial #viral',
          timestamp: '3 hours ago',
          likes: 5421,
          url: 'https://tiktok.com'
        },
        {
          id: 'tiktok2',
          platform: 'tiktok',
          imageUrl: 'https://images.unsplash.com/photo-1601532668944-8e483d448e20',
          title: 'Day in my life #dayinmylife',
          timestamp: '12 hours ago',
          likes: 3245,
          url: 'https://tiktok.com'
        },
        {
          id: 'tiktok3',
          platform: 'tiktok',
          imageUrl: 'https://images.unsplash.com/photo-1594015161563-5e6f0f4fe58f',
          title: 'How to style this outfit! #fashion',
          timestamp: '2 days ago',
          likes: 8754,
          url: 'https://tiktok.com'
        },
        {
          id: 'tiktok4',
          platform: 'tiktok',
          imageUrl: 'https://images.unsplash.com/photo-1551655510-555dc3be8633',
          title: 'Try this life hack! #lifehack',
          timestamp: '4 days ago',
          likes: 12876,
          url: 'https://tiktok.com'
        }
      ];
      
    case 'youtube':
      return [
        {
          id: 'yt1',
          platform: 'youtube',
          imageUrl: 'https://images.unsplash.com/photo-1580985927276-33a482205b4a',
          title: 'How I Built My Website | Tutorial',
          timestamp: '1 week ago',
          likes: 3421,
          url: 'https://youtube.com'
        },
        {
          id: 'yt2',
          platform: 'youtube',
          imageUrl: 'https://images.unsplash.com/photo-1603731595918-8f479655496b',
          title: 'Day In My Life as a Developer | Vlog',
          timestamp: '2 weeks ago',
          likes: 1245,
          url: 'https://youtube.com'
        },
        {
          id: 'yt3',
          platform: 'youtube',
          imageUrl: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb',
          title: 'Productivity Tips That Changed My Life',
          timestamp: '1 month ago',
          likes: 5643,
          url: 'https://youtube.com'
        },
        {
          id: 'yt4',
          platform: 'youtube',
          imageUrl: 'https://images.unsplash.com/photo-1618005198920-f0cb6201c115',
          title: 'How to Use React in 10 Minutes',
          timestamp: '2 months ago',
          likes: 8976,
          url: 'https://youtube.com'
        }
      ];
      
    default:
      return [];
  }
}