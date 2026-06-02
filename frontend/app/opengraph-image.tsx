import { ImageResponse } from "next/og"

export const alt = "CampusQ — AI academic assistant for Carleton students"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#fafaf9",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "999px",
            padding: "10px 22px",
            marginBottom: "40px",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#dc2626" }} />
          <span style={{ fontSize: 24, fontWeight: 600, color: "#dc2626", letterSpacing: "0.05em" }}>
            BUILT FOR CARLETON STUDENTS
          </span>
        </div>

        {/* Wordmark */}
        <div style={{ display: "flex", fontSize: 110, fontWeight: 800, letterSpacing: "-0.03em", color: "#18181b", lineHeight: 1 }}>
          Campus<span style={{ color: "#dc2626" }}>Q</span>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 38, color: "#52525b", marginTop: "28px", maxWidth: "900px", lineHeight: 1.3 }}>
          Your AI academic assistant. Instant answers about courses, programs, deadlines, and more.
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "48px", marginTop: "56px" }}>
          {[
            ["3,782", "courses"],
            ["498", "programs"],
            ["90%", "accuracy"],
          ].map(([v, l]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 46, fontWeight: 800, color: "#18181b" }}>{v}</span>
              <span style={{ fontSize: 24, color: "#a1a1aa" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
