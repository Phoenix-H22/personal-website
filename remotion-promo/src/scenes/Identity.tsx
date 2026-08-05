import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Monogram } from "../components/Monogram";
import { COLORS } from "../theme";
import { poppins, inter } from "../fonts";
import { fadeIn, rise, useSceneFade } from "../components/useSceneFade";

const Badge: React.FC<{
  frame: number;
  start: number;
  label: string;
  sub: string;
  color?: string;
}> = ({ frame, start, label, sub, color = COLORS.greenBright }) => {
  const o = fadeIn(frame, start, 12);
  const y = rise(frame, start, 18, 16);
  return (
    <div
      style={{
        opacity: o,
        transform: `translateY(${y}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "16px 30px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(140,170,200,0.14)",
        minWidth: 190,
      }}
    >
      <span
        style={{
          fontFamily: poppins,
          fontWeight: 700,
          fontSize: 30,
          color,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: inter,
          fontWeight: 500,
          fontSize: 18,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: COLORS.textMuted,
        }}
      >
        {sub}
      </span>
    </div>
  );
};

export const Identity: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = useSceneFade(durationInFrames, 1, 14);

  // The mark starts centered, then lifts up as the name appears.
  const lift = interpolate(frame, [44, 70], [0, -70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const nameO = fadeIn(frame, 52, 18);
  const nameY = rise(frame, 52, 26, 20);
  const titleO = fadeIn(frame, 66, 18);

  return (
    <AbsoluteFill
      style={{
        opacity,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div style={{ transform: `translateY(${lift}px)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Monogram size={200} drawFrames={40} />
        <div
          style={{
            opacity: nameO,
            transform: `translateY(${nameY}px)`,
            marginTop: 54,
            fontFamily: poppins,
            fontWeight: 700,
            fontSize: 84,
            color: COLORS.text,
            letterSpacing: -1.5,
            textAlign: "center",
          }}
        >
          Abdalrhman Alkady
        </div>
        <div
          style={{
            opacity: titleO,
            marginTop: 14,
            fontFamily: inter,
            fontWeight: 600,
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: COLORS.cyan,
          }}
        >
          Backend-Focused Full-Stack Engineer
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${lift}px)`,
          marginTop: 58,
          display: "flex",
          gap: 22,
        }}
      >
        <Badge frame={frame} start={104} label="TOP RATED" sub="Upwork" color={COLORS.greenBright} />
        <Badge frame={frame} start={120} label="100%" sub="Job Success" color={COLORS.text} />
        <Badge frame={frame} start={136} label="5.0 ★" sub="Rating" color={COLORS.cyan} />
      </div>
    </AbsoluteFill>
  );
};
