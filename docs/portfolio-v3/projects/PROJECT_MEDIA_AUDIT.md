# Project Media Audit — S2-PRE

Status: **S2-PRE**  
Registry: `src/content/portfolio-assets.ts`  
Do not invent screenshots or fake dashboards.

---

## Media domain (target)

```ts
interface ProjectMedia {
  id: string;
  type: "image" | "video" | "diagram" | "logo";
  role?: "cover" | "gallery" | "diagram" | "logo" | "og";
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  credit?: string;
  blurDataURL?: string;
  focalPoint?: { x: number; y: number };
  variants?: { src: string; width: number; type?: string }[];
  sortOrder?: number;
  darkThemeSuitable?: boolean;
  mobileCrop?: "center" | "top" | "focal";
}
```

Layout-critical media must include width/height.

---

## Disk inventory (`public/images`)

| Path | Dim | Bytes | Class | Project link | Notes |
| --- | --- | ---: | --- | --- | --- |
| `upwork.png` | 512×141 | 13KB | ready | Hero credential | Keep |
| `nabd-logo-new.png` | 1024×1024 | 1.3MB | usable with editing | NABD logo | Optimize weight |
| `LogoAPpICon2.png` | 512×512 | 95KB | ready | Obour logo | Deferred project |
| `smartvending.jpg` | 513×559 | 38KB | usable with editing | Smart Vending candidate photo | **Not** in registry; confirm rights before use |
| `autopay-logo.png` | 990×990 | 336KB | logo only / unclear | Unmapped | Do not invent Autopay↔project link |
| `companies/mohssilh.png` | 86×126 | 5KB | logo only | Merchant Ops employer | Career + Flagship context |
| `companies/*` | various | small | logo only | Experience | Not project covers |
| `education/*` | large | large | ready | Origin / credential | Not Selected Systems covers |
| `smartlockers.jpg` | — | — | **missing** | Registry `mqttDoorLockers` | Broken reference — remove or restore |
| `companies/kayanac.webp` | 265×95 | 4KB | logo only | Duplicate of png | Prefer single path (png wired) |

---

## Per Selected Systems media readiness

| Project | Cover | Logo | Gallery | Diagram | Verdict |
| --- | --- | --- | --- | --- | --- |
| Merchant Ops | missing | Mohssilh company mark | missing | **node seed in content** | S2A: art-directed diagram from verified nodes OK |
| NABD | missing | ready (optimize) | missing | missing | Logo + channel motif sufficient for supporting card |
| Smart Vending | missing | missing | candidate jpg | missing | Silhouette / scan-pay-release motif; confirm jpg |
| Virtual Clinic | missing | missing | missing | missing | Abstract clinic-flow motif; no fake UI |

Missing final screenshots **do not block S2A** when honest art-directed diagrams are used and labelled as schematic.

---

## Classification keys

- **ready** — safe to use as-is  
- **usable with editing** — crop/compress/confirm  
- **case-study only** — too detailed for homepage  
- **logo only** — not a cover  
- **insufficient** — poor quality  
- **missing** — needed later  
- **private / unsafe** — do not publish  

---

## Rules

- No remote images without known dimensions in LCP slots  
- Screenshots require sensitive-info review  
- Architecture diagrams must derive from verified structure  
- Components consume registry / media DTOs — never hardcode new paths in UI  
