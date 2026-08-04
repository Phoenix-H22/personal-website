import type { CSSProperties } from "react";

export type OrbitNodeIndex = 0 | 1 | 2 | 3;

interface OrbitPoint {
  readonly x: number;
  readonly y: number;
}

export interface SignalRouteDefinition {
  readonly fromIndex: OrbitNodeIndex;
  readonly toIndex: OrbitNodeIndex;
  readonly direction: "forward" | "reverse";
  readonly wraps: boolean;
  readonly desktopPath: string;
}

interface OrbitGeometryStyle extends CSSProperties {
  "--desktop-orbit-label-font-size": string;
  "--desktop-orbit-label-gap": string;
  "--desktop-signal-node-size": string;
  "--orbit-aspect-ratio": string;
}

export const ORBIT_GEOMETRY = {
  viewBox: {
    width: 640,
    height: 512,
  },
  anchors: [
    { x: 320, y: 36 },
    { x: 588, y: 256 },
    { x: 320, y: 476 },
    { x: 52, y: 256 },
  ],
  cornerInset: 24,
  marker: {
    size: 36,
    connectorGap: 6,
    sideLabelClearance: 12,
    // Preserve approved label proportions when the wide orbit scales.
    labelGapRatio: 0.18,
    labelFontSizeRatio: 0.345,
  },
} as const satisfies {
  readonly viewBox: { readonly width: number; readonly height: number };
  readonly anchors: readonly OrbitPoint[];
  readonly cornerInset: number;
  readonly marker: {
    readonly size: number;
    readonly connectorGap: number;
    readonly sideLabelClearance: number;
    readonly labelGapRatio: number;
    readonly labelFontSizeRatio: number;
  };
};

export const ORBIT_VIEW_BOX = `0 0 ${ORBIT_GEOMETRY.viewBox.width} ${ORBIT_GEOMETRY.viewBox.height}`;

function toOrbitCqi(length: number) {
  return `${(length / ORBIT_GEOMETRY.viewBox.width) * 100}cqi`;
}

export const ORBIT_GEOMETRY_STYLE: OrbitGeometryStyle = {
  "--desktop-orbit-label-font-size": toOrbitCqi(
    ORBIT_GEOMETRY.marker.size * ORBIT_GEOMETRY.marker.labelFontSizeRatio,
  ),
  "--desktop-orbit-label-gap": toOrbitCqi(
    ORBIT_GEOMETRY.marker.size * ORBIT_GEOMETRY.marker.labelGapRatio,
  ),
  "--desktop-signal-node-size": toOrbitCqi(ORBIT_GEOMETRY.marker.size),
  "--orbit-aspect-ratio": `${ORBIT_GEOMETRY.viewBox.width} / ${ORBIT_GEOMETRY.viewBox.height}`,
};

export function getConnectorGap() {
  return (
    ORBIT_GEOMETRY.marker.size / 2 +
    ORBIT_GEOMETRY.marker.connectorGap
  );
}

export function getNodeAnchor(index: number): OrbitPoint {
  const anchor = ORBIT_GEOMETRY.anchors[index];
  if (!anchor) throw new Error(`Invalid Adaptive Orbit node index: ${index}`);
  return anchor;
}

export function getNodePositionStyle(index: number): CSSProperties {
  const anchor = getNodeAnchor(index);
  return {
    left: `${(anchor.x / ORBIT_GEOMETRY.viewBox.width) * 100}%`,
    top: `${(anchor.y / ORBIT_GEOMETRY.viewBox.height) * 100}%`,
  };
}

export function buildRoutePath(fromIndex: OrbitNodeIndex): string {
  const [top, right, bottom, left] = ORBIT_GEOMETRY.anchors;
  const gap = getConnectorGap();
  const sideLabelGap =
    gap +
    ORBIT_GEOMETRY.marker.size / 2 +
    ORBIT_GEOMETRY.marker.sideLabelClearance;
  const inset = ORBIT_GEOMETRY.cornerInset;

  switch (fromIndex) {
    case 0:
      return `M${top.x + gap} ${top.y} H${right.x - inset} L${right.x} ${top.y + inset} V${right.y - gap}`;
    case 1:
      return `M${right.x} ${right.y + sideLabelGap} V${bottom.y - inset} L${right.x - inset} ${bottom.y} H${bottom.x + gap}`;
    case 2:
      return `M${bottom.x - gap} ${bottom.y} H${left.x + inset} L${left.x} ${bottom.y - inset} V${left.y + sideLabelGap}`;
    case 3:
      return `M${left.x} ${left.y - gap} V${top.y + inset} L${left.x + inset} ${top.y} H${top.x - gap}`;
  }
}

const ROUTE_METADATA = [
  { fromIndex: 0, toIndex: 1, direction: "forward", wraps: false },
  { fromIndex: 1, toIndex: 2, direction: "forward", wraps: false },
  { fromIndex: 2, toIndex: 3, direction: "forward", wraps: false },
  { fromIndex: 3, toIndex: 0, direction: "reverse", wraps: true },
] as const;

const SIGNAL_ROUTES: readonly SignalRouteDefinition[] = ROUTE_METADATA.map(
  (route) => ({
    ...route,
    desktopPath: buildRoutePath(route.fromIndex),
  }),
);

export const ORBIT_FRAME_SEGMENTS = SIGNAL_ROUTES.map((route) => ({
  id: `${route.fromIndex}-${route.toIndex}`,
  path: route.desktopPath,
}));

export function getAdaptiveSignalRoute(activeIndex: number, projectCount: number) {
  if (projectCount !== SIGNAL_ROUTES.length) {
    throw new Error("Adaptive Signal Route requires exactly four projects");
  }

  const route = SIGNAL_ROUTES[activeIndex];
  if (!route) {
    throw new Error(`Invalid Adaptive Signal Route index: ${activeIndex}`);
  }

  return route;
}
