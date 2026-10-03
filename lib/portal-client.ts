import { headers } from "next/headers";
import { unstable_cache } from "next/cache";

type PortalPayload<T> = { success: boolean; data?: T; message?: string };

const publicFallbacks = new Map<string, (args: unknown[]) => unknown>([
  ["getActivityTypes", () => []],
  ["getActivities", () => []],
  ["getActivityBySlug", () => null],
  ["getDestinations", () => []],
  ["getHomeDestinations", () => ({ domestic: [], international: [] })],
  ["getDestinationLanding", () => null],
  ["getOfferCards", () => []],
  ["getTripCategoryCounts", () => ({})],
  ["getTrips", (args) => {
    const filters = args[0] && typeof args[0] === "object"
      ? args[0] as { page?: number; pageSize?: number }
      : {};
    return {
      items: [],
      total: 0,
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 9,
      totalPages: 1,
    };
  }],
  ["getFeaturedTrips", () => []],
  ["getTripsByCategory", () => []],
  ["getTripBySlug", () => null],
  ["getRelatedTrips", () => []],
  ["getReviewsForTrip", () => []],
  ["getPartnerBySlug", () => null],
  ["getWhiteLabelTrip", () => null],
  ["getPartnerStorefront", () => null],
  ["trackPartnerTripClick", () => null],
  ["getHomeStats", () => ({ trips: 0, partners: 0, bookings: 0, travelers: 0 })],
  ["getAuthorizedBookingConfirmation", () => null],
  ["getQuotation", () => null],
  ["getSitemapRecords", () => ({ trips: [], destinations: [], partnerTrips: [], approvedPartners: [] })],
]);

// These operations only return storefront content.  Keeping them outside the
// request-specific cookie path lets Vercel reuse the result for every visitor.
const cacheablePublicOperations = new Set([
  "getActivityTypes",
  "getActivities",
  "getActivityBySlug",
  "getDestinations",
  "getHomeDestinations",
  "getDestinationLanding",
  "getOfferCards",
  "getTripCategoryCounts",
  "getTrips",
  "getFeaturedTrips",
  "getTripsByCategory",
  "getTripBySlug",
  "getRelatedTrips",
  "getReviewsForTrip",
  "getPartnerBySlug",
  "getWhiteLabelTrip",
  "getPartnerStorefront",
  "getHomeStats",
  "getSitemapRecords",
]);

function portalUrls(pathname: string) {
  const configured = process.env.PORTAL_API_URL;
  if (!configured) throw new Error("Configure PORTAL_API_URL.");
  const primary = new URL(pathname, `${configured.replace(/\/$/, "")}/`);
  if (primary.hostname !== "localhost") return [primary];
  const ipv4 = new URL(primary);
  ipv4.hostname = "127.0.0.1";
  return [primary, ipv4];
}

async function fetchPortal(pathname: string, init: RequestInit, timeoutMs = 8_000) {
  let lastError: unknown;
  for (const url of portalUrls(pathname)) {
    try {
      return await fetch(url, {
        ...init,
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error("Travels Portal is unreachable", { cause: lastError });
}

const getCachedPublicPayload = unstable_cache(
  async (business: string, operation: string, serializedArgs: string) => {
    const response = await fetchPortal("/api/storefront", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-business-slug": business,
      },
      body: JSON.stringify({ operation, args: JSON.parse(serializedArgs) }),
    // The Portal can take a few seconds to wake its database connection. Do
    // not replace real storefront content with an empty fallback too early.
    }, 12_000);
    const result = await readPayload<unknown>(response);
    if (!response.ok || !result.success) {
      throw new Error(result.message || `Travels Portal request failed (${response.status})`);
    }
    return result.data;
  },
  ["portal-public-storefront"],
  { revalidate: 300 },
);

async function readPayload<T>(response: Response): Promise<PortalPayload<T>> {
  const text = await response.text();
  try {
    return JSON.parse(text) as PortalPayload<T>;
  } catch {
    throw new Error(`Travels Portal returned an invalid response (${response.status})`);
  }
}

export async function portalCall<T>(operation: string, args: unknown[] = []): Promise<T> {
  const business = process.env.PORTAL_BUSINESS_SLUG;
  if (!business) throw new Error("Configure PORTAL_BUSINESS_SLUG.");

  try {
    if (cacheablePublicOperations.has(operation)) {
      return await getCachedPublicPayload(business, operation, JSON.stringify(args)) as T;
    }

    const incoming = await headers();
    const response = await fetchPortal("/api/storefront", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-business-slug": business,
        cookie: incoming.get("cookie") || "",
      },
      body: JSON.stringify({ operation, args }),
    });
    const result = await readPayload<T>(response);
    if (!response.ok || !result.success) {
      throw new Error(result.message || `Travels Portal request failed (${response.status})`);
    }
    return result.data as T;
  } catch (error) {
    const fallback = publicFallbacks.get(operation);
    if (!fallback) throw error;
    console.error(
      `[portal] ${operation} unavailable:`,
      error instanceof Error ? error.message : error,
    );
    return fallback(args) as T;
  }
}

export async function portalSession() {
  const incoming = await headers();
  const business = process.env.PORTAL_BUSINESS_SLUG;
  if (!business) return null;
  try {
    const response = await fetchPortal("/api/auth/session", {
      headers: {
        "x-business-slug": business,
        cookie: incoming.get("cookie") || "",
      },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error(
      "[portal] session unavailable:",
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}
