import React from "react";
import { Img } from "remotion";
import { COLORS } from "../theme";

/** A mock browser/app window used for product screenshots. */
export const BrowserFrame: React.FC<{
  src?: string;
  title?: string;
  width: number;
  height: number;
  radius?: number;
  chromeColor?: string;
  children?: React.ReactNode;
  objectPosition?: string;
}> = ({
  src,
  title,
  width,
  height,
  radius = 16,
  chromeColor = "#0e141d",
  children,
  objectPosition = "top center",
}) => {
  const barH = Math.max(28, Math.round(height * 0.075));
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: chromeColor,
        border: "1px solid rgba(140,170,200,0.16)",
        boxShadow:
          "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: barH,
          background: chromeColor,
          display: "flex",
          alignItems: "center",
          paddingLeft: 14,
          gap: 8,
          borderBottom: "1px solid rgba(140,170,200,0.10)",
          flexShrink: 0,
        }}
      >
        <Dot color="#ff5f57" s={barH} />
        <Dot color="#febc2e" s={barH} />
        <Dot color="#28c840" s={barH} />
        {title ? (
          <span
            style={{
              color: COLORS.textMuted,
              fontSize: barH * 0.42,
              marginLeft: 14,
              letterSpacing: 0.3,
            }}
          >
            {title}
          </span>
        ) : null}
      </div>
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        {src ? (
          <Img
            src={src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition,
              display: "block",
            }}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

const Dot: React.FC<{ color: string; s: number }> = ({ color, s }) => (
  <span
    style={{
      width: Math.max(7, s * 0.28),
      height: Math.max(7, s * 0.28),
      borderRadius: 999,
      background: color,
      display: "inline-block",
    }}
  />
);
