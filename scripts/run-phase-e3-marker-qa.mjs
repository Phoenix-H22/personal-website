import fs from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

const BASE_URL = "http://127.0.0.1:3010/v2";
const OUTPUT_DIR = path.resolve(
  "docs/portfolio-v3/qa/phase-d/phase-e3-responsive-rebuild",
);
const REPORT_PATH = path.join(OUTPUT_DIR, "results.json");
const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const viewports = [
  { width: 1920, height: 1080 },
  { width: 1792, height: 828 },
  { width: 1600, height: 900 },
  { width: 1536, height: 864 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1280, height: 800 },
  { width: 1280, height: 720 },
  { width: 1180, height: 820 },
  { width: 1024, height: 768 },
  { width: 820, height: 1180 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
  { width: 1536, height: 720 },
  { width: 1536, height: 680 },
  { width: 1440, height: 700 },
  { width: 1366, height: 650 },
  { width: 1366, height: 625 },
  { width: 1280, height: 650 },
  { width: 1280, height: 600 },
];

const screenshotViewports = new Set([
  "1920x1080",
  "1792x828",
  "1536x720",
  "1440x700",
  "1366x650",
  "1280x650",
  "1024x768",
  "390x844",
]);

const keyboardViewports = new Set([
  "1536x720",
  "1366x650",
  "1280x650",
  "1024x768",
  "390x844",
]);

const stateScreenshotViewports = new Set(["1536x720", "1366x650"]);

const projects = [
  { slug: "warqah-store", title: "Warqah Store" },
  { slug: "smart-lockers-platform", title: "Smart Medication Lockers" },
  { slug: "your-obour-guide", title: "Your Obour Guide" },
  { slug: "nabd", title: "NABD Commerce Automation" },
];

function viewportLabel(viewport) {
  return `${viewport.width}x${viewport.height}`;
}

function expectedMode(width) {
  if (width >= 1600) return "wide-orbit";
  if (width >= 1180) return "laptop-orbit";
  if (width >= 768) return "tablet-tabs";
  return "mobile-tabs";
}

function unique(items) {
  return [...new Set(items)];
}

async function measureLayout(page) {
  return page.evaluate(() => {
    const requireElement = (selector) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error(`Missing required element: ${selector}`);
      return element;
    };
    const snapshot = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        docBottom: rect.bottom + scrollY,
        docLeft: rect.left + scrollX,
        docTop: rect.top + scrollY,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
      };
    };
    const isVisible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const intersects = (first, second) =>
      first.left < second.right - 0.5 &&
      first.right > second.left + 0.5 &&
      first.top < second.bottom - 0.5 &&
      first.bottom > second.top + 0.5;
    const containedBy = (inner, outer) =>
      inner.left >= outer.left - 1 &&
      inner.right <= outer.right + 1 &&
      inner.top >= outer.top - 1 &&
      inner.bottom <= outer.bottom + 1;
    const trackCount = (value) =>
      value.trim() ? value.trim().split(/\s+/).length : 0;

    const hero = requireElement("[data-adaptive-engineer-hero]");
    const lens = requireElement("[data-adaptive-stack-lens]");
    const orbit = requireElement("[data-stack-lens-orbit]");
    const frame = requireElement("[data-orbit-frame]");
    const selector = requireElement("[data-project-selector]");
    const card = requireElement("[data-adaptive-system-core]");
    const link = card.querySelector("a");
    const controls = [...selector.querySelectorAll("button[data-lens-context]")];
    const controlItems = controls.map((control) => control.closest("li"));
    const markers = controls.map((control) => control.querySelector("span:first-child"));
    const beams = controls.map((control) => control.querySelector("[data-project-beam]"));
    const heroRect = snapshot(hero);
    const orbitRect = snapshot(orbit);
    const selectorRect = snapshot(selector);
    const cardRect = snapshot(card);
    const linkRect = snapshot(link);
    const controlRects = controls.map(snapshot);
    const markerRects = markers.map(snapshot);
    const beamRects = beams.map(snapshot);
    const orbitStyle = getComputedStyle(orbit);
    const selectorStyle = getComputedStyle(selector);
    const cardStyle = getComputedStyle(card);
    const heroStyle = getComputedStyle(hero);
    const activeControlIndex = controls.findIndex(
      (control) => control.getAttribute("data-active") === "true",
    );
    const activeBeam = beams[activeControlIndex];
    const activeBeamRect = beamRects[activeControlIndex];
    const cardTextRects = [...card.querySelectorAll("p, h3, dt, dd, a")].map(
      snapshot,
    );
    const markerWidths = markerRects.map(({ width }) => width);
    const markerHeights = markerRects.map(({ height }) => height);
    const activeBeamGap =
      activeControlIndex === 0
        ? cardRect.top - activeBeamRect.bottom
        : activeControlIndex === 1
          ? activeBeamRect.left - cardRect.right
          : activeControlIndex === 2
            ? activeBeamRect.top - cardRect.bottom
            : cardRect.left - activeBeamRect.right;

    return {
      activeMode: lens.getAttribute("data-active-mode"),
      activeBeamCount: controls.filter(
        (control) => control.getAttribute("data-active") === "true",
      ).length,
      activeBeamGap,
      activeBeamIntersectsCardText: cardTextRects.some((rect) =>
        intersects(activeBeamRect, rect),
      ),
      activeBeamLength: Math.max(activeBeamRect.width, activeBeamRect.height),
      activeBeamVisible: isVisible(activeBeam),
      beamCount: beams.length,
      cardAfterSelector:
        Boolean(selector.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING),
      cardColumn: cardStyle.gridColumnStart,
      cardLinkVisible: isVisible(link) && containedBy(linkRect, cardRect),
      cardRow: cardStyle.gridRowStart,
      cardTextContained: [...card.querySelectorAll("p, h3, dt, dd, a")].every(
        (element) => containedBy(snapshot(element), cardRect),
      ),
      cardTitle: card.querySelector("h3")?.textContent?.trim() ?? "",
      card: cardRect,
      controlCardIntersections: controlRects
        .map((rect, index) => (intersects(rect, cardRect) ? index : null))
        .filter((index) => index !== null),
      controlItems: controlItems.map((item) => {
        const style = getComputedStyle(item);
        return {
          column: style.gridColumnStart,
          row: style.gridRowStart,
        };
      }),
      controls: controlRects,
      controlsContainedByOrbit: controlRects.every((rect) =>
        containedBy(rect, orbitRect),
      ),
      controlsVisible: controls.every(isVisible),
      controlSurfacesTransparent: controls.every((control) => {
        const style = getComputedStyle(control);
        return (
          style.backgroundColor === "rgba(0, 0, 0, 0)" &&
          style.borderTopWidth === "0px" &&
          style.borderRightWidth === "0px" &&
          style.borderBottomWidth === "0px" &&
          style.borderLeftWidth === "0px" &&
          style.boxShadow === "none"
        );
      }),
      decorativeSvgCount: lens.querySelectorAll("svg[aria-hidden='true']").length,
      documentScrollHeight: document.documentElement.scrollHeight,
      frameVisible: isVisible(frame),
      heroBottomReachable:
        heroRect.docBottom <= document.documentElement.scrollHeight + 1,
      heroOverflowX: heroStyle.overflowX,
      heroOverflowY: heroStyle.overflowY,
      horizontalOverflow: Math.max(
        0,
        document.documentElement.scrollWidth - innerWidth,
      ),
      linkHref: link?.getAttribute("href") ?? "",
      markerHeightVariation:
        Math.max(...markerHeights) - Math.min(...markerHeights),
      markerWidthVariation: Math.max(...markerWidths) - Math.min(...markerWidths),
      orbit: orbitRect,
      orbitColumnCount: trackCount(orbitStyle.gridTemplateColumns),
      orbitRowCount: trackCount(orbitStyle.gridTemplateRows),
      pressedCount: controls.filter(
        (control) => control.getAttribute("aria-pressed") === "true",
      ).length,
      pressedSlug:
        controls.find((control) => control.getAttribute("aria-pressed") === "true")
          ?.getAttribute("data-lens-context") ?? "",
      projectCardCount: lens.querySelectorAll("[data-adaptive-system-core]").length,
      selector: selectorRect,
      selectorColumnCount: trackCount(selectorStyle.gridTemplateColumns),
      selectorCount: lens.querySelectorAll("[data-project-selector]").length,
      touchTargetsValid: controlRects.every(
        (rect) => rect.width >= 44 && rect.height >= 44,
      ),
      viewportHeight: innerHeight,
      viewportWidth: innerWidth,
    };
  });
}

