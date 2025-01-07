import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';

interface Project {
  slug: string;
  profile: {
    name: string;
    tagline: string;
    image: {
      url: string;
    };
    tags: {
      [key: string]: string;
    };
  };
}

interface ProjectsResponse {
  [key: string]: Project;
}

const fetchProjects = async (): Promise<ProjectsResponse> => {
  const response = await fetch('https://api.nearcatalog.xyz/projects');
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
};

const categoryColors: { [key: string]: string } = {
  defi: "bg-blue-500",
  infrastructure: "bg-purple-500",
  nft: "bg-green-500",
  wallet: "bg-yellow-500",
  analytics: "bg-red-500",
  community: "bg-indigo-500",
  game: "bg-pink-500",
  dapp: "bg-orange-500"
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: projectsData, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const categorizedProjects = useMemo(() => {
    if (!projectsData) return {};

    const categories: { [key: string]: { title: string; color: string; projects: any[] } } = {};

    Object.values(projectsData).forEach((project) => {
      Object.keys(project.profile.tags).forEach((tag) => {
        if (!categories[tag]) {
          categories[tag] = {
            title: project.profile.tags[tag],
            color: categoryColors[tag] || "bg-gray-500",
            projects: []
          };
        }
        if (!categories[tag].projects.find(p => p.name === project.profile.name)) {
          categories[tag].projects.push({
            name: project.profile.name,
            image: project.profile.image.url,
            tagline: project.profile.tagline
          });
        }
      });
    });

    return categories;
  }, [projectsData]);

  const handleCategoryClick = (key: string) => {
    try {
      setSelectedCategory(key);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load category details. Please try again.",
        variant: "destructive",
      });
      console.error("Error selecting category:", error);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement;
    img.src = "/placeholder.svg";
    toast({
      title: "Image Load Error",
      description: "Failed to load project image. Using placeholder instead.",
      variant: "destructive",
    });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">NEAR Protocol Ecosystem Map</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categorizedProjects).map(([key, category]) => (
            <motion.div
              key={key}
              className={`${category.color} rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105`}
              whileHover={{ y: -5 }}
              onClick={() => handleCategoryClick(key)}
            >
              <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
              <div className="grid grid-cols-2 gap-4">
                {category.projects.slice(0, 4).map((project) => (
                  <div key={project.name} className="flex flex-col items-center">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-12 h-12 rounded-full mb-2 bg-white p-1"
                      onError={handleImageError}
                    />
                    <span className="text-sm text-center">{project.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {selectedCategory && categorizedProjects[selectedCategory] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gray-800 rounded-lg p-6"
          >
            <h3 className="text-2xl font-bold mb-4">
              {categorizedProjects[selectedCategory].title} Projects
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categorizedProjects[selectedCategory].projects.map((project) => (
                <div key={project.name} className="flex flex-col items-center">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-16 h-16 rounded-full mb-2 bg-white p-1"
                    onError={handleImageError}
                  />
                  <span className="text-sm text-center">{project.name}</span>
                  {project.tagline && (
                    <span className="text-xs text-gray-400 text-center mt-1">{project.tagline}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;