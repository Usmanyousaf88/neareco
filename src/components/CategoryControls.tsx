import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Star, StarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category } from '@/types/projects';

interface CategoryControlsProps {
  categories: [string, Category][];
  visibleCategories: Record<string, boolean>;
  showOnlyFeatured: boolean;
  onToggleCategory: (category: string) => void;
  onToggleFeatured: () => void;
  onShareClick: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const CategoryControls: React.FC<CategoryControlsProps> = ({
  categories,
  visibleCategories,
  showOnlyFeatured,
  onToggleCategory,
  onToggleFeatured,
  onShareClick,
  searchValue,
  onSearchChange,
}) => {
  const handleTagClick = (key: string) => {
    onToggleCategory(key);
  };

  const handleFeaturedClick = () => {
    const featuredCategories = categories
      .filter(([_, category]) => category.isPriority)
      .map(([key]) => key);
    
    const allCategories = categories.map(([key]) => key);
    
    if (showOnlyFeatured) {
      // Switch to all categories
      categories.forEach(([key]) => {
        if (!visibleCategories[key]) {
          onToggleCategory(key);
        }
      });
    } else {
      // Switch to featured categories only
      categories.forEach(([key, category]) => {
        if (category.isPriority && !visibleCategories[key]) {
          onToggleCategory(key);
        } else if (!category.isPriority && visibleCategories[key]) {
          onToggleCategory(key);
        }
      });
    }

    onToggleFeatured();
  };

  return (
    <motion.div 
      layout
      className="bg-gray-800/50 backdrop-blur-sm py-4 px-4 rounded-lg mb-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search projects or filter by category..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-800 border-gray-700 focus:border-primary"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleFeaturedClick}
          className={showOnlyFeatured ? 'text-primary' : ''}
        >
          {showOnlyFeatured ? <StarIcon className="w-4 h-4 fill-current" /> : <Star className="w-4 h-4" />}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onShareClick}
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(([key, category]) => (
          <motion.button
            key={key}
            onClick={() => handleTagClick(key)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              visibleCategories[key]
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
            }`}
            layout
          >
            {category.title}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryControls;