/**
 * Typed portfolio version configuration.
 *
 * Technical debt: section implementations still live under
 * `components/concept-v3-rebuild` and `styles/concept-v3-rebuild`.
 */

export type PortfolioVariant = "current" | "v2";

export type HeroCompositionVariant =
  | "full-proof-constellation"
  | "simplified";

export interface PortfolioHeroCopyOverride {
  eyebrow: string;
  summary: string;
  /** Core technology line — V2 only. */
  technologyLine: string[];
}

export interface PortfolioVariantConfig {
  id: PortfolioVariant;
  route: "/" | "/v2";
  title: string;
  indexable: boolean;
  canonical: "/" | "/v2";
  hero: {
    variant: HeroCompositionVariant;
    showEducationArtifact: boolean;
    showProductDeck: boolean;
    showEducationCredential: boolean;
    showSelectedSystemsSignal: boolean;
    showTechnologyLine: boolean;
    /** When set, replaces shared proof-engine eyebrow/summary on this variant only. */
    copy?: PortfolioHeroCopyOverride;
  };
  sections: {
    showOrigin: boolean;
    showCareer: boolean;
    showSelectedSystems: boolean;
    showSystemsExhibition: boolean;
    showOwnership: boolean;
    showContact: boolean;
  };
}

export const portfolioVariants: Record<
  PortfolioVariant,
  PortfolioVariantConfig
> = {
  current: {
    id: "current",
    route: "/",
    title: "Abdalrhman M. Alkady — Software Engineer",
    indexable: true,
    canonical: "/",
    hero: {
      variant: "full-proof-constellation",
      showEducationArtifact: true,
      showProductDeck: true,
      showEducationCredential: false,
      showSelectedSystemsSignal: false,
      showTechnologyLine: false,
    },
    sections: {
      showOrigin: true,
      showCareer: true,
      showSelectedSystems: false,
      showSystemsExhibition: false,
      showOwnership: false,
      showContact: false,
    },
  },
  v2: {
    id: "v2",
    route: "/v2",
    title: "Abdalrhman M. Alkady | Software Engineer",
    indexable: true,
    canonical: "/v2",
    hero: {
      variant: "simplified",
      showEducationArtifact: false,
      showProductDeck: false,
      showEducationCredential: true,
      showSelectedSystemsSignal: true,
      showTechnologyLine: true,
      copy: {
        eyebrow: "SOFTWARE ENGINEER",
        summary:
          "Software Engineer with a strong backend foundation — building production web systems across SaaS, commerce, payments, and integrations.",
        technologyLine: [
          "PHP",
          "Laravel",
          "Node.js",
          "React",
          "MySQL",
          "Redis",
        ],
      },
    },
    sections: {
      showOrigin: true,
      showCareer: true,
      showSelectedSystems: false,
      showSystemsExhibition: true,
      showOwnership: true,
      showContact: true,
    },
  },
};

export function getPortfolioVariant(
  id: PortfolioVariant,
): PortfolioVariantConfig {
  return portfolioVariants[id];
}

export function isPortfolioVersionSwitchEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_PORTFOLIO_VERSION_SWITCH === "true";
}
