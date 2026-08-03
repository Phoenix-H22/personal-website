# Projects Experience Plan

Status: **Discovery / planning only**  
Date: 2026-07-26  
Companion docs:

- `CURRENT_PROJECTS_AND_MEDIA_INVENTORY.md`
- `PROJECT_MEDIA_MAPPING.json` (private paths — local only)

---

## 1. Current repository architecture

| Concern | Finding |
| --- | --- |
| Framework | Next.js **16.2.11** (App Router) |
| Language | TypeScript |
| Routes | `/` Current, `/v2` preview sandbox, design-system labs; **no `/projects` or `/work` yet** |
| Portfolio shell | `src/components/portfolio/portfolio-page.tsx` + typed `portfolioVariants` |
| Section order Current | Nav → Hero (full constellation) → Origin → Career |
| Section order V2 | Nav → Hero (simplified) → Origin → Career → Featured/Selected Systems |
| Styling | Tailwind v4 tokens + SCSS modules for cinematic sections |
| Motion | GSAP primary (`@gsap/react`, ScrollTrigger); `motion` sparse elsewhere |
| Images | `next/image` in rebuild artifacts; Featured Systems uses CSS/SVG covers today |
| Project data | `src/lib/portfolio/projects` — Zod + `LocalProjectRepository` + 4 fixtures |
| Notion in app | **None** — no SDK, no server Notion client |
| Visual constitution | `docs/portfolio-v3/VISUAL_CONSTITUTION.md` — Proof Engine, dark-only, cyan primary |

Existing Featured Systems on `/v2` is a **different** curated set (Merchant Ops, NABD, Smart Vending, Virtual Clinic) with art-directed covers. The Notion inventory of 13 projects + approved photography is the new source of truth for the broader Projects experience.

Do not silently replace Current `/` without an explicit promotion decision.

---

## 2. Recommended data architecture

### Principles

1. Notion remains the **content** source of truth (properties + approved public copy blocks).  
2. Local public derivatives under `public/portfolio/projects/<slug>/` remain the **stable media** source.  
3. Never ship Notion signed URLs or `.portfolio-private` paths to the browser.  
4. Gate list/detail publication with `needsImages === false` (and confidentiality/publicity rules).  
5. Extend the existing repository pattern — do not invent a parallel ad-hoc fetch in components.

### Layers

```
Notion (read-only, server) 
  → normalize + validate (Zod)
  → ProjectRepository (local cache / generated JSON at build, later ApiProjectRepository)
  → MediaManifest (public paths only)
  → UI (Server Components + thin client islands)
```

### Normalized model (proposed)

Map real Notion schema first; do not invent missing properties.

```ts
type NotionNeedsImages = boolean;

interface PortfolioProjectRecord {
  notionPageId: string;
  slug: string;
  title: string;
  shortTagline: string;
  keyMetricsRaw: string | null;
  roleOwnership: string | null; // Ownership select
  projectType: string | null;   // Primary Category
  tier: "Flagship Case Study" | "Featured Project" | "Experience / Integration" | null;
  status: string | null;
  industry: string[];
  capabilities: string[];
  confidentiality: string | null;
  informationCompleteness: string | null;
  priority: number | null;
  website: string | null;
  github: string | null;
  appStore: string | null;
  googlePlay: string | null;
  needsImages: boolean;
  needsMyAnswer: boolean;
  // Parsed from APPROVED PUBLIC PORTFOLIO COPY sections (server-side)
  publicCopy: {
    role?: string;
    heroStatement?: string;
    supportingLine?: string;
    capabilityTags?: string[];
    overview?: string;
    // further case-study sections later
  };
  media: {
    cover: PublicMediaAsset | null;
    gallery: PublicMediaAsset[];
  };
  websiteEligible: boolean; // derived: !needsImages && confidentiality allows
}

interface PublicMediaAsset {
  role:
    | "cover"
    | "product"
    | "mobile"
    | "dashboard"
    | "architecture"
    | "integration-flow"
    | "machine"
    | "website"
    | "other";
  src: string; // /portfolio/projects/...
  alt: string;
  caption?: string;
  width: number;
  height: number;
  priority?: boolean;
}
```

Private source paths stay only in:

- `docs/portfolio-v3/projects-experience/PROJECT_MEDIA_MAPPING.json`
- optional local migration scripts (never imported by UI)

### Content fetching strategy

**Phase A (recommended first implementation):**

- Build-time or offline sync script (server-only) reads Notion with `NOTION_TOKEN` from env.
- Writes validated `src/content/generated/portfolio-projects.json` (or similar) **without secrets / without private paths**.
- `LocalProjectRepository` (or a new `CachedNotionProjectRepository`) reads that file.
- ISR/revalidate later; start with explicit sync + commit or CI artifact.

**Phase B:**

- On-demand server fetch with cache tags + revalidation.
- Still never expose token or signed Notion file URLs.

**Fallback:** if Notion unavailable, serve last successful generated snapshot.

