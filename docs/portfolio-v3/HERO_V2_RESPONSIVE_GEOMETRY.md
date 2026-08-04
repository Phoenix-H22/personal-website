# Hero V2 Responsive Geometry

> [!IMPORTANT]
> This document describes a protected production UI contract.
> Source code remains authoritative. If this document conflicts with current
> source, stop and reconcile the discrepancy before editing.

Last verified against `hero-v2-responsive-rebuild` at
`9f8b06719793a20b79d3795606543e7a231cd4d5`.

## Scope

This document owns Hero V2 responsive presentation and measurable geometry.
Typed route topology remains in
`src/components/portfolio/hero/adaptive-orbit-geometry.ts`; responsive CSS
remains in `src/styles/portfolio/adaptive-engineer-hero.module.scss`.

Pixel equivalents below assume the browser-default `16px` root size. Current
`src/styles/globals.css` does not override `html` font size.

## Breakpoint map

| Condition | Pixel equivalent | Actual responsibility |
| --- | ---: | --- |
| `max-width: 47.99rem` | `<= 767.84px` | Mobile horizontal signal track and stacked card. |
| `min-width: 48rem` and `max-width: 73.6875rem` | `768px-1179px` | Tablet vertical rail and intrinsic card/selector row. |
| `max-width: 73.6875rem` | `<= 1179px` | Hides desktop SVG frame/route and enables linear route presentation. |
| `min-width: 73.75rem` | `>= 1180px` | Desktop SVG orbit, absolute anchor markers, continuous sizing model. |
| `min-width: 73.75rem` and `max-width: 99.9375rem` | `1180px-1599px` | Laptop-only left-narrative spacing/type adjustments; not a separate orbit model. |
| `min-width: 100rem` | `>= 1600px` | Wide card-heading type adjustment only; orbit sizing remains the same continuous desktop formula. |
| `min-width: 73.75rem` and `max-height: 50rem` | width `>= 1180px`, height `<= 800px` | Condenses left-narrative typography/spacing plus shell, lens-header, and card spacing; orbit topology stays unchanged. |
| `max-width: 68.6875rem` | `<= 1099px` | Navigation switches from desktop links to menu trigger. |
| `prefers-reduced-motion: reduce` | preference query | Disables animation only when effective motion is not explicitly Full. |
| `forced-colors: active` | accessibility query | Replaces visual color/filter treatment; geometry remains unchanged. |

There is an intentional one-pixel separation between the responsive maximum
(`1179px`) and desktop minimum (`1180px`). Mobile ends immediately below the
tablet minimum (`768px`).

## Layout ownership by mode

| Mode | Orbit presentation | Marker axis | Card relationship | Route presentation |
| --- | --- | --- | --- | --- |
| Mobile | Single-column normal-flow region; no fixed aspect ratio; desktop frame hidden | Horizontal, four equal grid columns | Card owns row 3, full container width, after navigator gap | Horizontal linear rail; forward routes grow left-to-right; `04 -> 01` wrap grows from right origin |
| Tablet | Five-column grid containing labels, marker rail, gap, and card; desktop frame hidden | Vertical, four equal selector rows distributed across intrinsic card height | Card and selector share row 1; card stretches in column 5 and determines row height | Vertical linear rail; normal routes grow downward; reverse wrap grows upward |
| Desktop | `640 x 512` aspect-ratio SVG orbit with generated frame and paths | Top, right, bottom, left typed anchors | Card is centered in grid row/column 2 and scales relative to orbit container | SVG active route overlays generated frame; all path layers share one `d` |

Tablet and mobile retain the same active index, route metadata, revision, timing,
and pause state as desktop. Only presentation changes.

## Desktop sizing architecture

### Composition

From `73.75rem` upward, one formula owns composition at laptop and wide sizes:

```scss
.composition {
  grid-template-columns: minmax(0, 1fr) minmax(32rem, 0.9fr);
  gap: clamp(2rem, 2.8vw, 3.25rem);
}
```

The right column has a semantic `32rem` floor and a proportional `0.9fr`
track. The gap grows continuously from `2rem` to `3.25rem`; it does not switch
at `100rem`.

