# Experience Source Audit — Stage S1-PRE

Sources (priority):

1. Owner corrections in S1-PRE brief  
2. `docs/source/Abdalrhman_M_Alkady_Resume_2026-07-13.pdf`  
3. `docs/source/Abdalrhman_Alkady_LinkedIn_Export.pdf`  
4. Existing canonical content  

Rules applied:

- LinkedIn auto-duration text ignored (e.g. “1 year 7 months”)
- Date conflicts recorded, not silently resolved
- Phone number from LinkedIn **not** published
- Site positioning remains **Backend-Focused Product Engineer**
- LinkedIn summary not used verbatim

---

## 1. Education (non-experience, grade reconciliation)

| Fact | Canonical wording | Sources |
|------|-------------------|---------|
| Institution (secondary) | Obour STEM School | Owner / canonical — **not** LinkedIn “STEM High School for Boys - 6th of October” |
| Institution (university) | University of Sadat City · Faculty of Computers and Artificial Intelligence | Owner / résumé — LinkedIn faculty label not used as institution rename |
| Period | 2021-09 – 2025-08 | Résumé / canonical — LinkedIn shows July 2025 end → **conflict noted, canonical kept** |
| Cumulative result | Cumulative A-grade with Honors | Owner confirmation + résumé |
| Capstone | Virtual Clinic / Dr. Robot — A+ | Owner confirmation + résumé |
| Compact UI | A-grade with Honors · Capstone graded A+ | Owner preferred wording |

---

## 2. Metric reconciliation

| Metric | Classification | Action |
|--------|----------------|--------|
| 200+ merchants · 20K+ monthly orders · 12M+ SAR | Already canonical (Hero / résumé / Mohssilh) | Preserve |
| API +70–80% · sync errors −15% | Résumé + prior canonical | Preserve on Mohssilh |
| 95%+ webhook · 99%+ query optimization | LinkedIn-only | Needs confirmation — not published |
| 200+ schools · 5K+ daily txns · 99.9% uptime · checkout −60% · load −35% | Résumé Theqah | Preserve on Theqah |
| 40% system-efficiency (Theqah / Phoenix narratives) | LinkedIn-only / conflicting scopes | Needs confirmation — not published |
| 30–40% ops improvements (Intsolutions / Marqity) | LinkedIn-only | Needs confirmation — not published |
| 10K+ users · +35% efficiency · −50% errors · +30% stability (KLLIQ) | Résumé | Preserve on KLLIQ |
| 1,000+ stores · 99.9% · 100+ merchants analytics (Tjar) | Résumé | Preserve on Tjar |
| 10+ Upwork projects · five-star average | LinkedIn-only | Needs confirmation — Hero keeps Top Rated · 100% JSS only |

---

## 3. Experience inventory

### `mohssilh` — Mohssilh / محصلة

| Field | Value |
|-------|--------|
| Role | Software Engineer, Backend & Integrations (résumé) |
| Kind | employment |
| LinkedIn dates | 2025-01 – Present |
| Résumé dates | 2025-03 – Present |
| Selected dates | **2025-03 – Present** |
| Location | Saudi Arabia (résumé); LinkedIn Riyadh |
| Logo | Wired `/images/companies/mohssilh.png` |
| Confidence | Conflicting dates |
| Publication | **primary** · featured |
| Era | owning-production-systems |
| Missing | Company URL; confirmed start month |
| Confirmations | Start Jan vs Mar; title Backend Engineer vs résumé; LinkedIn-only metrics; location grain |
| Public wording | Résumé mission/summary + approved commerce outcomes |

Aliases (source only): Mohsillh  

---

### `kayanac-erp` — Kayanac ERP

| Field | Value |
|-------|--------|
| Role | Software Engineer, Full Stack / Contract |
| Kind | contract |
| LinkedIn dates | **Absent** |
| Résumé dates | 2025-03 – 2025-06 |
| Selected dates | **2025-03 – 2025-06** |
| Location | Maadi, Egypt · onsite |
| Logo | Wired `/images/companies/kayanac.webp` |
| Confidence | Résumé only |
| Publication | **primary** · featured |
| Era | owning-production-systems |
| Missing | Outcomes; LinkedIn presence; URL |
| Confirmations | Public publication; verified results |

---

### `theqah` — Theqah.sa (شركة موقع الثقة)

