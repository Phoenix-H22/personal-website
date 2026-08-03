import {
  ADAPTIVE_STACK_LENS_MODES,
  type AdaptiveStackLensDto,
} from "@/lib/portfolio/adaptive-stack-lens";
import {
  toFeaturedProjectDto,
  toProjectDetailDto,
  toWorkIndexProjectDto,
} from "@/lib/portfolio/projects/normalize";
import { getPortfolioProjectRepository } from "@/lib/portfolio/projects/server-only";
import type {
  FeaturedProjectDto,
  ProjectDetailDto,
  WorkIndexProjectDto,
} from "@/lib/portfolio/projects/types";

export async function getFeaturedProjects(): Promise<FeaturedProjectDto[]> {
  return getPortfolioProjectRepository()
    .getFeaturedProjects()
    .map(toFeaturedProjectDto);
}

export async function getWorkIndexProjects(): Promise<WorkIndexProjectDto[]> {
  return getPortfolioProjectRepository()
    .getWorkIndexProjects()
    .map(toWorkIndexProjectDto);
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetailDto | null> {
  const project = getPortfolioProjectRepository().getProjectBySlug(slug);
  return project ? toProjectDetailDto(project) : null;
}

export async function getPublishedCaseStudySlugs(): Promise<string[]> {
  return getPortfolioProjectRepository().getPublishedCaseStudySlugs();
}

export async function getAdaptiveStackLensProjects(): Promise<
  AdaptiveStackLensDto[]
> {
  const repository = getPortfolioProjectRepository();

  return ADAPTIVE_STACK_LENS_MODES.map((mode) => {
    const project = repository.getProjectBySlug(mode.slug);
    if (!project) throw new Error(`Adaptive Stack Lens missing ${mode.slug}`);
    return {
      ...mode,
      technologies: project.technologies.slice(0, 4),
    };
  });
}
