# Selected Systems Storyboard — S2-PRE

Status: **Art direction for V2 only**  
Do **not** implement in S2-PRE.  
Chapter id / anchor: `#selected-systems`

Working title: **Selected Systems**  
Supporting line: **Products, platforms, and infrastructure built for real operations.**

Creative language: **Systems in Production** — not a terminal, OS clone, spaceship, SaaS dashboard, or repeated Bento grid.

---

## V2 Hero transition contract (implement in S2A, not now)

### Remove from V2 Hero
- Full Education Journey artifact  
- Full Product Deck artifact  

### Keep
- Identity, Upwork proof, Commerce Operations Scale, primary CTA, résumé CTA, socials  

### Add
1. Education credential: `B.Sc. Computer & AI · A-grade with Honors · Capstone A+`  
   - One combined chip · graduation icon · cyan on Honors · amber on Capstone A+  
   - Float 3–5px · pause on hover/focus · static under reduced motion  
2. Section signal: `Explore selected systems` + `↓` → `#selected-systems`  
   - Only when Selected Systems exists  
   - Accessible link · no scroll hijack · restrained vertical motion · not a badge  

### Preserve components/data
Education Journey, Product Deck, education data, project deck data remain for Current `/`, Origin, QA, reuse.

---

## Reading order

1. Chapter identity (title + supporting line)  
2. Flagship system (Merchant Operations Platform)  
3. Ownership + strongest safe proof  
4. Three supporting systems  
5. CTA: **Explore all systems** → `/work` (dev: `/v2/work` until promotion)  

Never hide: title, purpose, ownership, strongest result, navigation, case-study link.

---

## Structure (not four equal cards)

### Flagship — Merchant Operations Platform
Dominant feature (~60–65% desktop width / full first band).

Contains:
- Project identity + domain  
- One strong problem statement  
- Ownership  
- Strongest verified proof (not a Hero KPI strip clone)  
- Honest visual: lifecycle / webhook reconciliation schematic from verified nodes  
- **Explore case study** action  

### Supporting — three domain silhouettes
| Project | Artifact direction | Signature color |
| --- | --- | --- |
| NABD | Channels + delivery states | cyan / blue |
| Smart Vending | QR → payment → MQTT → release | cyan / controlled green |
| Virtual Clinic | Patient flow · AI interaction abstract | violet / cyan |

Titles must remain scannable without hover.

---

## Hero → Selected Systems transition

- Normal document flow  
- No sticky multi-screen lock, no giant empty spacer, no second Product Deck  
- Shared restrained signal line / color continuity allowed  
- Direct `#selected-systems` load must still make sense  

---

## Responsive storyboard

### Desktop (≥1400×900 class)
- Flagship dominant left/top band  
- Supporting trio in editorial stack or 1+2 composition — **not** one equal row of four  
- Names readable without interaction  

### Laptop (1366×768)
- Keep hierarchy; avoid compressed four-up  
- Flagship may stack above supporting row of three with reduced media  

### Tablet
- Intentional two-column or stacked editorial  
- Do not shrink desktop mosaic geometry  

### Mobile
- Vertical reading: title → summary → proof → CTA → visual  
- No horizontal-only discovery / drag required  
- Stable media aspect boxes  

---

## Motion plan

| Beat | Motion | Reduced motion |
| --- | --- | --- |
| Flagship enter | Fade/rise establish | Final static layout |
| Proof signal | Short data accent | Static metrics visible |
| Supporting | Stagger resolve | All visible immediately |
| CTA | Focus/hover only | Clear static affordance |

Forbidden: autoplay project switching, content hidden behind animation, WebGL default, Product Deck interaction clone, cursor followers.

---

## Accessibility (chapter)

- Landmark region with accessible name  
- Heading hierarchy H2 chapter → H3 projects  
- Case-study links keyboard reachable · ≥24×24px targets  
- Contrast AA · no hover-only titles  
- Motion respects `prefers-reduced-motion`  

---

## Data wiring (S2A)

```ts
const featured = await getProjectRepository().getFeaturedProjects();
// homepageOrder 1..4 — Flagship is order 1
```

Variant config on V2: `sections.showSelectedSystems: true` only when chapter ships.
