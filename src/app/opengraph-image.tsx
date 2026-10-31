import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #070B16 0%, #111D32 100%)",
          color: "#EAF5FF",
          borderLeft: "12px solid #25D9F8",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 12, color: "#25D9F8" }}>NEXUS · COMMAND CENTER</div>
        <div style={{ fontSize: 92, fontWeight: 700, marginTop: 24 }}>{profile.name}</div>
        <div style={{ fontSize: 40, color: "#8C6BFF", marginTop: 12 }}>{profile.title}</div>
      </div>
    ),
    size,
  );
}
