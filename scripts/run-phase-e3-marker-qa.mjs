import fs from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

const BASE_URL = "http://127.0.0.1:3010/v2";
const OUTPUT_DIR = path.resolve(
  "docs/portfolio-v3/qa/phase-d/phase-e3-responsive-rebuild",
);
const REPORT_PATH = path.join(OUTPUT_DIR, "results.json");
const CHECKPOINT_REPORT_PATH = path.join(OUTPUT_DIR, "beam-checkpoint-results.json");
const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const MOTION_PREFERENCE_KEY = "portfolio-motion-preference-v4";

const viewports = [
  { width: 1920, height: 1080 },
  { width: 1536, height: 864 },
  { width: 1366, height: 768 },
  { width: 1280, height: 832 },
  { width: 1024, height: 1366 },
  { width: 834, height: 1194 },
  { width: 820, height: 1180 },
  { width: 810, height: 1080 },
  { width: 768, height: 1024 },
  { width: 1180, height: 820 },
  { width: 1024, height: 768 },
  { width: 1024, height: 600 },
  { width: 932, height: 430 },
  { width: 430, height: 932 },
  { width: 414, height: 896 },
  { width: 390, height: 844 },
  { width: 375, height: 812 },
  { width: 360, height: 800 },
  { width: 320, height: 568 },
  { width: 844, height: 390 },
  { width: 812, height: 375 },
  { width: 740, height: 360 },
];

const screenshotViewports = new Set([
  "1920x1080",
  "1536x864",
  "1366x768",
  "1280x832",
]);

const keyboardViewports = new Set([
  "1366x768",
  "1024x1366",
  "1024x768",
  "768x1024",
  "430x932",
  "390x844",
  "320x568",
  "844x390",
  "740x360",
]);

const stateScreenshotViewports = new Set([
  "1920x1080",
  "1536x864",
  "1366x768",
  "1280x832",
  "1180x820",
  "1024x1366",
  "1024x768",
  "834x1194",
  "768x1024",
  "430x932",
  "390x844",
  "360x800",
  "320x568",
]);

const fullPageScreenshotViewports = new Set([
  "1024x1366",
  "834x1194",
  "768x1024",
  "430x932",
  "390x844",
  "360x800",
]);

const dprViewports = [
  { width: 1280, height: 832 },
  { width: 1512, height: 982 },
];

const progressProofViewports = [
  { family: "desktop", width: 1366, height: 768 },
  { family: "tablet", width: 1024, height: 768 },
  { family: "mobile", width: 390, height: 844 },
];

const progressProofPhases = [
  { name: "0-percent", progress: 0, range: [0, 0.02] },
  { name: "25-percent", progress: 0.25, range: [0.2, 0.32] },
  { name: "50-percent", progress: 0.5, range: [0.45, 0.62] },
  { name: "75-percent", progress: 0.75, range: [0.7, 0.82] },
  { name: "near-destination", progress: 0.88, range: [0.82, 0.96] },
];

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
  if (width >= 768) return "tablet-rail";
  return "mobile-track";
}

function unique(items) {
  return [...new Set(items)];
}

