import fs from "node:fs";
import path from "node:path";

import { chromium, firefox, webkit } from "playwright";

const BASE_URL = "http://127.0.0.1:3010/v2";
const OUTPUT_DIR = path.resolve(
  "docs/portfolio-v3/qa/phase-d/phase-e3-markers",
);
const REPORT_PATH = path.join(OUTPUT_DIR, "results.json");

const targets = [
  {
    name: "Chrome",
    slug: "chrome",
    browserType: chromium,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  },
  {
    name: "Edge",
    slug: "edge",
    browserType: chromium,
    executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  },
  {
    name: "Brave",
    slug: "brave",
    browserType: chromium,
    executablePath: "C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe",
  },
  { name: "Firefox", slug: "firefox", browserType: firefox },
  { name: "WebKit", slug: "webkit", browserType: webkit },
];
const selectedTargets = process.env.MARKER_QA_BROWSER
  ? targets.filter(({ name }) => name === process.env.MARKER_QA_BROWSER)
  : targets;

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
];

const zoomLevels = [1.25, 1.5, 2];
const deviceScaleFactors = [1.25, 1.5, 2];
const contextSlugs = [
  "warqah-store",
  "smart-lockers-platform",
  "your-obour-guide",
  "nabd",
];
const requiredScreenshotViewports = new Set([
  "1792x828",
  "1536x864",
  "1366x768",
  "1280x720",
  "1024x768",
  "390x844",
]);

async function measureGeometry(page) {
  return page.evaluate(() => {
    const stage = document.querySelector("[data-lens-geometry-stage]");
    const geometryId = stage.getAttribute("data-geometry");
    const svg = stage.querySelector(
      `[data-lens-geometry-svg="${geometryId}"]`,
    );
    const matrix = svg.getScreenCTM();
    const stageRect = stage.getBoundingClientRect();
    const coreRect = document
      .querySelector("[data-adaptive-system-core]")
      .getBoundingClientRect();
    const sectionRect = document
      .querySelector("[data-adaptive-stack-lens]")
      .getBoundingClientRect();
    const sideMidpoint = (side) => ({
      x: (side.x1 + side.x2) / 2,
      y: (side.y1 + side.y2) / 2,
    });
    const markerSides = [...svg.querySelectorAll("[data-marker-side-id]")];
    const markers = markerSides.map((sideElement) => {
      const id = sideElement.getAttribute("data-marker-side-id");
      const side = {
        side: sideElement.getAttribute("data-semantic-side"),
        x1: Number(sideElement.getAttribute("x1")),
        y1: Number(sideElement.getAttribute("y1")),
        x2: Number(sideElement.getAttribute("x2")),
        y2: Number(sideElement.getAttribute("y2")),
      };
      const midpoint = sideMidpoint(side);
      const expected = new DOMPoint(midpoint.x, midpoint.y).matrixTransform(matrix);
      const marker = stage.querySelector(`[data-lens-position="${id}"]`);
      const anchor = marker.getBoundingClientRect();
       const chip = marker
         .querySelector("button > span:first-child")
         .getBoundingClientRect();
       const label = marker
         .querySelector("button > span:last-child")
         .getBoundingClientRect();
      const actual = {
        x: chip.left + chip.width / 2,
        y: chip.top + chip.height / 2,
      };
      return {
        id,
        side,
        midpoint,
        expectedX: expected.x,
        expectedY: expected.y,
        actualX: actual.x,
        actualY: actual.y,
        deltaX: actual.x - expected.x,
        deltaY: actual.y - expected.y,
        expectedLocalX: expected.x - stageRect.left,
        expectedLocalY: expected.y - stageRect.top,
        actualLocalX: actual.x - stageRect.left,
        actualLocalY: actual.y - stageRect.top,
        anchorWidth: anchor.width,
        anchorHeight: anchor.height,
        chip: chip.toJSON(),
        label: label.toJSON(),
        labelOverlapsCore:
          label.left < coreRect.right - 0.5 &&
          label.right > coreRect.left + 0.5 &&
          label.top < coreRect.bottom - 0.5 &&
          label.bottom > coreRect.top + 0.5,
        labelInsideSection:
          label.left >= sectionRect.left - 1 &&
          label.right <= sectionRect.right + 1 &&
          label.top >= sectionRect.top - 1 &&
          label.bottom <= sectionRect.bottom + 1,
      };
    });
    const labelOverlaps = [];
    for (let first = 0; first < markers.length; first += 1) {
      for (let second = first + 1; second < markers.length; second += 1) {
        const a = markers[first].label;
        const b = markers[second].label;
        if (
          a.left < b.right - 0.5 &&
          a.right > b.left + 0.5 &&
          a.top < b.bottom - 0.5 &&
          a.bottom > b.top + 0.5
        ) {
          labelOverlaps.push(`${markers[first].id}/${markers[second].id}`);
        }
      }
    }
    return {
      activeMode: document
        .querySelector("[data-adaptive-stack-lens]")
        .getAttribute("data-active-mode"),
      debugOverlayRendered: document.querySelector("[data-motion-debug]") !== null,
      geometryId,
      horizontalOverflow: Math.max(
        0,
        document.documentElement.scrollWidth - innerWidth,
      ),
      labelOverlaps,
      cardTextContained: [...document.querySelectorAll(
        "[data-adaptive-system-core] p, [data-adaptive-system-core] h3, [data-adaptive-system-core] dt, [data-adaptive-system-core] dd, [data-adaptive-system-core] a",
      )].every((element) => {
        const rect = element.getBoundingClientRect();
        return (
          rect.left >= coreRect.left - 1 &&
          rect.right <= coreRect.right + 1 &&
          rect.top >= coreRect.top - 1 &&
          rect.bottom <= coreRect.bottom + 1
        );
      }),
      bottomBreathing: Math.min(
        stageRect.bottom - markers.find(({ id }) => id === "product").chip.bottom,
        stageRect.bottom - markers.find(({ id }) => id === "product").label.bottom,
      ),
      markers,
      markersReady: stage.getAttribute("data-markers-ready"),
      stage: stageRect.toJSON(),
    };
  });
}

