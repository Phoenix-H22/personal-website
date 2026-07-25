"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";

import { useMotionPreference } from "@/lib/motion-preference-context";

/**
 * Slow, visibility-aware cover loops. Pauses when off-screen or document hidden.
 */
export function useFeaturedCoverAmbient(
  rootRef: RefObject<HTMLElement | null>,
  /** Remount key when filtered project set changes. */
  layoutKey: string,
) {
  const { effective } = useMotionPreference();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || effective === "reduced") return;

    const tweens: gsap.core.Tween[] = [];
    const observers: IntersectionObserver[] = [];

    const bindCover = (cover: Element) => {
      const steps = cover.querySelectorAll("[data-cover-step]");
      if (!steps.length) return;

      gsap.set(steps, { autoAlpha: 0.42 });
      const pulse = gsap.to(steps, {
        autoAlpha: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "sine.inOut",
        repeat: -1,
        repeatDelay: 3.2,
        yoyo: true,
        paused: true,
      });
      tweens.push(pulse);

      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting && document.visibilityState === "visible") {
            pulse.play();
          } else {
            pulse.pause();
          }
        },
        { threshold: 0.25 },
      );
      io.observe(cover);
      observers.push(io);
    };

    root.querySelectorAll("[data-project-cover]").forEach(bindCover);

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        tweens.forEach((t) => t.pause());
      } else {
        root.querySelectorAll("[data-project-cover]").forEach((cover) => {
          const rect = cover.getBoundingClientRect();
          const inView =
            rect.bottom > 40 &&
            rect.top < window.innerHeight - 40;
          if (!inView) return;
          tweens.forEach((t) => {
            const target = t.targets()[0] as Element | undefined;
            if (target && cover.contains(target)) t.resume();
          });
        });
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observers.forEach((o) => o.disconnect());
      tweens.forEach((t) => t.kill());
      gsap.set(root.querySelectorAll("[data-cover-step]"), {
        clearProps: "opacity,visibility",
      });
    };
  }, [effective, rootRef, layoutKey]);
}
