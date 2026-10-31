import { projects } from "@/data/projects";
import { experience } from "@/data/experience";
import type { Project } from "@/types/portfolio";

export const getProject = (slug: string): Project | undefined =>
  projects.find((p) => p.slug === slug);

export const projectsUsing = (technology: string): Project[] =>
  projects.filter((p) => p.technologies.some((t) => t.toLowerCase() === technology.toLowerCase()));

export const allProjectCategories = (): string[] => [...new Set(projects.map((p) => p.category))];

export const allProjectTechnologies = (): string[] =>
  [...new Set(projects.flatMap((p) => p.technologies))].sort((a, b) => a.localeCompare(b));

export const experienceForProject = (slug: string) =>
  experience.filter((e) => e.relatedProjects?.includes(slug));

export function matchesProjectFilter(p: Project, tech: string, category: string) {
  return (tech === "All" || p.technologies.includes(tech)) && (category === "All" || p.category === category);
}
