"use client";

import type { CSSProperties } from "react";

import styles from "@/styles/portfolio/portfolio-navigation.module.scss";

import {
  CONTACT_ACTION,
  DECK_LINK_IDS,
  IDENTITY,
  sectionById,
  type PortfolioSectionId,
} from "./navigation-data";
import { NavIcon } from "./navigation-icons";

interface PortfolioControlDeckProps {
  activeId: PortfolioSectionId | null;
  hasLeftHero: boolean;
  onNavigate?: (id: PortfolioSectionId) => void;
}

const DECK_LINKS = DECK_LINK_IDS.map((id) => sectionById(id));

// Optional role kicker — rendered only when present in the identity data.
const IDENTITY_SUBTITLE = (IDENTITY as { subtitle?: string }).subtitle;

/**
 * Floating desktop/tablet Control Deck — the "Signal Command Deck":
 * [ ALKADY. identity | Education · Experience · Systems + signal route | Contact ].
 * Presentational — active state is supplied by the navigation root.
 */
export function PortfolioControlDeck({
  activeId,
  hasLeftHero,
  onNavigate,
}: PortfolioControlDeckProps) {
  const activeLinkIndex = DECK_LINKS.findIndex((link) => link.id === activeId);

  const trackStyle = {
    "--deck-count": DECK_LINKS.length,
    "--deck-active": activeLinkIndex < 0 ? 0 : activeLinkIndex,
  } as CSSProperties;

  return (
    <div
      className={styles.deck}
      data-control-deck
      data-active-section={activeId ?? "none"}
      data-compact={hasLeftHero || undefined}
    >
      <a
        className={styles.brand}
        href={sectionById("home").href}
        aria-label={IDENTITY.ariaLabel}
        aria-current={activeId === "home" ? "page" : undefined}
        onClick={(event) => {
          // In-page home: hash scroll only — never navigate to `/` (that remounts the SPA).
          event.preventDefault();
          const target = document.getElementById("main-content");
          if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (window.location.hash) {
            window.history.replaceState(null, "", window.location.pathname);
          }
          onNavigate?.("home");
        }}
      >
        <span className={styles.brandDot} aria-hidden="true" />
        <span className={styles.brandIdentity}>
          <span className={styles.brandWordmark}>
            {IDENTITY.wordmark}
            <span className={styles.brandAccent}>{IDENTITY.accent}</span>
          </span>
          {IDENTITY_SUBTITLE ? (
            <span className={styles.brandSubtitle}>{IDENTITY_SUBTITLE}</span>
          ) : null}
        </span>
      </a>

      <nav className={styles.deckNav} aria-label="Primary">
        <div
          className={styles.deckNavTrack}
          style={trackStyle}
          data-has-active={activeLinkIndex >= 0 || undefined}
        >
          {DECK_LINKS.map((link) => (
            <a
              key={link.id}
              className={styles.deckLink}
              href={link.href}
              aria-current={activeId === link.id ? "location" : undefined}
              data-active={activeId === link.id || undefined}
              onClick={() => onNavigate?.(link.id)}
            >
              {link.icon ? (
                <NavIcon name={link.icon} className={styles.deckLinkIcon} />
              ) : null}
              <span className={styles.deckLinkLabel}>{link.label}</span>
            </a>
          ))}
          <span className={styles.deckRoute} aria-hidden="true" />
          <span className={styles.deckIndicator} aria-hidden="true" />
        </div>
      </nav>

      <a
        className={styles.contact}
        href={sectionById("contact").href}
        aria-current={activeId === "contact" ? "location" : undefined}
        data-active={activeId === "contact" || undefined}
        onClick={() => onNavigate?.("contact")}
      >
        <NavIcon name={CONTACT_ACTION.icon} className={styles.contactIcon} />
        <span>{CONTACT_ACTION.label}</span>
      </a>
    </div>
  );
}