| Field | Value |
|-------|--------|
| Role | Software Engineer (résumé) |
| Kind | employment |
| LinkedIn dates | 2024-08 – **Present** |
| Résumé dates | 2024-08 – 2025-02 |
| Selected dates | **2024-08 – 2025-02** (do not publish Present) |
| Location | Riyadh, Saudi Arabia |
| Logo | Wired `/images/companies/theqah.webp` |
| Confidence | Conflicting end date |
| Publication | **primary** · featured |
| Era | owning-production-systems |
| Confirmations | End Present vs Feb 2025; title Full Stack vs Software Engineer; 40% LinkedIn claim |

---

### `tjar` — Tjar.sa

| Field | Value |
|-------|--------|
| Role | Software Engineer, Contract |
| Kind | contract |
| LinkedIn / résumé dates | 2024-03 – 2024-05 (aligned) |
| Selected dates | **2024-03 – 2024-05** |
| Logo | Wired `/images/companies/tjar.png` |
| Confidence | Multiple sources |
| Publication | **primary** · featured |
| Era | shipping-products |
| Confirmations | Title Full Stack vs résumé framing |

---

### `klliq` — KLLIQ LLC

| Field | Value |
|-------|--------|
| Role | Software Engineer, Contract |
| Kind | contract |
| Dates | 2023-09 – 2024-03 (aligned) |
| Location | Khamis Mushait (résumé) vs 'Asir (LinkedIn) |
| Logo | Wired `/images/companies/klliq.jpg` (JPEG, white corners — may need containment surface later) |
| Publication | **primary** · featured |
| Era | shipping-products |
| Confirmations | Public location string |

---

### `marqity` — Marqity Agency

| Field | Value |
|-------|--------|
| Role | Full Stack Developer |
| Kind | employment |
| Dates (LinkedIn) | 2024-02 – 2024-12 |
| Résumé | Absent |
| Selected dates | **2024-02 – 2024-12** (LinkedIn) |
| Logo | Wired `/images/companies/marqity.jpg` (file present despite earlier gap note) |
| Confidence | Single source |
| Publication | **supporting** (agency delivery; overlaps Tjar) |
| Era | shipping-products |
| Confirmations | Career vs archive; concurrent Tjar framing; LinkedIn-only % claims |

**Recommendation:** Supporting Career disclosure, not equal to Mohssilh/Theqah cards.

---

### `maryzad` — Maryzad

| Field | Value |
|-------|--------|
| Role | Technical Support Specialist |
| Kind | support |
| Dates | 2023-07 – 2023-10 |
| Résumé | Absent |
| Logo | Wired `/images/companies/maryzad.jpg` |
| Publication | **archive** |
| Era | shipping-products |
| Recommendation | Not a full engineering Career card |

---

### `intsolutions` — Intsolutions

| Field | Value |
|-------|--------|
| Role | Full Stack Developer |
| Kind | employment |
| Dates | 2023-04 – 2023-09 |
| Résumé | Absent |
| Logo | **Missing** (`null`) |
| Publication | **primary** · featured (per brief Career candidates) |
| Era | engineering-foundations |
| Confirmations | Résumé omission; LinkedIn % claims; logo |

---

### `eraasoft` — Eraasoft

| Field | Value |
|-------|--------|
| Role | Full Stack Developer Intern (body = internship) |
| Kind | internship |
| Dates | 2023-02 – 2023-04 |
| Logo | Wired `/images/companies/eraasoft.webp` |
| Publication | **primary** · featured |
| Era | engineering-foundations |
| Confirmations | Public internship wording; LinkedIn title vs intern body |

---

### `phoenix-techs` — Phoenix Tech’s

| Field | Value |
|-------|--------|
| Role | Full Stack Developer \| SaaS, AI, Cloud & API Engineering |
| Kind | **independent-company** |
| Dates | 2020-09 – Present |
| Logo | Wired `/images/companies/phoenix-techs.png` |
| Publication | **supporting** |
| Era | **independent-track** (parallel lane) |
| Recommendation | Not a conventional full-time employer card |

---

### `upwork-freelance` — Upwork

| Field | Value |
|-------|--------|
| Role | Freelance Full Stack Developer |
| Kind | freelance |
| Dates | 2023-08 – Present (LinkedIn) |
| Logo | Existing Hero asset `/images/upwork.png` (unchanged path) |
| Publication | **supporting** |
| Era | independent-track |
| Recommendation | Duration + delivery progression; **do not** repeat Hero JSS badge |

---

### Early / community archive

