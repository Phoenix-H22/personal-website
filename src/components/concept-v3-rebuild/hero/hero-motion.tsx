"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useSyncExternalStore } from "react";

import { useLayoutModeOptional } from "@/components/concept-v3-rebuild/shared/layout-mode-provider";
import { useMotionPreference } from "@/lib/motion-preference-context";
import {
  readDevOverrideFull,
  readStoredMotionPreference,
  readSystemReducedMotion,
  resolveEffectiveMotion,
} from "@/lib/motion-preference";
import {
  heroMotionFamily,
  type HeroMotionFamily,
  type LayoutMode,
} from "@/lib/concept-v3-rebuild/layout-mode";
import styles from "@/styles/concept-v3-rebuild/hero.module.scss";

gsap.registerPlugin(useGSAP);

type MotionFlags = {
  debug: boolean;
  slow: boolean;
  overrideFull: boolean;
};

const FLAGS_OFF: MotionFlags = {
  debug: false,
  slow: false,
  overrideFull: false,
};
const FLAG_CACHE = new Map<string, MotionFlags>();

function flagKey(debug: boolean, slow: boolean, overrideFull: boolean) {
  return `${debug ? 1 : 0}${slow ? 1 : 0}${overrideFull ? 1 : 0}`;
}

function cachedFlags(
  debug: boolean,
  slow: boolean,
  overrideFull: boolean,
): MotionFlags {
  const key = flagKey(debug, slow, overrideFull);
  let value = FLAG_CACHE.get(key);
  if (!value) {
    value = { debug, slow, overrideFull };
    FLAG_CACHE.set(key, value);
  }
  return value;
}

function readMotionFlags(): MotionFlags {
  if (process.env.NODE_ENV !== "development") return FLAGS_OFF;
  const params = new URLSearchParams(window.location.search);
  return cachedFlags(
    params.get("motionDebug") === "1",
    params.get("motionSlow") === "1",
    params.get("motionOverride") === "full",
  );
}

function useMotionFlags() {
  return useSyncExternalStore(
    () => () => undefined,
    readMotionFlags,
    () => FLAGS_OFF,
  );
}

