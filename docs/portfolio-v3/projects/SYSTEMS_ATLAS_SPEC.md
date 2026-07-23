# Systems Atlas Spec — `/work` — S2-PRE

Working name: **Systems Atlas**  
Purpose: complete discovery for recruiters and technical leads.

---

## Route strategy (recommended)

**Option B during development:** `/v2/work` and `/v2/work/[slug]`  
**Promote to** `/work` and `/work/[slug]` at final V2→Current promotion (S8).

Why:
- Keeps frozen Current `/` free of unfinished discovery routes  
- Matches version isolation already in place  
- Repository / UI stay route-agnostic via config base path  
- Avoids indexing half-built `/work`

Option A (public `/work` + noindex) is acceptable only if early shared URLs are required; still noindex until promotion.

SEO isolation: development work routes remain noindex like `/v2`.

---

## Page content

1. Opening statement (Systems in Production framing)  
2. Published project count  
3. Featured / Flagship highlight  
4. Search  
5. Justified filters  
6. Project results  
7. Reset + empty states  
8. Direct case-study links  
9. Optional progressive “Surprise me” (enhancement only — not the primary browse UX)

Do not hide browsing inside a command palette.

---

## Filters (inventory-justified)

| Filter | Values (initial) | Query param |
| --- | --- | --- |
| Domain | commerce, messaging, iot, ai, mobile, integrations | `domain` |
| Role | backend, platform, integrations, full-stack | `role` |
| Platform | web, api, mobile, device, messaging | `platform` |
| Technology | laravel, redis, mysql, mqtt, flutter, … (from published set) | `technology` |
| Status | live, maintained, completed, archived | `status` |

URL example: `/v2/work?domain=commerce&technology=laravel`

Rules:
- Multiple values: repeat params (`domain=a&domain=b`) → OR within key  
- Across keys → AND  
- Reset clears query  
- Empty state explains filters + clear action  
- Result count announced accessibly  
- Server filtering primary; client enhances without owning source of truth  
- Back/forward restores query  
- **Do not** index arbitrary filter combinations — canonical `/work` (or `/v2/work` while experimental)

Until ≥8 published projects, UI may ship search + light domain chips only.

---

## Search

Fields: title, summary, domain, ownership, technologies (public only).  
Server-side; normalize case/whitespace.  
Debounce client input ~200–300ms when enhancing.  
Announce result count updates without chatty spam.  
Sync `q` to URL.

---

## Project entry (preview)

Must show:
- Title · short summary · domain · role/ownership · strongest safe proof · status · key technologies · media · case-study availability  

Must not become a mini dossier.

Visual themes may vary; information hierarchy stays predictable.
