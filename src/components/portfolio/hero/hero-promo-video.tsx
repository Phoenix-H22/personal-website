"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { PromoPlayer } from "@/components/portfolio/hero/promo-player";
import styles from "@/styles/portfolio/hero-promo-video.module.scss";

// Self-hosted from public/promo so it works in dev and prod. The CDN copy
// (https://cdn.yourobour.guide/me/promo4k.mp4) is hotlink-protected and 403s
// off-domain; swap VIDEO_SRC to it once that domain is allow-listed.
const VIDEO_SRC = "/promo/promo4k.mp4";
// Seek a little in so the frame shown as a "poster" isn't a black lead-in.
const PREVIEW_SRC = `${VIDEO_SRC}#t=1.2`;
const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Replaces the hero's right-hand artifact with a promo video. The original
 * artifact is received as `children` and kept mounted but visually hidden, so
 * its own styles and animation are never touched. The video shows a still frame
 * with a calm floating invite; clicking it opens a modal that plays with sound.
 */
export function HeroPromoVideo({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousActive = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActive?.focus?.();
    };
  }, [open]);

  const trapFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.lensHidden} aria-hidden="true">
        {children}
      </div>

      <div className={styles.frame}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setOpen(true)}
          aria-label="Play a short video summary of my work"
        >
          <video
            className={styles.preview}
            src={PREVIEW_SRC}
            preload="metadata"
            muted
            playsInline
            aria-hidden="true"
            tabIndex={-1}
          />
          <span className={styles.shade} aria-hidden="true" />
          <span className={styles.sheen} aria-hidden="true" />
          <span className={styles.grain} aria-hidden="true" />
          <span className={styles.playBadge} aria-hidden="true">
            <span className={styles.playIcon}>▶</span>
          </span>
          <span className={styles.meta} aria-hidden="true">
            <span className={styles.metaDot} />
            <span>Promo · 4K</span>
            <span className={styles.metaSpacer} />
            <span>Walkthrough</span>
          </span>
          <span className={`${styles.tick} ${styles.tickTL}`} aria-hidden="true" />
          <span className={`${styles.tick} ${styles.tickTR}`} aria-hidden="true" />
          <span className={`${styles.tick} ${styles.tickBL}`} aria-hidden="true" />
          <span className={`${styles.tick} ${styles.tickBR}`} aria-hidden="true" />
        </button>

        <span className={styles.pill} aria-hidden="true">
          <span className={styles.pillPulse} />
          <span className={styles.pillText}>
            <span className={styles.pillLead}>Want the quick version?</span>
            <span className={styles.pillSub}>Watch a short video summary ▶</span>
          </span>
        </span>
      </div>

      <p className={styles.caption}>
        <span>See the work in motion</span>
        <span className={styles.captionLine} aria-hidden="true" />
        <span>Sound on</span>
      </p>

      {open && typeof document !== "undefined"
        ? createPortal(
            <div className={styles.modal}>
              <button
                type="button"
                className={styles.backdrop}
                aria-label="Close video"
                tabIndex={-1}
                onClick={() => setOpen(false)}
              />
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-label="Video summary"
                className={styles.dialog}
                onKeyDown={trapFocus}
              >
                <div className={styles.playerHead}>
                  <span className={styles.headDot} aria-hidden="true" />
                  <span className={styles.headLabel}>Promo · Walkthrough</span>
                  <span className={styles.headSpacer} aria-hidden="true" />
                  <button
                    ref={closeRef}
                    type="button"
                    className={styles.close}
                    onClick={() => setOpen(false)}
                  >
                    Close ✕
                  </button>
                </div>
                <div className={styles.videoWrap}>
                  <PromoPlayer src={VIDEO_SRC} />
                  <span className={`${styles.mtick} ${styles.mtickTL}`} aria-hidden="true" />
                  <span className={`${styles.mtick} ${styles.mtickTR}`} aria-hidden="true" />
                  <span className={`${styles.mtick} ${styles.mtickBL}`} aria-hidden="true" />
                  <span className={`${styles.mtick} ${styles.mtickBR}`} aria-hidden="true" />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
