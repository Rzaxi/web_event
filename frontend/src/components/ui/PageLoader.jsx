import React from 'react';

const PageLoader = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Loading Animation */}
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <div className="text-lg font-semibold text-gray-800 animate-pulse">
            Loading...
          </div>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
