# Canonical content

Source priority: (1) explicit owner corrections, (2) `docs/source/Abdalrhman_M_Alkady_Resume_2026-07-13.pdf`, (3) `docs/source/Abdalrhman_Alkady_LinkedIn_Export.pdf` for experience discovery, (4) active repo content, (5) legacy as historical only.

Site positioning remains **Backend-Focused Product Engineer** (not the résumé’s “Software Engineer” heading, not older LinkedIn summary language).

Public contact channels (owner correction, 2026-08-05): Email, LinkedIn, GitHub, Upwork, WhatsApp, and a direct phone line. The phone / WhatsApp number is `+201069683986` (E.164). This supersedes the earlier "do not publish phone" rule and applies to the `/v2` Contact Signal Hub.

Complete experience audit: `docs/portfolio-v3/EXPERIENCE_SOURCE_AUDIT.md`.

---

## 1. Profile

| Field | Value |
|-------|--------|
| Full name | Abdalrhman Mohamed Alkady |
| Display name | Abdalrhman M. Alkady |
| Role | Backend-Focused Product Engineer |
| Location | Egypt |
| Email | alkady2019@gmail.com |
| LinkedIn | https://www.linkedin.com/in/alkady22/ |
| GitHub | https://github.com/Phoenix-H22/ |
| Phone / WhatsApp | +201069683986 (E.164) — published on `/v2` Contact Signal Hub (owner correction 2026-08-05) |
| Availability | Configurable content object |
| Mobility | Configurable (remote / relocation) |

---

## 2. Education

### Obour STEM School

- Period: 2018–2021 (content: 2018-09 → 2021-06)
- Level: STEM secondary education
- Location: Obour, Egypt
- Summary: Built an early foundation in scientific problem-solving, engineering competitions, teamwork, and practical software development.
- Logo: `/images/education/stem-obour.png` (wired in `education.ts`)
- Do **not** replace the institution name with LinkedIn’s “STEM High School for Boys - 6th of October” label.

### University of Sadat City

- Faculty: Faculty of Computers and Artificial Intelligence
- Period: September 2021 – August 2025 (canonical; LinkedIn export may show July 2025 — not applied)
- Degree: Bachelor’s degree in Computer & Artificial Intelligence
- **Cumulative result:** Cumulative A-grade with Honors *(not A+)*
- **Graduation project:** Virtual Clinic / Dr. Robot — A+ *(not the cumulative result)*
- Compact UI: `A-grade with Honors · Capstone graded A+`
- Location: Sadat City, Egypt
- Logo: `/images/education/uscElsadat.png` (wired in `education.ts`)
- Numeric GPA: not approved for the site

---

## 3. Professional experience (structured inventory)

All entries live in `src/content/experience.ts` with `publicationLevel`, sources, and `needsOwnerConfirmation`.

### Primary Career candidates

| ID | Company | Role (public) | Dates (selected) | Notes |
|----|---------|---------------|------------------|-------|
| mohssilh | Mohssilh | Software Engineer, Backend & Integrations | 2025-03 – Present | LinkedIn says 2025-01 — **NEEDS_OWNER_CONFIRMATION** |
| kayanac-erp | Kayanac ERP | Software Engineer, Full Stack / Contract | 2025-03 – 2025-06 | Résumé only |
| theqah | Theqah.sa | Software Engineer | 2024-08 – 2025-02 | LinkedIn says Present — **NEEDS_OWNER_CONFIRMATION** |
| tjar | Tjar.sa | Software Engineer, Contract | 2024-03 – 2024-05 | Aligned |
| klliq | KLLIQ LLC | Software Engineer, Contract | 2023-09 – 2024-03 | Aligned |
| intsolutions | Intsolutions | Full Stack Developer | 2023-04 – 2023-09 | LinkedIn-only; logo missing |
| eraasoft | Eraasoft | Full Stack Developer Intern | 2023-02 – 2023-04 | LinkedIn-only |

### Supporting / independent

