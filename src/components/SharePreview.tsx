import React, { useEffect, useRef } from 'react';
import { CategorizedProjects } from '@/types/projects';
import * as d3 from 'd3';
import EcosystemMap3D from './EcosystemMap3D';

interface SharePreviewProps {
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const SharePreview = ({ categories, visibleCategories }: SharePreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCats = Object.entries(categories)
    .filter(([key]) => visibleCategories[key])
    .sort((a, b) => a[1].title.localeCompare(b[1].title));

  useEffect(() => {
    if (!containerRef.current) return;

    const width = 1920;
    const height = 1080;
    const padding = 40;
    const titleHeight = 60;
    const footerHeight = 30;
    const mapHeight = height - titleHeight - footerHeight - (padding * 2);

    // Clear previous content
    const container = d3.select(containerRef.current);
    container.selectAll('.category-card').remove();

  }, [visibleCats]);

  return (
    <div className="w-[1920px] h-[1080px] bg-[#0A0F1C] text-left" ref={containerRef}>
      <h1 className="text-2xl font-bold text-white p-8 pb-4">
        NEAR Protocol Ecosystem Map
      </h1>
      
      <div className="relative h-[880px]">
        <EcosystemMap3D 
          categories={categories}
          visibleCategories={visibleCategories}
        />
      </div>

      <div className="absolute bottom-4 right-8 text-gray-500 text-sm">
        Updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default SharePreview;