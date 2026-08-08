# Homepage Storyboard — Portfolio V3

Status: **Current `/` locked** · V2 Selected Systems specified in S2-PRE  
Canonical Selected Systems art direction: `projects/SELECTED_SYSTEMS_STORYBOARD.md`

---

## Chapter map

| # | Chapter | Anchor (planned) | Primary job |
|---|---------|------------------|-------------|
| 1 | Approved Hero | (top) | Identity + selected proof + actions |
| 2 | Origin | `#education` | Education depth without duplicating hero artifact |
| 3 | Career Chapters | `#experience` | Progression and ownership eras |
| 4 | Selected Systems (V2) | `#selected-systems` | Flagship + 3 supporting → Systems Atlas |
| 5 | Engineering Ownership | `#ownership` | Problems he can own end to end |
| 5b | Principles (merged coda) | (within `#ownership`) | Six short principles with proof refs |
| 6 | Contact Conclusion | `#contact` | Closing offer + direct actions |

*(Numbering: Principles are not a separate full chapter — see §6.)*

---

## Chapter 1 — Approved Hero

**Source of truth:** `/` implementation (shared with `/v2`) + Visual Constitution.

**Already communicates:**

- Name, positioning, résumé / contact actions, socials
- Upwork Top Rated · 100% JSS
- Commerce scale (Mohssilh-scoped metrics)
- Product Deck preview (Your Obour Guide, Smart Vending, NABD)
- Education journey preview (2018–2025)

**Do not:** redesign, add decoration, or restate every hero fact in Chapter 2–4 openings.

---

## Chapter 2 — Origin

**Title direction:** `Where the engineering mindset started.`  
**Not:** a second Education Journey card clone.

### Content (canonical)

**Obour STEM School** (`src/content/education.ts`)

- 2018-09 → 2021-06 · Obour, Egypt
- STEM secondary education
- Summary: scientific problem-solving, competitions, teamwork, practical software development
- Logo: `/images/education/stem-obour.png` wired in `education.ts`

**University of Sadat City**

- 2021-09 → 2025-08 · Sadat City, Egypt
- Faculty of Computers and Artificial Intelligence
- B.Sc. Computer Science
- Cumulative A-grade with Honors *(overall result — not A+)*
- Graduation project: Virtual Clinic / Dr. Robot — A+ *(capstone — not the cumulative result)*
- Compact: `A-grade with Honors · Capstone graded A+` (owner-confirmed; wired in hero Education copy)
- Logo: `/images/education/uscElsadat.png` wired in `education.ts`

### Creative direction

- One continuous progression: curiosity → foundation → production-oriented ownership
- Real institution logos; concise narrative; selected achievements only
- Metaphor: illuminated learning route / two connected milestones increasing in technical complexity
- No dense transcript; no hero-style compact artifact duplication

### Responsive

| Breakpoint | Behavior |
|------------|----------|
| Desktop | Horizontal or staged route with clear milestones |
| Tablet | Same narrative, simplified spacing |
| Mobile | Vertical narrative; logos + dates always visible; no sticky fragility; no drag-required horizontal timeline |

---

## Chapter 3 — Career Chapters

**Title direction:** `Ownership grew with every system.`

### Eras (`src/content/experience.ts` → `careerEras`)

1. **Engineering foundations** — `engineering-foundations` (2018–2023) — Eraasoft, Intsolutions + compressed STEM/community archive  
2. **Shipping products** — `shipping-products` (2023–2024) — KLLIQ, Tjar, Marqity (supporting), Maryzad (archive)  
3. **ERP & operations** — `owning-production-systems` (2024–Present) — Theqah, Kayanac, Mohssilh  
4. **Freelance** (public Career lane) — Upwork only · Phoenix Tech’s preserved in source/archive but hidden from public Career  

Canonical facts: `docs/CANONICAL_CONTENT.md`. Historical discovery notes: `EXPERIENCE_SOURCE_AUDIT.md`.

### Primary Career records (canonical)

| id | Company | Role | Period |
|----|---------|------|--------|
| `klliq` | KLLIQ LLC | Software Engineer (Contract) | 2023-09 – 2024-03 |
| `tjar` | Tjar.sa | Software Engineer (Contract) | 2024-03 – 2024-05 |
| `theqah` | Theqah.sa | Software Engineer | 2024-08 – 2025-02 |
| `kayanac-erp` | Kayanac ERP | Software Engineer (Contract) | 2025-03 – 2025-06 |
| `mohssilh` | Mohssilh | Backend Software Engineer | 2025-03 – 2026-04 |
| `theqah-rejoin` | Theqah.sa | Software Engineer | 2025-09 – 2026-06 |
| `kayanac-erp-rejoin` | Kayanac ERP | Software Engineer | 2026-08 – Present (current) |

