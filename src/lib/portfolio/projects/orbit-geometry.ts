import {
  ORBIT_DOMAINS,
  ORBIT_SYSTEMS,
  ORBIT_TIER_RADII,
  systemTier,
  type OrbitSystem,
} from "@/lib/portfolio/projects/orbit-systems";

/**
 * Pure sonar geometry. Every node sits in its primary domain's sector at a
 * radius chosen by its tier; multiple systems in one sector fan out evenly.
 * All coordinates use the 0–100 space of the sonar's square viewBox, with the
 * centre at (50, 50). Angles follow SVG/CSS convention: 0° points right, +90°
 * points down, so "-90 + sector offset" starts sectors at the top.
 */

const SECTOR_COUNT = ORBIT_DOMAINS.length;
const SECTOR_STEP = 360 / SECTOR_COUNT;
const SPREAD_FACTOR = 0.42;

/** Radius at which spokes begin, just outside the core disc. */
export const CORE_SPOKE_RADIUS = 16;
/** Radius of the dashed outer ring the sector lines reach. */
export const RIM_RADIUS = 47.5;
/** Radius at which rim labels are anchored. */
export const RIM_LABEL_RADIUS = 49.5;

export interface NodeGeometry {
  x: number;
  y: number;
  angleRad: number;
  angleDeg: number;
  radius: number;
  sector: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface RimAnchor extends Point {
  key: string;
  short: string;
}

export interface ScanTarget {
  slug: string;
  /** Clockwise-from-top angle the sweep must reach to point at this node. */
  conic: number;
}

/**
 * Round to 4 decimals. `Math.cos`/`Math.sin` are not bit-identical across the
 * Node server runtime and the browser, so rounding the shared coordinates keeps
 * server-rendered SVG and CSS variables from tripping a hydration mismatch.
 */
function round(value: number): number {
  return Math.round(value * 1e4) / 1e4;
}

function pointAt(angleDeg: number, radius: number): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: round(50 + radius * Math.cos(rad)), y: round(50 + radius * Math.sin(rad)) };
}

function buildNodeGeometry(): Record<string, NodeGeometry> {
  const buckets = new Map<string, OrbitSystem[]>(
    ORBIT_DOMAINS.map((domain) => [domain.key, []]),
  );
  for (const system of ORBIT_SYSTEMS) {
    buckets.get(system.domains[0])?.push(system);
  }

  const geometry: Record<string, NodeGeometry> = {};
  ORBIT_DOMAINS.forEach((domain, sector) => {
    const items = buckets.get(domain.key) ?? [];
    const mid = -90 + sector * SECTOR_STEP + SECTOR_STEP / 2;
    items.forEach((system, index) => {
      const spread =
        items.length > 1
          ? (index - (items.length - 1) / 2) * (SECTOR_STEP * SPREAD_FACTOR)
          : 0;
      const angleDeg = mid + spread;
      const angleRad = (angleDeg * Math.PI) / 180;
      const radius = ORBIT_TIER_RADII[systemTier(system)];
      geometry[system.slug] = {
        x: round(50 + radius * Math.cos(angleRad)),
        y: round(50 + radius * Math.sin(angleRad)),
        angleRad,
        angleDeg,
        radius,
        sector,
      };
    });
  });
  return geometry;
}

/** Node coordinates keyed by slug. Static — computed once at module load. */
export const ORBIT_NODE_GEOMETRY: Record<string, NodeGeometry> = buildNodeGeometry();

/** Endpoints of the eight sector divider lines, at the outer ring. */
export const ORBIT_SECTOR_LINES: readonly Point[] = ORBIT_DOMAINS.map((_, sector) =>
  pointAt(-90 + sector * SECTOR_STEP, RIM_RADIUS),
);

/** Rim label anchors at each sector's midpoint. */
export const ORBIT_RIM_ANCHORS: readonly RimAnchor[] = ORBIT_DOMAINS.map(
  (domain, sector) => ({
    ...pointAt(-90 + sector * SECTOR_STEP + SECTOR_STEP / 2, RIM_LABEL_RADIUS),
    key: domain.key,
    short: domain.short,
  }),
);

/** Inner endpoint of a node's spoke, on the core disc edge. */
export function spokeInnerPoint(slug: string): Point {
  const geo = ORBIT_NODE_GEOMETRY[slug];
  return {
    x: round(50 + CORE_SPOKE_RADIUS * Math.cos(geo.angleRad)),
    y: round(50 + CORE_SPOKE_RADIUS * Math.sin(geo.angleRad)),
  };
}

/** Clockwise-from-top angle the sweep points to when locked on a node. */
export function conicAngle(slug: string): number {
  const deg = ORBIT_NODE_GEOMETRY[slug].angleDeg;
  return (((deg + 90) % 360) + 360) % 360;
}

/** Visible nodes ordered by sweep angle — the order the beam acquires them. */
export function scanOrder(visibleSlugs: readonly string[]): ScanTarget[] {
  return visibleSlugs
    .map((slug) => ({ slug, conic: conicAngle(slug) }))
    .sort((a, b) => a.conic - b.conic);
}
