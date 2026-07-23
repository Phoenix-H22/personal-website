# S2 Implementation Plan — after S2-PRE

Status: **Ready for S2A when owner accepts foundation**

---

## Stage sequence (refined)

| Stage | Scope |
| --- | --- |
| **S2-PRE** | Inventory, selection, domain/repo/API, media, art direction — **this stage** |
| **S2A** | V2 Hero simplification + Selected Systems + local repository wiring + responsive + motion + a11y |
| **S3** | Systems Atlas (`/v2/work`) search, filters, URL state, previews |
| **S4** | System Dossier shell + Flagship Merchant Ops case study + blocks |
| **S5** | Remaining dossiers + media expansion + related navigation |
| **S6** | Engineering Ownership + Contact (phone/WhatsApp when approved) + form + reCAPTCHA + footer |
| **S7** | Laravel backend + admin + media + ApiProjectRepository + revalidation |
| **S8** | SEO/perf/a11y/security hardening + **V2 → Current promotion** + remove version switch |

---

## Stage S2A — status

**Implemented on `/v2`:**

- Simplified Hero (`hero.variant: "simplified"`)
- Education credential + Explore selected systems signal
- Selected Systems chapter via `getFeaturedProjects()`
- Current `/` remains frozen (`full-proof-constellation`)

See `docs/portfolio-v3/qa/S2A_IMPLEMENTATION_REPORT.md`.

Next: **S3 Systems Atlas** (`/v2/work`) after approval phrase:

`S2A V2 SELECTED SYSTEMS APPROVED`

---

## Contact requirements parked for S6

Public phone only after owner approval. WhatsApp, email, LinkedIn, GitHub, Upwork, form fields, reCAPTCHA v3 server verify, honeypot, rate limit, timing check, idempotency — as specified in the stage brief.
