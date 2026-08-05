"use client";

import styles from "@/styles/portfolio/portfolio-navigation.module.scss";

import { MobileNavigationDock } from "./mobile-navigation-dock";
import { PortfolioControlDeck } from "./portfolio-control-deck";
import { SectionProgressRail } from "./section-progress-rail";
import { useActivePortfolioSection } from "./use-active-portfolio-section";

/**
 * Portfolio navigation system for `/v2`.
 *
 * Owns the single active-section state and distributes it to the floating
 * Control Deck (desktop/tablet), the desktop section-progress rail, and the
 * mobile bottom dock. Also renders a decorative top-atmosphere bridge that lets
 * the deck read as floating over the Hero's world (fades once the Hero is left).
 */
export function PortfolioNavigation() {
  const { activeId, hasLeftHero, atPageTop, handleNavigate } =
    useActivePortfolioSection();

  return (
    <header className={styles.root} data-portfolio-navigation>
      <span
        className={styles.heroBridge}
        data-hero-bridge
        data-visible={atPageTop ? true : undefined}
        aria-hidden="true"
      />
      <PortfolioControlDeck
        activeId={activeId}
        hasLeftHero={hasLeftHero}
        onNavigate={handleNavigate}
      />
      <SectionProgressRail
        activeId={activeId}
        visible={hasLeftHero}
        onNavigate={handleNavigate}
      />
      <MobileNavigationDock activeId={activeId} onNavigate={handleNavigate} />
    </header>
  );
}
