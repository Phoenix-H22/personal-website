import React from "react";
import { Img } from "remotion";
import { COLORS } from "../theme";
import { inter } from "../fonts";

/** Small tracked-out uppercase cyan section label. */
export const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontFamily: inter,
      fontWeight: 600,
      fontSize: 20,
      letterSpacing: 6,
      textTransform: "uppercase",
      color: COLORS.cyan,
      opacity: 0.85,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Rounded tile holding a normalized company/client logo (bg baked in). */
export const LogoChip: React.FC<{
  src: string;
  size?: number;
}> = ({ src, size = 108 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 20,
      overflow: "hidden",
      boxShadow:
        "0 14px 34px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)",
    }}
  >
    <Img
      src={src}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  </div>
);

/** Tech-stack pill. */
export const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      fontFamily: inter,
      fontWeight: 500,
      fontSize: 26,
      color: "#cfe8f6",
      padding: "12px 26px",
      borderRadius: 999,
      background: "rgba(56,189,248,0.08)",
      border: "1px solid rgba(56,189,248,0.28)",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);
