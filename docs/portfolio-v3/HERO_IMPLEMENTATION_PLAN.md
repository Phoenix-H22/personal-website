# Hero Implementation Plan — Concept V3

## 0. Objective

Implement the approved dark cinematic direction as an isolated, production-quality hero prototype at `/concept-v3`.

Do not extend the rest of the website until the hero is approved in the browser at desktop, tablet, and mobile sizes.

**Update:** Post-hero site expansion is specified in `SITE_EXPANSION_PLAN.md` (S0 contracts → S7 production). Implementation of homepage chapters and `/work` starts only after `V3 SITE ARCHITECTURE APPROVED — BUILD STAGE S1`. The approved rebuild hero lives at `/concept-v3-rebuild` and remains visually locked.

---

## 1. Scope

### In scope

- Concept V3 navigation
- hero identity and actions
- atmospheric dark stage
- Upwork Credential
- Commerce Scale
- Education Journey
- Your Obour Guide artifact
- Smart Vending artifact
- NABD artifact
- AK Core
- cinematic, layered, and narrative modes
- reduced motion
- keyboard/touch accessibility
- design-system artifact route
- screenshot-based visual QA

### Out of scope

- replacing `/`
- complete Education section
- complete Career Chapters
- `/work`
- project details
- backend/CMS
- broad repository refactoring
- fake logos or screenshots
- full hero-to-case-study sequence

---

## 2. Preflight

Before writing UI code:

1. Read `VISUAL_CONSTITUTION.md`.
2. Read `COMPONENT_CONTRACTS.md`.
3. Open both files in `references/`.
4. Inspect Tailwind version and current styling conventions.
5. Confirm whether Tailwind v4 is already installed.
6. Confirm whether `sass`, `gsap`, and `@gsap/react` exist.
7. Document dependency changes before installing.
8. Preserve `/`, `/concept-v2`, current canonical content, and production navigation.

Do not start implementation if the visual references are unavailable.

---

## 3. Stage V3.1 — Static foundation

Deliver:

- `/concept-v3`
- semantic hero markup
- isolated navigation
- hero copy and actions
- atmospheric background
- static composition shells for all three modes
- typed `proof-engine` content
- no GSAP yet

Primary files:

```text
src/app/concept-v3/page.tsx
src/components/concept-v3/navigation/concept-v3-nav.tsx
src/components/concept-v3/hero/proof-engine-hero.tsx
src/components/concept-v3/hero/hero-copy.tsx
src/components/concept-v3/hero/hero-actions.tsx
src/components/concept-v3/hero/hero-composition.tsx
src/components/concept-v3/hero/hero-atmosphere.tsx
src/content/proof-engine.ts
src/lib/proof-engine/types.ts
src/lib/proof-engine/selectors.ts
```

Acceptance:

- Name dominates at 1440, 768, and 390.
- Headline avoids awkward six-line wrapping.
- No white/cream surface.
- DOM order matches narrative mobile order.
- No overflow at 320–1600.
- Existing routes remain unchanged.
- Static scene already feels distinctive; animation is not hiding a weak layout.

Stop and reassess if it resembles a standard split hero.

---

## 4. Stage V3.2 — Primitives

Build independently under `/design-system/proof-artifacts`:

1. `ArtifactFrame`
2. `MetricReadout`
3. `StatusSeal`
4. `TemporaryMark`
5. monochrome `AKCore`

Acceptance:

- missing assets have an intentional state
- primitives do not force identical silhouettes
- focus is visible
- typography remains readable at 390px
- each primitive works without animation

---

## 5. Stage V3.3 — Upwork Credential

Build this first because it is the clearest creativity and proof-quality test.

Requirements:

- official approved Upwork logo if available; otherwise a temporary typographic mark
- Top Rated
- 100% Job Success score ring
- angled secured-credential silhouette
- clear static mobile version
- optional subtle tilt on desktop fine pointers

Acceptance:

- instantly recognizable in the 1440 screenshot
- Top Rated and 100% readable without zoom
- not a standard rounded card
- no fake official badge
- no hover required
- reduced-motion state is complete

