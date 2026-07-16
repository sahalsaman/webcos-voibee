import { connectDB } from "@/lib/db";
import { serialize } from "@/lib/utils";
import "@/models";
import Trip from "@/models/Trip";
import Partner from "@/models/Partner";
import PartnerTrip from "@/models/PartnerTrip";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Commission from "@/models/Commission";
import Wishlist from "@/models/Wishlist";
import OfferCard from "@/models/OfferCard";
import Destination from "@/models/Destination";
import Payment from "@/models/Payment";
import Employee from "@/models/Employee";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await connectDB();
    return await fn();
  } catch (err) {
    console.error("[dashboard] query failed:", (err as Error).message);
    return fallback;
  }
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Last `n` months as {key, label} from oldest to newest. */
function lastMonths(n: number) {
  const now = new Date();
  const arr: { y: number; m: number; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push({ y: d.getFullYear(), m: d.getMonth(), label: MONTHS[d.getMonth()] });
  }
  return arr;
}

/* ----------------------------- ADMIN ----------------------------- */

export async function getAdminStats() {
  return safe(
    async () => {
      const [trips, activeTrips, bookings, partners, travelers, revenueAgg] =
        await Promise.all([
          Trip.countDocuments({}),
          Trip.countDocuments({ status: "active" }),
          Booking.countDocuments({ paymentStatus: "paid" }),
          Partner.countDocuments({}),
          User.countDocuments({ role: "traveler" }),
          Booking.aggregate([
            { $match: { paymentStatus: "paid" } },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$totalAmount" },
                adminRevenue: { $sum: "$adminEarnings" },
              },
            },
          ]),
        ]);
      return {
        trips,
        activeTrips,
        bookings,
        partners,
        travelers,
        revenue: revenueAgg[0]?.revenue ?? 0,
        adminRevenue: revenueAgg[0]?.adminRevenue ?? 0,
      };
    },
    {
      trips: 0,
      activeTrips: 0,
      bookings: 0,
      partners: 0,
      travelers: 0,
      revenue: 0,
      adminRevenue: 0,
    },
  );
}

export async function getAdminCharts() {
  return safe(
    async () => {
      const months = lastMonths(6);
      const start = new Date(months[0].y, months[0].m, 1);

      const monthly = await Booking.aggregate([
        { $match: { paymentStatus: "paid", createdAt: { $gte: start } } },
        {
          $group: {
            _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
            bookings: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
      ]);

      const trend = months.map((mo) => {
        const found = monthly.find(
          (x) => x._id.y === mo.y && x._id.m === mo.m + 1,
        );
        return {
          month: mo.label,
          bookings: found?.bookings ?? 0,
          revenue: found?.revenue ?? 0,
        };
      });

      const topTrips = await Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: "$trip", bookings: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
        { $sort: { bookings: -1 } },
        { $limit: 5 },
        { $lookup: { from: "trips", localField: "_id", foreignField: "_id", as: "trip" } },
        { $unwind: "$trip" },
        { $project: { name: "$trip.title", bookings: 1, revenue: 1 } },
      ]);

      const topPartners = await Partner.find({})
        .sort({ totalEarnings: -1 })
        .limit(5)
        .select("businessName totalEarnings")
        .lean();

      return {
        trend,
        topTrips: serialize(topTrips),
        topPartners: serialize(topPartners).map((p: { businessName: string; totalEarnings: number }) => ({
          name: p.businessName,
          earnings: p.totalEarnings,
        })),
      };
    },
    { trend: [], topTrips: [], topPartners: [] },
  );
}

export async function getRecentBookings(limit = 8) {
  return safe(async () => {
    const bookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({ path: "trip", model: Trip, select: "title destination" })
      .populate({ path: "traveler", model: User, select: "name email" })
      .populate({ path: "partner", model: Partner, select: "businessName" })
      .lean();
    return serialize(bookings);
  }, []);
}

export async function listAdminTrips() {
  return safe(async () => serialize(await Trip.find({}).sort({ createdAt: -1 }).lean()), []);
}

export async function listAdminBookableTrips() {
  return safe(
    async () =>
      serialize(
        await Trip.find({ status: "active" })
          .sort({ startDate: 1, title: 1 })
          .select("title destination basePrice availableSeats totalSeats startDate status")
          .lean(),
      ),
    [],
  );
}

export async function getAdminTripById(id: string) {
  return safe(async () => {
    const trip = await Trip.findById(id).lean();
    return trip ? serialize(trip) : null;
  }, null);
}

export async function listAdminOfferCards() {
  return safe(async () => serialize(await OfferCard.find({}).sort({ sortOrder: 1, createdAt: -1 }).lean()), []);
}

