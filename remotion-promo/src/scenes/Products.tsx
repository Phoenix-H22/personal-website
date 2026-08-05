import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { Label } from "../components/UI";
import { fadeIn, useSceneFade } from "../components/useSceneFade";
import { poppins, inter } from "../fonts";
import { COLORS } from "../theme";

const PRODUCTS = [
  {
    src: staticFile("assets/covers/warqah.webp"),
    name: "Warqah Store",
    tag: "Arabic e-commerce platform",
    at: 34,
  },
  {
    src: staticFile("assets/covers/autopay.webp"),
    name: "Autopay EG",
    tag: "Automotive payments & operations",
    at: 200,
  },
];

const Card: React.FC<{
  frame: number;
  p: (typeof PRODUCTS)[number];
}> = ({ frame, p }) => {
  const o = fadeIn(frame, p.at, 16);
  const y = interpolate(frame, [p.at, p.at + 24], [46, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const scale = interpolate(frame, [p.at, p.at + 26], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  return (
    <div
      style={{
        opacity: o,
        transform: `translateY(${y}px) scale(${scale})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <BrowserFrame
        src={p.src}
        title={p.name.toLowerCase().replace(/\s+/g, "") + ".app"}
        width={780}
        height={462}
        objectPosition="top center"
      />
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: poppins,
            fontWeight: 700,
            fontSize: 34,
            color: COLORS.text,
          }}
        >
          {p.name}
        </div>
        <div
          style={{
            fontFamily: inter,
            fontWeight: 500,
            fontSize: 21,
            color: COLORS.textDim,
            marginTop: 4,
          }}
        >
          {p.tag}
        </div>
      </div>
    </div>
  );
};

export const Products: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const opacity = useSceneFade(durationInFrames, 12, 14);
  return (
    <AbsoluteFill
      style={{
        opacity,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 46,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Label>Products I shipped</Label>
        <div
          style={{
            opacity: fadeIn(frame, 8, 16),
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: inter,
            fontWeight: 500,
            fontSize: 24,
            color: COLORS.textDim,
          }}
        >
          <span>
            <b style={{ color: COLORS.text, fontWeight: 700 }}>2</b> featured
          </span>
          <span style={{ color: COLORS.textMuted }}>•</span>
          <span>
            <b style={{ color: COLORS.cyan, fontWeight: 700 }}>13+</b> shipped to the world
          </span>
          <span style={{ color: COLORS.textMuted }}>•</span>
          <span>more still private</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 70, alignItems: "flex-start" }}>
        {PRODUCTS.map((p) => (
          <Card key={p.name} frame={frame} p={p} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
