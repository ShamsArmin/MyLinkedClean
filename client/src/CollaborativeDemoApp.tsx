import React from 'react';
import { CollaborativeProfileDemo } from './components/collaborative-profile-demo';

function CollaborativeDemoApp() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-xl font-bold text-blue-600">MyLinked - Collaborative Profiles Demo</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <CollaborativeProfileDemo />
          </div>
        </div>
      </main>
    </div>
  );
}

export default CollaborativeDemoApp;