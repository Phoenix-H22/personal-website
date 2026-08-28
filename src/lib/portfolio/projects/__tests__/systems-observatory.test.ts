import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  buildSystemsObservatoryLenses,
  getObservatoryPanelId,
  getObservatoryTabId,
  INITIAL_OBSERVATORY_TAB_ID,
  SYSTEMS_OBSERVATORY_TABS,
} from "@/components/portfolio/systems-observatory/systems-observatory.config";
import {
  hasMeaningfulViewportScroll,
  isInsideActiveAnnotation,
} from "@/components/portfolio/systems-observatory/systems-observatory-annotation-behavior";
import { getEvidenceDisplayMode } from "@/components/portfolio/systems-observatory/systems-observatory-evidence";
import {
  getOwnershipScope,
  getTechnologyInsight,
  SYSTEMS_OBSERVATORY_TECHNOLOGY_INSIGHTS,
} from "@/components/portfolio/systems-observatory/systems-observatory-insights";
import {
  formatObservatoryPosition,
  getNavigationTargetIndex,
  getObservatoryRailAlignment,
  getObservatoryRailScrollTarget,
  getProjectTransitionDirection,
  resolveObservatoryGestureDirection,
  shouldStartObservatoryGesture,
} from "@/components/portfolio/systems-observatory/systems-observatory-navigation";
import { FEATURED_PROJECT_SLUGS } from "@/lib/portfolio/projects/canonical-projects";
import mediaManifest from "@/lib/portfolio/projects/data/public-media-manifest.json";
import projectSnapshot from "@/lib/portfolio/projects/data/public-projects.snapshot.json";
import { toFeaturedProjectDto } from "@/lib/portfolio/projects/normalize";
import { PortfolioProjectRepository } from "@/lib/portfolio/projects/repository";

const featuredProjects = new PortfolioProjectRepository(
  projectSnapshot,
  mediaManifest,
)
  .getFeaturedProjects()
  .map(toFeaturedProjectDto);

describe("Systems Observatory configuration", () => {
  it("defines exactly three immutable story lenses", () => {
    expect(SYSTEMS_OBSERVATORY_TABS).toHaveLength(3);
    expect(SYSTEMS_OBSERVATORY_TABS.map(({ label }) => label)).toEqual([
      "THE SIGNATURE SYSTEMS",
      "MINE, END TO END",
      "BUILT TO OPERATE",
    ]);
    expect(SYSTEMS_OBSERVATORY_TABS.map(({ signalLine }) => signalLine)).toEqual([
      "7 FLAGSHIP BUILDS",
      "FOUNDER-BUILT / ZERO TO PRODUCTION",
      "PRODUCTION / SCALE / DEVICES / INTEGRATIONS",
    ]);
  });

  it("locks exact project membership and order for every lens", () => {
    expect(SYSTEMS_OBSERVATORY_TABS.map(({ projects }) => projects.map(({ slug }) => slug))).toEqual([
      [...FEATURED_PROJECT_SLUGS],
      ["your-obour-guide", "autopay-eg", "nabd"],
      [
        "smart-lockers-platform",
        "warqah-store",
        "autopay-eg",
        "nabd",
        "wasfaty-smart-vending",
        "alzahaby-loyalty-app",
      ],
    ]);
  });

  it("builds lenses only from exact canonical featured DTOs", () => {
    const lenses = buildSystemsObservatoryLenses(featuredProjects);
    expect(lenses[0].projects.map(({ slug }) => slug)).toEqual(FEATURED_PROJECT_SLUGS);
    expect(new Set(lenses[0].projects.map(({ slug }) => slug)).size).toBe(7);
    expect(lenses[1].projects.every(({ ownershipType }) => ownershipType === "founder-built")).toBe(true);
    expect(() => buildSystemsObservatoryLenses(featuredProjects.slice(1))).toThrow();
  });

  it("provides unique, valid initial tab and panel relationships", () => {
    const tabIds = SYSTEMS_OBSERVATORY_TABS.map(({ id }) => getObservatoryTabId(id));
    const panelIds = SYSTEMS_OBSERVATORY_TABS.map(({ id }) => getObservatoryPanelId(id));
    expect(new Set([...tabIds, ...panelIds]).size).toBe(6);
    expect(INITIAL_OBSERVATORY_TAB_ID).toBe("signature");
  });
});

