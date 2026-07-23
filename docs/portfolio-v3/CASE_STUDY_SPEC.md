# Case Study Spec — `/work/[slug]`

Status: **S0 — Specification only**  
Reusable route with **per-project art direction**. Layout system shared; visual scenes unique.

---

## 1. Goals

- Progressive depth for technical leads and serious clients
- Honest ownership (never imply solo work when inaccurate)
- Publishable confidentiality boundaries
- Mobile-readable architecture
- Media gallery without fabricated screenshots

---

## 2. Required content sequence

| # | Section | Purpose |
|---|---------|---------|
| 1 | Project Hero | Title, proposition, period, category, status, exact role, team context, company/client when publishable, primary visual, approved links |
| 2 | At a Glance | Role, ownership, duration, platform, selected technologies, confidentiality — tech must not dominate |
| 3 | Context | Why the system existed; who it served; operational/business context |
| 4 | Problem | Difficulty, limitations, scale, constraints, risks |
| 5 | Exact Contribution | Owned / designed / implemented / improved / team-owned |
| 6 | System Architecture | Boundaries, services, data flow, integrations, queues, clients, infrastructure when publishable |
| 7 | Important Engineering Decisions | Decision · reason · trade-offs · outcome |
| 8 | Difficult Edge Cases | Only verified project-specific cases |
| 9 | Implementation Story | Narrative sections, not one dump |
| 10 | Results | Scoped metrics / operational / reliability / product outcomes / lessons |
| 11 | Media Gallery | Screenshots, diagrams, photos, short video — reserved ratios, alt text |
| 12 | Technology | Concise supporting list |
| 13 | Lessons and Trade-Offs | Engineering maturity |
| 14 | Next Project | Prev / next navigation within publishable set |

Sections may collapse when content is `unavailable` / empty — do not render empty shells.

---

## 3. First flagship case study

**Recommendation: Merchant Operations / Mohssilh** (`merchant-operations-salla-automation`)

| Criterion | Assessment |
|-----------|------------|
| Verified metrics | Strongest in inventory (200+, 20K+, 12M+ SAR, API +70–80%, sync −15%) |
| Architecture seed | Only project with populated `nodes` / `connections` |
| Recruiter relevance | High — commerce ops, integrations, reliability |
| Confidentiality | `client-confidential` — architecture/impact OK; no confidential implementation detail |
| Gaps | Period dates null; teamContext null; cover/gallery/links empty; ownership language vs Mohssilh experience needs owner confirmation |

**Challenge to recommendation:** If confidentiality blocks enough narrative depth, promote **NABD** (richer tech story, weaker quantitative results) or wait for **Your Obour Guide** canonical promotion (test/release evidence, logo asset).

Default remains Mohssilh for Stage S4 unless owner rejects publication framing.

---

## 4. Art direction rules

- Shared shell: typography, spacing tokens, section rhythm, link styles, gallery primitives
- Unique: hero atmosphere, accent (`accent` field), cover treatment, optional domain motif
- Architecture visuals: SVG / structured diagram from content — readable on mobile; not confidential internals
- Motion: restrained; reduced-motion functional; no content gated behind animation

---

## 5. SEO and sharing (`/work/[slug]`)

| Field | Direction |
|-------|-----------|
| Title | `{Project title} — Abdalrhman Alkady` |
| Description | From `proposition` or short `summary` (not pending placeholder text) |
| Canonical | `{siteUrl}/work/{slug}` |
| Social image | Project cover when available; else branded OG fallback |
| Structured data | Optional `CreativeWork` / `SoftwareApplication` when public link exists |
| Image alt | Descriptive, non-keyword-stuffed; never empty decorative alts for proof media |

Do not publish pending summary strings like `PENDING_CANONICAL_ENTRY` in meta.

---

## 6. Confidentiality and links

| `clientVisibility` | Behavior |
|--------------------|----------|
| `public` | Full marketing language allowed within verified facts |
| `private` | Product may be named; omit live URLs unless approved |
| `client-confidential` | Prefer company/scope language already approved; omit client-sensitive details, Wasfaty until approved |

Link types (`live`, `repository`, `appStore`, `playStore`, `documentation`, `caseStudy`): render only when `visibility` allows and URL is non-empty.

---

## 7. Navigation between case studies

Order by `sortOrder` among projects with `caseStudyAvailability` ∈ {`available`, `partial`} and publishable narrative.

Footer: previous / next title + short proposition.
