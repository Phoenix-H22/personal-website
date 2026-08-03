# Current Projects and Media Inventory

Status: **Discovery complete (partial media clearance)**  
Inspected: 2026-07-26  
Notion database: Portfolio Project Inventory (`f7201955-a3c3-42b6-ae61-3367b642d192`)  
Data source: `collection://562b69f1-da3d-4342-957a-2141b796fe33`  
Notion access: **read-only** (MCP query + fetch)

Eligibility rule used (per brief):

> Public website eligibility requires live Notion `Needs Images = false`.

---

## 1. Canonical project set (13)

Exact live Notion query (Backup titles excluded). Count = **13**.

| Priority | Project | Notion page ID | Proposed slug | Needs Images | Tier | Primary Category | Status |
| ---: | --- | --- | --- | --- | --- | --- | --- |
| 1 | Warqah Store | `3a633e24-aa62-8165-ab48-edac9c672f48` | `warqah-store` | **true** | Flagship | High-Scale Commerce | Live |
| 2 | Smart Lockers Platform | `3a633e24-aa62-810d-8d42-e0fd588e2190` | `smart-lockers-platform` | **false** | Flagship | IoT & Smart Machines | Live |
| 3 | Wasfaty Smart Vending | `3a633e24-aa62-8166-9b90-fef5a43e9b55` | `wasfaty-smart-vending` | true | Flagship | IoT & Smart Machines | Live |
| 4 | Your Obour Guide | `3a633e24-aa62-8117-a6c5-ebf3344889b7` | `your-obour-guide` | **true** | Flagship | Mobile & Consumer | Active Dev |
| 5 | Riders Shopify & WordPress Integrations | `3a633e24-aa62-8173-8e2e-f65c1b724e28` | `riders-shopify-wordpress` | **false** | Featured | E-commerce & Logistics Integrations | Live |
| 6 | NABD | `3a633e24-aa62-8167-b86e-dea3ffdb0671` | `nabd` | true | Flagship | SaaS & Platforms | Live |
| 7 | Autopay EG | `3a633e24-aa62-81e3-a434-f3efe0822a86` | `autopay-eg` | **true** | Flagship | Fintech & Payments | Live |
| 8 | Alzahaby Loyalty App | `3a633e24-aa62-817e-a3de-c9252e6b97e0` | `alzahaby-loyalty-app` | **false** | Featured | Mobile & Consumer | Live |
| 9 | SIM Express | `3a633e24-aa62-8177-b560-ea6fe8a9f114` | `sim-express` | true | Flagship | IoT & Smart Machines | Completed |
| 10 | Tawfir | `3a633e24-aa62-8104-8aca-e79d886a71ac` | `tawfir` | true | Featured | Mobile & Consumer | Completed |
| 11 | PDF Extractor | `3a633e24-aa62-81fd-bbad-e78f69534646` | `pdf-extractor` | true | Featured | AI & Automation | Completed |
| 12 | PinoyAid | `3a633e24-aa62-81d1-8f7d-d75a412eb72c` | `pinoyaid` | true | Featured | Fintech & Payments | Completed |
| 13 | Chocolate Smart Vending | `3a633e24-aa62-8101-9f53-ee4fb7605a44` | `chocolate-smart-vending` | true | Featured | IoT & Smart Machines | Completed |

---

## 2. Completed vs incomplete (live Notion)

### Completed for public media (`Needs Images = false`) — 3 projects

1. Smart Lockers Platform  
2. Riders Shopify & WordPress Integrations  
3. Alzahaby Loyalty App  

### Incomplete for public media (`Needs Images = true`) — 10 projects

Warqah Store, Wasfaty Smart Vending, Your Obour Guide, NABD, Autopay EG, SIM Express, Tawfir, PDF Extractor, PinoyAid, Chocolate Smart Vending.

### Owner-memory vs live Notion (important conflict)

Owner brief listed these as completed/protected:

