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
    const padding = 32;
    const titleHeight = 80;
    const minCategoryWidth = 480; // Slightly smaller minimum width
    const minCategoryHeight = 320; // Slightly smaller minimum height

    // Available space for the grid
    const availableWidth = width - (padding * 2);
    const availableHeight = height - titleHeight - (padding * 2);

    // Calculate optimal grid layout with golden ratio influence
    const totalCategories = visibleCats.length;
    const goldenRatio = 1.618;
    const aspectRatio = availableWidth / availableHeight;
    const idealCols = Math.sqrt(totalCategories * aspectRatio / goldenRatio);
    const cols = Math.max(1, Math.round(idealCols));
    const rows = Math.ceil(totalCategories / cols);

    // Calculate cell dimensions with more dynamic spacing
    const cellWidth = Math.max(minCategoryWidth, Math.floor(availableWidth / cols) - padding);
    const cellHeight = Math.max(minCategoryHeight, Math.floor(availableHeight / rows) - padding);

    // Create grid layout with improved spacing
    visibleCats.forEach(([key, category], index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = padding + (col * (cellWidth + padding));
      const y = titleHeight + padding + (row * (cellHeight + padding));

      const card = container.append('div')
        .attr('class', 'category-card absolute')
        .style('left', `${x}px`)
        .style('top', `${y}px`)
        .style('width', `${cellWidth}px`)
        .style('height', `${cellHeight}px`);

      const minIconSize = 56; // Slightly smaller icons
      const maxIconSize = 72;
      const cardPadding = 24;
      
      const maxColumns = Math.floor((cellWidth - cardPadding * 2) / (minIconSize + cardPadding));
      const maxRows = Math.floor((cellHeight - cardPadding * 2 - 48) / (minIconSize + cardPadding));
      
      const maxProjects = maxColumns * maxRows;
      const visibleProjects = category.projects.slice(0, maxProjects);
      
      const iconSize = Math.min(
        Math.floor((cellWidth - cardPadding * (maxColumns + 1)) / maxColumns) - 16,
        Math.floor((cellHeight - cardPadding * (maxRows + 1) - 48) / maxRows) - 16,
        maxIconSize
      );

      const sanitizeName = (name: string) => {
        const parts = name.split(/[^\w\s$]+/);
        return parts[0].trim();
      };

      card.html(`
        <div class="h-full bg-[#111827] border border-[#1d4ed8]/30 rounded-xl p-6 flex flex-col overflow-visible shadow-lg">
          <h2 class="text-2xl font-semibold text-[#60a5fa] mb-6 line-clamp-1">
            ${category.title}
          </h2>
          <div class="grid gap-6 overflow-visible" style="grid-template-columns: repeat(auto-fill, minmax(${iconSize + 24}px, 1fr));">
            ${visibleProjects.map(project => `
              <div class="flex flex-col items-center gap-3 overflow-visible">
                <div class="rounded-full bg-gray-800/50 overflow-hidden flex items-center justify-center z-10 backdrop-blur-sm shadow-lg"
                     style="width: ${iconSize}px; height: ${iconSize}px">
                  <img
                    src="${project.image || '/placeholder.svg'}"
                    alt="${sanitizeName(project.name)}"
                    class="w-full h-full object-cover"
                    onerror="this.src='/placeholder.svg'"
                  />
                </div>
                <span class="text-white/90 text-xs text-center w-full px-1 max-w-[${iconSize + 16}px] line-clamp-2 z-10" 
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