describe("Systems Observatory navigation", () => {
  it("keeps every project reachable through circular keyboard navigation", () => {
    for (const lens of SYSTEMS_OBSERVATORY_TABS) {
      for (let index = 0; index < lens.projects.length; index += 1) {
        expect(getNavigationTargetIndex("ArrowRight", index, lens.projects.length)).toBe(
          (index + 1) % lens.projects.length,
        );
        expect(getNavigationTargetIndex("ArrowDown", index, lens.projects.length)).toBe(
          (index + 1) % lens.projects.length,
        );
        expect(getNavigationTargetIndex("ArrowLeft", index, lens.projects.length)).toBe(
          (index - 1 + lens.projects.length) % lens.projects.length,
        );
        expect(getNavigationTargetIndex("ArrowUp", index, lens.projects.length)).toBe(
          (index - 1 + lens.projects.length) % lens.projects.length,
        );
        expect(getNavigationTargetIndex("Home", index, lens.projects.length)).toBe(0);
        expect(getNavigationTargetIndex("End", index, lens.projects.length)).toBe(
          lens.projects.length - 1,
        );
      }
    }
  });

  it("formats active project positions without off-by-one errors", () => {
    expect(formatObservatoryPosition(0, 7)).toBe("01 / 07");
    expect(formatObservatoryPosition(3, 7)).toBe("04 / 07");
    expect(formatObservatoryPosition(6, 7)).toBe("07 / 07");
  });

  it("aligns first, middle, and final story tabs to their local boundaries", () => {
    expect(getObservatoryRailAlignment(0, 3)).toBe("start");
    expect(getObservatoryRailAlignment(1, 3)).toBe("center");
    expect(getObservatoryRailAlignment(2, 3)).toBe("end");
    const geometry = { viewportSize: 300, contentSize: 900, nodeSize: 240 };
    expect(
      getObservatoryRailScrollTarget({ ...geometry, nodeStart: 0 }, "start"),
    ).toBe(0);
    expect(
      getObservatoryRailScrollTarget({ ...geometry, nodeStart: 330 }, "center"),
    ).toBe(300);
    expect(
      getObservatoryRailScrollTarget({ ...geometry, nodeStart: 660 }, "end"),
    ).toBe(600);
  });

  it("clamps story-tab alignment to actual rail bounds", () => {
    const geometry = { viewportSize: 300, contentSize: 900, nodeSize: 240 };
    expect(
      getObservatoryRailScrollTarget({ ...geometry, nodeStart: -80 }, "start"),
    ).toBe(0);
    expect(
      getObservatoryRailScrollTarget({ ...geometry, nodeStart: 820 }, "end"),
    ).toBe(600);
  });

  it.each([
    [{ deltaX: -60, deltaY: 8, durationMs: 260 }, 1],
    [{ deltaX: 60, deltaY: 8, durationMs: 260 }, -1],
    [{ deltaX: -35, deltaY: 4, durationMs: 60 }, 1],
    [{ deltaX: 78, deltaY: 96, durationMs: 200 }, null],
    [{ deltaX: 40, deltaY: 4, durationMs: 240 }, null],
  ] as const)("resolves completed gesture %j as %s", (sample, direction) => {
    expect(resolveObservatoryGestureDirection(sample)).toBe(direction);
  });

  it("rejects mouse dragging from interactive descendants", () => {
    expect(
      shouldStartObservatoryGesture({ primary: true, button: 0, interactive: true }),
    ).toBe(false);
    expect(
      shouldStartObservatoryGesture({ primary: true, button: 0, interactive: false }),
    ).toBe(true);
  });

  it("uses the shortest logical transition across project wraparound", () => {
    expect(getProjectTransitionDirection(6, 0, 7)).toBe(1);
    expect(getProjectTransitionDirection(0, 6, 7)).toBe(-1);
    expect(getProjectTransitionDirection(1, 4, 7)).toBe(1);
    expect(getProjectTransitionDirection(5, 2, 7)).toBe(-1);
  });
});

