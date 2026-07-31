"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import type { AdaptiveStackLensDto } from "@/lib/portfolio/adaptive-stack-lens";
import {
  boundaryPath,
  lensPath,
  lensPoint,
  markerSide,
  ORBIT_LENS_GEOMETRY,
  routeToCorePath,
  semanticSideLabelDirection,
  sideMidpoint,
  type LensGeometry,
  type LensMarkerId,
} from "@/lib/portfolio/adaptive-stack-lens.geometry";
import { LIVING_TOOLCHAIN_PAUSE_EVENT } from "@/lib/portfolio/living-toolchain";
import styles from "@/styles/portfolio/adaptive-engineer-hero.module.scss";

interface AdaptiveStackLensProps {
  modes: readonly AdaptiveStackLensDto[];
  defaultSlug: AdaptiveStackLensDto["slug"];
}

const TAB_LENS_QUERY = "(max-width: 68.6875rem)";

function geometryViewBox(geometry: LensGeometry): string {
  return `0 0 ${geometry.viewBox.width} ${geometry.viewBox.height}`;
}

function MarkerSideDefinitions({ geometry }: { geometry: LensGeometry }) {
  return geometry.semanticSides.map((side) => {
    const start = lensPoint(geometry, side.startPointId);
    const end = lensPoint(geometry, side.endPointId);
    return (
      <line
        key={side.id}
        className={styles.markerSideDefinition}
        data-marker-side-id={side.id}
        data-semantic-side={side.side}
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
      />
    );
  });
}

