# S2B Featured Systems Redesign Report

Status: **Implemented — awaiting visual approval**  
Gate phrase: `S2B FEATURED SYSTEMS VISUALLY APPROVED — BEGIN SYSTEMS ATLAS`

## Safety checkpoint

| Item | Value |
| --- | --- |
| Checkpoint commit | `dbc00b7` |
| Message | `chore: checkpoint before s2b featured systems redesign` |
| Branch | `main` |
| Working tree at checkpoint | Dirty (S2A implementation preserved) |
| Preserved | V2 simplified Hero, Selected Systems vertical slice, project foundation, Current `/` freeze |

## Current `/` regression

Validated at 1440×900 and 390×844:

- Still `full-proof-constellation` with Education Journey + Product Deck
- No `#selected-systems`
- No V2 technology line / Education Credential capsule
- Origin / Career untouched
- Console errors during capture: **0**
- Horizontal overflow: **none** observed

## Final V2 Hero wording

| Field | Value |
| --- | --- |
| Eyebrow | `SOFTWARE ENGINEER · BACKEND SYSTEMS · PRODUCTS & INTEGRATIONS` |
| Name | Abdalrhman Alkady |
| Statement | I engineer the systems businesses learn to depend on. |
| Supporting copy | Backend-focused software engineer who genuinely enjoys turning complex business problems into reliable systems — from APIs, queues, and integrations to polished web products. |
| Technology line | PHP · Laravel · Python · JavaScript · React · Next.js (PHP/Laravel emphasized) |

Configured via `portfolioVariants.v2.hero.copy` — Current has no override.

## Technology line implementation

- Component: `HeroTechnologyLine`
- Attached under supporting copy in identity column
- Entrance owned by `hero-motion` (sequential opacity/translate)
- Static under reduced motion
- Not a skill cloud / marquee / terminal

## Education Credential

- Placement: **inside identity flow** after technology line, before CTAs
- One capsule: icon + degree + Honors (cyan) + Capstone A+ (amber)
- Accessible full wording in `.srOnly`
- Ambient float ~3.5px / &lt;0.5°; pause hover/focus/off-screen/hidden
- Reduced motion: static, no float

## Featured Systems identity

- Anchor: `#selected-systems`
- Eyebrow: Selected Systems
- H2: Featured Systems
- Count: 4 projects
- Lede: Production systems across commerce, messaging, IoT, and AI.

## Category controls

- All Systems (default, all four visible) · Commerce · Messaging · IoT · AI & Healthcare
- `aria-pressed` filter buttons + polite live region
- Filtered state expands matching project (`solo` layout); no blank holes / no duplicate markup

## Composition

All Systems:

1. Flagship — Merchant Operations (wide)
2. Support row — NABD (landscape) + Smart Vending (portrait/device)
3. Clinic band — Virtual Clinic (wide editorial)

Not equal cards / not three-card stack / not Bento.

## Covers

Typed `visualTheme.coverType` → `ProjectCover` resolver:

| Project | coverType | Concept |
| --- | --- | --- |
| Merchant Operations | `merchant-operations` | Operations route (events → intake → normalization → state → reconciliation/reporting) — **not** Hero KPI strip |
| NABD | `messaging-router` | Message routing + channels + delivery states + approved logo |
| Smart Vending | `vending-device-flow` | QR → API → transaction → MQTT → physical release |
| Virtual Clinic | `virtual-clinic-loop` | Care interaction loop + Capstone A+ |

Art-directed SVG/CSS covers (privacy-safe). No Wasfaty/Theqah/fake metrics.

## Motion / reduced motion

- Hero: tech + credential sequenced into intro timeline
- Credential ambient float (gated)
- Featured entrance via ScrollTrigger once
- Filter: short opacity/translate
- Cover ambient step pulse while visible; pauses off-screen / hidden / unmount
- Reduced motion: static final states; filters still immediate

## Accessibility

- Semantic `<section>` + H2 + per-project H3
- Covers `aria-hidden` with adjacent text equivalents
- Filter keyboard + visible focus + counts
- Live region announces result count
- No `href="#"` / no fake case-study buttons

## Performance

- Server fetch via `getProjectRepository().getFeaturedProjects()`
- Client receives public summaries only
- No canvas/WebGL/video/new animation library
- NABD logo lazy-loaded; covers are CSS/SVG

## Publication safety

Automated checks + capture diagnostics:

- No Wasfaty / Theqah in Featured payload or DOM text
- Flagship cover is operational route, not Hero KPI clone
- Case-study hrefs remain `null`
- Smart Vending title unchanged

## Quality gates

| Check | Result |
| --- | --- |
| `npm test` | 21 passed |
| `npm run typecheck` | pass |
| `npm run lint` | pass |
| `npm run build` | pass |
| Capture console errors | 0 |
| Overflow X (captured VPs) | none |

## Screenshot paths

Root: `docs/portfolio-v3/qa/s2b/` (gitignored)

- `current-regression/1440x900.png`, `390x844.png`
- `v2-hero/{1920x1080,1440x900,1366x768,1251x611,1024x1366,768x1024,390x844,320x568}.png`
- `v2-hero/1440x900-reduced-motion.png`
- `v2-systems/{1920x1080,1440x900,1366x768,1024x1366,768x1024,390x844,320x568}.png`
- `v2-systems/1440x900-reduced-motion.png`
- `covers/{flagship-close,nabd-cover,smart-vending-cover,virtual-clinic-cover}.png`
- `filters/all-systems-1440x900.png`, `filtered-commerce-1440x900.png`
- `zoom/hero-200pct-approx.png`, `systems-200pct-approx.png`
- `s2b-diagnostics.json`

## Recording paths

`docs/portfolio-v3/qa/s2b/recordings/`

1. `01-v2-hero-entrance-1440x900.webm`
2. `02-education-credential-float.webm`
3. `03-explore-signal-anchor.webm`
4. `04-featured-systems-entrance-filter.webm`
5. `05-cover-ambient-motion.webm`
6. `06-mobile-featured-scroll.webm`
7. `07-reduced-motion.webm`
8. `08-current-v2-route-switch.webm`

## Files changed (high level)

- `src/lib/portfolio/portfolio-variant.ts` — V2 copy + tech line flags
- `src/components/concept-v3-rebuild/hero/{rebuild-hero,hero-motion}.tsx`
- `src/components/portfolio/hero/{education-credential,hero-technology-line}.tsx`
- `src/components/portfolio/selected-systems/**` — Featured rebuild + covers
- `src/lib/portfolio/projects/{types,schemas,fixtures,tests}/**`
- `src/styles/portfolio/{education-credential,hero-tech-line,selected-systems,project-covers}.module.scss`
- `scripts/{capture-s2b-qa,record-s2b-qa}.mjs`
- Docs: storyboard, S2 plan, versioning, this report

## Genuine remaining defects / notes

1. **Cover media strategy** uses art-directed CSS/SVG system covers rather than real product screenshots — intentional for publication safety until approved media exists.
2. **Desktop 1440 Featured viewport** shows Flagship dominant + tops of support row; Clinic requires scroll (by design, not a fixed-height trap).
3. **Zoom captures** approximate 200% via `document.documentElement.style.zoom` in Playwright — browser-native zoom may differ slightly.
4. Visual approval still required from owner before S3.

## Not built (per brief)

`/v2/work` · case-study routes · Contact · Systems Atlas · Laravel · V2 promotion · Origin/Career redesign · versioning system changes
