import { describe, expect, it } from "vitest";

import { merchantOperationsFixture } from "@/lib/portfolio/projects/fixtures/merchant-operations";
import { LocalProjectRepository } from "@/lib/portfolio/projects/local-repository";
import {
  isPubliclyListable,
  toPublicCaseStudy,
} from "@/lib/portfolio/projects/mappers";
import { projectCaseStudyDtoSchema } from "@/lib/portfolio/projects/schemas";

describe("projectCaseStudyDtoSchema", () => {
  it("accepts the merchant operations fixture", () => {
    const parsed = projectCaseStudyDtoSchema.parse(merchantOperationsFixture);
    expect(parsed.slug).toBe("merchant-operations-salla-automation");
  });

  it("rejects PENDING placeholders in summaries", () => {
    const result = projectCaseStudyDtoSchema.safeParse({
      ...merchantOperationsFixture,
      summary: "PENDING_CANONICAL_ENTRY",
    });
    expect(result.success).toBe(false);
  });

  it("rejects public metrics with unverified evidence", () => {
    const result = projectCaseStudyDtoSchema.safeParse({
      ...merchantOperationsFixture,
      metrics: [
        {
          id: "bad",
          value: "99%",
          label: "magic",
          evidenceStatus: "unverified",
          public: true,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects internal-only published public projects", () => {
    const result = projectCaseStudyDtoSchema.safeParse({
      ...merchantOperationsFixture,
      confidentiality: "internal-only",
      publicationStatus: "published",
      visibility: "public",
    });
    expect(result.success).toBe(false);
  });

  it("requires positive media dimensions", () => {
    const result = projectCaseStudyDtoSchema.safeParse({
      ...merchantOperationsFixture,
      cover: {
        id: "cover",
        type: "image",
        src: "/images/x.png",
        width: 0,
        height: 100,
        alt: "x",
      },
    });
    expect(result.success).toBe(false);
  });
});

describe("publication filtering", () => {
  it("strips private metrics and unpublished blocks", () => {
    const publicProject = toPublicCaseStudy(
      projectCaseStudyDtoSchema.parse(merchantOperationsFixture),
    );
    expect(publicProject.metrics.every((metric) => metric.public)).toBe(true);
    expect(
      publicProject.metrics.find((metric) => metric.id === "internal-debug"),
    ).toBeUndefined();
  });

  it("does not list draft projects", async () => {
    const draft = {
      ...merchantOperationsFixture,
      id: "draft-project",
      slug: "draft-project",
      publicationStatus: "draft" as const,
      homepageOrder: null,
      featured: false,
    };
    const repo = new LocalProjectRepository([
      merchantOperationsFixture,
      draft,
    ]);
    const slugs = await repo.getPublishedSlugs();
    expect(slugs).toEqual(["merchant-operations-salla-automation"]);
    expect(await repo.getProjectBySlug("draft-project")).toBeNull();
  });

  it("orders featured projects by homepageOrder", async () => {
    const second = {
      ...merchantOperationsFixture,
      id: "nabd-messaging-platform",
      slug: "nabd-messaging-platform",
      title: "NABD Messaging Platform",
      shortTitle: "NABD",
      homepageOrder: 2,
      workOrder: 2,
      company: undefined,
      visualTheme: {
        id: "nabd",
        primary: "blue" as const,
        motif: "message-routing" as const,
        coverType: "messaging-router" as const,
        homepageCategory: "messaging" as const,
      },
    };
    const repo = new LocalProjectRepository([
      second,
      merchantOperationsFixture,
    ]);
    const featured = await repo.getFeaturedProjects();
    expect(featured.map((item) => item.slug)).toEqual([
      "merchant-operations-salla-automation",
      "nabd-messaging-platform",
    ]);
  });

  it("enforces unique slugs in the fixture set used by the repo", () => {
    const parsed = [
      projectCaseStudyDtoSchema.parse(merchantOperationsFixture),
    ];
    const slugs = new Set(parsed.map((item) => item.slug));
    expect(slugs.size).toBe(parsed.length);
  });

  it("marks listable published projects correctly", () => {
    expect(isPubliclyListable(merchantOperationsFixture)).toBe(true);
  });
});
