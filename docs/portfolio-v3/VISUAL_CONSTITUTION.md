# Visual Constitution — Abdalrhman M. Alkady Portfolio

## 0. Status and authority

This document is the visual source of truth for the portfolio experience.

Visual reference priority:

1. `references/01-art-direction-desktop.png` — atmosphere, detail quality, lighting, depth, artifact individuality, and cinematic impact.
2. `references/02-responsive-composition.png` — desktop, tablet, and mobile composition behavior.
3. This document — enforceable rules where the concept images are ambiguous.
4. Existing repository conventions — only when they do not conflict with the sources above.

The references are concept art, not pixel-perfect production screenshots. Reproduce their visual logic and hierarchy, not accidental microtext, fake UI details, or physically impossible geometry.

---

## 1. Brand idea

### Core concept

**The Proof Engine**

Abdalrhman’s claims become distinct proof artifacts: credentials, production scale, education, shipped products, and verified outcomes.

### Primary statement

**I engineer the systems businesses learn to depend on.**

### Required emotional response

The first viewport must communicate:

- serious engineering ability
- real production experience
- visible proof rather than empty claims
- creative technical authorship
- controlled ambition
- a personal identity that cannot be reused for another developer by changing the name

The experience should feel like a premium interactive exhibition about an engineer’s body of work.

---

## 2. Non-negotiable rules

1. The website is dark-only. No white, cream, paper, or light chapter backgrounds.
2. Abdalrhman’s name is the primary identity anchor.
3. Proof artifacts must have different silhouettes and internal mechanisms.
4. The hero must never become “text on the left, generic cards on the right.”
5. Important proof must never be reduced to tiny metadata.
6. Architecture diagrams belong inside case studies, not as the repeated visual language of the site.
7. Whitespace creates hierarchy, but large dead zones are prohibited.
8. Every glow belongs to a specific artifact or state.
9. Motion enhances depth; it is never required to understand the content.
10. Mobile is a separate narrative composition, not a collapsed desktop scene.

---

## 3. Theme architecture

### 3.1 Semantic color tokens

Use Tailwind CSS v4 CSS-first tokens or equivalent CSS custom properties. Do not scatter raw colors through JSX or SCSS.

```css
@theme {
  --color-canvas-void: #03060b;
  --color-canvas-deep: #06101a;
  --color-canvas-navy: #071522;

  --color-surface-low: #0a121c;
  --color-surface-mid: #0e1926;
  --color-surface-high: #142235;
  --color-surface-focus: #1a2a40;

  --color-text-primary: #f3f7fb;
  --color-text-secondary: #a8b6c8;
  --color-text-muted: #6f7f92;

  --color-signal-cyan: #31e6d0;
  --color-signal-blue: #5e8fff;
  --color-signal-amber: #f2b84f;
  --color-signal-violet: #9d72ff;
  --color-signal-green: #27c76f;
  --color-signal-danger: #ff6b6b;

  --color-border-subtle: rgb(139 171 204 / 12%);
  --color-border-medium: rgb(139 171 204 / 22%);
  --color-border-active: rgb(49 230 208 / 52%);
}
```

### 3.2 Accent ownership

- Global active state: cyan.
- Secondary navigation and interaction: blue.
- Verified financial or scale result: amber.
- Upwork credential: approved Upwork green, only inside that artifact.
- Education: violet with a restrained cyan route.
- Your Obour Guide: violet / map blue.
- Smart Vending: cyan / teal.
- NABD: amber / communication green.
- Red: error/unavailable state only.

No single scene may contain more than three strong accent families simultaneously.

### 3.3 Dark chapter variation

The website remains dark while its atmosphere changes using:

- void black
- deep navy
- petrol blue
- graphite
- dark teal
- restrained dark aubergine

Use masked lighting, material, typography, and local accents to create chapter changes—not light backgrounds.

### 3.4 Background atmosphere

Allowed:

- masked radial light fields
- subtle noise or grain
- broad vignette
- faint perspective depth lines
- sparse directional traces connected to real content
- soft depth fog

Rejected:

- random gradient blobs
- starfield particle wallpaper
- Matrix rain
- fake terminal text
- code decoration
- generic glowing node networks
- rainbow neon

---

## 4. Typography

### 4.1 Families

- Display and body: Geist or an approved modern grotesk.
- Technical labels: IBM Plex Mono or Geist Mono, used sparingly.
- Maximum two primary families.

### 4.2 Fluid scale

