# Portfolio route consolidation — final report

Status: **complete** — architecture/cleanup only. No S2-PRE.

## Safety checkpoint

| Item | Value |
| --- | --- |
| Checkpoint hash | `5dfc495` |
| Message | `chore: checkpoint before portfolio route consolidation` |
| Branch | `main` |
| Tree before checkpoint | **clean** (empty checkpoint commit) |

## Gates

| Gate | Result |
| --- | --- |
| A — Root parity | **Pass** — `/` renders shared approved baseline; focused captures match expected composition |
| B — V2 isolation | **Pass** — `/v2` uses same `PortfolioPage` + typed `v2` config; no forked page tree |
| C — Safe comparison | **Pass** — env-gated Current \| V2 switch; routes correctly; no localStorage |
| D — SEO isolation | **Pass** — `/v2` noindex/nofollow, canonical `/`, excluded from sitemap + robots disallow |
| E — Cleanup | **Pass** — obsolete experiment routes/components removed; redirect retained for old path |
| F — No regressions | **Pass** — Hero/Origin/Career, logos, Product Deck, education badge, filmstrip OK |

## Root route migration

- `src/app/page.tsx` renders `<PortfolioPage config={getPortfolioVariant("current")} />`
- Primary implementation is the shared shell (not a redirect to the old experiment path)
- Nav brand / home defaults to `/` (`RebuildNav` `homeHref`)

## V2 route architecture

- `src/app/v2/page.tsx` → same shell with `getPortfolioVariant("v2")`
- Initially identical visual baseline (intentional)
- Metadata: noindex, nofollow, canonical `/`

## Shared vs variant-specific

**Shared:** `PortfolioPage`, Hero / Origin / Career under `concept-v3-rebuild/**`, styles, content, layout-mode, motion providers

**Variant-specific:** route metadata + `PortfolioVariantConfig` flags (currently identical baselines)

**Technical debt (documented):** experimental folder names retained; do not duplicate for V2

## Version switch

- `PortfolioVersionSwitchGate` (server) + `PortfolioVersionSwitch` (client, dynamic import when enabled)
- Flag: `NEXT_PUBLIC_ENABLE_PORTFOLIO_VERSION_SWITCH=true` (`.env.example` + local `.env.local`)
- Fixed bottom-right; not in public nav

## SEO protections for V2

- Page robots: noindex, nofollow
- Canonical → `/`
- `robots.ts` disallows `/v2`
- Sitemap only includes `/`

## Old routes removed

| Path | Action |
| --- | --- |
| `/concept-v3-rebuild` | Implementation deleted; **permanent redirect → `/`** (bookmarks / QA) |
| `/concept-v2` | Removed |
| `/concept-v3` | Removed |

## Old components / styles removed

- `components/concept-v2/**`, `styles/concept-v2.css`
- `components/concept-v3` exclusive hero/nav/artifacts (kept `shared/*` + theme for design-system)
- Obsolete home: `hero`, `proof-rail`, `featured-project`, `contact-cta`, `layout/site-header`
- `styles/concept-v3/proof-engine.module.scss`

## Redirects retained

- `/concept-v3-rebuild` → `/` (permanent) — bookmarks and historical QA URLs

## QA tooling

- Primary capture: `scripts/capture-portfolio-routes.mjs` (`/` + `/v2`)
- Legacy capture scripts retargeted from `/concept-v3-rebuild` → `/`

## Focused viewport validation

Base: `http://localhost:3010` (production build with `.env.local`)

Viewports: 1440×900, 1366×768, 1024×1366, 390×844 — both routes

| Check | Result |
| --- | --- |
| `data-portfolio-variant` | `current` / `v2` as expected |
| Horizontal overflow | none |
| Education badge overlap | none |
| Product Deck non-zero | yes |
| Filmstrip logos loaded | all four |
| Version switch present | yes (flag on) |
| `/concept-v3-rebuild` redirect | lands on `/` |
| Console errors | **0** |

Artifacts: `docs/portfolio-v3/qa/routes/`

## Build / typecheck / lint

| Command | Result |
| --- | --- |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass (after wrapping design-system chapters in `MotionPreferenceProvider`) |

## Remaining defects / debt

1. Folder names still say `concept-v3-rebuild` (documented debt; no mass rename)
2. Kayanac logo remains low-contrast by asset (pre-existing; not introduced here)
3. Version switch is intentionally temporary and env-gated
4. Canonical absolute host follows `metadataBase` (local may show `localhost:3000`); path remains `/`

## Exact files changed (high level)

**Added:** `.env.example`, `docs/portfolio-v3/PORTFOLIO_VERSIONING.md`, `docs/portfolio-v3/ROUTE_CONSOLIDATION_REPORT.md`, `scripts/capture-portfolio-routes.mjs`, `scripts/check-route-seo.mjs`, `src/app/v2/page.tsx`, `src/components/portfolio/**`, `src/lib/portfolio/**`, `src/styles/portfolio/**`, `docs/portfolio-v3/qa/routes/**`

**Updated:** root `page.tsx`, `robots.ts`, `next.config.ts`, architecture docs, rebuild-nav, layout-mode-provider, design-system chapters, QA capture scripts → `/`

**Removed:** `/concept-v2`, `/concept-v3`, `/concept-v3-rebuild` page implementations; unused concept-v2/v3 home components & exclusive styles

## Stop line

No S2-PRE. No Hero simplification. No Selected Systems. No `/work`. No contact functionality.

**PORTFOLIO ROUTES CONSOLIDATED — READY FOR S2-PRE**
