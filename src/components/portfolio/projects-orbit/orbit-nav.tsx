"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

import {
  CONTACT_ACTION,
  DECK_LINK_IDS,
  DOCK_SECTION_IDS,
  IDENTITY,
  sectionById,
} from "@/components/portfolio/navigation/navigation-data";
import { NavIcon } from "@/components/portfolio/navigation/navigation-icons";
import navStyles from "@/styles/portfolio/portfolio-navigation.module.scss";

/**
 * Projects-page navigation: the home page's Control Deck + mobile dock, reused
 * verbatim (same styles, labels, and icons from `navigation-data`) but with
 * section links resolved against `/` so they work from this sub-route. The
 * shared deck itself can't be reused directly — its anchors are same-page
 * hashes that don't exist here — so this renders the same markup with absolute
 * hrefs. "Projects" is the active section, since this page is that section.
 *
 * All destinations use next/link so leaving /projects stays client-side SPA
 * navigation (plain <a href="/"> would hard-reload the document).
 */

const HOME = "/";
const ACTIVE_ID = "systems";

const DECK_LINKS = DECK_LINK_IDS.map((id) => sectionById(id));
const DOCK_LINKS = DOCK_SECTION_IDS.map((id) => sectionById(id));
const CONTACT_HREF = `${HOME}${sectionById("contact").href.replace(/^\//, "")}`;
const IDENTITY_SUBTITLE = (IDENTITY as { subtitle?: string }).subtitle;

/** Turn a home-page anchor (e.g. "#work") into a cross-page link ("/#work"). */
function homeLink(href: string): string {
  if (href.startsWith("#")) return `${HOME}${href}`;
  if (href.startsWith("/")) return href;
  return `${HOME}${href}`;
}

export function OrbitNav() {
  const activeIndex = DECK_LINKS.findIndex((link) => link.id === ACTIVE_ID);
  const trackStyle = {
    "--deck-count": DECK_LINKS.length,
    "--deck-active": activeIndex < 0 ? 0 : activeIndex,
  } as CSSProperties;

  return (
    <header className={navStyles.root} data-portfolio-navigation>
      <div className={navStyles.deck} data-control-deck data-active-section={ACTIVE_ID}>
        <Link className={navStyles.brand} href={HOME} aria-label={IDENTITY.ariaLabel}>
          <span className={navStyles.brandDot} aria-hidden="true" />
          <span className={navStyles.brandIdentity}>
            <span className={navStyles.brandWordmark}>
              {IDENTITY.wordmark}
              <span className={navStyles.brandAccent}>{IDENTITY.accent}</span>
            </span>
            {IDENTITY_SUBTITLE ? (
              <span className={navStyles.brandSubtitle}>{IDENTITY_SUBTITLE}</span>
            ) : null}
          </span>
        </Link>

        <nav className={navStyles.deckNav} aria-label="Primary">
          <div className={navStyles.deckNavTrack} style={trackStyle} data-has-active>
            {DECK_LINKS.map((link) => {
              const active = link.id === ACTIVE_ID;
              return (
                <Link
                  key={link.id}
                  className={navStyles.deckLink}
                  href={homeLink(link.href)}
                  aria-current={active ? "location" : undefined}
                  data-active={active || undefined}
                >
                  {link.icon ? (
                    <NavIcon name={link.icon} className={navStyles.deckLinkIcon} />
                  ) : null}
                  <span className={navStyles.deckLinkLabel}>{link.label}</span>
                </Link>
              );
            })}
            <span className={navStyles.deckRoute} aria-hidden="true" />
            <span className={navStyles.deckIndicator} aria-hidden="true" />
          </div>
        </nav>

        <Link className={navStyles.contact} href={CONTACT_HREF}>
          <NavIcon name={CONTACT_ACTION.icon} className={navStyles.contactIcon} />
          <span>{CONTACT_ACTION.label}</span>
        </Link>
      </div>

      <nav className={navStyles.dock} aria-label="Primary" data-mobile-dock>
        <ul className={navStyles.dockList}>
          {DOCK_LINKS.map((section) => {
            const active = section.id === ACTIVE_ID;
            return (
              <li key={section.id} className={navStyles.dockItem}>
                <Link
                  className={navStyles.dockLink}
                  href={homeLink(section.href)}
                  aria-current={active ? "location" : undefined}
                  data-active={active || undefined}
                >
                  {section.icon ? (
                    <NavIcon name={section.icon} className={navStyles.dockIcon} />
                  ) : null}
                  <span className={navStyles.dockLabel}>{section.shortLabel}</span>
                </Link>
              </li>
            );
          })}
          <li className={navStyles.dockItem}>
            <Link
              className={`${navStyles.dockLink} ${navStyles.dockContact}`}
              href={CONTACT_HREF}
            >
              <NavIcon name={CONTACT_ACTION.icon} className={navStyles.dockIcon} />
              <span className={navStyles.dockLabel}>{CONTACT_ACTION.label}</span>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
