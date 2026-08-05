import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

/**
 * Near-black stage with a soft cyan glow that drifts, plus a faint dot grid.
 * Mirrors the reference reel's backdrop.
 */
export const Background: React.FC<{ glow?: number }> = ({ glow = 1 }) => {
  const frame = useCurrentFrame();
  const driftX = Math.sin(frame / 220) * 60;
  const driftY = Math.cos(frame / 260) * 40;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* deep vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 120% at 50% 40%, transparent 40%, ${COLORS.bgDeep} 100%)`,
        }}
      />
      {/* drifting cyan glow, top-left like the reference */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(closest-side, rgba(56,189,248,${
            0.16 * glow
          }), transparent 70%)`,
          width: 900,
          height: 900,
          left: 120 + driftX,
          top: -220 + driftY,
        }}
      />
      {/* faint dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(120,160,200,0.06) 1.1px, transparent 1.2px)",
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(120% 90% at 50% 45%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 45%, black 30%, transparent 85%)",
        }}
      />
    </AbsoluteFill>
  );
};
