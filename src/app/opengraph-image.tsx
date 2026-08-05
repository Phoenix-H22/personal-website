import { ImageResponse } from "next/og";

export const alt =
  "Abdalrhman M. Alkady — Software Engineer. Backend-focused systems across web, mobile, commerce, integrations, and infrastructure.";
export const size = {
  height: 630,
  width: 1200,
};
export const contentType = "image/png";

// Palette mirrors the live V2 hero (adaptive-engineer-hero.module.scss).
const BASE = "#03060b";
const INK = "#f2f6fa";
const ACCENT = "#31e6d0";
const MUTED = "#8fa4ae";
const FAINT = "#55707d";

const DOMAINS = [
  "Web",
  "Mobile",
  "Commerce",
  "Integrations",
  "Connected devices",
  "Infrastructure",
];

const STACK = ["PHP", "Laravel", "Python", "JavaScript", "React", "Next.js"];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: BASE,
          color: INK,
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          padding: "56px",
          position: "relative",
          width: "100%",
        }}
      >
        {/* Atmospheric teal glow, echoing the hero backdrop */}
        <div
          style={{
            backgroundImage:
              "radial-gradient(900px 520px at 82% -8%, rgba(49,230,208,0.16), rgba(3,6,11,0)), radial-gradient(760px 620px at -6% 112%, rgba(49,230,208,0.07), rgba(3,6,11,0))",
            display: "flex",
            inset: 0,
            position: "absolute",
          }}
        />
        {/* Faint engineering grid */}
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(122,158,174,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(122,158,174,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
            inset: 0,
            position: "absolute",
          }}
        />

        <div
          style={{
            background: "rgba(7,25,31,0.55)",
            border: "1px solid rgba(49,230,208,0.28)",
            borderRadius: 20,
            display: "flex",
            flex: 1,
            position: "relative",
          }}
        >
          {/* Left: identity + statement */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "48px 48px 46px",
              width: "63%",
            }}
          >
            <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
              <div
                style={{
                  border: `1px solid ${ACCENT}`,
                  borderRadius: 6,
                  color: ACCENT,
                  display: "flex",
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  padding: "8px 14px",
                }}
              >
                SOFTWARE ENGINEER
              </div>
              <div
                style={{
                  color: FAINT,
                  display: "flex",
                  fontSize: 16,
                  letterSpacing: "0.1em",
                }}
              >
                BUILDING PRODUCTION SOFTWARE SINCE 2021
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 58,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                Abdalrhman M. Alkady
              </div>
              <div
                style={{
                  color: "#cbd9de",
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 30,
                  fontWeight: 500,
                  lineHeight: 1.24,
                }}
              >
                <span>I learn the system, choose what fits,</span>
                <div style={{ display: "flex", gap: 11 }}>
                  <span>and ship what</span>
                  <span style={{ color: ACCENT }}>survives production.</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", gap: 10 }}>
                {STACK.map((tech) => (
                  <div
                    key={tech}
                    style={{
                      background: "rgba(49,230,208,0.08)",
                      border: "1px solid rgba(49,230,208,0.22)",
                      borderRadius: 999,
                      color: "#c9faf4",
                      display: "flex",
                      fontSize: 17,
                      padding: "7px 14px",
                    }}
                  >
                    {tech}
                  </div>
                ))}
              </div>
              <div
                style={{
                  alignItems: "center",
                  color: MUTED,
                  display: "flex",
                  fontSize: 15,
                  gap: 14,
                  letterSpacing: "0.05em",
                }}
              >
                <span
                  style={{ color: INK, flexShrink: 0, whiteSpace: "nowrap" }}
                >
                  13 PRODUCTION SYSTEMS
                </span>
                <div
                  style={{
                    background: FAINT,
                    borderRadius: 999,
                    flexShrink: 0,
                    height: 5,
                    width: 5,
                  }}
                />
                <span
                  style={{ color: INK, flexShrink: 0, whiteSpace: "nowrap" }}
                >
                  3 FOUNDER-BUILT
                </span>
                <div
                  style={{
                    background: FAINT,
                    borderRadius: 999,
                    flexShrink: 0,
                    height: 5,
                    width: 5,
                  }}
                />
                <span style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
                  UPWORK TOP RATED
                </span>
              </div>
            </div>
          </div>

          {/* Right: the systems surface I work across */}
          <div
            style={{
              borderLeft: "1px solid rgba(122,158,174,0.16)",
              display: "flex",
              flex: 1,
              flexDirection: "column",
              gap: 22,
              justifyContent: "center",
              padding: "48px 44px",
            }}
          >
            {DOMAINS.map((domain) => (
              <div
                key={domain}
                style={{ alignItems: "center", display: "flex", gap: 16 }}
              >
                <div
                  style={{
                    background: ACCENT,
                    borderRadius: 999,
                    boxShadow: `0 0 14px ${ACCENT}`,
                    display: "flex",
                    height: 9,
                    width: 9,
                  }}
                />
                <span style={{ color: "#dce6ee", display: "flex", fontSize: 22 }}>
                  {domain}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
