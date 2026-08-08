# Project Inventory — S2-PRE

Status: **S2-PRE canonical inventory**  
Priority: owner-approved / résumé / structured content → older notes.  
Do not treat deleted experiments or `old_site` as sources.

Related: `PROJECT_SELECTION_MATRIX.md`, `OWNER_CONFIRMATION_REGISTER.md` (in this folder), `docs/CANONICAL_CONTENT.md`.

---

## Material conflicts (not silently resolved)

| Conflict | Sources | Recommended resolution | Blocker? |
| --- | --- | --- | --- |
| Hero Product Deck (Obour + Vending + NABD) vs Selected Systems set (Merchant Ops + NABD + Vending + Clinic) | `proof-engine.ts` vs this inventory | Keep Hero deck on Current `/`. V2 Hero removes Product Deck in S2A; Selected Systems carries the four systems. Obour stays deferred until canonical ownership. | No for S2A |
| Merchant Ops metrics appear in Hero commerce scale + project + experience | `proof-engine.ts`, `projects.ts`, `experience.ts` | Same verified metrics OK on Hero commerce artifact; Selected Systems Flagship must lead with ownership/reliability, not a duplicate KPI strip. | No |
| Legacy `SITE_STORYBOARD.md` features Wasfaty + Obour + AI PDF | Legacy docs vs `CANONICAL_CONTENT.md` | Ignore legacy for selection. Wasfaty gated. | No |
| 10K+ users: educational platform vs KLLIQ | `profile.ts` vs `experience.ts` | Do not attach 10K+ to Selected Systems projects until owner scopes it. | Yes for any 10K+ claim |
| Mohssilh start Jan vs Mar 2025 | LinkedIn vs résumé | Keep résumé Mar 2025 in public copy until confirmed. | Soft |
| Smart Vending ↔ Theqah | Speculation vs canonical | Keep separate. No company attribution without confirmation. | Yes for company claim |
| `smartvending.jpg` exists but registry `smartVending: null` | Disk vs `portfolio-assets.ts` | Treat as **usable with editing** candidate photo — not an official logo until owner confirms. | Soft |
| `mqttDoorLockers` → `smartlockers.jpg` missing | `portfolio-assets.ts` | Registry points at missing file — do not use until restored or removed. | Soft |
| Fermentina / JBAP | User prompt list | **Not found** in approved sources — exclude until owner provides structured entry. | N/A |

---

## Publication enums (inventory field values)

```ts
type ProjectConfidentiality = "public" | "public-limited" | "private" | "internal-only";
type EvidenceStatus = "verified" | "owner-confirmed" | "source-supported" | "unverified" | "not-applicable";
type PublicationReadiness = "ready" | "partial" | "blocked" | "docs-only";
```

---

## A. Structured projects (`src/content/projects.ts`)

### A1. `merchant-operations-salla-automation`

| Field | Value |
| --- | --- |
| Internal ID | `merchant-operations-salla-automation` |
| Canonical title | Merchant Operations and Salla Automation |
| Recommended public title | Merchant Operations Platform |
| Slug | `merchant-operations-salla-automation` |
| Alternate names | Mohssilh commerce ops · Salla automation · Merchant Operations / Mohssilh |
| Client / company | Mohssilh (publishable employment context) |
| Type | Commerce operations / integrations platform |
| Domain | commerce, integrations |
| Platforms | web, api |
| Role | Backend systems, integrations, reliability, operational workflows |
| Ownership level | High — backend integrations, queues, webhooks, reporting, reconciliation |
| Employment | Mohssilh (primary) |
| Dates | start/end null in content · experience: Mohssilh 2025-03 – 2026-04 (ended) |
| Status / production | live (employment context) · maintained |
| Confidentiality | `public-limited` (client-confidential internals; public impact OK) |
| Public-safe summary | Backend integrations, reporting, and reconciliation for multi-merchant commerce operations connected to Salla. |
| Technical depth | High |
| Strongest challenge | High-volume platform events → reliable ops/reporting under production load |
| Strongest ownership | Backend integrations, queues, webhooks, reporting, reconciliation |
| Strongest verified outcome | 200+ merchants · 20K+ monthly orders · 12M+ SAR handled order activity |
| Metrics | See below — evidence `source-supported` (résumé/experience/project aligned) |
| Technologies | Laravel, Salla, Queues, Webhooks, Redis, MySQL, Reporting |
| Media | Company logo only · architecture node seed present · no cover |
| Live / repo | none public |
| Homepage | **Yes — Flagship** |
| `/work` | Yes |
| Case study | Yes (first Flagship dossier) |
| SEO readiness | Partial (needs cover OG later) |
| Publication readiness | `partial` |
| Missing | Exact dates, team context, screenshots, live/repo, ownership language confirmation |
| Owner confirmation | Mohssilh ownership framing; public title vs company name |

