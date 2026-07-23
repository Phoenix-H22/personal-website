# Project Selection Matrix — Portfolio V3

Status: **S0**  
Ranking uses **only** fields present in `src/content/projects.ts`, `experience.ts`, and verified assets. Missing facts are marked — not invented.

Scale: High / Medium / Low / Unknown · Safety: Safe / Caution / Blocked until confirmed

---

## 1. Inventory in code

| Project | Status | Featured | Case study | Cover | Logo asset | Quantified results |
|---------|--------|----------|------------|-------|------------|--------------------|
| Merchant Operations / Mohssilh | canonical | yes | partial | none | none | High (5 metrics) |
| NABD Messaging Platform | canonical | yes | partial | none | `/images/nabd-logo-new.png` | Low (qualitative impact only) |
| Smart Vending / Medication | canonical | yes | partial | none | **missing** | Low (capability impact only) |
| Virtual Clinic / Dr. Robot | canonical | yes | partial | none | none | Medium (A+ graduation) |
| Your Obour Guide | pending_canonical_entry | no | unavailable | none | `/images/LogoAPpICon2.png` | Medium (tests + AAB) |
| AI PDF Extraction Pipeline | pending_canonical_entry | no | unavailable | none | none | Low (capability impact) |

## 2. Docs-only names (no `projects.ts` entry)

Do **not** rank for homepage until structured:

SaboraTV · ASFEC · Queue SaaS · Website Monitoring SaaS · Easy Spelling LMS · ERP/payroll · LUQTA · payment and auction platform · other private clients  

Status: `PENDING_CANONICAL_ENTRY` (canonical doc list). Experience companies Kayanac / Theqah / Tjar / KLLIQ are **experience**, not automatic project cards unless a project record exists.

---

## 3. Decision table (candidates with code entries)

| Project | Recruiter value | Technical depth | Business impact | Domain uniqueness | Visual readiness | Confidentiality | Overlap risk | Case-study readiness |
|---------|-----------------|-----------------|-----------------|-------------------|------------------|-----------------|--------------|----------------------|
| Merchant Ops | High | High | High (verified) | Medium (commerce) | Low (no cover; has node seed) | Caution (client-confidential) | High vs Hero commerce KPIs | Highest among set |
| NABD | High | High | Unknown (no metrics) | High (messaging) | Medium (logo) | Caution (private) | Medium vs Hero deck | Partial narrative needed |
| Smart Vending | High | High | Unknown | High (IoT) | Low (no logo) | Caution + Wasfaty blocked | Medium vs Hero deck | Partial |
| Virtual Clinic | Medium–High | High | Medium (academic A+) | High (health/AI/HW) | Low | Caution (private) | Medium vs Origin chapter | Partial |
| Your Obour Guide | High | Medium–High | Medium (quality gates) | Medium (city guide) | Medium (logo) | Caution (private) | High vs Hero deck title | Blocked until canonical |
| AI PDF | Medium | Medium–High | Unknown | Medium (AI pipeline) | Low | Caution (private) | Low | Blocked until canonical |

---

## 4. Recommendations

### Homepage Selected Work (Chapter 4)

**Exact set for first build (4 projects):**

1. **Merchant Operations / Mohssilh** — lead with ownership / reliability story; **do not** restamp Hero 200+ / 20K+ / 12M strip as the only beat  
2. **NABD Messaging Platform** — multi-tenant messaging / WhatsApp automation depth  
3. **Smart Vending / Medication Dispensing** — IoT / physical systems differentiation  
4. **Virtual Clinic / Dr. Robot** — full-stack + hardware + AI graduation ownership  

**Conditional 5th:**

5. **Your Obour Guide** — only after `status: canonical`, ownership filled, and case-study availability upgraded  

**Defer from homepage:**

- **AI PDF Extraction Pipeline** — pending + weaker verified outcomes; strong `/work` archive candidate after promotion  
- All docs-only names  

### `/work` featured set

Merchant Ops · NABD · Smart Vending · Virtual Clinic · Your Obour Guide (when canonical)

### Archive-only (when entries exist)

AI PDF (after promotion) · any future structured projects not selected above

### Owner confirmation before publication

| Item | Why |
|------|-----|
| Homepage featured set (confirm 4 vs 5) | Product decision |
| Merchant Ops ↔ Mohssilh ownership language | Case-study framing |
| Wasfaty mention | Explicitly not public until approved |
| Smart Vending ↔ Theqah company link | Keep separate unless confirmed |
| Capstone A+ vs cumulative Honors | Resolved in S1-PRE — keep both facts distinct |
| Live / repo / store URLs | All project `links: []` |
| Period dates | Almost all `startDate`/`endDate` null |
| Pending experience employers | Phoenix Tech’s, Eraasoft, Intsolutions, Upwork-as-experience |
| Promote Obour Guide + AI PDF to canonical | Required for homepage 5th / archive depth |

---

## 5. What not to invent

- Metrics not in content  
- Screenshots, live demos, or logos not in `public/images` / registry  
- Company attribution for Smart Vending / NABD / Obour without confirmation  
- Ranking or “impact” scores for docs-only project names  
