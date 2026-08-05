"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { PORTFOLIO_SECTIONS, type PortfolioSectionId } from "./navigation-data";

/**
 * Single source of truth for active-section state, shared by the Control Deck,
 * the section-progress rail, and the mobile dock.
 *
 * Uses two IntersectionObservers with stable margins — no scroll listener and no
 * per-frame geometry work:
 *  - a thin activation band (~mid-viewport) resolves which section is active;
 *  - the Hero (#proof-stage) drives `hasLeftHero` for the compact deck + rail.
 *
 * Anchor clicks optimistically hand off active state and briefly suppress the
 * band observer so intermediate sections don't flicker during the scroll.
 */

const NAV_LOCK_MS = 700;

export interface ActivePortfolioSection {
  activeId: PortfolioSectionId | null;
  hasLeftHero: boolean;
  /** True only near the very top of the page (drives the atmosphere bridge). */
  atPageTop: boolean;
  handleNavigate: (id: PortfolioSectionId) => void;
}

export function useActivePortfolioSection(): ActivePortfolioSection {
  const [activeId, setActiveId] = useState<PortfolioSectionId | null>(null);
  const [hasLeftHero, setHasLeftHero] = useState(false);
  const [atPageTop, setAtPageTop] = useState(true);
  const navLockUntilRef = useRef(0);

  // Deep links / hash navigation are honoured implicitly: the browser scrolls to
  // the target and the band observer below reports it on its first callback.
  useEffect(() => {
    const idByElement = new Map<Element, PortfolioSectionId>();
    const visible = new Set<PortfolioSectionId>();
    const documentOrder = PORTFOLIO_SECTIONS.map((section) => section.id);

    const bandObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = idByElement.get(entry.target);
          if (!id) continue;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        if (Date.now() < navLockUntilRef.current) return;
        // Deepest section currently crossing the activation band wins; null in gaps.
        let next: PortfolioSectionId | null = null;
        for (const id of documentOrder) if (visible.has(id)) next = id;
        setActiveId(next);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    for (const section of PORTFOLIO_SECTIONS) {
      const element = document.getElementById(section.observeId);
      if (!element) continue;
      idByElement.set(element, section.id);
      bandObserver.observe(element);
    }

    const hero = document.getElementById("proof-stage");
    let heroObserver: IntersectionObserver | null = null;
    if (hero) {
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry) setHasLeftHero(!entry.isIntersecting);
        },
        { rootMargin: "-35% 0px 0px 0px", threshold: 0 },
      );
      heroObserver.observe(hero);
    }

    // Top sentinel: the atmosphere bridge only matches the Hero at scroll ~0 (it
    // is fixed while the Hero scrolls). Fade it out as soon as the page leaves the
    // very top so it never lingers as a lit band over lower content.
    const topSentinel = document.createElement("div");
    topSentinel.setAttribute("aria-hidden", "true");
    topSentinel.style.cssText =
      "position:absolute;top:0;left:0;width:1px;height:48px;margin:0;padding:0;pointer-events:none;opacity:0;";
    document.body.appendChild(topSentinel);
    const topObserver = new IntersectionObserver(
      ([entry]) => setAtPageTop(Boolean(entry?.isIntersecting)),
      { threshold: 0 },
    );
    topObserver.observe(topSentinel);

    // Bottom sentinel: robustly activates the final section (Contact) at page end,
    // even when it is short enough never to cross the mid-viewport band. Appended
    // in normal flow at document end so it does not depend on any section's
    // positioning context (sections are protected / SHA-locked).
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText =
      "width:1px;height:1px;margin:0;padding:0;pointer-events:none;opacity:0;";
    const lastSection = PORTFOLIO_SECTIONS.at(-1)?.id ?? null;
    let sentinelObserver: IntersectionObserver | null = null;
    if (lastSection) {
      document.body.appendChild(sentinel);
      sentinelObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting && Date.now() >= navLockUntilRef.current) {
            setActiveId(lastSection);
          }
        },
        { rootMargin: "0px 0px -2% 0px", threshold: 0 },
      );
      sentinelObserver.observe(sentinel);
    }

    return () => {
      bandObserver.disconnect();
      heroObserver?.disconnect();
      topObserver.disconnect();
      sentinelObserver?.disconnect();
      topSentinel.remove();
      sentinel.remove();
    };
  }, []);

  const handleNavigate = useCallback((id: PortfolioSectionId) => {
    navLockUntilRef.current = Date.now() + NAV_LOCK_MS;
    setActiveId(id);
    setHasLeftHero(id !== "home");
    setAtPageTop(id === "home");
  }, []);

  return { activeId, hasLeftHero, atPageTop, handleNavigate };
}