function subscribeMedia(query: string, onStoreChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (onStoreChange) => subscribeMedia(query, onStoreChange),
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

function clearLayoutTransforms(targets: Array<Element | null | undefined>) {
  const nodes = targets.filter(Boolean) as Element[];
  if (!nodes.length) return;
  gsap.set(nodes, { clearProps: "transform,x,y,scale,rotate,rotateX,rotateY" });
}

function parseMetricValue(text: string) {
  const match = text.trim().match(/^([\d.]+)\s*([KkMm])?(.*)$/);
  if (!match) return null;
  const n = Number(match[1]);
  if (Number.isNaN(n)) return null;
  return { end: n, suffix: `${match[2] ?? ""}${match[3] ?? ""}` };
}

interface HeroMotionProps {
  children: React.ReactNode;
  layoutMode?: LayoutMode;
  /** Drives which proof slots the timeline expects. */
  composition?: "full-proof-constellation" | "simplified";
}

/**
 * Priority: development query override → stored preference → OS preference.
 */
export function HeroMotion({
  children,
  layoutMode,
  composition: heroComposition = "full-proof-constellation",
}: HeroMotionProps) {
  const root = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const replayRef = useRef<(() => void) | null>(null);
  const ambientRef = useRef<gsap.core.Tween[]>([]);
  const flags = useMotionFlags();
  const layout = useLayoutModeOptional();
  const mode = layoutMode ?? layout.mode;
  const heroFamily = heroMotionFamily(mode);
  const {
    preference,
    systemReduced,
    overrideFull,
    effective,
    setPreference,
    clearPreference,
  } = useMotionPreference();
  const coarse = useMediaQuery("(pointer: coarse)", true);

  const writeDebug = (patch: Record<string, string | number | boolean>) => {
    const panel = panelRef.current;
    if (!panel) return;
    for (const [key, value] of Object.entries(patch)) {
      const row = panel.querySelector(`[data-debug="${key}"]`);
      if (row) row.textContent = String(value);
    }
  };

  useEffect(() => {
    const node = root.current;
    if (node && !node.dataset.motion) node.dataset.motion = "pending";
    const deck = document.querySelector("[data-product-deck]");
    writeDebug({
      storedPreference: preference ?? "none",
      systemPreference: systemReduced ? "reduced" : "full",
      effectivePreference: effective,
      motionOverride: flags.overrideFull || overrideFull ? "full" : "none",
      pointerType: coarse ? "coarse" : "fine",
      breakpoint: mode,
      heroFamily,
      timelineState: node?.dataset.motion ?? "pending",
      currentProduct:
        deck?.querySelector('[data-active="true"]')?.getAttribute("data-deck-page") ??
        "",
      deckTransitionState: deck?.getAttribute("data-deck-state") ?? "idle",
    });
  }, [
    preference,
    systemReduced,
    effective,
    overrideFull,
    flags.overrideFull,
    coarse,
    mode,
    heroFamily,
  ]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      let cancelled = false;
      const ambientTweens = ambientRef.current;
      ambientTweens.forEach((t) => t.kill());
      ambientTweens.length = 0;

      const liveOverride =
        process.env.NODE_ENV === "development" &&
        (flags.overrideFull || readDevOverrideFull());
      // Resolve from live storage + matchMedia — not the hydration snapshot —
      // so Case A (system + OS reduced) never starts a full intro, and Case B
      // (stored full + OS reduced) still animates.
      const liveEffective = resolveEffectiveMotion(
        readStoredMotionPreference(),
        readSystemReducedMotion(),
        liveOverride,
      );
      const skipMotion = liveEffective === "reduced";
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const composition: HeroMotionFamily = heroFamily;
      const timeScale = flags.slow ? 0.4 : 1;
      // Outer artifact shells always settle at neutral transforms (no rotate /
      // no clip). Cinematic depth is provided by inner layers + decorative
      // sheets, and by the pointer tilt applied to the inner surface only.
      const settledRotate = 0;

      const atmosphere = el.querySelectorAll("[data-atmosphere]");
      const floor = el.querySelector("[data-atmosphere-floor]");
      const nav = document.querySelector("[data-rebuild-nav]");
      const eyebrow = el.querySelector("[data-hero-eyebrow]");
      const name = el.querySelector("[data-hero-name]");
      const headline = el.querySelector("[data-hero-headline]");
      const summary = el.querySelector("[data-hero-summary]");
      const techLine = el.querySelector("[data-hero-tech-line]");
      const techItems = el.querySelectorAll("[data-tech-item]");
      const credential = el.querySelector("[data-education-credential]");
      const actions = el.querySelector("[data-hero-actions]");
      const socials = el.querySelector("[data-hero-socials]");
      const exploreSignal = el.querySelector(
        "[data-explore-selected-systems]",
      );
      const upwork = el.querySelector<HTMLElement>("[data-artifact='upwork']");
      const upworkShell = el.querySelector<HTMLElement>("[data-upwork-shell]");
      const commerce = el.querySelector("[data-artifact='commerce']");
      const education = el.querySelector("[data-artifact='education']");
      const products = el.querySelector("[data-artifact='products']");
      const productNodes = el.querySelectorAll("[data-product]");
      const progress = el.querySelector<SVGCircleElement>("[data-score-progress]");
      const scoreValue = el.querySelector<HTMLElement>("[data-score-value]");
      const verified = el.querySelector("[data-upwork-verified]");
      const seal = el.querySelector("[data-upwork-seal]");
      const sheen = el.querySelector("[data-upwork-sheen]");

      const startAmbient = () => {
        const signal = el.querySelector<SVGPathElement>(
          "[data-constellation-signal]",
        );
        if (signal) {
          gsap.set(signal, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 0.85 });
          ambientTweens.push(
            gsap.to(signal, {
              strokeDashoffset: 0,
              duration: 2.8,
              repeat: -1,
              repeatDelay: 5.5,
              ease: "power1.inOut",
            }),
          );
        }
        const status = el.querySelector("[data-commerce-status]");
        if (status) {
          ambientTweens.push(
            gsap.to(status, {
              opacity: 0.55,
              duration: 1.8,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
            }),
          );
        }
      };

      const revealFinal = () => {
        const clearTargets = [
          ...atmosphere,
          nav,
          eyebrow,
          name,
          headline,
          summary,
          techLine,
          ...techItems,
          credential,
          actions,
          socials,
          exploreSignal,
          upwork,
          commerce,
          education,
          products,
          ...productNodes,
        ].filter(Boolean);
        if (clearTargets.length) {
          gsap.set(clearTargets, {
            clearProps: "opacity,visibility,transform,filter",
          });
        }
        const settleTargets = [
          upwork,
          commerce,
          education,
          products,
          ...productNodes,
        ].filter(Boolean);
        if (settleTargets.length) {
          gsap.set(settleTargets, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
          });
        }
        if (upworkShell) {
          gsap.set(upworkShell, {
            clearProps: "transform,rotateX,rotateY",
          });
        }
        if (progress) {
          progress.style.strokeDashoffset = String(
            progress.dataset.targetOffset ?? 0,
          );
        }
        if (scoreValue) scoreValue.textContent = "100%";
        if (verified) gsap.set(verified, { autoAlpha: 1 });
        if (seal) gsap.set(seal, { autoAlpha: 1, scale: 1 });
        el.querySelectorAll("[data-metric-value]").forEach((metric) => {
          const finalText = metric.getAttribute("data-metric-final");
          if (finalText) metric.textContent = finalText;
          gsap.set(metric, { autoAlpha: 1 });
        });
        el.dataset.motion = "ready";
        writeDebug({
          timelineCreated: true,
          timelineProgress: 1,
          timelineState: "ready",
          systemPreference: systemReduced ? "reduced" : "full",
          effectivePreference: "reduced",
          motionOverride: liveOverride ? "full" : "none",
          breakpoint: composition,
        });
        window.dispatchEvent(new CustomEvent("portfolio:hero-intro-complete"));
      };

      writeDebug({
        systemPreference: systemReduced ? "reduced" : "full",
        effectivePreference: skipMotion ? "reduced" : "full",
        motionOverride: liveOverride ? "full" : "none",
        breakpoint: composition,
        pointerType: isCoarse ? "coarse" : "fine",
      });

      if (skipMotion) {
        revealFinal();
        replayRef.current = null;
        return;
      }

      const buildTimeline = () => {
        ambientTweens.forEach((t) => t.kill());
        ambientTweens.length = 0;

        el.dataset.motion = "pending";
        writeDebug({ timelineState: "pending", timelineProgress: 0 });

        gsap.set(
          [
            eyebrow,
            name,
            headline,
            summary,
            techLine,
            credential,
            actions,
            socials,
            exploreSignal,
          ].filter(Boolean),
          { autoAlpha: 0, y: 24 },
        );
        if (techItems.length) {
          gsap.set(techItems, { autoAlpha: 0, y: 8 });
        }
        if (atmosphere.length) gsap.set(atmosphere, { autoAlpha: 0.1 });
        if (floor) gsap.set(floor, { autoAlpha: 0.15 });
        if (nav) gsap.set(nav, { autoAlpha: 0.15, y: -12 });
        if (verified) gsap.set(verified, { autoAlpha: 0, y: 6 });
        if (seal) gsap.set(seal, { autoAlpha: 0, scale: 0.88 });
        if (sheen) gsap.set(sheen, { xPercent: -130, autoAlpha: 0 });

        if (composition === "cinematic") {
          if (upwork) {
            gsap.set(upwork, {
              autoAlpha: 0,
              x: -52,
              y: -34,
              scale: 0.9,
              rotate: -8,
            });
          }
          if (commerce) {
            gsap.set(commerce, {
              autoAlpha: 0,
              x: -42,
              y: 40,
              scale: 0.9,
              rotate: 3,
            });
          }
          if (education) {
            gsap.set(education, {
              autoAlpha: 0,
              x: 48,
              y: -32,
              scale: 0.9,
              rotate: 4,
            });
          }
          if (products) {
            gsap.set(products, { autoAlpha: 0, x: 36, y: 36, scale: 0.92 });
          }
          productNodes.forEach((node, index) => {
            gsap.set(node, {
              autoAlpha: 0,
              y: 18 + index * 6,
              scale: 0.9,
            });
          });
        } else if (composition === "short-landscape") {
          gsap.set([upwork, commerce, education, products].filter(Boolean), {
            autoAlpha: 0,
            y: 18,
            scale: 0.96,
          });
          if (productNodes.length) gsap.set(productNodes, { autoAlpha: 0, y: 10 });
        } else {
          gsap.set([upwork, commerce, education, products].filter(Boolean), {
            autoAlpha: 0,
            y: 36,
            scale: 0.94,
          });
          if (productNodes.length) gsap.set(productNodes, { autoAlpha: 0, y: 16 });
        }

        if (progress) {
          gsap.set(progress, {
            strokeDashoffset: Number(progress.dataset.circumference ?? 0),
          });
        }
        if (scoreValue) scoreValue.textContent = "0%";

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          paused: true,
          onStart: () => {
            if (cancelled) return;
            el.dataset.motion = "running";
            writeDebug({
              timelineCreated: true,
              timelineState: "running",
              systemPreference: systemReduced ? "reduced" : "full",
              effectivePreference: "full",
              motionOverride: liveOverride ? "full" : "none",
              breakpoint: composition,
              pointerType: isCoarse ? "coarse" : "fine",
            });
          },
          onUpdate: () => {
            if (cancelled) return;
            writeDebug({
              timelineProgress: Number(tl.progress().toFixed(3)),
              timelineState: el.dataset.motion ?? "running",
            });
          },
          onComplete: () => {
            if (cancelled) return;
            el.dataset.motion = "ready";
            writeDebug({ timelineProgress: 1, timelineState: "ready" });
            startAmbient();
            window.dispatchEvent(
              new CustomEvent("portfolio:hero-intro-complete"),
            );
          },
        });

        // Master intro — no AK Core stage
        tl.to(atmosphere, { autoAlpha: 1, duration: 0.55 }, 0)
          .to(floor, { autoAlpha: 1, duration: 0.55 }, 0)
          .to(nav, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.1)
          .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.38 }, 0.2)
          .to(name, { autoAlpha: 1, y: 0, duration: 0.46 }, 0.32)
          .to(headline, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.46)
          .to(summary, { autoAlpha: 1, y: 0, duration: 0.38 }, 0.58);
        if (techLine) {
          tl.to(techLine, { autoAlpha: 1, y: 0, duration: 0.32 }, 0.68);
        }
        if (techItems.length) {
          tl.to(
            techItems,
            { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.05 },
            0.7,
          );
        }
        if (credential) {
          tl.to(credential, { autoAlpha: 1, y: 0, duration: 0.34 }, 0.82);
        }
        tl.to(actions, { autoAlpha: 1, y: 0, duration: 0.36 }, 0.92).to(
          socials,
          { autoAlpha: 1, y: 0, duration: 0.34 },
          1.02,
        );
        if (exploreSignal) {
          tl.to(exploreSignal, { autoAlpha: 1, y: 0, duration: 0.34 }, 1.12);
        }
        if (upwork) {
          tl.to(
            upwork,
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: settledRotate,
              duration: 0.6,
            },
            0.95,
          );
        }
        if (commerce) {
          tl.to(
            commerce,
            { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: 0.56 },
            1.1,
          );
        }
        if (education) {
          tl.to(
            education,
            { autoAlpha: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: 0.56 },
            1.22,
          );
        }
        if (products) {
          tl.to(
            products,
            { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.5 },
            1.34,
          );
        }

        productNodes.forEach((node, index) => {
          tl.to(
            node,
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.42 },
            1.4 + index * 0.08,
          );
        });

        if (seal) {
          tl.to(
            seal,
            { autoAlpha: 1, scale: 1, duration: 0.38, ease: "back.out(1.4)" },
            1.35,
          );
        }
        if (progress) {
          tl.to(
            progress,
            {
              strokeDashoffset: Number(progress.dataset.targetOffset ?? 0),
              duration: 0.9,
              ease: "power2.out",
            },
            1.38,
          );
        }
        if (scoreValue) {
          const counter = { n: 0 };
          tl.to(
            counter,
            {
              n: 100,
              duration: 0.9,
              ease: "power2.out",
              onUpdate: () => {
                scoreValue.textContent = `${Math.round(counter.n)}%`;
              },
            },
            1.38,
          );
        }
        if (verified) {
          tl.to(verified, { autoAlpha: 1, y: 0, duration: 0.32 }, 2.15);
        }
        if (sheen) {
          tl.set(sheen, { autoAlpha: 0.75 }, 2.4)
            .to(
              sheen,
              { xPercent: 130, duration: 0.8, ease: "sine.inOut" },
              2.4,
            )
            .to(sheen, { autoAlpha: 0, duration: 0.15 }, 3.05);
        }

        const wave = el.querySelector<SVGPathElement>("[data-commerce-wave]");
        if (wave) {
          gsap.set(wave, { strokeDasharray: 1, strokeDashoffset: 1 });
          tl.to(wave, { strokeDashoffset: 0, duration: 0.75 }, 1.55);
        }
        el.querySelectorAll("[data-flow-step]").forEach((step, index) => {
          gsap.set(step, { autoAlpha: 0.2 });
          tl.to(step, { autoAlpha: 1, duration: 0.2 }, 1.58 + index * 0.09);
        });
        el.querySelectorAll("[data-flow-signal]").forEach((signal, index) => {
          gsap.set(signal, { autoAlpha: 0, x: -8 });
          tl.to(
            signal,
            { autoAlpha: 1, x: 8, duration: 0.4, ease: "power1.inOut" },
            1.65 + index * 0.09,
          ).to(signal, { autoAlpha: 0, duration: 0.15 }, 1.95 + index * 0.09);
        });
        el.querySelectorAll("[data-metric-value]").forEach((metric, index) => {
          const finalRaw =
            metric.getAttribute("data-metric-final") ??
            metric.getAttribute("aria-label")?.split(": ").pop() ??
            metric.textContent ??
            "";
          const parsed = parseMetricValue(finalRaw.trim());
          if (!parsed) return;
          const finalText = `${parsed.end}${parsed.suffix}`;
          metric.setAttribute("aria-label", finalText);
          metric.setAttribute("data-metric-final", finalText);
          const start = Math.max(
            1,
            Math.round(parsed.end * (parsed.end >= 100 ? 0.82 : 0.8)),
          );
          const state = { n: start };
          gsap.set(metric, { autoAlpha: 0.35 });
          metric.textContent = `${start}${parsed.suffix}`;
          tl.to(metric, { autoAlpha: 1, duration: 0.2 }, 1.2 + index * 0.05);
          tl.to(
            state,
            {
              n: parsed.end,
              duration: 0.95,
              ease: "power2.out",
              onUpdate: () => {
                metric.textContent = `${Math.round(state.n)}${parsed.suffix}`;
              },
              onComplete: () => {
                metric.textContent = finalText;
              },
            },
            1.22 + index * 0.05,
          );
        });

        const eduRoute = el.querySelector("[data-edu-route]");
        if (eduRoute) {
          gsap.set(eduRoute, { scaleY: 0, transformOrigin: "top center" });
          tl.to(eduRoute, { scaleY: 1, duration: 0.65 }, 1.35);
        }
        el.querySelectorAll("[data-edu-milestone]").forEach((node, index) => {
          gsap.set(node, { autoAlpha: 0, y: 14 });
          tl.to(
            node,
            { autoAlpha: 1, y: 0, duration: 0.35 },
            1.4 + index * 0.16,
          );
        });
        const eduSeal = el.querySelector("[data-edu-seal]");
        if (eduSeal) {
          gsap.set(eduSeal, { autoAlpha: 0, scale: 0.85 });
          tl.to(eduSeal, { autoAlpha: 1, scale: 1, duration: 0.35 }, 1.85);
        }

        const mapPulse = el.querySelector("[data-obour-pulse]");
        if (mapPulse) {
          gsap.set(mapPulse, { scale: 0.35, autoAlpha: 0 });
          tl.to(
            mapPulse,
            { scale: 1.4, autoAlpha: 0.9, duration: 0.45 },
            1.85,
          ).to(mapPulse, { autoAlpha: 0.3, scale: 1, duration: 0.35 }, 2.25);
        }
        const vendingLight = el.querySelector("[data-vending-light]");
        if (vendingLight) {
          tl.fromTo(
            vendingLight,
            { autoAlpha: 0.2 },
            { autoAlpha: 1, duration: 0.28, yoyo: true, repeat: 2 },
            1.95,
          );
        }
        const nabdWave = el.querySelector("[data-nabd-wave]");
        if (nabdWave) {
          gsap.set(nabdWave, { strokeDasharray: 48, strokeDashoffset: 48 });
          tl.to(nabdWave, { strokeDashoffset: 0, duration: 0.55 }, 2.0);
        }
        const nabdDelivered = el.querySelector("[data-nabd-delivered]");
        if (nabdDelivered) {
          gsap.set(nabdDelivered, { autoAlpha: 0, scale: 0.55 });
          tl.to(
            nabdDelivered,
            { autoAlpha: 1, scale: 1, duration: 0.3 },
            2.35,
          );
        }

        tl.timeScale(timeScale);
        writeDebug({ timelineCreated: true });
        return tl;
      };

      // Drop stale transforms from the previous composition before rebuilding.
      clearLayoutTransforms([
        upwork,
        upworkShell,
        commerce as Element | null,
        education as Element | null,
        products as Element | null,
        ...Array.from(productNodes),
      ]);

      let tl = buildTimeline();

      const playIntro = () => {
        if (cancelled) return;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (cancelled) return;
            tl.play(0);
          });
        });
      };

      replayRef.current = () => {
        if (cancelled || skipMotion) return;
        ambientTweens.forEach((t) => t.kill());
        ambientTweens.length = 0;
        tl.kill();
        tl = buildTimeline();
        playIntro();
      };

      playIntro();

      const onVisibility = () => {
        if (cancelled) return;
        writeDebug({
          documentVisibility: document.visibilityState,
        });
        if (document.hidden) {
          tl.pause();
          ambientTweens.forEach((t) => t.pause());
        } else {
          if (el.dataset.motion !== "ready") tl.resume();
          ambientTweens.forEach((t) => t.resume());
        }
      };
      document.addEventListener("visibilitychange", onVisibility);

      let removePointer: (() => void) | undefined;
      if (composition === "cinematic" && !isCoarse) {
        const near = el.querySelectorAll("[data-depth='near']");
        const mid = el.querySelectorAll("[data-depth='mid']");
        const far = el.querySelectorAll("[data-depth='far']");
        const qxNear = gsap.quickTo(near, "x", {
          duration: 0.5,
          ease: "power3.out",
        });
        const qyNear = gsap.quickTo(near, "y", {
          duration: 0.5,
          ease: "power3.out",
        });
        const qxMid = gsap.quickTo(mid, "x", {
          duration: 0.55,
          ease: "power3.out",
        });
        const qyMid = gsap.quickTo(mid, "y", {
          duration: 0.55,
          ease: "power3.out",
        });
        const qxFar = far.length
          ? gsap.quickTo(far, "x", {
              duration: 0.65,
              ease: "power3.out",
            })
          : () => undefined;
        const qyFar = far.length
          ? gsap.quickTo(far, "y", {
              duration: 0.65,
              ease: "power3.out",
            })
          : () => undefined;
        // Tilt the INNER surface only — never the outer layout shell — so the
        // grid box stays stable, edges stay complete, and neighbours stay
        // aligned during pointer parallax.
        const tiltTarget = upworkShell ?? null;
        const qRotY = tiltTarget
          ? gsap.quickTo(tiltTarget, "rotateY", {
              duration: 0.45,
              ease: "power3.out",
            })
          : null;
        const qRotX = tiltTarget
          ? gsap.quickTo(tiltTarget, "rotateX", {
              duration: 0.45,
              ease: "power3.out",
            })
          : null;

        if (tiltTarget) {
          gsap.set(tiltTarget, { transformPerspective: 900 });
        }

        const onMove = (event: PointerEvent) => {
          if (cancelled) return;
          if (tl.progress() < 0.95 && el.dataset.motion !== "ready") return;
          const nx = (event.clientX / window.innerWidth - 0.5) * 2;
          const ny = (event.clientY / window.innerHeight - 0.5) * 2;
          qxFar(nx * 3);
          qyFar(ny * 2);
          qxMid(nx * 5);
          qyMid(ny * 3.5);
          qxNear(nx * 7);
          qyNear(ny * 5);
          qRotY?.(nx * 1.25);
          qRotX?.(-ny * 1.0);
        };
        const onLeave = () => {
          if (cancelled) return;
          qxFar(0);
          qyFar(0);
          qxMid(0);
          qyMid(0);
          qxNear(0);
          qyNear(0);
          qRotY?.(0);
          qRotX?.(0);
        };
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerleave", onLeave);
        removePointer = () => {
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerleave", onLeave);
        };
      }

      return () => {
        cancelled = true;
        replayRef.current = null;
        document.removeEventListener("visibilitychange", onVisibility);
        removePointer?.();
        ambientTweens.forEach((t) => t.kill());
        ambientTweens.length = 0;
        if (progress) gsap.killTweensOf(progress);
        if (upwork) gsap.killTweensOf(upwork);
        if (upworkShell) gsap.killTweensOf(upworkShell);
        tl.kill();
      };
    },
    { scope: root, dependencies: [flags.slow, flags.overrideFull, effective, heroFamily, mode, heroComposition] },
  );

  const showDebug =
    process.env.NODE_ENV === "development" && flags.debug;

  return (
    <div
      ref={root}
      className={styles.motionRoot}
      data-layout-mode={mode}
      data-hero-family={heroFamily}
      data-motion-debug={showDebug ? "1" : "0"}
      suppressHydrationWarning
    >
      {children}
      {showDebug ? (
        <aside
          ref={panelRef}
          className={styles.motionDebug}
          data-motion-panel
        >
          <p>
            storedPreference:{" "}
            <span data-debug="storedPreference">
              {preference ?? "none"}
            </span>
          </p>
          <p>
            systemPreference:{" "}
            <span data-debug="systemPreference">
              {systemReduced ? "reduced" : "full"}
            </span>
          </p>
          <p>
            effectivePreference:{" "}
            <span data-debug="effectivePreference">{effective}</span>
          </p>
          <p>
            motionOverride:{" "}
            <span data-debug="motionOverride">
              {flags.overrideFull || overrideFull ? "full" : "none"}
            </span>
          </p>
          <p>
            timelineCreated: <span data-debug="timelineCreated">false</span>
          </p>
          <p>
            timelineProgress: <span data-debug="timelineProgress">0</span>
          </p>
          <p>
            timelineState: <span data-debug="timelineState">pending</span>
          </p>
          <p>
            currentProduct: <span data-debug="currentProduct">—</span>
          </p>
          <p>
            deckTransitionState:{" "}
            <span data-debug="deckTransitionState">idle</span>
          </p>
          <p>
            breakpoint: <span data-debug="breakpoint">narrative</span>
          </p>
          <p>
            pointerType:{" "}
            <span data-debug="pointerType">{coarse ? "coarse" : "fine"}</span>
          </p>
          <div className={styles.motionDebugActions}>
            <button
              type="button"
              className={styles.motionReplay}
              onClick={() => replayRef.current?.()}
            >
              Replay intro
            </button>
            <button
              type="button"
              className={styles.motionReplay}
              onClick={() =>
                window.dispatchEvent(new Event("portfolio:deck-next"))
              }
            >
              Next product
            </button>
            <button
              type="button"
              className={styles.motionReplay}
              onClick={() =>
                window.dispatchEvent(new Event("portfolio:deck-previous"))
              }
            >
              Previous product
            </button>
            <button
              type="button"
              className={styles.motionReplay}
              onClick={() => setPreference("full")}
            >
              Force full
            </button>
            <button
              type="button"
              className={styles.motionReplay}
              onClick={() => setPreference("reduced")}
            >
              Force reduced
            </button>
            <button
              type="button"
              className={styles.motionReplay}
              onClick={() => clearPreference()}
            >
              Reset motion preference
            </button>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
