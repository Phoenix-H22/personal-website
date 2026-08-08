"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import styles from "@/styles/concept-v3-rebuild/hero.module.scss";

const defaultLinks = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
] as const;

export interface RebuildNavLink {
  href: string;
  label: string;
}

interface RebuildNavProps {
  /** Primary brand home. Defaults to the approved root portfolio. */
  homeHref?: "/" | "/v2";
  links?: readonly RebuildNavLink[];
}

export function RebuildNav({
  homeHref = "/",
  links = defaultLinks,
}: RebuildNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  /** Same-route brand click: stay mounted — scroll home instead of remounting the page. */
  const onBrandClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (pathname !== homeHref) return;
      event.preventDefault();
      if (window.location.hash) {
        window.history.replaceState(null, "", homeHref);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      setOpen(false);
    },
    [homeHref, pathname],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <header className={styles.nav} data-rebuild-nav>
      <div className={`${styles.shell} ${styles.navInner}`}>
        <Link
          href={homeHref}
          className={styles.brand}
          aria-label="AK, Abdalrhman M. Alkady home"
          onClick={onBrandClick}
        >
          <span className={styles.brandMark} aria-hidden="true">
            AK
          </span>
          <span className={styles.brandText}>Abdalrhman M. Alkady</span>
        </Link>

        <nav aria-label="Primary" className={styles.navLinks}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.navTools}>
          <a className={styles.navCta} href="mailto:alkady2019@gmail.com">
            <span className={styles.navCtaDot} aria-hidden="true" />
            Let&apos;s talk
          </a>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className={styles.navMenuButton}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.navMenuIcon} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {open ? (
        <div
          id={menuId}
          ref={panelRef}
          className={styles.navMobilePanel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <nav aria-label="Mobile primary" className={styles.navMobileLinks}>
            {links.map((link) => (
              <a key={link.href} href={link.href} onClick={close}>
                {link.label}
              </a>
            ))}
            <a
              className={styles.navMobileCta}
              href="mailto:alkady2019@gmail.com"
              onClick={close}
            >
              Let&apos;s talk
            </a>
          </nav>
          <button type="button" className={styles.navMobileClose} onClick={close}>
            Close
          </button>
        </div>
      ) : null}
    </header>
  );
}
