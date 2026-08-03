export {
  getAdaptiveStackLensProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getPublishedCaseStudySlugs,
  getWorkIndexProjects,
} from "@/lib/portfolio/projects/selectors";

export type {
  FeaturedProjectDto,
  ProjectDetailDto,
  WorkIndexProjectDto,
} from "@/lib/portfolio/projects/types";

export type { AdaptiveStackLensDto } from "@/lib/portfolio/adaptive-stack-lens";
