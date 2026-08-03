"use client";

import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import {
  hasMeaningfulViewportScroll,
  isInsideActiveAnnotation,
} from "@/components/portfolio/systems-observatory/systems-observatory-annotation-behavior";
import type { TechnologyInsightCategory } from "@/components/portfolio/systems-observatory/systems-observatory-insights";
import styles from "@/styles/portfolio/systems-observatory.module.scss";

interface AnnotationCloseOptions {
  restoreFocus?: boolean;
}

interface AnnotationController {
  openId: string | null;
  pinnedId: string | null;
  finePointer: boolean;
  reducedMotion: boolean;
  preview: (
    id: string,
    trigger: HTMLButtonElement,
    source: "hover" | "focus",
  ) => void;
  endPreview: (id: string) => void;
  toggle: (id: string, trigger: HTMLButtonElement) => void;
  setPanel: (id: string, panel: HTMLDivElement | null) => void;
  close: (options?: AnnotationCloseOptions) => void;
}

interface AnnotationState {
  scopeKey: string;
  openId: string | null;
  pinnedId: string | null;
}

interface AnnotationControlProps {
  id: string;
  eyebrow: string;
  title?: string;
  content: string;
  variant: "technology" | "detail";
  controller: AnnotationController;
  children: ReactNode;
}

const VIEWPORT_MARGIN = 12;
const ANNOTATION_GAP = 8;
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const COARSE_POINTER_QUERY = "(hover: none), (pointer: coarse), (any-pointer: coarse)";

function subscribeToClientReady() {
  return () => undefined;
}

function subscribeToFinePointer(onChange: () => void) {
  const queries = [
    window.matchMedia(FINE_POINTER_QUERY),
    window.matchMedia(COARSE_POINTER_QUERY),
  ];
  for (const query of queries) query.addEventListener("change", onChange);
  return () => {
    for (const query of queries) query.removeEventListener("change", onChange);
  };
}

function getFinePointerSnapshot() {
  const touchCapable = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  return (
    window.matchMedia(FINE_POINTER_QUERY).matches &&
    !window.matchMedia(COARSE_POINTER_QUERY).matches &&
    !touchCapable
  );
}

function syncAnnotationAccent(trigger: HTMLElement, panel: HTMLElement) {
  panel.style.setProperty(
    "--accent",
    getComputedStyle(trigger).getPropertyValue("--accent").trim() || "#31e6d0",
  );
}

function positionAnnotation(trigger: HTMLElement, panel: HTMLElement) {
  const triggerRect = trigger.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const maximumLeft = Math.max(VIEWPORT_MARGIN, window.innerWidth - panelRect.width - VIEWPORT_MARGIN);
  const left = Math.min(Math.max(VIEWPORT_MARGIN, triggerRect.left), maximumLeft);
  const below = triggerRect.bottom + ANNOTATION_GAP;
  const above = triggerRect.top - panelRect.height - ANNOTATION_GAP;
  const top =
    below + panelRect.height <= window.innerHeight - VIEWPORT_MARGIN
      ? below
      : Math.max(VIEWPORT_MARGIN, above);
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  syncAnnotationAccent(trigger, panel);
}

export function useObservatoryAnnotations({
  scopeKey,
  reducedMotion,
}: {
  scopeKey: string;
  reducedMotion: boolean;
}): AnnotationController {
  const [state, setState] = useState<AnnotationState>({
    scopeKey,
    openId: null,
    pinnedId: null,
  });
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const activePanelRef = useRef<HTMLDivElement | null>(null);
  const focusFrameRef = useRef<number | null>(null);
  const finePointer = useSyncExternalStore(
    subscribeToFinePointer,
    getFinePointerSnapshot,
    () => false,
  );
  const scopeIsCurrent = state.scopeKey === scopeKey;
  const openId = scopeIsCurrent ? state.openId : null;
  const pinnedId = scopeIsCurrent ? state.pinnedId : null;

  const close = useCallback(({ restoreFocus = false }: AnnotationCloseOptions = {}) => {
    const trigger = activeTriggerRef.current;
    setState({ scopeKey, openId: null, pinnedId: null });
    activeTriggerRef.current = null;
    activePanelRef.current = null;
    if (!restoreFocus || !trigger) return;
    if (focusFrameRef.current !== null) cancelAnimationFrame(focusFrameRef.current);
    focusFrameRef.current = requestAnimationFrame(() => {
      if (trigger.isConnected) trigger.focus({ preventScroll: true });
      focusFrameRef.current = null;
    });
  }, [scopeKey]);

  useLayoutEffect(() => {
    activeTriggerRef.current = null;
    activePanelRef.current = null;
  }, [scopeKey]);

  useEffect(
    () => () => {
      if (focusFrameRef.current !== null) cancelAnimationFrame(focusFrameRef.current);
      activeTriggerRef.current = null;
      activePanelRef.current = null;
    },
    [],
  );

  useLayoutEffect(() => {
    if (!openId) return;
    const openedAt = { x: window.scrollX, y: window.scrollY };
    const closeFromOutside = (event: PointerEvent) => {
      if (
        !isInsideActiveAnnotation(
          event.composedPath(),
          activeTriggerRef.current,
          activePanelRef.current,
        )
      ) {
        close();
      }
    };
    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close({ restoreFocus: true });
    };
    const closeFromScroll = () => {
      if (
        hasMeaningfulViewportScroll(openedAt, {
          x: window.scrollX,
          y: window.scrollY,
        })
      ) {
        close();
      }
    };
    const closeFromViewportChange = () => close();
    document.addEventListener("pointerdown", closeFromOutside, true);
    document.addEventListener("keydown", closeFromEscape, true);
    window.addEventListener("scroll", closeFromScroll, true);
    window.addEventListener("resize", closeFromViewportChange);
    window.addEventListener("orientationchange", closeFromViewportChange);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside, true);
      document.removeEventListener("keydown", closeFromEscape, true);
      window.removeEventListener("scroll", closeFromScroll, true);
      window.removeEventListener("resize", closeFromViewportChange);
      window.removeEventListener("orientationchange", closeFromViewportChange);
    };
  }, [openId, close]);

  return {
    openId,
    pinnedId,
    finePointer,
    reducedMotion,
    preview: (id, trigger, source) => {
      if (source === "hover" && !finePointer) return;
      if (!pinnedId) {
        activeTriggerRef.current = trigger;
        activePanelRef.current = null;
        setState({ scopeKey, openId: id, pinnedId: null });
      }
    },
    endPreview: (id) => {
      if (pinnedId !== id && openId === id) close();
    },
    toggle: (id, trigger) => {
      const nextId = pinnedId === id ? null : id;
      activeTriggerRef.current = nextId ? trigger : null;
      activePanelRef.current = null;
      setState({ scopeKey, openId: nextId, pinnedId: nextId });
    },
    setPanel: (id, panel) => {
      if (openId === id) activePanelRef.current = panel;
    },
    close,
  };
}

