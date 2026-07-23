# System Dossier Spec — `/work/[slug]` — S2-PRE

Working name: **System Dossier**  
Shared shell · project-specific storytelling · no fabricated screenshots.

Supersedes detail in `docs/portfolio-v3/CASE_STUDY_SPEC.md` (stub → this file).

---

## Shared structure

| Block | Required? |
| --- | --- |
| Project identity | Always |
| Status + period | Always (honest unknowns OK) |
| Problem | Always |
| Role and ownership | Always |
| Context and constraints | When available |
| System architecture | When nodes/diagram exist |
| Engineering decisions | When verified |
| Implementation | When narrative ready |
| Integrations | When relevant |
| Reliability / security / performance | When relevant |
| Difficult edge cases | Only verified |
| Outcomes + verified metrics | Public metrics only |
| Media gallery | When media exists |
| Technology context | Concise |
| Retrospective | When ready |
| Related / next project | When ≥2 published |

Omit empty sections — do not render shells.

---

## Content quality checklist

Every dossier should answer:
- What existed before?  
- Real problem? Why hard?  
- What Abdalrhman owned vs team?  
- Constraints? Decisions? Rejected alternatives?  
- Failures / iteration?  
- Reliability approach?  
- Verified outcomes?  
- What would improve now?  

Avoid: marketing fluff, fake perfection, unexplained tech lists, overstated ownership, confidential internals, ordinary CRUD as breakthrough.

---

## First Flagship dossier

**Merchant Operations Platform** — Stage S4.

Use verified architecture nodes already in content.  
Do not reprint Hero KPI strip as the only story.

Fallback if confidentiality blocks depth: NABD.

---

## Visual signatures (restrained)

| Project | Motif | Color |
| --- | --- | --- |
| Merchant Ops | Order lifecycle · webhooks · ops states | cyan + amber proof |
| NABD | Channels · delivery states | cyan / blue |
| Smart Vending | QR · payment · MQTT · release | cyan / green |
| Virtual Clinic | Patient flow · AI abstract | violet / cyan |
| Obour (later) | Map · place discovery | blue / cyan / gold |
| AI PDF (later) | Pages · OCR · queues · SSE | violet / blue |

Art direction ≠ invented architecture.

---

## Diagrams

- Truthful, labelled, accessible, responsive  
- Text alternative required  
- Usable without animation  
- Mobile: verticalize / simplify; no horizontal page scroll  
- Semantic SVG or structured DOM preferred  

---

## Route

Development: `/v2/work/[slug]`  
Production promotion: `/work/[slug]`  
Canonical eventually: `/work/{slug}`  

404 for private/draft/unknown (identical safe page).
