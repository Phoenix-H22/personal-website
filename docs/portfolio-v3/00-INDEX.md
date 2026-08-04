# Portfolio V3 Documentation Index

> [!IMPORTANT]
> This document describes a protected production UI contract.
> Source code remains authoritative. If this document conflicts with current
> source, stop and reconcile the discrepancy before editing.

Last verified against `hero-v2-responsive-rebuild` at
`9f8b06719793a20b79d3795606543e7a231cd4d5`.

## Hero V2 protected engineering documentation

Read in this order:

1. [Hero V2 Engineering Contract](./HERO_V2_ENGINEERING_CONTRACT.md) - Primary architecture, deterministic geometry, generated path, ownership, and protected-behavior contract.
2. [Hero V2 Responsive Geometry](./HERO_V2_RESPONSIVE_GEOMETRY.md) - Breakpoints, layout ownership, desktop sizing formulas, viewport requirements, and responsive acceptance rules.
3. [Hero V2 Motion and Signal Contract](./HERO_V2_MOTION_AND_SIGNAL_CONTRACT.md) - Signal layers, rendered thickness, timing, pause/resume, rotation, and Full/Reduced behavior.
4. [Hero V2 AI Change Protocol](./HERO_V2_AI_CHANGE_PROTOCOL.md) - Mandatory evidence-first workflow, source scope, server ownership, Git safety, and final reporting contract.
5. [Hero V2 Regression Playbook](./HERO_V2_REGRESSION_PLAYBOOK.md) - Symptom-based diagnostics, safe correction directions, acceptance criteria, and browser QA snippets.

> [!WARNING]
> `HERO_V2_AI_CHANGE_PROTOCOL.md` must be read before any Hero V2 production
> edit. Do not begin from a screenshot, a visible Playwright host window, or a
> previous chat summary.

## Related portfolio planning and history

| Document | Role |
| --- | --- |
| [Visual Constitution](./VISUAL_CONSTITUTION.md) | Portfolio-wide visual principles and responsive philosophy. |
| [Hero Implementation Plan](./HERO_IMPLEMENTATION_PLAN.md) | Historical Concept V3 implementation plan; not the final Hero V2 geometry source. |
| [Component Contracts](./COMPONENT_CONTRACTS.md) | Historical Proof Engine component boundaries and design principles. |
| [Portfolio Versioning](./PORTFOLIO_VERSIONING.md) | Historical route/version policy snapshot; verify current metadata, robots, and sitemap source before acting. |
| [Site Architecture](./SITE_ARCHITECTURE.md) | Portfolio route and chapter planning record; verify current route source before acting. |
| [Canonical Content](../CANONICAL_CONTENT.md) | Owner-approved facts and publication rules. |

The protected Hero V2 documents are narrower and newer than the historical
Concept V3 plans. Some related planning records predate current `/v2` metadata
and publication policy. For current Hero geometry, responsive behavior, signal
motion, routes, and metadata, production source remains authoritative.

## Verification status

- Branch: `hero-v2-responsive-rebuild`
- Commit: `9f8b06719793a20b79d3795606543e7a231cd4d5`
- Verified files: `docs/portfolio-v3/HERO_V2_ENGINEERING_CONTRACT.md`, `docs/portfolio-v3/HERO_V2_RESPONSIVE_GEOMETRY.md`, `docs/portfolio-v3/HERO_V2_MOTION_AND_SIGNAL_CONTRACT.md`, `docs/portfolio-v3/HERO_V2_AI_CHANGE_PROTOCOL.md`, `docs/portfolio-v3/HERO_V2_REGRESSION_PLAYBOOK.md`, `docs/portfolio-v3/VISUAL_CONSTITUTION.md`, `docs/portfolio-v3/HERO_IMPLEMENTATION_PLAN.md`, `docs/portfolio-v3/COMPONENT_CONTRACTS.md`, `docs/portfolio-v3/PORTFOLIO_VERSIONING.md`, `docs/portfolio-v3/SITE_ARCHITECTURE.md`, `docs/CANONICAL_CONTENT.md`
- Verification date: `2026-08-04`
- Documentation-only change: Yes
