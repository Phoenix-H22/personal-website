import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import {
  AdaptiveStackLens,
  getProjectNavigationTarget,
  reduceLensSelection,
} from "@/components/portfolio/hero/adaptive-stack-lens";
import {
  AdaptiveSignalRoute,
  getAdaptiveSignalRoute,
} from "@/components/portfolio/hero/adaptive-signal-route";
import {
  createProjectRotationClock,
  getNextProjectIndex,
  PROJECT_ROTATION_INTERVAL_MS,
  PROJECT_SELECTION_COOLDOWN_MS,
  shouldRotateProjects,
} from "@/components/portfolio/hero/use-project-auto-rotation";
import { MotionPreferenceProvider } from "@/lib/motion-preference-context";
import { ADAPTIVE_HERO_CONTENT } from "@/lib/portfolio/adaptive-hero";
import {
  ADAPTIVE_STACK_LENS_MODES,
  DEFAULT_ADAPTIVE_STACK_LENS_SLUG,
} from "@/lib/portfolio/adaptive-stack-lens";
import {
  LIVING_TOOLCHAIN_PHASES,
  LIVING_TOOLCHAIN_PHRASES,
  LIVING_TOOLCHAIN_TIMING,
} from "@/lib/portfolio/living-toolchain";
import { isCanonicalProjectSlug } from "@/lib/portfolio/projects/canonical-projects";
import {
  ENGINEERING_CASE_STUDY_FOUNDATIONS,
  ENGINEERING_CASE_STUDY_SECTION_ORDER,
  SELECTED_SYSTEM_CASE_STUDY_SLUGS,
} from "@/lib/portfolio/engineering-case-study-foundations";

vi.mock("server-only", () => ({}));

let selectors: typeof import("@/lib/portfolio/projects/selectors");

beforeAll(async () => {
  selectors = await import("@/lib/portfolio/projects/selectors");
});

afterEach(() => {
  vi.useRealTimers();
});

const root = process.cwd();
const readSource = (file: string) => fs.readFileSync(path.join(root, file), "utf8");
const gitBlobSha1 = (file: string) => {
  const content = fs.readFileSync(path.join(root, file));
  return createHash("sha1")
    .update(`blob ${content.length}\0`)
    .update(content)
    .digest("hex");
};

