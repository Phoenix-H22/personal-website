# Hero V2 Regression Playbook

> [!IMPORTANT]
> This document describes a protected production UI contract.
> Source code remains authoritative. If this document conflicts with current
> source, stop and reconcile the discrepancy before editing.

Last verified against `hero-v2-responsive-rebuild` at
`9f8b06719793a20b79d3795606543e7a231cd4d5`.

## Triage order

1. Confirm route, hydration, explicit CSS viewport, zoom/scale, and effective
   motion state.
2. Confirm current Git diff and one repository-owned server.
3. Measure element existence, matched media queries, overflow, and computed
   layout tokens.
4. Verify generated path identity before changing visual styling.
5. Separate geometry, solid core, glow, opacity, and duplicate-layer causes.
6. Reproduce all four projects/routes and adjacent breakpoints.
7. Apply the smallest correction in the owning layer.
8. Repeat the same measurements.

Do not start from a screenshot interpretation or a remembered prior fix.

## 1. Connector touches a marker

**Symptom:** A route endpoint enters or touches marker outline.

**Likely causes:** Marker radius no longer derives from marker size; connector
gap differs from `6` SVG units; route and marker use different coordinate
systems; a consumer introduced an independent path formula; CSS changed orbit
aspect ratio or created letterboxing.

**What to measure:** Active `d`; orbit/viewBox ratio; marker center and radius;
endpoint-to-marker-edge distance; frame/track/progress/head identity; anchor
error at all four markers.

**What not to do:** Translate one marker, shorten one path string, add a pixel
offset, or calculate a route from DOM rectangles.

**Safe correction direction:** Restore `ORBIT_GEOMETRY.marker.size`,
`connectorGap`, `getConnectorGap()`, shared viewBox/aspect ratio, or the one
generated consumer path.

**Acceptance criteria:** Normal endpoint clearance is positive and scales from
the semantic `6`-unit gap; no anchor drift; all path layers remain identical.

## 2. Connector overlaps labels 02 or 04

**Symptom:** Vertical side route crosses or touches a side label.

**Likely causes:** `sideLabelClearance` was removed; label font/gap scales on a
different plane; side route endpoint changed; `--signal-node-radius` came from
the base `2rem` marker instead of desktop container geometry.

**What to measure:** Marker and label rectangles; route point at side-label
corridor; `--desktop-orbit-label-font-size`; `--desktop-orbit-label-gap`;
`--signal-node-size`; line-to-label clearance for both 02 and 04.

**What not to do:** Move label 02 or 04 independently, add a route-specific
transform, or reduce text to hide the overlap.

**Safe correction direction:** Restore marker-relative label tokens and the
generated side offset: center gap `24` + marker radius `18` + side clearance
`12` = `54` SVG units.

**Acceptance criteria:** Both side labels have positive line clearance at every
desktop QA size; generated route strings remain unchanged unless typed geometry
evidence requires one source change.

## 3. Labels are too close to markers

**Symptom:** Orbit label appears attached to or crowded against its marker.

**Likely causes:** Fixed pixel gap tuned at one size; missing
`labelGapRatio: 0.18`; `--desktop-orbit-label-gap` outside desktop scope; label
and marker resolving against different containers.

**What to measure:** Label-to-marker edge distance for all four labels; orbit
inline size; computed marker size, label gap, and font size; nearby desktop
widths.

**What not to do:** Add per-label margins or a breakpoint for one screenshot.

**Safe correction direction:** Restore `toOrbitCqi()` output and consume
`--desktop-orbit-label-gap` with marker-relative node sizing.

**Acceptance criteria:** All four gaps stay positive and proportional while the
orbit scales; labels remain readable and clear of routes.

## 4. Wide screen feels sparse

**Symptom:** Card, frame, markers, labels, and route corridors no longer feel
like one system on wide desktop.

**Likely causes:** Orbit and card scale independently; only width participates;
a full layout model switches at `100rem`; composition gap jumps; card reaches a
fixed cap before orbit; Playwright host window is mistaken for requested page
viewport.

**What to measure:** Explicit runtime viewport; composition columns/gap; lens,
orbit, and card sizes; card/orbit ratio; card-to-marker and card-to-frame gaps;
straight segment lengths; available inline/block size; active limiting axis;
matched media queries and overflow.

