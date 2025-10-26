import React from 'react';
import { useLazyLoading } from '../../hooks/useLazyLoading';

// Wrapper component untuk lazy loading dengan skeleton
const LazyWrapper = ({ 
  children, 
  fetchFunction, 
  SkeletonComponent, 
  dependencies = [], 
  delay = 1000,
  ...props 
}) => {
  const { data, loading, error } = useLazyLoading(fetchFunction, dependencies, delay);

  if (loading) {
    return <SkeletonComponent {...props} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">Failed to load data. Please try again.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return children(data);
};

export default LazyWrapper;