function layoutFailures(measurement, mode) {
  const failures = [];
  if (measurement.selectorCount !== 1) failures.push("selector count is not one");
  if (measurement.controls.length !== 4) failures.push("control count is not four");
  if (measurement.projectCardCount !== 1) failures.push("card count is not one");
  if (measurement.decorativeSvgCount !== 1) {
    failures.push("decorative SVG count is not one");
  }
  if (!measurement.cardAfterSelector) failures.push("card does not follow selector");
  if (!measurement.controlsVisible) failures.push("one or more controls are hidden");
  if (!measurement.controlSurfacesTransparent) {
    failures.push("project control renders an outer surface");
  }
  if (measurement.markerWidthVariation > 0.5 || measurement.markerHeightVariation > 0.5) {
    failures.push("number marker dimensions are inconsistent");
  }
  if (measurement.beamCount !== 4) failures.push("beam count is not four");
  if (measurement.activeBeamCount !== 1) failures.push("active beam count is not one");
  if (!measurement.cardTextContained) failures.push("card text leaves card bounds");
  if (!measurement.cardLinkVisible) failures.push("case-study link is not visible");
  if (measurement.pressedCount !== 1) failures.push("pressed control count is not one");
  if (measurement.horizontalOverflow > 1) {
    failures.push(`horizontal overflow ${measurement.horizontalOverflow}px`);
  }
  if (["hidden", "clip"].includes(measurement.heroOverflowX)) {
    failures.push(`hero overflow-x is ${measurement.heroOverflowX}`);
  }
  if (["hidden", "clip"].includes(measurement.heroOverflowY)) {
    failures.push(`hero overflow-y is ${measurement.heroOverflowY}`);
  }
  if (!measurement.heroBottomReachable) failures.push("hero bottom is not scroll-reachable");

  if (mode.endsWith("orbit")) {
    if (!measurement.frameVisible) failures.push("orbit frame is hidden");
    if (measurement.orbitColumnCount !== 3) failures.push("orbit is not three columns");
    if (measurement.orbitRowCount !== 3) failures.push("orbit is not three rows");
    if (measurement.orbit.width / measurement.orbit.height < 1.15) {
      failures.push("orbit is not landscape");
    }
    if (measurement.cardRow !== "2" || measurement.cardColumn !== "2") {
      failures.push("card is not in center grid cell");
    }
    const expectedCells = [
      { row: "1", column: "2" },
      { row: "2", column: "3" },
      { row: "3", column: "2" },
      { row: "2", column: "1" },
    ];
    measurement.controlItems.forEach((item, index) => {
      if (
        item.row !== expectedCells[index].row ||
        item.column !== expectedCells[index].column
      ) {
        failures.push(`control ${index + 1} occupies wrong grid cell`);
      }
    });
    if (measurement.controlCardIntersections.length > 0) {
      failures.push(
        `controls intersect card: ${measurement.controlCardIntersections.join(", ")}`,
      );
    }
    if (!measurement.controlsContainedByOrbit) {
      failures.push("one or more controls leave orbit bounds");
    }
    if (!measurement.activeBeamVisible) failures.push("active beam is not visible");
    if (measurement.activeBeamLength < 24) failures.push("active beam is too short");
    if (measurement.activeBeamGap > 2) failures.push("active beam does not reach card");
    if (measurement.activeBeamIntersectsCardText) {
      failures.push("active beam intersects card text");
    }
  } else {
    if (measurement.frameVisible) failures.push("tab mode shows orbit frame");
    const expectedColumns = mode === "tablet-tabs" ? 4 : 2;
    if (measurement.selectorColumnCount !== expectedColumns) {
      failures.push(`selector is not ${expectedColumns} columns`);
    }
    if (!measurement.touchTargetsValid) failures.push("tab touch target is below 44px");
    if (measurement.card.top < measurement.selector.bottom - 1) {
      failures.push("card does not follow tab selector visually");
    }
  }

  return failures;
}

