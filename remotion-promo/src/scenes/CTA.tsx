import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrowserFrame } from "../components/BrowserFrame";
import { Monogram } from "../components/Monogram";
import { fadeIn, rise, useSceneFade } from "../components/useSceneFade";
import { poppins, inter, mono } from "../fonts";
import { COLORS } from "../theme";

const upwork = staticFile("assets/logos/upwork.png");

const THUMBS = [
  { src: staticFile("assets/covers/smartlockers.webp"), label: "Platforms", rot: -6, dy: 20 },
  { src: staticFile("assets/covers/nabd.webp"), label: "Automation", rot: 0, dy: 0 },
  { src: staticFile("assets/covers/obour.webp"), label: "Mobile Apps", rot: 6, dy: 20 },
];

export const CTA: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = useSceneFade(durationInFrames, 12, 18);

  const btnPop = spring({ frame: frame - 58, fps, config: { damping: 12 }, durationInFrames: 26 });
  const btnScale = interpolate(btnPop, [0, 1], [0.8, 1]);

  const headO = fadeIn(frame, 92, 20);
  const headY = rise(frame, 92, 30, 22);

  return (
    <AbsoluteFill
      style={{
        opacity,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        paddingBottom: 120, // lift content so the caption band stays clear
      }}
    >
      <div style={{ opacity: fadeIn(frame, 0, 16) }}>
        <Monogram size={92} animate={false} gradId="ctaMono" />
      </div>

      {/* work thumbnails fan */}
      <div style={{ display: "flex", gap: 40, alignItems: "center", marginTop: 6 }}>
        {THUMBS.map((t, i) => {
          const at = 10 + i * 12;
          const o = fadeIn(frame, at, 14);
          const y = rise(frame, at, 40, 18) + t.dy;
          return (
            <div
              key={t.label}
              style={{
                opacity: o,
                transform: `translateY(${y}px) rotate(${t.rot}deg)`,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -18,
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 2,
                  padding: "7px 20px",
                  borderRadius: 999,
                  background: "rgba(10,16,24,0.92)",
                  border: "1px solid rgba(56,189,248,0.5)",
                  color: COLORS.cyanBright,
                  fontFamily: inter,
                  fontWeight: 600,
                  fontSize: 18,
                  whiteSpace: "nowrap",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                }}
              >
                {t.label}
              </div>
              <BrowserFrame src={t.src} width={396} height={244} radius={14} />
            </div>
          );
        })}
      </div>

      {/* Upwork CTA button */}
      <div
        style={{
          transform: `scale(${btnScale})`,
          marginTop: 26,
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "20px 46px",
          borderRadius: 999,
          background: "linear-gradient(180deg,#1bb60a,#128a00)",
          boxShadow: "0 18px 46px rgba(20,168,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
        }}
      >
        <span
          style={{
            fontFamily: poppins,
            fontWeight: 700,
            fontSize: 32,
            color: "#ffffff",
          }}
        >
          Message me on
        </span>
        <Img src={upwork} style={{ height: 30, marginTop: 4 }} />
      </div>

      <div
        style={{
          fontFamily: mono,
          fontSize: 22,
          color: COLORS.textDim,
          opacity: fadeIn(frame, 70, 16),
          letterSpacing: 0.4,
        }}
      >
        upwork.com/freelancers/alkady22h
      </div>

      {/* credibility line */}
      <div
        style={{
          opacity: fadeIn(frame, 82, 16),
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: inter,
          fontWeight: 600,
          fontSize: 22,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <span style={{ color: COLORS.greenBright }}>TOP RATED</span>
        <Sep />
        <span style={{ color: COLORS.text }}>100% Job Success</span>
        <Sep />
        <span style={{ color: COLORS.text }}>5.0 ★</span>
        <Sep />
        <span style={{ color: COLORS.cyan }}>Available now</span>
      </div>

      {/* headline */}
      <div
        style={{
          opacity: headO,
          transform: `translateY(${headY}px)`,
          fontFamily: poppins,
          fontWeight: 800,
          fontSize: 68,
          color: COLORS.text,
          letterSpacing: -1,
          marginTop: 8,
        }}
      >
        Let&rsquo;s build something{" "}
        <span
          style={{
            background: "linear-gradient(180deg,#8be9ff,#0ea5e9)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          great
        </span>{" "}
        together.
      </div>
    </AbsoluteFill>
  );
};

const Sep = () => (
  <span style={{ color: COLORS.textMuted, fontSize: 16 }}>•</span>
);
