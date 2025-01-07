import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`${color} rounded-lg p-6 cursor-pointer flex flex-col w-full`}
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <motion.h2 layout="position" className="text-2xl font-bold mb-4">{title}</motion.h2>
      <motion.div layout="position" className="flex flex-wrap gap-3">
        {projects.map((project) => (
          <motion.div 
            layout
            key={project.name} 
            className="flex flex-col items-center basis-[calc(50%-0.375rem)]"
          >
            <img
              src={project.image}
              alt={project.name}
              className="w-12 h-12 rounded-full mb-2 bg-white p-1"
            />
            <span className="text-sm text-center line-clamp-2">{project.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default CategoryCard;