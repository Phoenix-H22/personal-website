"use client";

import type { OrbitStatusTone } from "@/lib/portfolio/projects/orbit-systems";
import styles from "@/styles/portfolio/projects-orbit.module.scss";

export interface ReadoutModel {
  tag: string;
  tone: OrbitStatusTone;
  founder: boolean;
  name: string;
  type: string;
  metric: string;
  /** True renders the open button as the solid primary action. */
  primary: boolean;
  buttonLabel: string;
  targetSlug: string;
}

interface OrbitReadoutProps {
  readout: ReadoutModel;
  scanning: boolean;
  locked: boolean;
  acquiring: boolean;
  /** Bumped on each lock so the readout can replay its transition. */
  lockPing: number;
  auto: boolean;
  onToggleAuto: () => void;
  onOpen: (slug: string) => void;
}

/**
 * Mission-control readout above the sonar: what the sweep is doing, the system
 * currently in focus, and the auto-scan toggle.
 */
export function OrbitReadout({
  readout,
  scanning,
  locked,
  acquiring,
  lockPing,
  auto,
  onToggleAuto,
  onOpen,
}: OrbitReadoutProps) {
  return (
    <section
      className={styles.readout}
      aria-label="Sweep readout"
      data-scanning={scanning}
      data-locked={locked}
    >
      <span className={styles.scanBar} aria-hidden="true" />
      <p className={styles.readoutTag} data-acquiring={acquiring}>
        <span
          className={styles.statusDot}
          data-tone={readout.tone}
          data-founder={readout.founder}
          aria-hidden="true"
        />
        <span className={styles.readoutTagLabel}>{readout.tag}</span>
      </p>
      <div className={styles.readoutBlock} key={lockPing}>
        <p className={styles.readoutName}>{readout.name}</p>
        <p className={styles.readoutType}>{readout.type}</p>
      </div>
      <p className={styles.readoutMetric}>{readout.metric}</p>
      <button
        type="button"
        className={styles.autoButton}
        data-on={auto}
        aria-pressed={auto}
        onClick={onToggleAuto}
      >
        {auto ? "Scanning ❙❙" : "Auto scan ▶"}
      </button>
      <button
        type="button"
        className={styles.readoutButton}
        data-primary={readout.primary}
        onClick={() => onOpen(readout.targetSlug)}
      >
        {readout.buttonLabel}
      </button>
    </section>
  );
}
