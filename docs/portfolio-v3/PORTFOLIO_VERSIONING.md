# Portfolio versioning

## Routes

| Version | Route | Role |
| --- | --- | --- |
| **Current (V1)** | `/` | Approved public baseline (former `/concept-v3-rebuild`) |
| **V2** | `/v2` | Next iteration sandbox — same baseline until S2+ |

`/concept-v3-rebuild` permanently redirects to `/` (bookmarks / old QA URLs).

## Variant architecture

Typed config lives in `src/lib/portfolio/portfolio-variant.ts`.

Shared shell: `src/components/portfolio/portfolio-page.tsx`

```ts
<PortfolioPage config={getPortfolioVariant("current")} />
<PortfolioPage config={getPortfolioVariant("v2")} />
```

Components receive deliberate typed configuration. Do **not** scatter
`pathname === "/v2"` checks inside section components.

### Shared versus variant-specific

**Shared today (do not duplicate for V2):**

- Hero / Origin / Career implementations under `components/concept-v3-rebuild/**`
- Styles under `styles/concept-v3-rebuild/**`
- Content + asset registries under `src/content/**`
- Layout-mode + motion preference providers

**Variant-specific today:**

- Route page metadata (`src/app/page.tsx` vs `src/app/v2/page.tsx`)
- `PortfolioVariantConfig` flags (hero / sections) — currently identical baselines

**Technical debt:** experimental folder names (`concept-v3-rebuild`) remain until a
focused rename is justified. V2 must keep importing the same modules.

## Expected future differences (not implemented in this pass)

V2 only, in later stages:

- simplified Hero
- Education credential chip
- Explore Selected Systems signal
- Selected Systems section
- broader portfolio expansion

Update `portfolioVariants.v2` when those land. Keep `/` on the approved baseline
until V2 is promoted.

## Version switch

Environment flag:

```bash
NEXT_PUBLIC_ENABLE_PORTFOLIO_VERSION_SWITCH=true
```

Documented in `.env.example`.

| Environment | Flag | Behavior |
| --- | --- | --- |
| Local / staging | `true` | Fixed bottom-right **Current \| V2** control visible |
| Production | unset / `false` | Control not rendered; client module not loaded |

- Uses `next/link`; route is the source of truth (no `localStorage`)
- Not in public navigation
- Development utility only

## SEO

| Route | Indexing | Canonical | Sitemap |
| --- | --- | --- | --- |
| `/` | index, follow | `/` | included |
| `/v2` | **noindex, nofollow** | `/` | **excluded** |
| `/design-system/**` | noindex | — | excluded |
| `/concept-v3-rebuild` | redirect → `/` | — | excluded |

`robots.ts` disallows `/v2` and `/design-system`.

## Deletion policy for old experiments

Removed in the consolidation pass:

- `/concept-v2`, `/concept-v3` routes and exclusive components
- Obsolete homepage (`components/home` hero/proof/contact/featured) replaced by portfolio shell
- `styles/concept-v2.css`, concept-v3 proof-engine styles exclusive to deleted routes

Retained:

- Approved shared portfolio sections (even under `concept-v3-rebuild` paths)
- Design-system utilities still imported by `/design-system`
- Canonical content + assets
- QA evidence under `docs/portfolio-v3/qa/**`

## Final promotion process (after V2 is approved)

1. Complete and approve V2 visually and functionally
2. Point root `page.tsx` at the promoted configuration (or swap `current` defaults)
3. Remove `NEXT_PUBLIC_ENABLE_PORTFOLIO_VERSION_SWITCH` and the switch components
4. Remove or redirect `/v2`
5. Update canonical metadata / Open Graph as needed
6. Run final SEO, performance, and accessibility audits

Do not begin S2-PRE until: **PORTFOLIO ROUTES CONSOLIDATED — READY FOR S2-PRE**

Consolidation pass status: **complete**. See `ROUTE_CONSOLIDATION_REPORT.md`.

S2-PRE status: **complete**. Canonical project docs: `docs/portfolio-v3/projects/`.  
Awaiting: **S2 PROJECT FOUNDATION APPROVED — BUILD V2 SELECTED SYSTEMS**
