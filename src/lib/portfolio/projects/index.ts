import type { ProjectRepository } from "@/lib/portfolio/projects/types";
import { LocalProjectRepository } from "@/lib/portfolio/projects/local-repository";

/**
 * Future Laravel-backed adapter.
 * Throws until Stage S7 — kept so the factory boundary is real.
 */
export class ApiProjectRepository implements ProjectRepository {
  async getFeaturedProjects(): Promise<never> {
    throw new Error("ApiProjectRepository is not implemented until Stage S7");
  }

  async getProjects(): Promise<never> {
    throw new Error("ApiProjectRepository is not implemented until Stage S7");
  }

  async getProjectBySlug(): Promise<never> {
    throw new Error("ApiProjectRepository is not implemented until Stage S7");
  }

  async getPublishedSlugs(): Promise<never> {
    throw new Error("ApiProjectRepository is not implemented until Stage S7");
  }

  async getProjectFilterOptions(): Promise<never> {
    throw new Error("ApiProjectRepository is not implemented until Stage S7");
  }
}

export function getProjectRepository(): ProjectRepository {
  const driver = process.env.PORTFOLIO_PROJECT_REPOSITORY ?? "local";
  if (driver === "api") {
    return new ApiProjectRepository();
  }
  return new LocalProjectRepository();
}
