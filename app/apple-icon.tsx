import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 36, background: "linear-gradient(135deg, #0d4884 0%, #a40860 100%)", color: "#fffdf7", fontSize: 92, fontWeight: 800, fontFamily: "sans-serif", letterSpacing: "-10px", paddingRight: 8 }}>V</div>,
    { ...size },
  );
}
