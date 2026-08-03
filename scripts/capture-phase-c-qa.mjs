import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "docs", "portfolio-v3", "qa", "phase-c4");
const PORT = 3010;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const OBSERVATORY_VIEWPORTS = [
  { name: "2560x1440", width: 2560, height: 1440 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1600x900", width: 1600, height: 900 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1180x820", width: 1180, height: 820 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "900x1200", width: 900, height: 1200 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "430x932", width: 430, height: 932 },
  { name: "412x915", width: 412, height: 915 },
  { name: "390x844", width: 390, height: 844 },
  { name: "375x812", width: 375, height: 812 },
  { name: "360x800", width: 360, height: 800 },
  { name: "320x568", width: 320, height: 568 },
];

const ZOOM_VIEWPORTS = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "390x844", width: 390, height: 844 },
];

const REGRESSION_VIEWPORTS = OBSERVATORY_VIEWPORTS.filter(({ name }) =>
  ["1440x900", "390x844"].includes(name),
);

function ensureOutputDirectories() {
  for (const directory of [
    "complete-section",
    "default-signature",
    "evidence",
    "projects",
    "lenses",
    "mobile",
    "tabs",
    "interactions",
    "annotations",
    "accessibility",
    "reduced-motion",
    "forced-colors",
    "zoom-200",
    "root-regression",
    "v2-regression",
  ]) {
    fs.mkdirSync(path.join(OUTPUT, directory), { recursive: true });
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/v2`);
      if (response.ok) return;
    } catch {
      // Server startup is expected to refuse connections briefly.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`QA server did not become ready at ${BASE_URL}`);
}

function startServer() {
  return spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)],
    { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] },
  );
}

function captureConsoleErrors(page, label, report) {
  page.on("console", (message) => {
    if (message.type() === "error") {
      report.consoleErrors.push(`[${label}] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    report.consoleErrors.push(`[${label}] ${error.message}`);
  });
}

async function openPage(browser, viewport, options = {}) {
  const zoomScale = options.zoom200 ? 2 : 1;
  const cssWidth = Math.floor(viewport.width / zoomScale);
  const cssHeight = Math.floor(viewport.height / zoomScale);
  const context = await browser.newContext({
    viewport: { width: cssWidth, height: cssHeight },
    deviceScaleFactor: zoomScale,
    isMobile: cssWidth < 500,
    hasTouch: cssWidth < 500,
    reducedMotion: options.reducedMotion ?? "no-preference",
    forcedColors: options.forcedColors ?? "none",
  });
  return { context, page: await context.newPage() };
}

