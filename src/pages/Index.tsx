import React, { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import CategoryCard from '@/components/CategoryCard';
import ProjectsGrid from '@/components/ProjectsGrid';
import MasonryLayout from '@/components/MasonryLayout';
import { categorizeProjects } from '@/utils/projectUtils';
import { fetchProjects } from '@/utils/api';
import type { ProjectsResponse } from '@/types/projects';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { Share2, Star } from 'lucide-react';
import SharePreview from '@/components/SharePreview';

const breakpointColumns = {
  default: 5,
  1400: 4,
  1100: 3,
  700: 2,
  500: 1
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Record<string, boolean>>({});
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(true);
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const categorizedProjects = React.useMemo(() => {
    if (!projectsData) return {};
    return categorizeProjects(projectsData);
  }, [projectsData]);

  React.useEffect(() => {
    if (projectsData) {
      const categories = Object.keys(categorizeProjects(projectsData));
      const initialVisibility = categories.reduce((acc, category) => {
        acc[category] = !showOnlyFeatured;
        return acc;
      }, {} as Record<string, boolean>);

      // Always show featured categories
      Object.entries(categorizeProjects(projectsData)).forEach(([key, category]) => {
        if (category.isPriority) {
          initialVisibility[key] = true;
        }
      });

      setVisibleCategories(initialVisibility);
    }
  }, [projectsData, showOnlyFeatured]);

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
  };

  const handleShare = async () => {
    try {
      toast({
        title: "Generating image...",
        description: "Please wait while we create your share image.",
      });

      const element = document.getElementById('share-preview');
      if (!element) {
        throw new Error('Share preview element not found');
      }

      const canvas = await html2canvas(element, {
        width: 3840,
        height: 2160,
        scale: 1,
        backgroundColor: null,
        logging: true,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('share-preview');
          if (clonedElement) {
            clonedElement.style.width = '3840px';
            clonedElement.style.height = '2160px';
          }
        }
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'near-ecosystem-map.png';
      link.href = image;
      link.click();

      toast({
        title: "Success!",
        description: "Your image has been generated and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share image. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating share image:", error);
    }
  };

  const toggleCategory = (category: string) => {
    setVisibleCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleAllCategories = () => {
    const areAllChecked = Object.values(visibleCategories).every(value => value);
    const newValue = !areAllChecked;
    
    const updatedVisibility = Object.keys(visibleCategories).reduce((acc, category) => {
      acc[category] = newValue;
      return acc;
    }, {} as Record<string, boolean>);
    
    setVisibleCategories(updatedVisibility);
  };

  const toggleFeatured = () => {
    setShowOnlyFeatured(prev => !prev);
    if (!showOnlyFeatured) {
      // Switching to featured only
      const updatedVisibility = { ...visibleCategories };
      Object.entries(categorizedProjects).forEach(([key, category]) => {
        updatedVisibility[key] = category.isPriority;
      });
      setVisibleCategories(updatedVisibility);
    } else {
      // Showing all
      const updatedVisibility = Object.keys(visibleCategories).reduce((acc, category) => {
        acc[category] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setVisibleCategories(updatedVisibility);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Projects</h2>
          <p className="text-red-400">Please try again later</p>
        </div>
      </div>
    );
  }

  const sortedCategories = Object.entries(categorizedProjects).sort((a, b) => 
    a[1].title.localeCompare(b[1].title)
  );

  const areAllChecked = Object.values(visibleCategories).every(value => value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-[1800px] mx-auto">
        <motion.h1 
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          NEAR Protocol Ecosystem Map
        </motion.h1>
        
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
              onClick={toggleAllCategories}
              className="mb-4 bg-white/5 text-white hover:bg-white/10 hover:text-white border-white/20"
            >
              {areAllChecked ? 'Uncheck All' : 'Check All'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleFeatured}
              className="mb-4 bg-white/5 text-white hover:bg-white/10 hover:text-white border-white/20"
            >
              <Star className="w-4 h-4 mr-2" />
              {showOnlyFeatured ? 'Show All' : 'Show Featured'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="mb-4 bg-white/5 text-white hover:bg-white/10 hover:text-white border-white/20"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="w-full flex flex-wrap gap-4 justify-center">
            {sortedCategories.map(([key, category]) => (
              <motion.div 
                key={key} 
                className="flex items-center space-x-2"
                layout
              >
                <Checkbox
                  id={`category-${key}`}
                  checked={visibleCategories[key]}
                  onCheckedChange={() => toggleCategory(key)}
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

        <div ref={contentRef}>
          <SharePreview categories={categorizedProjects} />
          <AnimatePresence>
            <MasonryLayout breakpointColumns={breakpointColumns}>
              {Object.entries(categorizedProjects)
                .filter(([key]) => visibleCategories[key])
                .map(([key, category]) => (
                  <CategoryCard
                    key={key}
                    title={category.title}
                    color={category.color}
                    projects={category.projects}
                    onClick={() => handleCategoryClick(key)}
                    isPriority={category.isPriority}
                  />
                ))}
            </MasonryLayout>
          </AnimatePresence>

          {selectedCategory && categorizedProjects[selectedCategory] && (
            <ProjectsGrid
              title={categorizedProjects[selectedCategory].title}
              projects={categorizedProjects[selectedCategory].projects}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;