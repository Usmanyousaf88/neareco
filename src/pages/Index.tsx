import React, { useState, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import CategoryCard from '@/components/CategoryCard';
import ProjectsGrid from '@/components/ProjectsGrid';

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
        
        <div className="flex flex-wrap gap-6">
          {Object.entries(categorizedProjects).map(([key, category]) => (
            <CategoryCard
              key={key}
              title={category.title}
              color={category.color}
              projects={category.projects}
              onClick={() => handleCategoryClick(key)}
            />
          ))}
        </div>

        {selectedCategory && categorizedProjects[selectedCategory] && (
          <ProjectsGrid
            title={categorizedProjects[selectedCategory].title}
            projects={categorizedProjects[selectedCategory].projects}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