async function hideDevelopmentTools(page) {
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
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
    const lensHeader = requireElement("[data-adaptive-stack-lens] > header");
    const narrative = requireElement("[data-hero-narrative]");
    const composition = narrative.parentElement;
    const navbar = requireElement("[data-adaptive-hero-nav]");
    const ctaArea = requireElement('nav[aria-label="Portfolio actions"]');
    const orbit = requireElement("[data-stack-lens-orbit]");
    const frame = requireElement("[data-orbit-frame]");
    const frameSegments = requireElement("[data-orbit-frame-segments]");
    const activeProjectSignal = requireElement("[data-active-project-signal]");
    const rotationToggle = requireElement("[data-rotation-toggle]");
    const signalRoute = requireElement("[data-signal-route]");
    const signalRouteOrbit = requireElement("[data-signal-route-orbit]");
    const signalRouteLinear = requireElement("[data-signal-route-linear]");
    const selector = requireElement("[data-project-selector]");
    const card = requireElement("[data-adaptive-system-core]");
    const cardContent = requireElement("[data-adaptive-system-core] > div");
    const technologySignal = requireElement("[data-project-technology-signal]");
    const link = card.querySelector("a");
    const controls = [...selector.querySelectorAll("button[data-lens-context]")];
    const controlItems = controls.map((control) => control.closest("li"));
    const markers = controls.map((control) => control.querySelector("[data-project-marker]"));
    const labels = controls.map((control) => control.querySelector("[data-project-label]"));
    const beams = controls.map((control) => control.querySelector("[data-project-beam]"));
    const responsiveMode =
      innerWidth >= 1180 ? "orbit" : innerWidth >= 768 ? "rail" : "track";
    const signalRouteBeam = requireElement(
      responsiveMode === "orbit"
        ? "[data-signal-route-orbit] [data-signal-route-beam]"
        : "[data-signal-route-linear] [data-signal-route-beam]",
    );
    const signalRouteTrack = requireElement(
      responsiveMode === "orbit"
        ? "[data-signal-route-orbit] [data-signal-route-track]"
        : "[data-signal-route-linear] [data-signal-route-track]",
    );
    const signalRouteTarget = requireElement('[data-signal-route-target="true"]');
    const signalRouteSegment = signalRouteLinear.querySelector(
      "[data-signal-route-segment]",
    );
    const cardSignalScan = requireElement("[data-card-signal-scan]");
    const heroRect = snapshot(hero);
    const compositionRect = snapshot(composition);
    const narrativeRect = snapshot(narrative);
    const lensRect = snapshot(lens);
    const lensHeaderRect = snapshot(lensHeader);
    const navbarRect = snapshot(navbar);
    const ctaAreaRect = snapshot(ctaArea);
    const orbitRect = snapshot(orbit);
    const frameRect = snapshot(frame);
    const selectorRect = snapshot(selector);
    const cardRect = snapshot(card);
    const linkRect = snapshot(link);
    const controlRects = controls.map(snapshot);
    const markerRects = markers.map(snapshot);
    const labelRects = labels.map(snapshot);
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
    const cardContentRect = snapshot(cardContent);
    const rotationToggleRect = snapshot(rotationToggle);
    const signalRouteBeamStyle = getComputedStyle(signalRouteBeam);
    const signalRouteTrackStyle = getComputedStyle(signalRouteTrack);
    const signalRouteTargetRect = snapshot(signalRouteTarget);
    const signalRouteSegmentRect = signalRouteSegment
      ? snapshot(signalRouteSegment)
      : null;
    const signalRouteSegmentStyle = signalRouteSegment
      ? getComputedStyle(signalRouteSegment)
      : null;
    const signalRouteAnimation = signalRouteBeam.getAnimations()[0];
    const signalRouteKeyframes = signalRouteAnimation?.effect?.getKeyframes() ?? [];
    const visibleCardTextElements = [
      ...card.querySelectorAll("p, h3, dt, dd, a, [data-project-technology-signal] span"),
    ].filter(isVisible);
    const cardTextRects = visibleCardTextElements.map(snapshot);
    const markerWidths = markerRects.map(({ width }) => width);
    const markerHeights = markerRects.map(({ height }) => height);
    const frameScale = Math.min(frameRect.width / 640, frameRect.height / 512);
    const frameOffsetX = (frameRect.width - 640 * frameScale) / 2;
    const frameOffsetY = (frameRect.height - 512 * frameScale) / 2;
    const nodeSlotSize = Number(
      frameSegments.getAttribute("data-orbit-node-slot-size"),
    );
    const sideSlotSize = Number(
      frameSegments.getAttribute("data-orbit-side-slot-size"),
    );
    const slotCenters = [
      { x: 320, y: 36, axis: "x", size: nodeSlotSize },
      { x: 588, y: 256, axis: "y", size: sideSlotSize },
      { x: 320, y: 476, axis: "x", size: nodeSlotSize },
      { x: 52, y: 256, axis: "y", size: sideSlotSize },
    ];
    const markerSlotClearances = markerRects.map((marker, index) => {
      const slot = slotCenters[index];
      const expectedX = frameRect.left + frameOffsetX + slot.x * frameScale;
      const expectedY = frameRect.top + frameOffsetY + slot.y * frameScale;
      const markerCenterX = marker.left + marker.width / 2;
      const markerCenterY = marker.top + marker.height / 2;
      const axisDelta =
        slot.axis === "x"
          ? Math.abs(markerCenterX - expectedX)
          : Math.abs(markerCenterY - expectedY);
      const markerSize = slot.axis === "x" ? marker.width : marker.height;
      return slot.size * frameScale / 2 - markerSize / 2 - axisDelta;
    });
    const sideGapTop = frameRect.top + frameOffsetY + 172 * frameScale;
    const sideGapBottom = frameRect.top + frameOffsetY + 340 * frameScale;
    const sideControlGapClearances = [1, 3].map((index) => {
      const clusterTop = Math.min(markerRects[index].top, labelRects[index].top);
      const clusterBottom = Math.max(
        markerRects[index].bottom,
        labelRects[index].bottom,
      );
      return Math.min(clusterTop - sideGapTop, sideGapBottom - clusterBottom);
    });
    const sideMarkerRailClearances = [1, 3].map((index) => {
      const slot = slotCenters[index];
      const railX = frameRect.left + frameOffsetX + slot.x * frameScale;
      const markerCenterX = markerRects[index].left + markerRects[index].width / 2;
      return markerRects[index].width / 2 - Math.abs(markerCenterX - railX);
    });
    const sideRailDeltas = ["left", "right"].map((side) => {
      const railPaths = [
        ...frame.querySelectorAll(`[data-frame-side="${side}"] path`),
      ];
      const upperRailX = railPaths[0].getPointAtLength(0).x;
      const lowerRailX = railPaths[1].getPointAtLength(0).x;
      return Math.abs(upperRailX - lowerRailX) * frameScale;
    });
    const activeBeamGap =
      responsiveMode === "rail"
        ? cardRect.left - activeBeamRect.right
        : responsiveMode === "track"
          ? cardRect.top - activeBeamRect.bottom
          : activeControlIndex === 0
            ? cardRect.top - activeBeamRect.bottom
            : activeControlIndex === 1
              ? activeBeamRect.left - cardRect.right
              : activeControlIndex === 2
                ? activeBeamRect.top - cardRect.bottom
                : cardRect.left - activeBeamRect.right;
    const routeFrom = Number(signalRoute.getAttribute("data-route-from"));
    const routeTo = Number(signalRoute.getAttribute("data-route-to"));
    const routeTargetMarker = markerRects[routeTo];
    const routeTargetDelta = routeTargetMarker
      ? Math.hypot(
          signalRouteTargetRect.left + signalRouteTargetRect.width / 2 -
            (routeTargetMarker.left + routeTargetMarker.width / 2),
          signalRouteTargetRect.top + signalRouteTargetRect.height / 2 -
            (routeTargetMarker.top + routeTargetMarker.height / 2),
        )
      : Number.POSITIVE_INFINITY;
    const labelNodeGaps = labelRects.map(
      (label, index) => markerRects[index].left - label.right,
    );
    const routeMarkerCenters = [routeFrom, routeTo].map((index) => ({
      x: markerRects[index].left + markerRects[index].width / 2,
      y: markerRects[index].top + markerRects[index].height / 2,
    }));
    const routeExpectedStart =
      responsiveMode === "rail"
        ? Math.min(...routeMarkerCenters.map(({ y }) => y))
        : Math.min(...routeMarkerCenters.map(({ x }) => x));
    const routeExpectedEnd =
      responsiveMode === "rail"
        ? Math.max(...routeMarkerCenters.map(({ y }) => y))
        : Math.max(...routeMarkerCenters.map(({ x }) => x));
    const routeSegmentStart = signalRouteSegmentRect
      ? responsiveMode === "rail"
        ? signalRouteSegmentRect.top
        : signalRouteSegmentRect.left
      : null;
    const routeSegmentEnd = signalRouteSegmentRect
      ? responsiveMode === "rail"
        ? signalRouteSegmentRect.bottom
        : signalRouteSegmentRect.right
      : null;
    const node04Center =
      responsiveMode === "rail"
        ? markerRects[3].top + markerRects[3].height / 2
        : markerRects[3].left + markerRects[3].width / 2;
    const signalRouteMotionValues = [
      ...new Set(
        signalRouteKeyframes
          .map((keyframe) =>
            responsiveMode === "orbit"
              ? keyframe.strokeDashoffset
              : keyframe.transform,
          )
          .filter(Boolean),
      ),
    ];
    const signalRouteSegmentLength = signalRouteSegmentRect
      ? responsiveMode === "rail"
        ? signalRouteSegmentRect.height
        : signalRouteSegmentRect.width
      : null;
    const signalRouteBeamRect = snapshot(signalRouteBeam);
    const signalRouteBeamLength =
      responsiveMode === "orbit"
        ? Number.parseFloat(signalRouteBeamStyle.strokeDasharray)
        : responsiveMode === "rail"
          ? signalRouteBeamRect.height
          : signalRouteBeamRect.width;
    const signalRouteBeamLengthRatio =
      responsiveMode === "orbit"
        ? signalRouteBeamLength
        : signalRouteSegmentLength
          ? signalRouteBeamLength / signalRouteSegmentLength
          : 0;

    return {
      activeMode: lens.getAttribute("data-active-mode"),
      activeControlIndex,
      activeIndex: Number(lens.getAttribute("data-active-index")),
      activeProjectSignalText: activeProjectSignal.textContent?.trim() ?? "",
      activeProjectSignalVisible: isVisible(activeProjectSignal),
      activeBeamCount: controls.filter(
        (control) => control.getAttribute("data-active") === "true",
      ).length,
      activeBeamAnimationName: getComputedStyle(activeBeam).animationName,
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
      cardTextContained: visibleCardTextElements.every((element) =>
        containedBy(snapshot(element), cardRect),
      ),
      cardTitle: card.querySelector("h3")?.textContent?.trim() ?? "",
      card: cardRect,
      cardBottomDeadSpace: Math.max(0, cardRect.bottom - cardContentRect.bottom),
      cardBottomBreathingSpace: Math.max(0, cardRect.bottom - linkRect.bottom),
      cardAlignSelf: cardStyle.alignSelf,
      cardMinBlockSize: cardStyle.minBlockSize,
      cardContent: cardContentRect,
      composition: compositionRect,
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
      controlAccessibleNamesValid: controls.every((control) =>
        /^Select project \d{2}: .+/.test(control.getAttribute("aria-label") ?? ""),
      ),
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
      cardSignalScanAnimation: getComputedStyle(cardSignalScan).animationName,
      decorativeSvgCount: lens.querySelectorAll("svg[aria-hidden='true']").length,
      orbitFrameCount: lens.querySelectorAll("svg[data-orbit-frame]").length,
      documentScrollHeight: document.documentElement.scrollHeight,
      documentScrollWidth: document.documentElement.scrollWidth,
      documentClientWidth: document.documentElement.clientWidth,
      devicePixelRatio,
      frameVisible: isVisible(frame),
      frameSegmentCount: frame.querySelectorAll("[data-orbit-frame-segment]").length,
      heroBottomReachable:
        heroRect.docBottom <= document.documentElement.scrollHeight + 1,
      heroOverflowX: heroStyle.overflowX,
      heroOverflowY: heroStyle.overflowY,
      hasInteracted: lens.getAttribute("data-interacted") === "true",
      horizontalOverflow: Math.max(
        0,
        document.documentElement.scrollWidth - innerWidth,
      ),
      linkHref: link?.getAttribute("href") ?? "",
      labels: labelRects,
      labelLeftEdgeDelta: Math.min(...labelRects.map(({ left }) => left)) - orbitRect.left,
      labelNodeGapVariation: Math.max(...labelNodeGaps) - Math.min(...labelNodeGaps),
      labelNodeGaps,
      labelsVisible: labels.map(isVisible),
      navbar: navbarRect,
      narrative: narrativeRect,
      markerHeightVariation:
        Math.max(...markerHeights) - Math.min(...markerHeights),
      markerSlotClearances,
      markers: markerRects,
      markerWidthVariation: Math.max(...markerWidths) - Math.min(...markerWidths),
      orbitLabelOrientations: [
        labelRects[0].bottom <= markerRects[0].top + 1,
        labelRects[1].top >= markerRects[1].bottom - 1,
        labelRects[2].top >= markerRects[2].bottom - 1,
        labelRects[3].top >= markerRects[3].bottom - 1,
      ],
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
      rotationToggleAccessibleName:
        rotationToggle.getAttribute("aria-label") ?? "",
      rotationCooldown: lens.getAttribute("data-rotation-cooldown") === "true",
      rotationState: lens.getAttribute("data-auto-rotation") ?? "",
      rotationTogglePressed: rotationToggle.getAttribute("aria-pressed"),
      rotationToggleTargetValid:
        rotationToggleRect.width >= 44 && rotationToggleRect.height >= 44,
      rotationToggleVisible: isVisible(rotationToggle),
      rotationToggle: rotationToggleRect,
      selector: selectorRect,
      selectorColumnCount: trackCount(selectorStyle.gridTemplateColumns),
      selectorRowCount: trackCount(selectorStyle.gridTemplateRows),
      selectorUsesSubgrid: selectorStyle.gridTemplateColumns.startsWith("subgrid"),
      selectorCount: lens.querySelectorAll("[data-project-selector]").length,
      signalRouteAnimationDuration: signalRouteBeamStyle.animationDuration,
      signalRouteAnimationName: signalRouteBeamStyle.animationName,
      signalRouteAnimationState: signalRouteBeamStyle.animationPlayState,
      signalRouteBeamCount: lens.querySelectorAll("[data-signal-route-beam]").length,
      signalRouteBeamLengthRatio,
      signalRouteBeamLuminous:
        signalRouteBeamStyle.filter !== "none" ||
        signalRouteBeamStyle.boxShadow !== "none",
      signalRouteBeamOpacity: Number(signalRouteBeamStyle.opacity),
      signalRouteBeamShadow:
        responsiveMode === "orbit"
          ? signalRouteBeamStyle.filter
          : signalRouteBeamStyle.boxShadow,
      signalRouteCount: lens.querySelectorAll("[data-signal-route]").length,
      signalRouteDirection: signalRoute.getAttribute("data-route-direction") ?? "",
      signalRouteFrom: routeFrom,
      signalRouteLinearVisible: isVisible(signalRouteLinear),
      signalRouteMotionValues,
      signalRouteNode04Overshoot:
        routeSegmentEnd === null ? 0 : Math.max(0, routeSegmentEnd - node04Center),
      signalRouteOrbitVisible: isVisible(signalRouteOrbit),
      signalRouteResetOpacity: Number(signalRouteBeamStyle.opacity),
      signalRouteSegmentClipped:
        signalRouteSegmentStyle?.overflowX === "hidden" &&
        signalRouteSegmentStyle?.overflowY === "hidden",
      signalRouteSegmentCount: lens.querySelectorAll(
        "[data-signal-route-segment]",
      ).length,
      signalRouteSegmentEndDelta:
        routeSegmentEnd === null ? 0 : Math.abs(routeSegmentEnd - routeExpectedEnd),
      signalRouteSegmentStartDelta:
        routeSegmentStart === null
          ? 0
          : Math.abs(routeSegmentStart - routeExpectedStart),
      signalRouteTrackCount: lens.querySelectorAll("[data-signal-route-track]").length,
      signalRouteTrackVisible:
        isVisible(signalRouteTrack) &&
        (responsiveMode === "orbit"
          ? signalRouteTrackStyle.stroke !== "none"
          : signalRouteTrackStyle.backgroundImage !== "none" ||
            signalRouteTrackStyle.backgroundColor !== "rgba(0, 0, 0, 0)"),
      signalRouteTargetDelta: routeTargetDelta,
      signalRouteTo: routeTo,
      signalRouteVisible: isVisible(signalRoute),
      signalRouteWrap: signalRoute.getAttribute("data-route-wrap") === "true",
      structuralLineVisible:
        responsiveMode === "orbit"
          ? isVisible(frame)
          : Boolean(
              signalRouteTrackStyle.display !== "none" &&
                (signalRouteTrackStyle.backgroundImage !== "none" ||
                  signalRouteTrackStyle.backgroundColor !== "rgba(0, 0, 0, 0)"),
            ),
      sideControlGapClearances,
      sideMarkerRailClearances,
      sideRailDeltas,
      selectedWork: lensRect,
      selectedWorkNarrativeEdgeDelta: Math.max(
        Math.abs(lensRect.left - narrativeRect.left),
        Math.abs(lensRect.right - narrativeRect.right),
      ),
      thesisAbsent:
        !lens.textContent?.includes("ARCHITECTURE FOLLOWS THE CONSTRAINT") &&
        !lens.hasAttribute("aria-describedby"),
      touchTargetsValid: controlRects.every(
        (rect) => rect.width >= 44 && rect.height >= 44,
      ),
      technologySignalText: technologySignal.textContent?.trim() ?? "",
      technologySignalVisible: isVisible(technologySignal),
      topHeaderClearance: labelRects[0].top - lensHeaderRect.bottom,
      ctaArea: ctaAreaRect,
      visualViewportHeight: visualViewport?.height ?? null,
      visualViewportScale: visualViewport?.scale ?? null,
      visualViewportWidth: visualViewport?.width ?? null,
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
  if (measurement.decorativeSvgCount !== 3) {
    failures.push("decorative SVG count is not three");
  }
  if (measurement.orbitFrameCount !== 1) failures.push("orbit frame SVG count is not one");
  if (measurement.frameSegmentCount !== 4) failures.push("frame segment count is not four");
  if (measurement.signalRouteCount !== 1) failures.push("signal route count is not one");
  if (!measurement.signalRouteVisible) failures.push("signal route is hidden");
  if (measurement.signalRouteFrom !== measurement.activeIndex) {
    failures.push("signal route source does not match active index");
  }
  if (measurement.signalRouteTo !== (measurement.activeIndex + 1) % 4) {
    failures.push("signal route destination is not next project");
  }
  if (measurement.signalRouteWrap !== (measurement.activeIndex === 3)) {
    failures.push("signal route wrap metadata is incorrect");
  }
  const expectedDirection = measurement.activeIndex === 3 ? "return" : "forward";
  if (measurement.signalRouteDirection !== expectedDirection) {
    failures.push("signal route direction metadata is incorrect");
  }
  if (measurement.signalRouteTargetDelta > 2) {
    failures.push(
      `signal route target misses destination node by ${measurement.signalRouteTargetDelta.toFixed(3)}px`,
    );
  }
  if (measurement.signalRouteTrackCount !== 2) {
    failures.push("signal route track count is not two responsive layers");
  }
  if (measurement.signalRouteBeamCount !== 2) {
    failures.push("signal route beam count is not two responsive layers");
  }
  if (measurement.signalRouteSegmentCount !== 1) {
    failures.push("signal route segment count is not one");
  }
  if (!measurement.signalRouteBeamLuminous) {
    failures.push("signal route beam lacks restrained glow");
  }
  if (!measurement.signalRouteTrackVisible) {
    failures.push("signal route inactive track is hidden");
  }
  if (
    measurement.signalRouteBeamLengthRatio < 0.1 ||
    measurement.signalRouteBeamLengthRatio > 0.18
  ) {
    failures.push(
      `signal route beam length is ${(measurement.signalRouteBeamLengthRatio * 100).toFixed(1)}%`,
    );
  }
  if (measurement.signalRouteMotionValues.length < 2) {
    failures.push("signal route animation does not change position");
  }
  if (!/lens-(?:linear-route-beam|route-beam-travel)/.test(
    measurement.signalRouteAnimationName,
  )) {
    failures.push("signal route beam animation is missing");
  }
  if (measurement.signalRouteAnimationDuration !== "6s") {
    failures.push(`signal route duration is ${measurement.signalRouteAnimationDuration}`);
  }
  const expectedAnimationState =
    measurement.rotationState === "running" ? "running" : "paused";
  if (measurement.signalRouteAnimationState !== expectedAnimationState) {
    failures.push("signal route animation state does not match rotation state");
  }
  if (
    measurement.rotationCooldown &&
    measurement.signalRouteAnimationState === "paused" &&
    measurement.signalRouteResetOpacity > 0.01
  ) {
    failures.push("reset signal route retains a visible beam");
  }
  if (!measurement.cardAfterSelector) failures.push("card does not follow selector");
  if (!measurement.controlsVisible) failures.push("one or more controls are hidden");
  if (!measurement.controlAccessibleNamesValid) {
    failures.push("one or more controls lack a full accessible project name");
  }
  if (!measurement.thesisAbsent) failures.push("obsolete architecture thesis remains");
  if (!measurement.rotationToggleVisible) failures.push("rotation toggle is hidden");
  if (!measurement.rotationToggleTargetValid) {
    failures.push("rotation toggle target is below 44px");
  }
  if (!/^(Pause|Resume) project rotation$/.test(measurement.rotationToggleAccessibleName)) {
    failures.push("rotation toggle accessible name is invalid");
  }
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
  if (Number.parseFloat(measurement.cardMinBlockSize) > 0.5) {
    failures.push(`project card min-block-size is ${measurement.cardMinBlockSize}`);
  }
  if (measurement.pressedCount !== 1) failures.push("pressed control count is not one");
  if (measurement.activeIndex !== measurement.activeControlIndex) {
    failures.push("active index does not match active control");
  }
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
    if (measurement.cardAlignSelf !== "center") {
      failures.push("desktop project card is not vertically centered");
    }
    if (
      measurement.cardBottomBreathingSpace < 20 ||
      measurement.cardBottomBreathingSpace > 32
    ) {
      failures.push(
        `desktop card bottom breathing space ${measurement.cardBottomBreathingSpace.toFixed(3)}px`,
      );
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
    measurement.orbitLabelOrientations.forEach((valid, index) => {
      if (!valid) failures.push(`control ${index + 1} label orientation is wrong`);
    });
    measurement.markerSlotClearances.forEach((clearance, index) => {
      if (clearance < 2) {
        failures.push(
          `control ${index + 1} frame slot clearance ${clearance.toFixed(3)}px`,
        );
      }
    });
    measurement.sideControlGapClearances.forEach((clearance, index) => {
      if (clearance < 2) {
        failures.push(
          `${index === 0 ? "right" : "left"} control gap clearance ${clearance.toFixed(3)}px`,
        );
      }
    });
    measurement.sideMarkerRailClearances.forEach((clearance, index) => {
      if (clearance < 0) {
        failures.push(
          `${index === 0 ? "right" : "left"} marker misses rail slot by ${Math.abs(clearance).toFixed(3)}px`,
        );
      }
    });
    measurement.sideRailDeltas.forEach((delta, index) => {
      if (delta >= 1) {
        failures.push(
          `${index === 0 ? "left" : "right"} rail delta ${delta.toFixed(3)}px`,
        );
      }
    });
    if (measurement.topHeaderClearance < 18) {
      failures.push(
        `top control header clearance ${measurement.topHeaderClearance.toFixed(3)}px`,
      );
    }
    if (!measurement.hasInteracted && !measurement.activeBeamVisible) {
      failures.push("initial active connector is not visible");
    }
    if (
      measurement.hasInteracted &&
      !/lens-project-beam-handoff/.test(measurement.activeBeamAnimationName)
    ) {
      failures.push("desktop connector handoff animation is missing");
    }
    if (measurement.activeBeamLength < 24) failures.push("active beam is too short");
    if (measurement.activeBeamGap > 2) failures.push("active beam does not reach card");
    if (measurement.activeBeamIntersectsCardText) {
      failures.push("active beam intersects card text");
    }
    if (!measurement.signalRouteOrbitVisible || measurement.signalRouteLinearVisible) {
      failures.push("desktop signal route uses wrong geometry");
    }
  } else if (mode === "tablet-rail") {
    if (measurement.frameVisible) failures.push("tablet rail shows orbit frame");
    if (
      measurement.orbitColumnCount !== 5 ||
      !measurement.selectorUsesSubgrid ||
      measurement.selectorRowCount !== 4
    ) {
      failures.push("tablet selector does not use the five-track rail grid");
    }
    if (!measurement.labelsVisible.every(Boolean)) {
      failures.push("tablet rail hides one or more project labels");
    }
    if (measurement.activeProjectSignalVisible) {
      failures.push("tablet rail shows mobile active-system strip");
    }
    if (!measurement.technologySignalVisible) {
      failures.push("tablet card hides technology signal");
    }
    if (measurement.selectedWorkNarrativeEdgeDelta > 2) {
      failures.push(
        `tablet navigator edge delta ${measurement.selectedWorkNarrativeEdgeDelta.toFixed(3)}px`,
      );
    }
    if (measurement.signalRouteOrbitVisible || !measurement.signalRouteLinearVisible) {
      failures.push("tablet signal route uses wrong geometry");
    }
    if (!measurement.structuralLineVisible) {
      failures.push("tablet rail line is missing");
    }
    if (measurement.labelLeftEdgeDelta > 2) {
      failures.push(
        `tablet labels begin ${measurement.labelLeftEdgeDelta.toFixed(3)}px after navigator edge`,
      );
    }
    if (measurement.labelNodeGapVariation > 0.5) {
      failures.push("tablet label-to-node gaps are inconsistent");
    }
    if (measurement.card.width < measurement.orbit.width - 185) {
      failures.push("tablet card does not receive expected usable width");
    }
    if (!measurement.signalRouteSegmentClipped) {
      failures.push("tablet route segment is not clipped");
    }
    if (
      measurement.signalRouteSegmentStartDelta > 1 ||
      measurement.signalRouteSegmentEndDelta > 1
    ) {
      failures.push("tablet route segment does not terminate at node centres");
    }
    if (measurement.signalRouteNode04Overshoot > 1) {
      failures.push("tablet route extends beyond node 04");
    }
    if (measurement.card.left < measurement.selector.right - 1) {
      failures.push("tablet card does not sit right of signal rail");
    }
    if (measurement.cardAlignSelf !== "start") {
      failures.push("tablet project card stretches to rail height");
    }
    if (
      measurement.cardBottomBreathingSpace < 20 ||
      measurement.cardBottomBreathingSpace > 32
    ) {
      failures.push(
        `tablet card bottom breathing space ${measurement.cardBottomBreathingSpace.toFixed(3)}px`,
      );
    }
    if (Math.abs(measurement.activeBeamGap) > 2) {
      failures.push("tablet active connector does not reach card");
    }
    if (measurement.activeBeamIntersectsCardText) {
      failures.push("tablet active connector intersects card text");
    }
    if (!measurement.touchTargetsValid) failures.push("rail touch target is below 44px");
  } else {
    if (measurement.frameVisible) failures.push("mobile track shows orbit frame");
    if (measurement.selectorColumnCount !== 4 || measurement.selectorRowCount !== 1) {
      failures.push("mobile selector is not a four-node track");
    }
    if (measurement.labelsVisible.some(Boolean)) {
      failures.push("mobile track exposes squeezed project labels");
    }
    if (!measurement.activeProjectSignalVisible) {
      failures.push("mobile active-system strip is hidden");
    }
    if (!measurement.activeProjectSignalText.includes(measurement.cardTitle)) {
      failures.push("mobile active-system strip does not match card");
    }
    if (!measurement.technologySignalVisible) {
      failures.push("mobile card hides technology signal");
    }
    if (measurement.cardBottomDeadSpace > 24) {
      failures.push(
        `mobile card bottom dead space ${measurement.cardBottomDeadSpace.toFixed(3)}px`,
      );
    }
    if (measurement.signalRouteOrbitVisible || !measurement.signalRouteLinearVisible) {
      failures.push("mobile signal route uses wrong geometry");
    }
    if (!measurement.structuralLineVisible) {
      failures.push("mobile track line is missing");
    }
    if (!measurement.signalRouteSegmentClipped) {
      failures.push("mobile route segment is not clipped");
    }
    if (
      measurement.signalRouteSegmentStartDelta > 1 ||
      measurement.signalRouteSegmentEndDelta > 1
    ) {
      failures.push("mobile route segment does not terminate at node centres");
    }
    if (measurement.signalRouteNode04Overshoot > 1) {
      failures.push("mobile route extends beyond node 04");
    }
    if (measurement.card.top < measurement.selector.bottom - 1) {
      failures.push("mobile card does not follow signal track");
    }
    if (Math.abs(measurement.activeBeamGap) > 2) {
      failures.push("mobile active connector does not reach card");
    }
    if (measurement.activeBeamIntersectsCardText) {
      failures.push("mobile active connector intersects card text");
    }
    if (!measurement.touchTargetsValid) failures.push("track touch target is below 44px");
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

function maximumRectMovement(initial, current) {
  return Math.max(
    Math.abs(initial.docLeft - current.docLeft),
    Math.abs(initial.docTop - current.docTop),
    Math.abs(initial.width - current.width),
    Math.abs(initial.height - current.height),
  );
}

async function validateProjectStates(page, initial, mode, label) {
  const failures = [];
  const states = [];
  const screenshotPaths = [];
  let maximumMovement = 0;
  let maximumOrbitShift = 0;
  let maximumSelectedWorkShift = 0;
  let maximumCardAnchorShift = 0;
  let minimumCardHeight = initial.card.height;
  let maximumCardHeight = initial.card.height;

  for (const project of projects) {
    await page.evaluate((slug) => {
      document.querySelector(`[data-lens-context="${slug}"]`)?.click();
    }, project.slug);
    await page.waitForTimeout(450);
    const current = await measureLayout(page);
    failures.push(
      ...layoutFailures(current, mode).map(
        (failure) => `${project.slug}: ${failure}`,
      ),
    );
    if (stateScreenshotViewports.has(label)) {
      const screenshotPath = path.join(
        OUTPUT_DIR,
        `selected-work-${label}-${project.slug}.png`,
      );
      await page.evaluate(() => {
        const lens = document.querySelector("[data-adaptive-stack-lens]");
        const navbar = document.querySelector("[data-adaptive-hero-nav]");
        const lensTop = lens.getBoundingClientRect().top + scrollY;
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        scrollTo(0, lensTop - navbar.getBoundingClientRect().bottom - 12);
      });
      await page.waitForTimeout(80);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      screenshotPaths.push(screenshotPath);
    }
    states.push({
      activeMode: current.activeMode,
      cardBottomBreathingSpace: current.cardBottomBreathingSpace,
      cardContentHeight: current.cardContent.height,
      cardHeight: current.card.height,
      cardTitle: current.cardTitle,
      linkHref: current.linkHref,
      pressedSlug: current.pressedSlug,
      signalRouteDirection: current.signalRouteDirection,
      signalRouteFrom: current.signalRouteFrom,
      signalRouteTo: current.signalRouteTo,
      signalRouteWrap: current.signalRouteWrap,
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
    maximumSelectedWorkShift = Math.max(
      maximumSelectedWorkShift,
      maximumRectMovement(initial.selectedWork, current.selectedWork),
    );
    const initialCardAnchor = {
      x: initial.card.docLeft + initial.card.width / 2,
      y: mode.endsWith("orbit")
        ? initial.card.docTop + initial.card.height / 2
        : initial.card.docTop,
    };
    const currentCardAnchor = {
      x: current.card.docLeft + current.card.width / 2,
      y: mode.endsWith("orbit")
        ? current.card.docTop + current.card.height / 2
        : current.card.docTop,
    };
    maximumCardAnchorShift = Math.max(
      maximumCardAnchorShift,
      Math.hypot(
        initialCardAnchor.x - currentCardAnchor.x,
        initialCardAnchor.y - currentCardAnchor.y,
      ),
    );
    minimumCardHeight = Math.min(minimumCardHeight, current.card.height);
    maximumCardHeight = Math.max(maximumCardHeight, current.card.height);
  }

  if (maximumMovement > 1) {
    failures.push(`project switching moved controls ${maximumMovement.toFixed(3)}px`);
  }
  if (mode !== "mobile-track" && maximumOrbitShift > 1) {
    failures.push(`project switching shifted orbit ${maximumOrbitShift.toFixed(3)}px`);
  }
  if (mode !== "mobile-track" && maximumSelectedWorkShift > 1) {
    failures.push(
      `project switching shifted selected work ${maximumSelectedWorkShift.toFixed(3)}px`,
    );
  }
  if (maximumCardAnchorShift > 1) {
    failures.push(
      `project switching moved card anchor ${maximumCardAnchorShift.toFixed(3)}px`,
    );
  }
  const cardHeightVariation = maximumCardHeight - minimumCardHeight;
  if (mode === "mobile-track" && cardHeightVariation > 96) {
    failures.push(
      `mobile project switching changed card height ${cardHeightVariation.toFixed(3)}px`,
    );
  }

  return {
    cardHeightVariation,
    failures,
    maximumCardAnchorShift,
    maximumMovement,
    maximumOrbitShift,
    maximumSelectedWorkShift,
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
  await hideDevelopmentTools(page);
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
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
  await page.waitForTimeout(360);

  let screenshotPath = null;
  if (screenshotViewports.has(label)) {
    screenshotPath = path.join(OUTPUT_DIR, `desktop-regression-${label}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
  }

  let fullPageScreenshotPath = null;
  if (fullPageScreenshotViewports.has(label)) {
    fullPageScreenshotPath = path.join(OUTPUT_DIR, `full-page-${label}.png`);
    await page.screenshot({ path: fullPageScreenshotPath, fullPage: true });
  }

  return {
    cardHeightVariation: projectValidation.cardHeightVariation,
    environment: {
      devicePixelRatio: initial.devicePixelRatio,
      documentClientWidth: initial.documentClientWidth,
      documentScrollHeight: initial.documentScrollHeight,
      documentScrollWidth: initial.documentScrollWidth,
      visualViewportHeight: initial.visualViewportHeight,
      visualViewportScale: initial.visualViewportScale,
      visualViewportWidth: initial.visualViewportWidth,
      viewportHeight: initial.viewportHeight,
      viewportWidth: initial.viewportWidth,
      zoomDetectable: false,
    },
    failures: unique(failures),
    fullPageScreenshotPath,
    maximumCardAnchorShift: projectValidation.maximumCardAnchorShift,
    maximumControlMovement: projectValidation.maximumMovement,
    maximumOrbitShift: projectValidation.maximumOrbitShift,
    maximumSelectedWorkShift: projectValidation.maximumSelectedWorkShift,
    measurements: {
      card: initial.card,
      composition: initial.composition,
      controls: initial.controls,
      ctaArea: initial.ctaArea,
      hero: initial.hero,
      labelLeftEdgeDelta: initial.labelLeftEdgeDelta,
      labelNodeGaps: initial.labelNodeGaps,
      labels: initial.labels,
      markers: initial.markers,
      navbar: initial.navbar,
      narrative: initial.narrative,
      orbit: initial.orbit,
      selectedWork: initial.selectedWork,
      selector: initial.selector,
      signalRouteSegmentEndDelta: initial.signalRouteSegmentEndDelta,
      signalRouteSegmentStartDelta: initial.signalRouteSegmentStartDelta,
    },
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
    viewport: { width: 390, height: 844 },
  });
  await context.addInitScript((preferenceKey) => {
    localStorage.setItem(preferenceKey, "reduced");
  }, MOTION_PREFERENCE_KEY);
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await hideDevelopmentTools(page);
  await page.evaluate(() => {
    document.querySelector('[data-lens-context="warqah-store"]')?.click();
  });
  await positionLensForScreenshot(page);
  const screenshotPath = path.join(
    OUTPUT_DIR,
    "signal-transfer-reduced-static-390x844.png",
  );
  await page.screenshot({ path: screenshotPath, fullPage: false });
  const result = await page.evaluate(() => {
    const boundary = document.querySelector("[data-orbit-frame] path");
    const cardContent = document.querySelector("[data-adaptive-system-core] > div");
    const cardDecoration = document.querySelector(
      "[data-adaptive-system-core] > span",
    );
    const caret = document.querySelector("[data-living-toolchain] i");
    const activeBeam = document.querySelector(
      '[data-project-selector] button[data-active="true"] [data-project-beam]',
    );
    const beamStyle = activeBeam ? getComputedStyle(activeBeam) : null;
    const lens = document.querySelector("[data-adaptive-stack-lens]");
    const rotationToggle = document.querySelector("[data-rotation-toggle]");
    const signalRoute = document.querySelector("[data-signal-route]");
    const signalRouteBeam = document.querySelector(
      "[data-signal-route-linear] [data-signal-route-beam]",
    );
    const signalRouteTarget = document.querySelector(
      '[data-signal-route-target="true"]',
    );
    const cardSignalScan = document.querySelector("[data-card-signal-scan]");
    return {
      activeMode: lens?.getAttribute("data-active-mode"),
      autoRotationState: lens?.getAttribute("data-auto-rotation"),
      boundaryAnimation: boundary ? getComputedStyle(boundary).animationName : null,
      beamTransitionIsImmediate: beamStyle
        ? beamStyle.transitionDuration
            .split(",")
            .every((duration) => Number.parseFloat(duration) <= 0.001)
        : false,
      cardAnimation: cardContent ? getComputedStyle(cardContent).animationName : null,
      cardBorderAnimation: cardDecoration
        ? getComputedStyle(cardDecoration).animationName
        : null,
      cardSignalScanAnimation: cardSignalScan
        ? getComputedStyle(cardSignalScan).animationName
        : null,
      caretDisplay: caret ? getComputedStyle(caret).display : null,
      effectiveMotion: document.documentElement.dataset.effectiveMotion,
      signalRouteDirection: signalRoute?.getAttribute("data-route-direction"),
      signalRouteBeamAnimation: signalRouteBeam
        ? getComputedStyle(signalRouteBeam).animationName
        : null,
      signalRouteBeamOpacity: signalRouteBeam
        ? Number(getComputedStyle(signalRouteBeam).opacity)
        : null,
      signalRouteTargetAnimation: signalRouteTarget
        ? getComputedStyle(signalRouteTarget, "::after").animationName
        : null,
      rotationToggleDisabled:
        rotationToggle instanceof HTMLButtonElement && rotationToggle.disabled,
    };
  });
  await context.close();
  return {
    ...result,
    errors,
    screenshotPath,
    passed:
      result.activeMode === "warqah-store" &&
      result.boundaryAnimation === "none" &&
      result.beamTransitionIsImmediate &&
      result.cardAnimation === "none" &&
      result.cardBorderAnimation === "none" &&
      result.cardSignalScanAnimation === "none" &&
      result.caretDisplay === "none" &&
      result.effectiveMotion === "reduced" &&
      result.autoRotationState === "reduced" &&
      result.signalRouteDirection === "forward" &&
      result.signalRouteBeamAnimation === "none" &&
      result.signalRouteBeamOpacity === 0 &&
      result.signalRouteTargetAnimation === "none" &&
      result.rotationToggleDisabled &&
      errors.length === 0,
  };
}

async function automaticRotationState(page) {
  return page.evaluate(() => {
    const lens = document.querySelector("[data-adaptive-stack-lens]");
    const toggle = document.querySelector("[data-rotation-toggle]");
    const signalRoute = document.querySelector("[data-signal-route]");
    const signalRouteBeam = document.querySelector(
      innerWidth >= 1180
        ? "[data-signal-route-orbit] [data-signal-route-beam]"
        : "[data-signal-route-linear] [data-signal-route-beam]",
    );
    const signalRouteSegment = document.querySelector(
      "[data-signal-route-segment]",
    );
    const signalRouteTarget = document.querySelector(
      '[data-signal-route-target="true"]',
    );
    const card = document.querySelector("[data-adaptive-system-core]");
    const routeAnimation = signalRouteBeam?.getAnimations()[0];
    const beamRect = signalRouteBeam?.getBoundingClientRect();
    const segmentRect = signalRouteSegment?.getBoundingClientRect();
    const routeWrap = signalRoute?.getAttribute("data-route-wrap") === "true";
    const beamStyle = signalRouteBeam ? getComputedStyle(signalRouteBeam) : null;
    const routeBeamProgress =
      innerWidth >= 1180
        ? beamStyle
          ? Math.max(
              0,
              Math.min(
                1,
                0.14 - Number.parseFloat(beamStyle.strokeDashoffset),
              ),
            )
          : null
        : beamRect && segmentRect
          ? innerWidth >= 768
            ? Math.max(
                0,
                Math.min(
                  1,
                  routeWrap
                    ? (segmentRect.bottom - (beamRect.top + beamRect.height / 2)) /
                        segmentRect.height
                    : (beamRect.top + beamRect.height / 2 - segmentRect.top) /
                        segmentRect.height,
                ),
              )
            : Math.max(
                0,
                Math.min(
                  1,
                  routeWrap
                    ? (segmentRect.right - (beamRect.left + beamRect.width / 2)) /
                        segmentRect.width
                    : (beamRect.left + beamRect.width / 2 - segmentRect.left) /
                        segmentRect.width,
                ),
              )
          : null;
    return {
      activeIndex: Number(lens?.getAttribute("data-active-index")),
      activeMode: lens?.getAttribute("data-active-mode") ?? "",
      cardTitle: card?.querySelector("h3")?.textContent?.trim() ?? "",
      cooldown: lens?.getAttribute("data-rotation-cooldown") === "true",
      intervalMs: Number(lens?.getAttribute("data-rotation-interval-ms")),
      routeAnimationCurrentTime: Number(routeAnimation?.currentTime ?? 0),
      routeAnimationPlayState: routeAnimation?.playState ?? "",
      routeDirection: signalRoute?.getAttribute("data-route-direction") ?? "",
      routeBeamOpacity: Number(beamStyle?.opacity ?? 0),
      routeBeamProgress,
      routeBeamShadow:
        innerWidth >= 1180
          ? beamStyle?.filter ?? ""
          : beamStyle?.boxShadow ?? "",
      routeFrom: Number(signalRoute?.getAttribute("data-route-from")),
      routeTo: Number(signalRoute?.getAttribute("data-route-to")),
      routeTargetPulseOpacity: Number(
        signalRouteTarget
          ? getComputedStyle(signalRouteTarget, "::after").opacity
          : 0,
      ),
      routeWrap,
      rotationState: lens?.getAttribute("data-auto-rotation") ?? "",
      selectionCooldownMs: Number(
        lens?.getAttribute("data-selection-cooldown-ms"),
      ),
      toggleLabel: toggle?.getAttribute("aria-label") ?? "",
      togglePressed: toggle?.getAttribute("aria-pressed") ?? "",
    };
  });
}

async function positionLensForScreenshot(page) {
  await page.evaluate(() => {
    const lens = document.querySelector("[data-adaptive-stack-lens]");
    const navbar = document.querySelector("[data-adaptive-hero-nav]");
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const lensTop = lens.getBoundingClientRect().top + scrollY;
    scrollTo(0, lensTop - navbar.getBoundingClientRect().bottom - 12);
  });
  await page.waitForTimeout(80);
}

async function captureRotationProof(page, name) {
  await positionLensForScreenshot(page);
  const screenshotPath = path.join(
    OUTPUT_DIR,
    `signal-transfer-${name}-390x844.png`,
  );
  await page.screenshot({ path: screenshotPath, fullPage: false });
  return screenshotPath;
}

async function waitForRouteProgress(page, activeMode, progress) {
  await page.waitForFunction(
    ({ expectedMode, minimumProgress }) => {
      const lens = document.querySelector("[data-adaptive-stack-lens]");
      const beam = document.querySelector(
        innerWidth >= 1180
          ? "[data-signal-route-orbit] [data-signal-route-beam]"
          : "[data-signal-route-linear] [data-signal-route-beam]",
      );
      const animation = beam?.getAnimations()[0];
      const intervalMs = Number(lens?.getAttribute("data-rotation-interval-ms"));
      return (
        lens?.getAttribute("data-active-mode") === expectedMode &&
        Number(animation?.currentTime ?? 0) >= intervalMs * minimumProgress
      );
    },
    { expectedMode: activeMode, minimumProgress: progress },
    { timeout: 7_000 },
  );
}

async function setSignalRouteProgress(page, progress) {
  await page.evaluate((routeProgress) => {
    const lens = document.querySelector("[data-adaptive-stack-lens]");
    const intervalMs = Number(lens?.getAttribute("data-rotation-interval-ms"));
    for (const animation of lens.getAnimations({ subtree: true })) {
      if (
        /lens-(?:route-beam-travel|linear-route-beam|signal-target)/.test(
          animation.animationName ?? "",
        )
      ) {
        animation.currentTime = intervalMs * routeProgress;
      }
    }
  }, progress);
  await page.waitForTimeout(20);
}

async function captureProgressProof(page, proofViewport, name) {
  await positionLensForScreenshot(page);
  const screenshotPath = path.join(
    OUTPUT_DIR,
    `route-beam-${proofViewport.family}-${name}-${viewportLabel(proofViewport)}.png`,
  );
  await page.screenshot({ path: screenshotPath, fullPage: false });
  return screenshotPath;
}

async function prepareRunningProgressPage(page, proofViewport) {
  await page.setViewportSize({
    width: proofViewport.width,
    height: proofViewport.height,
  });
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await hideDevelopmentTools(page);
  await positionLensForScreenshot(page);
  await page.mouse.move(1, 1);
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-auto-rotation") === "running",
  );
}

async function validateProgressProofViewport(browser, proofViewport) {
  const context = await browser.newContext({
    viewport: { width: proofViewport.width, height: proofViewport.height },
  });
  const page = await context.newPage();
  const failures = [];
  const measurements = [];
  const screenshotPaths = [];
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await prepareRunningProgressPage(page, proofViewport);
  const initialMode = (await automaticRotationState(page)).activeMode;
  await page.locator("[data-rotation-toggle]").click();
  for (const phase of progressProofPhases) {
    await setSignalRouteProgress(page, phase.progress);
    const state = await automaticRotationState(page);
    measurements.push({ name: phase.name, ...state });
    if (
      state.activeMode !== initialMode ||
      state.routeBeamProgress === null ||
      state.routeBeamProgress < phase.range[0] ||
      state.routeBeamProgress > phase.range[1] ||
      (phase.progress === 0
        ? state.routeBeamOpacity > 0.01
        : state.routeBeamOpacity < 0.5)
    ) {
      failures.push(
        `${phase.name} beam position ${state.routeBeamProgress?.toFixed(3) ?? "missing"}`,
      );
    }
    if (phase.name === "near-destination" && state.routeTargetPulseOpacity > 0.05) {
      failures.push("destination pulsed before beam arrival");
    }
    screenshotPaths.push(
      await captureProgressProof(page, proofViewport, phase.name),
    );
  }

  await setSignalRouteProgress(page, 0.925);
  const destinationPulse = await automaticRotationState(page);
  if (
    destinationPulse.routeBeamProgress === null ||
    destinationPulse.routeBeamProgress < 0.98 ||
    destinationPulse.routeBeamOpacity > 0.05 ||
    destinationPulse.routeTargetPulseOpacity <= 0.05 ||
    destinationPulse.activeMode !== initialMode
  ) {
    failures.push("destination pulse is not sequenced after beam arrival");
  }
  measurements.push({ name: "destination-pulse", ...destinationPulse });
  screenshotPaths.push(
    await captureProgressProof(page, proofViewport, "destination-pulse"),
  );

  await prepareRunningProgressPage(page, proofViewport);
  const pauseMode = (await automaticRotationState(page)).activeMode;
  await waitForRouteProgress(page, pauseMode, 0.5);
  await page.locator("[data-rotation-toggle]").click();
  const paused = await automaticRotationState(page);
  await page.waitForTimeout(600);
  const held = await automaticRotationState(page);
  if (
    paused.routeBeamProgress === null ||
    held.routeBeamProgress === null ||
    Math.abs(paused.routeBeamProgress - held.routeBeamProgress) > 0.015 ||
    held.activeMode !== pauseMode
  ) {
    failures.push("paused proof did not freeze beam position");
  }
  measurements.push({ name: "paused", ...paused });
  screenshotPaths.push(
    await captureProgressProof(page, proofViewport, "paused-mid-route"),
  );
  measurements.push({ name: "paused-held", ...held });
  screenshotPaths.push(
    await captureProgressProof(page, proofViewport, "paused-held"),
  );

  await page.locator("[data-rotation-toggle]").click();
  await page.mouse.move(1, 1);
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  await page.waitForTimeout(180);
  const resumed = await automaticRotationState(page);
  if (
    resumed.routeBeamProgress === null ||
    paused.routeBeamProgress === null ||
    resumed.routeBeamProgress <= paused.routeBeamProgress ||
    resumed.routeBeamProgress > paused.routeBeamProgress + 0.08
  ) {
    failures.push("resumed proof did not continue from paused beam position");
  }
  measurements.push({ name: "resumed", ...resumed });
  screenshotPaths.push(
    await captureProgressProof(page, proofViewport, "resumed-route"),
  );

  await page.waitForFunction(
    (previousMode) =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-active-mode") !== previousMode,
    pauseMode,
    { timeout: paused.intervalMs + 1_000 },
  );
  await page.waitForTimeout(450);
  const handoff = await automaticRotationState(page);
  measurements.push({ name: "card-after-transition", ...handoff });
  screenshotPaths.push(
    await captureProgressProof(page, proofViewport, "card-after-transition"),
  );

  await page.evaluate(() => {
    document.querySelector('[data-lens-context="nabd"]')?.click();
  });
  await setSignalRouteProgress(page, 0.5);
  const wrap = await automaticRotationState(page);
  if (
    !wrap.routeWrap ||
    wrap.routeDirection !== "return" ||
    wrap.routeBeamProgress === null ||
    wrap.routeBeamProgress < 0.45 ||
    wrap.routeBeamProgress > 0.62 ||
    wrap.routeBeamOpacity < 0.5
  ) {
    failures.push("04 to 01 proof is not a visible mid-route reverse beam");
  }
  measurements.push({ name: "wrap-50-percent", ...wrap });
  screenshotPaths.push(
    await captureProgressProof(page, proofViewport, "wrap-50-percent"),
  );

  await context.close();

  return {
    errors,
    failures: unique([...failures, ...errors]),
    measurements,
    screenshotPaths,
    viewport: proofViewport,
  };
}

async function validateProgressProofs(browser) {
  const results = [];
  for (const proofViewport of progressProofViewports) {
    results.push(await validateProgressProofViewport(browser, proofViewport));
  }
  return results;
}

async function validateAutomaticRotation(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const failures = [];
  const phaseStates = [];
  const screenshotPaths = [];
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await hideDevelopmentTools(page);
  await positionLensForScreenshot(page);
  await page.mouse.move(1, 1);
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-auto-rotation") === "running",
  );

  const initial = await automaticRotationState(page);
  if (
    initial.routeFrom !== initial.activeIndex ||
    initial.routeTo !== (initial.activeIndex + 1) % projects.length ||
    initial.routeAnimationPlayState !== "running" ||
    initial.routeBeamProgress === null ||
    initial.routeBeamProgress > 0.05
  ) {
    failures.push("initial Signal Transfer state is not synchronized");
  }
  phaseStates.push({ name: "initial", ...initial });
  screenshotPaths.push(await captureRotationProof(page, "initial"));

  const routePhases = [
    { name: "25-percent", progress: 0.25, range: [0.2, 0.35] },
    { name: "50-percent", progress: 0.5, range: [0.45, 0.65] },
    { name: "75-percent", progress: 0.75, range: [0.7, 0.85] },
    { name: "near-destination", progress: 0.88, range: [0.82, 0.96] },
    { name: "destination-pulse", progress: 0.925, range: [0.98, 1] },
  ];
  for (const phase of routePhases) {
    await waitForRouteProgress(page, initial.activeMode, phase.progress);
    const phaseState = await automaticRotationState(page);
    phaseStates.push({ name: phase.name, ...phaseState });
    if (phaseState.activeMode !== initial.activeMode) {
      failures.push(`${phase.name} changed project before route completion`);
    }
    if (
      phaseState.routeBeamProgress === null ||
      phaseState.routeBeamProgress < phase.range[0] ||
      phaseState.routeBeamProgress > phase.range[1]
    ) {
      failures.push(
        `${phase.name} beam position ${phaseState.routeBeamProgress?.toFixed(3) ?? "missing"}`,
      );
    }
    if (
      phase.name === "destination-pulse" &&
      (phaseState.routeTargetPulseOpacity <= 0.05 ||
        phaseState.routeBeamOpacity > 0.05)
    ) {
      failures.push("destination pulse did not follow beam arrival");
    }
    if (
      phase.name === "near-destination" &&
      phaseState.routeTargetPulseOpacity > 0.05
    ) {
      failures.push("destination node pulsed before beam arrival");
    }
    screenshotPaths.push(await captureRotationProof(page, phase.name));
  }

  await page.waitForFunction(
    (initialMode) =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-active-mode") !== initialMode,
    initial.activeMode,
    { timeout: initial.intervalMs + 1_000 },
  );
  await page.waitForTimeout(450);
  const advanced = await automaticRotationState(page);
  if (advanced.activeMode === initial.activeMode) {
    failures.push("automatic rotation did not advance after one interval");
  }
  if (advanced.cardTitle === initial.cardTitle) {
    failures.push("project card did not transition after destination arrival");
  }
  phaseStates.push({ name: "card-handoff", ...advanced });
  screenshotPaths.push(await captureRotationProof(page, "card-handoff"));

  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-active-index") === "3",
    null,
    { timeout: initial.intervalMs + 1_000 },
  );
  const wrapStart = await automaticRotationState(page);
  if (!wrapStart.routeWrap || wrapStart.routeDirection !== "return") {
    failures.push("04 to 01 route is not marked as return/wrap");
  }
  await waitForRouteProgress(page, wrapStart.activeMode, 0.5);
  const wrapMidTransfer = await automaticRotationState(page);
  if (
    wrapMidTransfer.routeBeamProgress === null ||
    wrapMidTransfer.routeBeamProgress < 0.45 ||
    wrapMidTransfer.routeBeamProgress > 0.65 ||
    wrapMidTransfer.routeBeamOpacity < 0.5
  ) {
    failures.push("04 to 01 beam is not visible mid-route at 50 percent");
  }
  phaseStates.push({ name: "wrap-mid-transfer", ...wrapMidTransfer });
  screenshotPaths.push(await captureRotationProof(page, "wrap-mid-transfer"));

  const beforeExplicitPause = await automaticRotationState(page);
  await page.locator("[data-rotation-toggle]").click();
  const paused = await automaticRotationState(page);
  if (paused.togglePressed !== "true" || paused.toggleLabel !== "Resume project rotation") {
    failures.push("pause control semantics are incorrect");
  }
  phaseStates.push({ name: "paused-mid-route", ...paused });
  screenshotPaths.push(await captureRotationProof(page, "paused-mid-route"));
  await page.waitForTimeout(1_500);
  const heldPause = await automaticRotationState(page);
  if (heldPause.activeMode !== paused.activeMode) {
    failures.push("explicit pause did not stop rotation");
  }
  if (
    Math.abs(
      heldPause.routeAnimationCurrentTime - beforeExplicitPause.routeAnimationCurrentTime,
    ) > 120
  ) {
    failures.push("explicit pause did not preserve Signal Transfer progress");
  }
  if (
    paused.routeBeamProgress === null ||
    heldPause.routeBeamProgress === null ||
    Math.abs(heldPause.routeBeamProgress - paused.routeBeamProgress) > 0.015
  ) {
    failures.push("explicit pause changed beam position");
  }

  await page.locator("[data-rotation-toggle]").click();
  await page.mouse.move(1, 1);
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-auto-rotation") === "running",
  );
  await page.waitForTimeout(250);
  const resumedRoute = await automaticRotationState(page);
  if (
    resumedRoute.activeMode !== paused.activeMode ||
    resumedRoute.routeBeamProgress === null ||
    paused.routeBeamProgress === null ||
    resumedRoute.routeBeamProgress <= paused.routeBeamProgress ||
    resumedRoute.routeBeamProgress > paused.routeBeamProgress + 0.1
  ) {
    failures.push("beam did not continue from paused position");
  }
  phaseStates.push({ name: "resumed-route", ...resumedRoute });
  screenshotPaths.push(await captureRotationProof(page, "resumed-route"));
  const remainingTransferMs = Math.max(
    0,
    initial.intervalMs - paused.routeAnimationCurrentTime,
  );
  await page.waitForFunction(
    (pausedMode) =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-active-mode") !== pausedMode,
    paused.activeMode,
    { timeout: remainingTransferMs + 1_000 },
  );

  await page.locator("[data-adaptive-stack-lens]").hover();
  const hoverPaused = await automaticRotationState(page);
  await page.waitForTimeout(initial.intervalMs + 350);
  const heldHover = await automaticRotationState(page);
  if (heldHover.activeMode !== hoverPaused.activeMode) {
    failures.push("pointer hover did not pause rotation");
  }
  if (
    heldHover.routeBeamProgress === null ||
    hoverPaused.routeBeamProgress === null ||
    Math.abs(heldHover.routeBeamProgress - hoverPaused.routeBeamProgress) > 0.015
  ) {
    failures.push("pointer hover changed beam position");
  }
  await page.mouse.move(1, 1);

  await page.locator("[data-project-selector] button").first().focus();
  const focusPaused = await automaticRotationState(page);
  await page.waitForTimeout(initial.intervalMs + 350);
  const heldFocus = await automaticRotationState(page);
  if (heldFocus.activeMode !== focusPaused.activeMode) {
    failures.push("focus within navigator did not pause rotation");
  }
  if (
    heldFocus.routeBeamProgress === null ||
    focusPaused.routeBeamProgress === null ||
    Math.abs(heldFocus.routeBeamProgress - focusPaused.routeBeamProgress) > 0.015
  ) {
    failures.push("focus pause changed beam position");
  }
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  });

  await page.evaluate(() => {
    const controls = [...document.querySelectorAll("[data-lens-context]")];
    const activeIndex = controls.findIndex(
      (control) => control.getAttribute("data-active") === "true",
    );
    controls[(activeIndex + 1) % controls.length]?.click();
  });
  const manualSelection = await automaticRotationState(page);
  if (!manualSelection.cooldown) failures.push("manual selection did not start cooldown");
  if (
    manualSelection.routeBeamProgress === null ||
    manualSelection.routeBeamProgress > 0.01 ||
    manualSelection.routeBeamOpacity > 0.01
  ) {
    failures.push("manual selection did not reset route beam");
  }
  await page.waitForTimeout(initial.intervalMs + 350);
  if ((await automaticRotationState(page)).activeMode !== manualSelection.activeMode) {
    failures.push("manual selection cooldown released too early");
  }
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-rotation-cooldown") === "false",
    null,
    { timeout: manualSelection.selectionCooldownMs + 1_000 },
  );
  await page.waitForTimeout(initial.intervalMs + 350);
  if ((await automaticRotationState(page)).activeMode === manualSelection.activeMode) {
    failures.push("rotation did not resume after manual-selection cooldown");
  }

  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const hiddenState = await automaticRotationState(page);
  await page.waitForTimeout(initial.intervalMs + 350);
  const heldHidden = await automaticRotationState(page);
  if (heldHidden.activeMode !== hiddenState.activeMode) {
    failures.push("hidden document did not pause rotation");
  }
  if (
    heldHidden.routeBeamProgress === null ||
    hiddenState.routeBeamProgress === null ||
    Math.abs(heldHidden.routeBeamProgress - hiddenState.routeBeamProgress) > 0.015
  ) {
    failures.push("hidden document changed beam position");
  }
  await page.evaluate(() => {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-auto-rotation") === "running",
  );
  await page.waitForFunction(
    (pausedMode) =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-active-mode") !== pausedMode,
    hiddenState.activeMode,
    { timeout: initial.intervalMs + 1_000 },
  );

  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-in-viewport") === "false",
  );
  const offscreenState = await automaticRotationState(page);
  await page.waitForTimeout(initial.intervalMs + 350);
  const heldOffscreen = await automaticRotationState(page);
  if (heldOffscreen.activeMode !== offscreenState.activeMode) {
    failures.push("offscreen navigator did not pause rotation");
  }
  if (
    heldOffscreen.routeBeamProgress === null ||
    offscreenState.routeBeamProgress === null ||
    Math.abs(heldOffscreen.routeBeamProgress - offscreenState.routeBeamProgress) > 0.015
  ) {
    failures.push("offscreen pause changed beam position");
  }
  await positionLensForScreenshot(page);
  await page.mouse.move(1, 1);
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-auto-rotation") === "running",
  );
  await page.waitForFunction(
    (pausedMode) =>
      document
        .querySelector("[data-adaptive-stack-lens]")
        ?.getAttribute("data-active-mode") !== pausedMode,
    offscreenState.activeMode,
    { timeout: initial.intervalMs + 1_000 },
  );

  await context.close();
  return {
    errors,
    failures: unique([...failures, ...errors]),
    phaseStates,
    screenshotPaths,
  };
}

function geometryDelta(first, second) {
  const rects = ["card", "composition", "narrative", "orbit", "selectedWork"];
  const rectDelta = (left, right) =>
    Math.max(
      Math.abs(left.docLeft - right.docLeft),
      Math.abs(left.docTop - right.docTop),
      Math.abs(left.width - right.width),
      Math.abs(left.height - right.height),
    );
  return Math.max(
    ...rects.map((key) => rectDelta(first[key], second[key])),
    ...first.controls.map((control, index) =>
      rectDelta(control, second.controls[index]),
    ),
  );
}

async function validateDprComparison(browser, viewport) {
  const measurements = [];
  const screenshotPaths = [];
  const failures = [];

  for (const deviceScaleFactor of [1, 2]) {
    const context = await browser.newContext({ deviceScaleFactor, viewport });
    const page = await context.newPage();
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await hideDevelopmentTools(page);
    const measurement = await measureLayout(page);
    measurements.push(measurement);
    failures.push(
      ...layoutFailures(measurement, expectedMode(viewport.width)).map(
        (failure) => `DPR ${deviceScaleFactor}: ${failure}`,
      ),
      ...errors.map((error) => `DPR ${deviceScaleFactor}: ${error}`),
    );
    const screenshotPath = path.join(
      OUTPUT_DIR,
      `hero-${viewportLabel(viewport)}-dpr${deviceScaleFactor}.png`,
    );
    await page.screenshot({ path: screenshotPath, fullPage: false });
    screenshotPaths.push(screenshotPath);
    await context.close();
  }

  const maximumGeometryDelta = geometryDelta(measurements[0], measurements[1]);
  if (maximumGeometryDelta > 0.5) {
    failures.push(`DPR changed CSS geometry ${maximumGeometryDelta.toFixed(3)}px`);
  }

  return {
    failures: unique(failures),
    maximumGeometryDelta,
    measurements: measurements.map((measurement) => ({
      devicePixelRatio: measurement.devicePixelRatio,
      documentScrollHeight: measurement.documentScrollHeight,
      horizontalOverflow: measurement.horizontalOverflow,
      mode: expectedMode(viewport.width),
      visualViewportHeight: measurement.visualViewportHeight,
      visualViewportScale: measurement.visualViewportScale,
      visualViewportWidth: measurement.visualViewportWidth,
      viewportHeight: measurement.viewportHeight,
      viewportWidth: measurement.viewportWidth,
    })),
    screenshotPaths,
    viewport,
  };
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch(
  fs.existsSync(CHROME_PATH) ? { executablePath: CHROME_PATH, headless: true } : { headless: true },
);
const checkpointOnly = process.argv.includes("--checkpoint");

if (checkpointOnly) {
  const progressProofs = await validateProgressProofs(browser);
  await browser.close();
  const failures = unique(
    progressProofs.flatMap((proof) =>
      proof.failures.map(
        (failure) => `${proof.viewport.family} beam proof: ${failure}`,
      ),
    ),
  );
  const checkpointReport = {
    baseUrl: BASE_URL,
    generatedAt: new Date().toISOString(),
    progressProofs,
    summary: {
      failures,
      passed: failures.length === 0,
      viewportCount: progressProofs.length,
    },
  };
  fs.writeFileSync(
    CHECKPOINT_REPORT_PATH,
    `${JSON.stringify(checkpointReport, null, 2)}\n`,
  );
  console.log(JSON.stringify(checkpointReport.summary, null, 2));
  if (!checkpointReport.summary.passed) process.exitCode = 1;
} else {
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
const automaticRotation = await validateAutomaticRotation(browser);
const progressProofs = await validateProgressProofs(browser);
const dprComparisons = [];
for (const viewport of dprViewports) {
  dprComparisons.push(await validateDprComparison(browser, viewport));
}
await browser.close();

const failures = unique([
  ...viewportResults.flatMap((result) =>
    result.failures.map(
      (failure) => `${viewportLabel(result.viewport)} (${result.mode}): ${failure}`,
    ),
  ),
  ...consoleErrors.map((error) => `console error: ${error}`),
  ...hydrationWarnings.map((warning) => `hydration warning: ${warning}`),
  ...automaticRotation.failures.map(
    (failure) => `automatic rotation: ${failure}`,
  ),
  ...progressProofs.flatMap((proof) =>
    proof.failures.map(
      (failure) => `${proof.viewport.family} progress proof: ${failure}`,
    ),
  ),
  ...dprComparisons.flatMap((comparison) =>
    comparison.failures.map(
      (failure) => `${viewportLabel(comparison.viewport)}: ${failure}`,
    ),
  ),
  ...(reducedMotion.passed ? [] : ["reduced-motion validation failed"]),
]);

const report = {
  baseUrl: BASE_URL,
  automaticRotation,
  consoleErrors,
  dprComparisons,
  generatedAt: new Date().toISOString(),
  hydrationWarnings,
  progressProofs,
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
}
