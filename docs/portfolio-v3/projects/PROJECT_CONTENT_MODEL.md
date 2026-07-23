# Project Content Model — S2-PRE

Status: **Canonical domain model for S2A+**  
Supersedes implementation detail in `docs/portfolio-v3/PROJECT_CONTENT_MODEL.md` (stub → this file).

Foundation code: `src/lib/portfolio/projects/`.

Rules:

- No JSX in data  
- No React components in the content model  
- MDX is an optional **authoring adapter** that must serialize to the same block union  
- UI consumes repository outputs only  

---

## Core enums

```ts
type ProjectStatus =
  | "live"
  | "in-development"
  | "completed"
  | "maintained"
  | "archived";

type ProjectPublicationStatus = "draft" | "review" | "published" | "hidden";

type ProjectVisibility = "public" | "unlisted" | "private";

type ProjectConfidentiality =
  | "public"
  | "public-limited"
  | "private"
  | "internal-only";

type EvidenceStatus =
  | "verified"
  | "owner-confirmed"
  | "source-supported"
  | "unverified"
  | "not-applicable";
```

---

## Shared value objects

```ts
interface ProjectPeriod {
  start: string | null; // YYYY-MM or YYYY-MM-DD
  end: string | null;
  label?: string;
}

interface ProjectCompanyReference {
  id: string;
  name: string;
  publishName: boolean;
}

interface ProjectMetric {
  id: string;
  value: string;
  label: string;
  context?: string;
  evidenceStatus: EvidenceStatus;
  public: boolean;
}

interface ProjectLink {
  type: "live" | "repository" | "demo" | "store" | "article" | "documentation";
  label: string;
  url: string;
  public: boolean;
}

interface ProjectVisualTheme {
  id: string;
  primary: "cyan" | "blue" | "violet" | "green" | "amber";
  secondary?: "cyan" | "blue" | "violet" | "green" | "amber";
  motif:
    | "order-lifecycle"
    | "message-routing"
    | "scan-pay-release"
    | "city-map"
    | "clinic-flow"
    | "document-pipeline"
    | "neutral";
}

interface ProjectSeo {
  title: string;
  description: string;
  canonicalPath: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImageId?: string;
  robots: { index: boolean; follow: boolean };
  structuredDataType:
    | "CreativeWork"
    | "SoftwareApplication"
    | "WebApplication"
    | "MobileApplication";
  publishedAt?: string;
  modifiedAt: string;
}
```

Media: see `PROJECT_MEDIA_AUDIT.md` / types `ProjectMedia`.

---

## ProjectSummary

Used by Selected Systems + Systems Atlas previews.

```ts
interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  summary: string;

  status: ProjectStatus;
  publicationStatus: ProjectPublicationStatus;
  visibility: ProjectVisibility;
  confidentiality: ProjectConfidentiality;

  period: ProjectPeriod;
  company?: ProjectCompanyReference;

  domains: string[];
  roles: string[];
  platforms: string[];
  technologies: string[];

  ownershipSummary: string;
  strongestProof?: ProjectMetric;

  featured: boolean;
  homepageOrder: number | null; // 1–4 for Selected Systems; null = not on homepage
  workOrder: number;

  cover: ProjectMedia | null;
  visualTheme: ProjectVisualTheme;

  caseStudyAvailable: boolean;
  seo: Pick<ProjectSeo, "title" | "description" | "robots">;
}
```

---

## ProjectCaseStudy

```ts
interface ProjectCaseStudy extends ProjectSummary {
  problem: string;
  ownership: string;
  constraints: string[];
  metrics: ProjectMetric[];
  links: ProjectLink[];
  gallery: ProjectMedia[];
  blocks: ProjectCaseStudyBlock[];
  seo: ProjectSeo;
  publishedAt?: string;
  updatedAt: string;
  relatedSlugs: string[];
}
```

---

## Discriminated case-study blocks

Every block includes: `id`, `type`, `order`, `publicationStatus`, optional `heading`, optional `anchor`.

