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

    const width = 3840;
    const height = 2160;
    const padding = 20;
    const titleHeight = 80;

    // Available space for the grid
    const availableWidth = width - (padding * 2);
    const availableHeight = height - titleHeight - (padding * 2);

    // Base size calculation on the number of projects
    const totalProjects = visibleCats.reduce((sum, [, category]) => sum + category.projects.length, 0);
    const avgProjectsPerCategory = totalProjects / visibleCats.length;
    
    // Use D3's treemap layout with dynamic padding based on category count
    const treemap = d3.treemap<any>()
      .size([availableWidth, availableHeight])
      .padding(visibleCats.length > 12 ? 8 : 16)
      .round(true);

    const root = d3.hierarchy({
      children: visibleCats.map(([key, category]) => ({
        key,
        category,
        value: Math.max(
          category.projects.length,
          avgProjectsPerCategory * 0.5 // Ensure minimum size relative to average
        )
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
      
      // Dynamic icon sizing based on available space and category size
      const baseIconSize = Math.min(cardWidth, cardHeight) * 0.15;
      const minIconSize = Math.max(32, Math.min(48, baseIconSize));
      const maxIconSize = Math.min(64, baseIconSize);
      const padding = Math.max(8, Math.min(12, baseIconSize * 0.2));
      
      const maxColumns = Math.max(2, Math.floor((cardWidth - padding * 2) / (minIconSize + padding)));
      const maxRows = Math.max(2, Math.floor((cardHeight - padding * 2 - 40) / (minIconSize + padding)));
      
      const maxProjects = maxColumns * maxRows;
      const visibleProjects = category.projects.slice(0, maxProjects);
      
      const iconSize = Math.min(
        Math.floor((cardWidth - padding * (maxColumns + 1)) / maxColumns) - 8,
        Math.floor((cardHeight - padding * (maxRows + 1) - 40) / maxRows) - 8,
        maxIconSize
      );

      const sanitizeName = (name: string) => {
        const parts = name.split(/[^\w\s$]+/);
        return parts[0].trim();
      };

      card.html(`
        <div class="h-full bg-[#111827] border border-[#1d4ed8] rounded-lg p-2 flex flex-col">
          <h2 class="text-base font-semibold text-[#60a5fa] mb-2 line-clamp-1">
            ${category.title}
          </h2>
          <div class="grid gap-1" style="grid-template-columns: repeat(auto-fill, minmax(${iconSize + 8}px, 1fr));">
            ${visibleProjects.map(project => `
              <div class="flex flex-col items-center">
                <div class="rounded-full bg-gray-800 overflow-hidden flex items-center justify-center"
                     style="width: ${iconSize}px; height: ${iconSize}px">
                  <img
                    src="${project.image || '/placeholder.svg'}"
                    alt="${sanitizeName(project.name)}"
                    class="w-full h-full object-cover"
                    onerror="this.src='/placeholder.svg'"
                  />
                </div>
                <span class="text-white text-xs text-center w-full px-1 max-w-[${iconSize + 8}px] line-clamp-1" 
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