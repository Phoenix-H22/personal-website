# Portfolio versioning

## Routes

| Version | Route | Role |
| --- | --- | --- |
| **Current (V1)** | `/` | Approved public baseline (former `/concept-v3-rebuild`) — **frozen** |
| **V2** | `/v2` | Next iteration sandbox (S2A/S2B active) |

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

**Shared today:**

- Hero / Origin / Career implementations under `components/concept-v3-rebuild/**`
- Styles under `styles/concept-v3-rebuild/**`
- Content + asset registries under `src/content/**`
- Layout-mode + motion preference providers

**Variant-specific today (V2 diverged in S2A/S2B):**

- Route page metadata (`src/app/page.tsx` vs `src/app/v2/page.tsx`)
- `PortfolioVariantConfig` flags:
  - Current: `full-proof-constellation` + Education Journey + Product Deck
  - V2: `simplified` Hero + Education Credential + technology line + Featured Systems
- V2-only copy overrides (`hero.copy`) — Software Engineer positioning
- V2-only section: Featured / Selected Systems (`#selected-systems`)

**Technical debt:** experimental folder names (`concept-v3-rebuild`) remain until a
focused rename is justified. V2 must keep importing the same modules where shared.

## V2 chapter order (locked)

Simplified Hero → Origin → Career → Featured / Selected Systems

Do not reorder. Do not restore Education Journey / Product Deck on V2 Hero.

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

S2A status: **complete on `/v2`** — simplified Hero + Selected Systems.  
Current `/` remains frozen. Report: `docs/portfolio-v3/qa/S2A_IMPLEMENTATION_REPORT.md`.

Awaiting: **S2A V2 SELECTED SYSTEMS APPROVED**