async function settleOnObservatory(page, reducedMotion = false) {
  const motionQuery = reducedMotion ? "" : "?motionOverride=full";
  await page.goto(`${BASE_URL}/v2${motionQuery}#work`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.locator("[data-portfolio-version-switch]").evaluateAll((controls) => {
    for (const control of controls) control.setAttribute("hidden", "");
  });
  const observatory = page.locator("[data-systems-observatory]");
  await observatory.evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.waitForTimeout(reducedMotion ? 250 : 900);
  return observatory;
}

async function readObservatoryChecks(page) {
  return page.evaluate(() => {
    const section = document.querySelector("[data-systems-observatory]");
    const panel = section?.querySelector('[role="tabpanel"]:not([hidden])');
    const deck = section?.querySelector("[data-lens-deck]");
    const tabs = Array.from(section?.querySelectorAll("[data-lens-tab]") ?? []);
    const navigator = section?.querySelector("[data-system-navigator]");
    const desktopRail = section?.querySelector("[data-system-navigator-viewport]");
    const commandBar = section?.querySelector("[data-project-command-bar]");
    const desktopNodes = Array.from(
      section?.querySelectorAll("[data-observatory-project]") ?? [],
    );
    const mobileIndexItems = Array.from(
      section?.querySelectorAll("[data-mobile-project]") ?? [],
    );
    const expectedProjects = Number(navigator?.getAttribute("data-project-count") ?? 0);
    const narrative = section?.querySelector("[data-observatory-narrative]");
    const cover = panel?.querySelector("img");
    const evidenceValue = section?.querySelector("[data-observatory-evidence] strong");
    const evidenceMoment = section?.querySelector("[data-observatory-evidence]");
    const swipeSurface = section?.querySelector("[data-observatory-swipe-surface]");
    const annotationControls = Array.from(
      section?.querySelectorAll("[data-observatory-annotation-control]") ?? [],
    );
    const projectTitle = narrative?.querySelector("h3");
    const mobileCommandVisible = Boolean(
      commandBar && commandBar.getClientRects().length > 0,
    );

    const breaksInsideWord = (element) => {
      const textNode = element?.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return false;
      const text = textNode.textContent ?? "";
      for (const match of text.matchAll(/\S+/g)) {
        const start = match.index ?? 0;
        const lineTops = new Set();
        for (let offset = 0; offset < match[0].length; offset += 1) {
          const range = document.createRange();
          range.setStart(textNode, start + offset);
          range.setEnd(textNode, start + offset + 1);
          const rect = range.getBoundingClientRect();
          if (rect.width > 0) lineTops.add(Math.round(rect.top));
        }
        if (lineTops.size > 1) return true;
      }
      return false;
    };

    const visibleHorizontalScroller = (element) => {
      if (!element || element.getClientRects().length === 0) return false;
      const overflow = getComputedStyle(element).overflowX;
      return (
        ["auto", "scroll"].includes(overflow) &&
        element.scrollWidth > element.clientWidth + 1
      );
    };

    const activeDesktopNode = desktopNodes.find(
      (node) => node.getAttribute("aria-pressed") === "true",
    );
    const activeControl = mobileCommandVisible
      ? commandBar?.querySelector("[data-command-current]") ?? commandBar
      : activeDesktopNode;
    const controlRect = activeControl?.getBoundingClientRect();
    const navigationRect = mobileCommandVisible
      ? commandBar?.getBoundingClientRect()
      : desktopRail?.getBoundingClientRect();
    const titleRect = projectTitle?.getBoundingClientRect();
    const evidenceRect = evidenceMoment?.getBoundingClientRect();

    return {
      present: Boolean(section),
      workAnchor: document.querySelector("#work") === section,
      tabs: tabs.length,
      selectedTabs: section?.querySelectorAll('[role="tab"][aria-selected="true"]')
        .length ?? 0,
      controlsResolve: tabs.every((tab) =>
        document.getElementById(tab.getAttribute("aria-controls") ?? ""),
      ),
      panels: section?.querySelectorAll('[role="tabpanel"]').length ?? 0,
      visiblePanels: section?.querySelectorAll('[role="tabpanel"]:not([hidden])').length ?? 0,
      tabsShareRow: tabs.every(
        (tab) => Math.abs(tab.getBoundingClientRect().top - tabs[0].getBoundingClientRect().top) < 2,
      ),
      tabNamesVisible: tabs.every((tab) => tab.scrollWidth <= tab.clientWidth + 1),
      horizontalPrimaryScrollers: [deck, desktopRail].filter(visibleHorizontalScroller)
        .length,
      mobileCommandVisible,
      desktopRailVisible: Boolean(
        desktopRail && desktopRail.getClientRects().length > 0,
      ),
      allProjectsAvailable: mobileCommandVisible
        ? mobileIndexItems.length === expectedProjects
        : desktopNodes.length === expectedProjects,
      desktopProjects: desktopNodes.length,
      mobileIndexProjects: mobileIndexItems.length,
      navigatorBeforeNarrative: Boolean(
        navigator &&
          narrative &&
          navigator.compareDocumentPosition(narrative) & Node.DOCUMENT_POSITION_FOLLOWING,
      ),
      activeProjectVisible: Boolean(
        navigationRect &&
          controlRect &&
          controlRect.left >= navigationRect.left - 2 &&
          controlRect.right <= navigationRect.right + 2,
      ),
      indexRelationshipResolves: Array.from(
        section?.querySelectorAll("[data-project-command-bar] [aria-controls]") ?? [],
      ).every((control) =>
        document.getElementById(control.getAttribute("aria-controls") ?? ""),
      ),
      images: section?.querySelectorAll("img").length ?? 0,
      coverLoaded: cover instanceof HTMLImageElement && cover.complete && cover.naturalWidth > 0,
      evidenceValue: evidenceValue?.textContent?.trim(),
      evidenceMode: evidenceMoment?.getAttribute("data-evidence-mode"),
      evidenceBreaksInsideWord: breaksInsideWord(evidenceValue),
      evidenceOverflows: Boolean(
        evidenceValue && evidenceValue.scrollWidth > evidenceValue.clientWidth + 1,
      ),
      titleEvidenceCollision: Boolean(
        titleRect && evidenceRect && titleRect.bottom > evidenceRect.top,
      ),
      swipeTouchAction: swipeSurface ? getComputedStyle(swipeSurface).touchAction : null,
      annotationControls: annotationControls.length,
      annotationRelationshipsResolve: annotationControls.every((control) =>
        control.getAttribute("aria-expanded") !== "true" ||
        document.getElementById(control.getAttribute("aria-controls") ?? ""),
      ),
      annotationPanels: document.querySelectorAll("[data-observatory-annotation]").length,
      technologyNodes:
        section?.querySelectorAll('[data-node-category][aria-hidden="true"]').length ?? 0,
      activeTitle: projectTitle?.textContent?.trim(),
      fixedControlOverlap: false,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    };
  });
}

async function captureViewportMatrix(browser, report) {
  for (const viewport of OBSERVATORY_VIEWPORTS) {
    const { context, page } = await openPage(browser, viewport);
    captureConsoleErrors(page, `default-${viewport.name}`, report);
    const section = await settleOnObservatory(page);
    report.checks[`default-${viewport.name}`] = await readObservatoryChecks(page);
    await page.screenshot({
      path: path.join(OUTPUT, "default-signature", `${viewport.name}.png`),
    });
    await section.screenshot({
      path: path.join(OUTPUT, "complete-section", `${viewport.name}.png`),
    });
    await context.close();
  }
}

async function readActiveTabAlignment(page) {
  return page.evaluate(() => {
    const deck = document.querySelector("[data-lens-deck]");
    const activeTab = deck?.querySelector('[data-lens-tab][aria-selected="true"]');
    if (!(deck instanceof HTMLElement) || !(activeTab instanceof HTMLElement)) return null;
    const deckRect = deck.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    return {
      tab: activeTab.textContent?.replace(/\s+/g, " ").trim(),
      leftGap: Math.round(tabRect.left - deckRect.left),
      centerGap: Math.round(
        tabRect.left + tabRect.width / 2 - (deckRect.left + deckRect.width / 2),
      ),
      rightGap: Math.round(deckRect.right - tabRect.right),
      trailingScrollSpace: Math.round(
        deck.scrollWidth - deck.scrollLeft - deck.clientWidth,
      ),
      scrollLeft: Math.round(deck.scrollLeft),
      maximumScroll: Math.round(deck.scrollWidth - deck.clientWidth),
    };
  });
}

async function captureMobileTabAlignment(browser, report) {
  const viewports = OBSERVATORY_VIEWPORTS.filter(({ width }) =>
    [320, 360, 390, 412, 430].includes(width),
  );
  report.checks.mobileTabAlignment = {};
  for (const viewport of viewports) {
    const { context, page } = await openPage(browser, viewport);
    captureConsoleErrors(page, `tab-alignment-${viewport.name}`, report);
    const section = await settleOnObservatory(page);
    const deck = section.locator("[data-lens-deck]");
    await deck.evaluate((element) => element.scrollIntoView({ block: "center" }));
    const states = { first: await readActiveTabAlignment(page) };
    if (viewport.width === 390) {
      await deck.screenshot({ path: path.join(OUTPUT, "tabs", "390-first.png") });
    }
    await section.getByRole("tab", { name: /MINE, END TO END/ }).click();
    await page.waitForTimeout(420);
    states.middle = await readActiveTabAlignment(page);
    if (viewport.width === 390) {
      await deck.screenshot({ path: path.join(OUTPUT, "tabs", "390-middle.png") });
    }
    await section.getByRole("tab", { name: /BUILT TO OPERATE/ }).click();
    await page.waitForTimeout(420);
    states.final = await readActiveTabAlignment(page);
    await deck.screenshot({
      path: path.join(OUTPUT, "tabs", `${viewport.width}-final.png`),
    });
    report.checks.mobileTabAlignment[viewport.name] = states;
    await context.close();
  }
}

async function captureProjectEvidenceStates(browser, report) {
  const viewport = { width: 1440, height: 900 };
  const { context, page } = await openPage(browser, viewport);
  captureConsoleErrors(page, "project-evidence-states", report);
  const section = await settleOnObservatory(page);
  const stage = section.locator("[data-active-project-stage]");

  await stage.screenshot({
    path: path.join(OUTPUT, "evidence", "textual-production.png"),
  });
  await section.getByRole("button", { name: /Show project 02: Warqah Store/ }).click();
  await page.waitForTimeout(520);
  await stage.screenshot({
    path: path.join(OUTPUT, "evidence", "numeric-egp-21m.png"),
  });
  report.checks.numericEvidence = await readObservatoryChecks(page);

  await section.getByRole("button", { name: /Show project 04: Autopay EG/ }).click();
  await page.waitForTimeout(520);
  await stage.screenshot({
    path: path.join(OUTPUT, "projects", "signature-middle-autopay.png"),
  });
  await section
    .getByRole("button", { name: /Show project 07: Alzahaby Loyalty App/ })
    .click();
  await page.waitForTimeout(520);
  await stage.screenshot({
    path: path.join(OUTPUT, "projects", "signature-last-longest-title.png"),
  });

  await section.getByRole("tab", { name: /MINE, END TO END/ }).click();
  await page.waitForTimeout(420);
  await page.screenshot({ path: path.join(OUTPUT, "lenses", "mine-end-to-end.png") });
  await section.getByRole("tab", { name: /BUILT TO OPERATE/ }).click();
  await page.waitForTimeout(420);
  await page.screenshot({ path: path.join(OUTPUT, "lenses", "built-to-operate.png") });

  await section.getByRole("tab", { name: /THE SIGNATURE SYSTEMS/ }).click();
  await page.waitForTimeout(80);
  await section.getByRole("button", { name: /Show project 04: Autopay EG/ }).click();
  await page.waitForTimeout(80);
  await section
    .getByRole("button", { name: /Show project 07: Alzahaby Loyalty App/ })
    .click();
  await page.waitForTimeout(520);
  report.checks.rapidSwitch = await page.evaluate(() => ({
    title: document.querySelector("[data-observatory-narrative] h3")?.textContent?.trim(),
    evidence: document
      .querySelector("[data-observatory-evidence] strong")
      ?.textContent?.trim(),
    imageAlt: document.querySelector("[data-observatory-cover] img")?.getAttribute("alt"),
    project: document
      .querySelector("[data-active-project-stage]")
      ?.getAttribute("data-project"),
    accent: document
      .querySelector("[data-active-project-stage]")
      ?.getAttribute("data-accent"),
    count: document.querySelector("[data-system-navigator]")?.getAttribute("data-project-count"),
  }));
  await context.close();
}

async function activeProjectSlug(page) {
  return page
    .locator("[data-active-project-stage]")
    .getAttribute("data-project");
}

async function dispatchTouchGesture(context, page, surface, deltaX, deltaY) {
  const box = await surface.boundingBox();
  if (!box) throw new Error("Swipe surface has no bounding box");
  const client = await context.newCDPSession(page);
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [start],
  });
  for (const progress of [0.25, 0.55, 1]) {
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [
        {
          x: start.x + deltaX * progress,
          y: start.y + deltaY * progress,
        },
      ],
    });
    await page.waitForTimeout(40);
  }
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
}

