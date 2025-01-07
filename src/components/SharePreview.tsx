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
    <div className="w-[1920px] h-[1080px] bg-[#0A0F1C] p-10 text-left overflow-hidden">
      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-4">
        NEAR Protocol Ecosystem Map
      </h1>

      {/* Grid Container */}
      <div className="grid grid-cols-3 gap-6 mt-2 h-[calc(100%-120px)] overflow-hidden">
        {visibleCats.map(([key, category]) => (
          <div
            key={key}
            className="bg-[#111827] border border-blue-500 rounded-lg p-4 flex flex-col overflow-hidden"
          >
            {/* Category Title */}
            <h2 className="text-xl font-semibold text-blue-400 mb-4">
              {category.title}
            </h2>

            {/* Projects Grid */}
            <div className="grid grid-cols-4 gap-3 overflow-y-auto">
              {category.projects.map((project, index) => (
                <div
                  key={`${key}-${index}`}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 overflow-hidden flex items-center justify-center">
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
      <div className="absolute bottom-6 right-8 text-gray-500 text-sm">
        Updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default SharePreview;