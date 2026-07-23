/**
 * Responsive composition modes for concept-v3-rebuild.
 *
 * Modes are derived from CSS viewport width × height × aspect ratio —
 * not device names or physical inches.
 *
 * Boundaries (documented for QA):
 * - spacious-desktop:  w ≥ 1440 && h ≥ 800
 * - standard-desktop:  w ≥ 1280 && h ≥ 700 (and not spacious)
 * - short-landscape:   wide + short height (e.g. 1251×611);
 *                      typically w ≥ 1080 && h < 700 && aspect ≥ 1.55
 * - medium-landscape:  ~768–1079 wide landscape, or tablet landscape
 * - portrait-tablet:   w ≥ 768 && h ≥ w
 * - mobile:            w < 768
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
  const aspect = width / Math.max(height, 1);
  const shortHeight = height < 700;
  const wideShort =
    width >= 1080 && shortHeight && aspect >= 1.55;

  if (width < 768) return "mobile";

  if (wideShort || (width >= 1080 && width < 1400 && height >= 560 && height < 700)) {
    return "short-landscape";
  }

  // Tall-enough desktop constellation
  if (width >= 1440 && height >= 800) return "spacious-desktop";
  if (width >= 1280 && height >= 700) return "standard-desktop";

  // Remaining short desktop widths that didn't meet aspect gate
  if (width >= 1280 && shortHeight) return "short-landscape";

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

export function isDesktopConstellation(mode: LayoutMode): boolean {
  return mode === "spacious-desktop" || mode === "standard-desktop";
}

export function isCompactProofStrip(mode: LayoutMode): boolean {
  return mode === "short-landscape";
}
