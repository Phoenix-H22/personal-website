# Missing Official Assets — Concept V3 / S1-PRE

Asset status after inspecting `public/images` and wiring `portfolio-assets.ts`.

## Mapped and in use

| Semantic key | File |
|---|---|
| `credentials.upwork` | `/images/upwork.png` (Hero path unchanged) |
| `education.obourStem` | `/images/education/stem-obour.png` |
| `education.universityOfSadatCity` | `/images/education/uscElsadat.png` |
| `companies.mohssilh` | `/images/companies/mohssilh.png` |
| `companies.kayanac` | `/images/companies/kayanac.webp` |
| `companies.theqah` | `/images/companies/theqah.webp` |
| `companies.tjar` | `/images/companies/tjar.png` |
| `companies.klliq` | `/images/companies/klliq.jpg` |
| `companies.eraasoft` | `/images/companies/eraasoft.webp` |
| `companies.phoenixTechs` | `/images/companies/phoenix-techs.png` |
| `companies.marqity` | `/images/companies/marqity.jpg` |
| `companies.maryzad` | `/images/companies/maryzad.jpg` |
| `projects.yourObourGuide` | `/images/LogoAPpICon2.png` |
| `projects.nabd` | `/images/nabd-logo-new.png` |

## Intentionally unmapped

| File | Reason |
|---|---|
| `/images/smartlockers.jpg` | Reads as “MQTT Door Lockers,” not confidently Smart Vending |
| `/images/autopay-logo.png` | Autopay mark; not a hero Proof Engine product |

## Still missing

| Need | Status |
|---|---|
| Smart Vending project logo | Missing — silhouette fallback remains |
| `companies.intsolutions` | Missing — keep `null` |
| IYNA / TEDx / Mediomena / Roboticers / Ignite logos | Missing — archive entries; typographic fallback later |

## Logo notes (no destructive edits this iteration)

- Mixed PNG / WebP / JPG is intentional.
- `klliq.jpg` / `maryzad.jpg` have opaque white corners — future UI may use a neutral containment surface; originals preserved.
- Full decode/dimension table: `EXPERIENCE_SOURCE_AUDIT.md` §5.

UI must never show temporary / pending / missing-asset copy.