describe("Phase E.3 living Adaptive Stack hero", () => {
  it("uses Software Engineer as the primary identity without a visible seniority claim", () => {
    const visibleCopy = JSON.stringify(ADAPTIVE_HERO_CONTENT);
    expect(visibleCopy).not.toMatch(/\b(senior|expert|rockstar|ninja|10x engineer)\b/i);
    expect(ADAPTIVE_HERO_CONTENT.identity).toBe("SOFTWARE ENGINEER");
    expect(ADAPTIVE_HERO_CONTENT.eyebrow).toBe(
      "BUILDING PRODUCTION SOFTWARE SINCE 2021",
    );
    expect(ADAPTIVE_HERO_CONTENT.statement.join(" ")).toBe(
      "I learn the system, choose what fits, and ship what survives production.",
    );
    expect(ADAPTIVE_HERO_CONTENT.summary).toBe(
      "I build production software across SaaS, commerce, payments, integrations, and connected systems.",
    );
    expect(ADAPTIVE_HERO_CONTENT.fundamentals).toBe(
      "Built before AI became a daily development tool. Now I use research, automation, and AI to move faster — without outsourcing the thinking.",
    );
  });

  it("defines the exact approved Living Toolchain phrases and restrained timing", () => {
    expect(LIVING_TOOLCHAIN_PHRASES).toEqual([
      "Laravel + PHP",
      "Node.js + TypeScript",
      "Python + Automation",
      "Flutter + Dart",
      "React + Next.js",
      "Vue + Inertia",
      "Redis + Queues",
      "PostgreSQL + MySQL",
      "APIs + Webhooks",
      "Linux + Nginx",
      "MQTT + Edge Devices",
      "Shopify + WordPress",
      "Payments + Integrations",
      "OCR + Document Pipelines",
    ]);
    expect(LIVING_TOOLCHAIN_PHRASES[0]).toBe("Laravel + PHP");
    expect(LIVING_TOOLCHAIN_PHRASES).toContain("Python + Automation");
    expect(LIVING_TOOLCHAIN_PHRASES).toContain("MQTT + Edge Devices");
    expect(LIVING_TOOLCHAIN_PHRASES).toContain("OCR + Document Pipelines");
    expect(LIVING_TOOLCHAIN_PHRASES).not.toContain("AI Tools + Research");
    expect(LIVING_TOOLCHAIN_PHRASES.join(" ")).not.toMatch(
      /Kubernetes|AWS Cloud|Microservices|Machine Learning|RAG|LangChain|AI Agents|Blockchain|Web3|\bGo\b|\bRust\b|\bJava\b|\.NET/,
    );
    expect(LIVING_TOOLCHAIN_PHRASES.every((phrase) => !phrase.includes("/"))).toBe(true);
    expect(LIVING_TOOLCHAIN_PHASES).toEqual(["HOLD", "ERASE", "SWITCH", "TYPE"]);
    expect(LIVING_TOOLCHAIN_TIMING.type).toBeGreaterThanOrEqual(35);
    expect(LIVING_TOOLCHAIN_TIMING.type).toBeLessThanOrEqual(55);
    expect(LIVING_TOOLCHAIN_TIMING.erase).toBeGreaterThanOrEqual(20);
    expect(LIVING_TOOLCHAIN_TIMING.erase).toBeLessThanOrEqual(35);
    expect(LIVING_TOOLCHAIN_TIMING.hold).toBeGreaterThanOrEqual(1300);
    expect(LIVING_TOOLCHAIN_TIMING.hold).toBeLessThanOrEqual(1900);
    expect(LIVING_TOOLCHAIN_TIMING.switch).toBeGreaterThanOrEqual(100);
    expect(LIVING_TOOLCHAIN_TIMING.switch).toBeLessThanOrEqual(180);
  });

  it("renders one server-first accessible Living Toolchain without noisy announcements", () => {
    const hero = readSource(
      "src/components/portfolio/hero/adaptive-engineer-hero.tsx",
    );
    const toolchain = readSource(
      "src/components/portfolio/hero/living-toolchain.tsx",
    );
    expect(hero.match(/<LivingToolchain\s*\/>/g)).toHaveLength(1);
    expect(toolchain.match(/data-living-toolchain/g)).toHaveLength(1);
    expect(toolchain).toContain("LIVING_TOOLCHAIN_PHRASES[0].length");
    expect(toolchain).toContain("? LIVING_TOOLCHAIN_PHRASES[0]");
    expect(toolchain).toContain('aria-hidden="true"');
    expect(toolchain).toContain("toolchainAccessible");
    expect(toolchain).not.toContain("aria-live");
    expect(toolchain).not.toMatch(/requestIdleCallback|setInterval/);
    expect(toolchain).toContain("window.requestAnimationFrame");
    expect(toolchain).toContain("window.cancelAnimationFrame");
    expect(toolchain).toContain('document.visibilityState === "hidden"');
    expect(toolchain).toContain('window.addEventListener("pageshow"');
    expect(toolchain).toContain('window.removeEventListener("pageshow"');
    expect(toolchain).toContain("window.clearTimeout");
    expect(toolchain).toContain("LIVING_TOOLCHAIN_PAUSE_EVENT");
    expect(toolchain).toContain("pauseUntilRef.current");
    expect(toolchain).toContain("generationRef.current");
    expect(toolchain).toContain("timerRef.current");
    expect(toolchain).not.toMatch(/addEventListener\(["'](?:blur|focus)["']/);
    expect(toolchain).not.toMatch(/hasFocus|watchdogFailed|heroMotionFallback/);
    expect(toolchain).not.toMatch(
      /motion-debug|portfolioLivingToolchainDebug|toolchainDebug|Full Motion|Default Full/,
    );
    expect(toolchain.match(/useToolchainScheduler\(running,/g)).toHaveLength(1);
  });

  it("defines exactly four presentation-only contexts and a valid default", () => {
    expect(ADAPTIVE_STACK_LENS_MODES.map(({ label, slug }) => ({ label, slug }))).toEqual([
      { label: "WARQAH STORE", slug: "warqah-store" },
      { label: "SMART LOCKERS", slug: "smart-lockers-platform" },
      { label: "YOUR OBOUR GUIDE", slug: "your-obour-guide" },
      { label: "NABD", slug: "nabd" },
    ]);
    expect(ADAPTIVE_STACK_LENS_MODES).toHaveLength(4);
    expect(
      ADAPTIVE_STACK_LENS_MODES.every(({ slug }) => isCanonicalProjectSlug(slug)),
    ).toBe(true);
    expect(
      ADAPTIVE_STACK_LENS_MODES.some(
        ({ slug }) => slug === DEFAULT_ADAPTIVE_STACK_LENS_SLUG,
      ),
    ).toBe(true);

    const allowedConfigurationKeys = [
      "accent",
      "caseStudyHref",
      "category",
      "description",
      "id",
      "index",
      "label",
      "metadata",
      "slug",
      "title",
    ];
    for (const mode of ADAPTIVE_STACK_LENS_MODES) {
      expect(Object.keys(mode).sort()).toEqual(allowedConfigurationKeys);
    }
  });

  it("derives public-safe editorial lens DTOs for canonical projects", async () => {
    const modes = await selectors.getAdaptiveStackLensProjects();
    expect(modes).toHaveLength(4);

    for (const mode of modes) {
      const project = await selectors.getProjectBySlug(mode.slug);
      expect(project).not.toBeNull();
      expect(mode.title.length).toBeGreaterThan(0);
      expect(mode.description.length).toBeGreaterThan(0);
      expect(mode.description.length).toBeLessThanOrEqual(120);
      expect(mode.metadata).toHaveLength(2);
      expect(mode.metadata.every(({ label, value }) => label && value)).toBe(true);
      expect(mode.technologies.length).toBeGreaterThan(0);
      expect(mode.technologies.length).toBeLessThanOrEqual(4);
      expect(mode.technologies.every(Boolean)).toBe(true);
      expect(mode.caseStudyHref).toBe(`/projects/${mode.slug}`);
    }
  });

  it("renders one primary narrative, one proof line, and the approved CTA hierarchy", () => {
    const hero = readSource(
      "src/components/portfolio/hero/adaptive-engineer-hero.tsx",
    );
    expect(hero).not.toMatch(/^\s*["']use client["']/m);
    expect(hero.match(/className={styles\.narrative}/g)).toHaveLength(1);
    expect(hero.match(/data-proof-ribbon/g)).toHaveLength(1);
    expect(hero).toContain("100% JOB SUCCESS");
    expect(hero).not.toMatch(/\bJSS\b/);
    expect(hero).toMatch(/href="#work"[^>]*>[\s\S]*?EXPLORE THE SYSTEMS/);
    expect(hero.match(/<RecruiterBriefSection\s*\/>/g)).toHaveLength(1);
    expect(hero).not.toContain("RecruiterBriefDialog");
    expect(hero).toContain("href={RECRUITER_PROFILE.resume}");
    expect(hero).toContain("Resume <span");
  });

  it("renders one server-backed Adaptive Stack Lens without the old timeline", () => {
    const hero = readSource(
      "src/components/portfolio/hero/adaptive-engineer-hero.tsx",
    );
    const lens = readSource(
      "src/components/portfolio/hero/adaptive-stack-lens.tsx",
    );
    const route = readSource(
      "src/components/portfolio/hero/adaptive-signal-route.tsx",
    );
    const stylesheet = readSource(
      "src/styles/portfolio/adaptive-engineer-hero.module.scss",
    );
    const v2Page = readSource("src/components/portfolio/portfolio-v2-page.tsx");
    const v2Route = readSource("src/app/v2/page.tsx");
    expect(hero.match(/data-adaptive-engineer-hero/g)).toHaveLength(1);
    expect(hero).not.toMatch(/HOW I WORK|PRIMARY STACK/);
    expect(hero).not.toMatch(/upworkArtifact|productionArtifact|supportingProof/);
    expect(`${hero}\n${lens}\n${route}\n${stylesheet}`).not.toMatch(
      /Operating Range|data-operating-range|data-operating-node|\.operatingRange/,
    );
    expect(hero.match(/<AdaptiveStackLens/g)).toHaveLength(1);
    expect(lens.match(/data-adaptive-stack-lens(?:\s|>)/g)).toHaveLength(1);
    expect(lens.match(/data-adaptive-system-core/g)).toHaveLength(1);
    expect(lens).toContain("FOUR REAL PRODUCTS.");
    expect(lens).not.toContain("ARCHITECTURE FOLLOWS THE CONSTRAINT");
    expect(lens).not.toMatch(/adaptive-stack-lens-thesis|lensThesis/);
    expect(lens).not.toMatch(/SELECTED TOOLCHAIN|PRODUCTION SIGNAL/);
    expect(stylesheet).not.toMatch(/\.narrative\s*{[^}]*opacity/);
    expect(`${hero}\n${lens}\n${v2Page}`).not.toMatch(
      /<video|<canvas|WebGL|Three\.js|three\/|@notion|notion_notion/i,
    );
    expect(lens).not.toMatch(/projects\/data|public-projects\.snapshot/);
    expect(v2Route).toContain(
      'import { PortfolioV2Page as PortfolioV2Experience } from "@/components/portfolio/portfolio-v2-page"',
    );
    expect(v2Route).toContain("return <PortfolioV2Experience />");
    expect(v2Page).toContain("<AdaptiveEngineerHero />");
    expect(v2Page).not.toContain("PortfolioVersionSwitch");

    const motionSources = `${hero}\n${lens}\n${readSource(
      "src/components/portfolio/hero/living-toolchain.tsx",
    )}`;
    expect(motionSources).not.toMatch(
      /navigator\.(?:userAgent|vendor|brands)|\b(?:Chrome|Chromium|Brave|Edge)\b|Edg\//,
    );
    expect(lens.match(/<svg\s/g)).toHaveLength(1);
    expect(route.match(/<svg\s/g)).toHaveLength(1);
    expect(lens.match(/<ol\s/g)).toHaveLength(1);
    expect(lens.match(/<article\s/g)).toHaveLength(1);
    expect(lens).toContain('aria-hidden="true"');
    expect(lens).toContain('focusable="false"');

    const packageJson = readSource("package.json");
    expect(packageJson).not.toMatch(/typewriter|typed\.js|textplugin/i);
  });

  it("renders four project controls and one card", async () => {
    const modes = await selectors.getAdaptiveStackLensProjects();
    const markup = renderToStaticMarkup(
      createElement(
        MotionPreferenceProvider,
        null,
        createElement(AdaptiveStackLens, {
          modes,
          defaultSlug: DEFAULT_ADAPTIVE_STACK_LENS_SLUG,
        }),
      ),
    );
    const routeMarkup = renderToStaticMarkup(
      createElement(AdaptiveSignalRoute, {
        activeIndex: 1,
        projectCount: 4,
        revision: 0,
      }),
    );
    const routePaths = routeMarkup.match(/<path\b[^>]*>/g) ?? [];
    const routeGeometry = routePaths.map(
      (pathTag) => pathTag.match(/\sd="([^"]+)"/)?.[1],
    );

    expect(markup.match(/<ol\b/g)).toHaveLength(1);
    expect(markup.match(/<button\b/g)).toHaveLength(4);
    expect(markup.match(/data-lens-context=/g)).toHaveLength(4);
    expect(markup).toContain('data-auto-rotation="paused"');
    expect(markup).not.toContain("data-rotation-progress");
    expect(markup.match(/data-signal-route="true"/g)).toHaveLength(1);
    expect(markup).toContain('data-route-from="1"');
    expect(markup).toContain('data-route-to="2"');
    expect(markup).toContain('data-route-direction="forward"');
    expect(markup).toContain('data-route-wrap="false"');
    expect(markup.match(/data-signal-route-track="true"/g)).toHaveLength(2);
    expect(markup.match(/data-signal-route-beam="true"/g)).toHaveLength(2);
    expect(markup).not.toMatch(/data-signal-route-(?:fill|head|transfer)=/);
    expect(markup.match(/data-signal-route-segment="true"/g)).toHaveLength(1);
    expect(markup.match(/data-signal-route-target="true"/g)).toHaveLength(1);
    expect(markup).toMatch(/data-signal-route-target="true"[^>]*>03<\/span>/);
    expect(markup).toContain("--signal-route-duration:6000ms");
    expect(markup.match(/data-card-signal-scan="true"/g)).toHaveLength(1);
    expect(markup.match(/<article\b/g)).toHaveLength(1);
    expect(markup.match(/data-project-beam="true"/g)).toHaveLength(4);
    expect(markup.match(/data-project-marker="true"/g)).toHaveLength(4);
    expect(markup.match(/aria-label="Select project/g)).toHaveLength(4);
    expect(markup.match(/data-orbit-side=/g)).toHaveLength(4);
    expect(markup).toContain('data-active-index="1"');
    expect(markup.match(/data-active-project-signal="true"/g)).toHaveLength(1);
    expect(markup.match(/data-project-technology-signal="true"/g)).toHaveLength(1);
    expect(markup.match(/data-active="true"/g)).toHaveLength(1);
    expect(markup.match(/data-orbit-frame-segment="true"/g)).toHaveLength(4);
    expect(markup.match(/data-orbit-frame-segments="true"/g)).toHaveLength(1);
    expect(markup).toContain('data-orbit-node-slot-size="56"');
    expect(markup).toContain('data-orbit-side-slot-size="168"');
    expect(markup.match(/data-frame-side=/g)).toHaveLength(2);
    expect(routePaths).toHaveLength(2);
    expect(routeGeometry.every(Boolean)).toBe(true);
    expect(new Set(routeGeometry).size).toBe(1);
    expect(markup.match(/aria-controls="adaptive-stack-lens-readout"/g)).toHaveLength(
      5,
    );
    expect(markup.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(markup.match(/aria-pressed="false"/g)).toHaveLength(4);
    expect(markup.indexOf("</ol>")).toBeLessThan(markup.indexOf("<article"));
    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('aria-atomic="true"');
    expect(markup).toContain("01");
    expect(markup).toContain("WARQAH STORE");
    expect(markup).toContain("02");
    expect(markup).toContain("SMART LOCKERS");
    expect(markup).toContain("03");
    expect(markup).toContain("YOUR OBOUR GUIDE");
    expect(markup).toContain("04");
    expect(markup).toContain("NABD");
  });

  it("keeps click selection and preview state deterministic", () => {
    const initial = {
      pinnedIndex: 1,
      previewIndex: null,
      hasInteracted: false,
      revision: 0,
    };
    const previewed = reduceLensSelection(initial, { type: "preview", index: 3 });
    expect(previewed).toEqual({
      pinnedIndex: 1,
      previewIndex: 3,
      hasInteracted: true,
      revision: 0,
    });

    const selected = reduceLensSelection(previewed, { type: "select", index: 2 });
    expect(selected).toEqual({
      pinnedIndex: 2,
      previewIndex: 2,
      hasInteracted: true,
      revision: 1,
    });

    expect(reduceLensSelection(selected, { type: "preview", index: null })).toEqual({
      pinnedIndex: 2,
      previewIndex: null,
      hasInteracted: true,
      revision: 1,
    });
  });

  it("supports complete wrapping keyboard project navigation", () => {
    expect(getProjectNavigationTarget("ArrowRight", 3, 4)).toBe(0);
    expect(getProjectNavigationTarget("ArrowDown", 1, 4)).toBe(2);
    expect(getProjectNavigationTarget("ArrowLeft", 0, 4)).toBe(3);
    expect(getProjectNavigationTarget("ArrowUp", 2, 4)).toBe(1);
    expect(getProjectNavigationTarget("Home", 3, 4)).toBe(0);
    expect(getProjectNavigationTarget("End", 0, 4)).toBe(3);
    expect(getProjectNavigationTarget("Enter", 0, 4)).toBeNull();
  });

  it.each([
    { current: 0, expected: 1, scenario: "advances to the next project" },
    { current: 3, expected: 0, scenario: "wraps project 04 to project 01" },
  ])("$scenario", ({ current, expected }) => {
    expect(getNextProjectIndex(current, 4)).toBe(expected);
  });

  it("derives forward and return Signal Transfer routes from the active project", () => {
    expect(getAdaptiveSignalRoute(0, 4)).toEqual({
      direction: "forward",
      fromIndex: 0,
      nextIndex: 1,
      wraps: false,
    });
    expect(getAdaptiveSignalRoute(3, 4)).toEqual({
      direction: "return",
      fromIndex: 3,
      nextIndex: 0,
      wraps: true,
    });
  });

  it("rejects a Signal Transfer route outside the project range", () => {
    expect(() => getAdaptiveSignalRoute(4, 4)).toThrow(
      "Invalid Adaptive Signal Route index: 4",
    );
  });

  it.each([
    ["interaction or cooldown", { isInteractionPaused: true }],
    ["hidden document", { isDocumentVisible: false }],
    ["offscreen navigator", { isInViewport: false }],
    ["reduced motion", { reducedMotion: true }],
    ["explicit pause", { isUserPaused: true }],
    ["fewer than two projects", { projectCount: 1 }],
  ])("pauses automatic rotation during %s", (_scenario, override) => {
    expect(
      shouldRotateProjects({
        projectCount: 4,
        reducedMotion: false,
        isInViewport: true,
        isDocumentVisible: true,
        isInteractionPaused: false,
        isUserPaused: false,
        ...override,
      }),
    ).toBe(false);
  });

  it("runs automatic rotation when every eligibility condition passes", () => {
    expect(
      shouldRotateProjects({
        projectCount: 4,
        reducedMotion: false,
        isInViewport: true,
        isDocumentVisible: true,
        isInteractionPaused: false,
        isUserPaused: false,
      }),
    ).toBe(true);
  });

  it("runs one rotation timer and preserves remaining time across pauses", () => {
    vi.useFakeTimers();
    const onElapsed = vi.fn();
    const clock = createProjectRotationClock(onElapsed);
    const elapsedBeforePauseMs = 2_000;
    const remainingAfterPauseMs =
      PROJECT_ROTATION_INTERVAL_MS - elapsedBeforePauseMs;

    clock.resume();
    expect(vi.getTimerCount()).toBe(1);
    vi.advanceTimersByTime(elapsedBeforePauseMs);
    clock.pause();
    expect(vi.getTimerCount()).toBe(0);

    vi.advanceTimersByTime(PROJECT_ROTATION_INTERVAL_MS);
    expect(onElapsed).not.toHaveBeenCalled();
    clock.resume();
    vi.advanceTimersByTime(remainingAfterPauseMs - 1);
    expect(onElapsed).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onElapsed).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(1);

    clock.dispose();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("uses an eleven-second manual-selection cooldown", () => {
    expect(PROJECT_SELECTION_COOLDOWN_MS).toBe(11_000);
  });

  it("uses CSS-only responsive layout and no projected marker architecture", () => {
    const lens = readSource(
      "src/components/portfolio/hero/adaptive-stack-lens.tsx",
    );
    const stylesheet = readSource(
      "src/styles/portfolio/adaptive-engineer-hero.module.scss",
    );
    const autoRotation = readSource(
      "src/components/portfolio/hero/use-project-auto-rotation.ts",
    );
    const signalRoute = readSource(
      "src/components/portfolio/hero/adaptive-signal-route.tsx",
    );
    expect(lens).toContain('aria-label="Production systems"');
    expect(lens).toContain('aria-controls="adaptive-stack-lens-readout"');
    expect(lens.match(/data-lens-context=/g)).toHaveLength(1);
    expect(lens).toContain("aria-pressed={pinned}");
    expect(lens).toContain("onMouseEnter={() => previewMode(index)}");
    expect(lens).toContain("onFocus={() => previewMode(index)}");
    expect(lens).toContain("onClick={() => selectMode(index)}");
    expect(lens).toContain("pauseAfterManualSelection()");
    expect(autoRotation).toContain("new IntersectionObserver");
    expect(autoRotation).toContain('document.addEventListener("visibilitychange"');
    expect(autoRotation).toContain("clock.dispose()");
    expect(autoRotation).not.toContain("setInterval");
    expect(`${lens}\n${signalRoute}`).not.toMatch(
      /matchMedia|ResizeObserver|getScreenCTM|DOMPoint|requestAnimationFrame|data-markers-ready/,
    );
    expect(autoRotation).not.toMatch(
      /ResizeObserver|getBoundingClientRect|DOMPoint|requestAnimationFrame/,
    );
    expect(stylesheet).not.toMatch(
      /--marker-(?:top|left)|data-markers-ready|data-label-direction|lensGeometryStage|contextOrbitNode/,
    );
    expect(stylesheet).toContain("@media (min-width: 100rem)");
    expect(stylesheet).toContain(
      "@media (min-width: 73.75rem) and (max-width: 99.9375rem)",
    );
    expect(stylesheet).toContain(
      "@media (min-width: 48rem) and (max-width: 73.6875rem)",
    );
    expect(stylesheet).toContain("@media (max-width: 47.99rem)");
    expect(stylesheet).not.toContain("--project-card-block-size");
    expect(stylesheet).toMatch(
      /@media \(min-width: 48rem\) and \(max-width: 73\.6875rem\)[\s\S]*?\.narrative\s*{[\s\S]*?max-width:\s*none;[\s\S]*?\.stackLens\s*{[\s\S]*?max-width:\s*none;/,
    );
    expect(stylesheet).toMatch(
      /@media \(max-width: 47\.99rem\)[\s\S]*?\.projectCard\s*{[\s\S]*?min-block-size:\s*0;[\s\S]*?block-size:\s*auto;/,
    );
    expect(stylesheet).toContain("grid-template-columns: subgrid");
    expect(stylesheet).toContain("grid-template-rows: subgrid");
    expect(stylesheet).toMatch(
      /\.projectControl\s*{[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none;/,
    );
    expect(stylesheet).not.toMatch(/\.projectControlActive\s*{/);
    expect(stylesheet).toContain(".projectBeam {");
    expect(stylesheet).toContain('.projectControl[data-active="true"] .projectBeam');
    expect(stylesheet).toContain(".signalRouteOrbitTrack,");
    expect(stylesheet).toContain(".signalRouteOrbitBeam {");
    expect(stylesheet).toContain("@keyframes lens-route-beam-travel");
    expect(stylesheet).toContain("@keyframes lens-linear-route-beam");
    expect(stylesheet).toContain("@keyframes lens-project-beam-handoff");
    expect(stylesheet).toMatch(
      /\.signalRouteOrbitBeam\s*{[\s\S]*?stroke-dasharray:\s*0\.14 1;[\s\S]*?stroke-dashoffset:\s*0\.14;/,
    );
    expect(stylesheet).toMatch(
      /@keyframes lens-route-beam-travel[\s\S]*?90%,[\s\S]*?opacity:\s*0;[\s\S]*?stroke-dashoffset:\s*-0\.86;/,
    );
    expect(stylesheet).toMatch(
      /@keyframes lens-linear-route-beam[\s\S]*?90%,[\s\S]*?opacity:\s*0;[\s\S]*?transform:\s*var\(--signal-route-beam-end-transform\);/,
    );
    expect(stylesheet).toMatch(
      /\.signalRouteBeam\s*{[\s\S]*?animation:\s*lens-linear-route-beam var\(--signal-route-duration\) linear paused;/,
    );
    expect(stylesheet).toMatch(
      /\.signalRouteSegment\s*{[\s\S]*?overflow:\s*hidden;/,
    );
    expect(stylesheet).toMatch(
      /@keyframes lens-signal-target[\s\S]*?90%\s*{[\s\S]*?opacity:\s*0;[\s\S]*?92\.5%\s*{[\s\S]*?opacity:\s*1;[\s\S]*?95%,[\s\S]*?opacity:\s*0;/,
    );
    expect(stylesheet).toMatch(
      /@keyframes lens-project-beam-handoff[\s\S]*?100%\s*{[\s\S]*?opacity:\s*0;/,
    );
    expect(stylesheet).toContain('.signalRoute[data-route-wrap="true"]');
    expect(stylesheet).toMatch(
      /@media \(min-width: 48rem\) and \(max-width: 73\.6875rem\)[\s\S]*?grid-template-columns:\s*max-content\s*var\(--tablet-label-node-gap\)\s*var\(--signal-node-size\)\s*var\(--navigator-gap\)\s*minmax\(0, 1fr\);/,
    );
    expect(stylesheet).not.toContain(".rotationProgress");
    expect(stylesheet).not.toMatch(
      /signalRoute(?:Fill|Head|Base|SegmentTrack|TrackPath)|lens-(?:signal-fill|signal-head|linear-signal-fill|vertical-signal-head|horizontal-signal-head|node-activate)/,
    );
    expect(stylesheet).toContain("--project-card-transition-duration: 400ms");
    expect(stylesheet).toMatch(
      /\.projectCard\s*{[\s\S]*?block-size:\s*auto;[\s\S]*?min-block-size:\s*0;/,
    );
    expect(stylesheet).toMatch(
      /@media \(min-width: 48rem\) and \(max-width: 73\.6875rem\)[\s\S]*?\.projectCard\s*{[\s\S]*?block-size:\s*auto;[\s\S]*?min-block-size:\s*0;[\s\S]*?align-self:\s*start;/,
    );
    expect(stylesheet).not.toContain("lens-linear-signal-transfer");
    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
    expect(stylesheet).toContain('html[data-effective-motion="reduced"]');
  });

  it("defines the ten-part engineering case-study foundation for all selected systems", () => {
    expect(ENGINEERING_CASE_STUDY_SECTION_ORDER).toHaveLength(10);
    expect(Object.keys(ENGINEERING_CASE_STUDY_FOUNDATIONS).sort()).toEqual(
      [...SELECTED_SYSTEM_CASE_STUDY_SLUGS].sort(),
    );
    for (const slug of SELECTED_SYSTEM_CASE_STUDY_SLUGS) {
      const foundation = ENGINEERING_CASE_STUDY_FOUNDATIONS[slug];
      expect(foundation.slug).toBe(slug);
      expect(foundation.criticalDecisions.length).toBeGreaterThan(0);
      expect(
        foundation.criticalDecisions.every(
          (decision) =>
            decision.decision &&
            decision.whyNecessary &&
            decision.alternativeConsidered &&
            decision.tradeOffAccepted,
        ),
      ).toBe(true);
    }
  });

  it("implements the accessible portfolio Control Deck navigation model", () => {
    const root = readSource(
      "src/components/portfolio/navigation/portfolio-navigation.tsx",
    );
    const deck = readSource(
      "src/components/portfolio/navigation/portfolio-control-deck.tsx",
    );
    const data = readSource(
      "src/components/portfolio/navigation/navigation-data.ts",
    );

    // Semantic banner + runtime marker used by the QA/preflight harness.
    expect(root).toContain("<header");
    expect(root).toContain("data-portfolio-navigation");

    // Primary navigation is a real <nav> of real anchors exposing active state.
    expect(deck).toContain("<nav");
    expect(deck).toContain('aria-label="Primary"');
    expect(deck).toContain(
      'aria-current={activeId === link.id ? "location" : undefined}',
    );
    expect(deck).toContain("href={link.href}");

    // Contact scrolls to the contact section (the last section), wired through
    // the shared navigate handler like the other section links.
    expect(deck).toContain('sectionById("contact").href');
    expect(deck).toContain('onNavigate?.("contact")');
    expect(data).toContain("mailto:");
    expect(data).toContain("RECRUITER_PROFILE.email");

    // Verified section anchors preserved — no invented or broken anchors.
    expect(data).toContain('href: "#experience"');
    expect(data).toContain('href: "#work"');
    expect(data).toContain('href: "#contact"');
    expect(data).toContain('href: "#main-content"');
  });

  it("preserves root, protected sections, canonical data, and approved media", () => {
    expect({
      root: gitBlobSha1("src/app/page.tsx"),
      origin: gitBlobSha1("src/components/concept-v3-rebuild/origin/origin-chapter.tsx"),
      career: gitBlobSha1("src/components/concept-v3-rebuild/career/career-chapter.tsx"),
      observatorySection: gitBlobSha1(
        "src/components/portfolio/systems-observatory/systems-observatory-section.tsx",
      ),
      observatoryConfig: gitBlobSha1(
        "src/components/portfolio/systems-observatory/systems-observatory.config.ts",
      ),
      completion: gitBlobSha1(
        "src/components/portfolio/recruiter/recruiter-completion-sections.tsx",
      ),
      work: gitBlobSha1("src/app/projects/[[...slug]]/page.tsx"),
      caseStudy: gitBlobSha1(
        "src/components/portfolio/case-study/case-study-page.tsx",
      ),
      canonical: gitBlobSha1(
        "src/lib/portfolio/projects/data/public-projects.snapshot.json",
      ),
      media: gitBlobSha1(
        "src/lib/portfolio/projects/data/public-media-manifest.json",
      ),
    }).toEqual({
      root: "c2728ee5471fde76ec591f5fcdedffd447f21bf6",
      origin: "62d72f5f489e0aecef05d603e5c09e5fe7f8c9ff",
      career: "655a864979b633df4359d090a00e22aaa73c6caa",
      observatorySection: "91f2253bdf4ca8361a07aeb5edc9c58a7a863933",
      observatoryConfig: "f4c8399e40949442289ecc72bd5977e1da7e5aa2",
      completion: "89cdece16e8aa3fa879fb247c09cedbdd6c52e65",
      work: "dec26a82e1a59ee36fb66642bc0b2fabce995aa3",
      caseStudy: "f6a3014081ed93ccf527f83a43d164e953515f49",
      canonical: "dd0e4f756c68ca3b4fdd37105b85965d5105bc72",
      media: "3b64be01228ceb8690e255023945c8bcf2878290",
    });
  });
});
