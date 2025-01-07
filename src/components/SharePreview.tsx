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
    const padding = 16;
    const titleHeight = 80;

    // Create hierarchical data for treemap
    const hierarchyData = {
      name: "root",
      children: visibleCats.map(([key, category]) => ({
        name: category.title,
        value: Math.max(category.projects.length * 100, 300), // Minimum size for categories
        category: category,
        key: key
      }))
    };

    // Create treemap layout
    const treemap = d3.treemap()
      .size([width - padding * 2, height - titleHeight - padding * 2])
      .paddingOuter(padding)
      .paddingInner(padding)
      .round(true);

    const root = d3.hierarchy(hierarchyData)
      .sum(d => (d as any).value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    treemap(root);

    // Create cards for each category
    root.leaves().forEach(leaf => {
      const category = (leaf.data as any).category;
      const key = (leaf.data as any).key;

      const x = leaf.x0 + padding;
      const y = leaf.y0 + titleHeight;
      const width = leaf.x1 - leaf.x0;
      const height = leaf.y1 - leaf.y0;

      const card = container.append('div')
        .attr('class', 'category-card absolute')
        .style('left', `${x}px`)
        .style('top', `${y}px`)
        .style('width', `${width}px`)
        .style('height', `${height}px`);

      const cardPadding = 16;
      const minIconSize = 48;
      const maxIconSize = 64;
      
      const maxColumns = Math.floor((width - cardPadding * 2) / (minIconSize + 8));
      const maxRows = Math.floor((height - cardPadding * 2 - 40) / (minIconSize + 16));
      
      const maxProjects = maxColumns * maxRows;
      const visibleProjects = category.projects.slice(0, maxProjects);
      
      const iconSize = Math.min(
        Math.floor((width - cardPadding * 2) / maxColumns) - 8,
        Math.floor((height - cardPadding * 2 - 40) / maxRows) - 8,
        maxIconSize
      );

      const sanitizeName = (name: string) => {
        const parts = name.split(/[^\w\s$]+/);
        return parts[0].trim();
      };

      card.html(`
        <div class="h-full bg-[#111827] border border-[#1d4ed8]/30 rounded-xl p-4 flex flex-col overflow-visible shadow-lg">
          <h2 class="text-lg font-semibold text-[#60a5fa] mb-3 line-clamp-1">
            ${category.title}
          </h2>
          <div class="grid gap-3 overflow-visible" style="grid-template-columns: repeat(auto-fill, minmax(${iconSize}px, 1fr));">
            ${visibleProjects.map(project => `
              <div class="flex flex-col items-center gap-2 overflow-visible">
                <div class="rounded-full bg-gray-800/50 overflow-hidden flex items-center justify-center z-10 backdrop-blur-sm shadow-lg"
                     style="width: ${iconSize}px; height: ${iconSize}px">
                  <img
                    src="${project.image || '/placeholder.svg'}"
                    alt="${sanitizeName(project.name)}"
                    class="w-full h-full object-cover"
                    onerror="this.src='/placeholder.svg'"
                  />
                </div>
                <span class="text-white/90 text-xs text-center w-full px-1 max-w-[${iconSize + 8}px] line-clamp-2 z-10" 
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