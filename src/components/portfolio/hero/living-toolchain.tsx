"use client";

import { useEffect, useRef, useState } from "react";

import { useMotionPreference } from "@/lib/motion-preference-context";
import {
  LIVING_TOOLCHAIN_PAUSE_EVENT,
  LIVING_TOOLCHAIN_PHASES,
  LIVING_TOOLCHAIN_PHRASES,
  LIVING_TOOLCHAIN_TIMING,
} from "@/lib/portfolio/living-toolchain";
import styles from "@/styles/portfolio/adaptive-engineer-hero.module.scss";

type ToolchainPhase = (typeof LIVING_TOOLCHAIN_PHASES)[number];

interface ToolchainFrame {
  phraseIndex: number;
  visibleLength: number;
  phase: ToolchainPhase;
}

const INITIAL_FRAME: ToolchainFrame = {
  phraseIndex: 0,
  visibleLength: LIVING_TOOLCHAIN_PHRASES[0].length,
  phase: "HOLD",
};

function nextToolchainFrame(frame: ToolchainFrame): ToolchainFrame {
  const phrase = LIVING_TOOLCHAIN_PHRASES[frame.phraseIndex];
  if (frame.phase === "HOLD") return { ...frame, phase: "ERASE" };
  if (frame.phase === "ERASE" && frame.visibleLength > 0) {
    return { ...frame, visibleLength: frame.visibleLength - 1 };
  }
  if (frame.phase === "ERASE") {
    return {
      phraseIndex: (frame.phraseIndex + 1) % LIVING_TOOLCHAIN_PHRASES.length,
      visibleLength: 0,
      phase: "SWITCH",
    };
  }
  if (frame.phase === "SWITCH") return { ...frame, phase: "TYPE" };
  if (frame.visibleLength < phrase.length) {
    return { ...frame, visibleLength: frame.visibleLength + 1 };
  }
  return { ...frame, phase: "HOLD" };
}

function frameDelay(phase: ToolchainPhase): number {
  if (phase === "HOLD") return LIVING_TOOLCHAIN_TIMING.hold;
  if (phase === "ERASE") return LIVING_TOOLCHAIN_TIMING.erase;
  if (phase === "SWITCH") return LIVING_TOOLCHAIN_TIMING.switch;
  return LIVING_TOOLCHAIN_TIMING.type;
}

function useDocumentVisibility() {
  const [hidden, setHidden] = useState(false);
  const [resumeSignal, setResumeSignal] = useState(0);
  const hiddenRef = useRef(false);
  useEffect(() => {
    const syncInitialVisibility = () => {
      hiddenRef.current = document.visibilityState === "hidden";
      setHidden(hiddenRef.current);
    };
    const updateVisibility = () => {
      const nextHidden = document.visibilityState === "hidden";
      hiddenRef.current = nextHidden;
      setHidden(nextHidden);
      if (!nextHidden) setResumeSignal((generation) => generation + 1);
    };
    const resumeFromPageShow = () => {
      updateVisibility();
    };
    syncInitialVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("pageshow", resumeFromPageShow);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("pageshow", resumeFromPageShow);
    };
  }, []);
  return { hidden, resumeSignal };
}

