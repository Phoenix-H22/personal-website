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

## Exact S2A scope

### Allowed
1. Flip `portfolioVariants.v2` hero flags: remove education journey + product deck; add credential + Explore selected systems signal  
2. Enable `sections.showSelectedSystems` on V2 only  
3. Build Selected Systems UI from `getFeaturedProjects()`  
4. Wire LocalProjectRepository adapters / fixtures for the four projects  
5. Responsive + motion + a11y per storyboard  
6. Link Explore all systems → `/v2/work` (may be placeholder route **only if** S3 starts immediately; otherwise `#` disabled button is forbidden — prefer shipping S2A with CTA to a minimal stub **or** postpone Atlas CTA until S3 — **preferred: CTA visible linking to `/v2/work` with S3 landing in same program**)  

### Forbidden in S2A
- Any change to Current `/`  
- Building full Systems Atlas UI beyond what S3 owns (if CTA needs a page, coordinate S3)  
- Case-study pages  
- Contact  
- Laravel  
- Invented metrics/screenshots  

### S2A acceptance
- V2 Hero matches approved transition  
- Four systems visible with Flagship dominance  
- Public-safe titles/summaries/ownership/proof  
- Reduced motion OK  
- Current `/` pixel/behavior unchanged  

Stop phrase after S2A:

`V3 STAGE S2A APPROVED — BUILD SYSTEMS ATLAS`

---

## Contact requirements parked for S6

Public phone only after owner approval. WhatsApp, email, LinkedIn, GitHub, Upwork, form fields, reCAPTCHA v3 server verify, honeypot, rate limit, timing check, idempotency — as specified in the stage brief.
