"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  type CSSProperties,
} from "react";

import { ProductDeckControls } from "@/components/concept-v3-rebuild/product-deck/product-deck-controls";
import { ProductDeckPage } from "@/components/concept-v3-rebuild/product-deck/product-deck-page";
import type { ProductDeckItem } from "@/components/concept-v3-rebuild/product-deck/types";
import { useMotionPreference } from "@/lib/motion-preference-context";
import styles from "@/styles/concept-v3-rebuild/product-deck.module.scss";

gsap.registerPlugin(useGSAP);

const HOLD_SECONDS = 5.25;
const MANUAL_RESUME_DELAY = 8;
const HOVER_RESUME_DELAY = 1.4;
const DRAG_DISTANCE = 64;
const DRAG_VELOCITY = 0.55;
const CLICK_MAX = 8;
const INTENT_RATIO = 1.35;

const ATMOSPHERE: Record<
  ProductDeckItem["visualType"],
  { glow: string; accent: string; floor: string }
> = {
  "city-guide": {
    glow: "rgba(94, 143, 255, 0.22)",
    accent: "#6b8fff",
    floor: "rgba(107, 143, 255, 0.14)",
  },
  vending: {
    glow: "rgba(49, 230, 208, 0.22)",
    accent: "#31e6d0",
    floor: "rgba(49, 230, 208, 0.16)",
  },
  messaging: {
    glow: "rgba(242, 184, 79, 0.18)",
    accent: "#f2b84f",
    floor: "rgba(49, 230, 208, 0.12)",
  },
};

export type ProductDeckHandle = {
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
  getIndex: () => number;
  getTransitionState: () => string;
};

interface ProductDeckProps {
  items: ProductDeckItem[];
  onIndexChange?: (index: number, item: ProductDeckItem) => void;
  onTransitionState?: (state: string) => void;
}

function heroIntroReady() {
  if (typeof document === "undefined") return false;
  return (
    document.querySelector<HTMLElement>("[data-motion]")?.dataset.motion ===
    "ready"
  );
}

function progressWrite(root: HTMLElement | null, value: number, active: boolean) {
  if (!root) return;
  root.style.setProperty("--deck-progress", String(value));
  root.dataset.progressActive = active ? "true" : "false";
}

