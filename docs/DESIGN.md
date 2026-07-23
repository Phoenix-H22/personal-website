# Design direction

## Concept

**Systems Under the Surface** turns backend architecture into an editorial storytelling device. The opening diagram is intentionally abstract. As visitors move down the page, its routes align with proof and resolve into a real commerce system. The visual is never a decorative network: every label describes a product capability Abdalrhman can own.

## Atmosphere

Dark-first, quiet, and exact. Dense technical detail is balanced by generous editorial spacing. Warm paper surfaces create chapter breaks and prevent the experience from becoming a dashboard or cyberpunk interface.

## Color system

- `--background-primary: #06080d` — main ink canvas
- `--background-secondary: #0b0f16` — section contrast
- `--surface-primary: #111722` — structural surfaces
- `--surface-elevated: #161e2b` — active and raised surfaces
- `--text-primary: #f4f7fb` — primary dark-surface text
- `--text-secondary: #9ba8ba` — supporting dark-surface text
- `--border-subtle: rgba(255,255,255,.1)` — hairlines and diagrams
- `--signal-primary: #35d8c0` — healthy system state
- `--signal-secondary: #78aefb` — routes and interaction
- `--signal-premium: #d8ad65` — verified outcomes only
- `--editorial-surface: #f1eee7` — reflective light chapter
- `--editorial-text: #111318` — text on paper

Signals are semantic. There are no ornamental multicolor gradients. Soft radial illumination may clarify node hierarchy, but cannot become the subject.

## Typography

Geist Sans carries display and body copy. IBM Plex Mono carries architecture labels, evidence metadata, and small status text. The primary headline uses a fluid 54–104px scale with tight leading. Body text remains 16–20px and comfortable.

Uppercase is reserved for compact technical metadata. Normal sentence case is the default.

## Grid

- Content maximum: 1440px
- Reading maximum: 720px
- Desktop: 12 columns
- Tablet: 8 columns
- Mobile: 4 columns
- Outer gutter: `clamp(20px, 4vw, 64px)`

Compositions may break the reading column but not the outer gutter.

## Spacing

Use a compact base scale (`4, 8, 12, 16, 24, 32, 48, 64, 96, 144`) and fluid section spacing. Empty space establishes chapter hierarchy; rounded containers do not substitute for composition.

## Borders and radius

Hairline borders define system boundaries. Corners are deliberate:

- 4–8px for technical nodes and controls
- 14–20px for substantial surfaces
- Full pills only for status indicators

Identical rounded-card grids are prohibited.

## Elevation

Elevation comes from value contrast, borders, and rare low-opacity shadows. Blur is restrained. Glass effects are not a design language.

## Iconography and brand mark

Lucide icons appear only where they improve recognition. The custom AK mark combines two letter strokes with connected endpoints and a forward route. It must remain legible at 24px and work in one color.

## Imagery and project art direction

Public product imagery is optional, not assumed. Every featured system receives a distinct technical cover:

- Merchant operations: event route from storefront through webhook intake, queue, operations, and reporting
- Your Obour Guide: three-client topology around a shared Laravel core and signed media layer
- Smart vending: prescription request crossing from healthcare API to MQTT and physical machine action
- AI PDF extraction: long-running document pipeline with progress and failure states

No generic placeholders, invented UI screenshots, client logos, or repository links.

## Motion

Motion explains system state:

- A request pulse traverses a known path.
- Nodes activate in sequence.
- Pointer movement adds no more than a few pixels of depth.
- The hero route extends into the first case study.
- Text enters with short opacity and position transitions.

Motion uses transforms and opacity, avoids initial-load choreography, and honors `prefers-reduced-motion`. All content and connections remain understandable when animation is absent.

## Responsive behavior

Desktop uses an asymmetric two-part hero. Tablet gives the system map a full-width second row. Mobile reduces the map to five primary nodes, turns hover details into visible annotations, shortens route motion, and stacks CTAs at comfortable widths. No essential content depends on hover.

Target review widths: 375, 430, 768, 1024, 1440, and wide desktop.

## Accessibility

- WCAG AA contrast for text and controls
- Semantic landmarks and one logical heading sequence
- Visible `:focus-visible` treatment
- 44px minimum touch targets
- Descriptive links and accessible navigation state
- Decorative SVG groups hidden from assistive technology
- System-node details available as text outside the interactive drawing
- Reduced-motion and forced-colors support

## Do

- Make typography carry the composition.
- Scope every metric to its project.
- Use diagrams to explain difficult work.
- Preserve calm, readable surfaces.
- Treat mobile as a directed edit of the story.

## Do not

- Use terminal cosplay, neon grids, particles, cursor followers, or random gradients.
- Use a profile-photo hero, generic device mockup, or technology badge cloud.
- Repeat identical cards.
- imply unavailable assets or unverified ownership.
- Animate merely to fill empty space.