export async function getAdminOfferCardById(id: string) {
  return safe(async () => {
    const offer = await OfferCard.findById(id).lean();
    return offer ? serialize(offer) : null;
  }, null);
}

export async function listAdminDestinations() {
  return safe(async () => serialize(await Destination.find({}).sort({ featured: -1, createdAt: -1 }).lean()), []);
}

export async function getAdminDestinationById(id: string) {
  return safe(async () => {
    const destination = await Destination.findById(id).lean();
    return destination ? serialize(destination) : null;
  }, null);
}

export async function listAdminTravelers() {
  return safe(async () => {
    const travelers = await User.find({ role: "traveler" }).sort({ createdAt: -1 }).lean();
    const ids = travelers.map((traveler) => traveler._id);
    const bookingAgg = await Booking.aggregate([
      { $match: { traveler: { $in: ids } } },
      {
        $group: {
          _id: "$traveler",
          bookingCount: { $sum: 1 },
          paidAmount: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0] } },
          lastBookingAt: { $max: "$createdAt" },
        },
      },
    ]);
    const bookings = await Booking.find({ traveler: { $in: ids } })
      .sort({ createdAt: -1 })
      .populate({ path: "trip", model: Trip, select: "title destination startDate" })
      .lean();
    const summaryByTraveler = new Map(bookingAgg.map((item) => [String(item._id), item]));
    const bookingsByTraveler = new Map<string, unknown[]>();
    for (const booking of serialize(bookings) as Array<Record<string, unknown>>) {
      const key = String(booking.traveler);
      bookingsByTraveler.set(key, [...(bookingsByTraveler.get(key) ?? []), booking]);
    }
    return serialize(travelers).map((traveler: Record<string, unknown>) => {
      const key = String(traveler._id);
      const summary = summaryByTraveler.get(key);
      return {
        ...traveler,
        bookingCount: summary?.bookingCount ?? 0,
        paidAmount: summary?.paidAmount ?? 0,
        lastBookingAt: summary?.lastBookingAt ?? null,
        bookings: bookingsByTraveler.get(key) ?? [],
      };
    });
  }, []);
}

export async function getAdminFinanceSummary() {
  return safe(async () => {
    const [bookingAgg, paymentAgg, commissionAgg, recentPayments] = await Promise.all([
      Booking.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            paidRevenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$totalAmount", 0] } },
            adminEarnings: { $sum: "$adminEarnings" },
            partnerEarnings: { $sum: "$partnerEarnings" },
            bookings: { $sum: 1 },
          },
        },
      ]),
      Payment.aggregate([
        {
          $group: {
            _id: "$status",
            amount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Commission.aggregate([
        {
          $group: {
            _id: "$status",
            amount: { $sum: "$amount" },
            platformFee: { $sum: "$platformFee" },
            count: { $sum: 1 },
          },
        },
      ]),
      Payment.find({})
        .sort({ createdAt: -1 })
        .limit(12)
        .populate({ path: "booking", model: Booking, select: "bookingNumber travelerDetails totalAmount paymentStatus" })
        .lean(),
    ]);
    return {
      totals: bookingAgg[0] ?? { totalRevenue: 0, paidRevenue: 0, adminEarnings: 0, partnerEarnings: 0, bookings: 0 },
      paymentsByStatus: serialize(paymentAgg),
      commissionsByStatus: serialize(commissionAgg),
      recentPayments: serialize(recentPayments),
    };
  }, { totals: { totalRevenue: 0, paidRevenue: 0, adminEarnings: 0, partnerEarnings: 0, bookings: 0 }, paymentsByStatus: [], commissionsByStatus: [], recentPayments: [] });
}

export async function listAdminEmployees() {
  return safe(async () => serialize(await Employee.find({}).sort({ createdAt: -1 }).lean()), []);
}

export async function getAdminEmployeeById(id: string) {
  return safe(async () => {
    const employee = await Employee.findById(id).lean();
    return employee ? serialize(employee) : null;
  }, null);
}

export async function listAdminBookings() {
  return safe(async () => {
    const bookings = await Booking.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "trip", model: Trip, select: "title destination" })
      .populate({ path: "traveler", model: User, select: "name email" })
      .populate({ path: "partner", model: Partner, select: "businessName" })
      .lean();
    return serialize(bookings);
  }, []);
}

export async function listAdminPartners() {
  return safe(async () => {
    const partners = await Partner.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "user", model: User, select: "name email" })
      .lean();
    return serialize(partners);
  }, []);
}

/* ----------------------------- PARTNER ----------------------------- */