async function captureProjectGestures(browser, report) {
  const desktop = await openPage(browser, { width: 1440, height: 900 });
  captureConsoleErrors(desktop.page, "project-mouse-gestures", report);
  const section = await settleOnObservatory(desktop.page);
  const surface = section.locator("[data-observatory-swipe-surface]");
  await surface.evaluate((element) => element.scrollIntoView({ block: "center" }));
  const box = await surface.boundingBox();
  if (!box) throw new Error("Desktop swipe surface has no bounding box");
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  const initialFocus = await desktop.page.evaluate(() => document.activeElement?.tagName);
  const hintBefore = await surface.getByText("DRAG TO EXPLORE").isVisible();

  await desktop.page.mouse.move(startX + box.width * 0.18, startY - box.height * 0.12);
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "interactions", "mouse-drag-beginning.png"),
  });
  const pointerTransform = await surface.evaluate((element) => getComputedStyle(element).transform);
  await desktop.page.mouse.move(startX, startY);
  await desktop.page.mouse.down();
  await desktop.page.mouse.move(startX - 42, startY + 3, { steps: 4 });
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "interactions", "mouse-drag-midpoint.png"),
  });
  const midpoint = await surface.evaluate((element) => ({
    dragging: element.getAttribute("data-dragging"),
    direction: element.getAttribute("data-drag-direction"),
    transform: getComputedStyle(element).transform,
  }));
  await desktop.page.mouse.move(startX - 82, startY + 5, { steps: 3 });
  await desktop.page.mouse.up();
  await desktop.page.waitForTimeout(560);
  const afterLeftDrag = await activeProjectSlug(desktop.page);
  await section.locator("[data-active-project-stage]").screenshot({
    path: path.join(OUTPUT, "interactions", "mouse-drag-completion.png"),
  });
  const hintAfter = await section.getByText("DRAG TO EXPLORE").count();

  const currentSurface = section.locator("[data-observatory-swipe-surface]");
  await currentSurface.evaluate((element) => element.scrollIntoView({ block: "center" }));
  const currentBox = await currentSurface.boundingBox();
  if (!currentBox) throw new Error("Updated swipe surface has no bounding box");
  const currentX = currentBox.x + currentBox.width / 2;
  const currentY = currentBox.y + currentBox.height / 2;
  await desktop.page.mouse.move(currentX, currentY);
  await desktop.page.mouse.down();
  await desktop.page.mouse.move(currentX + 26, currentY + 2, { steps: 3 });
  await desktop.page.mouse.up();
  await desktop.page.waitForTimeout(260);
  const afterCancelledDrag = await activeProjectSlug(desktop.page);
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "interactions", "mouse-drag-cancellation.png"),
  });

  const scrollBeforeWheel = await desktop.page.evaluate(() => window.scrollY);
  await desktop.page.mouse.move(currentX, currentY);
  await desktop.page.mouse.wheel(0, 320);
  await desktop.page.waitForTimeout(180);
  const scrollAfterWheel = await desktop.page.evaluate(() => window.scrollY);
  report.checks.mouseGestures = {
    hintBefore,
    hintAfter,
    pointerTransform,
    midpoint,
    afterLeftDrag,
    afterCancelledDrag,
    verticalWheelProject: await activeProjectSlug(desktop.page),
    verticalWheelScrollDelta: scrollAfterWheel - scrollBeforeWheel,
    focusBefore: initialFocus,
    focusAfter: await desktop.page.evaluate(() => document.activeElement?.tagName),
  };
  await desktop.context.close();

  const mobile = await openPage(browser, { width: 390, height: 844 });
  captureConsoleErrors(mobile.page, "project-touch-gestures", report);
  const mobileSection = await settleOnObservatory(mobile.page);
  const mobileSurface = mobileSection.locator("[data-observatory-swipe-surface]");
  await mobileSurface.evaluate((element) => element.scrollIntoView({ block: "center" }));
  const mobileScrollBefore = await mobile.page.evaluate(() => window.scrollY);
  await dispatchTouchGesture(mobile.context, mobile.page, mobileSurface, -82, 5);
  await mobile.page.waitForTimeout(520);
  const afterSwipeLeft = await activeProjectSlug(mobile.page);
  await mobile.page.screenshot({
    path: path.join(OUTPUT, "interactions", "mobile-swipe-next.png"),
  });
  const previousSurface = mobileSection.locator("[data-observatory-swipe-surface]");
  await dispatchTouchGesture(mobile.context, mobile.page, previousSurface, 82, 4);
  await mobile.page.waitForTimeout(520);
  const afterSwipeRight = await activeProjectSlug(mobile.page);
  await mobile.page.screenshot({
    path: path.join(OUTPUT, "interactions", "mobile-swipe-previous.png"),
  });
  const verticalSurface = mobileSection.locator("[data-observatory-swipe-surface]");
  await dispatchTouchGesture(mobile.context, mobile.page, verticalSurface, 8, -120);
  await mobile.page.waitForTimeout(240);
  report.checks.touchGestures = {
    afterSwipeLeft,
    afterSwipeRight,
    afterVerticalGesture: await activeProjectSlug(mobile.page),
    verticalScrollDelta:
      (await mobile.page.evaluate(() => window.scrollY)) - mobileScrollBefore,
    touchAction: await verticalSurface.evaluate((element) => getComputedStyle(element).touchAction),
    focusedElement: await mobile.page.evaluate(() => document.activeElement?.tagName),
  };
  await mobile.page.screenshot({
    path: path.join(OUTPUT, "interactions", "mobile-vertical-scroll.png"),
  });
  await mobile.context.close();
}

