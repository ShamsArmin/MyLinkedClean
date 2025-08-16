import React, { useState } from 'react';
import { CollaborativeLinks } from './components/collaborative-links';
import { ProfilePitchDemoSimple } from './components/profile-pitch-demo-simple';
import { BoostSocialScore } from './components/boost-social-score';

export function StandaloneApp() {
  const [username] = useState('User');
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">MyLinked</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
                {username[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium">{username}</span>
            </div>
          </div>
        </div>
      </header>
      
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex">
              <div className="flex space-x-6">
                {[
                  { name: 'Dashboard', href: '#', current: false },
                  { name: 'Social Score', href: '#', current: false },
                  { name: 'Analytics', href: '#', current: false },
                  { name: 'AI Branding', href: '#', current: false },
                  { name: 'Collaborative', href: '#', current: true },
                  { name: 'Settings', href: '#', current: false },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      item.current
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Welcome, {username}!</h2>
          <p className="text-gray-600">
            This is your MyLinked dashboard. Here you can manage your regular links and collaborative links.
          </p>
        </div>
        
        {/* Collaborative Links Section - New Feature */}
        <CollaborativeLinks />
        
        {/* Social Score Section - New Feature */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Social Score</h3>
            <div className="text-sm text-blue-600 font-medium">NEW</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="font-semibold text-gray-800">Social Score</h3>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-end mb-1">
                  <div className="text-3xl font-bold text-blue-600">78</div>
                  <div className="text-sm text-gray-500 ml-1 mb-1">/100</div>
                </div>

                <div className="mb-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium text-gray-700">Good</div>
                  <div className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-700">
                    Tier: Gold
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Performance Metrics
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Profile Views
                      </div>
                      <div className="font-medium">543</div>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                        </svg>
                        Link Clicks
                      </div>
                      <div className="font-medium">218</div>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        CTR
                      </div>
                      <div className="font-medium">40%</div>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Followers
                      </div>
                      <div className="font-medium">32</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <BoostSocialScore className="h-full" />
            </div>
          </div>
        </div>
        
        {/* Pitch Mode Section - New Feature */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">One-Click Pitch Mode</h3>
            <div className="text-sm text-blue-600 font-medium">NEW</div>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Transform your profile into a professional pitch with one click. Perfect for freelancers, 
              professionals, and creatives to showcase their work to potential clients or employers.
            </p>
            
            <div className="flex flex-col space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Professional layout optimized for presentations</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Highlight your most important links</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                  <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Custom pitch description for your services</span>
              </div>
            </div>
          </div>
          
          <ProfilePitchDemoSimple />
        </div>
      </main>
    </div>
  );
}