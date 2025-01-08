export interface Theme {
  name: string;
  background: string;
  cardBackground: string;
  cardBorder: string;
  titleText: string;
  categoryText: string;
  projectText: string;
}

export const THEMES: Theme[] = [
  {
    name: "Dark Blue",
    background: "#0A0F1C",
    cardBackground: "#111827",
    cardBorder: "#1d4ed8",
    titleText: "#ffffff",
    categoryText: "#60a5fa",
    projectText: "#ffffff",
  },
  {
    name: "Midnight Purple",
    background: "#0F0720",
    cardBackground: "#1A103A",
    cardBorder: "#6D28D9",
    titleText: "#ffffff",
    categoryText: "#A78BFA",
    projectText: "#ffffff",
  },
  {
    name: "Forest",
    background: "#0C1A17",
    cardBackground: "#132E27",
    cardBorder: "#059669",
    titleText: "#ffffff",
    categoryText: "#6EE7B7",
    projectText: "#ffffff",
  },
  {
    name: "Light",
    background: "#F8FAFC",
    cardBackground: "#FFFFFF",
    cardBorder: "#3B82F6",
    titleText: "#1E293B",
    categoryText: "#2563EB",
    projectText: "#334155",
  },
];
