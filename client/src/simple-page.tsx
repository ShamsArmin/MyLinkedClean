import React, { useState, useEffect } from 'react';
import { SimpleNavigation } from './components/simple-navigation';

// Define types for our links
type Link = {
  id: number;
  platform: string;
  title: string;
  url: string;
  clicks: number;
  featured: boolean;
};

// Enhanced dashboard with multi-view mode and live preview
const DashboardContent = () => {
  // Define the extended Link type with more properties
  type EnhancedLink = {
    id: number;
    platform: string;
    title: string;
    url: string;
    clicks: number;
    featured: boolean;
    description?: string;
    thumbnail?: string;
    color?: string;
    lastClickedAt?: string;
    aiScore?: number;
  };
  
  // Define available view modes
  type ViewMode = 'list' | 'grid' | 'story' | 'portfolio';
  
  // Sample live feed data
  type FeedItem = {
    id: string;
    platform: string;
    type: 'image' | 'video' | 'post';
    thumbnail: string;
    title?: string;
    content?: string;
    url: string;
    postedAt: string;
    likes?: number;
    comments?: number;
    views?: number;
  };
  
  // State for links and UI management
  const [links, setLinks] = useState<EnhancedLink[]>([
    { 
      id: 1, 
      platform: 'Twitter', 
      title: 'My Twitter', 
      url: 'https://twitter.com/myprofile', 
      clicks: 42, 
      featured: true,
      description: 'Follow me for tech insights and updates',
      color: '#1DA1F2',
      lastClickedAt: '2023-05-14',
      aiScore: 92
    },
    { 
      id: 2, 
      platform: 'GitHub', 
      title: 'GitHub Profile', 
      url: 'https://github.com/developer', 
      clicks: 27, 
      featured: true,
      description: 'Check out my open source projects',
      color: '#333',
      lastClickedAt: '2023-05-12',
      aiScore: 85
    },
    { 
      id: 3, 
      platform: 'LinkedIn', 
      title: 'Professional Profile', 
      url: 'https://linkedin.com/in/myprofile', 
      clicks: 18, 
      featured: false,
      description: 'Connect with me professionally',
      color: '#0077B5',
      lastClickedAt: '2023-05-10',
      aiScore: 78
    },
    { 
      id: 4, 
      platform: 'Portfolio', 
      title: 'My Portfolio', 
      url: 'https://myportfolio.com', 
      clicks: 15, 
      featured: true,
      description: 'View my complete portfolio and projects',
      color: '#6366F1',
      lastClickedAt: '2023-05-08',
      aiScore: 95
    },
    { 
      id: 5, 
      platform: 'Instagram', 
      title: 'Instagram Profile', 
      url: 'https://instagram.com/user', 
      clicks: 38, 
      featured: true,
      description: 'Follow my photo journey',
      color: '#E4405F',
      lastClickedAt: '2023-05-13',
      aiScore: 90
    },
    { 
      id: 6, 
      platform: 'YouTube', 
      title: 'YouTube Channel', 
      url: 'https://youtube.com/channel/user', 
      clicks: 22, 
      featured: true,
      description: 'Subscribe for weekly tech videos',
      color: '#FF0000',
      lastClickedAt: '2023-05-11',
      aiScore: 88
    },
    { 
      id: 7, 
      platform: 'TikTok', 
      title: 'TikTok Profile', 
      url: 'https://tiktok.com/@user', 
      clicks: 31, 
      featured: false,
      description: 'Quick tutorials and creative content',
      color: '#000000',
      lastClickedAt: '2023-05-14',
      aiScore: 87
    },
  ]);
  
  // State for view mode and UI
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLink, setEditingLink] = useState<EnhancedLink | null>(null);
  const [newLink, setNewLink] = useState<Omit<EnhancedLink, 'id' | 'clicks'>>({ 
    platform: '', 
    title: '', 
    url: '', 
    featured: false,
    description: '',
    color: '#6366F1'
  });
  const [showLiveFeed, setShowLiveFeed] = useState(false);
  const [feedPlatform, setFeedPlatform] = useState<'instagram' | 'tiktok' | 'youtube'>('instagram');
  const [pitchMode, setPitchMode] = useState(false);
  
  // Sample feed data
  const liveFeedData: Record<string, FeedItem[]> = {
    instagram: [
      {
        id: 'ig1',
        platform: 'instagram',
        type: 'image',
        thumbnail: 'https://placehold.co/600x600/E4405F/FFFFFF/png?text=Instagram+Post',
        title: 'New Project Launch',
        content: 'Excited to share my latest project! #webdev #coding',
        url: 'https://instagram.com/p/123456',
        postedAt: '2023-05-14',
        likes: 182,
        comments: 24
      },
      {
        id: 'ig2',
        platform: 'instagram',
        type: 'image',
        thumbnail: 'https://placehold.co/600x600/E4405F/FFFFFF/png?text=Instagram+Post+2',
        title: 'Coding Session',
        content: 'Late night coding session. Building something awesome! #programming',
        url: 'https://instagram.com/p/789012',
        postedAt: '2023-05-12',
        likes: 145,
        comments: 18
      }
    ],
    tiktok: [
      {
        id: 'tt1',
        platform: 'tiktok',
        type: 'video',
        thumbnail: 'https://placehold.co/600x800/000000/FFFFFF/png?text=TikTok+Video',
        title: 'Quick JS Tip',
        content: 'Here\'s a JavaScript tip that will save you hours! #coding #javascript #webdev',
        url: 'https://tiktok.com/@user/video/123456',
        postedAt: '2023-05-13',
        views: 2450,
        likes: 342,
        comments: 28
      }
    ],
    youtube: [
      {
        id: 'yt1',
        platform: 'youtube',
        type: 'video',
        thumbnail: 'https://placehold.co/600x400/FF0000/FFFFFF/png?text=YouTube+Video',
        title: 'Full Stack Development Tutorial',
        content: 'Learn how to build a full stack application from scratch',
        url: 'https://youtube.com/watch?v=123456',
        postedAt: '2023-05-10',
        views: 1250,
        likes: 85,
        comments: 12
      }
    ]
  };
  
  // Handle adding a new link
  const handleAddLink = () => {
    if (newLink.platform && newLink.title && newLink.url) {
      setLinks([...links, { 
        id: Date.now(), 
        ...newLink,
        clicks: 0,
        lastClickedAt: new Date().toISOString().split('T')[0],
        aiScore: Math.floor(Math.random() * 20) + 80 // Random AI score between 80-100
      }]);
      setNewLink({ platform: '', title: '', url: '', featured: false, description: '', color: '#6366F1' });
      setIsAddingLink(false);
    }
  };
  
  // Handle editing a link
  const handleEditLink = (link: EnhancedLink) => {
    setEditingLink(link);
    setNewLink({
      platform: link.platform,
      title: link.title,
      url: link.url,
      featured: link.featured,
      description: link.description || '',
      color: link.color || '#6366F1'
    });
    setIsAddingLink(true);
  };
  
  // Handle updating a link
  const handleUpdateLink = () => {
    if (newLink.platform && newLink.title && newLink.url && editingLink) {
      setLinks(links.map(link => 
        link.id === editingLink.id ? { 
          ...link, 
          ...newLink,
          aiScore: editingLink.aiScore // Preserve AI score
        } : link
      ));
      setNewLink({ platform: '', title: '', url: '', featured: false, description: '', color: '#6366F1' });
      setIsAddingLink(false);
      setEditingLink(null);
    }
  };
  
  // Handle deleting a link
  const handleDeleteLink = (id: number) => {
    setLinks(links.filter(link => link.id !== id));
  };
  
  // Handle canceling link add/edit
  const handleCancelAdd = () => {
    setIsAddingLink(false);
    setEditingLink(null);
    setNewLink({ platform: '', title: '', url: '', featured: false, description: '', color: '#6366F1' });
  };
  
  // Toggle pitch mode
  const togglePitchMode = () => {
    setPitchMode(!pitchMode);
  };
  
  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
          </svg>
        );
      case 'github':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      case 'portfolio':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        );
      case 'website':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 16.057v-3.057h2.994c-.059 1.143-.212 2.24-.456 3.279-.823-.12-1.674-.188-2.538-.222zm1.957 2.162c-.499 1.33-1.159 2.497-1.957 3.456v-3.62c.666.028 1.319.081 1.957.164zm-1.957-7.219v-3.015c.868-.034 1.721-.103 2.548-.224.238 1.027.389 2.111.446 3.239h-2.994zm0-5.014v-3.661c.806.969 1.471 2.15 1.971 3.496-.642.084-1.3.137-1.971.165zm2.703-3.267c1.237.496 2.354 1.228 3.29 2.146-.642.234-1.311.442-2.019.607-.344-.992-.775-1.91-1.271-2.753zm-7.241 13.56c-.244-1.039-.398-2.136-.456-3.279h2.994v3.057c-.865.034-1.714.102-2.538.222zm2.538 1.776v3.62c-.798-.959-1.458-2.126-1.957-3.456.638-.083 1.291-.136 1.957-.164zm-2.994-7.055c.057-1.128.207-2.212.446-3.239.827.121 1.68.19 2.548.224v3.015h-2.994zm1.024-5.179c.5-1.346 1.165-2.527 1.97-3.496v3.661c-.671-.028-1.329-.081-1.97-.165zm-2.005-.35c-.708-.165-1.377-.373-2.018-.607.937-.918 2.053-1.65 3.29-2.146-.496.844-.927 1.762-1.272 2.753zm-.549 1.918c-.264 1.151-.434 2.36-.492 3.611h-3.933c.165-1.658.739-3.197 1.617-4.518.88.361 1.816.67 2.808.907zm.009 9.262c-.988.236-1.92.542-2.797.9-.89-1.328-1.471-2.879-1.637-4.551h3.934c.058 1.265.231 2.488.5 3.651zm.553 1.917c.342.976.768 1.881 1.257 2.712-1.223-.49-2.326-1.211-3.256-2.115.636-.229 1.299-.435 1.999-.597zm9.924 0c.7.163 1.362.367 1.999.597-.931.903-2.034 1.625-3.257 2.116.489-.832.915-1.737 1.258-2.713zm.553-1.917c.27-1.163.442-2.386.501-3.651h3.934c-.167 1.672-.748 3.223-1.638 4.551-.877-.358-1.81-.664-2.797-.9zm.501-5.651c-.058-1.251-.229-2.46-.492-3.611.992-.237 1.929-.546 2.809-.907.877 1.321 1.451 2.86 1.616 4.518h-3.933z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };
  
  // Render the multi-view mode for links
  const renderLinksInViewMode = () => {
    switch (viewMode) {
      case 'grid':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {links.map(link => (
              <div 
                key={link.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                style={{ borderColor: link.color || 'rgb(229, 231, 235)' }}
              >
                <div className="flex flex-col items-center text-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{ backgroundColor: link.color || 'rgb(243, 244, 246)', color: '#fff' }}
                  >
                    {getPlatformIcon(link.platform)}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{link.title}</h4>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs px-3 py-1 rounded-full text-white mb-2"
                    style={{ backgroundColor: link.color || '#6366F1' }}
                  >
                    Visit
                  </a>
                  <div className="flex items-center text-xs text-gray-500">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {link.clicks} clicks
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'story':
        return (
          <div className="relative">
            <div className="flex overflow-x-auto hide-scrollbar py-4 space-x-4 snap-x snap-mandatory">
              {links.map(link => (
                <div 
                  key={link.id} 
                  className="flex-shrink-0 w-64 h-96 bg-gray-100 rounded-lg overflow-hidden snap-start shadow-md relative"
                  style={{ backgroundColor: link.color || 'rgb(243, 244, 246)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-80 z-10"></div>
                  <div className="absolute top-4 left-4 z-20 bg-black bg-opacity-30 rounded-full p-2">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    >
                      {getPlatformIcon(link.platform)}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
                    <h4 className="font-bold text-xl mb-1">{link.title}</h4>
                    <p className="text-sm text-gray-200 mb-3">{link.description || 'Visit my ' + link.platform + ' profile'}</p>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-block px-4 py-2 bg-white text-gray-900 rounded-md font-medium text-sm hover:bg-gray-100"
                    >
                      Visit {link.platform}
                    </a>
                    <div className="flex items-center mt-2 text-xs text-gray-300">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {link.clicks} views • AI Score: {link.aiScore}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-2 space-x-2">
              {links.map((_, index) => (
                <div 
                  key={index} 
                  className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
                ></div>
              ))}
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mr-4">
                  {links.find(link => link.platform.toLowerCase() === 'portfolio')?.title.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Professional Portfolio</h3>
                  <p className="text-gray-600">Full Stack Developer & UX Designer</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                {links.find(link => link.platform.toLowerCase() === 'portfolio')?.description || 
                  'My professional portfolio showcasing projects, skills, and experience in web development and design. Available for freelance work and collaborations.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
                {links.slice(0, 4).map(link => (
                  <a 
                    key={link.id} 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white"
                      style={{ backgroundColor: link.color || '#6366F1' }}
                    >
                      {getPlatformIcon(link.platform)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{link.platform}</span>
                  </a>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-600">AI Social Score:</span>
                  <div className="flex items-center">
                    {Array(5).fill(0).map((_, index) => (
                      <svg 
                        key={index} 
                        className={`w-4 h-4 ${index < Math.round(((links.reduce((sum, link) => sum + (link.aiScore || 0), 0) / links.length) / 100 * 5)) ? 'text-yellow-500' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <a 
                  href={links.find(link => link.platform.toLowerCase() === 'portfolio')?.url || '#'} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  View Full Portfolio
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map(link => (
                <div 
                  key={link.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white"
                        style={{ backgroundColor: link.color || '#6366F1' }}
                      >
                        {getPlatformIcon(link.platform)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{link.title}</h4>
                        <p className="text-sm text-gray-500">{link.description || `Connect with me on ${link.platform}`}</p>
                      </div>
                    </div>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'list':
      default:
        return (
          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No links yet. Add your first link to get started!
              </div>
            ) : (
              links.map(link => (
                <div 
                  key={link.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  style={{ borderColor: link.featured ? (link.color || 'rgb(37, 99, 235)') : 'rgb(229, 231, 235)' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-white`}
                        style={{ backgroundColor: link.color || (link.featured ? '#2563EB' : '#F3F4F6'), color: link.featured ? 'white' : '#4B5563' }}
                      >
                        {getPlatformIcon(link.platform)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{link.title}</h4>
                        <div className="flex items-center">
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                            {link.url}
                          </a>
                          {link.aiScore && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                              AI: {link.aiScore}
                            </span>
                          )}
                        </div>
                        {link.description && (
                          <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-sm text-gray-500 mr-2">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {link.clicks} clicks
                      </div>
                      <button 
                        onClick={() => handleEditLink(link)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteLink(link.id)}
                        className="p-1 text-gray-600 hover:text-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        );
    }
  };
  
  // Live feed display
  const renderLiveFeed = () => {
    const feedItems = liveFeedData[feedPlatform] || [];
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Latest from {feedPlatform.charAt(0).toUpperCase() + feedPlatform.slice(1)}
          </h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFeedPlatform('instagram')}
              className={`p-1.5 rounded-md ${feedPlatform === 'instagram' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </button>
            <button 
              onClick={() => setFeedPlatform('tiktok')}
              className={`p-1.5 rounded-md ${feedPlatform === 'tiktok' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </button>
            <button 
              onClick={() => setFeedPlatform('youtube')}
              className={`p-1.5 rounded-md ${feedPlatform === 'youtube' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {feedItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent posts from {feedPlatform}
            </div>
          ) : (
            feedItems.map(item => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex">
                  <div className="w-1/3 h-32 bg-gray-200 overflow-hidden">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title || item.platform + ' post'} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 p-3">
                    <h4 className="font-medium text-gray-900 mb-1">{item.title || 'New Post'}</h4>
                    <p className="text-sm text-gray-600 mb-2">{item.content}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-3">{item.postedAt}</span>
                      {item.likes !== undefined && (
                        <span className="flex items-center mr-2">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          {item.likes}
                        </span>
                      )}
                      {item.comments !== undefined && (
                        <span className="flex items-center mr-2">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                          {item.comments}
                        </span>
                      )}
                      {item.views !== undefined && (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {item.views}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-center bg-gray-50 py-2 text-sm text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  View on {feedPlatform.charAt(0).toUpperCase() + feedPlatform.slice(1)}
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  // Pitch mode for professional presentations
  const renderPitchMode = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Professional Portfolio</h2>
            <p className="text-lg text-gray-600 mb-6">Full Stack Developer & UX Designer</p>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">About Me</h3>
              <p className="text-gray-700 mb-4">
                I'm a passionate full-stack developer with 5+ years of experience building modern web applications. 
                I specialize in React, Node.js, and user experience design.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Frontend: React, Next.js, Tailwind CSS</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Backend: Node.js, Express, PostgreSQL</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">UX/UI Design: Figma, Adobe XD</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Featured Projects</h3>
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <h4 className="font-medium text-blue-700">E-commerce Platform</h4>
                  <p className="text-sm text-gray-600">Full-stack e-commerce solution with React, Node.js, and Stripe integration</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <h4 className="font-medium text-blue-700">Analytics Dashboard</h4>
                  <p className="text-sm text-gray-600">Real-time analytics visualization with React, D3.js, and WebSockets</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                  <h4 className="font-medium text-blue-700">Social Media App</h4>
                  <p className="text-sm text-gray-600">Mobile-first social platform with React Native and Firebase</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect With Me</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {links.filter(link => ['linkedin', 'github', 'twitter', 'portfolio'].includes(link.platform.toLowerCase())).map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ borderColor: link.color || 'rgb(229, 231, 235)' }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-2 text-white"
                    style={{ backgroundColor: link.color || '#6366F1' }}
                  >
                    {getPlatformIcon(link.platform)}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <a
              href="mailto:contact@example.com"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    );
  };
  
  // Main UI rendering
  return (
    <div>
      {pitchMode ? (
        // Pitch Mode View
        <>
          {renderPitchMode()}
          <div className="text-center mb-6">
            <button
              onClick={togglePitchMode}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Exit Pitch Mode
            </button>
          </div>
        </>
      ) : (
        // Regular Dashboard View
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Welcome to Your Dashboard</h2>
                <p className="text-gray-600">
                  Manage your links and profile from this central dashboard.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={togglePitchMode}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Pitch Mode
                </button>
                <button 
                  onClick={() => setIsAddingLink(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Link
                </button>
              </div>
            </div>
            
            {/* View Mode Selector */}
            <div className="mb-6 border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    List View
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid View
                  </button>
                  <button
                    onClick={() => setViewMode('story')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${viewMode === 'story' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Story View
                  </button>
                  <button
                    onClick={() => setViewMode('portfolio')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${viewMode === 'portfolio' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Portfolio View
                  </button>
                </div>
                <button
                  onClick={() => setShowLiveFeed(!showLiveFeed)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${showLiveFeed ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {showLiveFeed ? 'Hide Live Feed' : 'Show Live Feed'}
                </button>
              </div>
            </div>
            
            {isAddingLink ? (
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">
                  {editingLink ? 'Edit Link' : 'Add New Link'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <input 
                      type="text"
                      placeholder="e.g., Twitter, GitHub, LinkedIn"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newLink.platform}
                      onChange={(e) => setNewLink({...newLink, platform: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input 
                      type="text"
                      placeholder="e.g., My Twitter Profile"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newLink.title}
                      onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input 
                    type="url"
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newLink.url}
                    onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                  <textarea 
                    placeholder="Enter a short description for this link"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newLink.description}
                    onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <div className="flex items-center">
                      <input 
                        type="color"
                        className="h-8 w-8 rounded border border-gray-300 mr-2"
                        value={newLink.color}
                        onChange={(e) => setNewLink({...newLink, color: e.target.value})}
                      />
                      <input 
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        value={newLink.color}
                        onChange={(e) => setNewLink({...newLink, color: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      id="featured"
                      className="mr-2 h-4 w-4 text-blue-600"
                      checked={newLink.featured}
                      onChange={(e) => setNewLink({...newLink, featured: e.target.checked})}
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Featured (show at the top of your profile)
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={handleCancelAdd}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={editingLink ? handleUpdateLink : handleAddLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingLink ? 'Update Link' : 'Add Link'}
                  </button>
                </div>
              </div>
            ) : null}
            
            {/* Display links based on view mode */}
            {renderLinksInViewMode()}
            
            {/* Live Feed Section */}
            {showLiveFeed && (
              <div className="mt-6">
                {renderLiveFeed()}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Total Profile Views</h4>
                    <p className="text-2xl font-bold text-gray-900">127</p>
                    <span className="text-xs text-green-600">+8% from last week</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Total Link Clicks</h4>
                    <p className="text-2xl font-bold text-gray-900">
                      {links.reduce((total, link) => total + link.clicks, 0)}
                    </p>
                    <span className="text-xs text-green-600">+12% from last week</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Features</h3>
                <a href="/social-score" className="text-sm text-blue-600 hover:underline">View All</a>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-semibold text-blue-800 mb-2">Social Score</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Track your social media performance and improve your online presence.
                  </p>
                  <a href="/social-score" className="text-sm text-blue-600 font-medium hover:underline">View Your Score →</a>
                </div>
                <div className="bg-purple-50 p-4 rounded-md">
                  <h3 className="font-semibold text-purple-800 mb-2">AI Branding</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Get personalized branding suggestions powered by AI.
                  </p>
                  <a href="/branding" className="text-sm text-purple-600 font-medium hover:underline">Get Suggestions →</a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Social Score content component with enhanced visualization
const SocialScoreContent = () => {
  const [socialScore, setSocialScore] = useState({
    currentScore: 78,
    previousScore: 71,
    tier: 'Silver',
    nextTier: 'Gold',
    nextTierThreshold: 90,
    history: [64, 67, 70, 72, 75, 74, 78],
    breakdown: {
      profileViews: { count: 127, change: 12, weight: 25 },
      linkClicks: { count: 84, change: 8, weight: 25 },
      ctr: { rate: 66, change: 2, weight: 15 },
      followers: { count: 42, change: 6, weight: 15 },
      postEngagement: { score: 73, change: 4, weight: 10 },
      consistencyScore: { score: 82, change: 5, weight: 10 },
    },
    insights: [
      "Your profile views increased by 12% since last month",
      "Adding more links could increase your engagement rate",
      "Followers are growing steadily - keep it up!",
      "Your CTR is above average for your audience size"
    ]
  });
  
  // Calculate tier progress percentage
  const tierProgress = () => {
    // Assuming Silver tier is 70-89, and Gold is 90+
    const silverMin = 70;
    const goldMin = 90;
    const range = goldMin - silverMin;
    const progress = ((socialScore.currentScore - silverMin) / range) * 100;
    return Math.min(100, Math.max(0, progress));
  };
  
  // Helper to render score change indicators
  const renderChange = (change: number) => {
    if (change === 0) return <span className="text-gray-500">—</span>;
    
    return change > 0 ? (
      <span className="text-green-600 flex items-center">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {change}%
      </span>
    ) : (
      <span className="text-red-600 flex items-center">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        {Math.abs(change)}%
      </span>
    );
  };
  
  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          {/* Score Display */}
          <div className="md:w-1/3">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Social Score</h2>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-lg text-white shadow-lg">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm opacity-80">Current Score</span>
                <div className="flex items-center">
                  {renderChange(socialScore.currentScore - socialScore.previousScore)}
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">{socialScore.currentScore}</div>
              <div className="text-sm opacity-80 mb-4">Tier: {socialScore.tier}</div>
              
              <div className="mb-1 flex justify-between text-xs">
                <span>{socialScore.tier}</span>
                <span>{socialScore.nextTier}</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-4">
                <div className="bg-white h-2 rounded-full" style={{ width: `${tierProgress()}%` }}></div>
              </div>
              <div className="text-xs opacity-80">
                {Math.round(socialScore.nextTierThreshold - socialScore.currentScore)} points to {socialScore.nextTier} tier
              </div>
            </div>
            
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Score History</h3>
              <div className="h-24 flex items-end justify-between">
                {socialScore.history.map((score, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className={`w-6 rounded-t ${index === socialScore.history.length - 1 ? 'bg-blue-600' : 'bg-blue-400'}`} 
                      style={{ height: `${(score/100) * 70}px` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Score Breakdown */}
          <div className="md:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800">Score Breakdown</h3>
              <span className="text-sm text-gray-500">Last updated: Today</span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Profile Views</div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-2">{socialScore.breakdown.profileViews.count}</span>
                        {renderChange(socialScore.breakdown.profileViews.change)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Weight: {socialScore.breakdown.profileViews.weight}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${socialScore.breakdown.profileViews.weight}%` }}></div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Link Clicks</div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-2">{socialScore.breakdown.linkClicks.count}</span>
                        {renderChange(socialScore.breakdown.linkClicks.change)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Weight: {socialScore.breakdown.linkClicks.weight}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${socialScore.breakdown.linkClicks.weight}%` }}></div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Click-Through Rate</div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-2">{socialScore.breakdown.ctr.rate}%</span>
                        {renderChange(socialScore.breakdown.ctr.change)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Weight: {socialScore.breakdown.ctr.weight}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${socialScore.breakdown.ctr.weight}%` }}></div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Followers</div>
                      <div className="flex items-center">
                        <span className="text-lg font-bold mr-2">{socialScore.breakdown.followers.count}</span>
                        {renderChange(socialScore.breakdown.followers.change)}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Weight: {socialScore.breakdown.followers.weight}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${socialScore.breakdown.followers.weight}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Insights & Tips */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Insights & Improvement Tips</h3>
        
        <div className="mb-6">
          <div className="border-l-4 border-blue-500 pl-4 py-1 mb-4">
            <h4 className="text-sm font-medium text-gray-700">What's going well</h4>
            <p className="text-sm text-gray-600 mt-1">
              Your engagement is strong and your follower count is growing. Your click-through rate is above average.
            </p>
          </div>
          
          <div className="border-l-4 border-amber-500 pl-4 py-1">
            <h4 className="text-sm font-medium text-gray-700">Opportunities to improve</h4>
            <p className="text-sm text-gray-600 mt-1">
              Adding more relevant links could increase your overall engagement. Consider posting more regularly to improve your consistency score.
            </p>
          </div>
        </div>
        
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Insights</h4>
        <ul className="space-y-2">
          {socialScore.insights.map((insight, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded-md flex items-start">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-700">{insight}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Tier Benefits */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Tier Benefits</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`border rounded-lg p-4 ${socialScore.tier === 'Bronze' ? 'border-amber-500 bg-amber-50' : 'border-gray-200'}`}>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="font-medium">Bronze Tier</div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Basic analytics
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Up to 5 links
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Standard profile customization
              </li>
            </ul>
          </div>
          
          <div className={`border rounded-lg p-4 ${socialScore.tier === 'Silver' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="font-medium">Silver Tier</div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Advanced analytics
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Up to 10 links
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enhanced profile customization
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Weekly performance insights
              </li>
            </ul>
          </div>
          
          <div className={`border rounded-lg p-4 ${socialScore.tier === 'Gold' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}>
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="font-medium">Gold Tier</div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Premium analytics with exports
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unlimited links
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Full profile customization
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                AI-powered optimization
              </li>
              <li className="flex items-start">
                <svg className="w-4 h-4 text-green-600 mt-0.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics content component with comprehensive stats and visualizations
const AnalyticsContent = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [viewType, setViewType] = useState<'views' | 'clicks' | 'ctr'>('views');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');
  
  // Sample analytics data
  const analyticsData = {
    summary: {
      totalViews: 1287,
      totalClicks: 352,
      ctr: 27.35,
      avgTimeOnPage: '01:24',
      bounceRate: '42%',
      newVisitors: '68%',
      topSource: 'Instagram',
      topDevice: 'Mobile (64%)',
      topLocation: 'United States',
      growthRate: '+14%'
    },
    linkPerformance: [
      { id: 1, title: 'Twitter Profile', clicks: 125, views: 368, ctr: 34, growth: 12 },
      { id: 2, title: 'GitHub Repository', clicks: 87, views: 412, ctr: 21, growth: 8 },
      { id: 3, title: 'LinkedIn', clicks: 64, views: 257, ctr: 25, growth: 5 },
      { id: 4, title: 'Personal Website', clicks: 41, views: 189, ctr: 22, growth: -2 },
      { id: 5, title: 'YouTube Channel', clicks: 35, views: 221, ctr: 16, growth: 3 },
    ],
    trafficSources: [
      { source: 'Direct', percentage: 32 },
      { source: 'Instagram', percentage: 24 },
      { source: 'Twitter', percentage: 18 },
      { source: 'LinkedIn', percentage: 14 },
      { source: 'Other', percentage: 12 },
    ],
    deviceBreakdown: { desktop: 36, mobile: 58, tablet: 6 },
    visitorDemographics: {
      age: [
        { group: '18-24', percentage: 22 },
        { group: '25-34', percentage: 38 },
        { group: '35-44', percentage: 25 },
        { group: '45-54', percentage: 10 },
        { group: '55+', percentage: 5 },
      ],
      gender: { male: 64, female: 36 },
    },
    timeData: {
      labels: ['May 1', 'May 5', 'May 10', 'May 15', 'May 20', 'May 25', 'Today'],
      views: [75, 120, 143, 89, 105, 137, 152],
      clicks: [28, 42, 51, 32, 38, 47, 59],
      ctr: [37, 35, 36, 36, 36, 34, 39]
    }
  };
  
  // Helper to get percentage width for bar charts
  const getPercentageWidth = (value: number, max: number) => {
    return `${(value / max) * 100}%`;
  };
  
  // Helper to show growth indicators
  const renderGrowth = (value: number) => {
    if (value === 0) return <span className="text-gray-500">—</span>;
    
    return value > 0 ? (
      <span className="text-green-600 flex items-center">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {value}%
      </span>
    ) : (
      <span className="text-red-600 flex items-center">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
        {Math.abs(value)}%
      </span>
    );
  };
  
  return (
    <div>
      {/* Analytics Header */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Analytics Dashboard</h2>
            <p className="text-gray-600">
              Track and analyze your profile's performance with detailed metrics.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Time range selector */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              {(['7d', '30d', '90d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } ${
                    range === '7d' ? 'rounded-l-lg' : ''
                  } ${
                    range === 'all' ? 'rounded-r-lg' : ''
                  } border border-gray-200`}
                >
                  {range === '7d' ? '7 Days' :
                   range === '30d' ? '30 Days' :
                   range === '90d' ? '90 Days' : 'All Time'}
                </button>
              ))}
            </div>
            
            {/* Export button */}
            <div className="relative inline-block">
              <button
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 inline-flex items-center"
              >
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-500 mb-1">Total Profile Views</div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-gray-800">{analyticsData.summary.totalViews.toLocaleString()}</div>
            <div className="text-green-600 text-sm font-medium">
              {analyticsData.summary.growthRate}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-500 mb-1">Total Link Clicks</div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-gray-800">{analyticsData.summary.totalClicks.toLocaleString()}</div>
            <div className="text-green-600 text-sm font-medium">
              {analyticsData.summary.growthRate}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-500 mb-1">Average CTR</div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-gray-800">{analyticsData.summary.ctr}%</div>
            <div className="text-green-600 text-sm font-medium">+2.4%</div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-500 mb-1">Avg Time on Profile</div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-bold text-gray-800">{analyticsData.summary.avgTimeOnPage}</div>
            <div className="text-green-600 text-sm font-medium">+6%</div>
          </div>
        </div>
      </div>
      
      {/* Main Analytics Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Chart Section */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-700">Performance Over Time</h3>
              
              {/* View type selector */}
              <div className="inline-flex rounded-md shadow-sm" role="group">
                {(['views', 'clicks', 'ctr'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setViewType(type)}
                    className={`px-3 py-1 text-xs font-medium ${
                      viewType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } ${
                      type === 'views' ? 'rounded-l-lg' : ''
                    } ${
                      type === 'ctr' ? 'rounded-r-lg' : ''
                    } border border-gray-200`}
                  >
                    {type === 'views' ? 'Views' :
                     type === 'clicks' ? 'Clicks' : 'CTR %'}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-64 bg-gray-50 rounded p-4">
              <div className="flex flex-col h-full justify-end">
                <div className="flex items-end justify-between h-48">
                  {analyticsData.timeData[viewType].map((value, index) => (
                    <div key={index} className="flex flex-col items-center" style={{ width: `${100 / analyticsData.timeData[viewType].length}%` }}>
                      <div 
                        className="w-5/6 bg-blue-500 rounded-t hover:bg-blue-600 transition-all duration-200" 
                        style={{ 
                          height: `${(value / Math.max(...analyticsData.timeData[viewType])) * 100}%`,
                          minHeight: '4px'
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  {analyticsData.timeData.labels.map((label, index) => (
                    <div key={index}>{label}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Link Performance */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-700 mb-4">Link Performance</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.linkPerformance.map((link) => (
                    <tr key={link.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{link.title}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{link.clicks}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{link.views}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{link.ctr}%</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderGrowth(link.growth)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Sidebar Analytics */}
        <div className="md:col-span-1 space-y-6">
          {/* Traffic Sources */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-700 mb-4">Traffic Sources</h3>
            <div className="space-y-3">
              {analyticsData.trafficSources.map((source, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{source.source}</span>
                    <span className="text-gray-500">{source.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${source.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Device Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-700 mb-4">Device Breakdown</h3>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="mb-1">
                    <svg className="w-6 h-6 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500">Desktop</div>
                  <div className="font-semibold text-gray-800">{analyticsData.deviceBreakdown.desktop}%</div>
                </div>
              </div>
              <div className="flex-1 p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="mb-1">
                    <svg className="w-6 h-6 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500">Mobile</div>
                  <div className="font-semibold text-gray-800">{analyticsData.deviceBreakdown.mobile}%</div>
                </div>
              </div>
              <div className="flex-1 p-3 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="mb-1">
                    <svg className="w-6 h-6 mx-auto text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-xs text-gray-500">Tablet</div>
                  <div className="font-semibold text-gray-800">{analyticsData.deviceBreakdown.tablet}%</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Demographics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-700 mb-4">Visitor Demographics</h3>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Age Groups</h4>
              <div className="space-y-2">
                {analyticsData.visitorDemographics.age.map((ageGroup, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700">{ageGroup.group}</span>
                      <span className="text-gray-500">{ageGroup.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${ageGroup.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Gender Distribution</h4>
              <div className="flex gap-2 text-center">
                <div className="flex-1 py-2 rounded-lg bg-blue-50">
                  <div className="text-xs text-gray-500">Male</div>
                  <div className="font-semibold text-gray-800">{analyticsData.visitorDemographics.gender.male}%</div>
                </div>
                <div className="flex-1 py-2 rounded-lg bg-pink-50">
                  <div className="text-xs text-gray-500">Female</div>
                  <div className="font-semibold text-gray-800">{analyticsData.visitorDemographics.gender.female}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="font-semibold text-gray-700 mb-4">Visitor Flow</h3>
        <div className="overflow-hidden">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <p>Visitor flow visualization will appear here.</p>
              <p className="text-xs">Showing how users navigate between your links</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-2">AI-Generated Insights</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Your LinkedIn link performs best with visitors from the United States and Canada.</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Mobile visitors tend to engage more with your GitHub Repository link compared to other devices.</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">Your profile receives the most traffic on Tuesdays and Wednesdays between 10am and 2pm.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Branding content component with AI-powered suggestions
const BrandingContent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(true);
  const [activeTab, setActiveTab] = useState<'branding' | 'content' | 'design'>('branding');
  const [brandingForm, setBrandingForm] = useState({
    industry: 'Technology',
    targetAudience: 'Tech professionals and entrepreneurs',
    keyValues: 'Innovation, Quality, Reliability',
    tone: 'Professional',
    competitors: '',
    additionalInfo: ''
  });
  
  // Sample branding suggestions data
  const brandingSuggestions = {
    brandPositioning: "A dedicated professional combining technical expertise with creative problem-solving to deliver innovative solutions that make a meaningful impact.",
    suggestedBio: "Full stack developer specializing in modern web technologies. Passionate about creating intuitive user experiences and solving complex problems. Available for collaborations and projects that push boundaries.",
    colorPalette: [
      { name: "Primary", hex: "#2563EB" },
      { name: "Accent", hex: "#9333EA" },
      { name: "Dark", hex: "#1F2937" },
      { name: "Light", hex: "#F3F4F6" }
    ],
    contentIdeas: [
      "5 Ways to Optimize Your Development Workflow",
      "Building Accessible Web Applications: A Comprehensive Guide",
      "The Future of Web Technologies: Trends to Watch in 2023",
      "From Concept to Deployment: A Case Study in Rapid Application Development",
      "Comparing Modern JavaScript Frameworks: Which One Is Right for Your Project?"
    ],
    improvementTips: [
      "Consider adding more specific details about your technical expertise in your bio",
      "Include links to sample projects or case studies to demonstrate your capabilities",
      "Add testimonials from previous clients or collaborators to build credibility",
      "Ensure your profile maintains a consistent tone across all sections"
    ],
    toneExamples: {
      formal: "I am a software engineer with extensive experience in developing enterprise solutions...",
      conversational: "Hey there! I'm a developer who loves creating awesome web experiences...",
      technical: "Specialized in full-stack development with React, Node.js, and PostgreSQL...",
      creative: "Turning complex technical challenges into elegant digital solutions is my passion..."
    },
    designSuggestions: {
      typography: {
        heading: "Inter, 700 weight",
        body: "Inter, 400 weight",
        accent: "Montserrat, 600 weight"
      },
      spacing: "Use consistent 16px/24px/32px spacing increments",
      imagery: "Incorporate abstract tech patterns and minimal illustrations"
    },
    socialMediaTemplates: [
      {
        platform: "LinkedIn",
        postTemplate: "Excited to share my latest project: [PROJECT NAME]. This solution helps [TARGET AUDIENCE] to [BENEFIT]. #WebDevelopment #Innovation"
      },
      {
        platform: "Twitter",
        postTemplate: "Just launched: [PROJECT] 🚀 Solving [PROBLEM] for [AUDIENCE]. Check it out! [LINK] #Tech #Development"
      }
    ]
  };
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBrandingForm({
      ...brandingForm,
      [name]: value
    });
  };
  
  // Handle generate branding suggestions
  const handleGenerateSuggestions = () => {
    setIsLoading(true);
    
    // Simulate API call to OpenAI
    setTimeout(() => {
      setIsLoading(false);
      setGenerationComplete(true);
    }, 1500);
  };
  
  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    
    // Show toast notification (would be implemented with a toast component in a real app)
    alert("Copied to clipboard!");
  };
  
  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">AI Branding Suggestions</h2>
            <p className="text-gray-600">
              Get personalized branding recommendations powered by AI to enhance your online presence.
            </p>
          </div>
          
          {generationComplete ? (
            <button
              onClick={() => setGenerationComplete(false)}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Generate New
            </button>
          ) : null}
        </div>
        
        {!generationComplete ? (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Tell us about your brand</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry / Field</label>
                  <input
                    type="text"
                    name="industry"
                    value={brandingForm.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Technology, Healthcare, Education"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <input
                    type="text"
                    name="targetAudience"
                    value={brandingForm.targetAudience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Professionals, Students, Startups"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Values (comma separated)</label>
                <input
                  type="text"
                  name="keyValues"
                  value={brandingForm.keyValues}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Innovation, Quality, Sustainability"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Tone</label>
                <select
                  name="tone"
                  value={brandingForm.tone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Professional">Professional</option>
                  <option value="Casual">Casual</option>
                  <option value="Technical">Technical</option>
                  <option value="Creative">Creative</option>
                  <option value="Authoritative">Authoritative</option>
                  <option value="Friendly">Friendly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Competitors (optional)</label>
                <input
                  type="text"
                  name="competitors"
                  value={brandingForm.competitors}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Names of key competitors in your field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information (optional)</label>
                <textarea
                  name="additionalInfo"
                  value={brandingForm.additionalInfo}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Any other details you'd like to include in your branding suggestions"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleGenerateSuggestions}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-md text-white ${isLoading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'} transition-colors flex items-center gap-2`}
                >
                  {isLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Generating Suggestions...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Suggestions
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('branding')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'branding' 
                      ? 'border-purple-500 text-purple-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Brand Identity
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'content' 
                      ? 'border-purple-500 text-purple-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Content Ideas
                </button>
                <button
                  onClick={() => setActiveTab('design')}
                  className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'design' 
                      ? 'border-purple-500 text-purple-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Design Elements
                </button>
              </nav>
            </div>
            
            {/* Tab Content: Brand Identity */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-purple-700 text-lg">Brand Positioning Statement</h3>
                    <button 
                      onClick={() => copyToClipboard(brandingSuggestions.brandPositioning)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-700 italic text-lg">
                    "{brandingSuggestions.brandPositioning}"
                  </p>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
                    <span className="mr-2">Use this to:</span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full mr-2">About section</span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">Social media bios</span>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-purple-700 text-lg">Suggested Bio</h3>
                    <button 
                      onClick={() => copyToClipboard(brandingSuggestions.suggestedBio)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-700">
                    {brandingSuggestions.suggestedBio}
                  </p>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-purple-700 text-lg">Key Improvement Tips</h3>
                  </div>
                  <ul className="space-y-2">
                    {brandingSuggestions.improvementTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-purple-700 text-lg">Voice & Tone Examples</h3>
                  </div>
                  <div className="space-y-4 mt-2">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Formal
                      </h4>
                      <p className="text-sm text-gray-600 italic">{brandingSuggestions.toneExamples.formal}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Conversational
                      </h4>
                      <p className="text-sm text-gray-600 italic">{brandingSuggestions.toneExamples.conversational}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Technical
                      </h4>
                      <p className="text-sm text-gray-600 italic">{brandingSuggestions.toneExamples.technical}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab Content: Content Ideas */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-purple-700 text-lg mb-4">Content Topic Ideas</h3>
                  <ul className="space-y-3">
                    {brandingSuggestions.contentIdeas.map((idea, index) => (
                      <li key={index} className="flex items-start bg-gray-50 p-3 rounded-md">
                        <div className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mr-3">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">{idea}</p>
                          <div className="flex mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                              Article
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Social Post
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => copyToClipboard(idea)}
                          className="text-gray-400 hover:text-gray-600 ml-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-purple-700 text-lg mb-4">Social Media Post Templates</h3>
                  <div className="space-y-4">
                    {brandingSuggestions.socialMediaTemplates.map((template, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium text-gray-700 flex items-center">
                            <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 text-gray-700">
                              {template.platform === 'LinkedIn' ? 'in' : 'X'}
                            </span>
                            {template.platform}
                          </h4>
                          <button 
                            onClick={() => copyToClipboard(template.postTemplate)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-600">{template.postTemplate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab Content: Design Elements */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-purple-700 text-lg mb-4">Color Palette</h3>
                  <div className="flex flex-wrap gap-4">
                    {brandingSuggestions.colorPalette.map((color, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-16 h-16 rounded-lg mb-2 shadow-md" 
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700">{color.name}</span>
                        <span className="text-xs text-gray-500">{color.hex}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Color Usage Tips</h4>
                    <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
                      <li>Use the primary color for main actions and brand identification</li>
                      <li>Apply the accent color sparingly for highlighting important elements</li>
                      <li>Use dark and light colors for text and backgrounds respectively</li>
                    </ul>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-purple-700 text-lg mb-4">Typography Recommendations</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <h4 className="text-sm text-gray-500 mb-1">Headings</h4>
                        <p className="text-xl font-bold text-gray-800 mb-1">Inter Bold</p>
                        <p className="text-xs text-gray-500">{brandingSuggestions.designSuggestions.typography.heading}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <h4 className="text-sm text-gray-500 mb-1">Body Text</h4>
                        <p className="text-base font-normal text-gray-800 mb-1">Inter Regular</p>
                        <p className="text-xs text-gray-500">{brandingSuggestions.designSuggestions.typography.body}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <h4 className="text-sm text-gray-500 mb-1">Accent Text</h4>
                        <p className="text-base font-semibold text-gray-800 mb-1">Montserrat SemiBold</p>
                        <p className="text-xs text-gray-500">{brandingSuggestions.designSuggestions.typography.accent}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Spacing</h4>
                      <p className="text-sm text-gray-600">{brandingSuggestions.designSuggestions.spacing}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Imagery Style</h4>
                      <p className="text-sm text-gray-600">{brandingSuggestions.designSuggestions.imagery}</p>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-5">
                  <h3 className="font-semibold text-purple-700 text-lg mb-4">Example Application</h3>
                  {/* Example of branding applied */}
                  <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                    <div className="pb-3 mb-3 border-b border-gray-200 flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-2">
                        D
                      </div>
                      <h4 className="font-bold text-gray-800">Demo Profile</h4>
                    </div>
                    <p className="text-gray-700 mb-3">{brandingSuggestions.suggestedBio.substring(0, 100)}...</p>
                    <div className="space-y-2">
                      <div className="flex items-center p-2 bg-white rounded border border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-800">Portfolio</span>
                      </div>
                      <div className="flex items-center p-2 bg-white rounded border border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-800">GitHub</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* AI Branding Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800">Personalized Branding</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Get AI-generated branding suggestions tailored to your industry, values, and target audience.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Professional brand positioning
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Optimized bio and descriptions
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Industry-specific recommendations
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800">Design Elements</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Get color palettes, typography recommendations, and visual design suggestions that match your brand identity.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Custom color palettes
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Typography suggestions
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Visual style recommendations
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800">Content Creation</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Generate content ideas, social media post templates, and tone examples for your brand.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Content topic ideas
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Social media post templates
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Voice and tone examples
            </li>
          </ul>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-purple-700 text-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-2">Enhance Your Brand with AI</h3>
            <p className="text-purple-100">
              Our AI-powered branding tools help you create a consistent and professional online presence. Generate personalized suggestions for your profile and content.
            </p>
          </div>
          <div className="md:col-span-1 md:text-right">
            <button 
              onClick={() => setGenerationComplete(false)}
              className="px-6 py-3 bg-white text-purple-700 font-medium rounded-md hover:bg-purple-50 transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Try AI Branding
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Collaborative content component with collaborative link management
const CollaborativeContent = () => {
  // Define types for collaborative projects and invitations
  type CollaboratorRole = 'owner' | 'editor' | 'viewer';
  
  type Collaborator = {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
    role: CollaboratorRole;
    addedAt: string;
  };
  
  type CollaborativeProject = {
    id: number;
    name: string;
    description: string;
    collaborators: Collaborator[];
    links: CollaborativeLink[];
    createdAt: string;
    updatedAt: string;
    isPublic: boolean;
    viewCount: number;
  };
  
  type CollaborativeLink = {
    id: number;
    title: string;
    url: string;
    description?: string;
    icon?: string;
    addedBy: number; // collaborator id
    addedAt: string;
    clicks: number;
  };
  
  type Invitation = {
    id: number;
    projectId: number;
    projectName: string;
    senderName: string;
    senderEmail: string;
    role: CollaboratorRole;
    sentAt: string;
    status: 'pending' | 'accepted' | 'declined';
  };
  
  // Sample data
  const [projects, setProjects] = useState<CollaborativeProject[]>([
    {
      id: 1,
      name: 'JavaScript Resources',
      description: 'Collection of JavaScript tutorials, libraries, and tools for modern web development.',
      collaborators: [
        { id: 1, name: 'You', role: 'owner', addedAt: '2023-05-01' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'editor', addedAt: '2023-05-02' },
        { id: 3, name: 'Alex Chen', email: 'alex@example.com', role: 'viewer', addedAt: '2023-05-03' },
      ],
      links: [
        { id: 1, title: 'JavaScript Fundamentals', url: 'https://example.com/js-fundamentals', description: 'Learn the basics of JavaScript programming', addedBy: 1, addedAt: '2023-05-01', clicks: 42 },
        { id: 2, title: 'Modern JS Libraries', url: 'https://example.com/js-libraries', description: 'Overview of popular JavaScript libraries in 2023', addedBy: 2, addedAt: '2023-05-03', clicks: 28 },
      ],
      createdAt: '2023-05-01',
      updatedAt: '2023-05-15',
      isPublic: true,
      viewCount: 267
    },
    {
      id: 2,
      name: 'React Development',
      description: 'Shared collection of React resources, component libraries, and best practices.',
      collaborators: [
        { id: 1, name: 'You', role: 'editor', addedAt: '2023-04-15' },
        { id: 4, name: 'Sam Johnson', email: 'sam@example.com', role: 'owner', addedAt: '2023-04-10' },
      ],
      links: [
        { id: 3, title: 'React Hooks', url: 'https://example.com/react-hooks', description: 'In-depth guide to React hooks', addedBy: 4, addedAt: '2023-04-12', clicks: 56 },
        { id: 4, title: 'React State Management', url: 'https://example.com/state-management', description: 'Comparison of state management solutions in React', addedBy: 1, addedAt: '2023-04-16', clicks: 34 },
      ],
      createdAt: '2023-04-10',
      updatedAt: '2023-05-10',
      isPublic: false,
      viewCount: 128
    }
  ]);
  
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: 1,
      projectId: 3,
      projectName: 'UI Design Resources',
      senderName: 'Michael Roberts',
      senderEmail: 'michael@example.com',
      role: 'editor',
      sentAt: '2023-05-14',
      status: 'pending'
    }
  ]);
  
  // State for managing UI
  const [currentProject, setCurrentProject] = useState<CollaborativeProject | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({ name: '', description: '', isPublic: true });
  const [newCollaboratorForm, setNewCollaboratorForm] = useState({ email: '', role: 'viewer' as CollaboratorRole });
  const [newLinkForm, setNewLinkForm] = useState({ title: '', url: '', description: '' });
  const [showInvitations, setShowInvitations] = useState(false);
  const [activeTab, setActiveTab] = useState<'your-projects' | 'shared-with-you'>('your-projects');
  
  // Get projects where user is owner
  const ownedProjects = projects.filter(project => 
    project.collaborators.some(c => c.id === 1 && c.role === 'owner')
  );
  
  // Get projects where user is not owner but a collaborator
  const sharedProjects = projects.filter(project => 
    project.collaborators.some(c => c.id === 1 && c.role !== 'owner')
  );
  
  // Handle adding a new project
  const handleAddProject = () => {
    if (newProjectForm.name.trim() === '') return;
    
    const newProject: CollaborativeProject = {
      id: projects.length + 1,
      name: newProjectForm.name,
      description: newProjectForm.description,
      collaborators: [
        { id: 1, name: 'You', role: 'owner', addedAt: new Date().toISOString().split('T')[0] }
      ],
      links: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isPublic: newProjectForm.isPublic,
      viewCount: 0
    };
    
    setProjects([...projects, newProject]);
    setNewProjectForm({ name: '', description: '', isPublic: true });
    setIsAddingProject(false);
  };
  
  // Handle adding a collaborator to the current project
  const handleAddCollaborator = () => {
    if (!currentProject || newCollaboratorForm.email.trim() === '') return;
    
    const updatedProject = { ...currentProject };
    updatedProject.collaborators.push({
      id: Math.max(...currentProject.collaborators.map(c => c.id)) + 1,
      name: newCollaboratorForm.email.split('@')[0], // Use first part of email as name
      email: newCollaboratorForm.email,
      role: newCollaboratorForm.role,
      addedAt: new Date().toISOString().split('T')[0]
    });
    
    setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
    setCurrentProject(updatedProject);
    setNewCollaboratorForm({ email: '', role: 'viewer' });
    setIsAddingCollaborator(false);
  };
  
  // Handle adding a link to the current project
  const handleAddLink = () => {
    if (!currentProject || newLinkForm.title.trim() === '' || newLinkForm.url.trim() === '') return;
    
    const updatedProject = { ...currentProject };
    updatedProject.links.push({
      id: updatedProject.links.length > 0 ? Math.max(...updatedProject.links.map(l => l.id)) + 1 : 1,
      title: newLinkForm.title,
      url: newLinkForm.url,
      description: newLinkForm.description,
      addedBy: 1, // Current user
      addedAt: new Date().toISOString().split('T')[0],
      clicks: 0
    });
    
    setProjects(projects.map(p => p.id === currentProject.id ? updatedProject : p));
    setCurrentProject(updatedProject);
    setNewLinkForm({ title: '', url: '', description: '' });
    setIsAddingLink(false);
  };
  
  // Handle invitation response
  const handleInvitation = (invitationId: number, accepted: boolean) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) return;
    
    // Update invitation status
    setInvitations(invitations.map(inv => 
      inv.id === invitationId 
        ? { ...inv, status: accepted ? 'accepted' : 'declined' } 
        : inv
    ));
    
    // If accepted, create a new project or add to existing
    if (accepted) {
      // This would typically involve an API call in a real application
      alert(`You have ${accepted ? 'accepted' : 'declined'} the invitation to ${invitation.projectName}`);
    }
  };
  
  // Get role display name with icon
  const getRoleDisplay = (role: CollaboratorRole) => {
    switch (role) {
      case 'owner':
        return (
          <div className="flex items-center text-blue-700">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Owner
          </div>
        );
      case 'editor':
        return (
          <div className="flex items-center text-green-700">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editor
          </div>
        );
      case 'viewer':
        return (
          <div className="flex items-center text-gray-700">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Viewer
          </div>
        );
      default:
        return role;
    }
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  // Render content based on current view
  return (
    <div>
      {/* Invitations banner - shown only if there are pending invitations */}
      {invitations.some(inv => inv.status === 'pending') && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
          <button 
            onClick={() => setShowInvitations(false)} 
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">You have pending collaboration invitations</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>You have {invitations.filter(inv => inv.status === 'pending').length} invitation(s) to collaborate on projects.</p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowInvitations(!showInvitations)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  {showInvitations ? 'Hide invitations' : 'View invitations'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Invitations list */}
          {showInvitations && (
            <div className="mt-4 space-y-3 pl-8">
              {invitations.filter(inv => inv.status === 'pending').map(invitation => (
                <div key={invitation.id} className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {invitation.senderName} invited you to collaborate on "{invitation.projectName}"
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Role: {getRoleDisplay(invitation.role)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(invitation.sentAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleInvitation(invitation.id, false)}
                        className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleInvitation(invitation.id, true)}
                        className="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Main content */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        {currentProject ? (
          // Project detail view
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <button
                  onClick={() => setCurrentProject(null)}
                  className="mr-3 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{currentProject.name}</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {currentProject.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span className="flex items-center mr-4">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {currentProject.viewCount} views
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Created {currentProject.createdAt}
                </span>
              </div>
            </div>
            
            {/* Project content tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <a href="#links" className="border-blue-500 text-blue-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                  Links ({currentProject.links.length})
                </a>
                <a href="#collaborators" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                  Collaborators ({currentProject.collaborators.length})
                </a>
                <a href="#settings" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
                  Settings
                </a>
              </nav>
            </div>
            
            {/* Links section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Links</h3>
                {currentProject.collaborators.some(c => c.id === 1 && (c.role === 'owner' || c.role === 'editor')) && (
                  <button
                    onClick={() => setIsAddingLink(true)}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Link
                  </button>
                )}
              </div>
              
              {isAddingLink ? (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-3">Add New Link</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={newLinkForm.title}
                        onChange={(e) => setNewLinkForm({...newLinkForm, title: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter link title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="url"
                        value={newLinkForm.url}
                        onChange={(e) => setNewLinkForm({...newLinkForm, url: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                      <textarea
                        value={newLinkForm.description}
                        onChange={(e) => setNewLinkForm({...newLinkForm, description: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter a short description"
                        rows={2}
                      ></textarea>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsAddingLink(false)}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddLink}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Add Link
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              
              {currentProject.links.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <p className="text-gray-500">No links have been added to this project yet.</p>
                  {currentProject.collaborators.some(c => c.id === 1 && (c.role === 'owner' || c.role === 'editor')) && (
                    <button
                      onClick={() => setIsAddingLink(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Add Your First Link
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {currentProject.links.map(link => (
                    <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{link.title}</h4>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                              {link.url}
                            </a>
                            {link.description && (
                              <p className="text-sm text-gray-500 mt-1">{link.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="flex items-center mr-4">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {link.clicks} clicks
                          </span>
                          {currentProject.collaborators.some(c => c.id === 1 && (c.role === 'owner' || c.role === 'editor')) && (
                            <button className="p-1 text-gray-400 hover:text-gray-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 border-t border-gray-100 pt-2 text-xs text-gray-500">
                        Added by {currentProject.collaborators.find(c => c.id === link.addedBy)?.name || 'Unknown'} on {link.addedAt}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Projects list view
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Collaborative Projects</h2>
                <p className="text-gray-600">
                  Create and manage collaborative projects with your team.
                </p>
              </div>
              <button
                onClick={() => setIsAddingProject(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Project
              </button>
            </div>
            
            {/* New project form */}
            {isAddingProject && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Create New Project</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input 
                      type="text"
                      value={newProjectForm.name}
                      onChange={(e) => setNewProjectForm({...newProjectForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      value={newProjectForm.description}
                      onChange={(e) => setNewProjectForm({...newProjectForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter project description"
                      rows={3}
                    ></textarea>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox"
                      id="isPublic"
                      checked={newProjectForm.isPublic}
                      onChange={(e) => setNewProjectForm({...newProjectForm, isPublic: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                      Make project public (anyone with the link can view)
                    </label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => setIsAddingProject(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleAddProject}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create Project
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Projects tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button 
                  onClick={() => setActiveTab('your-projects')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'your-projects' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Your Projects ({ownedProjects.length})
                </button>
                <button 
                  onClick={() => setActiveTab('shared-with-you')}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'shared-with-you' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Shared with You ({sharedProjects.length})
                </button>
              </nav>
            </div>
            
            {/* Projects list */}
            <div className="space-y-4">
              {activeTab === 'your-projects' ? (
                ownedProjects.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-500">You haven't created any projects yet.</p>
                    <button
                      onClick={() => setIsAddingProject(true)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      Create Your First Project
                    </button>
                  </div>
                ) : (
                  ownedProjects.map(project => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <h3 className="font-medium text-blue-700 hover:text-blue-800 cursor-pointer" onClick={() => setCurrentProject(project)}>
                              {project.name}
                            </h3>
                            {project.isPublic ? (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Public</span>
                            ) : (
                              <span className="ml-2 bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">Private</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <button
                            onClick={() => setCurrentProject(project)}
                            className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            {project.collaborators.slice(0, 3).map(collaborator => (
                              <div key={collaborator.id} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                                {collaborator.avatar ? (
                                  <img src={collaborator.avatar} alt={collaborator.name} className="w-full h-full rounded-full" />
                                ) : (
                                  getInitials(collaborator.name)
                                )}
                              </div>
                            ))}
                            {project.collaborators.length > 3 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-700">
                                +{project.collaborators.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            {project.collaborators.length} collaborator{project.collaborators.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="flex items-center mr-3">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            {project.links.length} links
                          </span>
                          <span className="flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {project.viewCount} views
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                sharedProjects.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500">No projects have been shared with you yet.</p>
                  </div>
                ) : (
                  sharedProjects.map(project => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center">
                            <h3 className="font-medium text-blue-700 hover:text-blue-800 cursor-pointer" onClick={() => setCurrentProject(project)}>
                              {project.name}
                            </h3>
                            <span className="ml-2 text-xs text-gray-500">
                              {getRoleDisplay(project.collaborators.find(c => c.id === 1)?.role || 'viewer')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <button
                            onClick={() => setCurrentProject(project)}
                            className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="mr-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                            {project.collaborators.find(c => c.role === 'owner')?.avatar ? (
                              <img src={project.collaborators.find(c => c.role === 'owner')?.avatar} alt="Owner" className="w-full h-full rounded-full" />
                            ) : (
                              getInitials(project.collaborators.find(c => c.role === 'owner')?.name || 'Unknown')
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            Owned by {project.collaborators.find(c => c.role === 'owner')?.name || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="flex items-center">
                            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Last updated: {project.updatedAt}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Features showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800">Team Collaboration</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Invite teammates to collaborate on your projects with different permission levels.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Owner, Editor, and Viewer roles
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Email invitations
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Activity tracking
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800">Privacy Controls</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Control who can see your projects and links with flexible privacy settings.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Public or private projects
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Granular access controls
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Secure sharing options
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800">Performance Tracking</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Monitor how your collaborative links are performing with real-time analytics.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Link click tracking
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Profile view analytics
            </li>
            <li className="flex items-start">
              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Performance reports
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Define profile and notification types
type Profile = {
  name: string;
  username: string;
  bio: string;
  email: string;
  profession: string;
  profileColor: string;
  welcomeMessage: string;
  theme: 'light' | 'dark' | 'system';
};

type NotificationSettings = {
  email: boolean;
  browser: boolean;
  mobile: boolean;
  weeklyReport: boolean;
  newFollowers: boolean;
  profileViews: boolean;
};

// Settings content component with editable profile
const SettingsContent = () => {
  const [profile, setProfile] = useState<Profile>({
    name: 'Demo User',
    username: 'demouser',
    bio: 'Full stack developer specializing in modern web technologies.',
    email: 'demo@example.com',
    profession: 'Software Engineer',
    profileColor: '#3B82F6',
    welcomeMessage: 'Welcome to my profile!',
    theme: 'light',
  });
  
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState<Profile>({...profile});
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    browser: false,
    mobile: true,
    weeklyReport: true,
    newFollowers: true,
    profileViews: false,
  });
  
  const [selectedTab, setSelectedTab] = useState('profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const handleToggleNotification = (key: keyof NotificationSettings) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key]
    });
  };
  
  const handleUpdateProfile = () => {
    setProfile({...tempProfile});
    setEditMode(false);
  };
  
  const handleCancelEdit = () => {
    setTempProfile({...profile});
    setEditMode(false);
  };
  
  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button 
      onClick={onChange} 
      className={`${enabled ? 'bg-blue-600' : 'bg-gray-300'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
    >
      <span 
        className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </button>
  );
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <p className="text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>
        {selectedTab === 'profile' && !editMode && (
          <button 
            onClick={() => setEditMode(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>
      
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-6">
          <button 
            onClick={() => setSelectedTab('profile')}
            className={`pb-3 px-1 ${selectedTab === 'profile' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setSelectedTab('appearance')}
            className={`pb-3 px-1 ${selectedTab === 'appearance' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
          >
            Appearance
          </button>
          <button 
            onClick={() => setSelectedTab('notifications')}
            className={`pb-3 px-1 ${selectedTab === 'notifications' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
          >
            Notifications
          </button>
          <button 
            onClick={() => setSelectedTab('account')}
            className={`pb-3 px-1 ${selectedTab === 'account' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
          >
            Account
          </button>
        </div>
      </div>
      
      {selectedTab === 'profile' && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start mb-6">
              <div className="mr-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 relative">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-4xl font-semibold">{profile.name.charAt(0)}</span>
                  )}
                  {editMode && (
                    <button 
                      className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white"
                      onClick={() => alert("Image upload would be implemented here")}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-800">{profile.name}</h3>
                <p className="text-gray-500">@{profile.username}</p>
                <p className="text-sm text-gray-600 mt-1">{profile.profession}</p>
                <p className="text-sm text-gray-600 mt-2 italic">{profile.bio}</p>
              </div>
            </div>
            
            {editMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={tempProfile.name} 
                      onChange={(e) => setTempProfile({...tempProfile, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input 
                      type="text" 
                      value={tempProfile.username} 
                      onChange={(e) => setTempProfile({...tempProfile, username: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={tempProfile.email} 
                      onChange={(e) => setTempProfile({...tempProfile, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                    <input 
                      type="text" 
                      value={tempProfile.profession} 
                      onChange={(e) => setTempProfile({...tempProfile, profession: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea 
                    value={tempProfile.bio} 
                    onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    rows={3}
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
                  <textarea 
                    value={tempProfile.welcomeMessage} 
                    onChange={(e) => setTempProfile({...tempProfile, welcomeMessage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                    rows={2}
                    placeholder="Welcome message shown to visitors of your profile"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <button 
                    onClick={handleCancelEdit}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpdateProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Email</h4>
                    <p className="text-gray-800">{profile.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Profession</h4>
                    <p className="text-gray-800">{profile.profession}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Welcome Message</h4>
                  <p className="text-gray-800 border border-gray-100 bg-gray-50 rounded p-2 mt-1">{profile.welcomeMessage}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {selectedTab === 'appearance' && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Theme Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Theme Mode</label>
                <div className="flex space-x-4">
                  <button 
                    className={`p-4 rounded-lg border ${profile.theme === 'light' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'} flex items-center space-x-3`}
                    onClick={() => setProfile({...profile, theme: 'light'})}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Light</span>
                  </button>
                  <button 
                    className={`p-4 rounded-lg border ${profile.theme === 'dark' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'} flex items-center space-x-3`}
                    onClick={() => setProfile({...profile, theme: 'dark'})}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span>Dark</span>
                  </button>
                  <button 
                    className={`p-4 rounded-lg border ${profile.theme === 'system' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200'} flex items-center space-x-3`}
                    onClick={() => setProfile({...profile, theme: 'system'})}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>System</span>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Profile Color</label>
                <div className="grid grid-cols-6 gap-3">
                  {['#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981'].map(color => (
                    <button 
                      key={color}
                      onClick={() => setProfile({...profile, profileColor: color})}
                      className={`w-10 h-10 rounded-full ${profile.profileColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Layout Preference</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
                    <div className="bg-gray-100 h-24 mb-2 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">List View</span>
                    </div>
                    <div className="text-sm font-medium">Default</div>
                  </button>
                  <button className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
                    <div className="bg-gray-100 h-24 mb-2 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">Grid View</span>
                    </div>
                    <div className="text-sm font-medium">Compact</div>
                  </button>
                  <button className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
                    <div className="bg-gray-100 h-24 mb-2 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-500">Card View</span>
                    </div>
                    <div className="text-sm font-medium">Card Layout</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedTab === 'notifications' && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Email Notifications</h4>
                  <p className="text-xs text-gray-500 mt-1">Receive email alerts for important activity</p>
                </div>
                <ToggleSwitch 
                  enabled={notifications.email} 
                  onChange={() => handleToggleNotification('email')} 
                />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Browser Notifications</h4>
                  <p className="text-xs text-gray-500 mt-1">Receive browser alerts for real-time updates</p>
                </div>
                <ToggleSwitch 
                  enabled={notifications.browser} 
                  onChange={() => handleToggleNotification('browser')} 
                />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Mobile Push Notifications</h4>
                  <p className="text-xs text-gray-500 mt-1">Receive notifications on your mobile device</p>
                </div>
                <ToggleSwitch 
                  enabled={notifications.mobile} 
                  onChange={() => handleToggleNotification('mobile')} 
                />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Weekly Report</h4>
                  <p className="text-xs text-gray-500 mt-1">Receive a weekly summary of your profile performance</p>
                </div>
                <ToggleSwitch 
                  enabled={notifications.weeklyReport} 
                  onChange={() => handleToggleNotification('weeklyReport')} 
                />
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">New Followers</h4>
                  <p className="text-xs text-gray-500 mt-1">Notify when someone follows your profile</p>
                </div>
                <ToggleSwitch 
                  enabled={notifications.newFollowers} 
                  onChange={() => handleToggleNotification('newFollowers')} 
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Profile Views</h4>
                  <p className="text-xs text-gray-500 mt-1">Notify when someone views your profile</p>
                </div>
                <ToggleSwitch 
                  enabled={notifications.profileViews} 
                  onChange={() => handleToggleNotification('profileViews')} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedTab === 'account' && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Account Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Change Password</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Current Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">New Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Confirm New Password</label>
                    <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Privacy Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Make profile public</p>
                      <p className="text-xs text-gray-500">Allow anyone to view your profile</p>
                    </div>
                    <ToggleSwitch enabled={true} onChange={() => {}} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">Show click statistics</p>
                      <p className="text-xs text-gray-500">Display link click counts on your profile</p>
                    </div>
                    <ToggleSwitch enabled={true} onChange={() => {}} />
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h4>
                <div className="space-y-3">
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors">
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function SimplePage() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Listen for URL changes and update the current page
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        setCurrentPage('dashboard');
      } else if (path.startsWith('/social-score')) {
        setCurrentPage('social-score');
      } else if (path.startsWith('/analytics')) {
        setCurrentPage('analytics');
      } else if (path.startsWith('/branding')) {
        setCurrentPage('branding');
      } else if (path.startsWith('/collaborative')) {
        setCurrentPage('collaborative');
      } else if (path.startsWith('/settings')) {
        setCurrentPage('settings');
      }
    };
    
    // Handle initial page load
    handleLocationChange();
    
    // Listen for navigation events
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);
  
  // Render content based on current page
  const renderContent = () => {
    switch (currentPage) {
      case 'social-score':
        return <SocialScoreContent />;
      case 'analytics':
        return <AnalyticsContent />;
      case 'branding':
        return <BrandingContent />;
      case 'collaborative':
        return <CollaborativeContent />;
      case 'settings':
        return <SettingsContent />;
      case 'dashboard':
      default:
        return <DashboardContent />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SimpleNavigation activeItem={currentPage} />
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}