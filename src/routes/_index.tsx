import type { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories } from "@/utils/projectUtils";
import CategoryCard from "@/components/CategoryCard";
import ShareDialog from "@/components/ShareDialog";
import CategoryControls from '@/components/CategoryControls';
import MasonryLayout from '@/components/MasonryLayout';
import ProjectsGrid from '@/components/ProjectsGrid';
import type { CategorizedProjects } from "@/types/projects";

const breakpointColumns = {
  default: 5,
  1400: 4,
  1100: 3,
  700: 2,
  500: 1
};

export const meta: MetaFunction = () => {
  return [
    { title: "NEAR Protocol Ecosystem Map" },
    { name: "description", content: "Interactive map of the NEAR Protocol ecosystem" },
  ];
};

interface LoaderData {
  categories: CategorizedProjects;
}

export const loader: LoaderFunction = async () => {
  const categories = await getCategories();
  return Response.json({ categories });
};

export default function Index() {
  const { categories } = useLoaderData<LoaderData>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    Object.entries(categories).forEach(([key, category]) => {
      initial[key] = category.isPriority || key === 'aurora-virtual-chain';
    });
    return initial;
  });
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

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
      Object.entries(categories).forEach(([key, category]) => {
        updatedVisibility[key] = category.isPriority
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

  const sortedCategories = Object.entries(categories).sort((a, b) => 
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
            categories={categories} 
            visibleCategories={visibleCategories}
          />
          
          <AnimatePresence>
            <MasonryLayout breakpointColumns={breakpointColumns}>
              {Object.entries(categories)
                .filter(([key]) => visibleCategories[key])
                .map(([key, category]) => (
                  <CategoryCard
                    key={key}
                    title={category.title}
                    color={category.color}
                    projects={category.projects}
                    onClick={() => handleCategoryClick(key)}
                    isPriority={category.isPriority}
                    slug={key}
                  />
                ))}
            </MasonryLayout>
          </AnimatePresence>

          {selectedCategory && categories[selectedCategory] && (
            <ProjectsGrid
              title={categories[selectedCategory].title}
              projects={categories[selectedCategory].projects}
            />
          )}
        </div>
      </div>
    </div>
  );
} 