```css
--text-hero-name: clamp(3.1rem, 6.2vw, 7.25rem);
--text-hero-headline: clamp(1.75rem, 3vw, 3.4rem);
--text-section-title: clamp(2.25rem, 4.4vw, 5rem);
--text-artifact-title: clamp(1rem, 1.3vw, 1.35rem);
--text-body-large: clamp(1rem, 1.15vw, 1.2rem);
--text-body: 1rem;
--text-meta: 0.8125rem;
```

### 4.3 Readability rules

- Body copy: 16px minimum.
- Navigation: 14px minimum.
- Important proof labels: 14px minimum.
- Metadata: 12px absolute minimum; 13px preferred.
- Mobile hero name: 48–72px.
- Paragraph measure: 48–66 characters.
- Desktop headline: no more than three intentional lines.
- Mobile headline: no more than four intentional lines.
- Monospace is reserved for concise statuses, dates, and machine-like labels.
- Never shrink important copy merely to preserve an ornamental layout.

---

## 5. Spacing, grid, and sizing

```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-5: 1.5rem;
--space-6: 2rem;
--space-7: 3rem;
--space-8: 4rem;
--space-9: 6rem;
--space-10: 8rem;

--page-gutter: clamp(1.25rem, 4vw, 4.5rem);
--content-max: 96rem;
--reading-max: 46rem;
```

Rules:

- Desktop section gap: 96–160px.
- Mobile section gap: 64–96px.
- Hero target height on wide desktop: `min(960px, 100svh)`, with a practical minimum of 760px.
- Do not force `100vh` on tablet or mobile.
- No arbitrary multi-hundred-pixel margins to imitate composition.
- Avoid `100vw` inside page content unless scrollbar behavior is explicitly handled.
- Artifact internal spacing scales with the artifact, but text never falls below the readability rules.

---

## 6. Shape and material system

### 6.1 Radius

- Controls: 10–14px.
- Standard artifact frame: 18–28px.
- Specialized artifacts may use clipped corners, inset notches, circular instruments, or asymmetrical geometry.
- Full pills only for statuses and compact labels.

### 6.2 Borders

Artifact depth may use:

1. a low-opacity outer contour
2. a brighter local edge near the owning accent
3. an optional inset line or highlight

Do not give every artifact the same rounded-rectangle border.

### 6.3 Depth planes

Maximum three planes:

1. atmospheric background
2. main content and artifact plane
3. near-camera accent plane

Use perspective, local shadow, edge lighting, and subtle transforms. Blur-heavy glassmorphism is not the default material.

### 6.4 Glow limits

- Local glow blur: 20–44px.
- Environmental light: up to 120px at low opacity.
- Text glow: generally prohibited.
- Glows must be clipped/localized to avoid washing out the scene.

---

## 7. Responsive composition modes

Responsive behavior is based on composition modes, not only breakpoints.

### 7.1 Cinematic — `>= 1280px`

- Full asymmetric scene.
- Three depth planes.
- Bounded absolute positioning is allowed inside the hero stage.
- All major proof groups may be visible.
- Pointer parallax may be enabled for fine pointers.
- Identity remains unobstructed.
- The scene should fill approximately one viewport without clipping important content.

### 7.2 Layered — `768px–1279px`

- Structured CSS Grid replaces most free positioning.
- Two depth planes maximum.
- Retain three primary proof groups: Upwork, Commerce, and a combined Education/Product area.
- AK Core becomes smaller and moves toward the composition footer.
- Reduce glow intensity by about 25%.
- Disable pointer parallax on coarse pointers.
- The hero may naturally exceed one viewport.

### 7.3 Narrative — `< 768px`

DOM and visual order:

1. name and hero statement
2. actions and social links
3. Upwork credential
4. commerce scale
5. product artifacts
6. education journey
7. AK Core transition

Rules:

- normal document flow
- no critical absolute positioning
- no hover-only information
- no horizontal page overflow
- decorative layers may be removed instead of scaled into illegibility
- artifacts may use a controlled snap row only when the page itself does not scroll horizontally
- all primary proof is readable without interaction

### 7.4 Required review widths

- 320px resilience
- 390px mobile approval
- 768px tablet approval
- 1024px transition
- 1280px cinematic entry
- 1440px desktop approval
- 1600px wide-screen balance

---

## 8. Artifact grammar

Every proof artifact must have:

- a clear subject
- one primary proof statement
- a unique silhouette
- an internal visual mechanism
- a controlled accent family
- a readable static fallback
- data-driven content

