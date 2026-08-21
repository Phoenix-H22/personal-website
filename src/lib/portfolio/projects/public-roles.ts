import type { CanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";

/**
 * Public-facing project roles. Mid-level and scope-accurate — never Founder,
 * Architect, Owner, Lead, Senior, Principal, or CTO as a title.
 */
export const PUBLIC_PROJECT_ROLE_BY_SLUG = {
  "warqah-store": "Backend & DevOps Engineer",
  "your-obour-guide": "Software Engineer — Laravel, Flutter, Next.js, and design",
  "autopay-eg": "Software Engineer — Laravel, Vue, Android, integrations, and design",
  nabd: "Software Engineer — Laravel, Node.js, WhatsApp, Telegram, and integrations",
  "alzahaby-loyalty-app": "Flutter Software Engineer",
  "smart-lockers-platform": "Backend Software Engineer",
  "wasfaty-smart-vending": "Backend Software Engineer",
  "riders-shopify-wordpress": "Software Engineer — Shopify and WooCommerce",
  "sim-express": "Backend Software Engineer",
  tawfir: "Backend Software Engineer",
  "pdf-extractor": "Software Engineer — Laravel and Vue",
  pinoyaid: "Backend Software Engineer",
  "chocolate-smart-vending": "Backend Software Engineer",
} as const satisfies Record<CanonicalProjectSlug, string>;

export type PublicProjectRole =
  (typeof PUBLIC_PROJECT_ROLE_BY_SLUG)[CanonicalProjectSlug];

export function publicProjectRole(slug: CanonicalProjectSlug): PublicProjectRole {
  return PUBLIC_PROJECT_ROLE_BY_SLUG[slug];
}

const FORBIDDEN_ROLE_PATTERN =
  /\b(founder|architect|owner|principal|cto|senior|lead)\b/i;

export function isForbiddenPublicRole(role: string): boolean {
  return FORBIDDEN_ROLE_PATTERN.test(role);
}