```ts
type ProjectCaseStudyBlock =
  | ProjectTextBlock
  | ProjectListBlock
  | ProjectArchitectureBlock
  | ProjectDecisionBlock
  | ProjectMetricGroupBlock
  | ProjectMediaBlock
  | ProjectGalleryBlock
  | ProjectDiagramBlock
  | ProjectQuoteBlock;

type ProjectTextBlockType =
  | "overview"
  | "context"
  | "problem"
  | "ownership"
  | "constraints"
  | "workflow"
  | "implementation"
  | "integration"
  | "reliability"
  | "security"
  | "performance"
  | "difficult-edge-case"
  | "outcome"
  | "lesson"
  | "retrospective"
  | "next-step";

interface ProjectTextBlock {
  id: string;
  type: ProjectTextBlockType;
  order: number;
  publicationStatus: ProjectPublicationStatus;
  heading?: string;
  anchor?: string;
  body: string; // markdown-capable plain text, not JSX
}

interface ProjectListBlock {
  id: string;
  type: "constraints" | "technologies";
  order: number;
  publicationStatus: ProjectPublicationStatus;
  heading?: string;
  anchor?: string;
  items: string[];
}

interface ProjectArchitectureBlock {
  id: string;
  type: "architecture";
  order: number;
  publicationStatus: ProjectPublicationStatus;
  heading?: string;
  anchor?: string;
  summary: string;
  nodes: { id: string; label: string; detail: string; kind: string }[];
  connections: { from: string; to: string }[];
  textAlternative: string;
}

interface ProjectDecisionBlock {
  id: string;
  type: "engineering-decision";
  order: number;
  publicationStatus: ProjectPublicationStatus;
  heading?: string;
  anchor?: string;
  context: string;
  decision: string;
  alternativesRejected?: string[];
  tradeOff: string;
  outcome: string;
}

interface ProjectMetricGroupBlock {
  id: string;
  type: "metrics";
  order: number;
  publicationStatus: ProjectPublicationStatus;
  heading?: string;
  anchor?: string;
  metricIds: string[];
}

interface ProjectMediaBlock {
  id: string;
  type: "image" | "video";
  order: number;
  publicationStatus: ProjectPublicationStatus;
  heading?: string;
  anchor?: string;
  mediaId: string;
}

interface ProjectGalleryBlock {
  id: string;
  type: "gallery";
  order: number;
  publicationStatus: ProjectPublicationStatus;
  heading?: string;
  anchor?: string;
  mediaIds: string[];
}

interface ProjectDiagramBlock {
  id: string;
  type: "system-diagram";
  order: number;
  publicationStatus: ProjectPublicationStatus;
  heading?: string;
  anchor?: string;
  diagramId: string;
  textAlternative: string;
}

interface ProjectQuoteBlock {
  id: string;
  type: "quote";
  order: number;
  publicationStatus: ProjectPublicationStatus;
  heading?: string;
  anchor?: string;
  quote: string;
  attribution?: string;
}
```

Not every project uses every block type.

---

## Localization (future — not implemented)

**Recommended for Laravel:** translation records keyed by `(project_id, locale, field)` for scalar fields, plus `project_block_translations` for block bodies.

Alternative: locale-shaped objects (`title: { en, ar }`) — simpler early, harder in admin forms and partial translation.

Frontend domain may expose already-resolved locale strings from the repository (`getProjectBySlug(slug, { locale })`).

---

## Migration from current `src/content/projects.ts`

| Legacy | Target |
| --- | --- |
| `results` / `impact` | `metrics[]` with `evidenceStatus` + `public` |
| `exactRole` / `role` | `roles[]` + `ownershipSummary` |
| `clientVisibility` | `confidentiality` + `visibility` |
| `status: canonical \| pending` | `publicationStatus` + readiness gates |
| `nodes` / `connections` | `architecture` block |
| Empty `PENDING_*` summaries | Must not publish |

Local repository may adapt legacy content during S2A until fixtures replace it.
