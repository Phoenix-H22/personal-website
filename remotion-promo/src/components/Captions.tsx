import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import captions from "../data/captions.json";
import { poppins } from "../fonts";
import { COLORS } from "../theme";

type Word = { w: string; s: number; e: number };
type Chunk = { words: Word[]; s: number; e: number; seg: number };

const CHUNKS = captions.chunks as Chunk[];
const LEAD = captions.lead as number;

// each chunk stays until the next one begins (continuous captions)
const DISPLAY = CHUNKS.map((c, i) => ({
  ...c,
  show: c.s,
  hide: i < CHUNKS.length - 1 ? CHUNKS[i + 1].s : c.e + 0.8,
}));

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps - LEAD; // seconds relative to VO start

  const chunk = DISPLAY.find((c) => t >= c.show && t < c.hide);
  if (!chunk) return null;

  const appear = interpolate(t, [chunk.show, chunk.show + 0.18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(appear, [0, 1], [16, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 74,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          opacity: appear,
          transform: `translateY(${y}px)`,
          maxWidth: 1480,
          padding: "16px 34px",
          borderRadius: 18,
          background: "rgba(6,9,14,0.62)",
          border: "1px solid rgba(120,160,200,0.14)",
          backdropFilter: "blur(6px)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 14px",
          textAlign: "center",
        }}
      >
        {chunk.words.map((word, i) => {
          const active = t >= word.s - 0.02 && t <= word.e + 0.06;
          return (
            <span
              key={i}
              style={{
                fontFamily: poppins,
                fontWeight: 700,
                fontSize: 42,
                lineHeight: 1.15,
                letterSpacing: -0.3,
                color: active ? COLORS.cyanBright : "#eef4fb",
                textShadow: active
                  ? "0 0 18px rgba(103,232,249,0.55)"
                  : "0 2px 10px rgba(0,0,0,0.6)",
                transition: "color 0.1s",
              }}
            >
              {word.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};
