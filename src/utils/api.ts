import { ProjectsResponse } from '@/types/projects';

export const fetchProjects = async (): Promise<ProjectsResponse> => {
  const response = await fetch('https://api.nearcatalog.xyz/projects');
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  const data = await response.json();
  return data as ProjectsResponse;
};