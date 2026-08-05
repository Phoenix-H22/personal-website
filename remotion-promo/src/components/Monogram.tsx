import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Animated "A" monogram for Abdalrhman — same rounded-stroke, cyan-gradient
 * language as the reference "M" mark. Draws itself on, then holds.
 */
export const Monogram: React.FC<{
  size?: number;
  animate?: boolean;
  drawFrames?: number;
  gradId?: string;
}> = ({ size = 190, animate = true, drawFrames = 42, gradId = "mono" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const caretLen = 150; // approx length of the ^ path

  const caretDraw = animate
    ? interpolate(frame, [4, 4 + drawFrames], [caretLen, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;
  // crossbar reveals by scaling out from its centre once the caret is mostly drawn
  const barScale = animate
    ? interpolate(frame, [4 + drawFrames * 0.6, 4 + drawFrames + 4], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: (t) => 1 - Math.pow(1 - t, 3),
      })
    : 1;

  const pop = animate
    ? spring({ frame, fps, config: { damping: 14, mass: 0.8 }, durationInFrames: 30 })
    : 1;
  const scale = animate ? interpolate(pop, [0, 1], [0.86, 1]) : 1;
  const glow = animate
    ? interpolate(frame, [4, 40], [0, 1], { extrapolateRight: "clamp" })
    : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        transform: `scale(${scale})`,
        filter: `drop-shadow(0 0 ${14 * glow}px rgba(56,189,248,${0.55 * glow}))`,
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="12"
          x2="0"
          y2="90"
        >
          <stop offset="0%" stopColor="#a9edff" />
          <stop offset="45%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0b8fd6" />
        </linearGradient>
      </defs>
      {/* the ^ caret forming the A */}
      <path
        d="M23 85 L50 16 L77 85"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={9.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={caretLen}
        strokeDashoffset={caretDraw}
      />
      {/* crossbar — scales out from centre */}
      <g transform={`translate(50 60) scale(${barScale} 1) translate(-50 -60)`}>
        <path
          d="M34.5 60 L65.5 60"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={9.2}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
