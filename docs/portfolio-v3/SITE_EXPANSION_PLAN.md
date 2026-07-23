# Site Expansion Plan — Portfolio V3

Status: **S0 complete when architecture docs land**  
Hero at `/concept-v3-rebuild`: visually locked. Production `/` replacement only in **S7**.

Related docs: `SITE_ARCHITECTURE.md`, `HOMEPAGE_STORYBOARD.md`, `WORK_INDEX_SPEC.md`, `CASE_STUDY_SPEC.md`, `PROJECT_CONTENT_MODEL.md`, `PROJECT_SELECTION_MATRIX.md`, `CONTENT_AND_ASSET_GAPS.md`.

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

## Stage S2 — Selected Work homepage chapter

### Build

- 4 (or confirmed 5) project scenes with domain art direction
- `View all projects` → `/work` (link may 404 until S3 — prefer shipping S2+S3 closely, or temporary anchor)
- Verified data only

### Acceptance

- [ ] Distinct scenes; shared type system
- [ ] No Hero KPI strip duplication as sole Merchant Ops story
- [ ] Status / role / one result visible statically

### Stop phrase

`V3 STAGE S2 APPROVED — BUILD STAGE S3`

---

## Stage S3 — `/work`

### Build

- Complete project index (opening, featured, archive)
- Filters only if inventory justifies
- Metadata / OG for `/work`

### Acceptance

- [ ] Not a clone of homepage cards
- [ ] All canonical projects listed; pending unpublished or clearly gated
- [ ] Preview contract fields present

### Stop phrase

`V3 STAGE S3 APPROVED — BUILD STAGE S4`

---

## Stage S4 — Case-study system

### Build

- Reusable `/work/[slug]`
- One flagship case study: **Merchant Operations / Mohssilh** (unless owner redirects)
- Media gallery primitives; architecture section; metadata
- Introduce MDX (or chosen) narrative path per `PROJECT_CONTENT_MODEL.md`

### Acceptance

- [ ] Full required section sequence where content exists; empty sections omitted
- [ ] Confidentiality respected
- [ ] Mobile-readable architecture
- [ ] Prev/next scaffolding works

### Stop phrase

`V3 STAGE S4 APPROVED — BUILD STAGE S5`

---

## Stage S5 — Remaining case studies

### Build

Sequential case studies (suggested order):

1. NABD  
2. Smart Vending (Wasfaty still gated)  
3. Virtual Clinic  
4. Your Obour Guide (after canonical)  
5. AI PDF (after canonical)  

Do not parallelize incomplete narratives.

### Stop phrase

`V3 STAGE S5 APPROVED — BUILD STAGE S6`

---

## Stage S6 — Ownership, Principles coda, Contact

### Build

- Engineering Ownership chapter
- Principles as Ownership coda (not six giant quote cards)
- Contact conclusion with direct actions (no form unless owner requires)

### Acceptance

- [ ] Responsibility-first clustering
- [ ] No skill percentages / badge clouds
- [ ] Résumé + Email + LinkedIn + GitHub work

### Stop phrase

`V3 STAGE S6 APPROVED — BUILD STAGE S7`

---

## Stage S7 — Production integration

### Build

- Replace production homepage with approved V3 composition + chapters
- Production navigation
- Sitemap, metadata, a11y, performance, visual regression
- Content verification pass against canonical + gaps list
- Retire or gate concept routes as appropriate

### Acceptance

- [ ] `/` carries locked hero + approved chapters
- [ ] `/design-system` not in public nav
- [ ] Reduced-motion + laptop hero fit preserved
- [ ] No unpublished pending entries leaked

### Stop phrase

`V3 PRODUCTION HOMEPAGE APPROVED`

---

## Explicit non-goals until later stages

- New hero decoration or composition changes  
- Inspecting `old_site` / historical résumé archives for canonical facts  
- Inventing assets or metrics  
- Parallel incomplete case-study implementation  