export function MicroSystemNode({
  category = "backend",
}: {
  category?: TechnologyInsightCategory;
}) {
  return (
    <svg
      className={styles.microSystemNode}
      viewBox="0 0 14 14"
      aria-hidden="true"
      focusable="false"
      data-node-category={category}
    >
      <path d="M4 1.5H1.5V4M10 1.5h2.5V4M4 12.5H1.5V10M10 12.5h2.5V10" />
      <path d="M3.5 7h2M8.5 7h2" />
      <circle cx="7" cy="7" r="1.35" />
    </svg>
  );
}

export function AnnotationControl({
  id,
  eyebrow,
  title,
  content,
  variant,
  controller,
  children,
}: AnnotationControlProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const clientReady = useSyncExternalStore(
    subscribeToClientReady,
    () => true,
    () => false,
  );
  const open = controller.openId === id;
  const pinned = controller.pinnedId === id;
  const presentation = controller.finePointer ? "popover" : "sheet";

  useLayoutEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      if (triggerRef.current && panelRef.current) {
        if (controller.finePointer) {
          positionAnnotation(triggerRef.current, panelRef.current);
        } else {
          syncAnnotationAccent(triggerRef.current, panelRef.current);
        }
      }
    };
    const frame = requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, controller.finePointer]);

  const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Escape") return;
    event.stopPropagation();
    controller.close({ restoreFocus: true });
  };

  return (
    <span
      className={styles.annotationControl}
      data-annotation-variant={variant}
    >
      <button
        ref={triggerRef}
        type="button"
        className={styles.annotationTrigger}
        aria-expanded={open}
        aria-controls={id}
        aria-describedby={open ? id : undefined}
        data-observatory-annotation-control
        data-annotation-id={id}
        onMouseEnter={() => {
          if (triggerRef.current) controller.preview(id, triggerRef.current, "hover");
        }}
        onMouseLeave={() => controller.endPreview(id)}
        onFocus={() => {
          if (triggerRef.current) controller.preview(id, triggerRef.current, "focus");
        }}
        onBlur={() => controller.endPreview(id)}
        onClick={() => {
          if (triggerRef.current) controller.toggle(id, triggerRef.current);
        }}
        onKeyDown={onKeyDown}
      >
        {children}
      </button>
      {clientReady && open
        ? createPortal(
            <div
              ref={(panel) => {
                panelRef.current = panel;
                controller.setPanel(id, panel);
              }}
              id={id}
              role="note"
              className={styles.annotationPanel}
              data-observatory-annotation
              data-annotation-id={id}
              data-annotation-presentation={presentation}
              data-reduced-motion={controller.reducedMotion ? "true" : "false"}
              data-pinned={pinned ? "true" : "false"}
            >
              {presentation === "sheet" ? (
                <span className={styles.annotationSheetHandle} aria-hidden="true" />
              ) : null}
              <span className={styles.annotationHeader}>
                <span>
                  <span className={styles.annotationEyebrow} data-annotation-eyebrow>
                    {eyebrow}
                  </span>
                  {title ? (
                    <strong className={styles.annotationTitle} data-annotation-title>
                      {title}
                    </strong>
                  ) : null}
                </span>
                {presentation === "sheet" ? (
                  <button
                    type="button"
                    className={styles.annotationClose}
                    aria-label={`Close ${eyebrow.toLowerCase()}`}
                    data-annotation-close
                    onClick={() => controller.close({ restoreFocus: true })}
                  >
                    CLOSE
                  </button>
                ) : null}
              </span>
              <span className={styles.annotationContent} data-annotation-content>
                {content}
              </span>
            </div>,
            document.body,
          )
        : null}
    </span>
  );
}
