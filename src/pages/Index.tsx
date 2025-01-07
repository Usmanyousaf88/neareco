import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

const categories = {
  defi: {
    title: "DeFi",
    color: "bg-blue-500",
    projects: [
      { name: "Ref Finance", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/02/ref-finance.jpg" },
      { name: "Burrow", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/01/Ax6DE9HA_400x400.jpg" },
      { name: "LiNEAR Protocol", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/linear-protocol.jpg" },
      { name: "Meta Pool", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/meta-pool.png" },
      { name: "DapDap", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/08/DapDap.jpg" }
    ]
  },
  infrastructure: {
    title: "Infrastructure",
    color: "bg-purple-500",
    projects: [
      { name: "Aurora", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/08/Aurora.jpg" },
      { name: "NEAR Protocol", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/12/near-icon.png" },
      { name: "Rainbow Bridge", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/12/Rainbow-Bridge.jpg" },
      { name: "FastNear", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/08/FastNear.jpg" },
      { name: "IPFS", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/ipfs.jpg" }
    ]
  },
  nftGaming: {
    title: "NFTs & Gaming",
    color: "bg-green-500",
    projects: [
      { name: "Mintbase", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/mintbase.jpg" },
      { name: "Paras", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/paras.jpg" },
      { name: "Harvest MOON", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/03/havest-moon.jpeg" },
      { name: "PlayEmber", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/playember.jpg" }
    ]
  },
  wallets: {
    title: "Wallets",
    color: "bg-yellow-500",
    projects: [
      { name: "MyNearWallet", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/mynearwallet.jpg" },
      { name: "HERE Wallet", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/here-wallet.jpg" },
      { name: "Meteor Wallet", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/08/Meteor-Wallet.jpg" },
      { name: "Ledger", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/ledger.jpg" }
    ]
  },
  analytics: {
    title: "Analytics & Tools",
    color: "bg-red-500",
    projects: [
      { name: "Near Blocks", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/11/Near-Blocks.jpg" },
      { name: "Pikespeak", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/pikespeak.jpg" },
      { name: "DeFiLlama", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/nearcatalog/defillama.jpg" },
      { name: "Dune Analytics", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/10/Dune-Analytics.jpg" }
    ]
  },
  community: {
    title: "Community & Education",
    color: "bg-indigo-500",
    projects: [
      { name: "NEAR Week", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/08/NEAR-Week.jpg" },
      { name: "Learn NEAR Club", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/08/Learn-NEAR-Club.jpg" },
      { name: "NEAR Academy", image: "https://indexer.nearcatalog.xyz/wp-content/uploads/2024/08/NEAR-Academy.jpg" }
    ]
  }
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();

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
    img.src = "/placeholder.svg"; // Fallback image
    toast({
      title: "Image Load Error",
      description: "Failed to load project image. Using placeholder instead.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">NEAR Protocol Ecosystem Map</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categories).map(([key, category]) => (
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

        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gray-800 rounded-lg p-6"
          >
            <h3 className="text-2xl font-bold mb-4">
              {categories[selectedCategory as keyof typeof categories].title} Projects
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories[selectedCategory as keyof typeof categories].projects.map((project) => (
                <div key={project.name} className="flex flex-col items-center">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-16 h-16 rounded-full mb-2 bg-white p-1"
                    onError={handleImageError}
                  />
                  <span className="text-sm text-center">{project.name}</span>
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