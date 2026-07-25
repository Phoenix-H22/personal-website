import { describe, expect, it } from "vitest";

import { toFeaturedSystemCard } from "@/components/portfolio/selected-systems/selected-system-types";
import { featuredProjectFixtures } from "@/lib/portfolio/projects/fixtures";
import { LocalProjectRepository } from "@/lib/portfolio/projects/local-repository";
import {
  toProjectSummary,
  toPublicCaseStudy,
} from "@/lib/portfolio/projects/mappers";
import { projectCaseStudyDtoSchema } from "@/lib/portfolio/projects/schemas";
import { portfolioVariants } from "@/lib/portfolio/portfolio-variant";

describe("S2B featured systems + V2 hero copy", () => {
  it("keeps Current hero copy free of V2 overrides", () => {
    expect(portfolioVariants.current.hero.copy).toBeUndefined();
    expect(portfolioVariants.current.hero.showTechnologyLine).toBe(false);
    expect(portfolioVariants.current.sections.showSelectedSystems).toBe(false);
  });

  it("uses Software Engineer wording and core technology line on V2", () => {
    const copy = portfolioVariants.v2.hero.copy;
    expect(copy?.eyebrow).toMatch(/SOFTWARE ENGINEER/i);
    expect(copy?.eyebrow).not.toMatch(/PRODUCT ENGINEER/i);
    expect(copy?.summary).toMatch(/Backend-focused software engineer/i);
    expect(copy?.summary).not.toMatch(/product engineer/i);
    expect(copy?.technologyLine).toEqual([
      "PHP",
      "Laravel",
      "Python",
      "JavaScript",
      "React",
      "Next.js",
    ]);
  });

  it("maps homepage categories for all four projects", async () => {
    const repo = new LocalProjectRepository();
    const featured = await repo.getFeaturedProjects();
    const cards = featured.map(toFeaturedSystemCard);
    expect(cards.map((c) => c.homepageCategory)).toEqual([
      "commerce",
      "messaging",
      "iot",
      "ai-healthcare",
    ]);
    expect(cards.map((c) => c.coverType)).toEqual([
      "merchant-operations",
      "messaging-router",
      "vending-device-flow",
      "virtual-clinic-loop",
    ]);
  });

  it("keeps case-study href gated and public-safety strings absent", () => {
    const cards = featuredProjectFixtures.map((fixture) => {
      const dto = projectCaseStudyDtoSchema.parse(fixture);
      return toFeaturedSystemCard(toProjectSummary(toPublicCaseStudy(dto)));
    });
    const payload = JSON.stringify(cards);
    expect(payload.toLowerCase()).not.toMatch(/wasfaty/);
    expect(payload.toLowerCase()).not.toMatch(/theqah/);
    expect(cards.every((card) => card.caseStudyHref === null)).toBe(true);
    expect(cards[0]?.isFlagship).toBe(true);
  });
});
