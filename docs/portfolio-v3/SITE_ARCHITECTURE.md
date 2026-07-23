# Site Architecture — Portfolio V3

Status: **Routes consolidated — `/` is the approved baseline; `/v2` is the next-iteration sandbox**  
Scope gate: do not redesign the approved Hero. See `docs/portfolio-v3/PORTFOLIO_VERSIONING.md`.

Primary sources: `docs/CANONICAL_CONTENT.md`, `src/content/*`, `src/lib/content/index.ts`, `docs/portfolio-v3/VISUAL_CONSTITUTION.md`, `docs/portfolio-v3/MISSING_ASSETS.md`, `docs/portfolio-v3/PORTFOLIO_VERSIONING.md`, `docs/portfolio-v3/projects/` (S2-PRE project foundation).

---

## 1. Site objective

Serve two audiences on one dark, cinematic Proof Engine brand:

| Audience | Job to be done |
|----------|----------------|
| Recruiters / hiring managers | In ~30s: who he is, what he can own, scale, education, products, exact contribution signals, verified outcomes, contact / résumé |
| Technical leads / founders / clients | Progressive depth: architecture, boundaries, integrations, decisions, edge cases, reliability, ownership, trade-offs, measurable results |

Homepage = scan. `/work/[slug]` = depth. Homepage must not become a résumé dump or a full technical specification.

---

## 2. Route architecture

| Route | Role | Production nav? |
|-------|------|-----------------|
| `/` | Approved portfolio (Hero + Origin + Career) | Yes |
| `/v2` | Next iteration sandbox; Selected Systems from S2A; **noindex** | **Never** |
| `/v2/work` | Systems Atlas during development (S3); **noindex** | Via V2 only |
| `/v2/work/[slug]` | System Dossier during development (S4–S5); **noindex** | Via Atlas |
| `/work` | Systems Atlas after S8 promotion | Yes (when promoted) |
| `/work/[slug]` | System Dossier after S8 promotion | Via work / Selected Systems |
| `/about` | **Not recommended for v1** | No |
| `/contact` | **Not recommended for v1** (inline contact in S6) | No |
| `/design-system` | Visual QA / component lab | **Never** |
| `/concept-v3-rebuild` | Permanent redirect → `/` | No |

### `/about` recommendation

**Do not create `/about` in the first production release.**

Homepage Chapters 2 (Origin), 3 (Career), 5–6 (Ownership / Principles), and 7 (Contact) already cover biography, education, experience, values, and how to reach him. A separate About page would mostly duplicate that narrative without adding recruiter-critical depth that case studies do not already provide.

Reconsider `/about` only if a long-form biography, speaking bio, or press kit becomes a real need.

### `/contact` recommendation

**Do not create `/contact` in the first production release.**

Chapter 7 should expose Email, LinkedIn, GitHub, and résumé download as primary actions. A form adds latency, spam surface, and a weaker conversion path than mailto / LinkedIn for senior backend outreach.

Reconsider a contact route later only if tracking, calendaring, or structured intake becomes necessary.

---

## 3. Information architecture (homepage narrative)

Ordered chapters (see `HOMEPAGE_STORYBOARD.md`):

1. **Approved Hero** — locked composition on `/` (shared with `/v2` until S2+)
2. **Origin** — Education expansion
3. **Career Chapters** — Experience by era
4. **Selected Work** — 4–5 strategic projects + CTA to `/work`
5. **Engineering Ownership** — responsibility clusters (not “Skills”)
6. **Engineering Principles** — **merge into Chapter 5** as a compact coda (see storyboard); not a standalone six-card chapter
7. **Contact Conclusion** — closing CTA band

Do not restate Hero proof (Upwork strip, commerce KPIs, product-deck titles, compact education artifact) as the opening of later chapters. Later chapters must add depth.

---

## 4. Visual continuity rules (post-hero)

Preserve Visual Constitution:

- dark-only; cyan primary; amber for verified financial / outcome emphasis
- depth, lighting, layered surfaces, restrained motion
- no white/cream sections, no Bento grid, no terminal aesthetic
- no repeated architecture-node diagrams as section wallpaper
- no skill percentages / badge clouds
- no empty “portfolio filler” sections

Chapter-level rule: **same world, different chapter identity.** Do not clone the Hero’s four-corner constellation for Origin, Career, or Selected Work.

Below the Hero: **normal document flow**. No one-viewport compulsion. No scroll hijacking.

---

## 5. Content ownership

| Layer | Owns |
|-------|------|
| `src/content/*` | Facts, copy, metrics, statuses |
| `src/content/portfolio-assets.ts` | Verified public image paths |
| `src/lib/content/*` | Selectors / sorting / featured filters |
| UI components | Presentation only — no hardcoded claims |
| MDX case studies (planned) | Long-form narrative blocks keyed by project slug |

Unconfirmed entries stay `PENDING_*` and unpublished.

---

## 6. Navigation (production target for S7)

Primary:

- Work → `/work`
- Experience → `/#experience` (or in-page Career chapter id)
- Education → `/#education`
- Contact → `/#contact`

Secondary actions: Let’s talk (mailto), Download résumé.

No Motion control in public nav (Full Motion default + OS reduced-motion; see motion preference v3).

---

## 7. Dependency on approval phrases

| Phrase | Meaning |
|--------|---------|
| `V3 SITE ARCHITECTURE APPROVED — BUILD STAGE S1` | Begin Origin + Career UI |
| Later stage phrases | Defined in `SITE_EXPANSION_PLAN.md` |

Production `/` is the approved portfolio baseline. Next iteration work happens on `/v2` only. See `PORTFOLIO_VERSIONING.md`.
