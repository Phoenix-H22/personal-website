import fs from "node:fs";
import path from "node:path";

import { beforeAll, describe, expect, it, vi } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { CASE_STUDY_PRESENTATION, CASE_STUDY_SLUGS } from "@/lib/portfolio/case-studies";

vi.mock("server-only", () => ({}));

let selectors: typeof import("@/lib/portfolio/projects/selectors");

beforeAll(async () => {
  selectors = await import("@/lib/portfolio/projects/selectors");
});

describe("Phase D public work routes", () => {
  it("publishes exactly the three approved case-study routes", () => {
    const workDirectory = path.join(process.cwd(), "src", "app", "v2", "work");
    const routeDirectories = fs
      .readdirSync(workDirectory, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map(({ name }) => name)
      .sort();

    expect(CASE_STUDY_SLUGS).toEqual([
      "smart-lockers-platform",
      "warqah-store",
      "autopay-eg",
    ]);
    expect(routeDirectories).toEqual([...CASE_STUDY_SLUGS].sort());
    expect(
      CASE_STUDY_SLUGS.every((slug) =>
        fs.existsSync(path.join(workDirectory, slug, "page.tsx")),
      ),
    ).toBe(true);
  });

  it("backs every case study with canonical project data and explicit framing", async () => {
    const projects = await Promise.all(
      CASE_STUDY_SLUGS.map((slug) => selectors.getProjectBySlug(slug)),
    );

    expect(projects.map((project) => project?.slug)).toEqual(CASE_STUDY_SLUGS);
    expect(projects.every((project) => project?.architectureDiagram)).toBe(true);
    expect(projects.every((project) => project && project.verifiedMetrics.length > 0)).toBe(
      true,
    );
    expect(Object.keys(CASE_STUDY_PRESENTATION).sort()).toEqual(
      [...CASE_STUDY_SLUGS].sort(),
    );
  });

  it("exposes all public portfolio routes to crawlers", () => {
    const paths = sitemap().map(({ url }) => new URL(url).pathname);
    expect(paths).toEqual([
      "/",
      "/v2",
      "/v2/work",
      ...CASE_STUDY_SLUGS.map((slug) => `/v2/work/${slug}`),
    ]);
    expect(robots().rules).toEqual({
      allow: "/",
      disallow: ["/design-system"],
      userAgent: "*",
    });
  });
});
