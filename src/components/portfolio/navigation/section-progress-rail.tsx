"use client";

import type { CSSProperties } from "react";

import styles from "@/styles/portfolio/portfolio-navigation.module.scss";

import { RAIL_SECTION_IDS, sectionById, type PortfolioSectionId } from "./navigation-data";

interface SectionProgressRailProps {
  activeId: PortfolioSectionId | null;
  visible: boolean;
  onNavigate?: (id: PortfolioSectionId) => void;
}

const RAIL_SECTIONS = RAIL_SECTION_IDS.map((id) => sectionById(id));

/**
 * Desktop-only section-progress rail. A compact position indicator (not a second
 * menu) that appears once the user has left the Hero. Section names are always in
 * the DOM (accessible name) and revealed visually on hover/focus.
 */
export function SectionProgressRail({
  activeId,
  visible,
  onNavigate,
}: SectionProgressRailProps) {
  const activeIndex = RAIL_SECTIONS.findIndex((section) => section.id === activeId);
  const progress =
    activeIndex < 0 ? 0 : activeIndex / Math.max(1, RAIL_SECTIONS.length - 1);

  const style = { "--rail-progress": progress } as CSSProperties;

  return (
    <nav
      className={styles.rail}
      aria-label="Section progress"
      data-section-rail
      data-visible={visible || undefined}
      aria-hidden={visible ? undefined : true}
      inert={visible ? undefined : true}
      style={style}
    >
      <ol className={styles.railList}>
        {RAIL_SECTIONS.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id} className={styles.railItem}>
              <a
                className={styles.railNode}
                href={section.href}
                aria-current={active ? "location" : undefined}
                data-active={active || undefined}
                onClick={() => onNavigate?.(section.id)}
              >
                <span className={styles.railLabel}>{section.label}</span>
                <span className={styles.railDot} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
