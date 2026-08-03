"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FocusEvent,
} from "react";

import { useMotionPreference } from "@/lib/motion-preference-context";

export const PROJECT_ROTATION_INTERVAL_MS = 6_000;
export const PROJECT_SELECTION_COOLDOWN_MS = 11_000;

interface ProjectRotationActivity {
  projectCount: number;
  reducedMotion: boolean;
  isInViewport: boolean;
  isDocumentVisible: boolean;
  isInteractionPaused: boolean;
  isUserPaused: boolean;
}

interface ProjectRotationClock {
  dispose: () => void;
  pause: () => void;
  reset: () => void;
  resume: () => void;
}

interface ProjectAutoRotationOptions {
  projectCount: number;
  onRotate: () => void;
}

export function getNextProjectIndex(currentIndex: number, projectCount: number) {
  return (currentIndex + 1) % projectCount;
}

export function shouldRotateProjects(activity: ProjectRotationActivity) {
  return (
    activity.projectCount > 1 &&
    !activity.reducedMotion &&
    activity.isInViewport &&
    activity.isDocumentVisible &&
    !activity.isInteractionPaused &&
    !activity.isUserPaused
  );
}

export function createProjectRotationClock(
  onElapsed: () => void,
): ProjectRotationClock {
  let remainingMs = PROJECT_ROTATION_INTERVAL_MS;
  let deadline = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timer === null) return;
    clearTimeout(timer);
    timer = null;
  };

  const pause = () => {
    if (timer === null) return;
    remainingMs = Math.max(0, deadline - Date.now());
    clearTimer();
  };

  const resume = () => {
    if (timer !== null) return;
    deadline = Date.now() + remainingMs;
    timer = setTimeout(() => {
      timer = null;
      remainingMs = PROJECT_ROTATION_INTERVAL_MS;
      onElapsed();
      resume();
    }, remainingMs);
  };

  const reset = () => {
    clearTimer();
    remainingMs = PROJECT_ROTATION_INTERVAL_MS;
  };

  const dispose = () => {
    clearTimer();
  };

  return { dispose, pause, reset, resume };
}

function usePageActivity(rootRef: React.RefObject<HTMLElement | null>) {
  const [isInViewport, setIsInViewport] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => {
      setIsDocumentVisible(document.visibilityState === "visible");
    };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(
          Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.35),
        );
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [rootRef]);

  return { isDocumentVisible, isInViewport };
}

function useManualSelectionCooldown() {
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const cooldownTimerRef = useRef<number | null>(null);

  const startCooldown = () => {
    if (cooldownTimerRef.current !== null) {
      window.clearTimeout(cooldownTimerRef.current);
    }
    setIsCooldownActive(true);
    cooldownTimerRef.current = window.setTimeout(() => {
      cooldownTimerRef.current = null;
      setIsCooldownActive(false);
    }, PROJECT_SELECTION_COOLDOWN_MS);
  };

  useEffect(
    () => () => {
      if (cooldownTimerRef.current !== null) {
        window.clearTimeout(cooldownTimerRef.current);
      }
    },
    [],
  );

  return { isCooldownActive, startCooldown };
}

export function useProjectAutoRotation({
  projectCount,
  onRotate,
}: ProjectAutoRotationOptions) {
  const rootRef = useRef<HTMLElement>(null);
  const { effective } = useMotionPreference();
  const pageActivity = usePageActivity(rootRef);
  const cooldown = useManualSelectionCooldown();
  const [isPointerPaused, setIsPointerPaused] = useState(false);
  const [isFocusPaused, setIsFocusPaused] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const onRotateEvent = useEffectEvent(onRotate);
  const rotationClockRef = useRef<ProjectRotationClock | null>(null);

  const reducedMotion = effective === "reduced";
  const isInteractionPaused =
    isPointerPaused || isFocusPaused || cooldown.isCooldownActive;
  const shouldRotate = shouldRotateProjects({
    projectCount,
    reducedMotion,
    ...pageActivity,
    isInteractionPaused,
    isUserPaused,
  });

  useEffect(
    () => {
      const clock = createProjectRotationClock(() => onRotateEvent());
      rotationClockRef.current = clock;
      return () => {
        clock.dispose();
        rotationClockRef.current = null;
      };
    },
    [],
  );

  useEffect(() => {
    const clock = rotationClockRef.current;
    if (!clock) return;
    if (shouldRotate) clock.resume();
    else clock.pause();
    return () => clock.pause();
  }, [shouldRotate]);

  const pauseAfterManualSelection = () => {
    rotationClockRef.current?.reset();
    cooldown.startCooldown();
  };

  const resumeAfterFocus = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocusPaused(false);
    }
  };

  return {
    ...pageActivity,
    isCooldownActive: cooldown.isCooldownActive,
    isUserPaused,
    pauseAfterManualSelection,
    pauseForFocus: () => setIsFocusPaused(true),
    pauseForPointer: () => setIsPointerPaused(true),
    pauseForPress: cooldown.startCooldown,
    reducedMotion,
    resumeAfterFocus,
    resumeAfterPointer: () => setIsPointerPaused(false),
    rootRef,
    shouldRotate,
    toggleUserPause: () => setIsUserPaused((paused) => !paused),
  };
}
