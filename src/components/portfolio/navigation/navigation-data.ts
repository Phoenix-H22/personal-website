import { RECRUITER_PROFILE } from "@/lib/portfolio/recruiter-profile";

import type { NavIconName } from "./navigation-icons";

/**
 * Single source of truth for the portfolio navigation.
 *
 * The Control Deck (desktop/tablet top), the section-progress rail (desktop),
 * and the mobile bottom dock all derive their labels, hrefs, icons, and
 * active-state mapping from this file. Active-section detection observes
 * `observeId`.
 *
 * Anchors are verified against production source on `/v2`:
 *  - `#proof-stage`  the Hero section          (adaptive-engineer-hero.tsx)
 *  - `#experience`   Career chapter            (career-chapter.tsx)
 *  - `#education`    Origin / education chapter (origin-chapter.tsx)
 *  - `#work`         Systems Observatory        (systems-observatory-experience.tsx)
 *  - `#contact`      Recruiter contact section  (recruiter-completion-sections.tsx)
 *  - `#main-content` the <main> landmark / page top (portfolio-v2-page.tsx)
 */

export type PortfolioSectionId =
  | "home"
  | "education"
  | "experience"
  | "systems"
  | "contact";

export interface PortfolioSection {
  readonly id: PortfolioSectionId;
  readonly label: string;
  /** Short label used where horizontal space is tight (mobile dock). */
  readonly shortLabel: string;
  /** In-page anchor used as the scroll destination. */
  readonly href: string;
  /** Id of the element observed to derive active state. */
  readonly observeId: string;
  /** Icon for the primary navigation items (Home is the wordmark, so no icon). */
  readonly icon?: NavIconName;
}

/** Canonical navigable sections, in document/scroll order. */
export const PORTFOLIO_SECTIONS: readonly PortfolioSection[] = [
  {
    id: "home",
    label: "Home",
    shortLabel: "Home",
    href: "#main-content",
    observeId: "proof-stage",
  },
  {
    id: "experience",
    label: "Experience",
    shortLabel: "Experience",
    href: "#experience",
    observeId: "experience",
    icon: "experience",
  },
  {
    id: "education",
    label: "Education",
    shortLabel: "Education",
    href: "#education",
    observeId: "education",
    icon: "education",
  },
  {
    id: "systems",
    label: "Projects",
    shortLabel: "Projects",
    href: "#work",
    observeId: "work",
    icon: "systems",
  },
  {
    id: "contact",
    label: "Contact",
    shortLabel: "Contact",
    href: "#contact",
    observeId: "contact",
    icon: "contact",
  },
] as const;

/** Ordered ids observed for active-section state (single observer set). */
export const OBSERVED_SECTION_IDS: readonly PortfolioSectionId[] =
  PORTFOLIO_SECTIONS.map((section) => section.id);

/** Control Deck middle links: the three content sections. */
export const DECK_LINK_IDS = ["experience", "education", "systems"] as const;

/** Side-rail nodes: real post-Hero scroll destinations, in document order. */
export const RAIL_SECTION_IDS = [
  "experience",
  "education",
  "systems",
  "contact",
] as const;

/** Mobile dock section items. Home stays the top identity chip; Contact is the CTA. */
export const DOCK_SECTION_IDS = ["experience", "education", "systems"] as const;

/** Primary call to action. Sourced from the profile token for consistency. */
export const CONTACT_ACTION = {
  label: "Contact",
  href: `mailto:${RECRUITER_PROFILE.email}`,
  icon: "contact" as NavIconName,
} as const;

/** Identity module — a deliberate text wordmark (no monogram tile). */
export const IDENTITY = {
  wordmark: "ALKADY",
  /** Trailing accent that is part of the wordmark. */
  accent: ".",
  // subtitle: "BACKEND SYSTEMS ENGINEER",
  // Always the site root — never `/v2`, even when the visitor arrived there.
  homeHref: "/",
  ariaLabel: `${RECRUITER_PROFILE.name}, home`,
} as const;

const SECTION_BY_ID = new Map<PortfolioSectionId, PortfolioSection>(
  PORTFOLIO_SECTIONS.map((section) => [section.id, section]),
);

export function sectionById(id: PortfolioSectionId): PortfolioSection {
  const section = SECTION_BY_ID.get(id);
  if (!section) {
    throw new Error(`Unknown portfolio section id: ${id}`);
  }
  return section;
}
