// All scene boundaries are derived from the AI voiceover cue timings
// (edge-tts WordBoundary events), with a 1.2s logo-reveal intro and a ~2.6s outro.
export const FPS = 30;
export const DURATION = 1664; // 55.47s @ 30fps

// The master track has the VO offset internally: speech starts at 1.2s.
export const AUDIO_LEAD = 1.2;

// [from, durationInFrames] for each scene
export const SCENES = {
  identity: { from: 0, duration: 311 }, // 0.00 – 10.37s
  companies: { from: 311, duration: 339 }, // 10.37 – 21.67s
  products: { from: 650, duration: 401 }, // 21.67 – 35.03s
  howIWork: { from: 1051, duration: 369 }, // 35.03 – 47.33s
  cta: { from: 1420, duration: 244 }, // 47.33 – 55.47s
} as const;
