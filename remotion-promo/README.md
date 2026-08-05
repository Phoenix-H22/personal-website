# Abdalrhman Alkady — Animated Portfolio Reel (Remotion)

A ~50s promo video (1920×1080, 30fps) recreating a personal‑brand reel with an
AI‑generated voiceover + music bed. Built with [Remotion](https://remotion.dev).

## Structure

| Scene | File | Voiceover cue |
|---|---|---|
| Identity + Upwork badges | `src/scenes/Identity.tsx` | 0–9s |
| Clients + tech stack | `src/scenes/Companies.tsx` | 9–20s |
| Products (Warqah, Autopay) | `src/scenes/Products.tsx` | 20–29s |
| How I work (terminal) | `src/scenes/HowIWork.tsx` | 29–41s |
| CTA (Upwork) | `src/scenes/CTA.tsx` | 41–50s |

Scene timings live in `src/timing.ts`. Colors/fonts in `src/theme.ts` /
`src/fonts.ts`. The "A" logo is `src/components/Monogram.tsx`.

Real assets (your covers + client logos) are in `public/assets/`. Client logos
were normalized into uniform tiles under `public/assets/logos/norm/`.

## Preview / edit live

```bash
npm run studio
```

Opens Remotion Studio — scrub the timeline, tweak any scene, hot‑reload.

## Render to MP4

```bash
npm run render        # 4K (3840×2160) — composition is 1080p rendered at --scale=2
npm run render1080    # 1080p (faster, smaller file)
```

Outputs to `out/`. For a vertical 9:16 cut, change `width`/`height` in
`src/Root.tsx` and adjust scene layouts.

## Captions

Synced subtitle captions are driven by `src/data/captions.json` (per-word
timing from edge-tts `WordBoundary` events) and rendered by
`src/components/Captions.tsx`. The spoken audio uses phonetic spellings the TTS
pronounces correctly ("Abdal Rahman", "Waraka Store"); the captions remap those
back to the brand spelling ("Abdalrhman", "Warqah") for on-screen text.

## Regenerating the audio

The voiceover + music are baked into `public/assets/audio/master.mp3`.
The script and generation steps (edge‑tts voice `en-US-AndrewNeural`, plus a
numpy‑synthesized music bed ducked under the voice) are documented in the
project chat. To change the words, re‑generate `master.mp3` and keep it 50s (or
update `DURATION` in `src/timing.ts` to match a new length).

## What to change for a different person

- Name / title / badges → `src/scenes/Identity.tsx`
- Client logos → drop files in `public/assets/logos/`, re‑run the normalizer,
  list them in `src/scenes/Companies.tsx`
- Stack pills → `STACK` array in `src/scenes/Companies.tsx`
- Featured products → `PRODUCTS` in `src/scenes/Products.tsx`
- Work principles → `LINES` in `src/scenes/HowIWork.tsx`
- CTA links / handle → `src/scenes/CTA.tsx`
