import React, { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import CategoryCard from '@/components/CategoryCard';
import ProjectsGrid from '@/components/ProjectsGrid';
import MasonryLayout from '@/components/MasonryLayout';
import { categorizeProjects } from '@/utils/projectUtils';
import { motion, AnimatePresence } from 'framer-motion';
import ShareDialog from '@/components/ShareDialog';
import CategoryControls from '@/components/CategoryControls';

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
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch('https://api.nearcatalog.xyz/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
  });

  const categorizedProjects = React.useMemo(() => {
    if (!projectsData) return {};
    return categorizeProjects(projectsData);
  }, [projectsData]);

  React.useEffect(() => {
    if (projectsData) {
      const categories = Object.keys(categorizeProjects(projectsData));
      const initialVisibility = categories.reduce((acc, category) => {
        acc[category] = false;
        return acc;
      }, {} as Record<string, boolean>);

      // Always show featured categories and aurora-virtual-chain
      Object.entries(categorizeProjects(projectsData)).forEach(([key, category]) => {
        if (category.isPriority || key === 'aurora-virtual-chain') {
          initialVisibility[key] = true;
        }
      });

      setVisibleCategories(initialVisibility);
    }
  }, [projectsData, showOnlyFeatured]);

  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
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
        updatedVisibility[key] = category.isPriority || key === 'aurora-virtual-chain';
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
        
        <CategoryControls 
          categories={sortedCategories}
          visibleCategories={visibleCategories}
          showOnlyFeatured={showOnlyFeatured}
          onToggleCategory={toggleCategory}
          onToggleAllCategories={toggleAllCategories}
          onToggleFeatured={toggleFeatured}
          onShareClick={() => setShareDialogOpen(true)}
          areAllChecked={areAllChecked}
        />

        <div ref={contentRef}>
          <ShareDialog 
            open={shareDialogOpen}
            onOpenChange={setShareDialogOpen}
            categories={categorizedProjects} 
            visibleCategories={visibleCategories}
          />
          
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