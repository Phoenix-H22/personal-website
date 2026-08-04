# READ THIS FILE BEFORE MODIFYING HERO V2

> [!IMPORTANT]
> This document describes a protected production UI contract.
> Source code remains authoritative. If this document conflicts with current
> source, stop and reconcile the discrepancy before editing.

Last verified against `hero-v2-responsive-rebuild` at
`9f8b06719793a20b79d3795606543e7a231cd4d5`.

This protocol applies to every human, future AI agent, and automation agent that
may change Hero V2 at `http://127.0.0.1:3010/v2`.

## Mandatory reading order

Read these documents before opening an editor:

1. [`HERO_V2_ENGINEERING_CONTRACT.md`](./HERO_V2_ENGINEERING_CONTRACT.md)
2. [`HERO_V2_RESPONSIVE_GEOMETRY.md`](./HERO_V2_RESPONSIVE_GEOMETRY.md)
3. [`HERO_V2_MOTION_AND_SIGNAL_CONTRACT.md`](./HERO_V2_MOTION_AND_SIGNAL_CONTRACT.md)
4. [`HERO_V2_AI_CHANGE_PROTOCOL.md`](./HERO_V2_AI_CHANGE_PROTOCOL.md)
5. [`HERO_V2_REGRESSION_PLAYBOOK.md`](./HERO_V2_REGRESSION_PLAYBOOK.md)

Then read current source. Previous chat summaries, screenshots, and historical
QA reports are context, not authority.

## Required skills

Load and apply these workflow skills when available:

- `frontend-ui-engineering`
- `web-design-system`
- `responsive-ui-qa`
- `landing-page-craft`
- `clean-code-guard`
- `test-guard`

For documentation changes, also apply the repository's documentation guard if
available.

## No-edit-before-evidence rule

> [!WARNING]
> Do not modify a Hero V2 production file until the current failure is
> reproduced with explicit viewport and computed measurements.

Do not edit:

- from a screenshot alone;
- from perceived visual imbalance alone;
- before measuring rendered geometry and computed styles;
- after inferring viewport size from the visible Playwright host window;
- from a previous conversation summary instead of current source;
- to compensate for gray host-window area or browser chrome;
- as part of unrelated cleanup, renaming, modernization, or refactoring;
- because a different architecture appears more elegant;
- before checking whether another contributor already changed the worktree.

Evidence must identify a failing invariant and the exact declaration or source
contract responsible for it.

## Required workflow

### 1. Establish repository state

Run and record:

```powershell
git status --short --branch
git diff
git diff --cached
git ls-files --others --exclude-standard
```

Preserve unrelated modifications. Do not normalize line endings or rewrite a
dirty file wholesale.

### 2. Read current contracts and source

Read all five Hero V2 documents and, at minimum:

```text
src/components/portfolio/hero/adaptive-engineer-hero.tsx
src/components/portfolio/hero/adaptive-hero-nav.tsx
src/components/portfolio/hero/adaptive-orbit-geometry.ts
src/components/portfolio/hero/adaptive-signal-route.tsx
src/components/portfolio/hero/adaptive-stack-lens.tsx
src/components/portfolio/hero/use-project-auto-rotation.ts
src/styles/portfolio/adaptive-engineer-hero.module.scss
src/lib/portfolio/adaptive-hero.ts
src/lib/portfolio/adaptive-stack-lens.ts
src/lib/portfolio/projects/selectors.ts
src/lib/motion-preference.ts
src/lib/motion-preference-context.tsx
```

Read callers and tests only as needed to understand current ownership. If a
test, comment, or document conflicts with production source, stop and report
the discrepancy rather than silently choosing historical behavior.

### 3. Own one development server

Use one authoritative server and URL:

```powershell
npm run dev -- -H 127.0.0.1 -p 3010
```

```text
http://127.0.0.1:3010/v2
```

Before killing or replacing a listener:

1. identify the PID listening on port `3010`;
2. inspect that process and its parent command line;
3. confirm it runs from `D:\GitHub\personal-website`;
4. reuse it when healthy;
5. stop only that repository-owned process when replacement is necessary.

