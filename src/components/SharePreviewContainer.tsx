import React, { useRef, useEffect } from 'react';
import SharePreview from './SharePreview';
import { CategorizedProjects } from '@/types/projects';

interface SharePreviewContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  previewRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const SharePreviewContainer = ({
  containerRef,
  previewRef,
  zoom,
  categories,
  visibleCategories
}: SharePreviewContainerProps) => {
  return (
    <div 
      ref={containerRef}
      className="relative bg-gray-900 rounded-lg overflow-auto flex-grow min-h-0"
    >
      <div 
        ref={previewRef}
        className="origin-top-left transition-transform duration-200 ease-out absolute"
        style={{ transform: `scale(${zoom})` }}
      >
        <SharePreview 
          categories={categories} 
          visibleCategories={visibleCategories}
        />
      </div>
    </div>
  );
};

export default SharePreviewContainer;