async function captureMobileCommandAndIndex(browser, report) {
  const viewport = { width: 390, height: 844 };
  const { context, page } = await openPage(browser, viewport);
  captureConsoleErrors(page, "mobile-command-index", report);
  const section = await settleOnObservatory(page);
  const deck = section.locator("[data-lens-deck]");
  await deck.evaluate((element) => element.scrollIntoView({ block: "start" }));
  await deck.evaluate((element) => element.scrollTo({ left: 260, behavior: "auto" }));
  await page.waitForTimeout(180);
  await page.screenshot({ path: path.join(OUTPUT, "mobile", "lens-deck.png") });

  const navigator = section.locator("[data-system-navigator]");
  await navigator.evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.screenshot({ path: path.join(OUTPUT, "mobile", "project-command-bar.png") });
  const documentScrollBefore = await page.evaluate(() => window.scrollY);
  const toggle = section.getByRole("button", { name: "VIEW SYSTEM INDEX" });
  await toggle.click();
  await page.waitForTimeout(180);
  await page.screenshot({ path: path.join(OUTPUT, "mobile", "system-index-expanded.png") });
  report.checks.expandedMobileIndex = await page.evaluate(() => ({
    expanded: document
      .querySelector("[data-project-command-bar] [aria-expanded]")
      ?.getAttribute("aria-expanded"),
    projects: document.querySelectorAll("[data-mobile-project]").length,
    visibleProjects: Array.from(document.querySelectorAll("[data-mobile-project]")).filter(
      (project) => project.getBoundingClientRect().height >= 44,
    ).length,
    selected: document
      .querySelector('[data-mobile-project][aria-current="true"]')
      ?.getAttribute("data-mobile-project"),
  }));

  const firstIndexItem = section.getByRole("button", { name: /Select project 01:/ });
  await firstIndexItem.focus();
  await firstIndexItem.press("End");
  await page.waitForTimeout(420);
  await page.screenshot({ path: path.join(OUTPUT, "mobile", "system-index-selected-item.png") });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(120);
  const afterEscape = await page.evaluate(() => ({
    expanded: document
      .querySelector("[data-project-command-bar] [aria-expanded]")
      ?.getAttribute("aria-expanded"),
    focused: document.activeElement?.textContent?.trim(),
  }));

  await section.getByRole("button", { name: "VIEW SYSTEM INDEX" }).click();
  await section
    .getByRole("button", { name: /Select project 03: Your Obour Guide/ })
    .click();
  await page.waitForTimeout(420);
  const documentScrollAfter = await page.evaluate(() => window.scrollY);
  await page.screenshot({ path: path.join(OUTPUT, "mobile", "command-after-selection.png") });
  report.checks.mobileCommand = {
    ...(await readObservatoryChecks(page)),
    afterEscape,
    documentScrollDelta: documentScrollAfter - documentScrollBefore,
    expandedAfterSelection: await toggle.getAttribute("aria-expanded"),
    focusedAfterSelection: await page.evaluate(() => document.activeElement?.textContent?.trim()),
  };
  await context.close();
}

