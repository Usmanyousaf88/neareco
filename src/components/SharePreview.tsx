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

  return (
    <div className="w-[1920px] h-[1080px] bg-[#0A0F1C] p-8 text-left">
      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-4">
        NEAR Protocol Ecosystem Map
      </h1>

      {/* Grid Container */}
      <div className="grid grid-cols-3 gap-4 h-[calc(100%-100px)]">
        {visibleCats.map(([key, category]) => (
          <div
            key={key}
            className="bg-[#111827] border border-blue-500 rounded-lg p-4 flex flex-col"
          >
            {/* Category Title */}
            <h2 className="text-lg font-semibold text-blue-400 mb-3">
              {category.title}
            </h2>

            {/* Projects Grid */}
            <div className="grid grid-cols-5 gap-2">
              {category.projects.map((project, index) => (
                <div
                  key={`${key}-${index}`}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
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
                    className="text-white text-[10px] truncate text-center w-full px-0.5" 
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
      <div className="absolute bottom-4 right-6 text-gray-500 text-xs">
        Updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default SharePreview;