Company logos: wired via `portfolio-assets.ts` except Intsolutions (`null`).

### Interaction model

| Surface | Pattern |
|---------|---------|
| Desktop | Era navigation rail + one active reading area; compact records; progressive disclosure |
| Tablet | Grouped chapters; no narrow sticky rail |
| Mobile | Vertical timeline or accordion; company / role / dates before expand; one open at a time; no hover dependency |

### Each entry must answer ≥1

What he owned · improved · built · complexity gained · measurable result changed.

Company logos: wired for most primary/supporting companies; Intsolutions and community orgs use typographic fallback later. Never fake logos.

---

## Chapter 4 — Selected Systems (V2)

**Canonical art direction:** `projects/SELECTED_SYSTEMS_STORYBOARD.md`  
**Selection:** `projects/PROJECT_SELECTION_MATRIX.md`  
**Title:** Selected Systems  
**Supporting:** Products, platforms, and infrastructure built for real operations.  
**Anchor:** `#selected-systems`  
**CTA:** Explore all systems → `/v2/work` (promotes to `/work` at S8)

### Homepage set (exactly 4)

1. **Flagship:** Merchant Operations Platform  
2. NABD Messaging Platform  
3. Smart Vending Infrastructure  
4. Virtual Clinic / Dr. Robot  

Current `/` does **not** implement this chapter. V2 receives it in S2A.

### Creative direction

- One Flagship + three domain silhouettes (not four equal cards / Bento / Filmstrip)
- **Do not reprint** the Hero commerce KPI strip as the Flagship beat
- Preserve Education Journey + Product Deck for Current `/` when V2 Hero simplifies in S2A

---

## Chapter 5 — Engineering Ownership

**Title direction:** `The problems I can own end to end.`  
**Do not title this “Skills.”**

### Clusters (responsibility first, technology second)

| Cluster | Example technologies / concerns (from canonical work) |
|---------|--------------------------------------------------------|
| Product Backends | Laravel, PHP, Node.js, APIs, authz, multi-tenancy |
| Reliability and Operations | Queues, jobs, Redis, caching, retries, idempotency, webhooks, monitoring, deployment |
| Data and Integrations | MySQL, PostgreSQL, payments, commerce APIs, shipping, WhatsApp, notifications, maps, third parties |
| Product Delivery | Next.js, React, Vue, Flutter, admin dashboards, Linux, Nginx, Supervisor |
| Intelligent Systems | OCR, AI extraction, GPT integrations, RAG exploration, document pipelines |

Rules: no percentages; no equal badge cloud; visitor understands problem types before scanning tool names.

### Principles coda (merged — not a sixth full chapter)

**Recommendation:** merge Engineering Principles into the Ownership chapter as a short closing band.

Why: six standalone quote cards dilute scan time and risk generic tone. A coda with principles + one proof reference each stays scannable.

| Principle | Proof reference direction |
|-----------|---------------------------|
| Reliability is a product feature | Commerce sync / uptime outcomes where verified |
| Business rules should be explicit | Merchant ops / ERP workflows |
| Integrations must fail predictably | Webhooks, Salla/Zid, messaging |
| Long-running workflows need visibility | Queues, AI PDF progress / SSE (when published) |
| Ownership does not stop at the API response | Ops alerts, reconciliation, dispensing |
| Deployment is part of delivery | Supervisor, production AAB / release gates |

Do not invent metrics to fill principle cards.

---

## Chapter 6 — Contact Conclusion

**Line:** `Bring me the part everyone calls complicated.`

**Audience:** senior backend / product engineering roles · SaaS · complex integrations · selected freelance collaborations.

**Actions (preferred over a form for v1):**

- Email (`mailto:alkady2019@gmail.com`)
- LinkedIn
- GitHub
- Download résumé (`/documents/Abdalrhman_Alkady_Resume.pdf` — file present; confirm public-ready version with owner)

No phone number. No fake testimonials.

---

## Homepage content rules

- Identity in ~5s; proof early; dates/roles findable
- Short paragraphs; no giant biography; no duplicate metrics across chapters
- No unsupported claims, fake logos, fake screenshots
- Static state complete; motion enhances, never blocks nav / CTAs / résumé / socials / project interaction
- Important content never hover-only
