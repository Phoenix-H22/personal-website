"use client";

import {
  statusTone,
  systemThumb,
  systemTier,
  type OrbitSystem,
} from "@/lib/portfolio/projects/orbit-systems";
import { LazyMedia } from "@/components/portfolio/media/lazy-media";
import { cssVars, formatIndex } from "@/components/portfolio/projects-orbit/orbit-utils";
import styles from "@/styles/portfolio/projects-orbit.module.scss";

interface OrbitNodeProps {
  system: OrbitSystem;
  /** Global 1-based position, used for the node label. */
  index: number;
  x: number;
  y: number;
  online: boolean;
  active: boolean;
  /** True when the sweep has just locked onto this node. */
  acquired: boolean;
  onOpen: (slug: string) => void;
  onHover: (slug: string | null) => void;
}

/**
 * A single system plotted on the sonar: its mark (diamond for founder-built,
 * tone-filled square otherwise), a floating cover chip on a signal beam, and
 * a ping ring when the sweep acquires it.
 */
export function OrbitNode({
  system,
  index,
  x,
  y,
  online,
  active,
  acquired,
  onOpen,
  onHover,
}: OrbitNodeProps) {
  const founder = system.ownership === "Founder-built";

  return (
    <button
      type="button"
      className={styles.node}
      style={cssVars({ "--nx": x, "--ny": y })}
      data-online={online}
      data-active={active}
      disabled={!online}
      aria-label={`${system.name} — ${system.systemType}, ${system.status}. Open dossier.`}
      onClick={() => onOpen(system.slug)}
      onMouseEnter={() => onHover(system.slug)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(system.slug)}
      onBlur={() => onHover(null)}
    >
      {online ? <span className={styles.nodeBeam} aria-hidden="true" /> : null}
      {online ? (
        <span className={styles.nodeCard} aria-hidden="true">
          <span className={styles.nodeCardImg}>
            <LazyMedia
              src={systemThumb(system.slug)}
              alt=""
              fill
              sizes="4.5rem"
              loading="lazy"
            />
          </span>
        </span>
      ) : null}
      {acquired ? <span className={styles.nodePing} aria-hidden="true" /> : null}
      <span
        className={styles.nodeMark}
        data-tone={statusTone(system.status)}
        data-founder={founder}
        data-tier={systemTier(system)}
        aria-hidden="true"
      />
      <span className={styles.nodeLabel}>{formatIndex(index)}</span>
    </button>
  );
}
