/**
 * Typed portfolio version configuration.
 *
 * Both variants currently render the approved full-proof baseline.
 * Future S2+ stages update the `v2` config only — never fork the page tree.
 *
 * Technical debt: section implementations still live under
 * `components/concept-v3-rebuild` and `styles/concept-v3-rebuild`.
 * Do not duplicate them for V2; rename later when maintainability requires it.
 */

export type PortfolioVariant = "current" | "v2";

export type HeroCompositionVariant =
  | "full-proof-constellation"
  | "simplified";

export interface PortfolioVariantConfig {
  id: PortfolioVariant;
  /** Public route for this variant. */
  route: "/" | "/v2";
  /** Document title segment (layout template appends the site name). */
  title: string;
  /** Whether search engines may index this route. */
  indexable: boolean;
  /** Canonical URL for SEO (V2 points at primary `/` while content is duplicated). */
  canonical: "/";
  hero: {
    variant: HeroCompositionVariant;
    showEducationArtifact: boolean;
    showProductDeck: boolean;
    showEducationCredential: boolean;
    showSelectedSystemsSignal: boolean;
  };
  sections: {
    showOrigin: boolean;
    showCareer: boolean;
    showSelectedSystems: boolean;
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
    title: "Abdalrhman Alkady — Backend-Focused Product Engineer",
    indexable: true,
    canonical: "/",
    hero: {
      variant: "full-proof-constellation",
      showEducationArtifact: true,
      showProductDeck: true,
      showEducationCredential: false,
      showSelectedSystemsSignal: false,
    },
    sections: {
      showOrigin: true,
      showCareer: true,
      showSelectedSystems: false,
      showOwnership: false,
      showContact: false,
    },
  },
  v2: {
    id: "v2",
    route: "/v2",
    title: "Portfolio V2 (preview)",
    indexable: false,
    canonical: "/",
    hero: {
      // Intentionally identical to current until S2-PRE / S2.
      variant: "full-proof-constellation",
      showEducationArtifact: true,
      showProductDeck: true,
      showEducationCredential: false,
      showSelectedSystemsSignal: false,
    },
    sections: {
      showOrigin: true,
      showCareer: true,
      showSelectedSystems: false,
      showOwnership: false,
      showContact: false,
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