| Project | Local approved media | Live `Needs Images` | Conflict |
| --- | --- | --- | --- |
| Smart Lockers Platform | yes | false | none |
| Riders | yes | false | none |
| Alzahaby Loyalty App | yes | false | none |
| Autopay EG | yes (`media-batch/final` + `public/portfolio`) | **true** | **yes** |
| Warqah Store | yes | **true** | **yes** |
| Your Obour Guide | yes | **true** | **yes** |

Discovery treats Notion as the publication gate. Local approved media for Autopay / Warqah / Obour is inventoried as **ready-to-map but not yet Notion-cleared**.

---

## 3. Completed project media mapping

### 3.1 Smart Lockers Platform

Private root: `.portfolio-private/smart-lockers/`

| Role | Local source | Dims | Bytes | SHA-256 | Public-use | Notes |
| --- | --- | ---: | ---: | --- | --- | --- |
| cover (proposed) | `newdesign1.png` | 1672×941 | 1,650,444 | `ca1cd9ce95acc0cab8eb3eb10f2e9ce128e6ad9e99cb6f7c698b56372830cb82` | **safe — confirm role** | Owner brief names this Cover. Notion Media section currently shows `newdesign2.png` labeled “Diagram”, not this file as cover. |
| machine | `lockersmachineimage.png` | 1448×1086 | 1,821,927 | `ed1b3e902432e20c6023e54c1d51922e8c1b1b70c523a1abc5a650a6db4c5416` | safe | Matches Notion Media (“شكل الماكينه علي الحقيقة”). |
| dashboard | `dashboard_screenshot.png` | 1672×941 | 1,030,213 | `8516c1f3b1bdc15c2517ca6ddf3f53ef1a4f77e23c4815f02d9fe8e2b56d82a3` | safe | Matches Notion Media (“Dashboard”). |
| architecture / diagram | `newdesign2.png` | 1672×941 | 1,469,207 | `b0eda9d8907fc4bb98dcd680f256d8d55095fb40052b7f3d987a58bc5cfc8352` | safe | Matches Notion Media (“Diagram”). |
| rejected / archive | `old_design1.png`, `old_design2.png` | — | — | — | **do not publish** | Legacy designs. |

Notion Media summary: machine + dashboard + diagram. No explicit “cover” block; website cover should use owner-approved `newdesign1.png` unless owner overrides.

Proposed public paths:

- `/portfolio/projects/smart-lockers-platform/cover.webp`
- `/portfolio/projects/smart-lockers-platform/machine.webp`
- `/portfolio/projects/smart-lockers-platform/dashboard.webp`
- `/portfolio/projects/smart-lockers-platform/architecture.webp`

Public folder today: **missing** (not yet copied).

---

### 3.2 Riders Shopify & WordPress Integrations

Private roots:

- Cover: `.portfolio-private/riders/cover/`
- Upload package: `.portfolio-private/riders/notion-upload/`
- Already mirrored: `public/portfolio/projects/riders/`

| Role | Local source (canonical) | Dims | Bytes | SHA-256 | Public-use |
| --- | --- | ---: | ---: | --- | --- |
| cover (PNG master) | `cover/riders-cover-approved.png` | 1672×941 | 1,558,574 | `84bc763249aa38673ca63aa5713af2fbecdc538d5472e1c4ef893d0c5705e55b` | safe |
| cover (WebP derivative) | `notion-upload/01-riders-cover.webp` | 1600×900 | 116,288 | `f4d1ea4792d09125f62c9b92d18a9391e4e5adcba1010da78dc247e79c5e4721` | safe — **matches** `public/.../riders-cover.webp` |
| shopify-listing | `notion-upload/02-riders-shopify-listing.webp` | 1600×3436 | 267,918 | `87887f9dce3e8f1d6ddb0f316e127562c01a25a27544a59e3896470b40a28d6f` | safe |
| shopify-settings | `notion-upload/03-riders-shopify-settings.webp` | 1600×900 | 37,948 | `5b0d7cfc9c2543f606048a190fd9e2929952cb08d48ec03ac6563afb4deb25d8` | safe |
| shopify-sync | `notion-upload/04-riders-shopify-sync.webp` | 1600×900 | 25,350 | `607a481d95cc27117e7d393525967a4839a8217cb558fe86648c179a9deb6081` | safe |
| wordpress-listing | `notion-upload/05-riders-wordpress-listing.webp` | 1600×5414 | 364,074 | `4605d02ec3171fed9c60cfe0c66f7438e8adba008ee3140a0232a0abcb1e9542` | safe |
| wordpress-checkout | `notion-upload/06-riders-wordpress-checkout.webp` | 600×467 | 13,246 | `31cfe34a81e4777a0710061ccd0157b655845c1e0b32db1738da4fc30f5f44c0` | safe |
| wordpress-orders | `notion-upload/07-riders-wordpress-orders.webp` | 600×298 | 7,906 | `25e090bd0bd6a8cf0b3c884b02915723fc9dd3cd7563d23f2e5a806391dc82f7` | safe |