function maximumControlMovement(initial, current) {
  return Math.max(
    ...initial.controls.map((control, index) =>
      Math.hypot(
        control.docLeft - current.controls[index].docLeft,
        control.docTop - current.controls[index].docTop,
      ),
    ),
  );
}

async function validateProjectStates(page, initial, mode, label) {
  const failures = [];
  const states = [];
  const screenshotPaths = [];
  let maximumMovement = 0;
  let maximumOrbitShift = 0;

  for (const project of projects) {
    await page.evaluate((slug) => {
      document.querySelector(`[data-lens-context="${slug}"]`)?.click();
    }, project.slug);
    await page.waitForTimeout(360);
    const current = await measureLayout(page);
    failures.push(
      ...layoutFailures(current, mode).map(
        (failure) => `${project.slug}: ${failure}`,
      ),
    );
    if (stateScreenshotViewports.has(label)) {
      const screenshotPath = path.join(
        OUTPUT_DIR,
        `hero-${label}-${project.slug}.png`,
      );
      await page.screenshot({ path: screenshotPath, fullPage: false });
      screenshotPaths.push(screenshotPath);
    }
    states.push({
      activeMode: current.activeMode,
      cardTitle: current.cardTitle,
      linkHref: current.linkHref,
      pressedSlug: current.pressedSlug,
    });
    if (current.activeMode !== project.slug) {
      failures.push(`${project.slug} did not become active`);
    }
    if (current.pressedSlug !== project.slug) {
      failures.push(`${project.slug} did not become pressed`);
    }
    if (current.cardTitle !== project.title) {
      failures.push(`${project.slug} rendered wrong card title`);
    }
    if (!current.cardTextContained) {
      failures.push(`${project.slug} card text leaves bounds`);
    }
    if (!current.cardLinkVisible) {
      failures.push(`${project.slug} case-study link is not visible`);
    }
    maximumMovement = Math.max(
      maximumMovement,
      maximumControlMovement(initial, current),
    );
    maximumOrbitShift = Math.max(
      maximumOrbitShift,
      Math.abs(initial.orbit.docLeft - current.orbit.docLeft),
      Math.abs(initial.orbit.docTop - current.orbit.docTop),
      Math.abs(initial.orbit.width - current.orbit.width),
      Math.abs(initial.orbit.height - current.orbit.height),
    );
  }

  if (maximumMovement > 1) {
    failures.push(`project switching moved controls ${maximumMovement.toFixed(3)}px`);
  }
  if (maximumOrbitShift > 1) {
    failures.push(`project switching shifted orbit ${maximumOrbitShift.toFixed(3)}px`);
  }

  return {
    failures,
    maximumMovement,
    maximumOrbitShift,
    screenshotPaths,
    states,
  };
}

