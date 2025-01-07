import React from 'react';
import { CategorizedProjects } from '@/types/projects';

interface SharePreviewProps {
  categories: CategorizedProjects;
  visibleCategories: Record<string, boolean>;
}

const SharePreview = ({ categories, visibleCategories }: SharePreviewProps) => {
  const visibleCats = Object.entries(categories)
    .filter(([key]) => visibleCategories[key])
    .sort((a, b) => a[1].title.localeCompare(b[1].title));

  // Calculate grid layout based on number of visible categories
  const gridCols = Math.min(2, visibleCats.length);
  const gridRows = Math.ceil(visibleCats.length / gridCols);

  return (
    <div className="w-[1920px] h-[1080px] bg-[#0A0F1C] p-8 text-left">
      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-6">
        NEAR Protocol Ecosystem Map
      </h1>

      {/* Grid Container */}
      <div 
        className="grid gap-6 h-[calc(100%-120px)]"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`
        }}
      >
        {visibleCats.map(([key, category]) => (
          <div
            key={key}
            className="bg-[#111827] border border-[#1d4ed8] rounded-xl p-6 flex flex-col"
          >
            {/* Category Title */}
            <h2 className="text-xl font-semibold text-[#60a5fa] mb-4">
              {category.title}
            </h2>

            {/* Projects Grid */}
            <div 
              className="grid gap-4 flex-1"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                alignContent: 'start'
              }}
            >
              {category.projects.map((project, index) => (
                <div
                  key={`${key}-${index}`}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <img
                        src="/placeholder.svg"
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span 
                    className="text-white text-xs truncate text-center w-full px-1" 
                    title={project.name}
                  >
                    {project.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 right-8 text-gray-500 text-sm">
        Updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default SharePreview;