import type { CSSProperties } from "react";

/** Two-digit, 1-based position label, e.g. index 0 -> "01". */
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/**
 * Lets a style object carry CSS custom properties (e.g. `--nx`) that the
 * SCSS module consumes, without fighting the CSSProperties type.
 */
export function cssVars(vars: Record<string, string | number>): CSSProperties {
  return vars as CSSProperties;
}