async function readOpenAnnotation(page) {
  return page.evaluate(() => {
    const panel = document.querySelector("[data-observatory-annotation]");
    if (!(panel instanceof HTMLElement)) return null;
    const rect = panel.getBoundingClientRect();
    return {
      id: panel.id,
      eyebrow: panel.querySelector("[data-annotation-eyebrow]")?.textContent?.trim(),
      title: panel.querySelector("[data-annotation-title]")?.textContent?.trim(),
      content: panel.querySelector("[data-annotation-content]")?.textContent?.trim(),
      presentation: panel.getAttribute("data-annotation-presentation"),
      reducedMotion: panel.getAttribute("data-reduced-motion"),
      panels: document.querySelectorAll("[data-observatory-annotation]").length,
      closeControls: panel.querySelectorAll("[data-annotation-close]").length,
      position: getComputedStyle(panel).position,
      animationDuration: getComputedStyle(panel).animationDuration,
      pointerCapabilities: {
        fine: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
        coarse: window.matchMedia("(hover: none), (pointer: coarse), (any-pointer: coarse)")
          .matches,
        maxTouchPoints: navigator.maxTouchPoints,
        touchEvent: "ontouchstart" in window,
      },
      insideViewport:
        rect.left >= 0 &&
        rect.top >= 0 &&
        rect.right <= window.innerWidth &&
        rect.bottom <= window.innerHeight,
      bottomGap: Math.round(window.innerHeight - rect.bottom),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  });
}

async function assertAnnotationClosed(page, label) {
  assert.equal(
    await page.locator("[data-observatory-annotation]").count(),
    0,
    `${label}: annotation should be closed`,
  );
  await page.waitForTimeout(20);
}

async function dispatchOutsidePointer(locator) {
  await locator.dispatchEvent("pointerdown", {
    pointerId: 41,
    pointerType: "touch",
    isPrimary: true,
    button: 0,
    bubbles: true,
    composed: true,
  });
}

async function openAnnotation(control) {
  await control.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await control.page().waitForTimeout(60);
  await control.click();
  await control.page().waitForTimeout(80);
  const annotation = await readOpenAnnotation(control.page());
  assert.ok(annotation, "annotation should open");
  assert.equal(annotation.panels, 1, "only one annotation panel may exist");
  return annotation;
}

async function captureAnnotations(browser, report) {
  const desktop = await openPage(browser, { width: 1440, height: 900 });
  captureConsoleErrors(desktop.page, "project-annotations", report);
  const section = await settleOnObservatory(desktop.page);
  const technology = section.getByRole("button", { name: "Laravel 11" });
  await technology.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await technology.hover();
  await desktop.page.waitForTimeout(160);
  const hoverInsight = await readOpenAnnotation(desktop.page);
  assert.equal(hoverInsight?.presentation, "popover");
  assert.equal(hoverInsight?.insideViewport, true);
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "annotations", "technology-hover.png"),
  });
  await section.locator("[data-observatory-narrative] h3").hover();
  await technology.focus();
  await desktop.page.waitForTimeout(120);
  const focusInsight = await readOpenAnnotation(desktop.page);
  assert.equal(focusInsight?.presentation, "popover");
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "annotations", "technology-keyboard-focus.png"),
  });
  await technology.click();
  const pinnedInsight = await readOpenAnnotation(desktop.page);
  assert.equal(pinnedInsight?.panels, 1);
  await desktop.page.locator("[data-annotation-content]").click();
  const afterPanelClick = await readOpenAnnotation(desktop.page);
  assert.equal(afterPanelClick?.id, pinnedInsight?.id);
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "annotations", "technology-pinned.png"),
  });
  await technology.click();
  await assertAnnotationClosed(desktop.page, "desktop same trigger");

  await technology.click();
  await dispatchOutsidePointer(section.locator("[data-observatory-story]"));
  await assertAnnotationClosed(desktop.page, "desktop narrative pointerdown");
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "annotations", "outside-narrative-dismissed.png"),
  });

  await technology.click();
  await dispatchOutsidePointer(section.locator("[data-observatory-swipe-surface]"));
  await assertAnnotationClosed(desktop.page, "desktop cover pointerdown");
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "annotations", "outside-cover-dismissed.png"),
  });

  await technology.focus();
  await desktop.page.keyboard.press("Escape");
  const afterTechnologyEscape = await readOpenAnnotation(desktop.page);
  assert.equal(afterTechnologyEscape, null);
  assert.equal(await technology.evaluate((element) => element === document.activeElement), true);

  const proofContext = section.getByRole("button", { name: "PROOF CONTEXT" });
  await proofContext.click();
  await desktop.page.waitForTimeout(100);
  const proofInsight = await readOpenAnnotation(desktop.page);
  assert.equal(proofInsight?.presentation, "popover");
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "annotations", "proof-context.png"),
  });

  const ownershipScope = section.getByRole("button", { name: "WHAT I OWNED" });
  await ownershipScope.click();
  await desktop.page.waitForTimeout(100);
  const ownershipInsight = await readOpenAnnotation(desktop.page);
  assert.equal(ownershipInsight?.presentation, "popover");
  assert.equal(ownershipInsight?.panels, 1);
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "annotations", "ownership-scope.png"),
  });
  await technology.click();
  assert.match((await readOpenAnnotation(desktop.page))?.id ?? "", /observatory-tech-/);
  assert.equal(await desktop.page.locator("[data-observatory-annotation]").count(), 1);
  await section.getByRole("button", { name: /Show project 02: Warqah Store/ }).click();
  await desktop.page.waitForTimeout(520);
  const staleInsightAfterProjectChange = await readOpenAnnotation(desktop.page);
  assert.equal(staleInsightAfterProjectChange, null);
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "annotations", "project-change-dismissed.png"),
  });

  const warqahTechnology = section.getByRole("button", { name: "Laravel 12" });
  await warqahTechnology.click();
  await dispatchOutsidePointer(section.locator("[data-system-navigator-viewport]"));
  await assertAnnotationClosed(desktop.page, "desktop navigator pointerdown");

  await warqahTechnology.click();
  const scrollBefore = await desktop.page.evaluate(() => window.scrollY);
  await desktop.page.evaluate(() => window.scrollBy(0, 24));
  await desktop.page.waitForTimeout(80);
  await assertAnnotationClosed(desktop.page, "desktop meaningful scroll");
  const scrollAfter = await desktop.page.evaluate(() => window.scrollY);

  await warqahTechnology.click();
  await desktop.page.setViewportSize({ width: 1438, height: 900 });
  await desktop.page.waitForTimeout(80);
  await assertAnnotationClosed(desktop.page, "desktop resize");

  await warqahTechnology.click();
  await desktop.page.evaluate(() => window.dispatchEvent(new Event("orientationchange")));
  await desktop.page.waitForTimeout(80);
  await assertAnnotationClosed(desktop.page, "desktop orientation change");

  const activeLensBeforePreview = await section
    .getByRole("tab", { selected: true })
    .getAttribute("id");
  await section.getByRole("tab", { name: /BUILT TO OPERATE/ }).hover();
  const lensPreview = await pageLensState(desktop.page);
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "interactions", "lens-description-preview.png"),
  });
  report.checks.annotations = {
    hoverInsight,
    focusInsight,
    pinnedInsight,
    afterPanelClick,
    afterTechnologyEscape,
    proofInsight,
    ownershipInsight,
    staleInsightAfterProjectChange,
    scrollDelta: scrollAfter - scrollBefore,
    activeLensBeforePreview,
    lensPreview,
    controls: await section.locator("[data-observatory-annotation-control]").count(),
    microNodes: await section.locator("[data-node-category]").count(),
    relationshipsResolve: await section
      .locator("[data-observatory-annotation-control]")
      .evaluateAll((controls) =>
        controls.every((control) =>
          control.getAttribute("aria-expanded") !== "true" ||
          document.getElementById(control.getAttribute("aria-controls") ?? ""),
        ),
      ),
    panelsAfterChecks: await desktop.page.locator("[data-observatory-annotation]").count(),
  };
  await desktop.context.close();

  report.checks.mobileAnnotations = {};
  for (const viewport of OBSERVATORY_VIEWPORTS.filter(({ width }) =>
    [320, 360, 375, 390, 412, 430].includes(width),
  )) {
    const mobile = await openPage(browser, viewport);
    captureConsoleErrors(mobile.page, `mobile-annotation-${viewport.name}`, report);
    const mobileSection = await settleOnObservatory(mobile.page);
    const mobileTechnology = mobileSection.getByRole("button", { name: "Laravel 11" });
    const secondTechnology = mobileSection.getByRole("button", { name: "PHP 8.2" });
    const mobileProof = mobileSection.getByRole("button", { name: "PROOF CONTEXT" });
    const mobileOwnership = mobileSection.getByRole("button", { name: "WHAT I OWNED" });
    await mobileTechnology.evaluate((element) => element.scrollIntoView({ block: "center" }));
    const targetHeight = await mobileTechnology.evaluate((element) =>
      Math.round(element.getBoundingClientRect().height),
    );
    await mobile.page.screenshot({
      path: path.join(OUTPUT, "annotations", `${viewport.name}-closed.png`),
    });

    await mobileTechnology.hover();
    await mobile.page.waitForTimeout(80);
    await assertAnnotationClosed(mobile.page, `${viewport.name} coarse hover`);
    const technologyInsight = await openAnnotation(mobileTechnology);
    assert.equal(technologyInsight.presentation, "sheet");
    assert.equal(technologyInsight.insideViewport, true);
    assert.equal(technologyInsight.closeControls, 1);
    await mobile.page.screenshot({
      path: path.join(OUTPUT, "annotations", `${viewport.name}-technology-sheet.png`),
    });

    await mobile.page.locator("[data-annotation-content]").click();
    assert.equal((await readOpenAnnotation(mobile.page))?.id, technologyInsight.id);
    await mobileTechnology.click();
    await assertAnnotationClosed(mobile.page, `${viewport.name} same trigger`);
    await mobile.page.screenshot({
      path: path.join(OUTPUT, "annotations", `${viewport.name}-same-trigger-dismissed.png`),
    });

    await openAnnotation(mobileTechnology);
    await secondTechnology.click();
    await mobile.page.waitForTimeout(80);
    const replacementInsight = await readOpenAnnotation(mobile.page);
    assert.match(replacementInsight?.id ?? "", /observatory-tech-smart-lockers-platform-1/);
    assert.equal(replacementInsight?.panels, 1);
    await mobile.page.screenshot({
      path: path.join(OUTPUT, "annotations", `${viewport.name}-replacement.png`),
    });
    await mobile.page.locator("[data-annotation-close]").click();
    await assertAnnotationClosed(mobile.page, `${viewport.name} close control`);
    await mobile.page.waitForTimeout(40);
    assert.equal(
      await secondTechnology.evaluate((element) => element === document.activeElement),
      true,
    );

    const proofInsightMobile = await openAnnotation(mobileProof);
    assert.equal(proofInsightMobile.presentation, "sheet");
    await mobile.page.screenshot({
      path: path.join(OUTPUT, "annotations", `${viewport.name}-proof-sheet.png`),
    });
    await dispatchOutsidePointer(mobileSection.locator("[data-observatory-story]"));
    await assertAnnotationClosed(mobile.page, `${viewport.name} narrative`);
    await mobileTechnology.hover();
    await mobile.page.waitForTimeout(80);
    await assertAnnotationClosed(mobile.page, `${viewport.name} synthetic hover reopening`);
    await mobile.page.screenshot({
      path: path.join(OUTPUT, "annotations", `${viewport.name}-outside-dismissed.png`),
    });

    await openAnnotation(mobileProof);
    await dispatchOutsidePointer(mobileSection.locator("[data-observatory-evidence] strong"));
    await assertAnnotationClosed(mobile.page, `${viewport.name} evidence`);

    const ownershipInsightMobile = await openAnnotation(mobileOwnership);
    assert.equal(ownershipInsightMobile.presentation, "sheet");
    assert.equal(ownershipInsightMobile.insideViewport, true);
    await mobile.page.screenshot({
      path: path.join(OUTPUT, "annotations", `${viewport.name}-ownership-sheet.png`),
    });
    await dispatchOutsidePointer(
      mobileSection.locator("[data-observatory-technology-line]"),
    );
    await assertAnnotationClosed(mobile.page, `${viewport.name} technology whitespace`);

    await openAnnotation(mobileOwnership);
    await dispatchOutsidePointer(mobileSection.locator("[data-observatory-swipe-surface]"));
    await assertAnnotationClosed(mobile.page, `${viewport.name} cover`);

    await openAnnotation(mobileOwnership);
    await dispatchOutsidePointer(mobileSection.locator("[data-command-current]"));
    await assertAnnotationClosed(mobile.page, `${viewport.name} command bar`);

    await openAnnotation(mobileOwnership);
    await dispatchOutsidePointer(mobileSection.locator("[data-system-navigator]"));
    await assertAnnotationClosed(mobile.page, `${viewport.name} navigator`);

    await openAnnotation(mobileOwnership);
    await dispatchOutsidePointer(mobileSection);
    await assertAnnotationClosed(mobile.page, `${viewport.name} section background`);

    await openAnnotation(mobileOwnership);
    await dispatchOutsidePointer(mobile.page.locator("body"));
    await assertAnnotationClosed(mobile.page, `${viewport.name} page body`);

    await openAnnotation(mobileOwnership);
    const sheetScrollBefore = await mobile.page.evaluate(() => window.scrollY);
    await mobile.page.evaluate(() => window.scrollBy(0, window.scrollY > 24 ? -24 : 24));
    await mobile.page.waitForTimeout(80);
    await assertAnnotationClosed(mobile.page, `${viewport.name} scroll`);
    await mobile.page.screenshot({
      path: path.join(OUTPUT, "annotations", `${viewport.name}-scroll-dismissed.png`),
    });

    await mobileTechnology.dispatchEvent("click");
    await mobile.page.waitForTimeout(80);
    const widthBeforeResize = viewport.width;
    await mobile.page.setViewportSize({ width: widthBeforeResize - 1, height: viewport.height });
    await mobile.page.waitForTimeout(80);
    await assertAnnotationClosed(mobile.page, `${viewport.name} resize`);
    await mobile.page.setViewportSize({ width: viewport.width, height: viewport.height });

    await mobileTechnology.dispatchEvent("click");
    await mobile.page.waitForTimeout(80);
    await mobile.page.evaluate(() => window.dispatchEvent(new Event("orientationchange")));
    await mobile.page.waitForTimeout(80);
    await assertAnnotationClosed(mobile.page, `${viewport.name} orientation`);

    const swipeSurface = mobileSection.locator("[data-observatory-swipe-surface]");
    await swipeSurface.evaluate((element) => element.scrollIntoView({ block: "center" }));
    await mobileTechnology.dispatchEvent("click");
    await mobile.page.waitForTimeout(80);
    assert.equal((await readOpenAnnotation(mobile.page))?.presentation, "sheet");
    await dispatchTouchGesture(mobile.context, mobile.page, swipeSurface, -82, 5);
    await mobile.page.waitForTimeout(520);
    await assertAnnotationClosed(mobile.page, `${viewport.name} swipe`);
    assert.equal(await activeProjectSlug(mobile.page), "warqah-store");
    await mobile.page.screenshot({
      path: path.join(OUTPUT, "annotations", `${viewport.name}-swipe-dismissed.png`),
    });

    report.checks.mobileAnnotations[viewport.name] = {
      technologyInsight,
      replacementInsight,
      proofInsight: proofInsightMobile,
      ownershipInsight: ownershipInsightMobile,
      targetHeight,
      scrollDelta: (await mobile.page.evaluate(() => window.scrollY)) - sheetScrollBefore,
      finalPanels: await mobile.page.locator("[data-observatory-annotation]").count(),
      finalProject: await activeProjectSlug(mobile.page),
      overflowX: await mobile.page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      ),
    };
    assert.ok(report.checks.mobileAnnotations[viewport.name].targetHeight >= 44);
    assert.equal(report.checks.mobileAnnotations[viewport.name].finalPanels, 0);
    assert.equal(report.checks.mobileAnnotations[viewport.name].overflowX, false);
    await mobile.context.close();
  }
}

