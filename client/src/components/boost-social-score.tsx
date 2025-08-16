import React from 'react';

type BoostSocialScoreProps = {
  className?: string;
};

export function BoostSocialScore({ className = '' }: BoostSocialScoreProps) {
  // Function to handle analytics navigation
  const handleAnalyticsClick = () => {
    window.location.href = '/analytics';
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 shadow-sm ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-shrink-0 bg-blue-100 text-blue-600 p-2.5 rounded-full">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h4 className="text-lg font-medium text-blue-800">Boost Your Social Score</h4>
          <p className="text-sm text-blue-600">Improve your profile's optimization and engagement</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-5">
        <div className="flex items-start">
          <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
            1
          </div>
          <span className="text-sm text-gray-700">Complete your profile with a professional image and detailed bio</span>
        </div>
        <div className="flex items-start">
          <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
            2
          </div>
          <span className="text-sm text-gray-700">Add at least 5 diverse links to different platforms</span>
        </div>
        <div className="flex items-start">
          <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
            3
          </div>
          <span className="text-sm text-gray-700">Share your profile to increase views and engagement</span>
        </div>
      </div>
      
      {/* Simple button with onClick handler */}
      <button 
        type="button"
        onClick={handleAnalyticsClick}
        className="w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded px-5 py-2.5 text-center shadow-md"
      >
        View Detailed Analytics
      </button>
    </div>
  );
}