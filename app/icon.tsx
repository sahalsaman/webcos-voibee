import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0d4884 0%, #a40860 100%)", color: "#fffdf7", fontSize: 240, fontWeight: 800, fontFamily: "sans-serif", letterSpacing: "-24px", paddingRight: 20 }}>V</div>,
    { ...size },
  );
}
