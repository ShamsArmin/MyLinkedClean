import React, { useState } from 'react';
import { Link } from '../types';

// Custom hook for Smart Link AI functionality
function useSmartLinkAI(links: Link[], onLinksReordered: (newLinks: Link[]) => void) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [showInsights, setShowInsights] = useState(false);

  // Simulate the AI prioritization locally
  const optimizeLinks = () => {
    setIsOptimizing(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Sort links by click count in descending order (simple prioritization algorithm)
      const optimizedLinks = [...links].sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      
      // Generate some fake insights
      const insightText = 
        "Based on visitor engagement analysis, I've reordered your links to prioritize those with the highest click-through rates. Your GitHub link is performing particularly well and has been moved to the top position. Consider adding more descriptive titles to your lower-performing links to increase their visibility and appeal.";
      
      setInsights(insightText);
      setIsOptimizing(false);
      setShowInsights(true);
      
      // Pass the reordered links back to the parent component
      onLinksReordered(optimizedLinks);
    }, 1500);
  };

  return {
    optimizeLinks,
    isOptimizing,
    insights,
    showInsights,
    setShowInsights,
  };
}

type SmartLinkAIMinimalProps = {
  links: Link[];
  onLinksReordered: (newLinks: Link[]) => void;
};

export function SmartLinkAIMinimal({ links, onLinksReordered }: SmartLinkAIMinimalProps) {
  const { 
    optimizeLinks, 
    isOptimizing, 
    insights, 
    showInsights, 
    setShowInsights 
  } = useSmartLinkAI(links, onLinksReordered);

  const hasEnoughData = links.length >= 2 && links.some(link => link.clicks > 0);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-5 border-b">
        <div className="flex items-center space-x-2 mb-1">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="font-semibold">Smart Link AI</h3>
        </div>
        <p className="text-sm text-gray-600">
          Let AI prioritize your links based on visitor engagement
        </p>
      </div>

      <div className="p-5">
        {!hasEnoughData ? (
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 text-sm text-yellow-800">
            <p className="font-medium mb-1">Not enough data yet</p>
            <p className="text-yellow-700 text-xs">
              Add more links and get some clicks for AI to analyze engagement patterns.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-sm">Optimize your links with AI</h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  The AI will analyze engagement patterns and reorder your links for maximum visibility
                </p>
              </div>
            </div>

            <button
              onClick={optimizeLinks}
              disabled={isOptimizing}
              className={`w-full py-2 px-3 rounded-md flex items-center justify-center font-medium text-sm transition-colors ${
                isOptimizing 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isOptimizing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Optimizing...
                </>
              ) : (
                'Optimize with AI'
              )}
            </button>
          </div>
        )}
      </div>

      {/* AI Insights Modal */}
      {showInsights && insights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="p-5 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">AI Link Insights</h3>
                <button 
                  onClick={() => setShowInsights(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-5">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Recommendations
                </h4>
                <p className="text-sm text-blue-700">{insights}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Changes Applied:</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Links reordered by engagement</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>High-performing content prioritized</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="p-5 border-t flex justify-end">
              <button
                onClick={() => setShowInsights(false)}
                className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}