| ID | Company | Kind | Dates | Notes |
|----|---------|------|-------|-------|
| marqity | Marqity Agency | employment | 2024-02 – 2024-12 | Supporting; overlaps Tjar |
| phoenix-techs | Phoenix Tech’s | independent-company | 2020-09 – Present | Parallel track — not ordinary employer |
| upwork-freelance | Upwork | freelance | 2023-08 – Present | Career = duration/progression; Hero keeps JSS |

### Archive (Foundation / disclosure)

Maryzad (support) · Obour STEM IT Supervisor · Obour STEM CTO · IYNA Obour · TEDxYouth@Ismailia STEM · Mediomena · Roboticers · Ignite Talks (Graphic Designer — de-emphasize)

Public Foundation summary direction:  
*Technical leadership, infrastructure, teaching, robotics, and community delivery during the STEM-school years.*

Smart Vending remains a separate project unless the owner confirms a company link to Theqah.

---

## 4. Confirmed projects in `src/content/projects.ts` (`status: "canonical"`)

1. **Merchant Operations and Salla Automation** — Commerce and Integrations · Mohssilh · client-confidential  
2. **NABD Messaging Platform** — Commerce and Messaging Automation  
3. **Smart Vending / Medication Dispensing Platform** — IoT and Physical Product Systems (Wasfaty not public until approved)  
4. **Virtual Clinic / Dr. Robot** — AI, Healthcare, Mobile, and Hardware · graduation project · A+

Homepage and `/work` selection: see `docs/portfolio-v3/PROJECT_SELECTION_MATRIX.md`.

---

## 5. Additional portfolio projects pending structured confirmation

**In code as pending:** Your Obour Guide · AI PDF Extraction Pipeline  

**Docs-only (no `projects.ts` entry yet):** SaboraTV, ASFEC, Queue SaaS, Website Monitoring SaaS, Easy Spelling LMS, ERP and payroll systems, LUQTA, payment and auction platform, other private client systems

---

## 6. Achievements and certificates

From latest résumé:

- ICSI \| CNSS Certified Network Security Specialist
- Cyber Security Foundation Professional Certificate — CSFPC™
- Nano-degree Intro to programming
- AWS Academy Cloud Foundations
- Graduation project A+ (Virtual Clinic / Dr. Robot)
- Cumulative A-grade with Honors (separate achievement entry)

From owner / proof-engine:

- Upwork Top Rated · 100% Job Success Score — profile URL in hero content

Do not dump certificates into the homepage.

---

## 7. Contact publication rules

Publish channels: Email, LinkedIn, GitHub, Upwork, WhatsApp, and direct phone (`+201069683986`, E.164) — owner correction 2026-08-05. The WhatsApp deep link uses `https://wa.me/201069683986` (leading `+` dropped); the phone uses `tel:+201069683986`.

Résumé PDF: `public/documents/Abdalrhman_Alkady_Resume.pdf` — confirm approved public version.  
Availability and mobility: content-driven, not hardcoded in components.

---

## 8. Company and education assets

See `src/content/portfolio-assets.ts` and `EXPERIENCE_SOURCE_AUDIT.md` logo table.

Wired company logos: Mohssilh, Kayanac, Theqah, Tjar, KLLIQ, Eraasoft, Phoenix Tech’s, Marqity, Maryzad.  
Missing: Intsolutions (+ community orgs).  
Upwork Hero path unchanged: `/images/upwork.png`.

---

## 9. Facts that still require confirmation

- Mohssilh start: January 2025 (LinkedIn) vs March 2025 (résumé)
- Theqah end: Present (LinkedIn) vs February 2025 (résumé)
- University end month: July 2025 (LinkedIn) vs August 2025 (canonical) — canonical kept
- Kayanac / Intsolutions / Eraasoft / Marqity / Maryzad public Career prominence
- Phoenix Tech’s independent-track framing
- LinkedIn-only metrics (see audit §2)
- Company URLs and logo rights for missing marks
- Live / repository links for projects
- Merchant Operations ↔ Mohssilh case-study ownership language
- Wasfaty publication approval
