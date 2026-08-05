import { interpolate, useCurrentFrame } from "remotion";

/** Fade a scene's content in at the start and out just before it ends. */
export function useSceneFade(durationInFrames: number, inF = 12, outF = 12) {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [0, inF, durationInFrames - outF, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}

/** Ease-out rise: returns a translateY px value that settles to 0. */
export function rise(frame: number, start: number, dist = 24, dur = 20) {
  return interpolate(frame, [start, start + dur], [dist, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
}

export function fadeIn(frame: number, start: number, dur = 16) {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}
