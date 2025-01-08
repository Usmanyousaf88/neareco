import React from 'react';
import SharePreview from './SharePreview';
import { CategorizedProjects } from '@/types/projects';
import { Theme } from '@/types/theme';

interface SharePreviewContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
  previewRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
  theme: Theme;
}

const SharePreviewContainer = ({
  containerRef,
  previewRef,
  zoom,
  categories,
  visibleCategories,
  theme
}: SharePreviewContainerProps) => {
  return (
    <div 
      ref={containerRef}
      className="flex-1 min-h-0 border rounded-lg overflow-hidden relative"
    >
      <div 
        ref={previewRef}
        className="absolute origin-top-left"
        style={{ transform: `scale(${zoom})` }}
      >
        <SharePreview 
          categories={categories} 
          visibleCategories={visibleCategories}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default SharePreviewContainer;