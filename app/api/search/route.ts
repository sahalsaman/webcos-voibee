import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { COUNTRY_OPTIONS } from "@/lib/constants";
import { isIndiaCountry } from "@/lib/data";
import { serialize } from "@/lib/utils";
import "@/models";
import Destination from "@/models/Destination";
import Trip from "@/models/Trip";

function flagFromCode(code: string) {
  const normalized = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return "";
  return normalized
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tripHref(params: Record<string, string>) {
  const search = new URLSearchParams(params);
  return `/trips?${search.toString()}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const visitorCountry = searchParams.get("c") ?? "IN";

  if (q.length < 2) return NextResponse.json({ success: true, data: [] });

  try {
    await connectDB();
    const rx = new RegExp(escapeRegex(q), "i");
    const allowDomestic = isIndiaCountry(visitorCountry);
    const destinationQuery: Record<string, unknown> = { status: "active", $or: [{ title: rx }, { country: rx }, { tags: rx }] };
    const tripQuery: Record<string, unknown> = { status: "active", $or: [{ title: rx }, { destination: rx }, { country: rx }, { tags: rx }] };
    if (!allowDomestic) {
      destinationQuery.countryCode = { $ne: "IN" };
      tripQuery.country = { $ne: "India" };
    }

    const matchedCountries = COUNTRY_OPTIONS.filter((country) => {
      if (!allowDomestic && country.code === "IN") return false;
      return country.name.toLowerCase().includes(q.toLowerCase()) || country.code.toLowerCase().includes(q.toLowerCase());
    }).slice(0, 3);

    const [destinations, trips] = await Promise.all([
      Destination.find(destinationQuery)
        .sort({ popular: -1, featured: -1, title: 1 })
        .limit(6)
        .select("title country countryCode images basePrice")
        .lean(),
      Trip.find(tripQuery)
        .sort({ featured: -1, startDate: 1 })
        .limit(6)
        .select("title destination country slug images category")
        .lean(),
    ]);

    const countryItems = matchedCountries.map((country) => ({
      id: `country-${country.code}`,
      type: "country" as const,
      title: country.name,
      destination: "All destinations",
      country: country.name,
      countryCode: country.code,
      flag: flagFromCode(country.code),
      href: tripHref({ country: country.name, ...(visitorCountry ? { c: visitorCountry } : {}) }),
    }));

    const destinationItems = (serialize(destinations) as Array<{ _id: string; title: string; country: string; countryCode: string; images?: string[] }>).map((destination) => ({
      id: `destination-${destination._id}`,
      type: "destination" as const,
      title: destination.title,
      destination: destination.title,
      country: destination.country,
      countryCode: destination.countryCode,
      flag: flagFromCode(destination.countryCode),
      href: tripHref({ destination: destination.title, ...(visitorCountry ? { c: visitorCountry } : {}) }),
    }));

    const tripItems = (serialize(trips) as Array<{ _id: string; title: string; destination: string; country?: string; slug: string; category?: string }>).map((trip) => {
      const country = COUNTRY_OPTIONS.find((item) => item.name === (trip.country ?? "India"));
      const countryCode = country?.code ?? (trip.country === "India" ? "IN" : "");
      return {
        id: `trip-${trip._id}`,
        type: "trip" as const,
        title: trip.title,
        destination: trip.destination,
        country: trip.country ?? "India",
        countryCode,
        flag: flagFromCode(countryCode),
        href: `/trips/${trip.slug}${visitorCountry ? `?c=${encodeURIComponent(visitorCountry)}` : ""}`,
      };
    });

    const data = [...countryItems, ...destinationItems, ...tripItems].slice(0, 9);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[search] query failed:", (err as Error).message);
    return NextResponse.json({ success: true, data: [] });
  }
}