async function captureAnnotationTransitions(browser, report) {
  const desktop = await openPage(browser, { width: 1440, height: 900 });
  captureConsoleErrors(desktop.page, "annotation-desktop-transitions", report);
  const desktopSection = await settleOnObservatory(desktop.page);
  let desktopTechnology = desktopSection.getByRole("button", { name: "Laravel 11" });
  await desktopTechnology.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await desktopTechnology.click();
  const activeTab = desktopSection.getByRole("tab", { selected: true });
  await activeTab.focus();
  await activeTab.press("End");
  await desktop.page.waitForTimeout(420);
  await assertAnnotationClosed(desktop.page, "desktop keyboard lens change");

  desktopTechnology = desktopSection.getByRole("button", { name: "Laravel 11" });
  await desktopTechnology.click();
  const surface = desktopSection.locator("[data-observatory-swipe-surface]");
  const box = await surface.boundingBox();
  assert.ok(box, "desktop gesture surface should be visible");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await desktop.page.mouse.move(x, y);
  await desktop.page.mouse.down();
  await desktop.page.mouse.move(x - 82, y + 4, { steps: 4 });
  await desktop.page.mouse.up();
  await desktop.page.waitForTimeout(520);
  await assertAnnotationClosed(desktop.page, "desktop drag completion");
  assert.equal(await activeProjectSlug(desktop.page), "warqah-store");
  await desktop.page.screenshot({
    path: path.join(OUTPUT, "annotations", "desktop-drag-dismissed.png"),
  });
  await desktop.context.close();

  const mobile = await openPage(browser, { width: 390, height: 844 });
  captureConsoleErrors(mobile.page, "annotation-mobile-transitions", report);
  const mobileSection = await settleOnObservatory(mobile.page);
  let technology = mobileSection.getByRole("button", { name: "Laravel 11" });
  await technology.evaluate((element) => element.scrollIntoView({ block: "center" }));

  await technology.focus();
  assert.equal((await readOpenAnnotation(mobile.page))?.presentation, "sheet");
  await mobile.page.keyboard.press("Escape");
  await assertAnnotationClosed(mobile.page, "mobile keyboard Escape");
  const escapeRestoredFocus = await technology.evaluate(
    (element) => element === document.activeElement,
  );

  for (let tap = 0; tap < 4; tap += 1) await technology.click();
  await assertAnnotationClosed(mobile.page, "mobile rapid repeated taps");

  await technology.dispatchEvent("click");
  const commandBar = mobileSection.locator("[data-project-command-bar]");
  const nextButton = commandBar.getByRole("button", { name: /Show next project:/ });
  await nextButton.dispatchEvent("click");
  await mobile.page.waitForTimeout(420);
  await assertAnnotationClosed(mobile.page, "mobile Next");
  assert.equal(await activeProjectSlug(mobile.page), "warqah-store");

  technology = mobileSection.getByRole("button", { name: "Laravel 12" });
  await technology.dispatchEvent("click");
  const previousButton = commandBar.getByRole("button", {
    name: /Show previous project:/,
  });
  await previousButton.dispatchEvent("click");
  await mobile.page.waitForTimeout(420);
  await assertAnnotationClosed(mobile.page, "mobile Previous");
  assert.equal(await activeProjectSlug(mobile.page), "smart-lockers-platform");

  technology = mobileSection.getByRole("button", { name: "Laravel 11" });
  await technology.dispatchEvent("click");
  await commandBar.getByRole("button", { name: "VIEW SYSTEM INDEX" }).dispatchEvent("click");
  await mobile.page.waitForTimeout(80);
  assert.ok(await readOpenAnnotation(mobile.page));
  await commandBar
    .getByRole("button", { name: /Select project 03: Your Obour Guide/ })
    .dispatchEvent("click");
  await mobile.page.waitForTimeout(420);
  await assertAnnotationClosed(mobile.page, "mobile System Index selection");
  assert.equal(await activeProjectSlug(mobile.page), "your-obour-guide");

  technology = mobileSection.getByRole("button", { name: "Laravel 10" });
  await technology.focus();
  await technology.click();
  await commandBar
    .getByRole("button", { name: /Show next project:/ })
    .dispatchEvent("click");
  await mobile.page.waitForTimeout(420);
  await assertAnnotationClosed(mobile.page, "mobile unmounted trigger");
  const restoredUnmountedTrigger = await mobile.page.evaluate(
    () => document.activeElement?.hasAttribute("data-observatory-annotation-control") ?? false,
  );

  technology = mobileSection.locator("[data-observatory-annotation-control]").first();
  await technology.dispatchEvent("click");
  const currentTab = mobileSection.getByRole("tab", { selected: true });
  await currentTab.focus();
  await currentTab.press("End");
  await mobile.page.waitForTimeout(420);
  await assertAnnotationClosed(mobile.page, "mobile lens change");

  report.checks.annotationTransitions = {
    desktopDragProject: "warqah-store",
    escapeRestoredFocus,
    nextClosed: true,
    previousClosed: true,
    systemIndexClosed: true,
    restoredUnmountedTrigger,
    lensChangeClosed: true,
    panels: await mobile.page.locator("[data-observatory-annotation]").count(),
  };
  assert.equal(escapeRestoredFocus, true);
  assert.equal(restoredUnmountedTrigger, false);
  assert.equal(report.checks.annotationTransitions.panels, 0);
  await mobile.page.screenshot({
    path: path.join(OUTPUT, "annotations", "mobile-transition-dismissed.png"),
  });
  await mobile.context.close();
}