| ID | Company | Role | Dates | Logo | Publication |
|----|---------|------|-------|------|-------------|
| `obour-stem-it-supervisor` | Obour STEM School | Information Technology Supervisor | 2018-09 – 2021-09 | Education logo | archive |
| `obour-stem-cto` | Obour STEM School | Chief Technology Officer | 2018-09 – 2021-08 | Education logo | archive |
| `iyna-obour` | IYNA Obour Chapter | Head of Information Technology | 2020-07 – 2021-05 | Missing | archive |
| `tedx-youth-ismailia-stem` | TEDxYouth@Ismailia STEM | Member of Technical Staff | 2020-06 – 2021-05 | Missing | archive |
| `mediomena` | Mediomena | Head Web Development Committee | 2020-04 – 2021-05 | Missing | archive |
| `roboticers` | Roboticers | Instructor | 2020-02 – 2021-05 | Missing | archive |
| `ignite-talks` | Ignite Talks | Graphic Designer | 2020-03 – 2021-05 | Missing | archive |

**Foundation public summary (recommended):**  
Technical leadership, infrastructure, teaching, robotics, and community delivery during the STEM-school years.

Do not create seven full Career cards. Do not let Graphic Designer dominate.

---

## 4. Recommended Career eras

| Era | Period | Contents |
|-----|--------|----------|
| Engineering foundations | 2018–2023 | Compressed STEM/community + Eraasoft + Intsolutions |
| Shipping products | 2023–2024 | KLLIQ, Tjar, Marqity (supporting), Maryzad (archive) |
| Owning production systems | 2024–Present | Theqah, Kayanac, Mohssilh |
| Independent track (parallel) | 2020–Present | Phoenix Tech’s, Upwork — cross-era lane, not a fourth equal stack |

---

## 5. Logo validation table

| Semantic key | Path | Format | Dimensions | Aspect | Dark readability | Whitespace | Status |
|--------------|------|--------|------------|--------|------------------|------------|--------|
| companies.mohssilh | `/images/companies/mohssilh.png` | PNG RGBA | 86×126 | 0.68 | Good (alpha) | Generous transparent margin | Wired |
| companies.kayanac | `/images/companies/kayanac.webp` | WebP RGBA | 265×95 | 2.79 | Good | Wide wordmark margins | Wired |
| companies.theqah | `/images/companies/theqah.webp` | WebP RGBA | 718×767 | 0.94 | Good | Large transparent field | Wired |
| companies.tjar | `/images/companies/tjar.png` | PNG RGBA | 290×290 | 1.0 | Good | Tight (5% transparent) | Wired |
| companies.klliq | `/images/companies/klliq.jpg` | JPEG RGB | 100×100 | 1.0 | Caution — white corners | Opaque white bg | Wired — may need neutral plate later |
| companies.eraasoft | `/images/companies/eraasoft.webp` | WebP RGBA | 128×43 | 2.98 | Good | Wide transparent margins | Wired |
| companies.phoenixTechs | `/images/companies/phoenix-techs.png` | PNG RGBA | 860×768 | 1.12 | Good | Large transparent margins | Wired |
| companies.marqity | `/images/companies/marqity.jpg` | JPEG RGB | 100×100 | 1.0 | Mixed opaque | Possible plate later | Wired (found on disk) |
| companies.maryzad | `/images/companies/maryzad.jpg` | JPEG RGB | 100×100 | 1.0 | Caution — white corners | Opaque white bg | Wired (found on disk) |
| companies.intsolutions | — | — | — | — | — | — | **null** |
| credentials.upwork | `/images/upwork.png` | PNG RGBA | 512×141 | 3.63 | Good | Hero path unchanged | Preserved |
| education.obourStem | `/images/education/stem-obour.png` | PNG RGBA | 948×948 | 1.0 | Good | Wired into `education.ts` | OK |
| education.universityOfSadatCity | `/images/education/uscElsadat.png` | PNG RGBA | 1075×1083 | 0.99 | Good | Wired into `education.ts` | OK |

No destructive normalization in this iteration. Future UI: `object-fit: contain`; optional neutral containment for JPEG white-corner marks.

---

## 6. Classification summary

| Class | IDs |
|-------|-----|
| Primary professional | mohssilh, kayanac-erp, theqah, tjar, klliq, intsolutions, eraasoft |
| Supporting | marqity, phoenix-techs, upwork-freelance |
| Archive | maryzad + all early STEM/community roles |
| Unpublished | *(none currently)* |
