import React from 'react';

// Base Skeleton Component
const Skeleton = ({ className = '', width = 'w-full', height = 'h-4', rounded = 'rounded' }) => {
  return (
    <div 
      className={`bg-gray-200 animate-pulse ${width} ${height} ${rounded} ${className}`}
    />
  );
};

<<<<<<< HEAD
// Event Card Skeleton - Disesuaikan dengan EventCard design
export const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden animate-pulse" style={{ height: '450px' }}>
      {/* Image Skeleton - Sesuai dengan EventCard */}
      <div className="bg-gray-200" style={{ height: '280px' }}></div>
      
      {/* Content Skeleton - Sesuai dengan EventCard layout */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category tag */}
        <div className="mb-2">
          <Skeleton height="h-3" width="w-16" />
        </div>

        {/* Title */}
        <div className="mb-4" style={{ minHeight: '48px' }}>
          <Skeleton height="h-4" width="w-full" className="mb-1" />
          <Skeleton height="h-4" width="w-3/4" />
        </div>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          {/* Date */}
          <div className="flex items-center space-x-2">
            <Skeleton width="w-4" height="h-4" />
            <Skeleton height="h-3" width="w-2/3" />
          </div>
          
          {/* Location */}
          <div className="flex items-center space-x-2">
            <Skeleton width="w-4" height="h-4" />
            <Skeleton height="h-3" width="w-1/2" />
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <Skeleton width="w-4" height="h-4" />
            <Skeleton height="h-3" width="w-20" />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          {/* Participants */}
          <div className="flex items-center space-x-2">
            <Skeleton width="w-4" height="h-4" />
            <Skeleton height="h-3" width="w-16" />
          </div>

          {/* Action Arrow */}
          <Skeleton width="w-8" height="h-8" rounded="rounded-full" />
=======
// Event Card Skeleton
export const EventCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200 animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <Skeleton height="h-6" width="w-3/4" />
        
        {/* Description */}
        <Skeleton height="h-4" width="w-full" />
        <Skeleton height="h-4" width="w-5/6" />
        
        {/* Meta Info */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center space-x-2">
            <Skeleton width="w-4" height="h-4" rounded="rounded-full" />
            <Skeleton height="h-4" width="w-2/3" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton width="w-4" height="h-4" rounded="rounded-full" />
            <Skeleton height="h-4" width="w-1/2" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton width="w-4" height="h-4" rounded="rounded-full" />
            <Skeleton height="h-4" width="w-3/4" />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <Skeleton height="h-2" width="w-full" rounded="rounded-full" />
        </div>
        
        {/* Button */}
        <div className="mt-4">
          <Skeleton height="h-12" width="w-full" rounded="rounded-xl" />
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
// Event List Skeleton - Sesuai dengan Home.jsx featured events grid
export const EventListSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
=======
// Event List Skeleton
export const EventListSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
>>>>>>> 2abfda7ee534c6e755ec7078e95159ca67f32216
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        {/* Avatar */}
        <Skeleton width="w-16" height="h-16" rounded="rounded-full" />
        <div className="space-y-2">
          <Skeleton height="h-6" width="w-32" />
          <Skeleton height="h-4" width="w-24" />
        </div>
      </div>
      
      {/* Info Fields */}
      <div className="space-y-4">
        <div>
          <Skeleton height="h-4" width="w-20" className="mb-2" />
          <Skeleton height="h-10" width="w-full" rounded="rounded-lg" />
        </div>
        <div>
          <Skeleton height="h-4" width="w-16" className="mb-2" />
          <Skeleton height="h-10" width="w-full" rounded="rounded-lg" />
        </div>
        <div>
          <Skeleton height="h-4" width="w-24" className="mb-2" />
          <Skeleton height="h-10" width="w-full" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <Skeleton width="w-12" height="h-12" rounded="rounded-xl" />
            <Skeleton width="w-6" height="h-6" rounded="rounded" />
          </div>
          <Skeleton height="h-8" width="w-20" className="mb-2" />
          <Skeleton height="h-4" width="w-24" />
        </div>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} height="h-4" width="w-20" />
          ))}
        </div>
      </div>
      
      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} height="h-4" width={colIndex === 0 ? "w-32" : "w-24"} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Form Skeleton
export const FormSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
      <div className="space-y-6">
        {/* Form Title */}
        <Skeleton height="h-8" width="w-48" />
        
        {/* Form Fields */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index}>
            <Skeleton height="h-4" width="w-24" className="mb-2" />
            <Skeleton height="h-12" width="w-full" rounded="rounded-lg" />
          </div>
        ))}
        
        {/* Buttons */}
        <div className="flex space-x-4 pt-4">
          <Skeleton height="h-12" width="w-32" rounded="rounded-lg" />
          <Skeleton height="h-12" width="w-24" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

// Text Skeleton
export const TextSkeleton = ({ lines = 3 }) => {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton 
          key={index} 
          height="h-4" 
          width={index === lines - 1 ? "w-3/4" : "w-full"} 
        />
      ))}
    </div>
  );
};

// Event Detail Skeleton
export const EventDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Skeleton */}
      <div className="pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Skeleton width="w-24" height="h-6" />
            <div className="hidden md:flex items-center space-x-2">
              <Skeleton width="w-16" height="h-4" />
              <span>/</span>
              <Skeleton width="w-32" height="h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative">
              <div className="h-[520px] bg-gray-200 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full px-8 py-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                      <Skeleton width="w-3/4" height="h-12" className="bg-white/20" />
                      <Skeleton width="w-1/2" height="h-6" className="bg-white/20" />
                    </div>
                    <div className="lg:justify-self-end">
                      <div className="bg-white rounded-2xl p-6 shadow-xl w-72 max-w-sm">
                        <div className="mb-6">
                          <Skeleton width="w-24" height="h-6" className="mb-2" />
                          <Skeleton width="w-40" height="h-4" />
                        </div>
                        <div className="mb-6">
                          <Skeleton width="w-32" height="h-4" />
                        </div>
                        <Skeleton width="w-full" height="h-12" rounded="rounded-lg" className="mb-4" />
                        <div className="border-t border-gray-200 pt-4">
                          <Skeleton width="w-28" height="h-5" className="mb-2" />
                          <Skeleton width="w-20" height="h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-40">
            <div className="space-y-16">
              <div>
                <Skeleton width="w-32" height="h-8" className="mb-6" />
                <TextSkeleton lines={4} />
              </div>
              <div>
                <Skeleton width="w-20" height="h-8" className="mb-6" />
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Skeleton width="w-32" height="h-4" />
                    <Skeleton width="w-40" height="h-4" className="ml-4" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton width="w-32" height="h-4" />
                    <Skeleton width="w-24" height="h-4" className="ml-4" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-16">
              <div>
                <Skeleton width="w-40" height="h-8" className="mb-6" />
                <div className="bg-gray-100 rounded-2xl p-8 mb-6">
                  <Skeleton width="w-20" height="h-20" rounded="rounded-full" className="mx-auto" />
                </div>
                <div className="text-center">
                  <Skeleton width="w-48" height="h-6" className="mx-auto mb-3" />
                  <Skeleton width="w-32" height="h-4" className="mx-auto" />
                </div>
              </div>
              <div>
                <Skeleton width="w-16" height="h-8" className="mb-6" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton width="w-20" height="h-10" rounded="rounded-full" />
                  <Skeleton width="w-24" height="h-10" rounded="rounded-full" />
                  <Skeleton width="w-28" height="h-10" rounded="rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
