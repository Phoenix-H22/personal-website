import type { ReactNode } from "react";

import styles from "@/styles/concept-v3-rebuild/chapters.module.scss";

type ChapterVariant = "origin" | "career";

interface PortfolioChapterProps {
  id: string;
  variant: ChapterVariant;
  "aria-labelledby"?: string;
  transitionFromHero?: boolean;
  children: ReactNode;
}

export function PortfolioChapter({
  id,
  variant,
  "aria-labelledby": ariaLabelledBy,
  transitionFromHero = false,
  children,
}: PortfolioChapterProps) {
  const atmosphereClass =
    variant === "origin" ? styles.atmosphereOrigin : styles.atmosphereCareer;

  return (
    <section
      id={id}
      className={[
        styles.chapter,
        variant === "career" ? styles.chapterCareer : "",
        transitionFromHero ? styles.transitionFromHero : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={ariaLabelledBy}
    >
      <div className={`${styles.atmosphere} ${atmosphereClass}`} aria-hidden="true">
        <div className={styles.atmosphereGradient} />
        <div className={styles.atmosphereGrain} />
      </div>
      <div className={styles.chapterInner}>{children}</div>
    </section>
  );
}
