import React from 'react';

const SkeletonBase = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-700/50 ${className}`} />
);

export const CoinOverviewSkeleton = () => {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-[#1e2329] p-8 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Logo skeleton */}
        <SkeletonBase className="h-16 w-16 rounded-full" />
        <div className="flex flex-col gap-2">
          {/* Name/Symbol skeleton */}
          <SkeletonBase className="h-4 w-32" />
          {/* Price skeleton */}
          <SkeletonBase className="h-10 w-48" />
        </div>
      </div>
      
      {/* Chart placeholder skeleton */}
      <div className="mt-8 flex w-full flex-1 items-center justify-center">
        <div className="flex w-full flex-col gap-4 px-4">
          <SkeletonBase className="h-4 w-full" />
          <SkeletonBase className="h-4 w-3/4" />
          <SkeletonBase className="h-4 w-5/6" />
          <SkeletonBase className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
};

export const TrendingCoinsSkeleton = () => {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-[#1e2329] p-6 shadow-sm">
      <SkeletonBase className="mb-6 h-7 w-40" />
      <div className="flex-1 overflow-hidden">
        <div className="space-y-4">
          {/* Table Header skeleton */}
          <div className="flex gap-4 border-b border-gray-800 pb-4">
            <SkeletonBase className="h-4 w-8" />
            <SkeletonBase className="h-4 flex-1" />
            <SkeletonBase className="h-4 w-20" />
            <SkeletonBase className="h-4 w-20" />
          </div>
          
          {/* Table Rows skeletons */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-1">
              <SkeletonBase className="h-4 w-6" />
              <div className="flex flex-1 items-center gap-2">
                <SkeletonBase className="h-8 w-8 rounded-full" />
                <SkeletonBase className="h-4 w-24" />
              </div>
              <SkeletonBase className="h-4 w-20" />
              <SkeletonBase className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
