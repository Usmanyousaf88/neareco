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
    <div className="w-[1920px] h-[1080px] bg-[#0A0F1C] p-10 text-left">
      {/* Title */}
      <h1 className="text-4xl font-bold text-white mb-8">
        NEAR Protocol Ecosystem Map
      </h1>

      {/* Grid Container */}
      <div className="grid grid-cols-3 gap-8 mt-4">
        {visibleCats.map(([key, category]) => (
          <div
            key={key}
            className="bg-[#111827] border border-blue-500 rounded-lg p-6 flex flex-col"
            style={{
              minHeight: '100px',
              height: 'fit-content'
            }}
          >
            {/* Category Title */}
            <h2 className="text-2xl font-semibold text-blue-400 mb-6">
              {category.title}
            </h2>

            {/* Projects Grid */}
            <div className="grid grid-cols-4 gap-4">
              {category.projects.map((project, index) => (
                <div
                  key={`${key}-${index}`}
                  className="text-white text-sm truncate"
                  title={project.name}
                >
                  {project.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-10 right-10 text-gray-500 text-sm">
        Updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default SharePreview;