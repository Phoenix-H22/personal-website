import { describe, expect, it } from "vitest";

import { FEATURED_PROJECT_SLUGS, LISTING_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";
import mediaManifest from "@/lib/portfolio/projects/data/public-media-manifest.json";
import projectSnapshot from "@/lib/portfolio/projects/data/public-projects.snapshot.json";
import { PortfolioProjectRepository } from "@/lib/portfolio/projects/repository";

describe("PortfolioProjectRepository", () => {
  const repository = new PortfolioProjectRepository(projectSnapshot, mediaManifest);

  it("returns the approved featured order", () => {
    expect(repository.getFeaturedProjects().map(({ slug }) => slug)).toEqual(
      FEATURED_PROJECT_SLUGS,
    );
  });

  it("returns all 13 projects in editorial listing order", () => {
    const projects = repository.getWorkIndexProjects();
    expect(projects).toHaveLength(13);
    expect(projects.map(({ slug }) => slug)).toEqual(LISTING_PROJECT_SLUGS);
    expect(new Set(projects.map(({ listingOrder }) => listingOrder)).size).toBe(13);
  });

  it("returns null for unknown slugs", () => {
    expect(repository.getProjectBySlug("backup-project")).toBeNull();
  });

  it("excludes planned case studies from published slugs", () => {
    expect(repository.getPublishedCaseStudySlugs()).toEqual([]);
  });

  it("joins approved media without inventing Riders architecture", () => {
    expect(repository.getProjectBySlug("smart-lockers-platform")?.cover.sha256).toHaveLength(64);
    expect(repository.getProjectBySlug("riders-shopify-wordpress")?.architectureDiagram).toBeNull();
  });
});