**Metrics**

| Value | Label | Evidence | Public |
| --- | --- | --- | --- |
| 200+ | merchants | source-supported | yes |
| 20K+ | monthly orders | source-supported | yes |
| 12M+ SAR | handled order activity | source-supported | yes |
| 70–80% | API performance improvement | source-supported | yes |
| 15% | synchronization error reduction | source-supported | yes |

---

### A2. `nabd-messaging-platform`

| Field | Value |
| --- | --- |
| Internal ID | `nabd-messaging-platform` |
| Canonical title | NABD Messaging Platform |
| Recommended public title | NABD Messaging Platform |
| Slug | `nabd-messaging-platform` |
| Alternates | NABD · Multi-channel messaging |
| Company | null (do not invent) |
| Type | Multi-tenant messaging SaaS |
| Domain | messaging, commerce-automation |
| Platforms | web, api, messaging |
| Role | Platform and messaging-system engineering |
| Ownership | Multi-tenant messaging automation, WhatsApp device sessions, queues, webhook-driven delivery |
| Dates | null |
| Status | private product · architecture discussable |
| Confidentiality | `private` → publish as `public-limited` architecture |
| Public-safe summary | Multi-tenant messaging automation for e-commerce merchants across WhatsApp, Telegram, email, and webhook-triggered campaigns. |
| Technical depth | High |
| Strongest challenge | Reliable multi-channel delivery + multi-tenancy |
| Strongest ownership | Messaging automation, device sessions, queues, webhooks |
| Strongest verified outcome | Qualitative only (QR pairing, queue workers, webhook campaigns) |
| Metrics | none quantified |
| Technologies | Laravel, Node.js, Express, Baileys, Redis, MySQL, Supervisor, Salla APIs, Zid APIs |
| Media | Logo `/images/nabd-logo-new.png` (1024×1024, ~1.3MB — optimize later) |
| Homepage | **Yes — supporting** |
| `/work` | Yes |
| Case study | Yes after narrative fill |
| Publication readiness | `partial` |
| Missing | Dates, metrics, company, screenshots, links |
| Owner confirmation | Public product name OK?; any metrics?; company attribution? |

---

### A3. `smart-vending-medication-dispensing`

| Field | Value |
| --- | --- |
| Internal ID | `smart-vending-medication-dispensing` |
| Canonical title | Smart Vending / Medication Dispensing Platform |
| Recommended public title | Smart Vending Infrastructure |
| Slug | `smart-vending-medication-dispensing` |
| Alternates | Medication dispensing · MQTT vending |
| Company | null — **not** Theqah unless confirmed |
| Type | IoT / physical product system |
| Domain | iot, healthcare-adjacent, payments |
| Platforms | api, device, web |
| Role | Backend integration and device workflow architecture |
| Ownership | API workflows from request through payment, MQTT control, and physical dispensing |
| Confidentiality | `public-limited` · **Wasfaty name blocked** |
| Public-safe summary | API-driven dispensing platform connecting dashboards, QR flows, payments, machine controllers, and real-world release actions. |
| Technical depth | High |
| Strongest challenge | Bridging payments/API trust boundary to physical release |
| Strongest ownership | End-to-end API → MQTT → dispense workflow |
| Outcomes | Capability-level only |
| Technologies | Laravel, Python, React.js, MQTT, Redis, PostgreSQL |
| Media | No logo · `smartvending.jpg` unconfirmed photo · Autopay logo unrelated until confirmed |
| Homepage | **Yes — supporting** |
| `/work` | Yes |
| Publication readiness | `partial` |
| Missing | Logo confirmation, dates, metrics, Wasfaty decision, company link |
| Owner confirmation | Wasfaty public?; photo rights for `smartvending.jpg`; Theqah link? |

---

### A4. `virtual-clinic-dr-robot`

