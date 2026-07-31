import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it, vi } from "vitest";

import {
  AdaptiveStackLens,
  getProjectNavigationTarget,
  reduceLensSelection,
} from "@/components/portfolio/hero/adaptive-stack-lens";
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
      "Software engineer with a backend focus, working across web, mobile, commerce, integrations, connected devices, and infrastructure.",
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
      expect(mode.caseStudyHref).toMatch(/^\/v2\/work/);
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
    const stylesheet = readSource(
      "src/styles/portfolio/adaptive-engineer-hero.module.scss",
    );
    const v2Page = readSource("src/components/portfolio/portfolio-v2-page.tsx");
    const v2Route = readSource("src/app/v2/page.tsx");
    expect(hero.match(/data-adaptive-engineer-hero/g)).toHaveLength(1);
    expect(hero).not.toMatch(/HOW I WORK|PRIMARY STACK/);
    expect(hero).not.toMatch(/upworkArtifact|productionArtifact|supportingProof/);
    expect(`${hero}\n${lens}\n${stylesheet}`).not.toMatch(
      /Operating Range|data-operating-range|data-operating-node|\.operatingRange/,
    );
    expect(hero.match(/<AdaptiveStackLens/g)).toHaveLength(1);
    expect(lens.match(/data-adaptive-stack-lens(?:\s|>)/g)).toHaveLength(1);
    expect(lens.match(/data-adaptive-system-core/g)).toHaveLength(1);
    expect(lens).toContain("FOUR REAL PRODUCTS.");
    expect(lens).toContain("ARCHITECTURE FOLLOWS THE CONSTRAINT");
    expect(lens).not.toMatch(/SELECTED TOOLCHAIN|PRODUCTION SIGNAL/);
    expect(stylesheet).not.toMatch(/\.narrative\s*{[^}]*opacity/);
    expect(`${hero}\n${lens}\n${v2Page}`).not.toMatch(
      /<video|<canvas|WebGL|Three\.js|three\/|@notion|notion_notion/i,
    );
    expect(lens).not.toMatch(/setInterval|setTimeout|autoplay/i);
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
    expect(lens.match(/<ol\s/g)).toHaveLength(1);
    expect(lens.match(/<article\s/g)).toHaveLength(1);
    expect(lens).toContain('aria-hidden="true"');
    expect(lens).toContain('focusable="false"');

    const packageJson = readSource("package.json");
    expect(packageJson).not.toMatch(/typewriter|typed\.js|textplugin/i);
  });

  it("renders one selector, four buttons, and one card in source order", () => {
    const markup = renderToStaticMarkup(
      createElement(AdaptiveStackLens, {
        modes: ADAPTIVE_STACK_LENS_MODES,
        defaultSlug: DEFAULT_ADAPTIVE_STACK_LENS_SLUG,
      }),
    );

    expect(markup.match(/<ol\b/g)).toHaveLength(1);
    expect(markup.match(/<button\b/g)).toHaveLength(4);
    expect(markup.match(/<article\b/g)).toHaveLength(1);
    expect(markup.match(/data-project-beam="true"/g)).toHaveLength(4);
    expect(markup.match(/data-active="true"/g)).toHaveLength(1);
    expect(markup.match(/<path\b/g)).toHaveLength(2);
    expect(markup.match(/aria-controls="adaptive-stack-lens-readout"/g)).toHaveLength(
      4,
    );
    expect(markup.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(markup.match(/aria-pressed="false"/g)).toHaveLength(3);
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
    };
    const previewed = reduceLensSelection(initial, { type: "preview", index: 3 });
    expect(previewed).toEqual({
      pinnedIndex: 1,
      previewIndex: 3,
      hasInteracted: true,
    });

    const selected = reduceLensSelection(previewed, { type: "select", index: 2 });
    expect(selected).toEqual({
      pinnedIndex: 2,
      previewIndex: 2,
      hasInteracted: true,
    });

    expect(reduceLensSelection(selected, { type: "preview", index: null })).toEqual({
      pinnedIndex: 2,
      previewIndex: null,
      hasInteracted: true,
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

  it("uses CSS-only responsive layout and no projected marker architecture", () => {
    const lens = readSource(
      "src/components/portfolio/hero/adaptive-stack-lens.tsx",
    );
    const stylesheet = readSource(
      "src/styles/portfolio/adaptive-engineer-hero.module.scss",
    );
    expect(lens).toContain('aria-label="Production systems"');
    expect(lens).toContain('aria-controls="adaptive-stack-lens-readout"');
    expect(lens.match(/data-lens-context=/g)).toHaveLength(1);
    expect(lens).toContain("aria-pressed={pinned}");
    expect(lens).toContain("onMouseEnter={() => previewMode(index)}");
    expect(lens).toContain("onFocus={() => previewMode(index)}");
    expect(lens).toContain("onClick={() => selectMode(index)}");
    expect(lens).not.toMatch(
      /matchMedia|ResizeObserver|getScreenCTM|DOMPoint|requestAnimationFrame|data-markers-ready/,
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
    expect(stylesheet).toContain("grid-template-columns: subgrid");
    expect(stylesheet).toContain("grid-template-rows: subgrid");
    expect(stylesheet).toMatch(
      /\.projectControl\s*{[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;[\s\S]*?box-shadow:\s*none;/,
    );
    expect(stylesheet).not.toMatch(/\.projectControlActive\s*{/);
    expect(stylesheet).toContain(".projectBeam {");
    expect(stylesheet).toContain('.projectControl[data-active="true"] .projectBeam');
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

  it("implements the accessible sticky Blueprint Tabs navigation model", () => {
    const navigation = readSource(
      "src/components/portfolio/hero/adaptive-hero-nav.tsx",
    );
    expect(navigation).toContain('aria-current={active ? "location" : undefined}');
    expect(navigation).toContain('event.key === "Escape"');
    expect(navigation).toContain('event.key !== "Tab"');
    expect(navigation).toContain('document.body.style.overflow = "hidden"');
    expect(navigation).toContain("triggerRef.current?.focus");
    expect(navigation).toContain('{open ? "CLOSE" : "MENU"}');
    expect(navigation).toContain("CONTACT");
    expect(navigation).not.toMatch(
      /SYSTEM RAIL|SIGNAL CONSOLE|NAV \/ 04|MENU \/ 04|START A CONVERSATION|WORK WITH ME/,
    );
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
      work: gitBlobSha1("src/app/v2/work/page.tsx"),
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
      root: "1b9695b4a2057ea69678faf3764596cd3295891c",
      origin: "c05bf82f375229f7fb7bedef734142008efcdf32",
      career: "cab919b02bb8eeeff886c1c3d656fb27b4d259de",
      observatorySection: "dcb6697c8f96f81e62061d438b9fc47fba4a1d2b",
      observatoryConfig: "b241613684c8be598d727cf6de5d9969028baee2",
      completion: "ffe5346bdd4d2ec6b2f95a58f557f6a020a0e0a4",
      work: "896f10aa5a3c712df76f68b82d61ab3901041268",
      caseStudy: "b79b87cbd285ac9d47ad54244fa4d3f545c0141b",
      canonical: "9f93f6c2d834d15b5ed47ec49a15a8ccb2e66225",
      media: "75369ab03fe2a588beb84c68b871930c00a8d6da",
    });
  });
});
