import { NextResponse } from "next/server";

export async function GET() {
  const portalUrl = process.env.PORTAL_API_URL;
  if (!portalUrl) return NextResponse.json({ success: false, message: "Travel service is not configured" }, { status: 503 });
  const response = await fetch(new URL("/api/countries/phone-codes", `${portalUrl.replace(/\/$/, "")}/`), { cache: "no-store" });
  return new NextResponse(response.body, { status: response.status, headers: response.headers });
}
