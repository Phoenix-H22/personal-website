"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  heroMotionFamily,
  readViewportMetrics,
  resolveLayoutMode,
  type HeroMotionFamily,
  type LayoutMode,
  type ViewportMetrics,
} from "@/lib/concept-v3-rebuild/layout-mode";

interface LayoutModeContextValue {
  mode: LayoutMode;
  heroFamily: HeroMotionFamily;
  metrics: ViewportMetrics;
  layoutDebug: boolean;
  ready: boolean;
}

const LayoutModeContext = createContext<LayoutModeContextValue | null>(null);

const SSR_METRICS: ViewportMetrics = {
  width: 1280,
  height: 800,
  aspect: 1.6,
  visualWidth: 1280,
  visualHeight: 800,
  dpr: 1,
};

function readLayoutDebugFlag(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  try {
    return new URLSearchParams(window.location.search).get("layoutDebug") === "1";
  } catch {
    return false;
  }
}

function useLayoutDebugFlag() {
  return useSyncExternalStore(
    () => () => undefined,
    readLayoutDebugFlag,
    () => false,
  );
}

function applyDocumentMode(mode: LayoutMode) {
  const root = document.documentElement;
  root.dataset.layoutMode = mode;
  const rebuild = document.querySelector("[data-concept-rebuild]");
  if (rebuild instanceof HTMLElement) {
    rebuild.dataset.layoutMode = mode;
  }
}

interface LayoutModeProviderProps {
  children: ReactNode;
}

export function LayoutModeProvider({ children }: LayoutModeProviderProps) {
  const layoutDebug = useLayoutDebugFlag();
  // SSR + first client paint must match to avoid hydration attribute lock-in.
  const [metrics, setMetrics] = useState<ViewportMetrics>(SSR_METRICS);
  const [mode, setMode] = useState<LayoutMode>("standard-desktop");
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    const next = readViewportMetrics();
    const nextMode = resolveLayoutMode(next.width, next.height);
    setMetrics(next);
    setMode((prev) => (prev === nextMode ? prev : nextMode));
    applyDocumentMode(nextMode);
  }, []);

  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      refresh();
      setReady(true);
    });
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(refresh);
    };
    window.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onResize);
    };
  }, [refresh]);

  const value = useMemo<LayoutModeContextValue>(
    () => ({
      mode,
      heroFamily: heroMotionFamily(mode),
      metrics,
      layoutDebug,
      ready,
    }),
    [mode, metrics, layoutDebug, ready],
  );

  return (
    <LayoutModeContext.Provider value={value}>
      {children}
    </LayoutModeContext.Provider>
  );
}

export function useLayoutMode() {
  const ctx = useContext(LayoutModeContext);
  if (!ctx) {
    throw new Error("useLayoutMode must be used within LayoutModeProvider");
  }
  return ctx;
}

/** Safe for optional consumers outside provider (returns desktop defaults). */
export function useLayoutModeOptional(): LayoutModeContextValue {
  const ctx = useContext(LayoutModeContext);
  return (
    ctx ?? {
      mode: "standard-desktop",
      heroFamily: "cinematic",
      metrics: SSR_METRICS,
      layoutDebug: false,
      ready: false,
    }
  );
}