### Shell and lens

The shell distinguishes actual block-start and block-end padding:

```scss
--hero-shell-padding-block-start: var(--hero-block-padding);
--hero-shell-padding-block-end: clamp(2rem, 3vw, 3rem);
```

The lens width is bounded by its column and a continuous clamp:

```scss
width: min(100%, clamp(36rem, 36vw, 42rem));
```

The desktop lens header has an enforced block-size contract:

```scss
--lens-header-block-size: clamp(3.875rem, 4vw, 4.1875rem);
```

Enforcement matters: the height budget subtracts the row that CSS actually
renders, not an estimated remainder.

### Available block size

```scss
--desktop-orbit-available-block-size: calc(
  100svh -
  var(--header-height) -
  var(--hero-shell-padding-block-start) -
  var(--hero-shell-padding-block-end) -
  var(--lens-header-block-size) -
  var(--orbit-header-gap)
);
```

Every subtraction corresponds to a named rendered region. Do not replace this
with an unexplained reserve or subtract the start padding twice.

### Orbit inline size

`--orbit-aspect-ratio` is generated from the centralized `640 / 512` viewBox.
The orbit chooses the smallest valid constraint:

```scss
--orbit-inline-size: min(
  100%,
  clamp(34rem, 34vw, 40rem),
  calc(var(--desktop-orbit-available-block-size) * var(--orbit-aspect-ratio))
);
```

The three terms mean:

| Term | Protection |
| --- | --- |
| `100%` | Never exceed the actual lens/container inline size. |
| `clamp(34rem, 34vw, 40rem)` | Scale continuously across desktop widths with stable minimum and maximum density. |
| available block size times aspect ratio | Preserve the `640 / 512` shape on short viewports without clipping or letterboxing. |

Current internal tracks also scale continuously:

```scss
--orbit-side-track: clamp(5rem, 5.8vw, 7rem);
--orbit-top-track: clamp(3rem, 3.4vw, 4.25rem);
--orbit-bottom-track: var(--orbit-top-track);
```

### Card and marker proportions

The card scales in orbit container-query units:

```scss
--project-card-inline-size: clamp(21rem, 61.75cqi, 24.75rem);
```

The `61.75cqi` term preserves the established `34rem` desktop orbit/card
density while both scale. Marker diameter, label gap, and label font size come
from `ORBIT_GEOMETRY_STYLE`, also in `cqi`, so they remain in the same
coordinate plane.

### Short-height desktop

At desktop widths and height `<= 50rem` (`800px`), CSS changes semantic layout
tokens rather than introducing screen-specific geometry:

```scss
--hero-shell-padding-block-start: 1.5rem;
--hero-shell-padding-block-end: 1.5rem;
--lens-header-block-size:
  calc(clamp(3.875rem, 4vw, 4.1875rem) + 0.65rem);
--project-card-padding: 1.25rem;
```

The same orbit formula then resolves against the reduced block budget.
The same short-height query also reduces name/statement size and margins, plus
summary, toolchain, fundamentals, proof-ribbon, and action spacing. Those are
content-density adjustments; they do not create another route or anchor model.

## Why `100rem` must remain continuous

The `100rem` query currently changes only card-heading typography. It does not
replace composition, lens, orbit, track, marker, label, or card sizing.

Reintroducing a complete layout model at `100rem` can create simultaneous jumps
in composition gap, card width, route corridor, marker spacing, and label size.
Any future rule at this threshold must be tested at `1598`, `1599`, `1600`, and
`1601` pixels with the same active project.

## Correct sizing inputs

Screen inches are irrelevant. A 24-inch monitor does not expose usable CSS
geometry. Correct inputs are:

- CSS layout viewport width and height;
- document client width and height after scrollbar allocation;
- visual viewport width, height, and scale;
- actual lens/container inline size;
- actual viewport block budget;
- centralized orbit aspect ratio;
- current root font size and matching media queries.

Do not branch on physical screen dimensions, device pixel ratio, browser name,
or monitor model.

