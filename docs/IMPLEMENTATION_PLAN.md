# Implementation plan

## Repository decision

The active repository root becomes a strict TypeScript Next.js App Router application. The ignored `old_site` directory and root archive remain untouched. The legacy site contains an older Laravel portfolio and private environment material; it is not used as a dependency or copied into the new application.

No reference `DESIGN.md` file was available during the initial audit, so the visual system is derived from the project brief rather than a repository reference.

## Foundation

- Next.js App Router and React
- Tailwind CSS with semantic variables defined in CSS
- Server Components by default
- Motion isolated to the interactive system map
- `next/font` for Geist and IBM Plex Mono
- Typed local content behind repository selectors
- Lucide only for a small number of interface icons

## Initial structure

```text
src/
  app/
  components/
    brand/
    home/
    layout/
    ui/
  content/
  lib/content/
  styles/
docs/
public/brand/
public/documents/
public/projects/
```

## Vertical slice

1. Root metadata, fonts, skip link, and semantic shell
2. Sticky navigation with AK route mark
3. Editorial hero with configurable status and two standard links
4. Accessible SVG system map with restrained request motion
5. Scoped evidence rail
6. Merchant operations project transition
7. Strong contact conclusion
8. Design-system QA route

## Validation

- ESLint
- TypeScript without emit
- Production build
- IDE diagnostics
- Browser review at required viewport widths
- Keyboard and reduced-motion checks

## Environment

Dependencies are locked in `package-lock.json`. Set `NEXT_PUBLIC_SITE_URL` to the final production origin so canonical, Open Graph, sitemap, and robots URLs resolve correctly. Vercel deployments use `VERCEL_URL` when the explicit variable is absent; local development falls back to `http://localhost:3000`.

## Next slice

After the visual language is reviewed:

1. Complete all four featured project covers.
2. Build the work index and supporting archive.
3. Implement the reusable case-study route.
4. Complete Merchant Operations and Salla Automation as the first full case study.
5. Add the journey, capability layers, and principles.
6. Add sitemap, robots, structured data, and project metadata.
