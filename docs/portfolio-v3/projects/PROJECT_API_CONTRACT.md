# Project API Contract — S2-PRE

Status: **Provider-agnostic Laravel contract (not implemented)**  
Consumers: `ApiProjectRepository` only after runtime validation.

---

## Base

- Prefix: `/api/v1/portfolio`
- Format: JSON
- Auth: none for published public endpoints
- Preview: separate protected endpoints (see §Preview)

### Envelope

```json
{
  "data": {},
  "meta": {
    "apiVersion": "1",
    "generatedAt": "2026-07-23T12:00:00.000Z"
  }
}
```

Errors:

```json
{
  "error": {
    "code": "not_found" | "validation_error" | "unauthorized" | "forbidden" | "rate_limited" | "server_error",
    "message": "Human-readable safe message",
    "details": []
  }
}
```

---

## Endpoints

### `GET /api/v1/portfolio/projects/featured`

Returns published featured summaries ordered by `homepageOrder`.

Cache: `public, max-age=60, s-maxage=300, stale-if-error=86400`  
ETag / `Last-Modified` from aggregate `updated_at`.

### `GET /api/v1/portfolio/projects`

Query:

| Param | Type | Notes |
| --- | --- | --- |
| `domain` | repeatable string | OR within param, AND across different params |
| `role` | repeatable string | |
| `platform` | repeatable string | |
| `technology` | repeatable string | |
| `status` | repeatable enum | live, maintained, completed, … |
| `q` | string | search |
| `page` | int ≥1 | default 1 |
| `pageSize` | int 1–24 | default 12 |
| `sort` | `workOrder` \| `updatedAt` \| `title` | default `workOrder` |

Published-only. Private/draft never listed.

### `GET /api/v1/portfolio/projects/{slug}`

- 200: full case study DTO  
- 404: missing, private, draft, or hidden (same response body — no existence leak)  
- Optional `?locale=en|ar` (future)

### `GET /api/v1/portfolio/project-filters`

Filter option counts for published projects only.

---

## DTO vs domain

```
Laravel JSON
  → Zod DTO schemas (strict)
  → Domain mapper
  → ProjectRepository
  → Server Components
```

Do not bind frontend domain types to Eloquent serialization.

---

## Search behavior

Server-side over public fields only: title, shortTitle, subtitle, summary, domains, ownershipSummary, technologies.

Normalize: trim, collapse whitespace, case-insensitive.  
No private block text. No giant fuzzy-search dependency required.

---

## Preview / draft safety

- Public routes never return drafts  
- Preview requires signed token or authenticated session  
- Preview responses: `Cache-Control: no-store`  
- `X-Robots-Tag: noindex, nofollow`  
- Invalid preview → 404-equivalent safe response  
- UI may show a visible “Preview” chrome later (S7+) — not in S2-PRE  

Suggested future routes (backend):

- `GET /api/v1/portfolio/preview/projects/{slug}?token=…`

---

## Locale

Optional `locale` query. Missing → default site locale.  
Partial translations fall back to default locale fields.

---

## Caching / revalidation (frontend plan)

Tags:

- `portfolio-projects`
- `portfolio-featured-projects`
- `portfolio-project:{slug}`
- `portfolio-filter-options`

Laravel webhook or secure revalidation endpoint invalidates tags by slug / index.  
Prefer `updated_at` + ETag for CDN freshness.
