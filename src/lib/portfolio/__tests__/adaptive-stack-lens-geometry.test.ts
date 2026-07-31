import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { ADAPTIVE_STACK_LENS_MODES } from "@/lib/portfolio/adaptive-stack-lens";
import {
  boundaryPath,
  LENS_GEOMETRIES,
  markerSide,
  ORBIT_LENS_GEOMETRY,
  semanticSideLabelDirection,
  sideMidpoint,
  type LensGeometry,
  type LensMarkerId,
} from "@/lib/portfolio/adaptive-stack-lens.geometry";

const markerIds: LensMarkerId[] = [
  "commerce",
  "connected",
  "product",
  "automation",
];

const midpointCases: Array<[
  string,
  LensGeometry,
  Record<LensMarkerId, { x: number; y: number }>,
]> = [
  [
    "orbit",
    ORBIT_LENS_GEOMETRY,
    {
      commerce: { x: 317, y: 32 },
      connected: { x: 590, y: 304 },
      product: { x: 334, y: 574 },
      automation: { x: 62, y: 289 },
    },
  ],
];

describe("Adaptive Stack Lens canonical geometry", () => {
  it.each(Object.values(LENS_GEOMETRIES))(
    "$id geometry contains four valid marker edges",
    (geometry) => {
      expect(geometry.semanticSides.map(({ id }) => id)).toEqual(markerIds);
      expect(geometry.semanticSides).toHaveLength(4);
      for (const side of geometry.semanticSides) {
        expect(geometry.boundaryPointIds).toContain(side.startPointId);
        expect(geometry.boundaryPointIds).toContain(side.endPointId);
      }
      for (const point of Object.values(geometry.points)) {
        expect(Number.isFinite(point.x)).toBe(true);
        expect(Number.isFinite(point.y)).toBe(true);
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(geometry.viewBox.width);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(geometry.viewBox.height);
      }
    },
  );

  it.each(midpointCases)(
    "%s marker positions are mathematical edge midpoints",
    (_name, geometry, expected) => {
      for (const markerId of markerIds) {
        expect(sideMidpoint(geometry, markerSide(geometry, markerId))).toEqual(
          expected[markerId],
        );
      }
    },
  );

  it.each(Object.values(LENS_GEOMETRIES))(
    "$id semantic sides represent top, right, bottom, and left",
    (geometry) => {
      expect(
        Object.fromEntries(geometry.semanticSides.map(({ id, side }) => [id, side])),
      ).toEqual({
        commerce: "top",
        connected: "right",
        product: "bottom",
        automation: "left",
      });

      const top = markerSide(geometry, "commerce");
      const right = markerSide(geometry, "connected");
      const bottom = markerSide(geometry, "product");
      const left = markerSide(geometry, "automation");
      expect(geometry.points[top.startPointId].y).toBe(
        geometry.points[top.endPointId].y,
      );
      expect(geometry.points[right.startPointId].x).toBe(
        geometry.points[right.endPointId].x,
      );
      expect(geometry.points[bottom.startPointId].y).toBe(
        geometry.points[bottom.endPointId].y,
      );
      expect(left.startPointId).toBe("upperLeftShoulder");
      expect(left.endPointId).toBe("lowerLeftShoulder");
      expect(
        Math.abs(sideMidpoint(geometry, right).y - geometry.viewBox.height / 2),
      ).toBeLessThanOrEqual(25);
      expect(
        Math.abs(sideMidpoint(geometry, left).y - geometry.viewBox.height / 2),
      ).toBeLessThanOrEqual(25);
      expect(semanticSideLabelDirection(top.side)).toBe("bottom");
      expect(semanticSideLabelDirection(right.side)).toBe("left");
      expect(semanticSideLabelDirection(bottom.side)).toBe("top");
      expect(semanticSideLabelDirection(left.side)).toBe("right");
    },
  );

  it("maps marker IDs to exactly the four configured contexts", () => {
    expect(ADAPTIVE_STACK_LENS_MODES.map(({ id }) => id)).toEqual(markerIds);
  });

  it("generates each SVG boundary from its canonical point sequence", () => {
    for (const geometry of Object.values(LENS_GEOMETRIES)) {
      const generated = boundaryPath(geometry);
      for (const pointId of geometry.boundaryPointIds) {
        const point = geometry.points[pointId];
        expect(generated).toContain(`${point.x} ${point.y}`);
      }
      expect(generated.endsWith(" Z")).toBe(geometry.boundaryClosed);
    }
  });
});

describe("Adaptive Stack Lens geometry structure", () => {
  const root = process.cwd();
  const component = fs.readFileSync(
    path.join(root, "src/components/portfolio/hero/adaptive-stack-lens.tsx"),
    "utf8",
  );
  const stylesheet = fs.readFileSync(
    path.join(root, "src/styles/portfolio/adaptive-engineer-hero.module.scss"),
    "utf8",
  );
  const qa = fs.readFileSync(
    path.join(root, "scripts/run-phase-e3-marker-qa.mjs"),
    "utf8",
  );

  it("uses canonical paths and exact SVG transforms without old coordinate systems", () => {
    expect(component).toContain("boundaryPath(ORBIT_LENS_GEOMETRY)");
    expect(component).toContain("sideMidpoint(geometry, side)");
    expect(component).toContain("getScreenCTM()");
    expect(component).toContain("new DOMPoint(midpoint.x, midpoint.y)");
    expect(component).toContain("new ResizeObserver");
    expect(component).not.toMatch(/preserveAspectRatio="none"|LENS_MARKER_ANCHORS/);
    expect(component).not.toMatch(/--marker-(?:x|y|mobile)/);
    expect(component).not.toContain("M72 164V102");
    expect(stylesheet).not.toMatch(/--marker-(?:x|y|mobile)|100cqw|100cqh/);
  });

  it("keeps projected nodes coordinate-neutral and labels in reserved ring areas", () => {
    expect(stylesheet).toMatch(
      /\.contextNumber\s*{[^}]*top:\s*var\(--marker-top\);[^}]*left:\s*var\(--marker-left\);/,
    );
    expect(stylesheet).toMatch(
      /data-label-direction="bottom"[^}]*grid-area:\s*1\s*\/\s*2/,
    );
    expect(stylesheet).toMatch(
      /data-label-direction="left"[^}]*grid-area:\s*2\s*\/\s*3/,
    );
    expect(stylesheet).not.toMatch(
      /data-lens-position="(?:commerce|connected|product|automation)"[^}]*\.contextLabel/,
    );
  });

  it("derives QA expectations from canonical SVG geometry rather than marker CSS", () => {
    expect(qa).toContain("getScreenCTM()");
    expect(qa).toContain("sideMidpoint");
    expect(qa).not.toMatch(/expectedAnchors|expectedMobileAnchors|parseFloat\(.*left/);
  });
});
