export const CANONICAL_PROJECT_TITLES = [
  "Smart Lockers Platform",
  "Riders Shopify & WordPress Integrations",
  "Alzahaby Loyalty App",
  "Autopay EG",
  "Warqah Store",
  "Your Obour Guide",
  "Chocolate Smart Vending",
  "NABD",
  "PDF Extractor",
  "PinoyAid",
  "SIM Express",
  "Tawfir",
  "Wasfaty Smart Vending",
] as const;

export const CANONICAL_PROJECT_SLUGS = [
  "smart-lockers-platform",
  "riders-shopify-wordpress",
  "alzahaby-loyalty-app",
  "autopay-eg",
  "warqah-store",
  "your-obour-guide",
  "chocolate-smart-vending",
  "nabd",
  "pdf-extractor",
  "pinoyaid",
  "sim-express",
  "tawfir",
  "wasfaty-smart-vending",
] as const;

export const CANONICAL_PROJECTS = CANONICAL_PROJECT_TITLES.map(
  (title, index) => ({ title, slug: CANONICAL_PROJECT_SLUGS[index] }),
);

export const FEATURED_PROJECT_SLUGS = [
  "smart-lockers-platform",
  "warqah-store",
  "your-obour-guide",
  "autopay-eg",
  "nabd",
  "wasfaty-smart-vending",
  "alzahaby-loyalty-app",
] as const;

export const LISTING_PROJECT_SLUGS = [
  ...FEATURED_PROJECT_SLUGS,
  "riders-shopify-wordpress",
  "sim-express",
  "tawfir",
  "pdf-extractor",
  "pinoyaid",
  "chocolate-smart-vending",
] as const;

export type CanonicalProjectTitle = (typeof CANONICAL_PROJECT_TITLES)[number];
export type CanonicalProjectSlug = (typeof CANONICAL_PROJECT_SLUGS)[number];

export function isCanonicalProjectSlug(
  value: string,
): value is CanonicalProjectSlug {
  return (CANONICAL_PROJECT_SLUGS as readonly string[]).includes(value);
}

export interface CanonicalProjectSelectionRecord {
  title: string;
  needsImages: boolean;
  needsMyAnswer: boolean;
}

export function validateCanonicalProjectSelection(
  records: CanonicalProjectSelectionRecord[],
): CanonicalProjectSelectionRecord[] {
  if (records.length !== CANONICAL_PROJECT_TITLES.length) {
    throw new Error(`Expected ${CANONICAL_PROJECT_TITLES.length} canonical projects`);
  }
  const seen = new Set<string>();
  for (const record of records) {
    if (!(CANONICAL_PROJECT_TITLES as readonly string[]).includes(record.title)) {
      throw new Error(`Unknown canonical project title: ${record.title}`);
    }
    if (seen.has(record.title)) {
      throw new Error(`Duplicate canonical project title: ${record.title}`);
    }
    if (record.needsImages) {
      throw new Error(`${record.title} still requires approved images`);
    }
    if (record.needsMyAnswer) {
      throw new Error(`${record.title} still requires an owner decision`);
    }
    seen.add(record.title);
  }
  const missing = CANONICAL_PROJECT_TITLES.filter((title) => !seen.has(title));
  if (missing.length) throw new Error(`Missing canonical projects: ${missing.join(", ")}`);
  return records;
}