export function AdaptiveStackLens({ modes, defaultSlug }: AdaptiveStackLensProps) {
  const initialIndex = modes.findIndex(({ slug }) => slug === defaultSlug);
  if (initialIndex < 0) throw new Error(`Invalid Adaptive Stack Lens default: ${defaultSlug}`);

  const [pinnedIndex, setPinnedIndex] = useState(initialIndex);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const lensRoot = useRef<HTMLElement | null>(null);
  const controls = useRef<Array<HTMLButtonElement | null>>([]);
  const geometryStage = useRef<HTMLDivElement | null>(null);
  const orbitArchitecture = useRef<SVGSVGElement | null>(null);
  const markerAnchors = useRef<
    Partial<Record<LensMarkerId, HTMLLIElement | null>>
  >({});
  const activeIndex = previewIndex ?? pinnedIndex;
  const activeMode = modes[activeIndex];

  useEffect(() => {
    if (!window.CSS?.supports?.("stroke-dashoffset", "1")) {
      lensRoot.current?.setAttribute("data-route-fallback", "true");
    }
  }, []);

  useLayoutEffect(() => {
    const stage = geometryStage.current;
    if (!stage) return;
    const tabMedia = window.matchMedia(TAB_LENS_QUERY);
    let scheduledFrame: number | null = null;

    const synchronizeMarkers = () => {
      scheduledFrame = null;
      if (tabMedia.matches) {
        stage.dataset.geometry = "tabs";
        stage.dataset.markersReady = "true";
        return;
      }

      const geometry = ORBIT_LENS_GEOMETRY;
      const architecture = orbitArchitecture.current;
      const matrix = architecture?.getScreenCTM();
      if (!matrix) return;

      const stageRect = stage.getBoundingClientRect();
      for (const side of geometry.semanticSides) {
        const marker = markerAnchors.current[side.id];
        if (!marker) continue;
        const midpoint = sideMidpoint(geometry, side);
        const screenPoint = new DOMPoint(midpoint.x, midpoint.y).matrixTransform(matrix);
        marker.style.setProperty(
          "--marker-left",
          `${screenPoint.x - stageRect.left}px`,
        );
        marker.style.setProperty(
          "--marker-top",
          `${screenPoint.y - stageRect.top}px`,
        );
      }
      stage.dataset.geometry = geometry.id;
      stage.dataset.markersReady = "true";
    };

    const scheduleSynchronization = () => {
      if (scheduledFrame !== null) window.cancelAnimationFrame(scheduledFrame);
      scheduledFrame = window.requestAnimationFrame(synchronizeMarkers);
    };

    synchronizeMarkers();
    const resizeObserver = new ResizeObserver(scheduleSynchronization);
    resizeObserver.observe(stage);
    tabMedia.addEventListener("change", scheduleSynchronization);
    window.addEventListener("pageshow", scheduleSynchronization);
    void document.fonts.ready.then(scheduleSynchronization);

    return () => {
      resizeObserver.disconnect();
      tabMedia.removeEventListener("change", scheduleSynchronization);
      window.removeEventListener("pageshow", scheduleSynchronization);
      if (scheduledFrame !== null) window.cancelAnimationFrame(scheduledFrame);
    };
  }, []);

  const previewMode = (index: number) => {
    setHasInteracted(true);
    setPreviewIndex(index);
  };

  const selectMode = (index: number) => {
    setHasInteracted(true);
    setPinnedIndex(index);
    setPreviewIndex(index);
    window.dispatchEvent(new Event(LIVING_TOOLCHAIN_PAUSE_EVENT));
  };

  const moveTo = (index: number) => {
    const nextIndex = (index + modes.length) % modes.length;
    selectMode(nextIndex);
    controls.current[nextIndex]?.focus();
  };

  const navigateWithKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = modes.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    moveTo(nextIndex);
  };

  const clearPreviewOutsideControls = (event: FocusEvent<HTMLOListElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setPreviewIndex(null);
  };

  const clearPointerPreview = () => {
    const focusedIndex = controls.current.findIndex(
      (control) => control === document.activeElement,
    );
    setPreviewIndex(focusedIndex >= 0 ? focusedIndex : null);
  };

  return (
    <section
      ref={lensRoot}
      className={styles.stackLens}
      aria-labelledby="adaptive-stack-lens-title"
      aria-describedby="adaptive-stack-lens-thesis"
      data-adaptive-stack-lens
      data-active-mode={activeMode.slug}
      data-accent={activeMode.accent}
      data-interacted={hasInteracted}
      data-route-fallback="false"
    >
      <header className={styles.lensHeader}>
        <div className={styles.lensIntroduction}>
          <span className={styles.lensEyebrow}>SELECTED WORK / 04</span>
          <h2 id="adaptive-stack-lens-title" className={styles.lensTitle}>
            <span>FOUR REAL PRODUCTS.</span>
          </h2>
          <p className={styles.lensDescription}>
            Commerce, connected devices, local discovery, and automation.
          </p>
        </div>
        <strong id="adaptive-stack-lens-thesis" className={styles.lensThesis}>
          ARCHITECTURE FOLLOWS THE CONSTRAINT
        </strong>
      </header>

      <div className={styles.lensField}>
        <div
          ref={geometryStage}
          className={styles.lensGeometryStage}
          data-lens-geometry-stage
          data-geometry="orbit"
          data-markers-ready="false"
        >
          <svg
            ref={orbitArchitecture}
            className={styles.lensArchitecture}
            viewBox={geometryViewBox(ORBIT_LENS_GEOMETRY)}
            preserveAspectRatio="xMidYMid meet"
            data-lens-geometry-svg="orbit"
            aria-hidden="true"
            focusable="false"
          >
            <path
              className={styles.lensBoundary}
              pathLength="1"
              d={boundaryPath(ORBIT_LENS_GEOMETRY)}
            />
            <MarkerSideDefinitions geometry={ORBIT_LENS_GEOMETRY} />
            <path
              className={styles.lensDepthPlane}
              d={lensPath(
                ORBIT_LENS_GEOMETRY,
                ORBIT_LENS_GEOMETRY.depthPlanePointIds,
                true,
              )}
            />
            <path
              className={styles.lensCoreBoundary}
              d={lensPath(
                ORBIT_LENS_GEOMETRY,
                ORBIT_LENS_GEOMETRY.coreBoundaryPointIds,
                true,
              )}
            />
            {modes.map((mode, index) => (
              <path
                key={mode.slug}
                className={`${styles.signalRoute} ${activeIndex === index ? styles.signalRouteActive : ""}`}
                pathLength="1"
                d={routeToCorePath(
                  ORBIT_LENS_GEOMETRY,
                  mode.id as LensMarkerId,
                )}
                data-lens-route={mode.slug}
              />
            ))}
          </svg>

          <ol
            className={styles.lensControls}
            aria-label="Production system contexts"
            data-context-orbit
            data-active-index={activeIndex}
            onBlur={clearPreviewOutsideControls}
            onMouseLeave={clearPointerPreview}
          >
            {modes.map((mode, index) => {
              const active = index === activeIndex;
              const pinned = index === pinnedIndex;
              const markerId = mode.id as LensMarkerId;
              const side = markerSide(ORBIT_LENS_GEOMETRY, markerId);
              const direction = semanticSideLabelDirection(side.side);
              return (
                <li
                  ref={(node) => {
                    markerAnchors.current[markerId] = node;
                  }}
                  key={mode.slug}
                  data-lens-position={markerId}
                  data-semantic-side={side.side}
                  data-side-start={side.startPointId}
                  data-side-end={side.endPointId}
                  data-label-direction={direction}
                >
                  <button
                    ref={(node) => {
                      controls.current[index] = node;
                    }}
                    type="button"
                    aria-controls="adaptive-stack-lens-readout"
                    aria-pressed={pinned}
                    className={`${styles.contextOrbitNode} ${active ? styles.lensControlActive : ""}`}
                    data-pinned={pinned}
                    data-lens-context={mode.slug}
                    onClick={() => selectMode(index)}
                    onFocus={() => previewMode(index)}
                    onKeyDown={(event) => navigateWithKeyboard(event, index)}
                    onMouseEnter={() => previewMode(index)}
                  >
                    <span className={styles.contextNumber}>{mode.index}</span>
                    <span className={styles.contextDot} aria-hidden="true" />
                    <span className={styles.contextLabel}>{mode.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div
            id="adaptive-stack-lens-readout"
            className={styles.lensCore}
            aria-live="polite"
            aria-atomic="true"
            data-adaptive-system-core
          >
            <span className={styles.lensCoreDecoration} aria-hidden="true" />
            <div key={activeMode.slug} className={styles.lensCoreContent}>
              <p className={styles.activeSystemIndex}>
                {activeMode.index} / {String(modes.length).padStart(2, "0")}
              </p>
              <h3>{activeMode.title}</h3>
              <p className={styles.activeContext}>{activeMode.category}</p>
              <p className={styles.lensStatement}>{activeMode.description}</p>
              <dl className={styles.lensMetadata}>
                {activeMode.metadata.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <a className={styles.lensCaseStudyLink} href={activeMode.caseStudyHref}>
                VIEW CASE STUDY <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