describe("Systems Observatory annotations", () => {
  it("keeps only the exact active trigger and panel inside the annotation boundary", () => {
    const trigger = new EventTarget();
    const panel = new EventTarget();
    const narrative = new EventTarget();
    expect(isInsideActiveAnnotation([narrative, trigger], trigger, panel)).toBe(true);
    expect(isInsideActiveAnnotation([narrative, panel], trigger, panel)).toBe(true);
    expect(isInsideActiveAnnotation([narrative], trigger, panel)).toBe(false);
  });

  it("ignores tiny scroll shifts and closes after meaningful viewport movement", () => {
    const openedAt = { x: 0, y: 120 };
    expect(hasMeaningfulViewportScroll(openedAt, { x: 2, y: 124 })).toBe(false);
    expect(hasMeaningfulViewportScroll(openedAt, { x: 0, y: 128 })).toBe(true);
  });

  it("keeps technology insight configuration presentation-only", () => {
    const allowedFields = ["category", "label", "sentence"];
    for (const [projectSlug, insights] of Object.entries(
      SYSTEMS_OBSERVATORY_TECHNOLOGY_INSIGHTS,
    )) {
      const project = featuredProjects.find(({ slug }) => slug === projectSlug);
      expect(project).toBeDefined();
      for (const [technology, insight] of Object.entries(insights ?? {})) {
        expect(project?.technologies).toContain(technology);
        expect(Object.keys(insight).sort()).toEqual(
          Object.keys(insight).filter((field) => allowedFields.includes(field)).sort(),
        );
        expect(insight.sentence.trim()).not.toBe("");
      }
    }
  });

  it("renders insights only for configured project and technology pairs", () => {
    expect(getTechnologyInsight("smart-lockers-platform", "Laravel 11")?.sentence).toMatch(
      /command lifecycles/,
    );
    expect(getTechnologyInsight("smart-lockers-platform", "Unknown runtime")).toBeNull();
    expect(getTechnologyInsight("unknown-project", "Laravel 11")).toBeNull();
  });

  it("assembles ownership scope only from approved public DTO fields", () => {
    const project = featuredProjects[0];
    const scope = getOwnershipScope(project);
    expect(scope).toContain(project.role);
    expect(scope).toContain(project.strongestCapability);
    expect(scope).not.toContain("publicSummary");
    expect(scope).not.toContain("architectureDiagram");
  });
});

describe("Systems Observatory evidence presentation", () => {
  it.each([
    ["Production", "textual"],
    ["EGP 21M+", "numeric"],
    ["5,000+", "numeric"],
    ["Hajj season", "textual"],
    ["iOS + Android", "textual"],
    ["Multi-gateway", "textual"],
    ["24/7 operational", "mixed"],
  ] as const)("classifies %s as %s evidence", (value, expectedMode) => {
    expect(getEvidenceDisplayMode(value)).toBe(expectedMode);
  });
});

