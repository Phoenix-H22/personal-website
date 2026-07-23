# Site Expansion Plan — Portfolio V3

Status: **S2-PRE complete — awaiting approval to build S2A**  
Hero on `/`: visually locked as the approved baseline. Next-iteration changes happen on `/v2` only (see `PORTFOLIO_VERSIONING.md`).

Project foundation (canonical): `docs/portfolio-v3/projects/`  
Related: `SITE_ARCHITECTURE.md`, `HOMEPAGE_STORYBOARD.md`, `PORTFOLIO_VERSIONING.md`, `CONTENT_AND_ASSET_GAPS.md`.

---

## Stage S0 — Architecture and content contracts

### Acceptance

- [x] Eight required docs present under `docs/portfolio-v3/`
- [x] Route recommendations include About/Contact decisions
- [x] Homepage chapter order defined
- [x] Selected project recommendation without invented facts
- [x] Gaps explicitly marked

### Stop phrase

`V3 SITE ARCHITECTURE APPROVED — BUILD STAGE S1`

---

## Stage S1-PRE — Experience sync + official asset wiring

### Scope

- Complete LinkedIn + résumé experience inventory in `experience.ts`
- Education grade separation (Honors vs Capstone A+)
- Company / education logo registry wiring
- `EXPERIENCE_SOURCE_AUDIT.md`
- No Origin / Career / Selected Work UI

### Acceptance

- [x] Full inventory structured with publication levels
- [x] Date conflicts marked `NEEDS_OWNER_CONFIRMATION`
- [x] Logos wired (Intsolutions remains null)
- [x] Hero Education compact wording corrected only
- [x] Phone unpublished; Upwork Hero path unchanged

### Stop phrase

`S1 EXPERIENCE AND ASSET INVENTORY APPROVED — BUILD STATIC ORIGIN AND CAREER`

---

## Stage S1A — Static Origin + Career

### Build

- Education (Origin) chapter UI — desktop / tablet / mobile
- Professional Experience (Career Chapters) UI — era rail + records / accordion
- Independent parallel track
- Design-system previews at `/design-system/chapters`
- No GSAP for new sections

### Acceptance

- [x] Origin expands hero education without duplicating compact artifact
- [x] Primary / supporting / archive filtering
- [x] Desktop era rail; tablet grouped; mobile company accordion
- [x] Intsolutions typographic fallback
- [x] Design-system chapter previews
- [x] Static QA screenshots under `docs/portfolio-v3/qa/concept-v3-s1a-*`

### Stop phrase

`V3 STAGE S1A STATIC APPROVED — BUILD S1B MOTION POLISH`

---

## Stage S1B — Motion polish (Origin + Career)

GSAP / scroll enhancement only after S1A approval. Do not redesign compositions.

### Stop phrase

`V3 STAGE S1 APPROVED — BUILD STAGE S2`

---

## Stage S2-PRE — Project foundation (complete)

Inventory, selection, domain/repo/API contracts, media audit, Selected Systems / Atlas / Dossier art direction.

Canonical docs: `docs/portfolio-v3/projects/*`  
Plan: `projects/S2_IMPLEMENTATION_PLAN.md`

### Stop phrase

`S2 PROJECT FOUNDATION APPROVED — BUILD V2 SELECTED SYSTEMS`

---

## Stage S2A — V2 Hero simplification + Selected Systems

### Build

- V2-only Hero transition (remove Education Journey + Product Deck; add credential + Explore selected systems)
- Selected Systems chapter on `/v2` for exactly four projects
- LocalProjectRepository wiring for featured summaries
- Responsive + motion + a11y per `SELECTED_SYSTEMS_STORYBOARD.md`
- No changes to Current `/`

### Stop phrase

`V3 STAGE S2A APPROVED — BUILD SYSTEMS ATLAS`

---

## Stage S3 — Systems Atlas (`/v2/work`)

Search, filters, URL state, project previews. Promote path to `/work` at S8.

### Stop phrase

`V3 STAGE S3 APPROVED — BUILD SYSTEM DOSSIER`

---

## Stage S4 — System Dossier shell + Flagship case study

Reusable dossier + Merchant Operations Flagship.

### Stop phrase

`V3 STAGE S4 APPROVED — BUILD REMAINING DOSSIERS`

---

## Stage S5 — Remaining project pages

NABD → Smart Vending (Wasfaty gated) → Virtual Clinic → Obour/AI PDF after canonical.

### Stop phrase

`V3 STAGE S5 APPROVED — BUILD OWNERSHIP AND CONTACT`

---

## Stage S6 — Engineering Ownership + Contact

Ownership chapter, contact (phone/WhatsApp only when approved), form + reCAPTCHA, footer.

### Stop phrase

`V3 STAGE S6 APPROVED — BUILD LARAVEL BACKEND`

---

## Stage S7 — Laravel backend

Admin, media, ApiProjectRepository, cache revalidation.

### Stop phrase

`V3 STAGE S7 APPROVED — HARDEN AND PROMOTE`

---

## Stage S8 — SEO / performance / a11y / security + V2 → Current promotion

Remove temporary version switch; update canonicals; retire `/v2`.

### Stop phrase

`V3 PRODUCTION PORTFOLIO APPROVED`

---

## Explicit non-goals until later stages

- New hero decoration or composition changes  
- Inspecting `old_site` / historical résumé archives for canonical facts  
- Inventing assets or metrics  
- Parallel incomplete case-study implementation  
