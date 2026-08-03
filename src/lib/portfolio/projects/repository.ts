import type { CanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";
import { PublicMediaRepository } from "@/lib/portfolio/projects/media-repository";
import { publicProjectsSnapshotSchema } from "@/lib/portfolio/projects/schema";
import type {
  PublicProject,
  PublicProjectsSnapshot,
} from "@/lib/portfolio/projects/types";

export class PortfolioProjectRepository {
  private readonly projects: PublicProject[];
  private readonly bySlug: Map<CanonicalProjectSlug, PublicProject>;

  constructor(rawSnapshot: unknown, rawMediaManifest: unknown) {
    const snapshot: PublicProjectsSnapshot = publicProjectsSnapshotSchema.parse(rawSnapshot);
    const mediaRepository = new PublicMediaRepository(rawMediaManifest);

    this.projects = snapshot.projects.map((project) => ({
      ...project,
      ...mediaRepository.getProjectMedia(project.slug),
    }));
    this.bySlug = new Map(this.projects.map((project) => [project.slug, project]));
  }

  getFeaturedProjects(): PublicProject[] {
    return this.projects
      .filter(({ featured }) => featured)
      .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
  }

  getWorkIndexProjects(): PublicProject[] {
    return [...this.projects].sort((a, b) => a.listingOrder - b.listingOrder);
  }

  getProjectBySlug(slug: string): PublicProject | null {
    return this.bySlug.get(slug as CanonicalProjectSlug) ?? null;
  }

  getPublishedCaseStudySlugs(): CanonicalProjectSlug[] {
    return this.projects
      .filter(({ caseStudyAvailability }) => caseStudyAvailability === "published")
      .map(({ slug }) => slug);
  }
}
