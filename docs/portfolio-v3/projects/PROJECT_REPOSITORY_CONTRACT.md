# Project Repository Contract — S2-PRE

Status: **Canonical**  
Code: `src/lib/portfolio/projects/`

---

## Boundary rule

Project pages and components **must never** import raw local arrays (`@/content/projects`) directly.

All access goes through `ProjectRepository`.

```ts
interface ProjectRepository {
  getFeaturedProjects(): Promise<ProjectSummary[]>;

  getProjects(
    filters?: ProjectFilters,
    pagination?: ProjectPagination,
  ): Promise<ProjectCollection>;

  getProjectBySlug(
    slug: string,
    options?: ProjectQueryOptions,
  ): Promise<ProjectCaseStudy | null>;

  getPublishedSlugs(): Promise<string[]>;

  getProjectFilterOptions(): Promise<ProjectFilterOptions>;
}
```

---

## Implementations

| Adapter | Source | When |
| --- | --- | --- |
| `LocalProjectRepository` | Typed local content / fixtures | Now → S6 |
| `ApiProjectRepository` | Laravel `/api/v1/portfolio/*` | S7 |
| `getProjectRepository()` | Factory from env | Always |

UI does not know which adapter is active.  
Both return the same domain types.  
External data is validated before mapping.

---

## Safety rules

- Public repository methods never return `draft`, `hidden`, or `visibility: private`
- `internal-only` confidentiality never appears in public summaries
- Metrics with `public: false` are stripped
- Links with `public: false` are stripped
- Preview mode (future) uses a separate authenticated path — not the public repository
- Server-compatible only — no client global store

---

## Filters / pagination (domain)

```ts
interface ProjectFilters {
  domain?: string[];
  role?: string[];
  platform?: string[];
  technology?: string[];
  status?: ProjectStatus[];
  search?: string;
}

interface ProjectPagination {
  page: number; // 1-based
  pageSize: number;
}

interface ProjectCollection {
  items: ProjectSummary[];
  total: number;
  page: number;
  pageSize: number;
}

interface ProjectQueryOptions {
  locale?: string;
  includeDrafts?: boolean; // public repo ignores / throws
}

interface ProjectFilterOptions {
  domains: { value: string; count: number }[];
  roles: { value: string; count: number }[];
  platforms: { value: string; count: number }[];
  technologies: { value: string; count: number }[];
  statuses: { value: ProjectStatus; count: number }[];
}
```

---

## Featured ordering

`getFeaturedProjects()` returns published projects with `featured: true` and `homepageOrder != null`, sorted by `homepageOrder` ascending.

Expected S2A set:

1. merchant-operations-salla-automation  
2. nabd-messaging-platform  
3. smart-vending-medication-dispensing  
4. virtual-clinic-dr-robot  
