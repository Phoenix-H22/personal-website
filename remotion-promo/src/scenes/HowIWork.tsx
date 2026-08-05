import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fadeIn, rise, useSceneFade } from "../components/useSceneFade";
import { mono } from "../fonts";
import { COLORS } from "../theme";

const PROMPT = "alkady --own-it --end-to-end";
const LINES = [
  "Architecture, integrations & system design",
  "Clean code — typed, tested, maintainable",
  "APIs, queues & webhooks — reliable by design",
  "Deployment — Docker · Linux · CI/CD",
  "Clear communication at every step",
];

export const HowIWork: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = useSceneFade(durationInFrames, 12, 16);

  // card entrance
  const cardO = fadeIn(frame, 0, 16);
  const cardY = rise(frame, 0, 40, 22);
  const cardScale = interpolate(frame, [0, 22], [0.96, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // typewriter for the prompt
  const typeStart = 18;
  const typed = Math.max(
    0,
    Math.min(PROMPT.length, Math.floor((frame - typeStart) * 0.95))
  );
  const promptText = PROMPT.slice(0, typed);
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  const LINE_START = 58;
  const LINE_STEP = 34;

  return (
    <AbsoluteFill
      style={{ opacity, alignItems: "center", justifyContent: "center" }}
    >
      <div
        style={{
          opacity: cardO,
          transform: `translateY(${cardY}px) scale(${cardScale})`,
          width: 1120,
          borderRadius: 18,
          background: "#080d14",
          border: "1px solid rgba(140,170,200,0.16)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        {/* title bar */}
        <div
          style={{
            height: 52,
            display: "flex",
            alignItems: "center",
            gap: 9,
            paddingLeft: 20,
            borderBottom: "1px solid rgba(140,170,200,0.10)",
            background: "#0b1119",
          }}
        >
          <span style={dot("#ff5f57")} />
          <span style={dot("#febc2e")} />
          <span style={dot("#28c840")} />
          <span
            style={{
              fontFamily: mono,
              color: COLORS.textMuted,
              fontSize: 20,
              marginLeft: 16,
            }}
          >
            alkady@upwork ~ how-i-work
          </span>
        </div>

        {/* body */}
        <div style={{ padding: "34px 40px 40px", fontFamily: mono }}>
          <div style={{ fontSize: 28, color: "#9fb4c6", marginBottom: 26 }}>
            <span style={{ color: COLORS.cyan }}>→ </span>
            <span style={{ color: COLORS.text }}>{promptText}</span>
            <span
              style={{
                opacity: cursorOn ? 1 : 0,
                color: COLORS.cyan,
                marginLeft: 2,
              }}
            >
              ▋
            </span>
          </div>

          {LINES.map((line, i) => {
            const at = LINE_START + i * LINE_STEP;
            const o = fadeIn(frame, at, 12);
            const x = interpolate(frame, [at, at + 16], [-14, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: (t) => 1 - Math.pow(1 - t, 3),
            });
            return (
              <div
                key={line}
                style={{
                  opacity: o,
                  transform: `translateX(${x}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  fontSize: 27,
                  color: "#c6d4e0",
                  marginBottom: 18,
                }}
              >
                <span style={{ color: COLORS.greenBright, fontWeight: 700 }}>✓</span>
                <span>{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const dot = (c: string): React.CSSProperties => ({
  width: 13,
  height: 13,
  borderRadius: 999,
  background: c,
  display: "inline-block",
});
