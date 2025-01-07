import React from 'react';
import { CategorizedProjects } from '@/types/projects';
import EcosystemMap3D from './EcosystemMap3D';

interface SharePreviewProps {
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const SharePreview = ({ categories, visibleCategories }: SharePreviewProps) => {
  return (
    <div className="w-full h-full">
      <EcosystemMap3D 
        categories={categories}
        visibleCategories={visibleCategories}
      />
    </div>
  );
};

export default SharePreview;