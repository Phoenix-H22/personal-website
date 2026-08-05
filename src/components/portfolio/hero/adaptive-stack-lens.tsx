"use client";

import {
  useReducer,
  useRef,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

import {
  getNodePositionStyle,
  ORBIT_FRAME_SEGMENTS,
  ORBIT_GEOMETRY_STYLE,
  ORBIT_VIEW_BOX,
} from "@/components/portfolio/hero/adaptive-orbit-geometry";
import { AdaptiveSignalRoute } from "@/components/portfolio/hero/adaptive-signal-route";
import {
  getNextProjectIndex,
  PROJECT_ROTATION_INTERVAL_MS,
  PROJECT_SELECTION_COOLDOWN_MS,
  useProjectAutoRotation,
} from "@/components/portfolio/hero/use-project-auto-rotation";
import type { AdaptiveStackLensDto } from "@/lib/portfolio/adaptive-stack-lens";
import { LIVING_TOOLCHAIN_PAUSE_EVENT } from "@/lib/portfolio/living-toolchain";
import styles from "@/styles/portfolio/adaptive-engineer-hero.module.scss";

interface AdaptiveStackLensProps {
  modes: readonly AdaptiveStackLensDto[];
  defaultSlug: AdaptiveStackLensDto["slug"];
}

interface LensSelectionState {
  pinnedIndex: number;
  previewIndex: number | null;
  hasInteracted: boolean;
  revision: number;
}

type LensSelectionAction =
  | { type: "preview"; index: number | null }
  | { type: "select"; index: number };

const PROJECT_NODE_CLASSES = [
  styles.projectNodeTop,
  styles.projectNodeRight,
  styles.projectNodeBottom,
  styles.projectNodeLeft,
] as const;

const PROJECT_ORBIT_SIDES = ["top", "right", "bottom", "left"] as const;

export function reduceLensSelection(
  state: LensSelectionState,
  action: LensSelectionAction,
): LensSelectionState {
  if (action.type === "select") {
    return {
      pinnedIndex: action.index,
      previewIndex: action.index,
      hasInteracted: true,
      revision: state.revision + 1,
    };
  }

  return {
    ...state,
    previewIndex: action.index,
    hasInteracted: action.index === null ? state.hasInteracted : true,
  };
}

export function getProjectNavigationTarget(
  key: string,
  index: number,
  projectCount: number,
): number | null {
  if (projectCount <= 0) return null;
  if (key === "Home") return 0;
  if (key === "End") return projectCount - 1;
  if (key === "ArrowRight" || key === "ArrowDown") {
    return (index + 1) % projectCount;
  }
  if (key === "ArrowLeft" || key === "ArrowUp") {
    return (index - 1 + projectCount) % projectCount;
  }
  return null;
}

export function AdaptiveStackLens({ modes, defaultSlug }: AdaptiveStackLensProps) {
  const initialIndex = modes.findIndex(({ slug }) => slug === defaultSlug);
  if (initialIndex < 0) throw new Error(`Invalid Adaptive Stack Lens default: ${defaultSlug}`);

  const [selection, dispatch] = useReducer(reduceLensSelection, {
    pinnedIndex: initialIndex,
    previewIndex: null,
    hasInteracted: false,
    revision: 0,
  });
  const controls = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = selection.previewIndex ?? selection.pinnedIndex;
  const activeMode = modes[activeIndex];
  const routeDestinationIndex = getNextProjectIndex(activeIndex, modes.length);
  const {
    isCooldownActive,
    isDocumentVisible,
    isInViewport,
    pauseAfterManualSelection,
    pauseForFocus,
    pauseForPointer,
    pauseForPress,
    reducedMotion,
    resumeAfterFocus,
    resumeAfterPointer,
    rootRef: autoRotationRootRef,
    shouldRotate,
  } = useProjectAutoRotation({
    projectCount: modes.length,
    onRotate: () => {
      dispatch({
        type: "select",
        index: getNextProjectIndex(selection.pinnedIndex, modes.length),
      });
    },
  });

  const previewMode = (index: number) => {
    dispatch({ type: "preview", index });
  };

  const selectMode = (index: number) => {
    dispatch({ type: "select", index });
    pauseAfterManualSelection();
    window.dispatchEvent(new Event(LIVING_TOOLCHAIN_PAUSE_EVENT));
  };

  const moveTo = (index: number) => {
    selectMode(index);
    controls.current[index]?.focus();
  };

  const navigateWithKeyboard = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const nextIndex = getProjectNavigationTarget(event.key, index, modes.length);
    if (nextIndex === null) return;

    event.preventDefault();
    moveTo(nextIndex);
  };

  const clearPreviewOutsideControls = (event: FocusEvent<HTMLOListElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      dispatch({ type: "preview", index: null });
    }
  };

  const clearPointerPreview = () => {
    const focusedIndex = controls.current.findIndex(
      (control) => control === document.activeElement,
    );
    dispatch({ type: "preview", index: focusedIndex >= 0 ? focusedIndex : null });
  };

  return (
    <section
      ref={autoRotationRootRef}
      className={styles.stackLens}
      style={
        {
          "--signal-route-duration": `${PROJECT_ROTATION_INTERVAL_MS}ms`,
        } as CSSProperties
      }
      aria-labelledby="adaptive-stack-lens-title"
      data-adaptive-stack-lens
      data-active-index={activeIndex}
      data-active-mode={activeMode.slug}
      data-accent={activeMode.accent}
      data-auto-rotation={
        reducedMotion
          ? "reduced"
          : shouldRotate
            ? "running"
            : "paused"
      }
      data-document-visible={isDocumentVisible}
      data-interacted={selection.hasInteracted}
      data-in-viewport={isInViewport}
      data-rotation-cooldown={isCooldownActive}
      data-rotation-interval-ms={PROJECT_ROTATION_INTERVAL_MS}
      data-selection-cooldown-ms={PROJECT_SELECTION_COOLDOWN_MS}
      onBlurCapture={resumeAfterFocus}
      onFocusCapture={pauseForFocus}
      onPointerEnter={pauseForPointer}
      onPointerLeave={resumeAfterPointer}
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
      </header>

      <div
        className={styles.orbit}
        style={ORBIT_GEOMETRY_STYLE}
        data-stack-lens-orbit
        onPointerDownCapture={pauseForPress}
      >
        <div
          className={styles.activeProjectSignal}
          aria-hidden="true"
          data-active-project-signal
        >
          <span>ACTIVE SYSTEM</span>
          <strong>{activeMode.title}</strong>
        </div>

        <svg
          className={styles.orbitFrame}
          viewBox={ORBIT_VIEW_BOX}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
          data-orbit-frame
        >
          <g
            className={styles.orbitFrameSegments}
            data-orbit-frame-segments
          >
            {ORBIT_FRAME_SEGMENTS.map((segment) => (
              <path
                key={segment.id}
                className={styles.orbitBoundary}
                pathLength="1"
                d={segment.path}
                data-orbit-frame-segment
                data-frame-segment={segment.id}
              />
            ))}
          </g>
        </svg>

        <AdaptiveSignalRoute
          activeIndex={activeIndex}
          projectCount={modes.length}
          revision={selection.revision}
        />

        <ol
          className={styles.projectSelector}
          aria-label="Production systems"
          data-project-selector
          data-active-index={activeIndex}
          onBlur={clearPreviewOutsideControls}
          onMouseLeave={clearPointerPreview}
        >
          {modes.map((mode, index) => {
            const active = index === activeIndex;
            const pinned = index === selection.pinnedIndex;
            return (
              <li
                className={PROJECT_NODE_CLASSES[index]}
                data-orbit-side={PROJECT_ORBIT_SIDES[index]}
                key={mode.slug}
                style={getNodePositionStyle(index)}
              >
                <button
                  ref={(node) => {
                    controls.current[index] = node;
                  }}
                  type="button"
                  aria-label={`Select project ${mode.index}: ${mode.title}`}
                  aria-controls="adaptive-stack-lens-readout"
                  aria-pressed={pinned}
                  className={`${styles.projectControl} ${active ? styles.projectControlActive : ""}`}
                  data-active={active}
                  data-lens-context={mode.slug}
                  onClick={() => selectMode(index)}
                  onFocus={() => previewMode(index)}
                  onKeyDown={(event) => navigateWithKeyboard(event, index)}
                  onMouseEnter={() => previewMode(index)}
                >
                  <span
                    className={styles.projectControlNumber}
                    data-project-marker
                    data-signal-route-target={index === routeDestinationIndex}
                  >
                    {mode.index}
                  </span>
                  <span className={styles.projectControlLabel} data-project-label>
                    {mode.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <article
          id="adaptive-stack-lens-readout"
          className={styles.projectCard}
          aria-live={shouldRotate ? "off" : "polite"}
          aria-atomic="true"
          data-adaptive-system-core
        >
          <span
            className={styles.projectCardDecoration}
            aria-hidden="true"
          />
          <div key={activeMode.slug} className={styles.projectCardContent}>
            <p className={styles.activeSystemIndex}>
              {activeMode.index} / {String(modes.length).padStart(2, "0")}
            </p>
            <h3>{activeMode.title}</h3>
            <p className={styles.activeContext}>{activeMode.category}</p>
            <p className={styles.projectStatement}>{activeMode.description}</p>
            <dl className={styles.projectCardMetadata}>
              {activeMode.metadata.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.projectTechnologySignal} data-project-technology-signal>
              <span>STACK</span>
              <span>{activeMode.technologies.join(" · ")}</span>
            </p>
            <a className={styles.projectCaseStudyLink} href={activeMode.caseStudyHref}>
              VIEW CASE STUDY <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
