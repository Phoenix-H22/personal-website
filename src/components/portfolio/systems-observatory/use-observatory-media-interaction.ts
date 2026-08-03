"use client";

import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

import {
  resolveObservatoryGestureDirection,
  shouldStartObservatoryGesture,
  type ObservatoryDirection,
} from "@/components/portfolio/systems-observatory/systems-observatory-navigation";

interface MediaInteractionOptions {
  projectSlug: string;
  reducedMotion: boolean;
  onNavigate: (direction: ObservatoryDirection) => void;
}

interface PointerOrigin {
  id: number;
  x: number;
  y: number;
  startedAt: number;
  intent: "pending" | "horizontal" | "vertical";
}

const INTERACTIVE_TARGETS =
  'a, button, input, select, textarea, [role="button"], [data-observatory-no-drag]';
const POINTER_INTENT_DISTANCE = 8;
const POINTER_INTENT_DOMINANCE = 1.15;

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(INTERACTIVE_TARGETS));
}

function setInteractionVariables(
  surface: HTMLElement,
  pointerX: number,
  pointerY: number,
  dragX: number,
) {
  if (pointerX !== 0 || pointerY !== 0) {
    surface.setAttribute("data-pointer-active", "true");
  }
  surface.style.setProperty("--media-pointer-x", `${pointerX.toFixed(2)}px`);
  surface.style.setProperty("--media-pointer-y", `${pointerY.toFixed(2)}px`);
  surface.style.setProperty("--media-drag-x", `${dragX.toFixed(2)}px`);
  surface.style.setProperty("--media-tilt-x", `${(-pointerY * 0.2).toFixed(2)}deg`);
  surface.style.setProperty("--media-tilt-y", `${(pointerX * 0.2).toFixed(2)}deg`);
  surface
    .closest<HTMLElement>("[data-active-project-stage]")
    ?.style.setProperty("--gesture-shift-x", `${(dragX * 0.3).toFixed(2)}px`);
}

function resetInteractionVariables(surface: HTMLElement) {
  surface.removeAttribute("data-dragging");
  surface.removeAttribute("data-drag-direction");
  surface.removeAttribute("data-pointer-active");
  setInteractionVariables(surface, 0, 0, 0);
}

export function useObservatoryMediaInteraction({
  projectSlug,
  reducedMotion,
  onNavigate,
}: MediaInteractionOptions) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const pointerOriginRef = useRef<PointerOrigin | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const writeFrame = (pointerX: number, pointerY: number, dragX: number) => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      const surface = surfaceRef.current;
      if (surface) setInteractionVariables(surface, pointerX, pointerY, dragX);
      animationFrameRef.current = null;
    });
  };

  const resetSurface = () => {
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
    const surface = surfaceRef.current;
    if (surface) resetInteractionVariables(surface);
  };

  useEffect(() => {
    pointerOriginRef.current = null;
    resetSurface();
    return resetSurface;
  }, [projectSlug, reducedMotion]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      !shouldStartObservatoryGesture({
        primary: event.isPrimary,
        button: event.button,
        interactive: isInteractiveTarget(event.target),
      })
    ) {
      return;
    }
    pointerOriginRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startedAt: performance.now(),
      intent: "pending",
    };
    if (event.pointerType === "mouse") event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const origin = pointerOriginRef.current;
    if (!origin) {
      if (reducedMotion || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      const pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
      writeFrame(pointerX, pointerY, 0);
      return;
    }
    if (origin.id !== event.pointerId || origin.intent === "vertical") return;
    const deltaX = event.clientX - origin.x;
    const deltaY = event.clientY - origin.y;
    if (origin.intent === "pending" && Math.hypot(deltaX, deltaY) >= POINTER_INTENT_DISTANCE) {
      if (Math.abs(deltaY) > Math.abs(deltaX) * POINTER_INTENT_DOMINANCE) {
        origin.intent = "vertical";
        resetSurface();
        return;
      }
      if (Math.abs(deltaX) > Math.abs(deltaY) * POINTER_INTENT_DOMINANCE) {
        origin.intent = "horizontal";
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.setAttribute("data-dragging", "true");
      }
    }
    if (origin.intent !== "horizontal") return;
    const dragX = reducedMotion ? 0 : Math.max(-16, Math.min(16, deltaX * 0.18));
    event.currentTarget.setAttribute(
      "data-drag-direction",
      deltaX < 0 ? "next" : "previous",
    );
    writeFrame(0, 0, dragX);
  };

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const origin = pointerOriginRef.current;
    if (!origin || origin.id !== event.pointerId) return;
    pointerOriginRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const direction =
      origin.intent === "horizontal"
        ? resolveObservatoryGestureDirection({
            deltaX: event.clientX - origin.x,
            deltaY: event.clientY - origin.y,
            durationMs: performance.now() - origin.startedAt,
          })
        : null;
    resetSurface();
    if (direction === null) return;
    onNavigate(direction);
  };

  const cancelPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerOriginRef.current?.id !== event.pointerId) return;
    pointerOriginRef.current = null;
    resetSurface();
  };

  const onPointerLeave = () => {
    if (!pointerOriginRef.current) resetSurface();
  };

  return {
    surfaceRef,
    onPointerDown,
    onPointerMove,
    onPointerUp: finishPointer,
    onPointerCancel: cancelPointer,
    onPointerLeave,
  };
}
