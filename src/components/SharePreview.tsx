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

    // Use D3's treemap layout with more padding for titles
    const treemap = d3.treemap<any>()
      .size([availableWidth, availableHeight])
      .padding(32)
      .round(true);

    const root = d3.hierarchy({
      children: visibleCats.map(([key, category]) => ({
        key,
        category,
        value: category.projects.length + 2
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
      
      const minIconSize = 64;
      const maxIconSize = 88;
      const padding = 16;
      
      const maxColumns = Math.floor((cardWidth - padding * 2) / (minIconSize + padding + 32));
      const maxRows = Math.floor((cardHeight - padding * 2 - 64) / (minIconSize + padding + 24));
      
      const maxProjects = maxColumns * maxRows;
      const visibleProjects = category.projects.slice(0, maxProjects);
      
      const iconSize = Math.min(
        Math.floor((cardWidth - padding * (maxColumns + 1)) / maxColumns) - 32,
        Math.floor((cardHeight - padding * (maxRows + 1) - 64) / maxRows) - 24,
        maxIconSize
      );

      const sanitizeName = (name: string) => {
        const parts = name.split(/[^\w\s$]+/);
        return parts[0].trim();
      };

      card.html(`
        <div class="h-full bg-[#111827] border border-[#1d4ed8] rounded-xl p-4 flex flex-col overflow-visible">
          <h2 class="text-xl font-semibold text-[#60a5fa] mb-4 line-clamp-1">
            ${category.title}
          </h2>
          <div class="grid gap-4 overflow-visible" style="grid-template-columns: repeat(auto-fill, minmax(${iconSize + 32}px, 1fr));">
            ${visibleProjects.map(project => `
              <div class="flex flex-col items-center gap-2 overflow-visible">
                <div class="rounded-full bg-gray-800 overflow-hidden flex items-center justify-center z-10"
                     style="width: ${iconSize}px; height: ${iconSize}px">
                  <img
                    src="${project.image || '/placeholder.svg'}"
                    alt="${sanitizeName(project.name)}"
                    class="w-full h-full object-cover"
                    onerror="this.src='/placeholder.svg'"
                  />
                </div>
                <span class="text-white text-xs text-center w-full px-1 max-w-[${iconSize + 24}px] line-clamp-2 z-10" 
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
    <div className="w-[3840px] h-[2160px] bg-[#0A0F1C] text-left relative overflow-visible" ref={containerRef}>
      <h1 className="text-4xl font-bold text-white p-8">
        NEAR Protocol Ecosystem Map
      </h1>
      
      <div className="grid-container absolute inset-0 pt-[80px] px-[20px] pb-[20px] overflow-visible">
        {/* D3 will inject content here */}
      </div>
    </div>
  );
};

export default SharePreview;