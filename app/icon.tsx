import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";
export const runtime = "nodejs";

const logoSrc = `data:image/png;base64,${(await readFile(join(process.cwd(), "public", "voibee-logo-white.png"))).toString("base64")}`;

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0d4884 0%, #a40860 100%)" }}>
      <img src={logoSrc} alt="" width="320" height="320" style={{ objectFit: "contain" }} />
    </div>,
    { ...size },
  );
}
