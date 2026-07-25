# S2 Implementation Plan — after S2-PRE

Status: **S2B implemented on `/v2` — awaiting visual approval**

---

## Stage sequence (refined)

| Stage | Scope |
| --- | --- |
| **S2-PRE** | Inventory, selection, domain/repo/API, media, art direction |
| **S2A** | V2 Hero simplification + Selected Systems vertical slice |
| **S2B** | Hero positioning refinement + Featured Systems art-direction rebuild |
| **S3** | Systems Atlas (`/v2/work`) search, filters, URL state, previews |
| **S4** | System Dossier shell + Flagship Merchant Ops case study + blocks |
| **S5** | Remaining dossiers + media expansion + related navigation |
| **S6** | Engineering Ownership + Contact + form + reCAPTCHA + footer |
| **S7** | Laravel backend + admin + media + ApiProjectRepository + revalidation |
| **S8** | Hardening + **V2 → Current promotion** + remove version switch |

---

## Stage S2A — complete (technical)

Simplified Hero, Education credential, Explore signal, Selected Systems via repository.  
Current `/` frozen. Visual approval withheld → S2B.

## Stage S2B — implemented (awaiting visual approval)

**V2 Hero**
- Software Engineer positioning (not Product Engineer)
- Supporting copy + core technology line
- Education Credential relocated into identity flow
- Composition preserved (Upwork, Commerce, Explore)

**Featured Systems**
- Section identity: Featured Systems · 4 projects · category discovery
- Flagship + distinct supporting stages (not equal card list)
- Typed art-directed covers via `coverType`
- Category filters with live region; case-study links still gated

See `docs/portfolio-v3/S2B_FEATURED_SYSTEMS_REDESIGN_REPORT.md`.

Next after approval phrase:

`S2B FEATURED SYSTEMS VISUALLY APPROVED — BEGIN SYSTEMS ATLAS`

→ **S3 Systems Atlas** (`/v2/work`)

---

## Contact requirements parked for S6

Public phone only after owner approval. WhatsApp, email, LinkedIn, GitHub, Upwork, form fields, reCAPTCHA v3 server verify, honeypot, rate limit, timing check, idempotency — as specified in the stage brief.
