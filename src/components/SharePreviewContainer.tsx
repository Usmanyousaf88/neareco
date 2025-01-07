import React from 'react';
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
      className="flex-1 min-h-0 relative bg-gray-900 rounded-lg overflow-auto"
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