## Responsive geometry invariants

### Desktop

- marker centers match all four typed anchors;
- SVG frame and active route share viewBox and aspect ratio;
- `preserveAspectRatio="xMidYMid meet"` does not create a letterboxing mismatch;
- every normal connector-to-marker clearance remains positive;
- labels do not intersect markers or route segments;
- markers 02 and 04 retain positive line-to-label clearance;
- every card retains positive clearance from markers and frame;
- card/orbit density changes continuously;
- no horizontal overflow;
- frame, track, progress, and head keep the same active `d`.

### Tablet

- card and selector share the same intrinsic grid row height;
- marker 01 begins at card top;
- marker 04 ends at card bottom;
- three middle intervals are equal for each project;
- marker centers align with the vertical rail axis;
- project-specific card height may change row height without fixed selector math;
- no horizontal overflow.

### Mobile

- four marker centers have equal horizontal spacing;
- card remains inside its container and owns a separate row;
- each forward segment keeps equal gaps at source and destination;
- reverse `04 -> 01` uses wrap boundaries and a right-side transform origin;
- no horizontal overflow.

## Official QA viewport matrix

| Category | Required viewport |
| --- | --- |
| Full-screen approximation | `1920 x 945` |
| Full CSS viewport | `1920 x 1080` |
| Maximized browser approximation | `1903 x 945` |
| Wide-short desktop | `1707 x 827` |
| Wide continuity | `1601 x 900` |
| Wide threshold | `1600 x 900` |
| Laptop threshold | `1599 x 900` |
| Laptop continuity | `1598 x 900` |
| Desktop | `1440 x 900` |
| Constrained desktop | `1389 x 945` |
| Short-height desktop | `1280 x 800` |
| Tablet | `1024 x 1366` |
| Tablet boundary | `768 x 1024` |
| Mobile | `390 x 844` |

When changing any media query or clamp threshold, add widths immediately below,
at, and above that threshold. For the desktop/tablet mode boundary, include
`1179px` and `1180px`. For the short-height query, include `799px`, `800px`, and
`801px` heights at one desktop width.

## PLAYWRIGHT HOST WINDOW IS NOT THE CSS VIEWPORT

> [!WARNING]
> The visible MCP/Playwright host window can look constrained. Gray host area is
> not part of the page viewport. Never modify production CSS to compensate for
> host-window chrome or unused host area.

Every QA run must explicitly set the page viewport:

```ts
await page.setViewportSize({
  width: 1920,
  height: 945,
});
```

Then verify runtime geometry in the page:

```js
({
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
  hasHero: Boolean(
    document.querySelector("[data-adaptive-stack-lens]"),
  ),
  hasOrbit: Boolean(
    document.querySelector("[data-stack-lens-orbit]"),
  ),
  wide: matchMedia("(min-width: 100rem)").matches,
});
```

Acceptance requires:

- `innerWidth` and `innerHeight` equal the requested Playwright viewport;
- `visualViewport.scale === 1` unless zoom is intentionally under test;
- Hero and orbit selectors exist;
- the `1920px` cases match the wide media query;
- screenshots use the explicit page viewport;
- scrollbar width is reported through client/visual dimensions, not mistaken
  for a layout failure.

## Adjustable tokens

Composition gap, bounded lens/orbit/card clamps, card padding, track sizes, and
orbit-label type may be tuned only after recording pre-edit values across the
official matrix. Breakpoint ownership, anchor geometry, route topology, and
tablet/mobile row contracts are protected architecture.

## Verification status

- Branch: `hero-v2-responsive-rebuild`
- Commit: `9f8b06719793a20b79d3795606543e7a231cd4d5`
- Verified files: `src/styles/globals.css`, `src/styles/portfolio/adaptive-engineer-hero.module.scss`, `src/components/portfolio/hero/adaptive-orbit-geometry.ts`, `src/components/portfolio/hero/adaptive-signal-route.tsx`, `src/components/portfolio/hero/adaptive-stack-lens.tsx`
- Verification date: `2026-08-04`
- Documentation-only change: Yes