Notion PROJECT MEDIA: six gallery images (Shopify listing/settings/sync + WordPress listing/checkout/orders). Cover composition exists locally/publicly but is not one of the six alt-labeled gallery blocks.

Unsafe / non-canonical public leftovers under `public/portfolio/projects/riders/`:

- `ChatGPT Image Jun 14, 2026, 10_29_23 PM.png`
- `imresizer-WhatsApp Image 2026-06-14 at 10.10.47 AM.jpg`
- root `logo.png`
- `screenshots/cover-reference-*`

**Decision needed:** remove or quarantine those loose public files before launch.

---

### 3.3 Alzahaby Loyalty App

Private roots:

- Approved cover package: `.portfolio-private/alzahaby-loyalty-app/approved-cover/`
- Architecture: `.portfolio-private/alzahaby-loyalty-app/arch.png`

| Role | Local source | Dims | Bytes | SHA-256 | Public-use |
| --- | --- | ---: | ---: | --- | --- |
| cover | `approved-cover/cover-final.png` | 1600×900 | 1,821,351 | `5b4e633a904faccbc7bb54ced2bb2d18a4296ad80b68051fac80eacb9b4b6306` | **safe — only public cover** |
| cover-original (protected) | `approved-cover/cover-approved-original.png` | 1672×941 | 1,882,434 | `43bade3df0ecdbdf9e5f0a99f2d81b976775d6c709208ac5a9edfb959f505d83` | **NEVER publish** (conceptual numerics) |
| architecture | `arch.png` | 1672×941 | 1,809,570 | `dc35c4fcea09ad7a0c67f2d7245da4e4df7120d9ecd0ab901dbd66f4da30d51f` | safe — matches Notion Media filename |

Ambiguities:

- Batch-manifest paths under `media-batch/final/*` are **stale** (`media-batch` directory does not exist).
- Local `approved-cover/media-manifest.json` still says `notion_publishing_status: NOT_PUBLISHED`, while live Notion `Needs Images = false` and page content includes PROJECT MEDIA (mobile screens + architecture).
- Notion also contains mobile onboarding/home images with generic Notion filename `image.png` — **no stable local filename inventable**; map only after owner points to local masters or export.

Proposed public paths:

- `/portfolio/projects/alzahaby-loyalty-app/cover.webp` ← from `cover-final.png`
- `/portfolio/projects/alzahaby-loyalty-app/architecture.webp` ← from `arch.png`
- mobile gallery TBD after local masters confirmed

Public folder today: **missing**.

---

## 4. Notion-uncleared but locally approved (media ready)

These are **not** website-eligible under the live `Needs Images` gate, but approved local packages exist and should be ready for a fast flip once Notion is cleared.

### Autopay EG

| Role | Private source | Dims | SHA-256 | Existing public derivative |
| --- | --- | ---: | --- | --- |
| cover | `.portfolio-private/autopay-eg/media-batch/final/cover-final.png` | 1672×941 | `2ea8278465bdaefafe7b243c447026b9bbd00d1a9e9570fab73bd5b203ae8cc9` | `public/.../cover/autopay-eg-cover.webp` (1600×900) |
| product | `.../product-final.png` | 1917×912 | `c4910d2fab3ed19e5c8d4c75fafa32a14acafb281f930a37176865046fecb28c` | screenshots exist |
| integration-flow | `.../integration-flow-final.png` | 1082×812 | `9aa14704e7430af6873849e45afc3d1f3a0440925a2256347423678dabfe8fad` | payment-flow screenshots exist |

