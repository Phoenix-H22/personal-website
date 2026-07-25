# Selected Systems Storyboard — S2B

Status: **S2B implemented on `/v2` — awaiting visual approval**  
Chapter id / anchor: `#selected-systems`

Visible heading: **Featured Systems**  
Eyebrow: **SELECTED SYSTEMS**  
Count: **4 projects**  
Supporting line: **Production systems across commerce, messaging, IoT, and AI.**

Creative language: **Systems in Production** — original editorial stages, not a terminal/browser clone, not equal Bento tiles, not a three-card vertical list.

Implementation report: `docs/portfolio-v3/S2B_FEATURED_SYSTEMS_REDESIGN_REPORT.md`  
QA captures: `docs/portfolio-v3/qa/s2b/` (local / gitignored)

---

## V2 Hero contract (S2B refinement)

### Positioning
- Eyebrow: `SOFTWARE ENGINEER · BACKEND SYSTEMS · PRODUCTS & INTEGRATIONS`
- Statement (unchanged): `I engineer the systems businesses learn to depend on.`
- Summary: backend-focused software engineer · systems · integrations · polished web products
- Core technology line: `PHP · Laravel · Python · JavaScript · React · Next.js`

### Identity order
Eyebrow → Name → Statement → Summary → Technology line → Education Credential → CTAs → Socials → Explore signal

### Education Credential
- One capsule attached to identity column (not mid-viewport float)
- Degree neutral · Honors cyan · Capstone A+ amber
- Ambient float 3–5px; pause hover/focus/off-screen/hidden; static under reduced motion

### Still excluded from V2 Hero
Full Education Journey · Product Deck

---

## Featured Systems composition

### Default (All Systems)
1. Header + category controls  
2. **Flagship** — Merchant Operations Platform (wide editorial)  
3. **Support row** — NABD (landscape) + Smart Vending (portrait/device)  
4. **Clinic band** — Virtual Clinic / Dr. Robot (wide editorial)

### Categories (homepage filter set)
| Control | Maps to |
| --- | --- |
| All Systems | all four |
| Commerce | Merchant Operations |
| Messaging | NABD |
| IoT | Smart Vending |
| AI & Healthcare | Virtual Clinic |

Default browsing shows all four. Filters use `aria-pressed` buttons (not fake tabs).

### Cover architecture
Typed `visualTheme.coverType` → `<ProjectCover type={…} />`  
No title-string switching. No JSX in content fixtures.

| Project | coverType |
| --- | --- |
| Merchant Operations | `merchant-operations` |
| NABD | `messaging-router` |
| Smart Vending | `vending-device-flow` |
| Virtual Clinic | `virtual-clinic-loop` |

### Link gating
Case-study CTAs and “Explore all systems” remain hidden until real routes exist. No `href="#"`.

---

## Publication safety

- Smart Vending: no Wasfaty / Theqah / medicine brands / patient data  
- Merchant Ops Flagship cover: operational route — not Hero KPI strip  
- NABD / Clinic: no invented metrics or clinical claims  

---

## Next gate

Wait for:

`S2B FEATURED SYSTEMS VISUALLY APPROVED — BEGIN SYSTEMS ATLAS`
