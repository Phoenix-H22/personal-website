"use client";

import {
  CommerceScale,
  EducationJourney,
  UpworkCredential,
} from "@/components/concept-v3-rebuild/artifacts/rebuild-artifacts";
import { HeroMotion } from "@/components/concept-v3-rebuild/hero/hero-motion";
import { ProductDeck } from "@/components/concept-v3-rebuild/product-deck/product-deck";
import { toProductDeckItems } from "@/components/concept-v3-rebuild/product-deck/map-products";
import { useLayoutMode } from "@/components/concept-v3-rebuild/shared/layout-mode-provider";
import { EducationCredential } from "@/components/portfolio/hero/education-credential";
import { ExploreSelectedSystemsSignal } from "@/components/portfolio/hero/explore-selected-systems-signal";
import type { PortfolioVariantConfig } from "@/lib/portfolio/portfolio-variant";
import type { ProofEngineHeroContent } from "@/lib/proof-engine/types";
import styles from "@/styles/concept-v3-rebuild/hero.module.scss";

interface RebuildHeroProps {
  content: ProofEngineHeroContent;
  heroConfig: PortfolioVariantConfig["hero"];
}

function emphasizeHeadline(headline: string, emphasis?: string) {
  if (!emphasis || !headline.includes(emphasis)) {
    return headline;
  }
  const index = headline.lastIndexOf(emphasis);
  return (
    <>
      {headline.slice(0, index)}
      <span className={styles.headlineEmphasis}>{emphasis}</span>
      {headline.slice(index + emphasis.length)}
    </>
  );
}