Notion page already has PROJECT MEDIA blocks but `Needs Images` remains **true**.

### Warqah Store

| Role | Private source | Dims | SHA-256 |
| --- | --- | ---: | --- |
| cover | `.../warqah-store/media-batch/final/cover-final.png` | 1600×900 | `3460fb90bc5322a9ac300055f8fd213567d82075a47c5e1f07c2e813dabb106d` |
| product | `.../product-final.png` | 1905×922 | `fdce37e36ec54fb3adb76066a0d19c887451cfe43e013d2be6cea90b85f3b848` |
| dashboard | `.../dashboard-final.png` | 1916×707 | `6eacc90032a24782e72347ff676d8b50301a963c3071e01f4045fe435b71f91d` |

Public derivatives already under `public/portfolio/projects/warqah-store/`.

### Your Obour Guide

| Role | Private source | Dims | SHA-256 |
| --- | --- | ---: | --- |
| cover | `.../your-obour-guide/media-batch/final/cover-final.png` | 1672×941 | `250e487e2180a518b812f50c2914b72b02d49d4d16705d1dba607d5941f65e16` |
| mobile | `.../mobile-final.jpg` | 573×1280 | `2fa13fae2a457d926f7cae32f187c677c22c2fb67dbb945b2dc8002196da623f` |
| dashboard | `.../dashboard-final.png` | 1920×1342 | `49842d98891ebf04ed433c7d5dfcfaf8c659525a17b4171e44e0b7ec9dedf562` |

Public derivatives already under `public/portfolio/projects/your-obour-guide/`.

---

## 5. Incomplete projects (Needs Images = true) — media readiness snapshot

From `_media-review/batch-manifest.json` (local planning artifact): cover (+ often architecture) packages exist for Chocolate Smart Vending, NABD, PDF Extractor, PinoyAid, SIM Express, Tawfir, Wasfaty Smart Vending.

These are **not** treated as website-complete until Notion `Needs Images = false`.

Publication-safety note (existing site doctrine): Wasfaty naming / medicine claims remain gated for public marketing surfaces even after media clears.

---

## 6. Missing / ambiguous / unsafe assets

1. **Eligibility conflict:** Autopay, Warqah, Obour have approved local + public media but Notion still `Needs Images = true`.  
2. **Smart Lockers cover role:** owner says `newdesign1.png`; Notion Media shows `newdesign2.png` as Diagram. Confirm cover = `newdesign1`.  
3. **Alzahaby mobile Notion images:** generic `image.png` names — no inventable local mapping.  
4. **Alzahaby batch-manifest paths stale** (`media-batch/final` missing).  
5. **Riders public dirt:** ChatGPT / WhatsApp / cover-reference files under `public/portfolio/projects/riders/`.  
6. **No Notion SDK in app today** — content currently local fixtures for Featured Systems only (4 projects, different set).  
7. **Existing Featured Systems on `/v2`** uses art-directed CSS covers for Merchant Ops / NABD / Smart Vending / Virtual Clinic — not the Notion inventory set. Architecture must reconcile these two systems carefully.

---

## 7. Safe public-use decisions (summary)

| Asset class | Decision |
| --- | --- |
| `cover-final.png` / approved covers for completed projects | public-safe after derivative copy |
| Alzahaby `cover-approved-original.png` | never public |
| Smart Lockers machine + dashboard | public-safe |
| Riders marketplace/workflow screenshots | public-safe |
| Notion signed S3 URLs | never hardcode; never ship as primary media |
| `.portfolio-private/**` absolute paths | never client-delivered |
| Loose ChatGPT/WhatsApp files in public riders | remove/quarantine before launch |
