# Hero V2 Motion and Signal Contract

> [!IMPORTANT]
> This document describes a protected production UI contract.
> Source code remains authoritative. If this document conflicts with current
> source, stop and reconcile the discrepancy before editing.

Last verified against `hero-v2-responsive-rebuild` at
`9f8b06719793a20b79d3795606543e7a231cd4d5`.

## Signal layers

| Layer | Desktop implementation | Tablet/mobile implementation | Responsibility |
| --- | --- | --- | --- |
| Muted frame | Four `.orbitBoundary` paths rendered from `ORBIT_FRAME_SEGMENTS` | Desktop frame hidden | Shows full four-edge system topology. |
| Active route track | `.signalRouteOrbitTrack` using selected `desktopPath` | Full linear rail plus `.signalRouteLinearSegment::after` | Identifies the route that progress follows without owning progress timing. |
| Progress | `.signalRouteOrbitProgress` | `.signalRouteLinearProgress` | Draws completed portion using shared `--signal-progress`. |
| Luminous head | `.signalRouteOrbitHead` | `.signalRouteLinearHead` | Marks current frontier with a restrained stronger core and halo. |
| Destination state | `data-signal-route-target="true"` marker pseudo-element | Same marker state | Pulses near arrival without changing selected project early. |

`AdaptiveStackLens` renders one `AdaptiveSignalRoute`. Desktop track, progress,
and head use the selected generated path. The corresponding frame segment uses
the same generated `d`.

## Geometry, core, and glow are different contracts

| Concept | Meaning | Owner |
| --- | --- | --- |
| Geometric path | Exact centerline and route topology | Solely `adaptive-orbit-geometry.ts`; `adaptive-signal-route.tsx` is a renderer/consumer |
| Solid core thickness | Stroke width or linear element cross-axis size | Shared CSS thickness tokens |
| Glow/halo | Filter or box-shadow outside the core | CSS glow tokens and color-mix opacity |
| Head width | Slightly stronger frontier core | `--signal-route-head-thickness` |
| Perceived thickness | Combined core, opacity, cap, overlap, and halo | Must be judged from computed style and rendered pixels |

Changing blur does not change geometric path or solid core. Changing stroke
width does. Diagnose them separately.

## Thickness and hierarchy contract

Current source-of-truth tokens on `.stackLens`:

```scss
--signal-route-core-thickness: 1px;
--signal-route-head-thickness: 1.5px;
--signal-route-glow-radius: 0.1rem;
--signal-route-head-inner-glow-radius: 0.12rem;
--signal-route-head-outer-glow-radius: 0.3rem;
```

At the current `16px` root size:

| Layer | Solid core | Element opacity | Color alpha / halo |
| --- | ---: | ---: | --- |
| Muted SVG frame | `1px` non-scaling stroke | `1` | stroke color alpha `27%` |
| Active SVG track | `1px` | `1` | stroke color alpha `24%`; no filter |
| SVG progress | `1px` | `1` | `1.6px` drop-shadow at `42%` lens accent |
| SVG head | `1.5px` | `1` | `1.92px` at `78%` plus `4.8px` at `42%` |
| Linear active segment base | `1px` | `1` | background color alpha `34%` |
| Linear progress | `1px` | `1` | `1.6px` box-shadow at `42%` |
| Linear head | `1.5px` cross-axis | `1` | `1.92px` at `78%` plus `4.8px` at `42%` |

SVG track, progress, and head use `strokeLinecap="round"` and
`vectorEffect="non-scaling-stroke"`. Linear layers use matching shared core
tokens on their cross axis.

The immutable hierarchy is:

```text
track solid core === progress solid core
head solid core may be slightly stronger
glow stays outside the core
```

The known cable-over-wire regression used a `1px` track under a `2px` progress
stroke, with additional glow. Even when centerlines matched, the progress looked
like a separate cable. Do not diagnose this from custom-property declarations
alone: inspect computed styles on rendered track, progress, and head.

## Shared progress frontier

The stylesheet registers one inherited number:

```scss
@property --signal-progress {
  syntax: "<number>";
  inherits: true;
  initial-value: 0;
}
```

`.signalRoute` owns that property. Progress dash offset, head dash offset,
tablet scale/position, mobile scale/position, and reverse-wrap position all read
the same value. No layer may introduce its own progress clock.

Required runtime acceptance:

- progress/head frontier difference is effectively `0px` at 20%, 50%, and 80%;
- all active SVG layers use the same `d`;
- desktop uses the same viewBox and transform plane for both layers;
- linear progress and head use the same segment and direction metadata.

## Animation timing

| Contract | Current source |
| --- | --- |
| Rotation interval and route duration | `PROJECT_ROTATION_INTERVAL_MS = 6000` |
| Frame draw duration | `--orbit-frame-draw-duration: 1100ms` |
| Frame draw delay | `120ms` |
| Signal arrival | `--signal-progress: 1` at `94%` |
| Arrival time at 6000ms | `5640ms` |
| Project rotation | One pausable clock elapses at `6000ms` |
| Destination pulse hidden | `0%-94%` |
| Destination pulse peak | `97%` |
| Destination pulse settled | `100%` |
| Manual selection cooldown | `PROJECT_SELECTION_COOLDOWN_MS = 11000` |
| Viewport activity threshold | intersection ratio `>= 0.35` |

