# Project Content Model — Portfolio V3

Status: **S0 — Content architecture**  
No UI. Types may be prepared as non-rendered schema; production data remains in `src/content`.

---

## 1. Recommended architecture: Option B

**Typed TypeScript metadata + MDX (or structured markdown) case-study narratives.**

| Option | Verdict |
|--------|---------|
| **A — TypeScript only** | Fine for indexes and short fields; long narrative + decisions + edge cases become unmaintainable TS strings |
| **B — Metadata TS + MDX bodies** | **Recommended** — type-safe indexes/selectors; narrative in content files; UI stays storage-agnostic |

### Adding a project (target workflow)

1. Metadata entry in `src/content/projects.ts` (or split `src/content/projects/*.ts`)
2. Assets under `public/images/projects/{slug}/` + registry keys in `portfolio-assets.ts`
3. Case-study MDX at `src/content/case-studies/{slug}.mdx` (or equivalent) when narrative is ready

Adding a project must **not** require redesigning `/work` or homepage Selected Work layout.

### Future migration

Keep selectors (`getProjectBySlug`, etc.) as the only UI dependency. Later Laravel/CMS can feed the same DTO shape. Avoid JSX-in-content and component imports inside MDX except a small allowlist of presentational blocks if needed.

---

## 2. Evolution from current `Project` type

Current: `src/content/projects.ts` (`Project`, `ProjectMedia`, `ProjectLink`, …).

Planned refinements (additive; migrate carefully):

### Project

| Field | Notes |
|-------|-------|
| `id` | Stable id (may equal `slug` initially) |
| `slug` | Route key |
| `title` | Full title |
| `shortTitle` | Optional index / nav label |
| `proposition` | One-line concrete claim |
| `summary` | Short paragraph (never `PENDING_*` in published meta) |
| `category` | Prefer normalized taxonomy (see Work Index) |
| `startDate` / `endDate` | ISO `YYYY-MM` or null |
| `yearLabel` | Derived display string |
| `company` | Publishable company or null |
| `clientVisibility` | `public` \| `private` \| `client-confidential` |
| `exactRole` | Exact contribution framing |
| `teamContext` | e.g. Graduation project / team size note |
| `ownership` | What he owned |
| `status` | `canonical` \| `pending_canonical_entry` |
| `confidentiality` | Align with experience model if split needed |
| `featured` | Homepage / work featured flag |
| `homepagePriority` | Optional explicit homepage order |
| `cover` | `ProjectMedia \| null` |
| `accent` | Token key for art direction |
| `metrics` | Prefer structured `ProjectMetric[]` over parallel `results`/`impact` long-term |
| `technologies` | Supporting list |
| `links` | `ProjectLink[]` |
| `media` / `gallery` | Unify naming toward `media` |
| `decisions` | `ProjectDecision[]` or MDX-only |
| `sections` | Structured blocks or MDX TOC |
| `caseStudyAvailability` | `available` \| `partial` \| `unavailable` |
| `sortOrder` | Archive order |
| `nodes` / `connections` | Case-study architecture seed only — not homepage default visual |

Legacy fields `visibility`, `role`, `impact`, `results` remain until a migration collapses duplicates into `exactRole` + `metrics`.

### ProjectMetric

```ts
type ProjectMetric = {
  label: string;
  value: string;
  context: string;
  source: string | null;
  verified: boolean;
  emphasis: "default" | "amber" | "cyan";
};
```

### ProjectLink

```ts
type ProjectLink = {
  type: "live" | "repository" | "appStore" | "playStore" | "documentation" | "caseStudy";
  label: string;
  url: string;
  visibility: "public" | "private" | "restricted";
  opensExternally: boolean;
};
```

*(Extend current link `type` union; add `opensExternally`.)*

### ProjectMedia

```ts
type ProjectMedia = {
  id: string;
  type:
    | "image"
    | "mobileScreenshot"
    | "desktopScreenshot"
    | "architecture"
    | "diagram"
    | "productPhoto"
    | "video"
    | "logo";
  src: string;
  alt: string;
  caption: string | null;
  width: number | null;
  height: number | null;
  orientation: "landscape" | "portrait" | "square" | null;
  device: "desktop" | "mobile" | "tablet" | "other" | null;
  featured: boolean;
  sortOrder: number;
};
```

### ProjectDecision

```ts
type ProjectDecision = {
  title: string;
  context: string;
  decision: string;
  reasoning: string;
  tradeOff: string;
  outcome: string;
};
```

### ProjectSection

Structured case-study sections **without** embedding layout code:

```ts
type ProjectSectionKind =
  | "context"
  | "problem"
  | "contribution"
  | "architecture"
  | "decisions"
  | "edge-cases"
  | "implementation"
  | "results"
  | "lessons"
  | "custom";

type ProjectSection = {
  id: string;
  kind: ProjectSectionKind;
  title: string;
  /** MDX filename fragment or inline markdown — not React trees */
  bodyRef: string;
  sortOrder: number;
};
```

Prefer MDX headings mapping to `kind` over a block-editor. Do not overengineer.

---

## 3. Asset registry

Continue `src/content/portfolio-assets.ts` as the only approved path map.

Rules:

- Components consume registry / media DTOs — never hardcode filenames
- Missing assets → silhouette / typographic fallback
- Never show “missing asset” copy in UI (`MISSING_ASSETS.md`)

---

## 4. Selectors

Keep `src/lib/content/index.ts` as the façade. Add publishability helpers before `/work` ships. UI imports selectors only.

---

## 5. Non-goals (S0)

- No CMS
- No backend
- No new npm dependencies for MDX until Stage S4 implementation (then evaluate Next.js-native MDX already compatible with the stack)