Do not continue to other artifacts if this one looks generic.

---

## 6. Stage V3.4 — Commerce Scale

Requirements:

- 200+ merchants
- 20K+ monthly orders
- 12M+ SAR handled order activity
- commerce operations scope
- operational flow treatment
- amber reserved for financial value

Acceptance:

- metrics are correctly scoped
- mobile remains one coherent readable object
- route/stream is decorative and accessible content exists in HTML
- no dashboard KPI row
- silhouette differs from Upwork

---

## 7. Stage V3.5 — AK Core and atmosphere

Requirements:

- monochrome AK mark
- illuminated hero variant
- transition variant reserved for later
- local orbit/light field
- no generic AI logo appearance

Acceptance:

- legible at 24px
- remains attractive without illumination
- no infinite rotation under reduced motion
- does not compete with the name
- background supports the artifacts rather than becoming the subject

---

## 8. Stage V3.6 — Education and product artifacts

Build:

- `EducationJourney`
- `YourObourGuideArtifact`
- `SmartVendingArtifact`
- `NabdArtifact`
- optional `ProductOrbit` wrapper

Acceptance:

- each product has a different silhouette
- no fake screenshots
- temporary institution marks are explicitly temporary
- mobile order matches the narrative contract
- text remains readable
- no repeated generic card template

---

## 9. Stage V3.7 — Composition modes

### Cinematic — 1440 primary approval

- all primary artifacts visible
- three controlled depth planes
- bounded absolute placement
- identity unobstructed
- no dead zones
- distinctive silhouette at first glance

### Layered — 768 primary approval

- grid-led composition
- two depth planes
- three primary proof groups retained
- reduced visual density
- no desktop elements merely scaled down

### Narrative — 390 primary approval

- normal flow
- identity → Upwork → Commerce → Products → Education → AK Core
- no hover dependency
- no page-level horizontal scroll
- no clipped artifact
- intentional, not collapsed

Also validate 320, 1024, 1280, and 1600.

---

## 10. Stage V3.8 — Motion

Only after static compositions are approved.

Use:

- GSAP + `useGSAP()` for one entrance timeline
- subtle artifact stagger
- optional 2–6px ambient drift
- fine-pointer depth response
- CSS transitions for local hover/focus

Acceptance:

- complete reveal within 1200ms
- content clickable immediately
- no layout shift
- no animation required to understand proof
- reduced-motion removes ambient and scroll-linked movement
- cleanup is scoped and verified

---

## 11. Stage V3.9 — QA

Run:

- ESLint
- strict TypeScript
- production build
- keyboard navigation
- reduced-motion verification
- 200% zoom check
- touch target check
- visual screenshots

Required screenshots:

- 1440×900
- 768×1024
- 390×844
- one reduced-motion verification state

Screenshot rules:

- use the same hero state
- no browser dev overlays
- no debug labels
- no claim of approval
- compare side by side with the references

---

## 12. Quality gates

### Gate A — Identity

Within five seconds, a viewer sees:

- Abdalrhman Alkady
- backend/product engineering position
- primary proposition
- at least one unmistakable proof artifact

### Gate B — Creativity

The 1440 screenshot cannot be summarized as:

- text and cards
- a Bento grid
- a SaaS hero
- a dashboard
- a résumé with glow

### Gate C — Responsive integrity

The 390 screenshot must feel designed independently and preserve the strongest proof.

### Gate D — Maintainability

- typed content
- separate composition and artifact logic
- no hardcoded facts in visual files
- artifact gallery route
- no monolithic stylesheet/component

### Gate E — Accessibility/performance

- keyboard usable
- reduced-motion complete
- semantic proof content
- no heavy WebGL/video
- stable mobile interaction

---

## 13. Stop condition

After the hero and artifact gallery are implemented and validated, stop.

Do not:

- replace `/`
- build the rest of the homepage
- begin project pages
- create Education or Career Chapters sections

Wait for:

`CONCEPT V3 HERO APPROVED`
