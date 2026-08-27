"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  ORBIT_DOMAINS,
  ORBIT_SYSTEMS,
  ORBIT_TELEMETRY,
  isFounderBuilt,
  type OrbitDomainKey,
  type OrbitSystem,
} from "@/lib/portfolio/projects/orbit-systems";
import { scanOrder } from "@/lib/portfolio/projects/orbit-geometry";
import {
  PROJECTS_INDEX_PATH,
  projectPath,
  projectSlugFromPathname,
} from "@/lib/portfolio/projects/project-routes";
import {
  useOrbitScan,
  type OrbitScanState,
} from "@/components/portfolio/projects-orbit/use-orbit-scan";

export type DomainFilter = "all" | OrbitDomainKey;
export type OwnerFilter = "all" | "founder" | "client";

const TELEMETRY_DURATION_MS = 1200;
const SWEEP_SECONDS = 18;
const DWELL_MS = 1900;
const SEEK_MS = Math.max(320, Math.round((SWEEP_SECONDS * 1000) / ORBIT_SYSTEMS.length));

export interface FilterChip<TValue extends string> {
  value: TValue;
  label: string;
  count: number;
  active: boolean;
}

export interface TelemetryReadout {
  label: string;
  display: string;
}

export interface ProjectsOrbitState {
  systems: OrbitSystem[];
  total: number;
  isEmpty: boolean;
  domain: DomainFilter;
  owner: OwnerFilter;
  domainChips: FilterChip<DomainFilter>[];
  ownerChips: FilterChip<OwnerFilter>[];
  telemetry: TelemetryReadout[];
  hoverSlug: string | null;
  openSystem: OrbitSystem | null;
  focusSystem: OrbitSystem | null;
  focusSlug: string | null;
  auto: boolean;
  scanning: boolean;
  acquiring: boolean;
  scan: OrbitScanState;
  seekMs: number;
  setDomain: (value: DomainFilter) => void;
  setOwner: (value: OwnerFilter) => void;
  setHover: (slug: string | null) => void;
  toggleAuto: () => void;
  openDossier: (slug: string) => void;
  closeDossier: () => void;
  showNext: () => void;
}

function matchesOwner(system: OrbitSystem, owner: OwnerFilter): boolean {
  if (owner === "founder") return isFounderBuilt(system);
  if (owner === "client") return !isFounderBuilt(system);
  return true;
}

function matchesDomain(system: OrbitSystem, domain: DomainFilter): boolean {
  return domain === "all" || system.domains.includes(domain);
}

function formatTelemetry(progress: number): TelemetryReadout[] {
  return ORBIT_TELEMETRY.map((stat) => {
    const value = Math.round(stat.target * progress);
    const rendered = stat.grouped ? value.toLocaleString("en-US") : String(value);
    return {
      label: stat.label,
      display: `${stat.prefix ?? ""}${rendered}${stat.suffix ?? ""}`,
    };
  });
}

/** Eases an intro value 0 -> 1 once on mount, for the telemetry count-up. */
function useIntroProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now;
      const linear = Math.min(1, (now - start) / TELEMETRY_DURATION_MS);
      setProgress(1 - Math.pow(1 - linear, 3));
      if (linear < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return progress;
}

