# Focused audit

Status: specification only. No UI changes until `FOCUSED AUDIT APPROVED`.

Brand concept to preserve: **Systems Under the Surface**.  
Positioning to preserve: **Software Engineer** (see `docs/CANONICAL_CONTENT.md`; older “Backend-Focused Product Engineer” wording is obsolete).

Legacy site and old résumé files are historical references only. They are not canonical. Anything not explicitly confirmed by the owner is `NEEDS_CONFIRMATION` and must not be published.

---

## 1. Confirmed implementation defects

| # | Defect | Severity | Notes |
|---|--------|----------|-------|
| 1 | Featured-project SVG labels are oversized, overlapping, and unreadable | Critical | Node text uses CSS `font-size: 10px` against a `0 0 100 100` viewBox; nodes collide and clip on narrow and mid widths |
| 2 | Hero system-map animation continues under `prefers-reduced-motion` | High | Pulse paths still animate via Motion; CSS reduce alone does not stop Framer/Motion path animation |
| 3 | Mobile diagrams retain connector lines for hidden nodes | High | Secondary nodes hide via CSS; related paths remain visible and orphaned |
| 4 | Some navigation and footer touch targets are below 44px | Medium | Compact nav links and contact text links measure under the 44×44 minimum |
| 5 | Homepage claims multiple selected projects but shows only one | High | Label says “01–04”; `page.tsx` renders only `getFeaturedProjects()[0]` |
| 6 | Education and professional experience absent from content model and homepage | Critical | No typed education/experience sources; no sections in IA |
| 7 | Complete `/work` portfolio and `/work/[slug]` routes missing | High | Only `/` and `/design-system` exist |
| 8 | No horizontal overflow ≠ visually responsive | High | Page does not overflow, but diagrams, hierarchy, and density still fail visually |

Do not claim the site is responsive until viewport evidence is re-checked after Stage B repairs.

---

## 2. Existing implementation worth preserving

- Brand idea, dark editorial tone, semantic tokens, AK mark
- Hero copy direction, availability as content (not hardcoded), dual CTAs
- Proof rail pattern that scopes metrics to their source
- Content access layer pattern (`src/lib/content`) — extend, do not bypass
- Design-system QA route (keep out of production nav)
- SEO shell: metadata, sitemap, robots, OG image route
- Architecture-diagram art direction when screenshots are unavailable
- Closing line: “Bring me the part everyone calls complicated.”

Do not delete or redesign these foundations in the first repair pass.

---

## 3. Missing homepage sections

Required order (see §7). Currently missing after Proof:

1. **Education** — Obour STEM School + University of Sadat City (owner-confirmed fields only)
2. **Professional experience** — Career Chapters (not a résumé dump)
3. **Selected projects** — four to six featured covers, not one
4. **View all projects** — explicit CTA to `/work`
5. **Engineering range and principles**
6. Contact already exists; keep and polish later

---

## 4. Missing routes and portfolio functionality

| Route | Status | Required |
|-------|--------|----------|
| `/` | Partial vertical slice | Full seven-chapter homepage |
| `/work` | Missing | Featured + archive, categories, public/private/confidential labels, links when verified |
| `/work/[slug]` | Missing | Full case-study template (context → role → architecture → results → media → next) |
| `/about`, `/contact` | Optional later | Only if they add value beyond homepage chapters |
| `/design-system` | Exists | Dev QA only |

Portfolio must not duplicate the homepage project section. Filters only if volume justifies them.

---

## 5. Current content-model gaps

Present (thin): `Profile`, `EvidenceItem`, minimal `Project`.

Missing domain types (spec only for now):

- `EducationEntry`
- `ExperienceEntry`
- `CareerEra`
- Expanded `Project` (category, dates, role, ownership, media, links, featured, sortOrder)
- `ProjectMedia`, `ProjectLink`
- `Achievement`

Missing selectors: `getEducation`, `getFeaturedEducation`, `getExperience`, `getExperienceByEra`, `getFeaturedExperience`, `getProjects`, `getFeaturedProjects`, `getProjectBySlug`, `getAchievements`.

Rendering components must never import raw content arrays.

---

## 6. Data requiring owner confirmation

Mark all of the following `NEEDS_CONFIRMATION` until the owner replies in writing.

**Do not publish from legacy résumés or `old_site` alone:**

- Exact education degree title, GPA, honors, graduation-project grade
- Exact employment dates, roles, employment types, locations for Eraasoft, Intsolutions, KLLIQ, Tjar, Theqah, Kayanac, Mohssilh, Phoenix Tech’s, Upwork, and any other employers
- Any metrics from historical résumés (Theqah/Fushati transaction counts, Tjar store counts, KLLIQ user counts, load-time claims, uptime claims, etc.)
- Upwork profile URL; résumé PDF path; portrait usage approval
- Institution and company logo public-usage approval
- Project live URLs, repos, screenshots, and publishable case-study depth
- Supporting archive projects (SaboraTV, ASFEC, Queue SaaS, monitoring SaaS, Easy Spelling LMS, LUQTA, etc.)
- Phone number — **do not publish unless explicitly approved**

Confirmed enough to keep for now (already in active product copy / links):

- Name: Abdalrhman Mohamed Alkady
- Role label: Software Engineer
- Email: alkady2019@gmail.com
- LinkedIn: https://www.linkedin.com/in/alkady22/
- GitHub: https://github.com/Phoenix-H22
- Location framing: Egypt; remote/relocation openness (confirm wording)
- Featured project *candidates* (facts still need confirmation): Merchant Operations / Salla Automation, Your Obour Guide, Smart Vending / Wasfaty, AI PDF Extraction

---

## 7. Recommended page order

1. Hero  
2. Proof and credibility  
3. Education  
4. Professional experience  
5. Selected projects  
6. View all projects  
7. Engineering range and principles  
8. Contact  

### Professional experience direction

- Group into career chapters (eras), not ten identical job cards.
- Desktop: era navigation + normal reading column; collapsed row shows logo, company, role, dates, one-line mission, one strongest result.
- Tablet: drop fragile sticky behavior; use clear era headings.
- Mobile: vertical timeline or accessible accordion; no horizontal scroll; no hover-only detail; dates always visible; one expanded at a time; ≥44px targets.
- Every entry should answer: what he learned / owned / improved / became capable of handling.

---

## 8. Immediate repair sequence

1. **Owner confirmation pass** — education, experience list, featured project facts, assets, links (no UI yet for unverified data).
2. **Stage B — Responsive foundation** (first code slice after approval): fix project-diagram SVG scaling/text; stop Motion under reduced-motion; hide orphan connectors with nodes; raise touch targets; keep containers overflow-safe; evidence-based viewport recheck.
3. **Content model repair** — typed education/experience/project/media files + selectors (data still gated by confirmation).
4. **Stage C** — Education + Career Chapters experience sections.
5. **Stage D** — Featured projects (4–6) + View all + `/work` + `/work/[slug]`.
6. **Stage E** — Range, principles, contact polish.
7. **Stage F** — a11y, responsive evidence, build, content verification.

Do not run multiple unfinished stages in parallel.

---

## First repair implementation (after approval) — files only

Exact files likely touched in the first responsive/content-foundation slice (no edits yet):

- `src/components/home/featured-project.tsx`
- `src/components/home/system-map.tsx`
- `src/styles/globals.css`
- `src/app/page.tsx` (project count / structure only when content ready)
- `src/content/projects.ts` (model expansion; verified facts only)
- `src/lib/content/index.ts`
- New (when Stage A data confirmed): `src/content/education.ts`, `src/content/experience.ts`

No production UI implementation in this iteration.