During an uninterrupted automatic cycle with an unchanged route key, the route
arrives before the scheduled project change. The `360ms` nominal interval
between `5640ms` and `6000ms` provides the visual handoff. Hover/focus preview
and manual selection intentionally change `activeIndex` immediately; because
route indices participate in the React key, those interactions start the newly
selected/previewed route at its origin. Do not shorten the clock or move arrival
later without proving automatic destination timing remains correct.

## Auto-rotation ownership

`createProjectRotationClock()` owns one timeout and a `remainingMs` value.

- `pause()` stores `deadline - Date.now()` and clears the timeout.
- `resume()` schedules only when no timer exists.
- after elapsed, the clock resets to `6000ms`, rotates, and schedules again.
- `reset()` restores a full interval after manual selection.
- `dispose()` clears the timer on unmount.

`shouldRotateProjects()` requires all of these conditions:

- more than one project;
- effective motion is not Reduced;
- lens intersection ratio is at least `0.35`;
- document is visible;
- pointer/focus/cooldown interaction is not holding;
- user pause is not active.

Pointer enter, focus, press cooldown, manual selection cooldown, document
visibility, and offscreen state produce HOLD/paused behavior. Manual selection
also increments `revision`, intentionally starts a new selected route, resets
the rotation clock, and starts the `11000ms` cooldown.

## Motion preference states

Current priority is:

1. development-only `?motionOverride=full`;
2. explicit stored `full` or `reduced` under
   `portfolio-motion-preference-v4`;
3. Full as public fallback.

OS reduced motion is reported as `systemReduced` for diagnostics. It does not
override the Full fallback in `resolveEffectiveMotion()`.

| State | Effective motion | Route animation | Progress/head | Frame | Rotation control |
| --- | --- | --- | --- | --- | --- |
| Full | `full` | One route animation when all activity gates pass | Visible | Draws over `1100ms` after `120ms` delay | Enabled; status AUTO/HOLD/PAUSED |
| OS Reduced plus stored Full | `full` | Same as Full | Visible | Same as Full | Enabled |
| OS Reduced with no stored choice | `full` | Same as Full under current policy | Visible | Same as Full | Enabled |
| Explicit Reduced | `reduced` | None | Hidden with `display: none` | Visible statically with dash offset reset | Disabled; status STATIC |
| HOLD with unchanged route key | `full` | Existing animation play state paused | Frozen at current frontier | Unchanged | Status HOLD |
| User pause | `full` | Existing animation play state paused | Frozen at current frontier | Unchanged | Status PAUSED |
| Resume with unchanged route key | `full` | Continues existing animation and remaining clock | Continues from frozen frontier | Unchanged | Returns to AUTO when other gates pass |
| Hover/focus preview during HOLD | `full` | Route key changes to preview route | New preview route begins at its origin; leaving may restore/remount pinned route | Unchanged | Clock remainder stays paused until interaction clears |

The bootstrap script writes `data-effective-motion` before hydration. The
provider re-reads media and development override after hydration to avoid
clobbering bootstrap state with a server snapshot.

## Critical invariants

- exactly one active `AdaptiveSignalRoute` exists;
- one advancing route animation exists in running Full state;
- uninterrupted automatic destination does not change before signal arrival;
- progress and head use one `--signal-progress` frontier;
- frontier difference is effectively zero at 20%, 50%, and 80%;
- stable-key HOLD freezes animation current time and rotation-clock remainder;
- stable-key resume continues rather than restarting;
- hover/focus preview is tested separately because changing `activeIndex`
  intentionally changes the route key and remounts that route;
- preview does not increment selection revision;
- selection increments revision exactly once;
- explicit Reduced has zero active route animations;
- explicit Reduced hides progress and head, not the static frame;
- frame, track, progress, and head path identity remains exact;
- changing a React key, revision, route path, or animation name requires a
  remount/restart regression check.

## Dasharray endpoint warning

SVG duplicates an odd-length dash list. Therefore:

```scss
stroke-dasharray: 100;
```

is interpreted as an effective repeating `100 100` pattern. On a normalized
`pathLength="100"` path, the next repeated dash begins exactly at the path end.
With a round line cap, it can appear as a dot before travel starts.

Approved current patterns deliberately use gaps longer than the normalized
path:

```scss
.signalRouteOrbitProgress {
  stroke-dasharray: 100 200;
}

.signalRouteOrbitHead {
  stroke-dasharray: 1 200;
}
```

Do not simplify these to odd single-value patterns. Any dash change must be
tested at animation start, arrival, completion, and route remount.

## Adjustable visual tokens

Halo radius and halo color-mix percentages are adjustable visual tokens only
when computed core equality remains exact and rendered hierarchy is checked on
desktop, tablet, and mobile. Duration, arrival percentage, shared frontier,
path identity, pause semantics, and effective-motion policy are protected
behavior.

## Verification status

- Branch: `hero-v2-responsive-rebuild`
- Commit: `9f8b06719793a20b79d3795606543e7a231cd4d5`
- Verified files: `src/components/portfolio/hero/adaptive-orbit-geometry.ts`, `src/components/portfolio/hero/adaptive-signal-route.tsx`, `src/components/portfolio/hero/adaptive-stack-lens.tsx`, `src/components/portfolio/hero/use-project-auto-rotation.ts`, `src/styles/portfolio/adaptive-engineer-hero.module.scss`, `src/lib/motion-preference.ts`, `src/lib/motion-preference-context.tsx`
- Verification date: `2026-08-04`
- Documentation-only change: Yes