export function RebuildHero({ content, heroConfig }: RebuildHeroProps) {
  const { mode } = useLayoutMode();
  const upwork = content.artifacts.find((a) => a.kind === "credential");
  const commerce = content.artifacts.find((a) => a.kind === "commerce-scale");
  const education = content.artifacts.find((a) => a.kind === "education-journey");
  const products = content.artifacts.filter((a) => a.kind === "product");
  const artifactMode = "narrative" as const;
  const simplified = heroConfig.variant === "simplified";
  const showEducation = heroConfig.showEducationArtifact && !!education;
  const showProducts = heroConfig.showProductDeck && products.length > 0;

  return (
    <HeroMotion layoutMode={mode} composition={heroConfig.variant}>
      <section
        id="proof-stage"
        className={styles.stage}
        aria-labelledby="rebuild-hero-name"
        data-hero-layout={mode}
        data-hero-composition={heroConfig.variant}
      >
        <div className={styles.atmosphere} aria-hidden="true" data-atmosphere>
          <div className={styles.atmosphereGlow} />
          <div className={`${styles.atmosphereLocal} ${styles.atmosphereLocalUpwork}`} />
          {showEducation ? (
            <div
              className={`${styles.atmosphereLocal} ${styles.atmosphereLocalEducation}`}
            />
          ) : null}
          <div
            className={`${styles.atmosphereLocal} ${styles.atmosphereLocalCommerce}`}
          />
          {showProducts ? (
            <div
              className={`${styles.atmosphereLocal} ${styles.atmosphereLocalProducts}`}
              data-atmosphere-products
            />
          ) : null}
          <div className={styles.atmosphereFloor} data-atmosphere-floor />
          <div className={styles.atmosphereRoutes} data-constellation aria-hidden="true">
            <svg className={styles.constellationSvg} viewBox="0 0 1000 600" preserveAspectRatio="none">
              <path
                data-constellation-path
                d="M500 360 C390 330, 260 300, 160 240"
                fill="none"
                stroke="rgba(49,230,208,0.16)"
                strokeWidth="1.2"
              />
              <path
                data-constellation-path
                d="M500 360 C610 330, 740 290, 840 230"
                fill="none"
                stroke="rgba(94,143,255,0.14)"
                strokeWidth="1.2"
              />
              {!simplified ? (
                <path
                  data-constellation-signal
                  d="M500 400 C620 430, 740 450, 840 470"
                  fill="none"
                  stroke="var(--hero-product-accent, #31e6d0)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  pathLength={1}
                />
              ) : null}
            </svg>
          </div>
          <div className={styles.atmosphereHaze} />
          <div className={styles.atmosphereRing} />
          <div className={styles.atmosphereGrain} />
          <div className={styles.atmosphereVignette} />
        </div>

        <div className={styles.composition}>
          <div className={styles.identity} data-slot="identity">
            <p className={styles.eyebrow} data-hero-eyebrow>
              {content.eyebrow}
            </p>
            <h1 id="rebuild-hero-name" className={styles.name} data-hero-name>
              {content.name}
            </h1>
            <p className={styles.headline} data-hero-headline>
              {emphasizeHeadline(content.headline, content.headlineEmphasis)}
            </p>
            <p className={styles.summary} data-hero-summary>
              {content.summary}
            </p>
            {heroConfig.showEducationCredential ? <EducationCredential /> : null}
            <div className={styles.actions} data-hero-actions>
              <a
                className={styles.actionPrimary}
                href={content.primaryAction.href}
                aria-label={
                  content.primaryAction.ariaLabel ?? content.primaryAction.label
                }
              >
                {content.primaryAction.label}
              </a>
              <a
                className={styles.actionSecondary}
                href={content.secondaryAction.href}
                aria-label={
                  content.secondaryAction.ariaLabel ??
                  content.secondaryAction.label
                }
                target={content.secondaryAction.isExternal ? "_blank" : undefined}
                rel={
                  content.secondaryAction.isExternal ? "noreferrer" : undefined
                }
              >
                {content.secondaryAction.label}
              </a>
            </div>
            <ul className={styles.socials} data-hero-socials>
              {content.socialActions.map((action) => (
                <li key={action.href}>
                  <a
                    className={styles.socialLink}
                    href={action.href}
                    data-tooltip={
                      action.label === "Email" ? "Email" : action.label
                    }
                    aria-label={
                      action.ariaLabel ??
                      (action.label === "Email"
                        ? "Send email"
                        : `Open ${action.label}`)
                    }
                    target={action.isExternal ? "_blank" : undefined}
                    rel={action.isExternal ? "noreferrer" : undefined}
                  >
                    <span className={styles.socialIcon} aria-hidden="true">
                      {action.label === "LinkedIn" ? (
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path
                            fill="currentColor"
                            d="M6.5 8.5H3.7V20h2.8V8.5zM5.1 4a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3zM20.3 20h-2.8v-5.6c0-1.5-.6-2.5-2-2.5-1.1 0-1.7.7-2 1.4-.1.3-.1.7-.1 1.1V20h-2.8s.05-10.3 0-11.5h2.8v1.8c.4-.7 1.3-1.8 3.3-1.8 2.4 0 4.1 1.5 4.1 4.9V20z"
                          />
                        </svg>
                      ) : action.label === "GitHub" ? (
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path
                            fill="currentColor"
                            d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c2-.1 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.8-4.6 5.1.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2z"
                          />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18">
                          <path
                            fill="currentColor"
                            d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
                          />
                        </svg>
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {heroConfig.showSelectedSystemsSignal ? (
              <ExploreSelectedSystemsSignal />
            ) : null}
          </div>

          {upwork && upwork.kind === "credential" ? (
            <div
              className={`${styles.slot} ${styles.slotUpwork}`}
              data-slot="upwork"
            >
              <UpworkCredential artifact={upwork} mode={artifactMode} />
            </div>
          ) : null}

          {commerce && commerce.kind === "commerce-scale" ? (
            <div
              className={`${styles.slot} ${styles.slotCommerce}`}
              data-slot="commerce"
            >
              <CommerceScale artifact={commerce} mode={artifactMode} />
            </div>
          ) : null}

          {showProducts ? (
            <div
              className={`${styles.slot} ${styles.slotProducts}`}
              data-slot="products"
            >
              <div className={styles.products}>
                <ProductDeck items={toProductDeckItems(products)} />
              </div>
            </div>
          ) : null}

          {showEducation && education && education.kind === "education-journey" ? (
            <div
              className={`${styles.slot} ${styles.slotEducation}`}
              data-slot="education"
            >
              <EducationJourney artifact={education} mode={artifactMode} />
            </div>
          ) : null}
        </div>
      </section>
    </HeroMotion>
  );
}