Never kill all Node processes. Other repositories and tools may use them.

### 4. Verify the Playwright page viewport

Explicitly call `page.setViewportSize()` for each target. Verify
`innerWidth`, `innerHeight`, document client dimensions, visual viewport, scale,
Hero existence, orbit existence, and matched media queries.

The visible Playwright/MCP host window is not the CSS viewport. See
[`HERO_V2_RESPONSIVE_GEOMETRY.md`](./HERO_V2_RESPONSIVE_GEOMETRY.md).

### 5. Capture pre-edit evidence

Use the official viewport matrix. For the reported case and adjacent
breakpoints, record:

- requested and runtime viewport dimensions;
- matched mobile/tablet/desktop/wide/short-height queries;
- composition columns and gap;
- lens, orbit, card, marker, label, and frame rectangles;
- active orbit/card/block limiter;
- computed responsive tokens;
- route strings and path identity;
- connector, label, marker, and card clearances;
- computed track/progress/head core, opacity, cap, filter, and shadow;
- animation count, duration, frontier, and motion state;
- horizontal overflow.

Use all four active projects when card height or route direction matters.

### 6. Produce a pre-edit regression table

Before editing, report measurements by viewport. Separate facts from visual
judgment. State which axis limits the orbit and which declaration causes the
failure.

### 7. Identify the owning layer

| Evidence points to | Preferred owner |
| --- | --- |
| Spacing, density, sizing, halo, responsive presentation | SCSS only |
| Wrong generated route topology or semantic clearance | `adaptive-orbit-geometry.ts` |
| Different track/progress/head `d` values | `adaptive-signal-route.tsx` plus geometry source |
| Selection, preview, revision, markup, accessibility | `adaptive-stack-lens.tsx` |
| Pause, resume, timer, visibility, cooldown | `use-project-auto-rotation.ts` |
| Effective Full/Reduced policy | motion-preference source and context |

Most visual corrections must remain SCSS-only. React or geometry changes
require evidence that CSS cannot preserve the current contract.

### 8. Make the smallest coherent change

- keep one geometry source;
- preserve generated paths and state ownership;
- prefer container-aware CSS and semantic tokens;
- avoid viewport-specific corrections;
- do not add backward compatibility without a current consumer;
- do not touch content, navigation, or unrelated styles;
- do not rewrite files to match personal formatting preferences.

### 9. Repeat identical measurements

Run the same script, project states, viewport order, motion state, and route
states used before editing. Add immediate widths around any changed breakpoint.
Compare before and after values directly.

### 10. Verify protected behavior

At minimum, verify:

- all four generated routes;
- frame/track/progress/head path identity;
- marker, label, connector, and card clearances;
- desktop continuity and no overflow;
- tablet intrinsic card/selector ownership;
- mobile equal spacing and reverse `04 -> 01` wrap;
- track/progress core equality and restrained head/halo;
- 6000ms route timing and 94% arrival;
- frontier equality at 20%, 50%, and 80%;
- stable-key HOLD freeze and resume continuation;
- hover/focus preview route replacement and restoration as a separate remount
  scenario;
- Full, OS Reduced plus stored Full, and explicit Reduced states.

### 11. Run task-allowed checks

For a production Hero change, the default static set is:

```powershell
git diff --check
npm run typecheck
npm run lint
```

Run tests or build only when the task explicitly requires them. Never weaken or
edit tests to make unrelated generated output pass.

For documentation-only work, follow the documentation task's validation scope;
run `git diff --check` plus Git-state inspection. Because ordinary `git diff`
does not include untracked files, also inspect new untracked Markdown directly
for trailing whitespace or use this Git-for-Windows form without staging it:

```powershell
git diff --no-index --check -- /dev/null <untracked-markdown-file>
```

An untracked non-empty file produces difference exit status `1`; treat emitted
whitespace diagnostics as failure, not the difference status by itself.

### 12. Report final Git state

Run again:

