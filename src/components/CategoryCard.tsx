import React from 'react';
import { motion } from 'framer-motion';

interface Project {
  name: string;
  image: string;
  tagline: string;
}

interface CategoryCardProps {
  title: string;
  color: string;
  projects: Project[];
  onClick: () => void;
}

const CategoryCard = ({ title, color, projects, onClick }: CategoryCardProps) => {
  return (
    <motion.div
      className={`${color} rounded-lg p-6 cursor-pointer flex flex-col w-full`}
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex flex-wrap gap-3">
        {projects.map((project) => (
          <div 
            key={project.name} 
            className="flex flex-col items-center basis-[calc(50%-0.375rem)]"
          >
            <img
              src={project.image}
              alt={project.name}
              className="w-12 h-12 rounded-full mb-2 bg-white p-1"
            />
            <span className="text-sm text-center line-clamp-2">{project.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryCard;