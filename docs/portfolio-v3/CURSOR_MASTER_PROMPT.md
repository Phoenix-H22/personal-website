# Cursor Master Prompt — Implement Concept V3 Hero

You are implementing an already-approved visual direction. You are not being asked to invent a new design.

## Mandatory references

Read before editing:

- `docs/portfolio-v3/VISUAL_CONSTITUTION.md`
- `docs/portfolio-v3/COMPONENT_CONTRACTS.md`
- `docs/portfolio-v3/HERO_IMPLEMENTATION_PLAN.md`
- `docs/portfolio-v3/references/01-art-direction-desktop.png`
- `docs/portfolio-v3/references/02-responsive-composition.png`

Reference roles:

- `01-art-direction-desktop.png`: atmosphere, depth, lighting, artifact uniqueness, and quality.
- `02-responsive-composition.png`: desktop/tablet/mobile layout behavior.
- Markdown documents: enforceable production rules.

The images are concept art, not screenshots to paste into the page. Build the scene with semantic HTML, CSS, SVG, Tailwind, SCSS Modules, and controlled GSAP enhancement.

## Preserve

- existing `/`
- existing `/concept-v2`
- production navigation
- canonical content
- metadata/SEO infrastructure
- current project history

Do not replace the homepage.

## Build only

- `/concept-v3`
- isolated navigation
- Proof Engine hero
- Upwork Credential
- Commerce Scale
- Education Journey
- Your Obour Guide artifact
- Smart Vending artifact
- NABD artifact
- AK Core
- `/design-system/proof-artifacts`

Do not build the rest of the website.

## Styling architecture

Use:

- Next.js App Router
- strict TypeScript
- Tailwind CSS v4 for layout, responsive behavior, typography, spacing, tokens, and normal states
- SCSS Modules only for complex masks, perspective, pseudo-elements, edge lighting, artifact geometry, and AK Core effects
- GSAP with `@gsap/react` only after static compositions are correct
- Server Components by default
- small Client Components only where interaction/GSAP requires them

Do not create a monolithic `concept-v3.css`.
Do not write all JSX in one component.
Do not use Motion and GSAP for the same behavior.
Do not add WebGL, Three.js, autoplay video, or a particle library.

## Dark-only rule

No white or cream sections or cards.

Use the semantic dark canvas/surface tokens from the Visual Constitution. White is reserved for primary text, not large surfaces.

## Content rules

Use typed content and selectors.

Never hardcode verified metrics, URLs, artifact order, or user-facing copy inside visual components, SCSS, or animation files.

Required verified hero proof:

- Upwork: Top Rated, 100% Job Success
- Commerce: 200+ merchants, 20K+ monthly orders, 12M+ SAR handled order activity
- Education: Obour STEM School 2018–2021; University of Sadat City 2021–2025; A-grade with Honors; graduation project A+
- Product domains: Your Obour Guide, Smart Vending / Medication Dispensing, NABD Messaging

Do not invent official logos, badges, screenshots, or metrics.

If an approved logo is missing, render an explicit temporary typographic mark. Do not fabricate a crest or official badge.

## Composition modes

Implement three deliberate modes:

### Cinematic — 1280px+

- full asymmetric scene
- three depth planes maximum
- bounded absolute positioning inside the hero stage
- all major artifacts visible
- identity unobstructed

### Layered — 768–1279px

- grid-led composition
- two depth planes maximum
- retain Upwork, Commerce, and combined Education/Products
- reduce glow and visual density
- no desktop scene simply scaled down

### Narrative — below 768px

DOM/visual order:

1. identity
2. actions/social links
3. Upwork
4. Commerce
5. Products
6. Education
7. AK Core

Use normal flow. No critical absolute positioning, hover dependency, clipped ornament, or page-level horizontal scrolling.

Primary approval widths:

- 1440×900
- 768×1024
- 390×844

Also verify 320, 1024, 1280, and 1600.

## Static-first rule

Implement static composition before GSAP.

Do not add motion to hide an ordinary layout.

Stop and report before animation if the 1440 screenshot can be described as “text on the left and cards on the right,” “Bento grid,” “SaaS hero,” or “dashboard.”

## Artifact requirements

### Upwork Credential

- distinct angled credential slab
- approved Upwork mark or temporary typographic mark
- Top Rated
- readable 100% Job Success ring
- not a standard card
- no fake official talent badge

### Commerce Scale

- operational console/ledger silhouette
- three scoped metrics
- transaction/operations flow
- amber only for handled value
- mobile remains one readable object

### Education Journey

- one connected milestone object
- both dates and institutions visible
- no two generic cards
- no fake logos

### Product artifacts

- Your Obour Guide: map/phone/location silhouette
- Smart Vending: machine/QR/dispensing silhouette
- NABD: signal/channel/messaging silhouette
- no repeated rectangles with color changes

### AK Core

- original AK-derived monochrome mark
- illuminated variant layered around it
- works at 24px
- no generic AI-logo appearance
- no infinite spinning

## Accessibility and motion

- semantic proof content
- decorative visuals `aria-hidden`
- 44×44px targets
- visible focus
- no hover-only facts
- logical headings
- 200% zoom resilience
- `prefers-reduced-motion` disables ambient drift, parallax, infinite loops, and scroll-linked transforms

GSAP reveal must complete within roughly 1200ms and never delay reading or interaction.

## Implementation workflow

Follow the stages in `HERO_IMPLEMENTATION_PLAN.md`.

Build and inspect in this order:

1. static shell and typed content
2. primitives in design system
3. Upwork Credential
4. Commerce Scale
5. AK Core
6. Education and Product artifacts
7. composition modes
8. motion
9. QA

Do not parallelize unfinished stages.

## Final deliverables

Provide only:

1. files created/changed
2. dependency changes
3. 1440 screenshot
4. 768 screenshot
5. 390 screenshot
6. reduced-motion verification
7. validation results
8. missing official assets
9. known deviations from the references and why

Do not claim approval.
Do not replace the homepage.
Do not continue past the hero.

Then stop and wait for:

`CONCEPT V3 HERO APPROVED`