function measurementFailures(measurement, tolerance) {
  const failures = [];
  if (measurement.markersReady !== "true") failures.push("markers not ready");
  if (measurement.markers.length !== 4) failures.push("marker edge count is not four");
  if (measurement.debugOverlayRendered) failures.push("normal UI contains motion debug");
  if (measurement.horizontalOverflow > 1) {
    failures.push(`horizontal overflow ${measurement.horizontalOverflow}px`);
  }
  if (measurement.labelOverlaps.length > 0) {
    failures.push(`label overlaps ${measurement.labelOverlaps.join(", ")}`);
  }
  if (!measurement.cardTextContained) failures.push("card text leaves card bounds");
  if (measurement.bottomBreathing < 24) {
    failures.push(`bottom breathing ${measurement.bottomBreathing.toFixed(3)}px`);
  }
  for (const marker of measurement.markers) {
    if (Math.abs(marker.deltaX) > tolerance || Math.abs(marker.deltaY) > tolerance) {
      failures.push(
        `${marker.id} delta (${marker.deltaX.toFixed(3)}, ${marker.deltaY.toFixed(3)})`,
      );
    }
    if (marker.anchorWidth !== 0 || marker.anchorHeight !== 0) {
      failures.push(`${marker.id} anchor has intrinsic size`);
    }
    if (marker.labelOverlapsCore) failures.push(`${marker.id} label overlaps core`);
    if (!marker.labelInsideSection) failures.push(`${marker.id} label leaves lens section`);
  }
  return failures;
}

function movementFrom(initial, current) {
  return Math.max(
    ...initial.markers.map((marker, index) =>
      Math.hypot(
        marker.actualLocalX - current.markers[index].actualLocalX,
        marker.actualLocalY - current.markers[index].actualLocalY,
      ),
    ),
  );
}