export const ProductDeck = forwardRef<ProductDeckHandle, ProductDeckProps>(
  function ProductDeck({ items, onIndexChange, onTransitionState }, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const stackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [busy, setBusy] = useState(false);
    const [liveMessage, setLiveMessage] = useState(items[0]?.title ?? "");
    const [autoplayActive, setAutoplayActive] = useState(false);
    const transitionState = useRef("idle");
    const activeIndexRef = useRef(0);
    const busyRef = useRef(false);
    const pointerStart = useRef<{
      x: number;
      y: number;
      id: number;
      t: number;
    } | null>(null);
    const dragProgress = useRef(0);
    const dragLocked = useRef(false);
    const draggingRef = useRef(false);
    const holdTween = useRef<gsap.core.Tween | null>(null);
    const resumeTween = useRef<gsap.core.Tween | null>(null);
    const turnTween = useRef<gsap.core.Timeline | null>(null);
    const revealTween = useRef<gsap.core.Timeline | null>(null);
    const pauseReasons = useRef(new Set<string>());
    const introReadyRef = useRef(false);
    const manualUntil = useRef(0);
    const nextRef = useRef<() => void>(() => undefined);
    const previousRef = useRef<() => void>(() => undefined);
    const scheduleHoldRef = useRef<() => void>(() => undefined);
    const pauseAutoplayRef = useRef<(reason: string) => void>(() => undefined);
    const releasePauseRef = useRef<(reason: string) => void>(() => undefined);
    const { effective } = useMotionPreference();
    const reduced = effective === "reduced";
    const prevEffective = useRef(effective);

    const getIsMobile = () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches;

    const setTransition = useCallback(
      (state: string) => {
        transitionState.current = state;
        onTransitionState?.(state);
        if (rootRef.current) rootRef.current.dataset.deckState = state;
      },
      [onTransitionState],
    );

    const applyAtmosphere = useCallback(
      (item: ProductDeckItem | undefined, duration = 0.85) => {
        if (!item || !rootRef.current) return;
        const palette = ATMOSPHERE[item.visualType];
        const target = {
          "--deck-glow": palette.glow,
          "--deck-accent": palette.accent,
          "--deck-floor": palette.floor,
        };
        if (reduced || duration <= 0) {
          gsap.set(rootRef.current, target);
        } else {
          gsap.to(rootRef.current, { ...target, duration, ease: "power2.out" });
        }
        const local = document.querySelector<HTMLElement>(
          "[data-atmosphere-products]",
        );
        if (local) {
          gsap.to(local, {
            background: `radial-gradient(circle, ${palette.glow}, transparent 70%)`,
            duration: reduced ? 0 : duration,
            ease: "power2.out",
          });
        }
        document.documentElement.style.setProperty(
          "--hero-product-accent",
          palette.accent,
        );
      },
      [reduced],
    );

    const runInternalReveal = useCallback(
      (page: HTMLElement | null) => {
        revealTween.current?.kill();
        if (!page || reduced) return;
        const visual = page.dataset.visual;
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            revealTween.current = null;
            page.style.willChange = "auto";
          },
        });
        revealTween.current = tl;

        if (visual === "city-guide") {
          const route = page.querySelector<SVGPathElement>("[data-reveal-route]");
          const pin = page.querySelector("[data-reveal-pin]");
          const sheen = page.querySelector("[data-deck-sheen]");
          if (route) {
            const length = route.getTotalLength?.() ?? 120;
            gsap.set(route, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            tl.to(route, { strokeDashoffset: 0, duration: 0.42 }, 0);
          }
          if (pin) {
            gsap.set(pin, { scale: 0.7, transformOrigin: "50% 100%" });
            tl.to(pin, { scale: 1, duration: 0.28 }, 0.12);
          }
          if (sheen) {
            gsap.set(sheen, { xPercent: -120, opacity: 0.55 });
            tl.to(sheen, { xPercent: 120, duration: 0.45, opacity: 0 }, 0.08);
          }
        } else if (visual === "vending") {
          const scan = page.querySelector("[data-reveal-scan]");
          const light = page.querySelector("[data-reveal-light]");
          const bay = page.querySelector("[data-reveal-bay]");
          const status = page.querySelector("[data-page-status]");
          if (scan) {
            gsap.set(scan, { yPercent: -20, opacity: 0 });
            tl.to(scan, { yPercent: 120, opacity: 0.9, duration: 0.4 }, 0);
          }
          if (light) tl.to(light, { opacity: 1, scale: 1.15, duration: 0.25 }, 0.15);
          if (bay) tl.to(bay, { boxShadow: "0 0 12px rgb(49 230 208 / 45%)", duration: 0.3 }, 0.2);
          if (status) tl.fromTo(status, { opacity: 0.5 }, { opacity: 1, duration: 0.25 }, 0.18);
        } else if (visual === "messaging") {
          const wave = page.querySelector<SVGPathElement>("[data-reveal-wave]");
          const delivered = page.querySelector("[data-reveal-delivered]");
          if (wave) {
            const length = wave.getTotalLength?.() ?? 100;
            gsap.set(wave, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
            tl.to(wave, { strokeDashoffset: 0, duration: 0.4 }, 0);
          }
          if (delivered) {
            gsap.set(delivered, { scale: 0.6, opacity: 0.4 });
            tl.to(delivered, { scale: 1.15, opacity: 1, duration: 0.28 }, 0.22);
            tl.to(delivered, { scale: 1, duration: 0.18 }, 0.45);
          }
        }
      },
      [reduced],
    );

    const applyStackDepth = useCallback(
      (index: number, immediate = false) => {
        const stack = stackRef.current;
        if (!stack) return;
        const pages = [...stack.querySelectorAll<HTMLElement>("[data-deck-page]")];
        const mobile = getIsMobile();
        pages.forEach((page, pageIndex) => {
          const offset = (pageIndex - index + items.length) % items.length;
          const isActive = offset === 0;
          const depth = Math.min(offset, 2);
          const rearVisible = !isActive && depth <= (mobile ? 1 : 2);
          const props = {
            zIndex: isActive ? items.length + 2 : items.length - depth,
            x: isActive ? 0 : depth * 8,
            y: isActive ? 0 : depth * 6,
            rotateZ: isActive ? 0 : depth * 1.05,
            scale: isActive ? 1 : 1 - depth * 0.03,
            autoAlpha: isActive ? 1 : rearVisible ? 1 : 0,
            rotateY: 0,
            z: isActive ? 0 : -depth * 14,
            transformOrigin: "left center",
          };
          if (immediate || reduced) gsap.set(page, props);
          else gsap.to(page, { ...props, duration: 0.28, overwrite: "auto" });
          page.dataset.active = isActive ? "true" : "false";
          page.setAttribute("aria-hidden", isActive ? "false" : "true");
          page.style.willChange = isActive ? "transform" : "auto";
          const face = page.querySelector<HTMLElement>("[data-deck-face]");
          if (face) {
            face.style.opacity = "1";
            face.dataset.silhouette = isActive ? "false" : "true";
          }
        });
      },
      [items.length, reduced],
    );

    useGSAP(
      () => {
        applyStackDepth(activeIndexRef.current, true);
        applyAtmosphere(items[activeIndexRef.current], 0);
      },
      { scope: rootRef, dependencies: [items.length, reduced] },
    );

    const clearHold = useCallback(() => {
      holdTween.current?.kill();
      holdTween.current = null;
      setAutoplayActive(false);
      progressWrite(rootRef.current, 0, false);
    }, []);

    const markManual = useCallback(() => {
      manualUntil.current = Date.now() + MANUAL_RESUME_DELAY * 1000;
      pauseReasons.current.add("manual");
      clearHold();
      resumeTween.current?.kill();
      resumeTween.current = gsap.delayedCall(MANUAL_RESUME_DELAY, () => {
        pauseReasons.current.delete("manual");
        if (pauseReasons.current.size === 0) scheduleHoldRef.current();
      });
    }, [clearHold]);

    const turnTo = useCallback(
      (nextIndex: number, direction: 1 | -1, fromManual = false) => {
        if (busyRef.current || items.length < 2) return;
        const normalized =
          ((nextIndex % items.length) + items.length) % items.length;
        if (normalized === activeIndexRef.current) return;

        const stack = stackRef.current;
        if (!stack) return;
        const pages = [
          ...stack.querySelectorAll<HTMLElement>("[data-deck-page]"),
        ];
        const outgoing = pages[activeIndexRef.current];
        const incoming = pages[normalized];
        if (!outgoing || !incoming) return;

        clearHold();
        if (fromManual) markManual();
        busyRef.current = true;
        setBusy(true);
        setTransition("turning");
        pauseReasons.current.add("turning");

        const incomingItem = items[normalized];
        applyAtmosphere(incomingItem, reduced ? 0 : 0.95);

        const finalize = () => {
          turnTween.current = null;
          activeIndexRef.current = normalized;
          setActiveIndex(normalized);
          applyStackDepth(normalized, true);
          setLiveMessage(incomingItem?.title ?? "");
          onIndexChange?.(normalized, incomingItem);
          busyRef.current = false;
          setBusy(false);
          setTransition("idle");
          pauseReasons.current.delete("turning");
          runInternalReveal(incoming);
          if (pauseReasons.current.size === 0) scheduleHoldRef.current();
          window.dispatchEvent(new CustomEvent("portfolio:deck-settled"));
        };

        if (reduced) {
          gsap.set(outgoing, { autoAlpha: 0, rotateY: 0, x: 0, y: 0, z: 0, scale: 1 });
          gsap.set(incoming, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            rotateY: 0,
            scale: 1,
            z: 0,
            zIndex: items.length + 2,
          });
          const outFace = outgoing.querySelector<HTMLElement>("[data-deck-face]");
          const inFace = incoming.querySelector<HTMLElement>("[data-deck-face]");
          if (outFace) outFace.dataset.silhouette = "true";
          if (inFace) inFace.dataset.silhouette = "false";
          finalize();
          return;
        }

        const mobile = getIsMobile();
        const lift = mobile ? 0.12 : 0.18;
        const turn = mobile ? 0.42 : 0.58;
        const settle = mobile ? 0.18 : 0.26;
        const origin = direction === 1 ? "left center" : "right center";
        const outAngle = mobile
          ? direction === 1
            ? -42
            : 42
          : direction === 1
            ? -78
            : 78;
        const inStart = mobile
          ? direction === 1
            ? 10
            : -10
          : direction === 1
            ? 12
            : -12;

        outgoing.style.willChange = "transform, opacity";
        incoming.style.willChange = "transform, opacity";

        const outFace = outgoing.querySelector<HTMLElement>("[data-deck-face]");
        const inFace = incoming.querySelector<HTMLElement>("[data-deck-face]");
        const outEdge = outgoing.querySelector<HTMLElement>("[data-deck-thickness]");
        const outShadow = outgoing.querySelector<HTMLElement>("[data-deck-shadow]");
        if (inFace) inFace.dataset.silhouette = "false";

        gsap.set(incoming, {
          zIndex: items.length + 1,
          autoAlpha: 1,
          x: direction * (mobile ? 22 : 12),
          y: 5,
          rotateY: inStart,
          scale: 0.975,
          z: -18,
          transformOrigin: origin,
        });
        gsap.set(outgoing, {
          zIndex: items.length + 3,
          transformOrigin: origin,
        });

        const tl = gsap.timeline({ onComplete: finalize });
        turnTween.current = tl;

        // Phase A — Lift
        tl.to(
          outgoing,
          {
            z: mobile ? 18 : 42,
            scale: 1.015,
            y: -6,
            duration: lift,
            ease: "power2.out",
          },
          0,
        );
        if (outShadow) {
          tl.to(
            outShadow,
            {
              opacity: 0.85,
              scaleX: 1.18,
              scaleY: 1.1,
              duration: lift,
              ease: "power2.out",
            },
            0,
          );
        }
        if (outEdge) {
          tl.to(outEdge, { opacity: 1, scaleY: 1.04, duration: lift }, 0);
        }

        // Phase B — Turn
        tl.to(
          outgoing,
          {
            rotateY: outAngle,
            x: direction * (mobile ? -28 : -16),
            y: -4,
            duration: turn,
            ease: "power3.inOut",
          },
          lift * 0.55,
        );
        tl.to(
          outFace,
          {
            opacity: 0,
            duration: turn * 0.45,
            ease: "power2.in",
          },
          lift * 0.55 + turn * 0.28,
        );
        tl.to(
          outgoing,
          {
            autoAlpha: 0,
            duration: turn * 0.35,
            ease: "power2.in",
          },
          lift * 0.55 + turn * 0.55,
        );
        tl.fromTo(
          incoming,
          {
            rotateY: inStart,
            x: direction * (mobile ? 26 : 14),
            scale: 0.97,
            z: -16,
            autoAlpha: 0.98,
          },
          {
            rotateY: inStart * 0.25,
            x: direction * 4,
            scale: 0.99,
            z: -4,
            autoAlpha: 1,
            duration: turn,
            ease: "power3.inOut",
          },
          lift * 0.4,
        );

        // Phase C — Settle
        const settleAt = lift * 0.55 + turn * 0.72;
        tl.to(
          incoming,
          {
            rotateY: 0,
            x: 0,
            y: 0,
            z: 0,
            scale: 1,
            duration: settle,
            ease: "power3.out",
          },
          settleAt,
        );
        tl.add(() => {
          gsap.set(outgoing, {
            rotateY: 0,
            x: 0,
            y: 0,
            z: 0,
            scale: 1,
            autoAlpha: 0,
          });
          if (outFace) {
            outFace.style.opacity = "1";
            outFace.dataset.silhouette = "true";
          }
          if (outShadow) gsap.set(outShadow, { opacity: 0.45, scaleX: 1, scaleY: 1 });
          if (outEdge) gsap.set(outEdge, { opacity: 0.55, scaleY: 1 });
          outgoing.style.willChange = "auto";
          incoming.style.willChange = "auto";
        }, settleAt + settle * 0.2);
      },
      [
        applyAtmosphere,
        applyStackDepth,
        clearHold,
        items,
        markManual,
        onIndexChange,
        reduced,
        runInternalReveal,
        setTransition,
      ],
    );

    const next = useCallback(
      (manual = false) => turnTo(activeIndexRef.current + 1, 1, manual),
      [turnTo],
    );
    const previous = useCallback(
      (manual = false) => turnTo(activeIndexRef.current - 1, -1, manual),
      [turnTo],
    );
    const goTo = useCallback(
      (index: number) => {
        if (index === activeIndexRef.current) return;
        const direction = index > activeIndexRef.current ? 1 : -1;
        turnTo(index, direction as 1 | -1, true);
      },
      [turnTo],
    );

    nextRef.current = () => next(false);
    previousRef.current = () => previous(false);

    const scheduleHold = useCallback(() => {
      if (reduced) return;
      if (!introReadyRef.current && !heroIntroReady()) return;
      if (pauseReasons.current.size > 0) return;
      if (busyRef.current) return;
      if (document.visibilityState !== "visible") return;
      if (Date.now() < manualUntil.current) return;
      const node = rootRef.current;
      if (node) {
        const rect = node.getBoundingClientRect();
        const visible =
          rect.bottom > 80 && rect.top < window.innerHeight - 40;
        if (!visible) return;
      }

      clearHold();
      setAutoplayActive(true);
      const state = { t: 0 };
      holdTween.current = gsap.to(state, {
        t: 1,
        duration: HOLD_SECONDS,
        ease: "none",
        onUpdate: () => {
          progressWrite(rootRef.current, state.t, true);
        },
        onComplete: () => {
          progressWrite(rootRef.current, 0, false);
          setAutoplayActive(false);
          nextRef.current();
        },
      });
    }, [clearHold, reduced]);

    const requestResume = useCallback(
      (delay = HOVER_RESUME_DELAY) => {
        resumeTween.current?.kill();
        if (reduced) return;
        resumeTween.current = gsap.delayedCall(delay, () => {
          if (pauseReasons.current.size === 0) scheduleHoldRef.current();
        });
      },
      [reduced],
    );

    const pauseAutoplay = useCallback(
      (reason: string) => {
        pauseReasons.current.add(reason);
        clearHold();
        if (reason !== "manual") resumeTween.current?.kill();
      },
      [clearHold],
    );

    const releasePause = useCallback(
      (reason: string) => {
        pauseReasons.current.delete(reason);
        if (pauseReasons.current.size === 0) {
          const delay =
            reason === "manual" || Date.now() < manualUntil.current
              ? Math.max(
                  HOVER_RESUME_DELAY,
                  (manualUntil.current - Date.now()) / 1000,
                )
              : HOVER_RESUME_DELAY;
          requestResume(delay);
        }
      },
      [requestResume],
    );

    scheduleHoldRef.current = scheduleHold;
    pauseAutoplayRef.current = pauseAutoplay;
    releasePauseRef.current = releasePause;

    useImperativeHandle(
      ref,
      () => ({
        next: () => next(true),
        previous: () => previous(true),
        goTo,
        getIndex: () => activeIndexRef.current,
        getTransitionState: () => transitionState.current,
      }),
      [goTo, next, previous],
    );

    useEffect(() => {
      const onNext = () => next(true);
      const onPrev = () => previous(true);
      window.addEventListener("portfolio:deck-next", onNext);
      window.addEventListener("portfolio:deck-previous", onPrev);
      return () => {
        window.removeEventListener("portfolio:deck-next", onNext);
        window.removeEventListener("portfolio:deck-previous", onPrev);
      };
    }, [next, previous]);

    useEffect(() => {
      if (prevEffective.current === effective) return;
      prevEffective.current = effective;
      turnTween.current?.kill();
      revealTween.current?.kill();
      clearHold();
      resumeTween.current?.kill();
      busyRef.current = false;
      setBusy(false);
      pauseReasons.current.delete("turning");
      applyStackDepth(activeIndexRef.current, true);
      applyAtmosphere(items[activeIndexRef.current], 0);
      setTransition("idle");
      if (effective === "reduced") {
        pauseReasons.current.add("reduced");
      } else {
        pauseReasons.current.delete("reduced");
        introReadyRef.current = heroIntroReady();
        gsap.delayedCall(1.2, () => scheduleHoldRef.current());
      }
    }, [
      effective,
      applyAtmosphere,
      applyStackDepth,
      clearHold,
      items,
      setTransition,
    ]);

    useEffect(() => {
      if (reduced) {
        clearHold();
        introReadyRef.current = true;
        pauseReasons.current.add("reduced");
        return;
      }
      pauseReasons.current.delete("reduced");

      const startIfReady = () => {
        introReadyRef.current = true;
        scheduleHoldRef.current();
      };
      if (heroIntroReady()) startIfReady();
      const onIntro = () => startIfReady();
      window.addEventListener("portfolio:hero-intro-complete", onIntro);
      const root = document.querySelector("[data-motion]");
      const observer =
        root &&
        new MutationObserver(() => {
          if (heroIntroReady()) startIfReady();
        });
      if (root && observer) {
        observer.observe(root, {
          attributes: true,
          attributeFilter: ["data-motion"],
        });
      }
      return () => {
        window.removeEventListener("portfolio:hero-intro-complete", onIntro);
        observer?.disconnect();
      };
    }, [clearHold, reduced]);

    useEffect(() => {
      return () => {
        clearHold();
        resumeTween.current?.kill();
        turnTween.current?.kill();
        revealTween.current?.kill();
      };
    }, [clearHold]);

    useEffect(() => {
      const onVisibility = () => {
        if (document.visibilityState === "hidden") {
          pauseAutoplayRef.current("hidden");
        } else {
          releasePauseRef.current("hidden");
        }
      };
      document.addEventListener("visibilitychange", onVisibility);
      return () =>
        document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    useEffect(() => {
      const node = rootRef.current;
      if (!node) return;

      const resetDragVisual = (page: HTMLElement | null) => {
        if (!page) return;
        gsap.to(page, {
          rotateY: 0,
          x: 0,
          y: 0,
          z: 0,
          scale: 1,
          duration: 0.38,
          ease: "power3.out",
          onComplete: () => {
            page.style.willChange = "auto";
          },
        });
        const shadow = page.querySelector<HTMLElement>("[data-deck-shadow]");
        const edge = page.querySelector<HTMLElement>("[data-deck-thickness]");
        if (shadow) gsap.to(shadow, { opacity: 0.45, scaleX: 1, duration: 0.3 });
        if (edge) gsap.to(edge, { opacity: 0.55, duration: 0.3 });
      };

      const onKey = (event: KeyboardEvent) => {
        if (!node.contains(document.activeElement)) return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next(true);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          previous(true);
        }
      };

      const onWheel = (event: WheelEvent) => {
        if (!node.matches(":hover") && !node.contains(document.activeElement)) {
          return;
        }
        if (Math.abs(event.deltaY) < 24) return;
        event.preventDefault();
        markManual();
        if (event.deltaY > 0) next(true);
        else previous(true);
      };

      const onPointerEnter = () => pauseAutoplayRef.current("hover");
      const onPointerLeave = () => {
        if (!draggingRef.current) releasePauseRef.current("hover");
      };
      const onFocusIn = () => pauseAutoplayRef.current("focus");
      const onFocusOut = (event: FocusEvent) => {
        if (!node.contains(event.relatedTarget as Node | null)) {
          releasePauseRef.current("focus");
        }
      };

      const onPointerDown = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if (busyRef.current) return;
        const target = event.target as HTMLElement | null;
        if (target?.closest("button, a, [role='tab']")) return;
        const pointerId = event.pointerId || 1;
        pointerStart.current = {
          x: event.clientX,
          y: event.clientY,
          id: pointerId,
          t: performance.now(),
        };
        dragProgress.current = 0;
        dragLocked.current = false;
        draggingRef.current = false;
        pauseAutoplayRef.current("drag");
        node.dataset.dragging = "false";
        try {
          node.setPointerCapture(pointerId);
        } catch {
          /* ignore */
        }
      };

      const onPointerMove = (event: PointerEvent) => {
        const start = pointerStart.current;
        const pointerId = event.pointerId || 1;
        if (!start || start.id !== pointerId || busyRef.current) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (!dragLocked.current) {
          if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
          if (Math.abs(dx) < Math.abs(dy) * INTENT_RATIO) {
            pointerStart.current = null;
            releasePauseRef.current("drag");
            return;
          }
          dragLocked.current = true;
          draggingRef.current = true;
          node.dataset.dragging = "true";
        }
        const stack = stackRef.current;
        const current = stack?.querySelector<HTMLElement>(
          '[data-deck-page][data-active="true"]',
        );
        if (!current || reduced) return;
        current.style.willChange = "transform";
        const max = getIsMobile() ? 36 : 70;
        const progress = Math.max(-1, Math.min(1, dx / 140));
        dragProgress.current = progress;
        const angle = progress * -max;
        gsap.set(current, {
          rotateY: angle,
          x: dx * 0.1,
          z: 12 + Math.abs(progress) * 28,
          scale: 1 + Math.abs(progress) * 0.012,
          transformOrigin: dx < 0 ? "left center" : "right center",
        });
        const shadow = current.querySelector<HTMLElement>("[data-deck-shadow]");
        const edge = current.querySelector<HTMLElement>("[data-deck-thickness]");
        if (shadow) {
          gsap.set(shadow, {
            opacity: 0.45 + Math.abs(progress) * 0.4,
            scaleX: 1 + Math.abs(progress) * 0.2,
          });
        }
        if (edge) gsap.set(edge, { opacity: 0.55 + Math.abs(progress) * 0.45 });
      };

      const onPointerUp = (event: PointerEvent) => {
        const start = pointerStart.current;
        pointerStart.current = null;
        const pointerId = event.pointerId || 1;
        try {
          node.releasePointerCapture(pointerId);
        } catch {
          /* ignore */
        }
        node.dataset.dragging = "false";
        if (!start || start.id !== pointerId) {
          releasePauseRef.current("drag");
          return;
        }
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        const dt = Math.max(16, performance.now() - start.t);
        const velocity = Math.abs(dx) / dt;
        const wasDrag = draggingRef.current;
        draggingRef.current = false;
        dragLocked.current = false;

        const stack = stackRef.current;
        const current = stack?.querySelector<HTMLElement>(
          '[data-deck-page][data-active="true"]',
        );

        const shouldComplete =
          wasDrag &&
          Math.abs(dx) > Math.abs(dy) * INTENT_RATIO &&
          (Math.abs(dx) >= DRAG_DISTANCE || velocity >= DRAG_VELOCITY);

        if (shouldComplete) {
          if (dx < 0) next(true);
          else previous(true);
        } else if (
          !wasDrag &&
          Math.abs(dx) < CLICK_MAX &&
          Math.abs(dy) < CLICK_MAX
        ) {
          if (current) gsap.set(current, { rotateY: 0, x: 0, z: 0, scale: 1 });
          next(true);
        } else {
          resetDragVisual(current ?? null);
          releasePauseRef.current("drag");
          return;
        }
        releasePauseRef.current("drag");
      };

      node.addEventListener("keydown", onKey);
      node.addEventListener("wheel", onWheel, { passive: false });
      node.addEventListener("pointerenter", onPointerEnter);
      node.addEventListener("pointerleave", onPointerLeave);
      node.addEventListener("focusin", onFocusIn);
      node.addEventListener("focusout", onFocusOut);
      node.addEventListener("pointerdown", onPointerDown);
      node.addEventListener("pointermove", onPointerMove);
      node.addEventListener("pointerup", onPointerUp);
      node.addEventListener("pointercancel", onPointerUp);
      return () => {
        node.removeEventListener("keydown", onKey);
        node.removeEventListener("wheel", onWheel);
        node.removeEventListener("pointerenter", onPointerEnter);
        node.removeEventListener("pointerleave", onPointerLeave);
        node.removeEventListener("focusin", onFocusIn);
        node.removeEventListener("focusout", onFocusOut);
        node.removeEventListener("pointerdown", onPointerDown);
        node.removeEventListener("pointermove", onPointerMove);
        node.removeEventListener("pointerup", onPointerUp);
        node.removeEventListener("pointercancel", onPointerUp);
      };
    }, [markManual, next, previous, reduced]);

    if (items.length === 0) return null;
    const activeItem = items[activeIndex];

    return (
      <div
        ref={rootRef}
        className={styles.deck}
        data-artifact="products"
        data-product-deck
        data-deck-state="idle"
        data-visual={activeItem?.visualType}
        data-reduced={reduced ? "true" : undefined}
        tabIndex={0}
        aria-roledescription="product deck"
        aria-label="Product page deck"
        style={
          {
            "--deck-accent":
              ATMOSPHERE[activeItem?.visualType ?? "vending"].accent,
            "--deck-glow": ATMOSPHERE[activeItem?.visualType ?? "vending"].glow,
            "--deck-floor":
              ATMOSPHERE[activeItem?.visualType ?? "vending"].floor,
            "--deck-progress": "0",
          } as CSSProperties
        }
      >
        <div className={styles.deckAura} aria-hidden="true" data-deck-aura />
        <div className={styles.deckStage}>
          <div className={styles.rearEdges} aria-hidden="true">
            <span />
            <span />
          </div>
          <div ref={stackRef} className={styles.stack} data-deck-stack>
            {items.map((item, index) => (
              <ProductDeckPage
                key={item.id}
                item={item}
                active={index === activeIndex}
              />
            ))}
          </div>
        </div>

        <ProductDeckControls
          items={items}
          activeIndex={activeIndex}
          busy={busy}
          autoplayActive={autoplayActive && !reduced}
          onPrevious={() => previous(true)}
          onNext={() => next(true)}
          onSelect={goTo}
        />

        <p className={styles.liveRegion} aria-live="polite">
          {liveMessage}
        </p>
      </div>
    );
  },
);
