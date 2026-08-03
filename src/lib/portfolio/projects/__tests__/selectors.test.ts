import fs from "node:fs";
import path from "node:path";

import { beforeAll, describe, expect, it, vi } from "vitest";

import { FEATURED_PROJECT_SLUGS, LISTING_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";

vi.mock("server-only", () => ({}));

let selectors: typeof import("@/lib/portfolio/projects/selectors");

beforeAll(async () => {
  selectors = await import("@/lib/portfolio/projects/selectors");
});

describe("route-oriented project selectors", () => {
  it("returns seven minimal featured DTOs in exact order", async () => {
    const projects = await selectors.getFeaturedProjects();
    expect(projects.map(({ slug }) => slug)).toEqual(FEATURED_PROJECT_SLUGS);
    expect(Object.keys(projects[0]).sort()).toEqual(
      [
        "caseStudyAvailable",
        "cover",
        "coverCard",
        "id",
        "ownershipType",
        "primaryCategory",
        "role",
        "shortTagline",
        "slug",
        "status",
        "strongestCapability",
        "strongestMetric",
        "systemType",
        "technologies",
        "title",
        "website",
      ].sort(),
    );
    expect(projects[0]).not.toHaveProperty("caseStudy");
    expect(projects[0]).not.toHaveProperty("capabilities");
    expect(projects[0]).not.toHaveProperty("architectureDiagram");
  });

  it("returns all 13 work-index DTOs", async () => {
    const projects = await selectors.getWorkIndexProjects();
    expect(projects.map(({ slug }) => slug)).toEqual(LISTING_PROJECT_SLUGS);
    expect(projects.every(({ technologies }) => technologies.length <= 4)).toBe(true);
    expect(projects[0]).not.toHaveProperty("caseStudy");
  });

  it("returns controlled detail and published-slug results", async () => {
    expect(await selectors.getProjectBySlug("unknown")).toBeNull();
    expect((await selectors.getProjectBySlug("smart-lockers-platform"))?.slug).toBe(
      "smart-lockers-platform",
    );
    expect(await selectors.getPublishedCaseStudySlugs()).toEqual([]);
  });

  it("keeps the Observatory isolated to V2 while Phase D publishes work routes", () => {
    const root = process.cwd();
    const variants = fs.readFileSync(
      path.join(root, "src", "lib", "portfolio", "portfolio-variant.ts"),
      "utf8",
    );
    const page = fs.readFileSync(
      path.join(root, "src", "components", "portfolio", "portfolio-page.tsx"),
      "utf8",
    );
    expect(variants).toMatch(/current:[\s\S]*showSystemsExhibition:\s*false/);
    expect(variants).toMatch(/v2:[\s\S]*showSystemsExhibition:\s*true/);
    expect(page).toMatch(/SystemsObservatorySection/);
    expect(fs.existsSync(path.join(root, "src", "app", "v2", "work"))).toBe(true);
  });
});
