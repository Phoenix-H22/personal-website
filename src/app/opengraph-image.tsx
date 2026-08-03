import { ImageResponse } from "next/og";

export const alt =
  "Abdalrhman M. Alkady, backend-focused product engineer — Systems Under the Surface";
export const size = {
  height: 630,
  width: 1200,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#06080d",
          color: "#f4f7fb",
          display: "flex",
          fontFamily: "Arial, sans-serif",
          height: "100%",
          padding: "72px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,.1)",
            display: "flex",
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "52px",
              width: "62%",
            }}
          >
            <div
              style={{
                color: "#35d8c0",
                display: "flex",
                fontSize: 18,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Backend-Focused Product Engineer
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 66,
                fontWeight: 600,
                letterSpacing: "-0.055em",
                lineHeight: 0.98,
              }}
            >
              <span>Most people see</span>
              <span>the product.</span>
              <span>I build what makes it work.</span>
            </div>
            <div style={{ color: "#9ba8ba", display: "flex", fontSize: 22 }}>
              Abdalrhman Mohamed Alkady
            </div>
          </div>

          <div
            style={{
              borderLeft: "1px solid rgba(255,255,255,.1)",
              display: "flex",
              flex: 1,
              position: "relative",
            }}
          >
            {[
              ["API", 42, 116, "#35d8c0"],
              ["Queue", 184, 210, "#78aefb"],
              ["Database", 52, 326, "#78aefb"],
              ["Product", 210, 408, "#d8ad65"],
            ].map(([label, left, top, color]) => (
              <div
                key={String(label)}
                style={{
                  alignItems: "center",
                  background: "#111722",
                  border: "1px solid rgba(255,255,255,.18)",
                  borderRadius: 6,
                  display: "flex",
                  fontSize: 16,
                  gap: 10,
                  left: Number(left),
                  padding: "14px 18px",
                  position: "absolute",
                  top: Number(top),
                }}
              >
                <span
                  style={{
                    background: String(color),
                    borderRadius: 999,
                    display: "flex",
                    height: 7,
                    width: 7,
                  }}
                />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