function useLensSelectionPause() {
  const [lensPaused, setLensPaused] = useState(false);
  const lensPausedRef = useRef(false);
  const pauseUntilRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  useEffect(() => {
    let mounted = true;
    const clearResumeTimer = () => {
      if (resumeTimerRef.current === null) return;
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    };
    const finishPause = () => {
      resumeTimerRef.current = null;
      if (!mounted || document.visibilityState === "hidden") return;
      const remaining = pauseUntilRef.current - performance.now();
      if (remaining > 0) {
        resumeTimerRef.current = window.setTimeout(finishPause, remaining);
        return;
      }
      pauseUntilRef.current = 0;
      lensPausedRef.current = false;
      setLensPaused(false);
    };
    const scheduleResume = () => {
      clearResumeTimer();
      if (document.visibilityState === "hidden") return;
      finishPause();
    };
    const pauseForSelection = () => {
      pauseUntilRef.current = performance.now() + LIVING_TOOLCHAIN_TIMING.lensPause;
      lensPausedRef.current = true;
      setLensPaused(true);
      scheduleResume();
    };
    const reconcileVisibility = () => {
      if (document.visibilityState === "hidden") clearResumeTimer();
      else scheduleResume();
    };
    window.addEventListener(LIVING_TOOLCHAIN_PAUSE_EVENT, pauseForSelection);
    document.addEventListener("visibilitychange", reconcileVisibility);
    window.addEventListener("pageshow", reconcileVisibility);
    return () => {
      mounted = false;
      window.removeEventListener(LIVING_TOOLCHAIN_PAUSE_EVENT, pauseForSelection);
      document.removeEventListener("visibilitychange", reconcileVisibility);
      window.removeEventListener("pageshow", reconcileVisibility);
      clearResumeTimer();
    };
  }, []);
  return lensPaused;
}

function useEnhancementReady(): boolean {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let initialized = false;
    const initialize = () => {
      if (initialized) return;
      initialized = true;
      setReady(true);
    };
    const frame = window.requestAnimationFrame(initialize);
    const fallback = window.setTimeout(
      initialize,
      LIVING_TOOLCHAIN_TIMING.initializationFallback,
    );
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, []);
  return ready;
}

function useToolchainScheduler(running: boolean, resumeSignal: number) {
  const [frame, setFrame] = useState<ToolchainFrame>(INITIAL_FRAME);
  const frameRef = useRef(INITIAL_FRAME);
  const timerRef = useRef<number | null>(null);
  const generationRef = useRef(0);
  const runningRef = useRef(running);

  useEffect(() => {
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    runningRef.current = running;
    const clearTimer = () => {
      if (timerRef.current === null) return;
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
    const scheduleNext = () => {
      if (
        !runningRef.current ||
        generation !== generationRef.current ||
        timerRef.current !== null
      ) {
        return;
      }
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        if (!runningRef.current || generation !== generationRef.current) return;
        const nextFrame = nextToolchainFrame(frameRef.current);
        frameRef.current = nextFrame;
        setFrame(() => nextFrame);
        scheduleNext();
      }, frameDelay(frameRef.current.phase));
    };
    if (running) scheduleNext();
    else clearTimer();
    return () => {
      runningRef.current = false;
      generationRef.current += 1;
      clearTimer();
    };
  }, [resumeSignal, running]);

  return frame;
}

export function LivingToolchain() {
  const { effective } = useMotionPreference();
  const enhancementReady = useEnhancementReady();
  const visibility = useDocumentVisibility();
  const lensPause = useLensSelectionPause();
  const reducedMotion = effective === "reduced";
  // Visibility resumes through a fresh scheduler generation; lens selection
  // resumes through its bounded deadline timer. No other interaction pauses it.
  const running =
    enhancementReady &&
    !reducedMotion &&
    !visibility.hidden &&
    !lensPause;
  const frame = useToolchainScheduler(running, visibility.resumeSignal);
  const phrase = LIVING_TOOLCHAIN_PHRASES[frame.phraseIndex];
  const visiblePhrase = reducedMotion
    ? LIVING_TOOLCHAIN_PHRASES[0]
    : phrase.slice(0, frame.visibleLength);
  const phaseClass =
    frame.phase === "HOLD"
      ? styles.toolchainHolding
      : frame.phase === "ERASE"
        ? styles.toolchainErasing
        : "";

  return (
    <div
      className={`${styles.livingToolchain} ${phaseClass} ${!running ? styles.toolchainPaused : ""}`}
      data-living-toolchain
    >
      <span className={styles.toolchainPrefix}>I BUILD ACROSS</span>
      <span className={styles.toolchainVisual} aria-hidden="true">
        <span>{visiblePhrase}</span>
        <i className={styles.toolchainCaret} />
      </span>
      <span className={styles.toolchainAccessible}>
        Technology range: {LIVING_TOOLCHAIN_PHRASES.join(", ")}.
      </span>
    </div>
  );
}
