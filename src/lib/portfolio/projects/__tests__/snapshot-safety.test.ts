import { describe, expect, it } from "vitest";

import { CANONICAL_PROJECT_SLUGS, isCanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";
import editorial from "@/lib/portfolio/projects/data/public-projects.editorial.json";
import snapshot from "@/lib/portfolio/projects/data/public-projects.snapshot.json";
import { PUBLIC_PROJECT_ROLE_BY_SLUG } from "@/lib/portfolio/projects/public-roles";
import { publicProjectsSnapshotSchema } from "@/lib/portfolio/projects/schema";

const forbidden = [
  /[a-z]:[\\/](?![\\/])/i,
  /\.portfolio-private/i,
  /(?:notion\.so|notion\.com)/i,
  /x-amz-/i,
  /local\s+dir/i,
  /missing\s+details/i,
  /needs\s+my\s+answer/i,
  /internal\s+project\s+inventory/i,
  /notionPageId/i,
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
  /\b[0-9a-f]{32}\b/i,
  /https?:\/\/(?:www\.)?github\.com\//i,
  /source-pack/i,
  /\b(?:candidate|rejected)[-_ ]media\b/i,
  /cover-approved-original\.png/i,
  /notion[_ -]?(?:token|api[_ -]?key)/i,
  /(?:api|client|access)[_ -]?(?:secret|token)/i,
];

const editorialProjectFields = [
  "caseStudyAvailability",
  "featured",
  "featuredOrder",
  "listingOrder",
  "ownershipTypeOverride",
  "secondaryCategory",
  "slug",
  "strongestCapability",
  "systemType",
  "technologies",
  "verifiedMetrics",
].sort();

describe("public project snapshot", () => {
  it("passes the strict Zod schema", () => {
    expect(publicProjectsSnapshotSchema.parse(snapshot).projects).toHaveLength(13);
  });

  it("rejects mismatched canonical title and slug pairs", () => {
    const candidate = structuredClone(snapshot);
    const firstTitle = candidate.projects[0].title;
    candidate.projects[0].title = candidate.projects[1].title;
    candidate.projects[1].title = firstTitle;

    expect(publicProjectsSnapshotSchema.safeParse(candidate).success).toBe(false);
  });

  it("contains no private or internal content markers", () => {
    const serialized = JSON.stringify(snapshot);
    for (const pattern of forbidden) expect(serialized).not.toMatch(pattern);
  });

  it("contains no private repositories or empty required public fields", () => {
    for (const project of snapshot.projects) {
      expect(project.links.publicGitHub).toBeNull();
      expect(project.id).toBeTruthy();
      expect(project.shortTagline.trim()).not.toBe("");
      expect(project.publicSummary.trim()).not.toBe("");
      expect(project.role.trim()).not.toBe("");
      expect(project.technologies.length).toBeGreaterThan(0);
      expect(project.capabilities.length).toBeGreaterThan(0);
    }
  });
});

describe("public project editorial input", () => {
  it("contains only exact canonical records and allowlisted fields", () => {
    expect(editorial.schemaVersion).toBe(1);
    expect(editorial.projects.map(({ slug }) => slug).sort()).toEqual(
      [...CANONICAL_PROJECT_SLUGS].sort(),
    );
    for (const project of editorial.projects) {
      expect(Object.keys(project).sort()).toEqual(editorialProjectFields);
    }
  });

  it("contains no private or internal content markers", () => {
    const serialized = JSON.stringify(editorial);
    for (const pattern of forbidden) expect(serialized).not.toMatch(pattern);
  });
});

describe("public project role boundaries", () => {
  it.each(["Built Entirely by Me", "Founder Built", "Technical Owner", "Platform Architect"])(
    "rejects seniority or ownership-only role %s",
    (role) => {
      const candidate = structuredClone(snapshot);
      candidate.projects[0].role = role;
      expect(publicProjectsSnapshotSchema.safeParse(candidate).success).toBe(false);
    },
  );

  it("keeps every public project role scoped to the actual work", () => {
    for (const project of snapshot.projects) {
      expect(isCanonicalProjectSlug(project.slug)).toBe(true);
      if (!isCanonicalProjectSlug(project.slug)) continue;
      expect(project.role).toBe(PUBLIC_PROJECT_ROLE_BY_SLUG[project.slug]);
    }
    expect(
      snapshot.projects.find(({ slug }) => slug === "warqah-store")?.role,
    ).toBe("Backend & DevOps Engineer");
    expect(
      snapshot.projects.find(({ slug }) => slug === "alzahaby-loyalty-app")?.role,
    ).toBe("Flutter Software Engineer");
  });
});