**Do not** client-fetch the database.

### Relationship to existing fixtures

Keep current Featured Systems fixtures until an explicit migration plan:

- either map Notion projects into the same repository interface
- or introduce `getHomepageShowcaseProjects()` that returns a configured subset of Notion-backed records

Avoid two contradictory “featured” stories on `/v2` without owner decision.

---

## 3. Public asset structure

Proposed normalized tree (semantic names; WebP/AVIF derivatives preferred when quality holds):

```text
public/portfolio/projects/
  smart-lockers-platform/
    cover.webp
    machine.webp
    dashboard.webp
    architecture.webp
  riders-shopify-wordpress/   # or keep existing `riders/` if renaming is deferred
    cover.webp
    shopify-listing.webp
    shopify-settings.webp
    shopify-sync.webp
    wordpress-listing.webp
    wordpress-checkout.webp
    wordpress-orders.webp
  alzahaby-loyalty-app/
    cover.webp
    architecture.webp
  autopay-eg/                 # already partially present
  warqah-store/
  your-obour-guide/
  …
```

Rules:

- Preserve private PNG/JPG masters under `.portfolio-private`.
- Public tree holds optimized derivatives only.
- Homepage loads **cover only** (+ maybe one LCP priority).
- Detail pages lazy-load gallery.
- Quarantine non-canonical riders public clutter before launch.

---

## 4. Homepage Projects section concept

### Goal

A major portfolio moment: editorial, cinematic, ownership-forward — not a logo grid.

### Placement recommendation

- **Implement first on `/v2`** behind typed config (`sections.showProjectsExperience`).
- Keep Current `/` frozen until visual approval + promotion decision.
- Decide whether this replaces or coexists with current Selected Systems.

### Content per preview (homepage)

- Approved cover  
- Title  
- Short tagline  
- Role / ownership  
- 2–4 capability signals (not a badge cloud)  
- One evidence-backed differentiator (from Key Metrics / approved impact line)  
- Link to case study / listing  

### Interaction model (recommended)

**“Systems Exhibition” — stacked editorial stages**

1. Strong chapter header: eyebrow + H2 + one-line positioning + count of currently eligible projects.  
2. One **dominant flagship stage** (highest Priority among eligible, or owner-pinned).  
3. Supporting stages with distinct silhouettes (platform / mobile / integrations / IoT) — different crop ratios and local accents.  
4. Scroll-linked entrance (GSAP ScrollTrigger): header → flagship → supports.  
5. Hover/focus reveals a thin technical strip (capabilities / stack signals) without hiding title/role.  
6. CTA row: “View all projects” → listing route.

Avoid:

- identical 3-column card grids  
- simultaneous noisy animation on every card  
- hover-only critical content  
- rainbow multi-accent chaos (one cyan signal + project-local accent)

### Initial eligible homepage set (live Notion)

Only three projects currently pass `Needs Images = false`:

1. Smart Lockers Platform (flagship candidate)  
2. Riders Shopify & WordPress Integrations  
3. Alzahaby Loyalty App  

If owner clears Autopay / Warqah / Obour in Notion, the section expands automatically via the repository gate.

### Responsive

| Viewport | Behavior |
| --- | --- |
| Desktop / ultra-wide | Flagship wide editorial; supports asymmetric row |
| Laptop | Same hierarchy; tighter gutters |
| Tablet | Single column stages; keep cover dominance |
| Mobile | One project per view-band; cover first; no horizontal page overflow |
| Reduced motion | Static settled layout; no parallax loops |

---

## 5. Projects listing page concept

### Route recommendation

Prefer **`/v2/work` during development**, promote to **`/work`** later — matches existing docs (`SYSTEMS_ATLAS_SPEC`, versioning plan).

Alternative `/projects` is clearer English but conflicts with prior portfolio-v3 naming. **Owner decision required.**

### Experience

- Opening identity band (positioning as Backend-Focused Full-Stack / Platform Engineer)  
- Featured strip (Flagship tier among eligible)  
- Editorial grid of remaining eligible projects  
- Lightweight filters: **Primary Category** + optional **Capabilities** (multi-select, few options)  
- No search until project count > ~12 eligible  

Each listing card:

- cover  
- title + category  
- tagline  
- ownership  
- 1 impact line  
- link to detail (when route exists) or “Case study soon” only if no dead `href="#"`

Incomplete (`needsImages`) projects:

- default **hidden** from public listing  
- optional internal “Coming soon” mode only behind env flag — not public by default  

---

## 6. Project details architecture (later phase)

Route sketch: `/v2/work/[slug]` → later `/work/[slug]`

Blocks (Notion-driven):

1. Hero cover  
2. Overview  
3. Role & ownership  
4. Business problem  
5. Architecture (media + narrative)  
6. Technical decisions  
7. Challenges  
8. Outcomes / metrics (evidence-gated)  
9. Gallery  
10. Live links  
11. Technologies / capabilities  
12. Related projects  