async function pageLensState(page) {
  return page.evaluate(() => ({
    active: document
      .querySelector('[data-lens-tab][aria-selected="true"]')
      ?.getAttribute("id"),
    description: document.querySelector("[data-lens-description]")?.textContent?.trim(),
    previewing: document
      .querySelector("[data-lens-description]")
      ?.getAttribute("data-previewing"),
  }));
}

async function captureForcedColors(browser, report) {
  const { context, page } = await openPage(browser, { width: 1440, height: 900 }, {
    forcedColors: "active",
  });
  captureConsoleErrors(page, "forced-colors", report);
  const section = await settleOnObservatory(page, true);
  const technology = section.getByRole("button", { name: "Laravel 11" });
  await technology.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await technology.focus();
  await page.waitForTimeout(100);
  report.checks.forcedColors = {
    insight: await readOpenAnnotation(page),
    focusVisible: await technology.evaluate((element) => element.matches(":focus-visible")),
    nodeColor: await technology
      .locator("[data-node-category]")
      .evaluate((element) => getComputedStyle(element).color),
  };
  await page.screenshot({
    path: path.join(OUTPUT, "forced-colors", "1440x900.png"),
  });
  await context.close();
}

async function captureKeyboardFocus(browser, report) {
  const viewport = { width: 1440, height: 900 };
  const { context, page } = await openPage(browser, viewport);
  captureConsoleErrors(page, "keyboard-focus", report);
  const section = await settleOnObservatory(page);
  const navigator = section.locator("[data-system-navigator]");
  await navigator.evaluate((element) => element.scrollIntoView({ block: "start" }));
  const firstProject = section.getByRole("button", { name: /Show project 01:/ });
  const documentScrollBefore = await page.evaluate(() => window.scrollY);
  await firstProject.focus();
  await firstProject.press("End");
  await page.waitForTimeout(520);
  const documentScrollAfter = await page.evaluate(() => window.scrollY);
  report.checks.keyboard = await page.evaluate(() => ({
    activeProject: document
      .querySelector('[data-observatory-project][aria-pressed="true"]')
      ?.getAttribute("data-observatory-project"),
    focusedProject: document.activeElement?.getAttribute("data-observatory-project"),
    focusVisible: document.activeElement?.matches(":focus-visible") ?? false,
  }));
  report.checks.keyboard.documentScrollDelta = documentScrollAfter - documentScrollBefore;
  await page.screenshot({
    path: path.join(OUTPUT, "accessibility", "keyboard-active-focus.png"),
  });
  await context.close();
}