async function installCrosshairs(page, measurement) {
  await page.evaluate((markers) => {
    const stage = document.querySelector("[data-lens-geometry-stage]");
    stage.querySelector("[data-marker-crosshairs]")?.remove();
    const overlay = document.createElement("div");
    overlay.dataset.markerCrosshairs = "true";
    Object.assign(overlay.style, {
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
      zIndex: "20",
    });
    const addCrosshair = (x, y, color, size, label) => {
      const crosshair = document.createElement("span");
      Object.assign(crosshair.style, {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderTop: `1px solid ${color}`,
        borderLeft: `1px solid ${color}`,
        transform: "translate(-50%, -50%) rotate(45deg)",
      });
      if (label) {
        crosshair.textContent = label;
        Object.assign(crosshair.style, {
          color,
          font: "8px/1 monospace",
          whiteSpace: "nowrap",
        });
      }
      overlay.append(crosshair);
    };
    for (const marker of markers) {
      addCrosshair(
        marker.expectedLocalX,
        marker.expectedLocalY,
        "#00ffff",
        16,
        `${marker.side.side.toUpperCase()} CENTER`,
      );
      addCrosshair(marker.actualLocalX, marker.actualLocalY, "#ff2bd6", 9, "");
    }
    stage.append(overlay);
  }, measurement.markers);
}

async function captureLens(page, target, label) {
  const lens = page.locator("[data-adaptive-stack-lens]");
  await lens.screenshot({
    path: path.join(OUTPUT_DIR, `${target.slug}-${label}.png`),
  });
}

async function captureRequiredViewport(page, target, viewport) {
  const label = `${viewport.width}x${viewport.height}`;
  if (!requiredScreenshotViewports.has(label)) return;
  await page.screenshot({
    path: path.join(OUTPUT_DIR, `${target.slug}-hero-${label}.png`),
    fullPage: false,
  });
}

async function validateTransitions(page, viewport) {
  const tolerance = viewport.width < 768 ? 1 : 0.75;
  const initial = await measureGeometry(page);
  const transitions = [{ context: initial.activeMode, measurement: initial }];
  const failures = measurementFailures(initial, tolerance);
  let maximumMovement = 0;
  for (const slug of contextSlugs) {
    await page.evaluate((contextSlug) => {
      document.querySelector(`[data-lens-context="${contextSlug}"]`).click();
    }, slug);
    await page.waitForTimeout(80);
    const current = await measureGeometry(page);
    transitions.push({ context: slug, measurement: current });
    failures.push(...measurementFailures(current, tolerance));
    maximumMovement = Math.max(maximumMovement, movementFrom(initial, current));
  }
  if (maximumMovement > tolerance) {
    failures.push(`context-switch movement ${maximumMovement.toFixed(3)}px`);
  }
  return {
    failures: [...new Set(failures)],
    maximumMovement,
    transitions,
  };
}

async function measureTabLayout(page) {
  return page.evaluate(() => {
    const lens = document.querySelector("[data-adaptive-stack-lens]");
    const core = lens.querySelector("[data-adaptive-system-core]");
    const controls = [...lens.querySelectorAll("[data-lens-position]")];
    const tabs = controls.map((node) => {
      const button = node.querySelector("button");
      const labelElement = button.querySelector("span:last-child");
      const label = labelElement.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      return {
        id: node.getAttribute("data-lens-position"),
        button: buttonRect.toJSON(),
        label: label.toJSON(),
        labelText: labelElement.textContent.trim(),
      };
    });
    const coreRect = core.getBoundingClientRect();
    return {
      activeMode: lens.getAttribute("data-active-mode"),
      coreTitle: core.querySelector("h3")?.textContent,
      cardTextContained: [...core.querySelectorAll("p, h3, dt, dd, a")].every(
        (element) => {
          const rect = element.getBoundingClientRect();
          return (
            rect.left >= coreRect.left - 1 &&
            rect.right <= coreRect.right + 1 &&
            rect.top >= coreRect.top - 1 &&
            rect.bottom <= coreRect.bottom + 1
          );
        },
      ),
      debugOverlayRendered: document.querySelector("[data-motion-debug]") !== null,
      gridColumns: getComputedStyle(lens.querySelector("ol")).gridTemplateColumns,
      horizontalOverflow: Math.max(
        0,
        document.documentElement.scrollWidth - innerWidth,
      ),
      tabs,
    };
  });
}

