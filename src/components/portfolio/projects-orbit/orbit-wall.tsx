"use client";

import {
  ORBIT_SYSTEMS,
  statusTone,
  systemThumb,
  systemTier,
  type OrbitSystem,
  type OrbitTier,
} from "@/lib/portfolio/projects/orbit-systems";
import { LazyMedia } from "@/components/portfolio/media/lazy-media";
import { formatIndex } from "@/components/portfolio/projects-orbit/orbit-utils";
import styles from "@/styles/portfolio/projects-orbit.module.scss";

interface OrbitWallProps {
  systems: OrbitSystem[];
  focusSlug: string | null;
  hintText: string;
  onOpen: (slug: string) => void;
  onHover: (slug: string | null) => void;
}

const TIER_TAGS: Record<OrbitTier, string> = { 0: "FNDR", 1: "LIVE", 2: "DONE" };

const GLOBAL_INDEX = new Map<string, number>(
  ORBIT_SYSTEMS.map((system, index) => [system.slug, index]),
);

/** CCTV-style "monitor wall" — every visible system as a live channel. */
export function OrbitWall({ systems, focusSlug, hintText, onOpen, onHover }: OrbitWallProps) {
  return (
    <section className={styles.wallSection} aria-label="All systems">
      <p className={styles.wallHead}>
        <span>Monitor wall — {systems.length} channels</span>
        <span className={styles.line} aria-hidden="true" />
        <span>{hintText}</span>
      </p>
      {systems.length === 0 ? (
        <p className={styles.empty} role="status">
          No systems match this filter
        </p>
      ) : (
        <div className={styles.wall}>
          {systems.map((system) => {
            const tier = systemTier(system);
            const founder = tier === 0;
            const index = GLOBAL_INDEX.get(system.slug) ?? 0;
            return (
              <button
                key={system.slug}
                type="button"
                className={styles.tile}
                data-active={focusSlug === system.slug}
                aria-label={`Open ${system.name} dossier`}
                onClick={() => onOpen(system.slug)}
                onMouseEnter={() => onHover(system.slug)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(system.slug)}
                onBlur={() => onHover(null)}
              >
                <span className={styles.screen}>
                  <span className={styles.screenCover}>
                    <LazyMedia
                      src={systemThumb(system.slug)}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 45vw, 11rem"
                      loading="lazy"
                    />
                  </span>
                  <span className={styles.screenScan} aria-hidden="true" />
                  <span className={styles.screenVignette} aria-hidden="true" />
                  <span className={styles.screenHeader}>
                    <span
                      className={styles.led}
                      data-tone={statusTone(system.status)}
                      data-founder={founder}
                      aria-hidden="true"
                    />
                    <span>{formatIndex(index)}</span>
                    <span className={styles.screenTag} data-tier={tier}>
                      {TIER_TAGS[tier]}
                    </span>
                  </span>
                  <span className={styles.screenName}>{system.name}</span>
                  <span className={styles.bracketTL} aria-hidden="true" />
                  <span className={styles.bracketBR} aria-hidden="true" />
                </span>
                <span className={styles.tileMetric}>{system.metric}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
