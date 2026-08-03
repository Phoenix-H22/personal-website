import type { CSSProperties } from "react";

import {
  getAdaptiveSignalRoute,
  ORBIT_VIEW_BOX,
} from "@/components/portfolio/hero/adaptive-orbit-geometry";
import styles from "@/styles/portfolio/adaptive-engineer-hero.module.scss";

export { getAdaptiveSignalRoute } from "@/components/portfolio/hero/adaptive-orbit-geometry";

interface AdaptiveSignalRouteProps {
  activeIndex: number;
  projectCount: number;
  revision: number;
}

interface SignalRouteStyle extends CSSProperties {
  "--signal-route-from": number;
}

export function AdaptiveSignalRoute({
  activeIndex,
  projectCount,
  revision,
}: AdaptiveSignalRouteProps) {
  const route = getAdaptiveSignalRoute(activeIndex, projectCount);
  const routeKey = `${route.fromIndex}-${route.toIndex}-${revision}`;
  const style: SignalRouteStyle = {
    "--signal-route-from": route.fromIndex,
  };

  return (
    <div
      key={`route-${routeKey}`}
      className={styles.signalRoute}
      style={style}
      aria-hidden="true"
      data-signal-route
      data-route-revision={revision}
      data-route-direction={route.direction}
      data-route-from={route.fromIndex}
      data-route-to={route.toIndex}
      data-route-wrap={route.wraps}
    >
      <svg
        className={styles.signalRouteOrbit}
        viewBox={ORBIT_VIEW_BOX}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
        data-signal-route-orbit
      >
        <path
          className={styles.signalRouteOrbitTrack}
          pathLength="100"
          fill="none"
          d={route.desktopPath}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          data-signal-route-track
        />
        <g>
          <path
            className={styles.signalRouteOrbitProgress}
            pathLength="100"
            fill="none"
            d={route.desktopPath}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            data-signal-route-progress
          />
          <path
            className={styles.signalRouteOrbitHead}
            pathLength="100"
            fill="none"
            d={route.desktopPath}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            data-signal-route-head
          />
        </g>
      </svg>

      <div className={styles.signalRouteLinear} data-signal-route-linear>
        <span
          className={styles.signalRouteLinearTrack}
          data-signal-route-track
        />
        <span
          className={styles.signalRouteLinearSegment}
          data-signal-route-segment
        >
          <span
            className={styles.signalRouteLinearProgress}
            data-signal-route-progress
          />
          <span
            className={styles.signalRouteLinearHead}
            data-signal-route-head
          />
        </span>
      </div>
    </div>
  );
}