**What not to do:** Add a `1920px`, `1707px`, monitor-inch, browser, or DPR
special case; assume the orbit merely needs to shrink; edit from visible host
window dimensions.

**Safe correction direction:** Keep one desktop model from `73.75rem`; derive
from container inline size, named viewport block budget, centralized aspect
ratio, proportional card size, and continuous clamps.

**Acceptance criteria:** Stable density from laptop through wide desktop; no
jump at `1599/1600`; balanced positive corridors; no collision, letterboxing,
anchor drift, or overflow.

## 5. Progress line looks thicker than base track

**Symptom:** Active progress resembles a cable laid over a thin wire.

**Likely causes:** Different solid-core widths; excessive blur/opacity; a
stronger cap style; duplicated progress/track element; filter mistaken for core.

**What to measure:** Computed stroke width or linear cross-axis size, element
opacity, color alpha, filter/box-shadow, cap, vector effect, and duplicate
visible elements.

**What not to do:** Compare only source variables or remove glow without
checking computed core equality.

**Safe correction direction:** Preserve one shared
`--signal-route-core-thickness`; tune halo separately; keep head only slightly
stronger.

**Acceptance criteria:** Track and progress compute to the same `1px` core on
desktop/tablet/mobile; head is `1.5px`; progress halo remains outside core and
does not dominate muted route.

## 6. Active edge looks heavier than other frame edges

**Symptom:** Entire selected edge is visibly heavier before progress reaches it.

**Likely causes:** Muted frame and active track overlap with excessive combined
alpha; duplicate active track markup; wrong track opacity/core; stale filter on
track.

**What to measure:** Number of frame/track elements; matching active `d`;
computed frame stroke alpha (`27%`), route-track alpha (`24%`), core widths,
filters, and forced-color state.

**What not to do:** Blindly remove the active track. It identifies the selected
route and supports path identity, debugging, and linear-route parity.

**Safe correction direction:** Confirm one frame segment plus one active track,
then adjust presentation tokens only if measured overlap exceeds approved
hierarchy.

**Acceptance criteria:** One active route track, exact path identity, restrained
pre-progress edge weight, and no loss of route diagnostics or responsive parity.

## 7. Endpoint dot appears before animation

**Symptom:** A bright dot appears at route destination before progress begins.

**Likely causes:** Odd dash list such as `stroke-dasharray: 100` repeats as
`100 100`; repeated dash begins at normalized path end; round cap paints it.

**What to measure:** Computed dasharray/dashoffset at initial frame, after
remount, near arrival, and completion.

**What not to do:** Hide the endpoint with opacity timing or remove round caps.

**Safe correction direction:** Restore non-terminating effective gaps:
progress `100 200`, head `1 200`.

**Acceptance criteria:** No destination dot at initial state or remount; normal
round cap and arrival remain intact.

## 8. Animation head and progress separate

**Symptom:** Head leads, trails, or leaves the drawn frontier.

**Likely causes:** Different progress properties; different paths/viewBoxes;
different animation durations; transform animation on one layer; incorrect head
dash offset or reverse position.

**What to measure:** Active `d` identity; one `--signal-progress`; animation
duration; progress/head screen frontier at 20%, 50%, and 80%; reverse wrap
transform origin.

**What not to do:** Add independent head keyframes or a visual translate.

**Safe correction direction:** Restore shared inherited progress property and
same path/segment coordinate plane.

**Acceptance criteria:** Effective frontier difference is `0px` at 20%, 50%,
and 80% on desktop, tablet, and mobile route presentations.

## 9. Project changes before head arrives

**Symptom:** During an uninterrupted AUTO cycle, card/destination changes while
head is still traveling.

**Likely causes:** Arrival threshold moved after `94%`; rotation interval became
shorter than `6000ms`; animation duration changed; multiple timers exist; stale
revision or selection handling triggers early remount.

**What to measure:** Route duration/count; `--signal-progress` arrival time;
active index mutation time; timer count; revision changes; whether hover/focus
preview or manual selection intentionally changed the route key.

