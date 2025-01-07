import { Project, ProjectsResponse, CategorizedProjects } from '@/types/projects';

export const categoryColors: { [key: string]: string } = {
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

// Define priority categories that should appear first (alphabetically ordered)
const priorityCategories = [
  'ai',
  'aurora-virtual-chain',
  'borrowing-lending',
  'dex',
  'ecosystem-support',
  'education',
  'game',
  'launchpad',
  'liquid-staking',
  'memecoin',
  'nft',
  'wallet'
];

export const categorizeProjects = (projectsData: ProjectsResponse): CategorizedProjects => {
  const categories: CategorizedProjects = {};

  // Calculate total projects per tag for better distribution
  const tagCounts = new Map<string, number>();
  Object.values(projectsData).forEach((project) => {
    Object.keys(project.profile.tags).forEach((tag) => {
      // Normalize the tag to use hyphens
      const normalizedTag = tag.replace(/ /g, '-');
      tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
    });
  });

  // Sort projects by number of tags to help with distribution
  const sortedProjects = Object.values(projectsData).sort((a, b) => 
    Object.keys(b.profile.tags).length - Object.keys(a.profile.tags).length
  );

  // Distribute projects across categories
  sortedProjects.forEach((project) => {
    const projectTags = Object.keys(project.profile.tags);
    projectTags.forEach((tag) => {
      // Normalize the tag to use hyphens
      const normalizedTag = tag.replace(/ /g, '-');
      if (!categories[normalizedTag]) {
        categories[normalizedTag] = {
          title: project.profile.tags[tag],
          color: categoryColors[normalizedTag] || "bg-gray-500",
          projects: [],
          isPriority: priorityCategories.includes(normalizedTag)
        };
      }
      if (!categories[normalizedTag].projects.find(p => p.name === project.profile.name)) {
        categories[normalizedTag].projects.push({
          name: project.profile.name,
          image: project.profile.image.url,
          tagline: project.profile.tagline
        });
      }
    });
  });

  // Sort categories: priority categories first (alphabetically), then others (alphabetically)
  return Object.fromEntries(
    Object.entries(categories)
      .sort(([keyA, valueA], [keyB, valueB]) => {
        const isPriorityA = priorityCategories.includes(keyA);
        const isPriorityB = priorityCategories.includes(keyB);

        // If both are priority or both are not priority, sort alphabetically by title
        if (isPriorityA === isPriorityB) {
          return valueA.title.localeCompare(valueB.title);
        }
        
        // If only one is priority, it goes first
        return isPriorityA ? -1 : 1;
      })
  );
};