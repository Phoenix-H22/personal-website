import fs from "node:fs";
import path from "node:path";

import { beforeAll, describe, expect, it, vi } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { CASE_STUDY_PRESENTATION, CASE_STUDY_SLUGS } from "@/lib/portfolio/case-studies";
import { CANONICAL_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";
import { allProjectPaths } from "@/lib/portfolio/projects/project-routes";

vi.mock("server-only", () => ({}));

let selectors: typeof import("@/lib/portfolio/projects/selectors");

beforeAll(async () => {
  selectors = await import("@/lib/portfolio/projects/selectors");
});

describe("Phase D public work routes", () => {
  it("publishes every canonical project through a shared /projects/[slug] route", () => {
    const workDirectory = path.join(process.cwd(), "src", "app", "projects");
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
    expect(routeDirectories).toEqual(["[[...slug]]"]);
    expect(fs.existsSync(path.join(workDirectory, "[[...slug]]", "page.tsx"))).toBe(
      true,
    );
    expect(fs.existsSync(path.join(workDirectory, "page.tsx"))).toBe(false);
    expect(fs.existsSync(path.join(workDirectory, "@modal"))).toBe(false);
    const layout = fs.readFileSync(path.join(workDirectory, "layout.tsx"), "utf8");
    const projectsPage = fs.readFileSync(
      path.join(workDirectory, "[[...slug]]", "page.tsx"),
      "utf8",
    );
    const orbit = fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "components",
        "portfolio",
        "projects-orbit",
        "projects-orbit.tsx",
      ),
      "utf8",
    );
    const orbitHook = fs.readFileSync(
      path.join(
        process.cwd(),
        "src",
        "components",
        "portfolio",
        "projects-orbit",
        "use-projects-orbit.ts",
      ),
      "utf8",
    );
    expect(layout).toContain("<ProjectsOrbit");
    expect(projectsPage).not.toContain("<ProjectsOrbit");
    expect(projectsPage).not.toContain("OrbitDossierRoute");
    expect(orbit).toContain("<OrbitDossier");
    expect(orbitHook).toContain("syncProjectsLocation");
    expect(orbitHook).not.toContain("useRouter");
    expect(projectsPage).not.toMatch(/<CaseStudyPage\b/);
    expect(projectsPage).not.toMatch(/<ProjectDossierPage\b/);
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "src",
          "components",
          "portfolio",
          "case-study",
          "case-study-page.tsx",
        ),
      ),
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(
          process.cwd(),
          "src",
          "components",
          "portfolio",
          "project-page",
          "project-dossier-page.tsx",
        ),
      ),
    ).toBe(true);
    expect(CANONICAL_PROJECT_SLUGS).toHaveLength(13);
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

  it("exposes the listing and every project slug to crawlers", () => {
    const paths = sitemap().map(({ url }) => new URL(url).pathname);
    expect(paths).toEqual(["/", "/v2", "/projects", ...allProjectPaths()]);
    expect(robots().rules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          userAgent: expect.arrayContaining(["WhatsApp", "facebookexternalhit"]),
          allow: "/",
        }),
        expect.objectContaining({
          userAgent: "*",
          allow: "/",
          disallow: ["/design-system"],
        }),
      ]),
    );
    const proxy = fs.readFileSync(path.join(process.cwd(), "src", "proxy.ts"), "utf8");
    expect(proxy).toContain('matcher: ["/", "/v2", "/projects", "/projects/:path*"]');
  });
});