**What not to do:** Delay card rendering independently or mask mismatch with a
transition.

**Safe correction direction:** Restore one 6000ms clock, one route animation,
and arrival at 94% (`5640ms`).

**Acceptance criteria:** In uninterrupted AUTO, head arrives before destination
change, one nominal `360ms` handoff remains, and active index changes once per
elapsed clock. Immediate preview/manual selection remains intentional and is
not misclassified as an automatic timing failure.

## 10. HOLD restarts instead of resuming

**Symptom:** Leaving a HOLD that did not change active route restarts progress
from route origin.

**Likely causes:** React key/remount changed without an active-route change;
revision incremented on pause; animation recreated; route DOM replaced;
animation name changed; clock reset instead of paused. Hover/focus preview is a
separate case: changing `activeIndex` intentionally changes the route key and
starts the preview route at its origin.

**What to measure:** Route element identity/key inputs; revision before/after
HOLD; animation current time before/during/after; clock remaining time.

**What not to do:** Save geometry/progress in a new viewport listener or add a
second timer.

**Safe correction direction:** Pause existing CSS animation via
`data-auto-rotation`; preserve route key/revision; use clock `pause()`/`resume()`.

**Acceptance criteria:** With a stable route key, current time remains unchanged
during HOLD and increases from frozen value after resume. Preview-induced route
replacement and restoration are tested separately and match current key/state
ownership.

## 11. Reduced motion hides entire frame

**Symptom:** Explicit Reduced leaves blank orbit instead of static topology.

**Likely causes:** Reduced selector targets frame with progress/head; frame dash
offset remains `1`; motion state is applied before hydration but later clobbered.

**What to measure:** `data-motion-preference`, `data-effective-motion`, lens
`data-auto-rotation`, frame display/dash offset/animation count, progress/head
display and route animation count.

**What not to do:** Hide the whole orbit or rely only on OS media state.

**Safe correction direction:** Keep frame displayed, disable animation, reset
frame dash offset to `0`, hide only progress/head/destination pulse.

**Acceptance criteria:** Explicit Reduced has zero route animations; progress
and head are hidden; static frame remains visible.

## 12. Tablet markers no longer match card height

**Symptom:** Marker 01 does not start at card top, marker 04 does not end at card
bottom, or middle markers bunch when project content changes.

**Likely causes:** Fixed selector height; card moved out of shared intrinsic row;
project-specific card height ignored; spacing calculated from viewport instead
of card-owned row.

**What to measure:** Card and selector rectangles for all four projects;
first/last marker edge offsets; three center intervals; rail-axis error.

**What not to do:** Set one height from the tallest card or measure card height
in JavaScript.

**Safe correction direction:** Restore card and selector to tablet grid row 1,
card stretch, selector stretch, and `align-content: space-between`.

**Acceptance criteria:** Card and selector heights match per project; first and
last edges align; middle intervals are equal; markers stay on rail; no overflow.

## 13. Mobile reverse route is wrong

**Symptom:** `04 -> 01` grows forward, starts from marker 01, or uses one normal
segment instead of wrapped span.

**Likely causes:** Reverse wrap treated as forward; transform origin remains
left; wrap segment boundaries use one marker interval; direction metadata lost.

**What to measure:** `data-route-from="3"`, `data-route-to="0"`,
`data-route-direction="reverse"`, `data-route-wrap="true"`; segment rectangle;
left/right six-pixel gaps; progress transform origin.

**What not to do:** Reverse project order or add a separate mobile state
machine.

**Safe correction direction:** Preserve shared metadata; use full three-interval
wrap segment and right-center transform origin.

**Acceptance criteria:** Equal marker spacing; `6px` gaps at both wrap ends;
progress travels from 04 toward 01; card stays in container.

## 14. Correct in Playwright but wrong in real browser

**Symptom:** Automated screenshot looks correct while another browser session
does not, or console diagnostics return no Hero elements.

**Likely causes:** Wrong explicit viewport; host window mistaken for page
viewport; different effective motion; wrong route; unhydrated page; stale dev
build; another server/host; browser zoom or docked DevTools confusion.

**What to measure:** Requested and runtime viewport; client/visual viewport and
scale; URL; document readiness; Hero/orbit existence; DPR; effective motion;
media queries; server listener command; current commit.

