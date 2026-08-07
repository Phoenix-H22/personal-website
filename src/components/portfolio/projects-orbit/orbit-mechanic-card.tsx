"use client";

import { useState } from "react";

import { OrbitMechanicDiagram } from "@/components/portfolio/projects-orbit/orbit-mechanic-diagram";
import type { DossierMechanic } from "@/lib/portfolio/projects/orbit-dossiers";
import styles from "@/styles/portfolio/projects-orbit.module.scss";

interface OrbitMechanicCardProps {
  slug: string;
  mechanic: DossierMechanic;
}

/**
 * Keep the back-face caption to a single, tidy sentence so it always fits under
 * the diagram with breathing room. Falls back to a soft length cap if the first
 * sentence runs long.
 */
function shortCaption(how: string): string {
  const firstSentence = how.split(/(?<=\.)\s+/)[0] ?? how;
  if (firstSentence.length <= 92) return firstSentence;
  const clipped = firstSentence.slice(0, 92);
  return `${clipped.slice(0, clipped.lastIndexOf(" "))}…`;
}

/**
 * A single "what actually makes it work" card. The front shows the capability;
 * clicking (or Enter/Space) flips it in 3D to reveal a unique animated diagram
 * of how it works, plus a one-line explanation. The whole card is a button so
 * keyboard and screen-reader users get the same toggle.
 */
export function OrbitMechanicCard({ slug, mechanic }: OrbitMechanicCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      className={styles.mechCard}
      data-flipped={flipped}
      aria-pressed={flipped}
      onClick={() => setFlipped((value) => !value)}
    >
      <span className={styles.mechInner}>
        <span className={styles.mechFace} data-face="front">
          <span className={styles.mechCode}>{mechanic.code}</span>
          <span className={styles.mechTitle}>{mechanic.title}</span>
          <span className={styles.mechText}>{mechanic.front}</span>
          <span className={styles.mechHint}>See it work ↻</span>
        </span>
        <span className={styles.mechFace} data-face="back">
          <span className={styles.mechCode}>{mechanic.code} · How it works</span>
          <span className={styles.mechDiagram}>
            <OrbitMechanicDiagram slug={slug} code={mechanic.code} />
          </span>
          <span className={styles.mechText} data-back="true">
            {shortCaption(mechanic.how)}
          </span>
          <span className={styles.mechHint}>↩ Back</span>
        </span>
      </span>
    </button>
  );
}
