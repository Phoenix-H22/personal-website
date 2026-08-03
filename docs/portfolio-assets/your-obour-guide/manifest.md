# Your Obour Guide asset manifest

## Processing

Processed locally with ImageMagick only. Outputs use sRGB-compatible WebP encoding with metadata stripped. The approved cover was resized/canvas-fitted to 1600×900 without redesign; the 800×450 thumbnail was derived from that final cover. Screenshots retain their source dimensions and portrait orientation where applicable. No AI generation, reconstruction, application-source change, dependency change, or Notion write was performed.

## Privacy review

- `admin@example.com` was blurred only in the public admin-dashboard derivative.
- The phone number in the place-details screenshot was blurred only in the public derivative.
- The personal name in the mobile-home greeting was blurred only in the public derivative.
- Private originals are byte-for-byte copies of the six sources and remain untouched.

## Git and file operations

- Git state before: `?? public/portfolio/`
- Files created: `.portfolio-private/your-obour-guide/originals/*`, `.portfolio-private/your-obour-guide/notion-upload/*`, the public cover, thumbnail, five screenshots, and these manifests.
- Files moved: none.
- Files deleted after validation: the six raw source images from the public project root.
- Files modified: `.gitignore`, adding exactly `.portfolio-private/`.
- Application source, `package.json`, and `package-lock.json`: unchanged.

## Assets

| Relative path | Class | Visibility | Dimensions | Format | Size | SHA-256 | Intended use | Sanitization | Notion position | Derived from |
|---|---|---|---:|---|---:|---|---|---|---:|---|
| `.portfolio-private/your-obour-guide/originals/01-mobile-home.jpg` | Original | Private | 573×1280 | JPG | 102,175 B | `2fa13fae2a457d926f7cae32f187c677c22c2fb67dbb945b2dc8002196da623f` | Source archive | Untouched | — | — |
| `.portfolio-private/your-obour-guide/originals/02-place-details.jpg` | Original | Private | 573×1280 | JPG | 69,207 B | `72e2201793c8437552f052e7ef996dd15e9ac362c7a36a8216fa6d1bf9b13bbc` | Source archive | Untouched | — | — |
| `.portfolio-private/your-obour-guide/originals/04-admin-dashboard.png` | Original | Private | 1920×1342 | PNG | 174,545 B | `49842d98891ebf04ed433c7d5dfcfaf8c659525a17b4171e44e0b7ec9dedf562` | Source archive | Untouched | — | — |
| `.portfolio-private/your-obour-guide/originals/landing-page-dark.png` | Original | Private | 1902×766 | PNG | 292,344 B | `000bd412af6d59849bbd59cb181ed7d14977cd832fe4f0b291c033be57204711` | Source archive | Untouched | — | — |
| `.portfolio-private/your-obour-guide/originals/landing-page-light.png` | Original | Private | 1902×782 | PNG | 302,056 B | `19f9586810c4ab14d9bbdb43b2d3e9d57771ee4c7c9d234b6b26d877550394e4` | Source archive | Untouched | — | — |
| `.portfolio-private/your-obour-guide/originals/yourobourguidecover.png` | Original | Private | 1672×941 | PNG | 1,616,310 B | `250e487e2180a518b812f50c2914b72b02d49d4d16705d1dba607d5941f65e16` | Approved cover source | Untouched | — | — |
| `public/portfolio/projects/your-obour-guide/cover/your-obour-guide-cover.webp` | Generated | Public | 1600×900 | WEBP | 159,182 B | `d957330fe79595429ae65fde118fcf770c2a9d73420f2dad7e74db3eacc927b1` | Portfolio cover | None | 1 | `yourobourguidecover.png` |
| `public/portfolio/projects/your-obour-guide/thumbnails/your-obour-guide-thumbnail.webp` | Generated | Public | 800×450 | WEBP | 50,846 B | `6c192fb0e479471f7f0d5f39fc321c246073898e7e073fa05dc3430509e29c10` | Listing thumbnail | None | — | Final cover WebP |
| `public/portfolio/projects/your-obour-guide/screenshots/your-obour-guide-mobile-home.webp` | Generated | Public | 573×1280 | WEBP | 74,284 B | `8a73e089347c8302c165e2dd5a6505d55f0a611957952e0d1e2d78dc12ed5603` | Mobile home screenshot | Personal greeting name blurred | 2 | `01-mobile-home.jpg` |
| `public/portfolio/projects/your-obour-guide/screenshots/your-obour-guide-place-details.webp` | Generated | Public | 573×1280 | WEBP | 49,368 B | `a62322185c6557bb150b0a6ca255eca4aedd68308f5b80051324ede11b0691c8` | Place details screenshot | Phone number blurred | 3 | `02-place-details.jpg` |
| `public/portfolio/projects/your-obour-guide/screenshots/your-obour-guide-admin-dashboard.webp` | Generated | Public | 1920×1342 | WEBP | 49,062 B | `92595432b092b6a574e3df1355e788c69a332a2cbe0478036750bd6a996d677e` | Admin dashboard screenshot | Placeholder email blurred | 4 | `04-admin-dashboard.png` |
| `public/portfolio/projects/your-obour-guide/screenshots/your-obour-guide-landing-dark.webp` | Generated | Public | 1902×766 | WEBP | 47,836 B | `adae172fd68f1d876bfa0ef3e998e25c956ba9ebd34c0d0985eaa0a0d93bcb9d` | Dark landing screenshot | None | 5 | `landing-page-dark.png` |
| `public/portfolio/projects/your-obour-guide/screenshots/your-obour-guide-landing-light.webp` | Generated | Public | 1902×782 | WEBP | 58,294 B | `28160894dfd83c06488bf7e3d266937659ccef0a51dc199b82b682d6c5de7f37` | Light landing screenshot | None | 6 | `landing-page-light.png` |

## Notion upload package

The six files under `.portfolio-private/your-obour-guide/notion-upload/` are byte-for-byte identical to the corresponding final public assets and are ordered 01 through 06 as shown in the manifest.