async function validateKeyboard(page) {
  const failures = [];
  const sequence = [
    { key: "End", slug: "nabd" },
    { key: "Home", slug: "warqah-store" },
    { key: "ArrowRight", slug: "smart-lockers-platform" },
    { key: "ArrowDown", slug: "your-obour-guide" },
    { key: "ArrowLeft", slug: "smart-lockers-platform" },
    { key: "ArrowUp", slug: "warqah-store" },
  ];

  await page.evaluate(() => {
    document
      .querySelector("[data-project-selector] button")
      ?.focus({ preventScroll: true });
  });

  for (const step of sequence) {
    await page.keyboard.press(step.key);
    await page.waitForTimeout(30);
    const state = await page.evaluate(() => {
      const lens = document.querySelector("[data-adaptive-stack-lens]");
      const focused = document.activeElement;
      const pressed = document.querySelector(
        "[data-project-selector] button[aria-pressed='true']",
      );
      return {
        active: lens?.getAttribute("data-active-mode"),
        focused: focused?.getAttribute("data-lens-context"),
        pressed: pressed?.getAttribute("data-lens-context"),
      };
    });
    if (
      state.active !== step.slug ||
      state.focused !== step.slug ||
      state.pressed !== step.slug
    ) {
      failures.push(`${step.key} navigation failed`);
    }
  }

  return failures;
}

