import React from 'react';
import { motion } from 'framer-motion';

interface Project {
  name: string;
  image: string;
  tagline: string;
}

interface ProjectsGridProps {
  title: string;
  projects: Project[];
}

const ProjectsGrid = ({ title, projects }: ProjectsGridProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 bg-gray-800 rounded-lg p-6"
    >
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-min">
        {projects.map((project) => (
          <div key={project.name} className="flex flex-col items-center min-h-[120px]">
            <img
              src={project.image}
              alt={project.name}
              className="w-16 h-16 rounded-full mb-2 bg-white p-1"
            />
            <span className="text-sm text-center font-medium">{project.name}</span>
            {project.tagline && (
              <span className="text-xs text-gray-400 text-center mt-1 line-clamp-2">
                {project.tagline}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsGrid;