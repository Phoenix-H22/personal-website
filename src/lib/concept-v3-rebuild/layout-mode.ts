/**
 * Responsive composition modes for concept-v3-rebuild.
 *
 * Modes are derived from CSS viewport width × height × aspect ratio —
 * not device names or physical inches.
 *
 * Four Hero composition families (see heroComposition):
 * - cinematic  ← spacious-desktop:  w ≥ 1400 && usable h ≥ 760
 * - laptop     ← standard-desktop:  w ≥ 1080 && usable h ≥ 680 (and not cinematic)
 * - short-landscape:                w ≥ 1050 && usable h < 680  (height-driven,
 *                                   e.g. 1251×611, 1280×600, 1366×625)
 * - narrative  ← medium-landscape / portrait-tablet / mobile
 *
 * Structural layout is CSS media-query driven (SSR-safe, no hydration flash);
 * this resolver drives motion family + debug reporting and must stay in sync
 * with the media-query breakpoints in hero.module.scss.
 */

export type LayoutMode =
  | "spacious-desktop"
  | "standard-desktop"
  | "short-landscape"
  | "medium-landscape"
  | "portrait-tablet"
  | "mobile";

/** Maps layout mode → Hero GSAP entrance family. */
export type HeroMotionFamily =
  | "cinematic"
  | "short-landscape"
  | "layered"
  | "narrative";

/** The four Hero composition families that structural CSS keys off. */
export type HeroComposition =
  | "cinematic"
  | "laptop"
  | "short-landscape"
  | "narrative";

export interface ViewportMetrics {
  width: number;
  height: number;
  aspect: number;
  visualWidth: number;
  visualHeight: number;
  dpr: number;
}

export function readViewportMetrics(): ViewportMetrics {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const vv = window.visualViewport;
  return {
    width,
    height,
    aspect: width / Math.max(height, 1),
    visualWidth: vv?.width ?? width,
    visualHeight: vv?.height ?? height,
    dpr: window.devicePixelRatio || 1,
  };
}

export function resolveLayoutMode(
  width: number,
  height: number,
): LayoutMode {
  if (width < 768) return "mobile";

  // Short landscape is height-driven: wide enough but short usable height.
  // Covers 1251×611, 1280×600, 1280×650, 1366×625, and short browser windows.
  if (width >= 1050 && height < 680) return "short-landscape";

  // Cinematic constellation — spacious desktop.
  if (width >= 1400 && height >= 760) return "spacious-desktop";

  // Laptop constellation — same structure, tighter.
  if (width >= 1080 && height >= 680) return "standard-desktop";

  // Narrative flow (tablet / medium landscape / mobile).
  if (width >= 768 && height >= width) return "portrait-tablet";

  return "medium-landscape";
}

export function heroMotionFamily(mode: LayoutMode): HeroMotionFamily {
  switch (mode) {
    case "spacious-desktop":
    case "standard-desktop":
      return "cinematic";
    case "short-landscape":
      return "short-landscape";
    case "medium-landscape":
    case "portrait-tablet":
      return "layered";
    default:
      return "narrative";
  }
}

/** Maps layout mode → one of the four Hero composition families. */
export function heroComposition(mode: LayoutMode): HeroComposition {
  switch (mode) {
    case "spacious-desktop":
      return "cinematic";
    case "standard-desktop":
      return "laptop";
    case "short-landscape":
      return "short-landscape";
    default:
      return "narrative";
  }
}

export function isDesktopConstellation(mode: LayoutMode): boolean {
  return mode === "spacious-desktop" || mode === "standard-desktop";
}

export function isCompactProofStrip(mode: LayoutMode): boolean {
  return mode === "short-landscape";
}
