import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Share2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category } from '@/types/projects';

interface CategoryControlsProps {
  categories: [string, Category][];
  visibleCategories: Record<string, boolean>;
  showOnlyFeatured: boolean;
  onToggleCategory: (category: string) => void;
  onToggleAllCategories: () => void;
  onToggleFeatured: () => void;
  onShareClick: () => void;
  areAllChecked: boolean;
}

const CategoryControls = ({
  categories,
  visibleCategories,
  showOnlyFeatured,
  onToggleCategory,
  onToggleAllCategories,
  onToggleFeatured,
  onShareClick,
  areAllChecked
}: CategoryControlsProps) => {
  return (
    <motion.div 
      className="flex flex-wrap gap-4 mb-8 justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-full flex flex-wrap gap-4 justify-center items-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleAllCategories}
          className="mb-4 bg-white/5 text-white hover:bg-white/10 hover:text-white border-white/20"
        >
          {areAllChecked ? 'Uncheck All' : 'Check All'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFeatured}
          className="mb-4 bg-white/5 text-white hover:bg-white/10 hover:text-white border-white/20"
        >
          <Star className="w-4 h-4 mr-2" />
          {showOnlyFeatured ? 'Show All' : 'Show Featured'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onShareClick}
          className="mb-4 bg-white/5 text-white hover:bg-white/10 hover:text-white border-white/20"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
      
      <div className="w-full flex flex-wrap gap-4 justify-center">
        {categories.map(([key, category]) => (
          <motion.div 
            key={key} 
            className="flex items-center space-x-2"
            layout
          >
            <Checkbox
              id={`category-${key}`}
              checked={visibleCategories[key]}
              onCheckedChange={() => onToggleCategory(key)}
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <Label
              htmlFor={`category-${key}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
            >
              {category.title}
            </Label>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryControls;