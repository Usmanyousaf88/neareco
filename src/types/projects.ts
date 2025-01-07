export interface Project {
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

export interface ProjectsResponse {
  [key: string]: Project;
}

export interface CategorizedProjects {
  [key: string]: {
    title: string;
    color: string;
    projects: Array<{
      name: string;
      image: string;
      tagline: string;
    }>;
  };
}