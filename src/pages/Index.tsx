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
  community: "bg-violet-600",
  dapp: "bg-blue-600",
  defi: "bg-indigo-600",
  dex: "bg-purple-600",
  "ecosystem-support": "bg-green-600",
  infrastructure: "bg-emerald-600",
  launchpad: "bg-pink-600",
  nft: "bg-fuchsia-600",
  other: "bg-gray-600",
  utilities: "bg-slate-600",
  "aurora-virtual-chain": "bg-amber-600",
  bitcoin: "bg-orange-600",
  accelerator: "bg-red-600",
  ai: "bg-cyan-600",
  analytics: "bg-teal-600",
  "asset-management": "bg-sky-600",
  audit: "bg-rose-600",
  aurora: "bg-yellow-600",
  "borrowing-lending": "bg-lime-600",
  bos: "bg-green-500",
  bot: "bg-blue-500",
  bounty: "bg-purple-500",
  bridge: "bg-indigo-500",
  cex: "bg-violet-500",
  "chain-abstraction": "bg-fuchsia-500",
  compliance: "bg-pink-500",
  "cross-chain-router": "bg-rose-500",
  custodian: "bg-orange-500",
  dao: "bg-amber-500",
  "data-availability": "bg-emerald-500",
  desci: "bg-cyan-500",
  "developer-support": "bg-teal-500",
  "developer-tooling": "bg-sky-500",
  education: "bg-blue-700",
  enterprise: "bg-indigo-700",
  event: "bg-violet-700",
  explorer: "bg-purple-700",
  "funding-node": "bg-fuchsia-700",
  game: "bg-pink-700",
  identity: "bg-rose-700",
  indexer: "bg-orange-700",
  "liquid-staking": "bg-amber-700",
  loyalty: "bg-yellow-700",
  marketplace: "bg-lime-700",
  memecoin: "bg-green-700",
  messaging: "bg-emerald-700",
  mobile: "bg-teal-700",
  music: "bg-cyan-700",
  "on-off-ramp": "bg-sky-700",
  oracles: "bg-blue-800",
  payment: "bg-indigo-800",
  privacy: "bg-violet-800",
  "productivity-tool": "bg-purple-800",
  "regional-hub": "bg-fuchsia-800",
  restaking: "bg-pink-800",
  rpc: "bg-rose-800",
  rwa: "bg-orange-800",
  security: "bg-amber-800",
  "service-provider": "bg-yellow-800",
  social: "bg-lime-800",
  sport: "bg-green-800",
  stablecoin: "bg-emerald-800",
  storage: "bg-teal-800",
  validator: "bg-cyan-800",
  wallet: "bg-sky-800",
  "zero-knowledge": "bg-blue-900"
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