describe("Systems Observatory integration boundaries", () => {
  const root = process.cwd();
  const readSource = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

  it("mounts only through the typed V2 exhibition flag", () => {
    const variants = readSource("src/lib/portfolio/portfolio-variant.ts");
    const page = readSource("src/components/portfolio/portfolio-page.tsx");
    expect(variants).toMatch(/current:[\s\S]*showSystemsExhibition:\s*false/);
    expect(variants).toMatch(/v2:[\s\S]*showSelectedSystems:\s*false/);
    expect(variants).toMatch(/v2:[\s\S]*showSystemsExhibition:\s*true/);
    expect(page).toMatch(/config\.sections\.showSystemsExhibition/);
    expect(page).toMatch(/SystemsObservatorySection/);
  });

  it("keeps route, media, and client-data scope closed", () => {
    const experience = readSource(
      "src/components/portfolio/systems-observatory/systems-observatory-experience.tsx",
    );
    const presentation = readSource(
      "src/components/portfolio/systems-observatory/systems-observatory-presentation.tsx",
    );
    const projectNavigation = readSource(
      "src/components/portfolio/systems-observatory/systems-observatory-project-navigation.tsx",
    );
    const clientSource = `${experience}\n${presentation}\n${projectNavigation}`;
    expect(fs.existsSync(path.join(root, "src", "app", "projects"))).toBe(true);
    expect(clientSource).not.toMatch(/architectureDiagram|gallery|["'`]\/projects\/|case stud/i);
    expect(clientSource).not.toMatch(/public-projects\.(?:snapshot|editorial)\.json/);
    expect(experience).toMatch(/effective === "reduced"/);
    expect(projectNavigation).toMatch(/aria-label=.*project/i);
    expect(presentation.match(/<LazyMedia\b/g)).toHaveLength(1);
  });

  it("uses exact capture-phase annotation boundaries without broad owner markers", () => {
    const annotations = readSource(
      "src/components/portfolio/systems-observatory/systems-observatory-annotations.tsx",
    );
    const presentation = readSource(
      "src/components/portfolio/systems-observatory/systems-observatory-presentation.tsx",
    );
    expect(annotations).toContain("event.composedPath()");
    expect(annotations).toMatch(
      /addEventListener\("pointerdown", closeFromOutside, true\)/,
    );
    expect(annotations).not.toContain("closest(");
    expect(annotations).not.toContain("data-annotation-owner");
    expect(presentation).not.toContain("data-annotation-owner");
  });

  it("renders the System Navigator before stage narrative and removes the old rail", () => {
    const presentation = readSource(
      "src/components/portfolio/systems-observatory/systems-observatory-presentation.tsx",
    );
    const panelComposition = presentation.slice(
      presentation.indexOf("export function ObservatoryPanel"),
    );
    expect(panelComposition.indexOf("<SystemNavigator")).toBeGreaterThan(-1);
    expect(panelComposition.indexOf("<SystemNavigator")).toBeLessThan(
      panelComposition.indexOf("<ActiveProjectStage"),
    );
    expect(panelComposition.match(/<SystemNavigator\b/g)).toHaveLength(1);
    expect(presentation).not.toContain("Lens sequence");
  });

  it("keeps only the mobile Lens Deck as a horizontal primary rail", () => {
    const stylesheet = readSource(
      "src/styles/portfolio/systems-observatory.module.scss",
    );
    const tabBlocks = [...stylesheet.matchAll(/\.tabs\s*\{([^}]*)\}/g)].map(
      ([, declarations]) => declarations,
    );
    expect(tabBlocks.some((block) => /overflow-x:\s*auto/.test(block))).toBe(true);
    expect(tabBlocks.some((block) => /scroll-snap-type:\s*x mandatory/.test(block))).toBe(
      true,
    );
    expect(tabBlocks.every((block) => !/grid-template-columns:\s*1fr/.test(block))).toBe(
      true,
    );
    expect(stylesheet).toMatch(/\.desktopNavigator\s*\{[\s\S]*display:\s*none/);
    expect(stylesheet).toMatch(/\.mobileCommandNavigator\s*\{[\s\S]*display:\s*block/);
  });

  it("provides an accessible mobile command bar and complete inline index", () => {
    const projectNavigation = readSource(
      "src/components/portfolio/systems-observatory/systems-observatory-project-navigation.tsx",
    );
    expect(projectNavigation).toContain("data-project-command-bar");
    expect(projectNavigation).toContain("data-mobile-system-index");
    expect(projectNavigation).toMatch(/aria-expanded=\{indexOpen\}/);
    expect(projectNavigation).toMatch(/aria-controls=\{indexId\}/);
    expect(projectNavigation).toMatch(/event\.key === "Escape"/);
    expect(projectNavigation).toMatch(/lens\.projects\.map/);
    expect(projectNavigation).toMatch(/onSelectProject\(project\)/);
  });

  it("prevents arbitrary character breaking in evidence values", () => {
    const stylesheet = readSource(
      "src/styles/portfolio/systems-observatory.module.scss",
    );
    const evidenceValueBlocks = [
      ...stylesheet.matchAll(/\.evidenceValue\s*\{([^}]*)\}/g),
    ].map(([, declarations]) => declarations);
    expect(evidenceValueBlocks.some((block) => /word-break:\s*normal/.test(block))).toBe(
      true,
    );
    expect(evidenceValueBlocks.every((block) => !/overflow-wrap:\s*anywhere/.test(block))).toBe(
      true,
    );
  });

  it("honors the effective reduced-motion preference in CSS", () => {
    const stylesheet = readSource(
      "src/styles/portfolio/systems-observatory.module.scss",
    );
    const blockStart = stylesheet.indexOf('.section[data-reduced-motion="true"]');
    const blockEnd = stylesheet.indexOf("@media (prefers-reduced-motion", blockStart);
    const effectiveReducedMotionBlock = stylesheet.slice(blockStart, blockEnd);
    expect(blockStart).toBeGreaterThan(-1);
    expect(blockEnd).toBeGreaterThan(blockStart);
    expect(effectiveReducedMotionBlock).toMatch(/transition:\s*none/);
    expect(effectiveReducedMotionBlock).toMatch(/scroll-behavior:\s*auto/);
  });

});