async function validateTabViewport(page, target, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-lens-geometry-stage]")
        ?.getAttribute("data-markers-ready") === "true",
  );
  const initial = await measureTabLayout(page);
  const failures = [];
  const expectedColumns = viewport.width < 768 ? 2 : 4;
  if (initial.tabs.length !== 4) failures.push("tab grid does not contain four controls");
  if (initial.debugOverlayRendered) failures.push("normal UI contains motion debug");
  if (!initial.cardTextContained) failures.push("card text leaves card bounds");
  if (initial.horizontalOverflow > 1) {
    failures.push(`horizontal overflow ${initial.horizontalOverflow}px`);
  }
  if (initial.gridColumns.split(" ").filter(Boolean).length !== expectedColumns) {
    failures.push(`selector is not ${expectedColumns} columns`);
  }
  for (const tab of initial.tabs) {
    if (tab.button.width < 44 || tab.button.height < 44) {
      failures.push(`${tab.id} touch target is too small`);
    }
  }
  const initialRects = initial.tabs.map(({ button }) => button);
  let maximumMovement = 0;
  for (const slug of contextSlugs) {
    await page.evaluate((contextSlug) => {
      document.querySelector(`[data-lens-context="${contextSlug}"]`).click();
    }, slug);
    await page.waitForTimeout(80);
    const current = await measureTabLayout(page);
    current.tabs.forEach(({ button }, index) => {
      maximumMovement = Math.max(
        maximumMovement,
        Math.hypot(
          button.left - initialRects[index].left,
          button.top - initialRects[index].top,
        ),
      );
    });
  }
  if (maximumMovement > 1) {
    failures.push(`mobile nodes moved ${maximumMovement.toFixed(3)}px`);
  }
  const final = await measureTabLayout(page);
  if (
    final.activeMode !== "nabd" ||
    final.coreTitle !== "NABD Commerce Automation"
  ) {
    failures.push("tab context switching did not update core card");
  }
  await captureLens(page, target, `${viewport.width}x${viewport.height}`);
  await captureRequiredViewport(page, target, viewport);
  return {
    browser: target.name,
    failures: [...new Set(failures)],
    geometryId: "tabs",
    markerMeasurements: [],
    maximumDelta: 0,
    maximumMovement,
    viewport,
  };
}

async function validateViewport(page, target, viewport) {
  if (viewport.width < 1100) {
    return validateTabViewport(page, target, viewport);
  }
  await page.setViewportSize(viewport);
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-lens-geometry-stage]")
        ?.getAttribute("data-markers-ready") === "true",
  );
  const validation = await validateTransitions(page, viewport);
  const finalMeasurement = validation.transitions.at(-1).measurement;
  await captureRequiredViewport(page, target, viewport);
  await installCrosshairs(page, finalMeasurement);
  await captureLens(page, target, `${viewport.width}x${viewport.height}`);
  return {
    browser: target.name,
    failures: validation.failures,
    geometryId: finalMeasurement.geometryId,
    markerMeasurements: validation.transitions.map(({ context, measurement }) => ({
      context,
      markers: measurement.markers.map(
        ({
          id,
          expectedX,
          expectedY,
          actualX,
          actualY,
          deltaX,
          deltaY,
        }) => ({
          markerId: id,
          expectedX,
          expectedY,
          actualX,
          actualY,
          deltaX,
          deltaY,
        }),
      ),
    })),
    maximumDelta: Math.max(
      ...validation.transitions.flatMap(({ measurement }) =>
        measurement.markers.flatMap(({ deltaX, deltaY }) => [
          Math.abs(deltaX),
          Math.abs(deltaY),
        ]),
      ),
    ),
    maximumMovement: validation.maximumMovement,
    viewport,
  };
}

async function validateNoJavaScriptFallback(browser) {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  const fallback = await page.evaluate(() => {
    const stage = document.querySelector("[data-lens-geometry-stage]");
    const marker = document.querySelector("[data-lens-position]");
    return {
      controls: document.querySelectorAll("[data-lens-position]").length,
      debugOverlayRendered: document.querySelector("[data-motion-debug]") !== null,
      markerOpacity: getComputedStyle(marker).opacity,
      markersReady: stage.getAttribute("data-markers-ready"),
    };
  });
  await context.close();
  return {
    ...fallback,
    passed:
      fallback.controls === 4 &&
      !fallback.debugOverlayRendered &&
      fallback.markerOpacity === "0" &&
      fallback.markersReady === "false",
  };
}

