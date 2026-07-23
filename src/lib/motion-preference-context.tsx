"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  MOTION_PREFERENCE_EVENT,
  MOTION_PREFERENCE_KEY,
  applyMotionAttributes,
  clearStoredMotionPreference,
  parseMotionPreference,
  readDevOverrideFull,
  readStoredMotionPreference,
  readSystemReducedMotion,
  resolveEffectiveMotion,
  writeStoredMotionPreference,
  type EffectiveMotion,
  type MotionPreference,
} from "@/lib/motion-preference";

type MotionPreferenceContextValue = {
  preference: MotionPreference;
  systemReduced: boolean;
  overrideFull: boolean;
  effective: EffectiveMotion;
  setPreference: (preference: MotionPreference) => void;
  clearPreference: () => void;
};

const MotionPreferenceContext = createContext<MotionPreferenceContextValue | null>(
  null,
);

function subscribePreference(onStoreChange: () => void) {
  const onCustom = () => onStoreChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key === MOTION_PREFERENCE_KEY) onStoreChange();
  };
  window.addEventListener(MOTION_PREFERENCE_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(MOTION_PREFERENCE_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

function subscribeSystemReduced(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore(
    subscribePreference,
    readStoredMotionPreference,
    () => null as MotionPreference,
  );
  const systemReduced = useSyncExternalStore(
    subscribeSystemReduced,
    readSystemReducedMotion,
    // SSR cannot know OS preference; bootstrap script owns first paint.
    () => false,
  );
  const overrideFull = useSyncExternalStore(
    () => () => undefined,
    readDevOverrideFull,
    () => false,
  );

  const effective = resolveEffectiveMotion(preference, systemReduced, overrideFull);

  useEffect(() => {
    // Always re-read media/override — hydration's useSyncExternalStore server
    // snapshot can briefly claim systemReduced=false and must not clobber the
    // pre-hydration bootstrap attributes with a wrong effective state.
    applyMotionAttributes(
      preference,
      readSystemReducedMotion(),
      readDevOverrideFull(),
    );
  }, [preference, systemReduced, overrideFull]);

  const setPreference = useCallback((next: MotionPreference) => {
    writeStoredMotionPreference(parseMotionPreference(next));
  }, []);

  const clearPreference = useCallback(() => {
    clearStoredMotionPreference();
  }, []);

  const value = useMemo(
    () => ({
      preference,
      systemReduced,
      overrideFull,
      effective,
      setPreference,
      clearPreference,
    }),
    [
      preference,
      systemReduced,
      overrideFull,
      effective,
      setPreference,
      clearPreference,
    ],
  );

  return (
    <MotionPreferenceContext.Provider value={value}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

export function useMotionPreference() {
  const ctx = useContext(MotionPreferenceContext);
  if (!ctx) {
    throw new Error("useMotionPreference must be used within MotionPreferenceProvider");
  }
  return ctx;
}
