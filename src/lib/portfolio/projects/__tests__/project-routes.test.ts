import { describe, expect, it } from "vitest";

import { CANONICAL_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";
import {
  allProjectPaths,
  PROJECTS_INDEX_PATH,
  projectSlugFromPathname,
} from "@/lib/portfolio/projects/project-routes";

describe("public project share URLs", () => {
  it("maps every canonical project to /projects/[slug], never a hash fragment", () => {
    expect(PROJECTS_INDEX_PATH).toBe("/projects");
    expect(allProjectPaths()).toEqual(
      CANONICAL_PROJECT_SLUGS.map((slug) => `/projects/${slug}`),
    );
    expect(allProjectPaths().some((path) => path.includes("#"))).toBe(false);
  });

  it("reads a canonical slug out of a project pathname and ignores everything else", () => {
    expect(projectSlugFromPathname("/projects/nabd")).toBe("nabd");
    expect(projectSlugFromPathname("/projects/warqah-store/")).toBe("warqah-store");
    expect(projectSlugFromPathname("/projects")).toBeNull();
    expect(projectSlugFromPathname("/projects/not-a-project")).toBeNull();
    expect(projectSlugFromPathname("/v2/work/nabd")).toBeNull();
  });
});
