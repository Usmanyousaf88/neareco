export interface Project {
  name: string;
  image: string;
  tagline: string;
}

export interface Category {
  title: string;
  color: string;
  projects: Project[];
  isPriority: boolean;
}

export interface CategorizedProjects {
  [key: string]: Category;
}

export interface ProjectsResponse {
  [key: string]: {
    profile: {
      name: string;
      image: {
        url: string;
      };
      tagline: string;
      tags: {
        [key: string]: string;
      };
    };
  };
}