```powershell
git status --short --branch
git diff --stat
git diff --cached
git ls-files --others --exclude-standard
```

Report unrelated changes separately. Confirm whether anything is staged or
untracked.

## Allowed source scope

| File | Edit only when |
| --- | --- |
| `src/components/portfolio/hero/adaptive-orbit-geometry.ts` | Typed geometry or semantic route clearance is proven wrong. This is the only desktop route-generation source. |
| `src/components/portfolio/hero/adaptive-signal-route.tsx` | Active route rendering, shared `d`, or route metadata projection is proven wrong. |
| `src/components/portfolio/hero/adaptive-stack-lens.tsx` | Selection, preview, keyboard, marker/card markup, revision, or accessibility ownership is proven wrong. |
| `src/components/portfolio/hero/use-project-auto-rotation.ts` | Rotation eligibility, clock remainder, cooldown, visibility, or pause semantics is proven wrong. |
| `src/styles/portfolio/adaptive-engineer-hero.module.scss` | Visual hierarchy, responsive presentation, sizing, spacing, or animation CSS needs correction. This is the default visual-change scope. |
| `src/lib/motion-preference.ts` | Stored/effective motion policy is explicitly being changed. |
| `src/lib/motion-preference-context.tsx` | React subscription or effective-motion publication is explicitly being changed. |

Do not edit `globals.css`, package/config files, content, tests, unrelated motion
hooks, or QA scripts unless the user explicitly expands scope and evidence
requires it.

## Git safety

Required behavior:

- preserve unrelated user/agent work;
- stage only when explicitly requested;
- inspect every untracked file before claiming ownership;
- retain repository line endings;
- leave approved production work intact;
- use non-interactive Git commands.

Forbidden behavior:

- `git reset --hard`;
- checking out or restoring unrelated files;
- automatic cleanup of a dirty worktree;
- staging unrelated files;
- deleting untracked files without proving they were created by this task;
- line-ending normalization;
- commit or amend without explicit request;
- push or force-push without explicit request;
- rollback of approved work;
- suppressing hooks or validation.

## Forbidden implementation shortcuts

Do not introduce production geometry based on DOM rectangles, `ResizeObserver`,
viewport listeners, DPR, screen inches, OS scale, browser detection, or
Playwright state. Do not duplicate route paths, patch individual markers, or
give frame/progress/head independent formulas.

## Required final response structure

Every future Hero V2 production change must report:

1. Root cause and exact responsible declarations.
2. Files changed and why each file was necessary.
3. Before/after measurements.
4. Explicit viewports and runtime dimensions tested.
5. Path strings and frame/track/progress/head identity.
6. Animation duration, arrival, frontier, HOLD, and transition verification.
7. Full and Reduced motion verification.
8. Desktop, tablet, and mobile verification.
9. Static-check results.
10. Final Git status, staged files, and untracked files.
11. Anything not tested and residual risk.

Do not claim visual approval. Only the owner can approve the result.

## Verification status

- Branch: `hero-v2-responsive-rebuild`
- Commit: `9f8b06719793a20b79d3795606543e7a231cd4d5`
- Verified files: `package.json`, `src/components/portfolio/portfolio-v2-page.tsx`, `src/components/portfolio/hero/adaptive-engineer-hero.tsx`, `src/components/portfolio/hero/adaptive-hero-nav.tsx`, `src/components/portfolio/hero/adaptive-orbit-geometry.ts`, `src/components/portfolio/hero/adaptive-signal-route.tsx`, `src/components/portfolio/hero/adaptive-stack-lens.tsx`, `src/components/portfolio/hero/use-project-auto-rotation.ts`, `src/styles/portfolio/adaptive-engineer-hero.module.scss`, `src/lib/portfolio/adaptive-hero.ts`, `src/lib/portfolio/adaptive-stack-lens.ts`, `src/lib/portfolio/projects/selectors.ts`, `src/lib/motion-preference.ts`, `src/lib/motion-preference-context.tsx`
- Verification date: `2026-08-04`
- Documentation-only change: Yes
