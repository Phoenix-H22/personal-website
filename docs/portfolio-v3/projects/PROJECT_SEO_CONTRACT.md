# Project SEO Contract — S2-PRE

Status: **Future final portfolio** (document only; do not change live sitemap behavior in S2-PRE beyond existing V2 isolation).

---

## Route SEO

| Route | Index | Canonical | Notes |
| --- | --- | --- | --- |
| `/` | yes | `/` | Person / ProfilePage focus |
| `/v2` | no | `/` | Until promotion |
| `/v2/work` (dev) | no | self or none | Experimental |
| `/work` (final) | yes | `/work` | Systems Atlas |
| `/work/[slug]` | if published | `/work/{slug}` | Dossier |
| Filtered `/work?…` | no | `/work` | Avoid combo indexing |
| Preview | no | — | no-store |

---

## ProjectSeo

```ts
interface ProjectSeo {
  title: string;
  description: string;
  canonicalPath: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImage?: ProjectMedia;
  robots: { index: boolean; follow: boolean };
  structuredDataType:
    | "CreativeWork"
    | "SoftwareApplication"
    | "WebApplication"
    | "MobileApplication";
  publishedAt?: string;
  modifiedAt: string;
}
```

Choose structured-data type accurately — do not mark every project `SoftwareApplication`.

Never put `PENDING_*` strings in meta.

---

## Structured data plan

| Type | Where |
| --- | --- |
| Person | Site / profile |
| ProfilePage | `/` |
| WebSite | Root |
| BreadcrumbList | `/work`, `/work/[slug]` |
| CreativeWork / app types | Project pages when accurate |

Must match visible public content. Exclude private client names, private links, invisible metrics, unsupported awards.

---

## Sitemap / robots (future)

- Only published public projects  
- Exclude drafts, private, preview, `/v2` until promotion  
- `lastModified` from reliable `updatedAt`  
- No duplicate canonical project URLs  

Current live behavior (unchanged in S2-PRE): root sitemap only; `/v2` disallowed.