export function useProjectsOrbit(): ProjectsOrbitState {
  const router = useRouter();
  const pathname = usePathname();
  const [domain, setDomainState] = useState<DomainFilter>("all");
  const [owner, setOwnerState] = useState<OwnerFilter>("all");
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const [auto, setAuto] = useState(true);
  const openSlug = projectSlugFromPathname(pathname);

  const progress = useIntroProgress();

  const systems = useMemo(
    () =>
      ORBIT_SYSTEMS.filter(
        (system) => matchesDomain(system, domain) && matchesOwner(system, owner),
      ),
    [domain, owner],
  );

  const visibleSlugs = useMemo<string[]>(
    () => systems.map((system) => system.slug),
    [systems],
  );
  const order = useMemo(() => scanOrder(visibleSlugs), [visibleSlugs]);
  const orderKey = `${domain}|${owner}`;

  const openSystem = useMemo(
    () => ORBIT_SYSTEMS.find((system) => system.slug === openSlug) ?? null,
    [openSlug],
  );

  // Motion is intentionally always-on for the sonar (owner request); the sweep
  // pauses only on direct interaction, never on the OS reduced-motion setting.
  const scanning = auto;
  const scanPaused = !auto || hoverSlug !== null || openSlug !== null;

  const scan = useOrbitScan({
    order,
    orderKey,
    paused: scanPaused,
    seekMs: SEEK_MS,
    dwellMs: DWELL_MS,
  });

  const acquiredVisible =
    scan.acquired !== null && visibleSlugs.includes(scan.acquired) ? scan.acquired : null;
  const focusSlug = hoverSlug ?? openSlug ?? acquiredVisible;
  const focusSystem = useMemo(
    () => ORBIT_SYSTEMS.find((system) => system.slug === focusSlug) ?? null,
    [focusSlug],
  );
  const acquiring = scanning && hoverSlug === null && openSlug === null && !scan.locked;

  const setDomain = useCallback((value: DomainFilter) => {
    setDomainState(value);
    setHoverSlug(null);
  }, []);

  const setOwner = useCallback((value: OwnerFilter) => {
    setOwnerState(value);
    setHoverSlug(null);
  }, []);

  const toggleAuto = useCallback(() => setAuto((value) => !value), []);

  const openDossier = useCallback(
    (slug: string) => {
      router.push(projectPath(slug), { scroll: false });
    },
    [router],
  );

  const closeDossier = useCallback(() => {
    router.push(PROJECTS_INDEX_PATH, { scroll: false });
  }, [router]);

  const showNext = useCallback(() => {
    const current = projectSlugFromPathname(pathname);
    if (!current) return;
    const index = ORBIT_SYSTEMS.findIndex((system) => system.slug === current);
    const next = ORBIT_SYSTEMS[(index + 1) % ORBIT_SYSTEMS.length].slug;
    router.replace(projectPath(next), { scroll: false });
  }, [pathname, router]);

  // Escape closes the dossier and restores the listing URL.
  useEffect(() => {
    if (!openSlug) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDossier();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSlug, closeDossier]);

  const countBy = useCallback(
    (predicate: (system: OrbitSystem) => boolean) => ORBIT_SYSTEMS.filter(predicate).length,
    [],
  );

  const domainChips = useMemo<FilterChip<DomainFilter>[]>(() => {
    const chips: FilterChip<DomainFilter>[] = [
      { value: "all", label: "All", count: ORBIT_SYSTEMS.length, active: domain === "all" },
    ];
    for (const item of ORBIT_DOMAINS) {
      chips.push({
        value: item.key,
        label: item.short,
        count: countBy((system) => system.domains.includes(item.key)),
        active: domain === item.key,
      });
    }
    return chips;
  }, [domain, countBy]);

  const ownerChips = useMemo<FilterChip<OwnerFilter>[]>(() => {
    const founder = countBy(isFounderBuilt);
    return [
      { value: "all", label: "Any owner", count: ORBIT_SYSTEMS.length, active: owner === "all" },
      { value: "founder", label: "Founder-built", count: founder, active: owner === "founder" },
      {
        value: "client",
        label: "Client & owned",
        count: ORBIT_SYSTEMS.length - founder,
        active: owner === "client",
      },
    ];
  }, [owner, countBy]);

  const telemetry = useMemo(() => formatTelemetry(progress), [progress]);

  return {
    systems,
    total: systems.length,
    isEmpty: systems.length === 0,
    domain,
    owner,
    domainChips,
    ownerChips,
    telemetry,
    hoverSlug,
    openSystem,
    focusSystem,
    focusSlug,
    auto,
    scanning,
    acquiring,
    scan,
    seekMs: SEEK_MS,
    setDomain,
    setOwner,
    setHover: setHoverSlug,
    toggleAuto,
    openDossier,
    closeDossier,
    showNext,
  };
}
