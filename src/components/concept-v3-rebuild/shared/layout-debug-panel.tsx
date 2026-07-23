"use client";

import { useEffect, useState } from "react";

import { useLayoutMode } from "@/components/concept-v3-rebuild/shared/layout-mode-provider";
import { useMotionPreference } from "@/lib/motion-preference-context";
import styles from "@/styles/concept-v3-rebuild/layout-debug.module.scss";

/**
 * Development-only layout inspector. Activated via `?layoutDebug=1`.
 * Never rendered in production builds.
 */
export function LayoutDebugPanel() {
  const { mode, heroFamily, metrics, layoutDebug } = useLayoutMode();
  const { effective } = useMotionPreference();
  const [filmstrip, setFilmstrip] = useState({
    overflowing: "—",
    alignment: "—",
  });

  useEffect(() => {
    if (!layoutDebug) return;
    const read = () => {
      const scroll = document.querySelector<HTMLElement>(
        "[data-main-reel] [data-film-scroll]",
      );
      const overflowing = scroll?.dataset.overflowing ?? "—";
      setFilmstrip({
        overflowing,
        alignment: overflowing === "false" ? "centered" : overflowing === "true" ? "scroll-center" : "—",
      });
    };
    read();
    const id = window.setInterval(read, 500);
    return () => window.clearInterval(id);
  }, [layoutDebug, mode]);

  if (process.env.NODE_ENV !== "development" || !layoutDebug) {
    return null;
  }

  return (
    <aside className={styles.panel} data-layout-debug-panel aria-live="polite">
      <strong className={styles.title}>Layout debug</strong>
      <dl className={styles.list}>
        <div>
          <dt>inner</dt>
          <dd>
            {metrics.width} × {metrics.height}
          </dd>
        </div>
        <div>
          <dt>visualViewport</dt>
          <dd>
            {Math.round(metrics.visualWidth)} × {Math.round(metrics.visualHeight)}
          </dd>
        </div>
        <div>
          <dt>dpr</dt>
          <dd>{metrics.dpr}</dd>
        </div>
        <div>
          <dt>aspect</dt>
          <dd>{metrics.aspect.toFixed(3)}</dd>
        </div>
        <div>
          <dt>layoutMode</dt>
          <dd data-debug-layout-mode>{mode}</dd>
        </div>
        <div>
          <dt>heroGrid</dt>
          <dd>{heroFamily}</dd>
        </div>
        <div>
          <dt>filmstripOverflow</dt>
          <dd>{filmstrip.overflowing}</dd>
        </div>
        <div>
          <dt>filmstripAlign</dt>
          <dd>{filmstrip.alignment}</dd>
        </div>
        <div>
          <dt>motion</dt>
          <dd>{effective}</dd>
        </div>
      </dl>
    </aside>
  );
}
