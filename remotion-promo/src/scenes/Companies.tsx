import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Label, LogoChip, Pill } from "../components/UI";
import { fadeIn, rise, useSceneFade } from "../components/useSceneFade";
import { poppins } from "../fonts";
import { COLORS } from "../theme";

const LOGOS = [
  "eraasoft",
  "kayanac",
  "theqah",
  "tjar",
  "klliq",
  "marqity",
  "maryzad",
  "mohssilh",
  "phoenix-techs",
].map((n) => staticFile(`assets/logos/norm/${n}.png`));

const STACK = [
  "Laravel & PHP",
  "Node.js",
  "PostgreSQL · MySQL",
  "Redis",
  "APIs & Webhooks",
  "Docker · Linux",
  "Flutter",
  "System Architecture",
];

export const Companies: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = useSceneFade(durationInFrames, 12, 14);

  // Second half: logos lift & dim, stack pills come in.
  const STACK_AT = 168;
  const logosShift = interpolate(frame, [STACK_AT, STACK_AT + 24], [0, -70], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const logosDim = interpolate(frame, [STACK_AT, STACK_AT + 24], [1, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelSwap = interpolate(frame, [STACK_AT - 6, STACK_AT + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        opacity,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <div style={{ position: "relative", height: 40 }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - labelSwap, whiteSpace: "nowrap", transform: "translateX(-50%)", left: "50%" }}>
          <Label>Built software for clients</Label>
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: labelSwap, whiteSpace: "nowrap", transform: "translateX(-50%)", left: "50%" }}>
          <Label>The stack I specialize in</Label>
        </div>
      </div>

      {/* Client logo wall */}
      <div
        style={{
          transform: `translateY(${logosShift}px)`,
          opacity: logosDim,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 22,
          maxWidth: 810,
        }}
      >
        {LOGOS.map((src, i) => {
          const o = fadeIn(frame, 20 + i * 7, 12);
          const y = rise(frame, 20 + i * 7, 24, 16);
          return (
            <div key={src} style={{ opacity: o, transform: `translateY(${y}px)` }}>
              <LogoChip src={src} size={128} />
            </div>
          );
        })}
      </div>

      {/* Tech stack pills (second half) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
          maxWidth: 1120,
          marginTop: 6,
        }}
      >
        {STACK.map((s, i) => {
          const o = fadeIn(frame, STACK_AT + 10 + i * 6, 12);
          const y = rise(frame, STACK_AT + 10 + i * 6, 18, 14);
          return (
            <div key={s} style={{ opacity: o, transform: `translateY(${y}px)` }}>
              <Pill>{s}</Pill>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