Every artifact must avoid:

- generic title/body/button card anatomy
- the same layout as another artifact
- fake screenshot details
- important copy treated as microtext
- floating with no narrative purpose

### 8.1 Upwork Credential

- Silhouette: angled secured credential slab.
- Primary proof: `Top Rated` and `100% Job Success`.
- Mechanism: score ring + credential seal.
- Accent: Upwork green.
- Must remain instantly recognizable on mobile.
- Use an official approved mark or a clearly temporary typographic mark; never draw a fake official badge.

### 8.2 Commerce Scale

- Silhouette: operational console / transaction ledger.
- Primary proof: `200+ merchants`, `20K+ monthly orders`, `12M+ SAR`.
- Mechanism: transaction stream, operational route, or progressive metric track.
- Accent: cyan plus amber for handled value.
- Scope must visibly belong to commerce operations.

### 8.3 Education Journey

- Silhouette: one connected milestone object, not two cards.
- Primary proof: `2018 → 2025`, STEM to bachelor’s with honors and an A+ graduation project.
- Mechanism: luminous route between milestones.
- Accent: violet plus cyan.
- Official marks are optional; fake crests are prohibited.

### 8.4 Product Artifacts

Distinct visual forms:

- Your Obour Guide: map/phone/location object.
- Smart Vending: machine/QR/dispensing object.
- NABD: communication signal/channel object.

Do not render three repeated rectangles with different colors.

### 8.5 AK Core

- Derived from the AK initials and connected engineering paths.
- Must work in monochrome at 24px.
- Illuminated form may use an orbit/energy field.
- Must not resemble a generic AI startup logo.
- Functions as a transition anchor, not an infinite spinner.

---

## 9. Motion constitution

### 9.1 Motion roles

Motion may express:

- artifact arrival
- credential verification
- depth
- transaction flow
- a transition into the first case study

It may not exist merely to make the screen “feel alive.”

### 9.2 Timing

- Complete initial hero reveal: 700–1200ms.
- Micro-interaction: 120–260ms.
- Tilt/depth response: 180–320ms.
- Ambient drift: 6–12 seconds with only 2–6px travel.
- No bouncing.
- No continuous full rotations.
- No loading choreography that delays reading or clicking.

### 9.3 Reduced motion

Under `prefers-reduced-motion: reduce`:

- no ambient drift
- no pointer parallax
- no infinite loops
- no scroll-linked transforms
- all proof remains visible
- state changes become instant or use a minimal opacity transition

### 9.4 Library ownership

- GSAP: scene choreography and a later hero-to-project transition.
- CSS: hover, focus, and small local state changes.
- Never use GSAP and Motion for the same behavior.

---

## 10. Accessibility

- WCAG AA contrast.
- Visible `:focus-visible` on every dark surface.
- Minimum 44×44px interactive targets.
- Artifact facts must exist as semantic HTML, not only decorative SVG/canvas.
- Decorative geometry is `aria-hidden`.
- No essential information available only on hover.
- Logical heading order.
- Mobile reading order matches DOM order.
- No clipping at 200% zoom.
- Forced-colors mode keeps controls usable.

---

## 11. Performance

- No WebGL in the first implementation.
- No autoplay video.
- No large raster image required for comprehension.
- Prefer HTML, CSS, and SVG.
- Animate transforms and opacity only.
- Lazy-load below-fold media.
- Keep client boundaries small.
- Stable interaction on mid-range mobile is more important than decorative complexity.
- GSAP should be dynamically scoped to the hero client component and cleaned up with `useGSAP()`.

---

## 12. Maintainability

- No user-facing copy inside SCSS.
- No metrics hardcoded in visual components.
- No project accent hardcoded in page composition.
- No asset URLs inside animation code.
- Artifact order comes from typed content.
- Optional data must not leave empty holes.
- Each artifact works independently in the design-system route.
- Adding a project must not require rewriting the hero layout unless it introduces a genuinely new artifact type.
- The hero composition controls placement; artifacts control their own visual expression.

---

## 13. Rejection checklist

Reject the implementation when any answer is “yes”:

- Does it look like text on one side and cards on the other?
- Are most artifacts the same rounded rectangle?
- Is any section white or cream?
- Is important text too small?
- Is mobile merely a stacked desktop layout?
- Are glow and neon compensating for weak composition?
- Could another developer reuse it by changing the name?
- Is proof shown mainly as a standard KPI row?
- Does the scene require animation to make sense?
- Are there large dead zones without narrative purpose?
