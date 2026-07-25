"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useMotionPreference } from "@/lib/motion-preference-context";
import styles from "@/styles/portfolio/education-credential.module.scss";

/**
 * Compact V2 education credential — attached to identity flow, not a free-floating badge.
 */
export function EducationCredential() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { effective } = useMotionPreference();

  useEffect(() => {
    const el = rootRef.current;
    if (!el || effective === "reduced") return;

    const tween = gsap.to(el, {
      y: -3.5,
      rotate: 0.35,
      duration: 2.9,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    const pause = () => tween.pause();
    const resume = () => {
      if (document.visibilityState === "visible") tween.resume();
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("focusin", pause);
    el.addEventListener("focusout", resume);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") pause();
      else resume();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) pause();
        else resume();
      },
      { threshold: 0.2 },
    );
    io.observe(el);

    return () => {
      tween.kill();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("focusin", pause);
      el.removeEventListener("focusout", resume);
    };
  }, [effective]);

  return (
    <div
      ref={rootRef}
      className={styles.credential}
      data-education-credential
      tabIndex={0}
    >
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
          <path
            d="M12 3 2 8l10 5 10-5-10-5Zm0 10.5L4.5 9.4V15c0 2.2 3.4 4 7.5 4s7.5-1.8 7.5-4V9.4L12 13.5Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <div className={styles.body}>
        <p className={styles.degree}>B.Sc. Computer &amp; AI</p>
        <p className={styles.proofs}>
          <span className={styles.honors}>A-grade with Honors</span>
          <span className={styles.sep} aria-hidden="true">
            ·
          </span>
          <span className={styles.capstone}>Capstone A+</span>
        </p>
      </div>
      <span className={styles.srOnly}>
        Bachelor’s degree in Computer and Artificial Intelligence, cumulative
        A-grade with Honors, capstone graded A+.
      </span>
    </div>
  );
}