export async function getPartnerByUser(userId: string) {
  return safe(async () => {
    const partner = await Partner.findOne({ user: userId })
      .populate({ path: "user", model: User, select: "name email image" })
      .lean();
    return partner ? serialize(partner) : null;
  }, null);
}

export async function getPartnerStats(partnerId: string) {
  return safe(
    async () => {
      const [bookings, links, clicksAgg, partner] = await Promise.all([
        Booking.countDocuments({ partner: partnerId, paymentStatus: "paid" }),
        PartnerTrip.countDocuments({ partner: partnerId, active: true }),
        PartnerTrip.aggregate([
          { $match: { partner: (await Partner.findById(partnerId))?._id } },
          { $group: { _id: null, clicks: { $sum: "$clicks" }, bookings: { $sum: "$bookings" } } },
        ]),
        Partner.findById(partnerId).select("totalEarnings pendingEarnings paidEarnings").lean<{
          totalEarnings: number;
          pendingEarnings: number;
          paidEarnings: number;
        }>(),
      ]);
      const clicks = clicksAgg[0]?.clicks ?? 0;
      const conversion = clicks > 0 ? Math.round((bookings / clicks) * 100) : 0;
      return {
        bookings,
        activeLinks: links,
        clicks,
        conversion,
        totalEarnings: partner?.totalEarnings ?? 0,
        pendingEarnings: partner?.pendingEarnings ?? 0,
        paidEarnings: partner?.paidEarnings ?? 0,
      };
    },
    {
      bookings: 0,
      activeLinks: 0,
      clicks: 0,
      conversion: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      paidEarnings: 0,
    },
  );
}

export async function getPartnerEarningsChart(partnerId: string) {
  return safe(async () => {
    const months = lastMonths(6);
    const start = new Date(months[0].y, months[0].m, 1);
    const monthly = await Commission.aggregate([
      { $match: { partner: (await Partner.findById(partnerId))?._id, createdAt: { $gte: start } } },
      {
        $group: {
          _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
          earnings: { $sum: "$amount" },
        },
      },
    ]);
    return months.map((mo) => ({
      month: mo.label,
      earnings: monthly.find((x) => x._id.y === mo.y && x._id.m === mo.m + 1)?.earnings ?? 0,
    }));
  }, []);
}

export async function getPartnerLinks(partnerId: string) {
  return safe(async () => {
    const links = await PartnerTrip.find({ partner: partnerId })
      .sort({ createdAt: -1 })
      .populate({ path: "trip", model: Trip, select: "title destination basePrice images slug status" })
      .lean();
    return serialize(links);
  }, []);
}

export async function getPartnerBookings(partnerId: string) {
  return safe(async () => {
    const bookings = await Booking.find({ partner: partnerId })
      .sort({ createdAt: -1 })
      .populate({ path: "trip", model: Trip, select: "title destination" })
      .populate({ path: "traveler", model: User, select: "name email" })
      .lean();
    return serialize(bookings);
  }, []);
}

export async function getPartnerCommissions(partnerId: string) {
  return safe(async () => {
    const rows = await Commission.find({ partner: partnerId })
      .sort({ createdAt: -1 })
      .populate({ path: "trip", model: Trip, select: "title" })
      .populate({ path: "booking", model: Booking, select: "bookingNumber" })
      .lean();
    return serialize(rows);
  }, []);
}

/** Active trips a partner can resell, annotated with whether a link exists. */
export async function getResellableTrips(partnerId: string) {
  return safe(async () => {
    const [trips, existing] = await Promise.all([
      Trip.find({ status: "active" }).sort({ createdAt: -1 }).lean(),
      PartnerTrip.find({ partner: partnerId }).select("trip commission").lean(),
    ]);
    const map = new Map(existing.map((e) => [String(e.trip), e.commission]));
    return serialize(trips).map((t: { _id: string }) => ({
      ...t,
      existingCommission: map.has(String(t._id)) ? map.get(String(t._id)) : null,
    }));
  }, []);
}

/* ----------------------------- TRAVELER ----------------------------- */

export async function getTravelerBookings(userId: string) {
  return safe(async () => {
    const bookings = await Booking.find({ traveler: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "trip", model: Trip, select: "title destination images slug startDate endDate" })
      .lean();
    return serialize(bookings);
  }, []);
}

export async function getTravelerWishlist(userId: string) {
  return safe(async () => {
    const wl = await Wishlist.findOne({ user: userId })
      .populate({ path: "trips", model: Trip })
      .lean<{ trips: unknown[] }>();
    return wl ? serialize(wl.trips) : [];
  }, []);
}
