/**
 * Motion preference architecture
 *
 * Priority (highest first):
 * 1. Development query override: `?motionOverride=full` (NODE_ENV=development only)
 * 2. Explicit stored user preference (`localStorage` key below)
 * 3. Full Motion as the normal public fallback
 *
 * Production never reads query overrides.
 * Operating-system reduced motion is reported for diagnostics but does not
 * override the site's full-motion default.
 * Public UI does not expose a Motion control; storage remains ready for a
 * later footer / accessibility preference surface.
 */

export const MOTION_PREFERENCE_KEY = "portfolio-motion-preference-v4";
export const LEGACY_MOTION_PREFERENCE_KEYS = [
  "portfolio-motion-preference-v3",
] as const;

/** Explicit stored choice, or `null` when none is stored (follow OS → Full). */
export type MotionPreference = "full" | "reduced" | null;
export type EffectiveMotion = "full" | "reduced";

export const MOTION_PREFERENCE_EVENT = "portfolio:motion-preference";

export function parseMotionPreference(value: unknown): MotionPreference {
  if (value === "full" || value === "reduced") {
    return value;
  }
  return null;
}

function migrateStoredMotionPreference(storage: Storage) {
  for (const key of LEGACY_MOTION_PREFERENCE_KEYS) storage.removeItem(key);
  const rawPreference = storage.getItem(MOTION_PREFERENCE_KEY);
  if (rawPreference !== null && parseMotionPreference(rawPreference) === null) {
    storage.removeItem(MOTION_PREFERENCE_KEY);
  }
}

export function readStoredMotionPreference(): MotionPreference {
  if (typeof window === "undefined") return null;
  try {
    migrateStoredMotionPreference(window.localStorage);
    return parseMotionPreference(window.localStorage.getItem(MOTION_PREFERENCE_KEY));
  } catch {
    return null;
  }
}

export function writeStoredMotionPreference(preference: MotionPreference) {
  if (typeof window === "undefined") return;
  try {
    migrateStoredMotionPreference(window.localStorage);
    if (preference === null) {
      window.localStorage.removeItem(MOTION_PREFERENCE_KEY);
    } else {
      window.localStorage.setItem(MOTION_PREFERENCE_KEY, preference);
    }
  } catch {
    /* ignore quota / private mode */
  }
  applyMotionAttributes(preference);
  window.dispatchEvent(
    new CustomEvent(MOTION_PREFERENCE_EVENT, { detail: { preference } }),
  );
}

export function clearStoredMotionPreference() {
  writeStoredMotionPreference(null);
}

export function readSystemReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function readDevOverrideFull(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV !== "development") return false;
  return new URLSearchParams(window.location.search).get("motionOverride") === "full";
}

export function resolveEffectiveMotion(
  storedPreference: MotionPreference,
  _systemRequestsReducedMotion: boolean,
  overrideFull = false,
): EffectiveMotion {
  if (overrideFull) return "full";
  if (storedPreference === "full") return "full";
  if (storedPreference === "reduced") return "reduced";
  return "full";
}

export function applyMotionAttributes(
  preference: MotionPreference = readStoredMotionPreference(),
  systemReduced: boolean = readSystemReducedMotion(),
  overrideFull: boolean = readDevOverrideFull(),
) {
  if (typeof document === "undefined") return;
  const effective = resolveEffectiveMotion(preference, systemReduced, overrideFull);
  if (preference) {
    document.documentElement.dataset.motionPreference = preference;
  } else {
    document.documentElement.removeAttribute("data-motion-preference");
  }
  document.documentElement.dataset.effectiveMotion = effective;
  return { preference, effective };
}

/** Inline script for root layout — runs before hydration paint. */
export function getMotionBootstrapScript() {
  const allowDevOverride = process.env.NODE_ENV === "development";
  return `(function(){var k=${JSON.stringify(MOTION_PREFERENCE_KEY)};var legacy=${JSON.stringify(LEGACY_MOTION_PREFERENCE_KEYS)};var pref=null;try{for(var i=0;i<legacy.length;i++)localStorage.removeItem(legacy[i]);var raw=localStorage.getItem(k);pref=(raw==="full"||raw==="reduced")?raw:null;if(raw!==null&&pref===null)localStorage.removeItem(k);}catch(err){}var params=new URLSearchParams(location.search);var override=${allowDevOverride}&&params.get("motionOverride")==="full";var effective=override?"full":pref==="reduced"?"reduced":"full";if(pref){document.documentElement.setAttribute("data-motion-preference",pref);}else{document.documentElement.removeAttribute("data-motion-preference");}document.documentElement.setAttribute("data-effective-motion",effective);})();`;
}
