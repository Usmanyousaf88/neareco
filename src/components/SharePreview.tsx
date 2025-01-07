import React, { useEffect, useRef } from 'react';
import { CategorizedProjects } from '@/types/projects';
import * as d3 from 'd3';

interface SharePreviewProps {
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const SharePreview = ({ categories, visibleCategories }: SharePreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleCats = Object.entries(categories)
    .filter(([key]) => visibleCategories[key])
    .sort((a, b) => a[1].title.localeCompare(b[1].title));

  console.log('Rendering SharePreview with visible categories:', visibleCats.map(([key]) => key));

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    const container = d3.select(containerRef.current);
    container.selectAll('.category-card').remove();

    console.log('Rendering categories:', visibleCats);

    const width = 3840;
    const height = 2160;
    const padding = 20;
    const titleHeight = 80;

    // Available space for the grid
    const availableWidth = width - (padding * 2);
    const availableHeight = height - titleHeight - (padding * 2);

    // Calculate minimum size based on number of visible categories
    const minSize = Math.sqrt((availableWidth * availableHeight) / visibleCats.length) * 0.8;

    // Use D3's treemap layout with adjusted padding
    const treemap = d3.treemap<any>()
      .size([availableWidth, availableHeight])
      .padding(16)
      .round(true);

    const root = d3.hierarchy({
      children: visibleCats.map(([key, category]) => ({
        key,
        category,
        // Adjust value calculation to ensure minimum size
        value: Math.max(category.projects.length * 100, minSize * minSize)
      }))
    }).sum(d => d.value || 0);

    treemap(root);

    // Apply calculated dimensions to DOM
    const cards = container.select('.grid-container')
      .selectAll('.category-card')
      .data(root.leaves())
      .join('div')
      .attr('class', 'category-card absolute')
      .style('left', d => `${d.x0 + padding}px`)
      .style('top', d => `${d.y0 + titleHeight + padding}px`)
      .style('width', d => `${d.x1 - d.x0}px`)
      .style('height', d => `${d.y1 - d.y0}px`);

    cards.each(function(d: any) {
      const card = d3.select(this);
      const cardWidth = d.x1 - d.x0;
      const cardHeight = d.y1 - d.y0;
      const category = d.data.category;
      
      // Adjust icon sizes based on available space
      const minIconSize = 48;
      const maxIconSize = 72;
      const padding = 12;
      
      const maxColumns = Math.floor((cardWidth - padding * 2) / (minIconSize + padding));
      const maxRows = Math.floor((cardHeight - padding * 2 - 48) / (minIconSize + padding));
      
      const maxProjects = maxColumns * maxRows;
      const visibleProjects = category.projects.slice(0, maxProjects);
      
      const iconSize = Math.min(
        Math.floor((cardWidth - padding * (maxColumns + 1)) / maxColumns) - 16,
        Math.floor((cardHeight - padding * (maxRows + 1) - 48) / maxRows) - 16,
        maxIconSize
      );

      const sanitizeName = (name: string) => {
        const parts = name.split(/[^\w\s$]+/);
        return parts[0].trim();
      };

      card.html(`
        <div class="h-full bg-[#111827] border border-[#1d4ed8] rounded-xl p-3 flex flex-col">
          <h2 class="text-lg font-semibold text-[#60a5fa] mb-2 line-clamp-1">
            ${category.title}
          </h2>
          <div class="grid gap-2" style="grid-template-columns: repeat(auto-fill, minmax(${iconSize + 16}px, 1fr));">
            ${visibleProjects.map(project => `
              <div class="flex flex-col items-center gap-1">
                <div class="rounded-full bg-gray-800 overflow-hidden flex items-center justify-center"
                     style="width: ${iconSize}px; height: ${iconSize}px">
                  <img
                    src="${project.image || '/placeholder.svg'}"
                    alt="${sanitizeName(project.name)}"
                    class="w-full h-full object-cover"
                    onerror="this.src='/placeholder.svg'"
                  />
                </div>
                <span class="text-white text-xs text-center w-full px-1 max-w-[${iconSize + 16}px] line-clamp-1" 
                      title="${project.name}">
                  ${sanitizeName(project.name)}
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      `);
    });
  }, [visibleCats]);

  return (
    <div className="w-[3840px] h-[2160px] bg-[#0A0F1C] text-left relative" ref={containerRef}>
      <h1 className="text-4xl font-bold text-white p-8">
        NEAR Protocol Ecosystem Map
      </h1>
      
      <div className="grid-container absolute inset-0 pt-[80px] px-[20px] pb-[20px]">
        {/* D3 will inject content here */}
      </div>
    </div>
  );
};

export default SharePreview;