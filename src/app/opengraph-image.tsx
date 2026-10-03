import { ImageResponse } from "next/og";
import { site } from "@/data/site";

// Preview card shown when the link is shared (LinkedIn, X, WhatsApp, Slack…)
export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0a0a0a",
          backgroundImage: "radial-gradient(circle at 80% 20%, #1f1f22 0%, #0a0a0a 55%)",
          color: "#ededed",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              padding: "10px 22px",
              border: "2px solid #27272a",
              borderRadius: 999,
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            {site.initials}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#a1a1aa" }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: "#A0522D" }} />
            Open to Work
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>{site.name}</div>
          <div style={{ marginTop: 28, fontSize: 38, color: "#a1a1aa", maxWidth: 900, lineHeight: 1.3 }}>
            {site.tagline}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#71717a" }}>
          <div style={{ display: "flex" }}>{site.role}</div>
          <div style={{ display: "flex" }}>{site.location}</div>
        </div>
      </div>
    ),
    size,
  );
}
