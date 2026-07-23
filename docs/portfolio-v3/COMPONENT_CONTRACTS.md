# Component Contracts — Proof Engine Hero

## 0. Purpose

These contracts separate content, composition, artifact visuals, and motion so the hero remains easy to modify and safe to extend.

- Typed content owns facts.
- The hero composition owns placement.
- Each artifact owns its internal visual expression.
- Animation owns no factual content.
- SCSS owns no user-facing copy.

---

## 1. Suggested structure

```text
src/
  app/
    concept-v3/
      page.tsx

  components/
    concept-v3/
      navigation/
        concept-v3-nav.tsx
      hero/
        proof-engine-hero.tsx
        hero-copy.tsx
        hero-actions.tsx
        hero-composition.tsx
        hero-atmosphere.tsx
        hero-motion.tsx
      artifacts/
        proof-artifact.tsx
        upwork-credential.tsx
        commerce-scale.tsx
        education-journey.tsx
        product-artifact.tsx
        product-orbit.tsx
        ak-core.tsx
      shared/
        artifact-frame.tsx
        metric-readout.tsx
        status-seal.tsx
        temporary-mark.tsx

  content/
    proof-engine.ts

  lib/
    proof-engine/
      types.ts
      selectors.ts
      validation.ts
      motion.ts

  styles/
    concept-v3/
      proof-engine.module.scss
      artifacts.module.scss
```

Do not create one giant hero component or one monolithic stylesheet.

---

## 2. Core types

```ts
export type ProofArtifactKind =
  | "credential"
  | "commerce-scale"
  | "education-journey"
  | "product"
  | "brand-core";

export type ArtifactPriority = "primary" | "secondary" | "supporting";

export type ArtifactAccent =
  | "cyan"
  | "blue"
  | "amber"
  | "violet"
  | "upwork-green"
  | "communication-green";

export type CompositionMode = "cinematic" | "layered" | "narrative";

export interface ExternalLink {
  label: string;
  href: string;
  ariaLabel?: string;
  isExternal?: boolean;
}

export interface Metric {
  id: string;
  value: string;
  label: string;
  context?: string;
  accent?: ArtifactAccent;
}

export interface ProofArtifactBase {
  id: string;
  kind: ProofArtifactKind;
  title: string;
  eyebrow?: string;
  summary?: string;
  priority: ArtifactPriority;
  accent: ArtifactAccent;
  visibleIn: CompositionMode[];
  href?: string | null;
  asset?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  } | null;
  status?: "verified" | "temporary-mark" | "asset-missing";
  sortOrder: number;
}
```

### Credential

```ts
export interface CredentialArtifact extends ProofArtifactBase {
  kind: "credential";
  provider: "upwork";
  credential: string;
  score: {
    value: number;
    unit: "%";
    label: string;
  };
  profileLink?: ExternalLink | null;
}
```

### Commerce scale

```ts
export interface CommerceScaleArtifact extends ProofArtifactBase {
  kind: "commerce-scale";
  scope: string;
  metrics: Metric[];
  flow: Array<{
    id: string;
    label: string;
  }>;
}
```

### Education journey

```ts
export interface EducationMilestone {
  id: string;
  institution: string;
  period: string;
  qualification: string;
  highlight?: string;
  mark?: {
    src: string;
    alt: string;
  } | null;
}

export interface EducationJourneyArtifact extends ProofArtifactBase {
  kind: "education-journey";
  startYear: number;
  endYear: number;
  milestones: EducationMilestone[];
}
```

### Product artifact

```ts
export type ProductVisualKind =
  | "map-phone"
  | "vending-machine"
  | "message-signal";

export interface ProductArtifact extends ProofArtifactBase {
  kind: "product";
  slug: string;
  visualKind: ProductVisualKind;
  domain: string;
  projectStatus: "public" | "private" | "case-study-planned";
  technologyHints?: string[];
}
```

### AK Core

```ts
export interface BrandCoreArtifact extends ProofArtifactBase {
  kind: "brand-core";
  mark: "AK";
  tagline?: string;
}
```

### Hero

```ts
export interface ProofEngineHeroContent {
  eyebrow: string;
  name: string;
  headline: string;
  summary: string;
  primaryAction: ExternalLink;
  secondaryAction: ExternalLink;
  socialActions: ExternalLink[];
  artifacts: Array<
    | CredentialArtifact
    | CommerceScaleArtifact
    | EducationJourneyArtifact
    | ProductArtifact
    | BrandCoreArtifact
  >;
}
```

---

## 3. Component contracts

### `ProofEngineHero`

Responsibilities:

- semantic hero landmark
- loads content through selectors
- delegates layout to `HeroComposition`
- applies scene-level reduced-motion state
- initializes only scene-level choreography

Must not:

- contain artifact-specific markup
- hardcode facts, URLs, or colors
- fetch legacy content
- contain all animation logic in the same component

```ts
interface ProofEngineHeroProps {
  content: ProofEngineHeroContent;
  mode?: "prototype" | "production";
}
```

Prefer a Server Component shell with a small client boundary for composition motion.

