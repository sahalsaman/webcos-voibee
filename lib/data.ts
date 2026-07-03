import { connectDB } from "@/lib/db";
import { serialize } from "@/lib/utils";
import "@/models"; // ensure all schemas are registered
import Trip from "@/models/Trip";
import Partner from "@/models/Partner";
import PartnerTrip from "@/models/PartnerTrip";
import Review from "@/models/Review";
import User from "@/models/User";
import Booking from "@/models/Booking";
import type { TripDTO, PartnerDTO, ReviewDTO } from "@/types";

/** Run a DB query, returning `fallback` if the DB is unreachable/unconfigured. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await connectDB();
    return await fn();
  } catch (err) {
    console.error("[data] query failed:", (err as Error).message);
    return fallback;
  }
}

export interface TripFilters {
  q?: string;
  destination?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "rating";
  page?: number;
  pageSize?: number;
}

export async function getTrips(filters: TripFilters = {}) {
  const {
    q,
    destination,
    category,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    pageSize = 9,
  } = filters;

  return safe(
    async () => {
      const query: Record<string, unknown> = { status: "active" };
      if (destination) query.destination = new RegExp(destination, "i");
      if (category) query.category = category;
      if (q) query.$text = { $search: q };
      if (minPrice != null || maxPrice != null) {
        query.basePrice = {
          ...(minPrice != null ? { $gte: minPrice } : {}),
          ...(maxPrice != null ? { $lte: maxPrice } : {}),
        };
      }

      const sortMap: Record<string, Record<string, 1 | -1>> = {
        newest: { createdAt: -1 },
        "price-asc": { basePrice: 1 },
        "price-desc": { basePrice: -1 },
        rating: { rating: -1 },
      };

      const [items, total] = await Promise.all([
        Trip.find(query)
          .sort(sortMap[sort])
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .lean(),
        Trip.countDocuments(query),
      ]);

      return {
        items: serialize(items) as TripDTO[],
        total,
        page,
        pageSize,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      };
    },
    { items: [], total: 0, page, pageSize, totalPages: 1 },
  );
}

export async function getFeaturedTrips(limit = 6) {
  return safe(async () => {
    const items = await Trip.find({ status: "active", featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    // Fall back to newest active trips if nothing is flagged featured.
    if (items.length === 0) {
      const recent = await Trip.find({ status: "active" })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      return serialize(recent) as TripDTO[];
    }
    return serialize(items) as TripDTO[];
  }, [] as TripDTO[]);
}

export async function getTripsByCategory(category: string, limit = 4) {
  return safe(async () => {
    const items = await Trip.find({ status: "active", category })
      .sort({ startDate: 1 })
      .limit(limit)
      .lean();
    return serialize(items) as TripDTO[];
  }, [] as TripDTO[]);
}

export async function getTripBySlug(slug: string) {
  return safe(async () => {
    const trip = await Trip.findOne({ slug }).lean();
    return trip ? (serialize(trip) as TripDTO) : null;
  }, null);
}

export async function getRelatedTrips(tripId: string, destination: string, limit = 3) {
  return safe(async () => {
    const items = await Trip.find({
      _id: { $ne: tripId },
      status: "active",
      destination: new RegExp(destination, "i"),
    })
      .limit(limit)
      .lean();
    return serialize(items) as TripDTO[];
  }, [] as TripDTO[]);
}

export async function getReviewsForTrip(tripId: string) {
  return safe(async () => {
    const reviews = await Review.find({ trip: tripId, status: "published" })
      .populate({ path: "user", model: User, select: "name image" })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    return serialize(reviews) as ReviewDTO[];
  }, [] as ReviewDTO[]);
}

export async function getPartnerBySlug(slug: string) {
  return safe(async () => {
    const partner = await Partner.findOne({ slug, status: "approved" })
      .populate({ path: "user", model: User, select: "name image" })
      .lean();
    return partner ? (serialize(partner) as PartnerDTO) : null;
  }, null);
}

/** Resolve a white-label listing for /p/<partnerSlug>/<tripSlug>. */
export async function getWhiteLabelTrip(partnerSlug: string, tripSlug: string) {
  return safe(async () => {
    const pt = await PartnerTrip.findOne({
      partnerSlug,
      tripSlug,
      active: true,
    })
      .populate({ path: "trip", model: Trip })
      .populate({
        path: "partner",
        model: Partner,
        match: { status: "approved" },
        populate: { path: "user", model: User, select: "name image" },
      })
      .lean<{ trip: unknown; partner: unknown; commission: number; sellingPrice: number }>();

    if (!pt || !pt.partner || !pt.trip) return null;
    return serialize(pt) as unknown as {
      _id: string;
      trip: TripDTO;
      partner: PartnerDTO;
      commission: number;
      sellingPrice: number;
    };
  }, null);
}

/** Fire-and-forget click counter for white-label links. */
export async function trackPartnerTripClick(partnerSlug: string, tripSlug: string) {
  try {
    await connectDB();
    await PartnerTrip.updateOne(
      { partnerSlug, tripSlug },
      { $inc: { clicks: 1 } },
    );
  } catch {
    /* non-critical */
  }
}

export async function getHomeStats() {
  return safe(
    async () => {
      const [trips, partners, bookings, travelers] = await Promise.all([
        Trip.countDocuments({ status: "active" }),
        Partner.countDocuments({ status: "approved" }),
        Booking.countDocuments({ status: { $in: ["confirmed", "completed"] } }),
        User.countDocuments({ role: "traveler" }),
      ]);
      return { trips, partners, bookings, travelers };
    },
    { trips: 0, partners: 0, bookings: 0, travelers: 0 },
  );
}
