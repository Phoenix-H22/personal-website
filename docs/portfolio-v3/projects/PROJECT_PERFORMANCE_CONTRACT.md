# Project Performance Contract — S2-PRE

Targets are directional budgets for S2A–S8 — not permanent Lighthouse promises.

---

## Constraints

- Server Components by default  
- Project data fetched on the server via repository  
- Client components only for interaction islands  
- Stable media width/height · responsive `sizes`  
- No full galleries on Systems Atlas  
- No autoplay heavy video · no WebGL by default  
- No large client-side project payload  
- Route-level code splitting  
- Pause off-screen animation  
- Reduced-motion support  
- No reCAPTCHA on initial portfolio paint (contact stage only)  
- No oversized filter libraries  

---

## Suggested budgets

| Budget | Guidance |
| --- | --- |
| Route JS (Selected Systems island) | ≤ ~80–120KB gzipped incremental beyond baseline |
| LCP media | ≤ ~200KB compressed; known dimensions |
| Total initial above-fold media | ≤ ~400–500KB |
| CLS | ≈ 0 for reserved media boxes |
| INP | Keep filter/search interactions snappy; debounce search |
| Fonts | Existing site fonts; no extra family for projects without need |

---

## Caching

See API contract tags: `portfolio-projects`, `portfolio-featured-projects`, `portfolio-project:{slug}`, `portfolio-filter-options`.

Stale-if-error preferred for public index endpoints.