### `HeroComposition`

Responsibilities:

- selects cinematic, layered, or narrative arrangement
- maps artifacts to stable visual slots
- preserves semantic DOM order
- exposes scoped refs/data attributes to GSAP

```ts
interface HeroCompositionProps {
  content: ProofEngineHeroContent;
  reducedMotion: boolean;
}
```

The DOM order must follow mobile narrative order. Desktop may reorder visually using CSS Grid areas and bounded positioning.

### `ProofArtifact`

Discriminated-union dispatcher:

```ts
interface ProofArtifactProps {
  artifact: ProofEngineHeroContent["artifacts"][number];
  mode: CompositionMode;
  interactive?: boolean;
}
```

Use an exhaustive switch and a `never` guard.

### `UpworkCredential`

Required visible content:

- approved Upwork mark or explicit temporary typographic mark
- `Top Rated`
- `100% Job Success`

Behavior:

- score ring remains meaningful without animation
- fine-pointer tilt is optional
- coarse-pointer and reduced-motion states are static
- optional profile link has an obvious focus state
- never draw a fake official talent badge

```ts
interface UpworkCredentialProps {
  artifact: CredentialArtifact;
  mode: CompositionMode;
  reducedMotion: boolean;
}
```

### `CommerceScale`

Required visible content:

- `200+ merchants`
- `20K+ monthly orders`
- `12M+ SAR handled order activity`
- explicit commerce/Mohssilh scope

Behavior:

- mobile uses one readable panel, not three tiny columns
- decorative flow is hidden from assistive technology
- semantic metric list exposes the same facts

```ts
interface CommerceScaleProps {
  artifact: CommerceScaleArtifact;
  mode: CompositionMode;
  reducedMotion: boolean;
}
```

### `EducationJourney`

Behavior:

- one connected journey, not two unrelated cards
- dates always visible
- institution, qualification, and highlight readable
- missing logo uses `TemporaryMark`
- no fake crest or logo

### `ProductArtifact`

Behavior:

- geometry is driven by `visualKind`
- project title and domain remain visible
- abstract visuals must not impersonate real product screenshots
- each visual kind has a different silhouette

### `ProductOrbit`

Responsibilities:

- groups product artifacts
- provides relational/orbit decoration
- simplifies or disappears in narrative mode
- never owns project content

### `AKCore`

```ts
type AKCoreVariant = "mark" | "illuminated" | "transition";
```

Requirements:

- monochrome base mark exists
- lighting is layered around the base
- works at 24px
- decorative scene instance is `aria-hidden`
- no infinite rotation in reduced-motion mode

### `ArtifactFrame`

A low-level primitive, not a universal visible card.

It may provide:

- semantic wrapper
- local CSS variables
- focus state
- edge layers
- optional clipped-corner mask

It must allow specialized components to define different silhouettes.

---

## 4. Styling ownership

### Tailwind CSS v4 owns

- layout
- responsive behavior
- spacing
- typography
- standard semantic colors
- standard borders
- visibility
- focus and basic state styles

### SCSS Modules own

- masks
- clipped corners
- complex pseudo-elements
- layered edge lighting
- perspective
- custom artifact geometry
- local noise texture
- AK Core illumination

### GSAP owns

- initial hero choreography
- small controlled parallax orchestration
- later hero-to-project transition

Do not use GSAP and Motion for the same behavior.

---

## 5. Selectors and validation

```ts
export function getProofEngineHero(): ProofEngineHeroContent;

export function getHeroArtifactsForMode(
  mode: CompositionMode,
): ProofEngineHeroContent["artifacts"];

export function getArtifactById(
  id: string,
): ProofEngineHeroContent["artifacts"][number] | undefined;
```

Validate:

- unique IDs
- valid sort order
- required metrics present
- `visibleIn` not empty
- score between 0 and 100
- URLs valid
- alt text present for every real asset
- no artifact marked `verified` when required proof data is missing

---

## 6. Design-system contract

Create a development-only route:

`/design-system/proof-artifacts`

Show:

- every artifact independently
- cinematic, layered, and narrative containers
- default, hover, focus, reduced-motion, and missing-asset states
- long-text stress test
- a visual note for 200% zoom testing

Do not link it in production navigation.

---

## 7. Extension rules

### Add a metric

Update data only if the artifact remains readable. Do not squeeze four or five metrics into a component designed for three.

### Add a product

Add a typed product record. Reuse `visualKind` only when the silhouette genuinely fits.

### Add a credential

Create a separate provider variant. Do not fill `UpworkCredential` with unrelated conditionals.

### Reorder artifacts

Change data and slot metadata. Do not rewrite the semantic DOM order unless the mobile story also changes.

---

## 8. Per-component acceptance gate

A component is complete only when:

- real typed data renders
- missing optional assets render intentionally
- all relevant composition modes are supported
- keyboard focus is visible
- reduced-motion behavior is verified
- no text clips at 390px
- no important text is below 12px
- no factual copy lives in SCSS or animation files
- it renders independently in the design-system route
