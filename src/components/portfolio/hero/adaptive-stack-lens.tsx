"use client";

import {
  useReducer,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
} from "react";

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

export function reduceLensSelection(
  state: LensSelectionState,
  action: LensSelectionAction,
): LensSelectionState {
  if (action.type === "select") {
    return {
      pinnedIndex: action.index,
      previewIndex: action.index,
      hasInteracted: true,
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
  });
  const controls = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = selection.previewIndex ?? selection.pinnedIndex;
  const activeMode = modes[activeIndex];

  const previewMode = (index: number) => {
    dispatch({ type: "preview", index });
  };

  const selectMode = (index: number) => {
    dispatch({ type: "select", index });
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
      className={styles.stackLens}
      aria-labelledby="adaptive-stack-lens-title"
      aria-describedby="adaptive-stack-lens-thesis"
      data-adaptive-stack-lens
      data-active-mode={activeMode.slug}
      data-accent={activeMode.accent}
      data-interacted={selection.hasInteracted}
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

      <div className={styles.orbit} data-stack-lens-orbit>
        <svg
          className={styles.orbitFrame}
          viewBox="0 0 640 512"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          focusable="false"
          data-orbit-frame
        >
          <path
            className={styles.orbitBoundary}
            pathLength="1"
            d="M72 136 V84 L142 26 H492 L590 107 V395 L518 474 H150 L52 393 V332"
          />
          <path
            className={styles.orbitDepthPlane}
            d="M132 157 L168 127 H470 L508 157 V355 L472 385 H168 L130 354 Z"
          />
        </svg>

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
              <li className={PROJECT_NODE_CLASSES[index]} key={mode.slug}>
                <button
                  ref={(node) => {
                    controls.current[index] = node;
                  }}
                  type="button"
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
                  <span className={styles.projectControlNumber}>{mode.index}</span>
                  <span className={styles.projectControlLabel}>{mode.label}</span>
                  <span
                    className={styles.projectBeam}
                    aria-hidden="true"
                    data-project-beam
                  />
                </button>
              </li>
            );
          })}
        </ol>

        <article
          id="adaptive-stack-lens-readout"
          className={styles.projectCard}
          aria-live="polite"
          aria-atomic="true"
          data-adaptive-system-core
        >
          <span className={styles.projectCardDecoration} aria-hidden="true" />
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
            <a className={styles.projectCaseStudyLink} href={activeMode.caseStudyHref}>
              VIEW CASE STUDY <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