**What not to do:** Optimize production for physical monitor size, outer window
size, gray host area, or a null-selector dump from the wrong page.

**Safe correction direction:** Create a fresh explicit Playwright viewport or
correct browser route/state; verify one repository-owned server and source
version before production diagnosis.

**Acceptance criteria:** Requested `innerWidth/innerHeight` match exactly;
visual scale is intentional; Hero/orbit exist; media queries match expectation;
same source and effective motion reproduce the issue.

## 15. Correct in one viewport but broken near breakpoint

**Symptom:** Layout is acceptable at target width but card, gap, label, marker,
or route weight jumps one pixel across a threshold.

**Likely causes:** Full model switch; fixed card width; fixed composition gap;
different label-sizing rules; different track tokens; abrupt max-width;
duplicated media-query layout.

**What to measure:** Widths immediately below/at/above breakpoint; orbit/card
ratio; composition columns/gap; label/node sizes; track tokens; active limiter;
same project content.

**What not to do:** Add another breakpoint between the two failing widths.

**Safe correction direction:** Move shared rules to the common mode and use
continuous clamps/container units. Keep breakpoint only for genuine information
architecture changes such as desktop SVG versus tablet linear layout.

**Acceptance criteria:** No unexplained jump around `1599/1600`; clamp
transitions are continuous; semantic tablet/desktop mode change remains
intentional and overflow-free.

## Diagnostic snippets

> [!WARNING]
> These snippets are for browser QA only. Never copy their DOM measurements,
> temporary probes, or selectors into production geometry code.

### Viewport verification

```js
({
  href: location.href,
  readyState: document.readyState,
  innerWidth,
  innerHeight,
  clientWidth: document.documentElement.clientWidth,
  clientHeight: document.documentElement.clientHeight,
  devicePixelRatio,
  visualViewport: visualViewport
    ? {
        width: visualViewport.width,
        height: visualViewport.height,
        scale: visualViewport.scale,
      }
    : null,
  desktop: matchMedia("(min-width: 73.75rem)").matches,
  wide: matchMedia("(min-width: 100rem)").matches,
  shortHeight: matchMedia(
    "(min-width: 73.75rem) and (max-height: 50rem)",
  ).matches,
});
```

### Element existence

```js
({
  hero: Boolean(document.querySelector("[data-adaptive-engineer-hero]")),
  lens: Boolean(document.querySelector("[data-adaptive-stack-lens]")),
  orbit: Boolean(document.querySelector("[data-stack-lens-orbit]")),
  route: Boolean(document.querySelector("[data-signal-route]")),
  frame: Boolean(document.querySelector("[data-orbit-frame]")),
  card: Boolean(document.querySelector("[data-adaptive-system-core]")),
});
```

### Computed tokens

```js
(() => {
  const orbit = document.querySelector("[data-stack-lens-orbit]");
  const style = orbit ? getComputedStyle(orbit) : null;
  if (!style) return null;

  return {
    orbitInlineSize: style.getPropertyValue("--orbit-inline-size").trim(),
    availableBlockSize: style
      .getPropertyValue("--desktop-orbit-available-block-size")
      .trim(),
    aspectRatio: style.getPropertyValue("--orbit-aspect-ratio").trim(),
    cardInlineSize: style
      .getPropertyValue("--project-card-inline-size")
      .trim(),
    routeCore: style
      .getPropertyValue("--signal-route-core-thickness")
      .trim(),
    routeHead: style
      .getPropertyValue("--signal-route-head-thickness")
      .trim(),
  };
})();
```

### Path identity

```js
(() => {
  const route = document.querySelector("[data-signal-route]");
  const svg = route?.querySelector("[data-signal-route-orbit]");
  if (!route || !svg) return null;

  const segment = `${route.dataset.routeFrom}-${route.dataset.routeTo}`;
  const values = {
    frame: document
      .querySelector(`[data-frame-segment="${segment}"]`)
      ?.getAttribute("d"),
    track: svg.querySelector("[data-signal-route-track]")?.getAttribute("d"),
    progress: svg
      .querySelector("[data-signal-route-progress]")
      ?.getAttribute("d"),
    head: svg.querySelector("[data-signal-route-head]")?.getAttribute("d"),
  };

  return {
    segment,
    values,
    identical:
      Object.values(values).every(Boolean) &&
      new Set(Object.values(values)).size === 1,
  };
})();
```

