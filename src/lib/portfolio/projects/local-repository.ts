import { featuredProjectFixtures } from "@/lib/portfolio/projects/fixtures";
import {
  isPubliclyListable,
  toProjectSummary,
  toPublicCaseStudy,
} from "@/lib/portfolio/projects/mappers";
import { projectCaseStudyDtoSchema } from "@/lib/portfolio/projects/schemas";
import type {
  ProjectCaseStudy,
  ProjectCollection,
  ProjectFilterOptions,
  ProjectFilters,
  ProjectPagination,
  ProjectQueryOptions,
  ProjectRepository,
  ProjectSummary,
} from "@/lib/portfolio/projects/types";

function matchesFilters(
  project: ProjectCaseStudy,
  filters?: ProjectFilters,
): boolean {
  if (!filters) return true;
  if (filters.domain?.length) {
    if (!filters.domain.some((value) => project.domains.includes(value))) {
      return false;
    }
  }
  if (filters.role?.length) {
    if (!filters.role.some((value) => project.roles.includes(value))) {
      return false;
    }
  }
  if (filters.platform?.length) {
    if (!filters.platform.some((value) => project.platforms.includes(value))) {
      return false;
    }
  }
  if (filters.technology?.length) {
    const tech = project.technologies.map((item) => item.toLowerCase());
    if (
      !filters.technology.some((value) => tech.includes(value.toLowerCase()))
    ) {
      return false;
    }
  }
  if (filters.status?.length) {
    if (!filters.status.includes(project.status)) return false;
  }
  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    const haystack = [
      project.title,
      project.shortTitle,
      project.subtitle,
      project.summary,
      project.ownershipSummary,
      ...project.domains,
      ...project.technologies,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

/**
 * Local adapter backed by validated fixtures.
 * UI must not import content arrays — use getProjectRepository().
 */
export class LocalProjectRepository implements ProjectRepository {
  private readonly projects: ProjectCaseStudy[];

  constructor(rawProjects = featuredProjectFixtures) {
    this.projects = rawProjects.map((raw) => {
      const dto = projectCaseStudyDtoSchema.parse(raw);
      return toPublicCaseStudy(dto);
    });
  }

  async getFeaturedProjects(): Promise<ProjectSummary[]> {
    return this.projects
      .filter(
        (project) =>
          project.featured &&
          project.homepageOrder != null &&
          isPubliclyListable(project),
      )
      .sort((a, b) => (a.homepageOrder ?? 0) - (b.homepageOrder ?? 0))
      .map(toProjectSummary);
  }

  async getProjects(
    filters?: ProjectFilters,
    pagination: ProjectPagination = { page: 1, pageSize: 12 },
  ): Promise<ProjectCollection> {
    const filtered = this.projects
      .filter((project) => isPubliclyListable(project))
      .filter((project) => matchesFilters(project, filters))
      .sort((a, b) => a.workOrder - b.workOrder);

    const page = Math.max(1, pagination.page);
    const pageSize = Math.min(24, Math.max(1, pagination.pageSize));
    const start = (page - 1) * pageSize;

    return {
      items: filtered.slice(start, start + pageSize).map(toProjectSummary),
      total: filtered.length,
      page,
      pageSize,
    };
  }

  async getProjectBySlug(
    slug: string,
    options?: ProjectQueryOptions,
  ): Promise<ProjectCaseStudy | null> {
    if (options?.includeDrafts) {
      throw new Error("Public LocalProjectRepository cannot include drafts");
    }
    const project = this.projects.find((entry) => entry.slug === slug);
    if (!project || !isPubliclyListable(project)) return null;
    return project;
  }

  async getPublishedSlugs(): Promise<string[]> {
    return this.projects
      .filter((project) => isPubliclyListable(project))
      .map((project) => project.slug);
  }

  async getProjectFilterOptions(): Promise<ProjectFilterOptions> {
    const published = this.projects.filter((project) =>
      isPubliclyListable(project),
    );
    const count = (values: string[]) => {
      const map = new Map<string, number>();
      for (const value of values) {
        map.set(value, (map.get(value) ?? 0) + 1);
      }
      return [...map.entries()].map(([value, total]) => ({
        value,
        count: total,
      }));
    };

    return {
      domains: count(published.flatMap((project) => project.domains)),
      roles: count(published.flatMap((project) => project.roles)),
      platforms: count(published.flatMap((project) => project.platforms)),
      technologies: count(published.flatMap((project) => project.technologies)),
      statuses: count(published.map((project) => project.status)).map(
        (entry) => ({
          value: entry.value as ProjectSummary["status"],
          count: entry.count,
        }),
      ),
    };
  }
}
