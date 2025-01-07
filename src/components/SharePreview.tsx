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

    // Available space for the grid
    const availableWidth = width - (padding * 2);
    const availableHeight = height - titleHeight - footerHeight - (padding * 2);

    // Use D3's treemap layout to calculate optimal sizes
    const treemap = d3.treemap<any>()
      .size([availableWidth, availableHeight])
      .padding(16)
      .round(true);

    const root = d3.hierarchy({
      children: visibleCats.map(([key, category]) => ({
        key,
        category,
        value: category.projects.length
      }))
    }).sum(d => d.value || 0);

    treemap(root);

    // Apply calculated dimensions to DOM
    const container = d3.select(containerRef.current);
    container.selectAll('.category-card').remove();

    const cards = container.select('.grid-container')
      .selectAll('.category-card')
      .data(root.leaves())
      .join('div')
      .attr('class', 'category-card')
      .style('position', 'absolute')
      .style('left', d => `${d.x0}px`)
      .style('top', d => `${d.y0 + titleHeight}px`)
      .style('width', d => `${d.x1 - d.x0}px`)
      .style('height', d => `${d.y1 - d.y0}px`);

    cards.each(function(d: any) {
      const card = d3.select(this);
      const cardWidth = d.x1 - d.x0;
      const cardHeight = d.y1 - d.y0;
      const category = d.data.category;
      
      // Calculate optimal project icon size and number of columns
      const minIconSize = 40;
      const maxIconSize = 60;
      const padding = 16;
      
      // Calculate how many icons can fit in the width and height
      const maxColumns = Math.floor((cardWidth - padding) / (minIconSize + padding));
      const maxRows = Math.floor((cardHeight - padding - 40) / (minIconSize + padding + 20));
      
      // Calculate maximum number of projects that can fit
      const maxProjects = maxColumns * maxRows;
      
      // Filter projects to only show what fits
      const visibleProjects = category.projects.slice(0, maxProjects);
      
      // Calculate actual icon size based on available space and number of projects
      const iconSize = Math.min(
        Math.floor((cardWidth - padding * (maxColumns + 1)) / maxColumns),
        Math.floor((cardHeight - padding * (maxRows + 1) - 40) / maxRows),
        maxIconSize
      );

      card.html(`
        <div class="h-full bg-[#111827] border border-[#1d4ed8] rounded-xl p-4 flex flex-col">
          <h2 class="text-lg font-semibold text-[#60a5fa] mb-3 truncate">
            ${category.title}
          </h2>
          <div class="grid gap-3 flex-1" style="grid-template-columns: repeat(auto-fill, minmax(${iconSize}px, 1fr)); align-content: start">
            ${visibleProjects.map(project => `
              <div class="flex flex-col items-center gap-1">
                <div class="rounded-full bg-gray-800 overflow-hidden flex items-center justify-center"
                     style="width: ${iconSize}px; height: ${iconSize}px">
                  <img
                    src="${project.image || '/placeholder.svg'}"
                    alt="${project.name}"
                    class="w-full h-full object-cover"
                    onerror="this.src='/placeholder.svg'"
                  />
                </div>
                <span class="text-white text-xs truncate text-center w-full px-1" title="${project.name}">
                  ${project.name}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      `);
    });
  }, [visibleCats]);

  return (
    <div className="w-[1920px] h-[1080px] bg-[#0A0F1C] text-left" ref={containerRef}>
      <h1 className="text-2xl font-bold text-white p-8 pb-4">
        NEAR Protocol Ecosystem Map
      </h1>
      
      <div className="grid-container relative">
        {/* D3 will inject content here */}
      </div>

      <div className="absolute bottom-4 right-8 text-gray-500 text-sm">
        Updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default SharePreview;