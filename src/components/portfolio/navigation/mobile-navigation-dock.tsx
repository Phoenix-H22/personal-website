"use client";

import styles from "@/styles/portfolio/portfolio-navigation.module.scss";

import {
  CONTACT_ACTION,
  DOCK_SECTION_IDS,
  sectionById,
  type PortfolioSectionId,
} from "./navigation-data";
import { NavIcon } from "./navigation-icons";

interface MobileNavigationDockProps {
  activeId: PortfolioSectionId | null;
  onNavigate?: (id: PortfolioSectionId) => void;
}

const DOCK_SECTIONS = DOCK_SECTION_IDS.map((id) => sectionById(id));

/**
 * Mobile bottom dock: Education · Experience · Systems + the Contact CTA.
 * Replaces the desktop Control Deck below 768px (Home stays the top identity
 * chip). Icon + text label per item — never icon-only.
 */
export function MobileNavigationDock({
  activeId,
  onNavigate,
}: MobileNavigationDockProps) {
  return (
    <nav className={styles.dock} aria-label="Primary" data-mobile-dock>
      <ul className={styles.dockList}>
        {DOCK_SECTIONS.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id} className={styles.dockItem}>
              <a
                className={styles.dockLink}
                href={section.href}
                aria-current={active ? "location" : undefined}
                data-active={active || undefined}
                onClick={() => onNavigate?.(section.id)}
              >
                {section.icon ? (
                  <NavIcon name={section.icon} className={styles.dockIcon} />
                ) : null}
                <span className={styles.dockLabel}>{section.shortLabel}</span>
              </a>
            </li>
          );
        })}
        <li className={styles.dockItem}>
          <a
            className={`${styles.dockLink} ${styles.dockContact}`}
            href={sectionById("contact").href}
            aria-current={activeId === "contact" ? "location" : undefined}
            data-active={activeId === "contact" || undefined}
            onClick={() => onNavigate?.("contact")}
          >
            <NavIcon name={CONTACT_ACTION.icon} className={styles.dockIcon} />
            <span className={styles.dockLabel}>{CONTACT_ACTION.label}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
