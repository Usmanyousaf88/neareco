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
    const minCategoryWidth = 600; // Minimum width for each category
    const minCategoryHeight = 400; // Minimum height for each category

    // Available space for the grid
    const availableWidth = width - (padding * 2);
    const availableHeight = height - titleHeight - (padding * 2);

    // Calculate optimal grid layout
    const totalCategories = visibleCats.length;
    const aspectRatio = availableWidth / availableHeight;
    const cols = Math.ceil(Math.sqrt(totalCategories * aspectRatio));
    const rows = Math.ceil(totalCategories / cols);

    // Calculate cell dimensions
    const cellWidth = Math.max(minCategoryWidth, Math.floor(availableWidth / cols));
    const cellHeight = Math.max(minCategoryHeight, Math.floor(availableHeight / rows));

    // Create grid layout
    visibleCats.forEach(([key, category], index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = padding + (col * cellWidth);
      const y = titleHeight + padding + (row * cellHeight);

      const card = container.append('div')
        .attr('class', 'category-card absolute')
        .style('left', `${x}px`)
        .style('top', `${y}px`)
        .style('width', `${cellWidth - 32}px`)
        .style('height', `${cellHeight - 32}px`);

      const minIconSize = 64;
      const maxIconSize = 88;
      const cardPadding = 16;
      
      const maxColumns = Math.floor((cellWidth - cardPadding * 2) / (minIconSize + cardPadding + 32));
      const maxRows = Math.floor((cellHeight - cardPadding * 2 - 64) / (minIconSize + cardPadding + 24));
      
      const maxProjects = maxColumns * maxRows;
      const visibleProjects = category.projects.slice(0, maxProjects);
      
      const iconSize = Math.min(
        Math.floor((cellWidth - cardPadding * (maxColumns + 1)) / maxColumns) - 32,
        Math.floor((cellHeight - cardPadding * (maxRows + 1) - 64) / maxRows) - 24,
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