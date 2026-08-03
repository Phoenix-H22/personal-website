import { describe, expect, it } from "vitest";

import {
  CANONICAL_PROJECT_SLUGS,
  CANONICAL_PROJECT_TITLES,
  FEATURED_PROJECT_SLUGS,
  LISTING_PROJECT_SLUGS,
  validateCanonicalProjectSelection,
} from "@/lib/portfolio/projects/canonical-projects";

const validSelection = CANONICAL_PROJECT_TITLES.map((title) => ({
  title,
  needsImages: false,
  needsMyAnswer: false,
}));

describe("canonical portfolio projects", () => {
  it("defines the exact 13-title and slug allowlists", () => {
    expect(CANONICAL_PROJECT_TITLES).toHaveLength(13);
    expect(CANONICAL_PROJECT_SLUGS).toHaveLength(13);
    expect(new Set(CANONICAL_PROJECT_TITLES).size).toBe(13);
    expect(new Set(CANONICAL_PROJECT_SLUGS).size).toBe(13);
    expect(CANONICAL_PROJECT_TITLES.some((title) => /backup/i.test(title))).toBe(false);
  });

  it("locks the approved featured and listing order", () => {
    expect(FEATURED_PROJECT_SLUGS).toEqual([
      "smart-lockers-platform",
      "warqah-store",
      "your-obour-guide",
      "autopay-eg",
      "nabd",
      "wasfaty-smart-vending",
      "alzahaby-loyalty-app",
    ]);
    expect(LISTING_PROJECT_SLUGS).toEqual([
      ...FEATURED_PROJECT_SLUGS,
      "riders-shopify-wordpress",
      "sim-express",
      "tawfir",
      "pdf-extractor",
      "pinoyaid",
      "chocolate-smart-vending",
    ]);
  });

  it("accepts only complete, ready canonical selections", () => {
    expect(validateCanonicalProjectSelection(validSelection)).toEqual(validSelection);
  });

  it.each([
    ["missing project", validSelection.slice(1)],
    ["duplicate title", [...validSelection.slice(0, 12), validSelection[0]]],
    [
      "backup title",
      [
        ...validSelection.slice(0, 12),
        { ...validSelection[12], title: "Wasfaty Smart Vending - Backup" },
      ],
    ],
    [
      "images required",
      validSelection.map((record, index) =>
        index === 0 ? { ...record, needsImages: true } : record,
      ),
    ],
    [
      "owner answer required",
      validSelection.map((record, index) =>
        index === 0 ? { ...record, needsMyAnswer: true } : record,
      ),
    ],
  ])("rejects %s", (_label, records) => {
    expect(() => validateCanonicalProjectSelection(records)).toThrow();
  });
});