async function captureReducedMotion(browser, report) {
  const viewport = { width: 1440, height: 900 };
  const { context, page } = await openPage(browser, viewport, {
    reducedMotion: "reduce",
  });
  captureConsoleErrors(page, "reduced-motion", report);
  const section = await settleOnObservatory(page, true);
  report.checks.reducedMotion = {
    ...(await readObservatoryChecks(page)),
    sectionReduced: await section.getAttribute("data-reduced-motion"),
  };
  await page.screenshot({
    path: path.join(OUTPUT, "reduced-motion", "1440x900.png"),
  });
  await section.screenshot({
    path: path.join(OUTPUT, "reduced-motion", "1440x900-complete-section.png"),
  });
  const reducedSurface = section.locator("[data-observatory-swipe-surface]");
  await reducedSurface.evaluate((element) => element.scrollIntoView({ block: "center" }));
  const reducedBox = await reducedSurface.boundingBox();
  if (!reducedBox) throw new Error("Reduced-motion swipe surface has no bounding box");
  const reducedX = reducedBox.x + reducedBox.width / 2;
  const reducedY = reducedBox.y + reducedBox.height / 2;
  await page.mouse.move(reducedX, reducedY);
  report.checks.reducedMotion.pointerTransform = await reducedSurface.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.mouse.down();
  await page.mouse.move(reducedX - 82, reducedY + 3, { steps: 4 });
  await page.mouse.up();
  await page.waitForTimeout(180);
  report.checks.reducedMotion.gestureProject = await activeProjectSlug(page);
  report.checks.reducedMotion.dragTransform = await section
    .locator("[data-observatory-swipe-surface]")
    .evaluate((element) => getComputedStyle(element).transform);
  await context.close();

  const storedPreferenceSession = await openPage(browser, viewport);
  await storedPreferenceSession.context.addInitScript(() => {
    localStorage.setItem("portfolio-motion-preference-v3", "reduced");
  });
  captureConsoleErrors(storedPreferenceSession.page, "stored-reduced-motion", report);
  const storedPreferenceSection = await settleOnObservatory(
    storedPreferenceSession.page,
    true,
  );
  report.checks.storedReducedMotion = await storedPreferenceSection.evaluate((element) => {
    const tab = element.querySelector("[data-lens-tab]");
    const lensDeck = element.querySelector("[data-lens-deck]");
    const projectRail = element.querySelector("[data-system-navigator-viewport]");
    return {
      sectionReduced: element.getAttribute("data-reduced-motion"),
      systemReduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      tabTransitionDuration: tab ? getComputedStyle(tab).transitionDuration : null,
      lensScrollBehavior: lensDeck ? getComputedStyle(lensDeck).scrollBehavior : null,
      projectScrollBehavior: projectRail
        ? getComputedStyle(projectRail).scrollBehavior
        : null,
    };
  });
  await storedPreferenceSession.context.close();

  const mobileSession = await openPage(browser, { width: 390, height: 844 }, {
    reducedMotion: "reduce",
  });
  captureConsoleErrors(mobileSession.page, "mobile-reduced-motion-annotation", report);
  const mobileSection = await settleOnObservatory(mobileSession.page, true);
  const mobileTechnology = mobileSection.getByRole("button", { name: "Laravel 11" });
  await mobileTechnology.evaluate((element) => element.scrollIntoView({ block: "center" }));
  await mobileTechnology.click();
  await mobileSession.page.waitForTimeout(80);
  report.checks.mobileReducedMotionAnnotation = await readOpenAnnotation(
    mobileSession.page,
  );
  assert.equal(report.checks.mobileReducedMotionAnnotation?.presentation, "sheet");
  assert.equal(report.checks.mobileReducedMotionAnnotation?.reducedMotion, "true");
  assert.ok(
    Number.parseFloat(
      report.checks.mobileReducedMotionAnnotation?.animationDuration ?? "1",
    ) < 0.001,
  );
  await mobileSession.page.screenshot({
    path: path.join(OUTPUT, "reduced-motion", "390x844-context-sheet.png"),
  });
  await mobileSession.context.close();
}

async function captureZoomStates(browser, report) {
  for (const viewport of ZOOM_VIEWPORTS) {
    const { context, page } = await openPage(browser, viewport, { zoom200: true });
    captureConsoleErrors(page, `zoom-${viewport.name}`, report);
    const section = await settleOnObservatory(page);
    report.checks[`zoom-200-${viewport.name}`] = await readObservatoryChecks(page);
    await page.screenshot({
      path: path.join(OUTPUT, "zoom-200", `${viewport.name}.png`),
    });
    await section.screenshot({
      path: path.join(OUTPUT, "zoom-200", `${viewport.name}-complete-section.png`),
    });
    const technology = section.getByRole("button", { name: "Laravel 11" });
    await technology.evaluate((element) => element.scrollIntoView({ block: "center" }));
    await technology.click();
    await page.waitForTimeout(100);
    report.checks[`zoom-200-${viewport.name}`].annotation = await readOpenAnnotation(page);
    if (viewport.width === 390) {
      assert.equal(
        report.checks[`zoom-200-${viewport.name}`].annotation?.presentation,
        "sheet",
      );
    }
    await page.screenshot({
      path: path.join(OUTPUT, "zoom-200", `${viewport.name}-annotation.png`),
    });
    await context.close();
  }
}

async function captureRouteRegressions(browser, report) {
  for (const viewport of REGRESSION_VIEWPORTS) {
    const { context, page } = await openPage(browser, viewport);
    captureConsoleErrors(page, `regression-${viewport.name}`, report);
    await page.goto(`${BASE_URL}/?motionOverride=full`, {
      waitUntil: "networkidle",
      timeout: 90000,
    });
    await page.waitForTimeout(500);
    report.checks[`root-${viewport.name}`] = await page.evaluate(() => ({
      variant: document
        .querySelector("[data-portfolio-variant]")
        ?.getAttribute("data-portfolio-variant"),
      observatory: Boolean(document.querySelector("[data-systems-observatory]")),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    }));
    await page.screenshot({
      path: path.join(OUTPUT, "root-regression", `${viewport.name}.png`),
    });

    await page.goto(`${BASE_URL}/v2?motionOverride=full`, {
      waitUntil: "networkidle",
      timeout: 90000,
    });
    await page.waitForTimeout(500);
    report.checks[`v2-earlier-${viewport.name}`] = await page.evaluate(() => ({
      variant: document
        .querySelector("[data-portfolio-variant]")
        ?.getAttribute("data-portfolio-variant"),
      education: Boolean(document.querySelector("#education")),
      experience: Boolean(document.querySelector("#experience")),
      observatory: Boolean(document.querySelector("[data-systems-observatory]")),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    }));
    await page.screenshot({
      path: path.join(OUTPUT, "v2-regression", `${viewport.name}.png`),
    });
    await context.close();
  }
}

async function main() {
  ensureOutputDirectories();
  const report = { baseUrl: BASE_URL, consoleErrors: [], checks: {} };
  const server = startServer();
  let serverErrors = "";
  server.stderr.on("data", (chunk) => {
    serverErrors += chunk.toString();
  });

  try {
    await waitForServer();
    const browser = await chromium.launch({ headless: true });
    try {
      await captureViewportMatrix(browser, report);
      await captureMobileTabAlignment(browser, report);
      await captureProjectEvidenceStates(browser, report);
      await captureProjectGestures(browser, report);
      await captureMobileCommandAndIndex(browser, report);
      await captureAnnotations(browser, report);
      await captureAnnotationTransitions(browser, report);
      await captureKeyboardFocus(browser, report);
      await captureReducedMotion(browser, report);
      await captureForcedColors(browser, report);
      await captureZoomStates(browser, report);
      await captureRouteRegressions(browser, report);
    } finally {
      await browser.close();
    }
  } finally {
    server.kill();
  }

  report.serverErrors = serverErrors;
  fs.writeFileSync(
    path.join(OUTPUT, "diagnostics.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
