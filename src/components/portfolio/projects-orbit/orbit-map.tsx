"use client";

import { ORBIT_SYSTEMS } from "@/lib/portfolio/projects/orbit-systems";
import {
  ORBIT_NODE_GEOMETRY,
  ORBIT_RIM_ANCHORS,
  ORBIT_SECTOR_LINES,
  spokeInnerPoint,
} from "@/lib/portfolio/projects/orbit-geometry";
import { OrbitNode } from "@/components/portfolio/projects-orbit/orbit-node";
import { cssVars } from "@/components/portfolio/projects-orbit/orbit-utils";
import styles from "@/styles/portfolio/projects-orbit.module.scss";

const ACCENT = "#31e6d0";
const SPOKE_BASE = "#8babcc";
const RING_RADII = [
  { r: 22, opacity: 0.14 },
  { r: 31.5, opacity: 0.11 },
  { r: 40, opacity: 0.09 },
];

export interface OrbitCore {
  focused: boolean;
  eyebrow: string;
  value: string;
  caption: string;
  coverImg: string | null;
}

interface OrbitMapProps {
  visibleSlugs: Set<string>;
  focusSlug: string | null;
  activeDomainKeys: Set<string>;
  scanning: boolean;
  angle: number;
  seekSeconds: number;
  acquiredSlug: string | null;
  core: OrbitCore;
  onOpen: (slug: string) => void;
  onHover: (slug: string | null) => void;
}

export function OrbitMap({
  visibleSlugs,
  focusSlug,
  activeDomainKeys,
  scanning,
  angle,
  seekSeconds,
  acquiredSlug,
  core,
  onOpen,
  onHover,
}: OrbitMapProps) {
  return (
    <div className={styles.mapWrap}>
      <div className={styles.map} data-scanning={scanning}>
        <div
          className={styles.sweep}
          aria-hidden="true"
          style={cssVars({ "--angle": angle, "--seek": seekSeconds })}
        />
        <div className={styles.sonar} aria-hidden="true" />
        <div className={`${styles.sonar} ${styles.sonarB}`} aria-hidden="true" />

        <svg className={styles.rings} viewBox="0 0 100 100" aria-hidden="true">
          {RING_RADII.map((ring) => (
            <circle
              key={ring.r}
              cx="50"
              cy="50"
              r={ring.r}
              fill="none"
              stroke={`rgba(139,171,204,${ring.opacity})`}
              strokeWidth="0.2"
            />
          ))}
          <circle
            cx="50"
            cy="50"
            r="47.5"
            fill="none"
            stroke="rgba(139,171,204,0.07)"
            strokeWidth="0.2"
            strokeDasharray="0.6 1.4"
          />
          {ORBIT_SECTOR_LINES.map((point, index) => (
            <line
              key={index}
              x1="50"
              y1="50"
              x2={point.x}
              y2={point.y}
              stroke="rgba(139,171,204,0.07)"
              strokeWidth="0.16"
            />
          ))}
          {ORBIT_SYSTEMS.map((system) => {
            const outer = ORBIT_NODE_GEOMETRY[system.slug];
            const inner = spokeInnerPoint(system.slug);
            const online = visibleSlugs.has(system.slug);
            const active = focusSlug === system.slug;
            const opacity = !online ? 0.04 : active ? 0.75 : focusSlug ? 0.1 : 0.22;
            return (
              <g key={system.slug}>
                <line
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke={active ? ACCENT : SPOKE_BASE}
                  strokeWidth={active ? 0.32 : 0.18}
                  strokeOpacity={opacity}
                />
                {active ? (
                  <line
                    className={styles.activeBeam}
                    x1={outer.x}
                    y1={outer.y}
                    x2={inner.x}
                    y2={inner.y}
                    stroke={ACCENT}
                    strokeWidth="0.5"
                    strokeDasharray="3 60"
                  />
                ) : null}
              </g>
            );
          })}
        </svg>

        {ORBIT_RIM_ANCHORS.map((anchor) => (
          <span
            key={anchor.key}
            className={styles.rim}
            style={cssVars({ "--rx": anchor.x, "--ry": anchor.y })}
            data-active={activeDomainKeys.has(anchor.key)}
          >
            {anchor.short}
          </span>
        ))}

        <div className={styles.core} data-focused={core.focused}>
          <div
            className={styles.coreImg}
            aria-hidden="true"
            style={core.coverImg ? cssVars({ "--img": `url("${core.coverImg}")` }) : undefined}
          />
          <div className={styles.coreText}>
            <p className={styles.coreEyebrow}>{core.eyebrow}</p>
            <p className={styles.coreValue}>{core.value}</p>
            <p className={styles.coreCaption}>{core.caption}</p>
          </div>
        </div>

        {ORBIT_SYSTEMS.map((system, index) => (
          <OrbitNode
            key={system.slug}
            system={system}
            index={index}
            x={ORBIT_NODE_GEOMETRY[system.slug].x}
            y={ORBIT_NODE_GEOMETRY[system.slug].y}
            online={visibleSlugs.has(system.slug)}
            active={focusSlug === system.slug}
            acquired={scanning && acquiredSlug === system.slug}
            onOpen={onOpen}
            onHover={onHover}
          />
        ))}
      </div>

      <div className={styles.legend} aria-hidden="true">
        <span className={styles.legendItem}>
          <span className={styles.glyphDiamond} />
          Inner ring · founder-built
        </span>
        <span className={styles.legendItem}>
          <span className={styles.glyphLive} />
          Mid ring · live, built by me
        </span>
        <span className={styles.legendItem}>
          <span className={styles.glyphDone} />
          Outer ring · completed / handed over
        </span>
        <span className={styles.legendItem}>
          <span className={styles.glyphRoute} />
          Signal route to the shared backbone
        </span>
      </div>
    </div>
  );
}