async function validateZoom(page, level) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.evaluate((zoom) => {
    document.documentElement.style.zoom = String(zoom);
  }, level);
  await page.waitForTimeout(250);
  const validation = await validateTransitions(page, { width: 1440, height: 900 });
  return {
    level,
    failures: validation.failures,
    maximumDelta: Math.max(
      ...validation.transitions.flatMap(({ measurement }) =>
        measurement.markers.flatMap(({ deltaX, deltaY }) => [
          Math.abs(deltaX),
          Math.abs(deltaY),
        ]),
      ),
    ),
  };
}

async function validateDeviceScaleFactor(browser, factor) {
  const context = await browser.newContext({
    deviceScaleFactor: factor,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-lens-geometry-stage]")
        ?.getAttribute("data-markers-ready") === "true",
  );
  const validation = await validateTransitions(page, { width: 1440, height: 900 });
  await context.close();
  return {
    factor,
    failures: validation.failures,
    maximumDelta: Math.max(
      ...validation.transitions.flatMap(({ measurement }) =>
        measurement.markers.flatMap(({ deltaX, deltaY }) => [
          Math.abs(deltaX),
          Math.abs(deltaY),
        ]),
      ),
    ),
  };
}

if (!fs.existsSync(path.dirname(OUTPUT_DIR))) {
  throw new Error(`QA parent directory is missing: ${path.dirname(OUTPUT_DIR)}`);
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const report = { generatedAt: new Date().toISOString(), browsers: [] };
for (const target of selectedTargets) {
  if (target.executablePath && !fs.existsSync(target.executablePath)) {
    throw new Error(`${target.name} executable is missing`);
  }
  const browser = await target.browserType.launch({
    executablePath: target.executablePath,
    headless: true,
  });
  try {
    const noJavaScript = await validateNoJavaScriptFallback(browser);
    const context = await browser.newContext({ viewport: viewports[0] });
    const page = await context.newPage();
    const viewportResults = [];
    for (const viewport of viewports) {
      viewportResults.push(await validateViewport(page, target, viewport));
    }
    const zoomResults = [];
    for (const level of zoomLevels) zoomResults.push(await validateZoom(page, level));
    await context.close();
    const deviceScaleResults = [];
    for (const factor of deviceScaleFactors) {
      deviceScaleResults.push(await validateDeviceScaleFactor(browser, factor));
    }
    report.browsers.push({
      browser: target.name,
      deviceScaleResults,
      noJavaScript,
      viewportResults,
      zoomResults,
    });
  } finally {
    await browser.close();
  }
}

const allFailures = report.browsers.flatMap((browser) => [
  ...(browser.noJavaScript.passed ? [] : ["no-JavaScript fallback"]),
  ...browser.viewportResults.flatMap((result) => result.failures),
  ...browser.zoomResults.flatMap((result) => result.failures),
  ...browser.deviceScaleResults.flatMap((result) => result.failures),
]);
const summary = {
  passed: allFailures.length === 0,
  failures: [...new Set(allFailures)],
  maximumDeltaByBrowser: Object.fromEntries(
    report.browsers.map((browser) => [
      browser.browser,
      Math.max(
        ...browser.viewportResults.map((result) => result.maximumDelta),
        ...browser.zoomResults.map((result) => result.maximumDelta),
        ...browser.deviceScaleResults.map((result) => result.maximumDelta),
      ),
    ]),
  ),
  maximumDeltaByViewport: Object.fromEntries(
    viewports.map((viewport) => [
      `${viewport.width}x${viewport.height}`,
      Math.max(
        ...report.browsers.flatMap((browser) =>
          browser.viewportResults
            .filter(
              (result) =>
                result.viewport.width === viewport.width &&
                result.viewport.height === viewport.height,
            )
            .map((result) => result.maximumDelta),
        ),
      ),
    ]),
  ),
};
fs.writeFileSync(
  REPORT_PATH,
  `${JSON.stringify({ ...report, summary }, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
if (!summary.passed) process.exitCode = 1;
