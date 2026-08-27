import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  buildProjectPageMetadata,
  getProjectJsonLd,
  getProjectsIndexJsonLd,
  getProjectsIndexMetadata,
} from "@/lib/metadata/projects";
import { CANONICAL_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";
import { projectPath } from "@/lib/portfolio/projects/project-routes";

vi.mock("server-only", () => ({}));

let getProjectBySlug: typeof import("@/lib/portfolio/projects").getProjectBySlug;

beforeAll(async () => {
  ({ getProjectBySlug } = await import("@/lib/portfolio/projects"));
});

describe("project SEO metadata", () => {
  it("indexes the projects listing with a canonical /projects URL and social tags", () => {
    const metadata = getProjectsIndexMetadata();
    expect(metadata.alternates?.canonical).toBe("/projects");
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    expect(metadata.openGraph).toMatchObject({
      type: "website",
      url: "/projects",
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });
    expect(String(metadata.description).length).toBeGreaterThan(40);
  });

  it("gives every public project a unique indexable /projects/[slug] document", async () => {
    const siteUrl = new URL("https://www.alkady.dev");

    for (const slug of CANONICAL_PROJECT_SLUGS) {
      const project = await getProjectBySlug(slug);
      expect(project, slug).not.toBeNull();
      if (!project) continue;

      const metadata = buildProjectPageMetadata(project);
      const canonical = projectPath(slug);

      expect(metadata.title).toEqual(expect.stringContaining(project.title));
      expect(String(metadata.description).length).toBeGreaterThan(40);
      expect(metadata.alternates?.canonical).toBe(canonical);
      expect(metadata.robots).toMatchObject({ index: true, follow: true });
      expect(metadata.openGraph).toMatchObject({
        type: "article",
        url: canonical,
      });
      expect(metadata.openGraph?.images).toEqual(
        expect.arrayContaining([expect.objectContaining({ url: project.cover.src })]),
      );
      expect(metadata.twitter).toMatchObject({ card: "summary_large_image" });

      const json = JSON.stringify(getProjectJsonLd(project, siteUrl));
      expect(json).toContain(`${siteUrl.origin}${canonical}`);
      expect(json).not.toContain(`#${slug}`);
    }
  });

  it("lists every orbit system as a shareable project URL in the collection JSON-LD", () => {
    const json = JSON.stringify(getProjectsIndexJsonLd(new URL("https://www.alkady.dev")));

    expect(json).toContain("ItemList");
    expect(json).toContain("https://www.alkady.dev/projects");
    expect(json).not.toContain("/projects#nabd");
    expect(json).not.toContain("/projects#warqah-store");

    for (const slug of CANONICAL_PROJECT_SLUGS) {
      expect(json).toContain(`https://www.alkady.dev/projects/${slug}`);
    }
  });
});