### Rendered route thickness

```js
(() => {
  const readSvg = (element) => {
    if (!element) return null;
    const style = getComputedStyle(element);
    return {
      core: style.strokeWidth,
      opacity: style.opacity,
      stroke: style.stroke,
      filter: style.filter,
      linecap: style.strokeLinecap,
      vectorEffect: style.vectorEffect,
    };
  };

  const mobile = matchMedia("(max-width: 47.99rem)").matches;
  const readLinear = (element) => {
    if (!element) return null;
    const style = getComputedStyle(element);
    return {
      core: mobile ? style.height : style.width,
      opacity: style.opacity,
      background: style.background,
      boxShadow: style.boxShadow,
    };
  };

  const orbit = document.querySelector("[data-signal-route-orbit]");
  const linear = document.querySelector("[data-signal-route-linear]");

  return {
    desktop: orbit
      ? {
          track: readSvg(orbit.querySelector("[data-signal-route-track]")),
          progress: readSvg(
            orbit.querySelector("[data-signal-route-progress]"),
          ),
          head: readSvg(orbit.querySelector("[data-signal-route-head]")),
        }
      : null,
    linear: linear
      ? {
          track: readLinear(linear.querySelector("[data-signal-route-track]")),
          progress: readLinear(
            linear.querySelector("[data-signal-route-progress]"),
          ),
          head: readLinear(linear.querySelector("[data-signal-route-head]")),
        }
      : null,
  };
})();
```

For linear routes, interpret width as core on tablet and height as core on
mobile. Inspect `.signalRouteLinearSegment::after` separately when diagnosing
the active segment base.

### Marker and label rectangles

```js
(() => {
  const rect = (element) => {
    const value = element.getBoundingClientRect();
    return {
      x: value.x,
      y: value.y,
      width: value.width,
      height: value.height,
      right: value.right,
      bottom: value.bottom,
    };
  };

  return [...document.querySelectorAll("[data-project-marker]")].map(
    (marker, index) => ({
      index,
      marker: rect(marker),
      label: rect(
        document.querySelectorAll("[data-project-label]")[index],
      ),
    }),
  );
})();
```

### Motion state

```js
(() => {
  const lens = document.querySelector("[data-adaptive-stack-lens]");
  return {
    preference: document.documentElement.dataset.motionPreference ?? null,
    effective: document.documentElement.dataset.effectiveMotion,
    osReduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    autoRotation: lens?.dataset.autoRotation,
    inViewport: lens?.dataset.inViewport,
    documentVisible: lens?.dataset.documentVisible,
    cooldown: lens?.dataset.rotationCooldown,
  };
})();
```

### Animation count and duration

```js
(() => {
  const route = document.querySelector("[data-signal-route]");
  const animations = route?.getAnimations() ?? [];
  return animations.map((animation) => ({
    playState: animation.playState,
    currentTime: animation.currentTime,
    duration: animation.effect?.getComputedTiming().duration,
  }));
})();
```

### Horizontal overflow

```js
({
  clientWidth: document.documentElement.clientWidth,
  scrollWidth: document.documentElement.scrollWidth,
  overflow:
    document.documentElement.scrollWidth -
    document.documentElement.clientWidth,
});
```

## Verification status

- Branch: `hero-v2-responsive-rebuild`
- Commit: `9f8b06719793a20b79d3795606543e7a231cd4d5`
- Verified files: `src/components/portfolio/hero/adaptive-orbit-geometry.ts`, `src/components/portfolio/hero/adaptive-signal-route.tsx`, `src/components/portfolio/hero/adaptive-stack-lens.tsx`, `src/components/portfolio/hero/use-project-auto-rotation.ts`, `src/styles/portfolio/adaptive-engineer-hero.module.scss`, `src/lib/motion-preference.ts`, `src/lib/motion-preference-context.tsx`
- Verification date: `2026-08-04`
- Documentation-only change: Yes
