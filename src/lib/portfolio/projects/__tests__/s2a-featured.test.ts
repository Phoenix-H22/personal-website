import { describe, expect, it } from "vitest";

import { toFeaturedSystemCard } from "@/components/portfolio/selected-systems/selected-system-types";
import { featuredProjectFixtures } from "@/lib/portfolio/projects/fixtures";
import { LocalProjectRepository } from "@/lib/portfolio/projects/local-repository";
import { projectCaseStudyDtoSchema } from "@/lib/portfolio/projects/schemas";
import { toProjectSummary, toPublicCaseStudy } from "@/lib/portfolio/projects/mappers";

describe("S2A featured project set", () => {
  it("returns exactly four approved featured projects in order", async () => {
    const repo = new LocalProjectRepository();
    const featured = await repo.getFeaturedProjects();
    expect(featured.map((p) => p.id)).toEqual([
      "merchant-operations-salla-automation",
      "nabd-messaging-platform",
      "smart-vending-medication-dispensing",
      "virtual-clinic-dr-robot",
    ]);
    expect(featured[0]?.homepageOrder).toBe(1);
  });

  it("keeps Flagship id stable", async () => {
    const repo = new LocalProjectRepository();
    const featured = await repo.getFeaturedProjects();
    expect(featured[0]?.id).toBe("merchant-operations-salla-automation");
    expect(featured[0]?.title).toBe("Merchant Operations Platform");
  });

  it("does not expose Wasfaty or Theqah in public featured payload", async () => {
    const repo = new LocalProjectRepository();
    const featured = await repo.getFeaturedProjects();
    const payload = JSON.stringify(featured);
    expect(payload.toLowerCase()).not.toMatch(/wasfaty/);
    expect(payload.toLowerCase()).not.toMatch(/theqah/);
  });

  it("does not associate Smart Vending with Theqah", async () => {
    const repo = new LocalProjectRepository();
    const vending = (await repo.getFeaturedProjects()).find(
      (p) => p.id === "smart-vending-medication-dispensing",
    );
    expect(vending?.company).toBeUndefined();
    expect(JSON.stringify(vending)).not.toMatch(/theqah/i);
    expect(JSON.stringify(vending)).not.toMatch(/smartvending\.jpg/i);
  });

  it("strips private links and keeps slugs unique", () => {
    const parsed = featuredProjectFixtures.map((fixture) =>
      projectCaseStudyDtoSchema.parse(fixture),
    );
    const slugs = parsed.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const project of parsed) {
      expect(project.links.every((link) => link.public)).toBe(true);
      expect(project.caseStudyAvailable).toBe(false);
    }
  });

  it("maps Selected Systems cards without confidential enums or case-study hrefs", () => {
    const cards = featuredProjectFixtures.map((fixture) => {
      const dto = projectCaseStudyDtoSchema.parse(fixture);
      return toFeaturedSystemCard(toProjectSummary(toPublicCaseStudy(dto)));
    });
    for (const card of cards) {
      expect(card.caseStudyHref).toBeNull();
      expect(JSON.stringify(card)).not.toMatch(/client-confidential/);
      expect(JSON.stringify(card)).not.toMatch(/internal-only/);
    }
    expect(cards[0]?.strongestProof?.label).not.toMatch(/merchants|monthly orders|SAR/i);
  });

  it("does not promote a random Flagship when Flagship is missing", async () => {
    const withoutFlagship = featuredProjectFixtures.filter(
      (fixture) => fixture.id !== "merchant-operations-salla-automation",
    );
    const repo = new LocalProjectRepository(withoutFlagship);
    const featured = await repo.getFeaturedProjects();
    expect(featured.find((p) => p.id === "merchant-operations-salla-automation")).toBeUndefined();
    expect(featured[0]?.id).not.toBe("merchant-operations-salla-automation");
  });
});
