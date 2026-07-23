"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { useMotionPreference } from "@/lib/motion-preference-context";
import styles from "@/styles/portfolio/explore-signal.module.scss";

interface ExploreSelectedSystemsSignalProps {
  href?: string;
}

export function ExploreSelectedSystemsSignal({
  href = "#selected-systems",
}: ExploreSelectedSystemsSignalProps) {
  const arrowRef = useRef<HTMLSpanElement>(null);
  const { effective } = useMotionPreference();

  useEffect(() => {
    const arrow = arrowRef.current;
    if (!arrow || effective === "reduced") return;

    const tween = gsap.to(arrow, {
      y: 5,
      duration: 1.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [effective]);

  return (
    <a
      className={styles.signal}
      href={href}
      data-explore-selected-systems
      aria-label="Explore selected systems"
    >
      <span className={styles.label}>Explore selected systems</span>
      <span className={styles.path} aria-hidden="true">
        <span className={styles.line} />
        <span ref={arrowRef} className={styles.arrow}>
          ↓
        </span>
      </span>
    </a>
  );
}
