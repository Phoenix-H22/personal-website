# Work Index Spec — `/work`

Status: **S0 — Specification only**  
Do not implement UI in this stage.

---

## 1. Purpose

`/work` is the complete project portfolio. It must **not** be a larger clone of homepage Selected Work cards.

Jobs:

- Browse all publishable projects
- Enter featured case studies quickly
- Filter only when inventory justifies it
- Signal confidentiality and case-study depth honestly

---

## 2. Page structure

### A. Opening

| Element | Spec |
|---------|------|
| Title | `Work` or `Selected systems and shipped products` |
| Positioning | One short statement aligned with Proof Engine (backend / product systems / integrations) |
| Count | Show project count only when meaningful (e.g. “6 documented systems” after inventory stabilizes) |
| Featured entry | Optional jump links into featured case studies |

Meta: see SEO section below.

### B. Featured projects

Small set of high-value entries with deeper presentation (not the full archive layout).

**Recommended featured on `/work` (Stage S3+):**

1. Merchant Operations / Mohssilh  
2. NABD Messaging Platform  
3. Smart Vending / Medication Dispensing  
4. Your Obour Guide *(after canonical promotion)*  
5. Virtual Clinic / Dr. Robot  

Featured ≠ homepage Selected Work set (overlap allowed; homepage stays 4–5 max).

### C. Complete archive

All projects with `status: "canonical"` plus owner-approved promotions from `pending_canonical_entry`.

**Do not list** docs-only names without a `projects.ts` entry until structured and confirmed.

### D. Categories (taxonomy)

Normalize toward these archive labels (map existing `ProjectCategory` unions during content cleanup):

- Commerce and Integrations  
- SaaS Platforms  
- Mobile-Backed Products  
- AI and Automation  
- IoT and Physical Systems  
- Education Platforms  
- ERP and Business Systems  
- Websites and Custom Platforms  

Current content also uses compound categories (`Commerce and Messaging Automation`, `AI, Healthcare, Mobile, and Hardware`). Treat those as **display categories** until a cleanup pass collapses them into the taxonomy above without losing meaning.

### E. Filters

Add filters **only when** archive size and distribution make scanning hard (roughly ≥8–10 projects across ≥3 categories).

Until then: featured + chronological / priority-sorted archive is enough. No decorative filter UI.

---

## 3. Project preview contract

Every archive / featured preview must expose:

| Field | Source |
|-------|--------|
| Title | `title` / optional `shortTitle` |
| Short proposition | `proposition` |
| Category | `category` |
| Period | `startDate` / `endDate` / derived `yearLabel` — **many currently null** |
| Exact role / ownership | `exactRole` / `ownership` |
| One result or challenge | first verified `results[]` or strongest `impact[]` item |
| Status | derived from `clientVisibility` + confidentiality language |
| Links | `links[]` when approved |
| Case study | `caseStudyAvailability` |
| Cover / visual | `cover` or registry fallback / art-directed abstract |

Forbidden preview language: “Amazing project”, “Innovative platform”, “Modern solution”.

---

## 4. Visual direction

- Same dark Proof Engine world
- Distinct from homepage Selected Work scenes (index denser; less cinematic scene budget)
- No Bento grid of identical cards
- Covers: real assets preferred; abstract domain scenes when screenshots missing
- Never empty image placeholders; never fabricated UI screenshots

Responsive: normal document flow; reserved media aspect ratios; keyboard-accessible interactive filters if added later.

---

## 5. SEO and sharing (`/work`)

| Field | Direction |
|-------|-----------|
| Title | `Work — Abdalrhman Alkady` |
| Description | Backend and product engineering systems across commerce, SaaS, IoT, mobile, and AI-enabled products. |
| Canonical | `{siteUrl}/work` |
| Open Graph | Dark branded image; title + short positioning; no keyword stuffing |
| Structured data | Optional `ItemList` of projects when enough public URLs exist |

Positioning keywords (natural language only): backend engineering, product engineering, Laravel, Node.js, SaaS, integrations, scalable systems, automation, IoT, AI-enabled products.

---

## 6. Data selectors (planned)

Extend `src/lib/content` (names indicative):

- `getPublishableProjects()` — exclude unpublished pending unless preview mode
- `getFeaturedWorkIndexProjects()` — featured for `/work`
- `getProjectsByCategory(category)`
- Existing: `getProjects()`, `getFeaturedProjects()`, `getProjectBySlug()`

UI must not import storage format details beyond selectors.