| Field | Value |
| --- | --- |
| Internal ID | `virtual-clinic-dr-robot` |
| Canonical title | Virtual Clinic / Dr. Robot |
| Recommended public title | Virtual Clinic / Dr. Robot |
| Slug | `virtual-clinic-dr-robot` |
| Type | Graduation / AI healthcare product |
| Domain | ai, healthcare, mobile, hardware |
| Platforms | web, mobile, device |
| Role | Product and system ownership across web, mobile, backend, hardware |
| Ownership | Authentication, diagnosis flow, face-based login, patient data, and Pi interaction screens |
| Team | Graduation project |
| End | 2025-08 |
| Confidentiality | `private` → public-limited academic framing |
| Public-safe summary | AI-powered virtual clinic combining web, mobile, backend, and hardware components. |
| Strongest verified outcome | Graduation project graded **A+** (distinct from cumulative Honors) |
| Technologies | Laravel, Flutter, Vue.js, Python, Raspberry Pi, AI models, face recognition |
| Media | none |
| Homepage | **Yes — supporting** (AI / full-stack ownership variety) |
| `/work` | Yes |
| Publication readiness | `partial` |
| Missing | Screenshots, architecture diagram, start date, patient-data sensitivity review |
| Owner confirmation | Public screenshots safe?; face-recognition detail depth |

---

### A5. `your-obour-guide` (pending)

| Field | Value |
| --- | --- |
| Status in code | `pending_canonical_entry` |
| Ownership | `PENDING_CANONICAL_ENTRY` — **blocks homepage selection** |
| Recommended public title | Your Obour Guide |
| Evidence | 406 Laravel tests · 138 Flutter tests · Production AAB |
| Media | Logo `/images/LogoAPpICon2.png` |
| Homepage | **Deferred** until ownership + summary canonical |
| `/work` | After promotion |
| Publication readiness | `blocked` for homepage |

---

### A6. `ai-pdf-extraction` (pending)

| Field | Value |
| --- | --- |
| Status | `pending_canonical_entry` |
| Ownership | pending |
| Technologies | Laravel, Vue, Tesseract OCR, GPT, SSE |
| Homepage | Deferred |
| `/work` archive | After promotion |
| Publication readiness | `blocked` for featured |

---

## B. Experience-adjacent systems (not automatic project cards)

| ID | Relationship | Notes | Project card? |
| --- | --- | --- | --- |
| Theqah / Fushati | Employer systems: education + payments; LinkedIn metrics 200+ schools etc. | Keep as experience unless separate project record | No until structured |
| Kayanac ERP | Employer ERP modules | Docs-only “ERP/payroll” candidate | No |
| Tjar | Multi-tenant commerce SaaS · 1,000+ stores | Experience outcome | Separate project only if owner wants |
| KLLIQ | AI SaaS · 10,000+ users (scope conflict) | Experience | No |
| Phoenix Tech’s | Independent company track | Not a product card | No |
| Upwork | Freelance channel | Hero credential only | No |

---

## C. Docs-only names (no structured entry)

| Name | Confidentiality default | Suitability | Action |
| --- | --- | --- | --- |
| SaboraTV | internal-only until structured | `/work` later | Create entry only with owner facts |
| ASFEC | internal-only | archive | same |
| Queue SaaS | internal-only | `/work` later | same |
| Website Monitoring SaaS | internal-only | `/work` later | same |
| Easy Spelling LMS | internal-only | archive | same |
| JBAP LMS | **not found** in sources | — | Exclude |
| SABORATV | alias of SaboraTV | — | same |
| LUQTA shipping / addresses | internal-only | `/work` later | same |
| Payment / auction platform | internal-only | private | same |
| Mohselaty / reporting | likely Mohssilh-adjacent naming | do not invent separate project | Clarify with owner |
| Fermentina / Salla product-filter | **not found** | — | Exclude |
| Website Monitoring SaaS | docs-only | — | same |

---

## D. Distinctions (must preserve)

| Distinction | Rule |
| --- | --- |
| System did vs Abdalrhman owned | Use `ownership` + `teamContext`; never imply solo when graduation/team |
| Team owned | Explicit in dossier blocks |
| Verified vs inference | Metrics require `evidenceStatus`; no invented numbers |
| Hero commerce KPIs vs Selected Systems Flagship | Different storytelling beat |
| Education Journey vs credential chip | Origin keeps journey; V2 Hero gets compact credential only (S2A) |
| Product Deck vs Selected Systems | Deck remains Current-only / reusable; V2 replaces with Selected Systems |

---

## E. Inventory completeness statement

All credible named projects from approved sources were considered. Fermentina and JBAP were **not found** and are excluded until owner supplies evidence.
