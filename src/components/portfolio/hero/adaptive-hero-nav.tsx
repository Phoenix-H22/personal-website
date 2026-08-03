"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import styles from "@/styles/portfolio/adaptive-engineer-hero.module.scss";

const navigationLinks = [
  {
    href: "#work",
    index: "01",
    label: "Systems",
    mobileLabel: "Systems",
    description: "Selected production work",
  },
  {
    href: "#experience",
    index: "02",
    label: "Experience",
    mobileLabel: "Experience",
    description: "Roles, ownership and impact",
  },
  {
    href: "#recruiter-brief",
    index: "03",
    label: "Brief",
    mobileLabel: "Recruiter Brief",
    description: "The 60-second version",
  },
  {
    href: "#contact",
    index: "04",
    label: "Contact",
    mobileLabel: "Contact",
    description: "Start a conversation",
  },
] as const;

export function AdaptiveHeroNav() {
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousOverflowRef = useRef("");

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  const selectSection = useCallback((href: string) => {
    setActiveHref(href);
    setOpen(false);
    if (open) {
      window.requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
    }
  }, [open]);

  useEffect(() => {
    let frame: number | null = null;
    const synchronize = () => {
      frame = null;
      setScrolled(window.scrollY > 18);
      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 72;
      const activationLine = headerHeight + window.innerHeight * 0.22;
      let nextActive: string | null = null;

      for (const link of navigationLinks) {
        const section = document.querySelector<HTMLElement>(link.href);
        if (!section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.top <= activationLine && rect.bottom > headerHeight) {
          nextActive = link.href;
        }
      }

      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        nextActive = "#contact";
      }
      setActiveHref(nextActive);
    };
    const scheduleSynchronization = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(synchronize);
    };

    synchronize();
    window.addEventListener("scroll", scheduleSynchronization, { passive: true });
    window.addEventListener("resize", scheduleSynchronization);
    window.addEventListener("hashchange", scheduleSynchronization);
    return () => {
      window.removeEventListener("scroll", scheduleSynchronization);
      window.removeEventListener("resize", scheduleSynchronization);
      window.removeEventListener("hashchange", scheduleSynchronization);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    panel?.querySelector<HTMLElement>("a[href], button")?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [close, open]);

  return (
    <header
      ref={headerRef}
      className={styles.navigation}
      data-adaptive-hero-nav
      data-scrolled={scrolled}
    >
      <div className={styles.navigationInner}>
        <Link className={styles.brand} href="/v2" aria-label="AK, Abdalrhman M. Alkady home">
          <span aria-hidden="true">AK</span>
          <strong>Abdalrhman M. Alkady</strong>
        </Link>

        <div className={styles.navigationRight}>
          <nav className={styles.desktopNavigation} aria-label="Primary">
            {navigationLinks.map((link) => {
              const active = link.href === activeHref;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "location" : undefined}
                  data-active={active}
                  onClick={() => selectSection(link.href)}
                >
                  <span>{link.index}</span>
                  <strong>{link.label}</strong>
                </a>
              );
            })}
          </nav>
          <a className={styles.navigationContact} href="mailto:alkady2019@gmail.com">
            CONTACT <span aria-hidden="true">↗</span>
          </a>
        </div>

        <button
          ref={triggerRef}
          type="button"
          className={styles.menuTrigger}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => (open ? close() : setOpen(true))}
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      {open ? (
        <div
          ref={panelRef}
          id={menuId}
          className={styles.mobileMenu}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className={styles.mobileMenuHeader}>
            <div>
              <span>NAVIGATION</span>
              <strong>PORTFOLIO / 04</strong>
            </div>
            <button type="button" onClick={close}>CLOSE / ESC</button>
          </div>
          <nav aria-label="Mobile primary">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={link.href === activeHref ? "location" : undefined}
                onClick={() => selectSection(link.href)}
              >
                <span>{link.index}</span>
                <span className={styles.mobileMenuDestination}>
                  <strong>{link.mobileLabel}</strong>
                  <small>{link.description}</small>
                </span>
                <i aria-hidden="true">↘</i>
              </a>
            ))}
          </nav>
          <footer className={styles.mobileMenuFooter}>
            <a href="mailto:alkady2019@gmail.com" onClick={close}>
              CONTACT <span aria-hidden="true">↗</span>
            </a>
          </footer>
        </div>
      ) : null}
    </header>
  );
}
