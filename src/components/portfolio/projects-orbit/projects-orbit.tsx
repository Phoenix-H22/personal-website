"use client";

import { useMemo } from "react";

import {
  ORBIT_SYSTEMS,
  statusTone,
  systemCover,
} from "@/lib/portfolio/projects/orbit-systems";
import { OrbitNav } from "@/components/portfolio/projects-orbit/orbit-nav";
import { OrbitFilters } from "@/components/portfolio/projects-orbit/orbit-filters";
import { OrbitMap, type OrbitCore } from "@/components/portfolio/projects-orbit/orbit-map";
import {
  OrbitReadout,
  type ReadoutModel,
} from "@/components/portfolio/projects-orbit/orbit-readout";
import { OrbitDossier } from "@/components/portfolio/projects-orbit/orbit-dossier";
import { OrbitWall } from "@/components/portfolio/projects-orbit/orbit-wall";
import { useProjectsOrbit } from "@/components/portfolio/projects-orbit/use-projects-orbit";
import { formatIndex } from "@/components/portfolio/projects-orbit/orbit-utils";
import styles from "@/styles/portfolio/projects-orbit.module.scss";

const GLOBAL_INDEX = new Map<string, number>(
  ORBIT_SYSTEMS.map((system, index) => [system.slug, index]),
);

/**
 * Projects Orbit — the sonar systems map rendered at `/projects`. Interaction
 * state lives in `useProjectsOrbit`; this component derives the map/readout
 * view models and composes the presentational pieces.
 */
export function ProjectsOrbit() {
  const orbit = useProjectsOrbit();
  const focus = orbit.focusSystem;

  const visibleSlugs = useMemo(
    () => new Set<string>(orbit.systems.map((system) => system.slug)),
    [orbit.systems],
  );

  const activeDomainKeys = useMemo(() => {
    const keys = new Set<string>();
    if (orbit.domain !== "all") keys.add(orbit.domain);
    if (focus) keys.add(focus.domains[0]);
    return keys;
  }, [orbit.domain, focus]);

  const core: OrbitCore = focus
    ? {
        focused: true,
        eyebrow: `Node ${formatIndex(GLOBAL_INDEX.get(focus.slug) ?? 0)}`,
        value: focus.name,
        caption: focus.domains[0],
        coverImg: systemCover(focus.slug),
      }
    : {
        focused: false,
        eyebrow: "Shared backbone",
        value: "13 systems",
        caption: "Laravel · Queues · Redis · MQTT",
        coverImg: null,
      };

  const manualFocus = orbit.hoverSlug !== null || orbit.openSystem !== null;
  const readout: ReadoutModel = focus
    ? {
        tag: manualFocus
          ? `Node ${formatIndex(GLOBAL_INDEX.get(focus.slug) ?? 0)} · ${focus.status}`
          : `${orbit.scan.locked ? "Locked" : "Acquiring"} · node ${formatIndex(
              GLOBAL_INDEX.get(focus.slug) ?? 0,
            )}`,
        tone: statusTone(focus.status),
        founder: focus.ownership === "Founder-built",
        name: focus.name,
        type: focus.systemType,
        metric: focus.metric,
        primary: true,
        buttonLabel: "Open dossier",
        targetSlug: focus.slug,
      }
    : {
        tag: "Standby · sweeping",
        tone: "live",
        founder: false,
        name: "13 production systems",
        type: "Backend platforms · payments · messaging · connected hardware",
        metric: "The sweep locks onto each system in turn — or hover a node yourself.",
        primary: false,
        buttonLabel: "Open first node",
        targetSlug: ORBIT_SYSTEMS[0].slug,
      };

  return (
    <main id="main-content" className={styles.page}>
      <div className={styles.ambient} aria-hidden="true">
        <span className={styles.ambientGlow} />
        <span className={styles.ambientGrid} />
      </div>

      <OrbitNav />

      <div className={styles.shell}>
        <h1 className={styles.pageHeading}>Projects</h1>
        {/* Kept in the tree for future reuse; visually hidden on every breakpoint. */}
        <header className={styles.header} hidden aria-hidden="true">
          <div className={styles.headline}>
            <p className={styles.eyebrow}>
              <span className={styles.livePip} aria-hidden="true" />
              <span>Systems map / 13 nodes online</span>
            </p>
            <p className={styles.title}>I build the systems products depend on.</p>
          </div>
          <div className={styles.identity}>
            <strong>Abdalrhman M. Alkady</strong>
            <span>Backend systems engineer</span>
            <span className={styles.badge}>Upwork Top Rated · 100% JSS</span>
          </div>
        </header>

        <section className={styles.telemetry} aria-label="Aggregate proof">
          {orbit.telemetry.map((stat) => (
            <div key={stat.label} className={styles.telemetryStat}>
              <p className={styles.statValue}>{stat.display}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </section>

        <OrbitFilters
          domainChips={orbit.domainChips}
          ownerChips={orbit.ownerChips}
          onDomainChange={orbit.setDomain}
          onOwnerChange={orbit.setOwner}
        />

        {/* Kept in the tree for future reuse; visually hidden on every breakpoint. */}
        <div className={styles.readoutSlot} hidden aria-hidden="true">
          <OrbitReadout
            readout={readout}
            scanning={orbit.scanning}
            locked={orbit.scan.locked}
            acquiring={orbit.acquiring}
            lockPing={orbit.scan.ping}
            auto={orbit.auto}
            onToggleAuto={orbit.toggleAuto}
            onOpen={orbit.openDossier}
          />
        </div>

        <div className={styles.mapRow}>
          <OrbitMap
            visibleSlugs={visibleSlugs}
            focusSlug={orbit.focusSlug}
            activeDomainKeys={activeDomainKeys}
            scanning={orbit.scanning}
            angle={orbit.scan.angle}
            seekSeconds={orbit.seekMs / 1000}
            acquiredSlug={orbit.scan.acquired}
            core={core}
            onOpen={orbit.openDossier}
            onHover={orbit.setHover}
          />

          <OrbitWall
            systems={orbit.systems}
            focusSlug={orbit.focusSlug}
            hintText="Hover the map or the wall"
            onOpen={orbit.openDossier}
            onHover={orbit.setHover}
          />
        </div>

        <footer className={styles.footer}>
          <span>Core backbone — Laravel · Queues · Redis · MQTT</span>
          <span>EGP 21M+ processed · 3 founder-built products</span>
        </footer>
      </div>

      {orbit.openSystem ? (
        <OrbitDossier
          system={orbit.openSystem}
          onClose={orbit.closeDossier}
          onNext={orbit.showNext}
        />
      ) : null}
    </main>
  );
}
