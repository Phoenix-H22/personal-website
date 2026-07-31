export type LensMarkerId = "commerce" | "connected" | "product" | "automation";
export type LensGeometryId = "orbit";
export type LensSide = "top" | "right" | "bottom" | "left";
export type LensLabelDirection = "top" | "right" | "bottom" | "left";

export interface LensPoint {
  x: number;
  y: number;
}

export interface LensSemanticSide {
  id: LensMarkerId;
  side: LensSide;
  startPointId: string;
  endPointId: string;
}

export interface LensGeometry {
  id: LensGeometryId;
  viewBox: { width: number; height: number };
  points: Readonly<Record<string, LensPoint>>;
  boundaryPointIds: readonly string[];
  boundaryClosed: boolean;
  semanticSides: readonly LensSemanticSide[];
  coreEntryPointIds: Readonly<Partial<Record<LensSide, readonly [string, string]>>>;
  depthPlanePointIds: readonly string[];
  coreBoundaryPointIds: readonly string[];
}

const DESKTOP_POINTS = {
  gapUpper: { x: 72, y: 164 },
  upperLeftShoulder: { x: 72, y: 102 },
  topLeft: { x: 142, y: 32 },
  topRight: { x: 492, y: 32 },
  upperRightShoulder: { x: 590, y: 130 },
  lowerRightShoulder: { x: 590, y: 478 },
  bottomRight: { x: 518, y: 574 },
  bottomLeft: { x: 150, y: 574 },
  lowerLeftShoulder: { x: 52, y: 476 },
  gapLower: { x: 52, y: 402 },
  depthTopLeft: { x: 132, y: 190 },
  depthInnerTopLeft: { x: 168, y: 154 },
  depthInnerTopRight: { x: 470, y: 154 },
  depthTopRight: { x: 508, y: 190 },
  depthBottomRight: { x: 508, y: 430 },
  depthInnerBottomRight: { x: 472, y: 466 },
  depthInnerBottomLeft: { x: 168, y: 466 },
  depthBottomLeft: { x: 130, y: 428 },
  coreTopLeft: { x: 150, y: 206 },
  coreInnerTopLeft: { x: 176, y: 180 },
  coreInnerTopRight: { x: 454, y: 180 },
  coreTopRight: { x: 488, y: 214 },
  coreBottomRight: { x: 488, y: 410 },
  coreInnerBottomRight: { x: 460, y: 438 },
  coreInnerBottomLeft: { x: 176, y: 438 },
  coreBottomLeft: { x: 150, y: 412 },
} as const satisfies Readonly<Record<string, LensPoint>>;

export const ORBIT_LENS_GEOMETRY: LensGeometry = {
  id: "orbit",
  viewBox: { width: 640, height: 620 },
  points: DESKTOP_POINTS,
  boundaryPointIds: [
    "gapUpper",
    "upperLeftShoulder",
    "topLeft",
    "topRight",
    "upperRightShoulder",
    "lowerRightShoulder",
    "bottomRight",
    "bottomLeft",
    "lowerLeftShoulder",
    "gapLower",
  ],
  boundaryClosed: false,
  semanticSides: [
    {
      id: "commerce",
      side: "top",
      startPointId: "topLeft",
      endPointId: "topRight",
    },
    {
      id: "connected",
      side: "right",
      startPointId: "upperRightShoulder",
      endPointId: "lowerRightShoulder",
    },
    {
      id: "product",
      side: "bottom",
      startPointId: "bottomLeft",
      endPointId: "bottomRight",
    },
    {
      id: "automation",
      side: "left",
      startPointId: "upperLeftShoulder",
      endPointId: "lowerLeftShoulder",
    },
  ],
  coreEntryPointIds: {
    top: ["coreInnerTopLeft", "coreInnerTopRight"],
    right: ["coreTopRight", "coreBottomRight"],
    bottom: ["coreInnerBottomLeft", "coreInnerBottomRight"],
    left: ["coreTopLeft", "coreBottomLeft"],
  },
  depthPlanePointIds: [
    "depthTopLeft",
    "depthInnerTopLeft",
    "depthInnerTopRight",
    "depthTopRight",
    "depthBottomRight",
    "depthInnerBottomRight",
    "depthInnerBottomLeft",
    "depthBottomLeft",
  ],
  coreBoundaryPointIds: [
    "coreTopLeft",
    "coreInnerTopLeft",
    "coreInnerTopRight",
    "coreTopRight",
    "coreBottomRight",
    "coreInnerBottomRight",
    "coreInnerBottomLeft",
    "coreBottomLeft",
  ],
};

export const LENS_GEOMETRIES = {
  orbit: ORBIT_LENS_GEOMETRY,
} as const;

export function lensPoint(geometry: LensGeometry, pointId: string): LensPoint {
  return geometry.points[pointId];
}

export function markerSide(
  geometry: LensGeometry,
  markerId: LensMarkerId,
): LensSemanticSide {
  const side = geometry.semanticSides.find(({ id }) => id === markerId);
  if (!side) throw new Error(`Missing ${markerId} side in ${geometry.id} geometry`);
  return side;
}

export function sideMidpoint(
  geometry: LensGeometry,
  side: LensSemanticSide,
): LensPoint {
  const start = lensPoint(geometry, side.startPointId);
  const end = lensPoint(geometry, side.endPointId);
  return {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };
}

export function routeToCorePath(
  geometry: LensGeometry,
  markerId: LensMarkerId,
): string {
  const side = markerSide(geometry, markerId);
  const start = sideMidpoint(geometry, side);
  const entryPointIds = geometry.coreEntryPointIds[side.side];
  if (!entryPointIds) {
    throw new Error(`Missing ${side.side} core entry in ${geometry.id} geometry`);
  }
  const end = sideMidpoint(geometry, {
    ...side,
    startPointId: entryPointIds[0],
    endPointId: entryPointIds[1],
  });

  if (side.side === "top" || side.side === "bottom") {
    const elbowY = (start.y + end.y) / 2;
    return `M${start.x} ${start.y} V${elbowY} H${end.x} V${end.y}`;
  }

  const elbowX = (start.x + end.x) / 2;
  return `M${start.x} ${start.y} H${elbowX} V${end.y} H${end.x}`;
}

export function semanticSideLabelDirection(
  side: LensSide,
): LensLabelDirection {
  if (side === "top") return "bottom";
  if (side === "right") return "left";
  if (side === "bottom") return "top";
  return "right";
}

export function lensPath(
  geometry: LensGeometry,
  pointIds: readonly string[],
  closed = false,
): string {
  const commands = pointIds.map((pointId, index) => {
    const point = lensPoint(geometry, pointId);
    return `${index === 0 ? "M" : "L"}${point.x} ${point.y}`;
  });
  return `${commands.join(" ")}${closed ? " Z" : ""}`;
}

export function boundaryPath(geometry: LensGeometry): string {
  return lensPath(
    geometry,
    geometry.boundaryPointIds,
    geometry.boundaryClosed,
  );
}