async function validateViewport(page, viewport) {
  const label = viewportLabel(viewport);
  const mode = expectedMode(viewport.width);
  await page.setViewportSize(viewport);
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => scrollTo(0, 0));

  const initial = await measureLayout(page);
  const failures = layoutFailures(initial, mode);
  const projectValidation = await validateProjectStates(page, initial, mode, label);
  failures.push(...projectValidation.failures);

  if (keyboardViewports.has(label)) {
    failures.push(...(await validateKeyboard(page)));
  }

  await page.evaluate(() => {
    document
      .querySelector('[data-lens-context="smart-lockers-platform"]')
      ?.click();
    scrollTo(0, 0);
  });
  await page.waitForTimeout(360);

  let screenshotPath = null;
  if (screenshotViewports.has(label)) {
    screenshotPath = path.join(OUTPUT_DIR, `hero-${label}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
  }

  return {
    failures: unique(failures),
    maximumControlMovement: projectValidation.maximumMovement,
    maximumOrbitShift: projectValidation.maximumOrbitShift,
    mode,
    screenshotPath,
    stateScreenshotPaths: projectValidation.screenshotPaths,
    states: projectValidation.states,
    viewport,
  };
}

async function validateReducedMotion(browser) {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 700 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.querySelector('[data-lens-context="warqah-store"]')?.click();
  });
  const result = await page.evaluate(() => {
    const boundary = document.querySelector("[data-orbit-frame] path");
    const cardContent = document.querySelector("[data-adaptive-system-core] > div");
    const caret = document.querySelector("[data-living-toolchain] i");
    const activeBeam = document.querySelector(
      '[data-project-selector] button[data-active="true"] [data-project-beam]',
    );
    const beamStyle = activeBeam ? getComputedStyle(activeBeam) : null;
    return {
      boundaryAnimation: boundary ? getComputedStyle(boundary).animationName : null,
      beamTransitionIsImmediate: beamStyle
        ? beamStyle.transitionDuration
            .split(",")
            .every((duration) => Number.parseFloat(duration) <= 0.001)
        : false,
      cardAnimation: cardContent ? getComputedStyle(cardContent).animationName : null,
      caretDisplay: caret ? getComputedStyle(caret).display : null,
    };
  });
  await context.close();
  return {
    ...result,
    errors,
    passed:
      result.boundaryAnimation === "none" &&
      result.beamTransitionIsImmediate &&
      result.cardAnimation === "none" &&
      result.caretDisplay === "none" &&
      errors.length === 0,
  };
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch(
  fs.existsSync(CHROME_PATH) ? { executablePath: CHROME_PATH, headless: true } : { headless: true },
);
const context = await browser.newContext({ viewport: viewports[0] });
const page = await context.newPage();
const consoleErrors = [];
const hydrationWarnings = [];
let activeViewport = viewportLabel(viewports[0]);

page.on("console", (message) => {
  const text = message.text();
  if (message.type() === "error") consoleErrors.push(`${activeViewport}: ${text}`);
  if (/hydration|did not match|server rendered/i.test(text)) {
    hydrationWarnings.push(`${activeViewport}: ${text}`);
  }
});
page.on("pageerror", (error) => {
  consoleErrors.push(`${activeViewport}: ${error.message}`);
});

const viewportResults = [];
try {
  for (const viewport of viewports) {
    activeViewport = viewportLabel(viewport);
    viewportResults.push(await validateViewport(page, viewport));
  }
} finally {
  await context.close();
}

const reducedMotion = await validateReducedMotion(browser);
await browser.close();

const failures = unique([
  ...viewportResults.flatMap((result) =>
    result.failures.map(
      (failure) => `${viewportLabel(result.viewport)} (${result.mode}): ${failure}`,
    ),
  ),
  ...consoleErrors.map((error) => `console error: ${error}`),
  ...hydrationWarnings.map((warning) => `hydration warning: ${warning}`),
  ...(reducedMotion.passed ? [] : ["reduced-motion validation failed"]),
]);

const report = {
  baseUrl: BASE_URL,
  consoleErrors,
  generatedAt: new Date().toISOString(),
  hydrationWarnings,
  reducedMotion,
  summary: {
    failures,
    passed: failures.length === 0,
    viewportCount: viewportResults.length,
  },
  viewportResults,
};

fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.summary, null, 2));
if (!report.summary.passed) process.exitCode = 1;