Do not implement detail pages in Phase 1 unless scaffolding is free (empty dynamic route + type-safe params). Prefer data readiness first.

---

## 7. Component map (proposed)

```text
src/components/portfolio/projects-experience/
  ProjectsChapter.tsx              # server section for homepage
  ProjectsChapterExperience.tsx    # client motion/filter islands if needed
  ProjectEditorialStage.tsx        # shared stage shell
  ProjectCoverMedia.tsx            # next/image wrapper
  ProjectMeta.tsx                  # category, ownership, impact
  ProjectsListingPage.tsx
  ProjectsFilterBar.tsx
  ProjectDetailShell.tsx           # later

src/lib/portfolio/projects/
  notion/                          # server-only sync + mappers
  media-manifest.ts                # public paths only
  (extend existing repository interface)
```

Styles: `src/styles/portfolio/projects-experience.module.scss` (+ cover variants).  
Tokens: reuse Visual Constitution cyan/blue/amber/violet sparsely.

---

## 8. Route map

| Route | Phase | Purpose |
| --- | --- | --- |
| `/v2` + Projects chapter | 1 | Homepage showcase |
| `/v2/work` | 1–2 | Listing |
| `/v2/work/[slug]` | 2–3 | Case study |
| `/work`, `/work/[slug]` | promotion | Public routes after approval |
| `/` Current | frozen | No Projects chapter until promotion |

---

## 9. Performance strategy

- `next/image` with explicit width/height from manifest  
- `sizes` tuned per stage (flagship ~100vw desktop, cards ~50vw)  
- Priority only on first visible cover  
- Lazy-load below-fold covers and all gallery images  
- Prefer WebP/AVIF derivatives; keep PNG when text sharpness suffers  
- Server Components for data; client only for filters/motion  
- No loading all 13 galleries on homepage  
- Pause GSAP loops off-screen / `document.hidden`  
- Respect reduced motion  

---

## 10. Accessibility strategy

- Semantic `<section>` / listing `<ul>` or article collection  
- H2 chapter, H3 project titles  
- Real `<a>` links to real routes  
- Visible focus rings (cyan)  
- Meaningful alt from captions; decorative layers `aria-hidden`  
- Filters as `aria-pressed` buttons (or listbox if needed)  
- No hover-only facts  
- Touch targets ≥ 44px  
- Contrast against void/deep surfaces  

---

## 11. Motion strategy

- GSAP ScrollTrigger entrances for chapter + stages  
- Project-local ambient (very subtle) only while visible  
- Filter transitions: short opacity/transform  
- Reduced motion: immediate visibility, no float/parallax  

---

## 12. Phased task breakdown

### Phase 0 — Owner decisions (blocker)

1. Confirm eligibility gate stays `Needs Images = false`.  
2. Clear Notion for Autopay / Warqah / Obour **or** explicitly allow temporary override.  
3. Confirm Smart Lockers cover = `newdesign1.png`.  
4. Confirm listing route `/v2/work` vs `/projects`.  
5. Decide fate of current Selected Systems vs new Projects chapter.  

### Phase 1 — Media + data foundation

1. Quarantine unsafe public riders leftovers.  
2. Copy/optimize public derivatives for the 3 eligible projects.  
3. Public media manifest (no private paths).  
4. Notion sync scaffold (read-only) + Zod normalization.  
5. Repository methods: `listWebsiteEligible()`, `getBySlug()`.  

### Phase 2 — Homepage Projects chapter on `/v2`

1. Editorial section UI  
2. Motion + a11y  
3. Link to listing (or disabled until listing ships)  

### Phase 3 — Listing page

1. `/v2/work`  
2. Filters by Primary Category  
3. Featured band + grid  

### Phase 4 — Detail pages

1. `/v2/work/[slug]`  
2. Section rendering from approved Notion public copy  
3. Gallery + related projects  

### Phase 5 — Expansion

1. Flip more projects as Notion clears  
2. Promote routes to Current when approved  

---

## 13. Risks and open decisions

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Notion gate vs local media mismatch | Homepage may ship with only 3 projects | Owner clears Notion or grants override |
| Dual featured systems (old fixtures vs Notion) | Confusing `/v2` narrative | Explicit replace/coexist decision |
| Alzahaby mobile images unmapped | Incomplete gallery | Owner supplies local masters |
| Riders public clutter | Accidental unsafe assets | Cleanup before any deploy |
| Wasfaty naming | Publication risk | Keep gated even after media |
| Notion token handling | Security | Server-only env; never client |
| Copy rewrite temptation | Drift from approved Notion | Render approved sections; no rewrite |

---

## 14. Recommended next implementation step

After owner answers Phase 0 questions:

**Implement Phase 1 media + repository foundation for the three Notion-eligible projects only**, still without homepage UI until media copy + public manifest are approved.

Then build the `/v2` Projects chapter using those three as the first exhibition set.
