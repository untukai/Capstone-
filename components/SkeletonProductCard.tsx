
import React from 'react';

const SkeletonProductCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-neutral-200 flex flex-col animate-pulse">
      <div className="w-full aspect-square bg-neutral-200"></div>
      <div className="p-3 flex-grow">
        <div className="h-4 bg-neutral-200 rounded w-5/6 mb-2"></div>
        <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
        
        <div className="mt-4 h-6 bg-neutral-300 rounded w-1/2"></div>
        
        <div className="flex items-center mt-3">
          <div className="w-4 h-4 bg-neutral-200 rounded-full mr-1.5"></div>
          <div className="h-3 bg-neutral-200 rounded w-2/3"></div>
        </div>
      </div>
      <div className="p-3 pt-0 mt-auto">
        <div className="space-y-2">
          <div className="h-10 bg-neutral-300 rounded-lg w-full"></div>
          <div className="h-10 bg-neutral-200 rounded-lg w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonProductCard;
