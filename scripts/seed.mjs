/**
 * Voibee seed script.
 *   npm run seed
 *
 * Loads .env.local, wipes the core collections and inserts a realistic demo
 * dataset (admin, partners, travelers, trips, white-label links, bookings,
 * commissions and reviews) so every dashboard has data on first run.
 */
import { readFileSync, existsSync } from "node:fs";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// --- load .env.local manually (so `node scripts/seed.mjs` just works) ---
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error("✗ MONGODB_URI not set. Create .env.local first (see .env.example).");
  process.exit(1);
}

const PASSWORD = process.env.SEED_PASSWORD || "123456";
const oid = () => new mongoose.Types.ObjectId();
const now = new Date();
const daysFromNow = (d) => new Date(now.getTime() + d * 86400000);
const monthsAgo = (m) => new Date(now.getFullYear(), now.getMonth() - m, 12);

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`;

await mongoose.connect(URI);
const db = mongoose.connection.db;
console.log("→ connected to", db.databaseName);

const collections = [
  "users", "partners", "destinations", "offercards", "trips", "partnertrips",
  "bookings", "payments", "commissions", "reviews",
  "wishlists", "notifications", "settings",
];
for (const c of collections) await db.collection(c).deleteMany({});
console.log("→ cleared collections");

const hash = await bcrypt.hash(PASSWORD, 10);

/* ----------------------------- USERS ----------------------------- */
const adminId = oid();
const travelerIds = [oid(), oid(), oid()];
const partnerUserIds = [oid(), oid(), oid()];

const users = [
  { _id: adminId, name: "Voibee Admin", email: "admin@voibee.com", password: hash, mobile: "9000000001", role: "admin", createdAt: now, updatedAt: now },
  { _id: travelerIds[0], name: "Aarav Mehta", email: "aarav@example.com", password: hash, mobile: "9000000010", role: "traveler", createdAt: now, updatedAt: now },
  { _id: travelerIds[1], name: "Sara Khan", email: "sara@example.com", password: hash, mobile: "9000000011", role: "traveler", createdAt: now, updatedAt: now },
  { _id: travelerIds[2], name: "Rohit Nair", email: "rohit@example.com", password: hash, mobile: "9000000012", role: "traveler", createdAt: now, updatedAt: now },
  { _id: partnerUserIds[0], name: "Sahal", email: "sahal@example.com", password: hash, mobile: "9000000020", role: "partner", createdAt: now, updatedAt: now },
  { _id: partnerUserIds[1], name: "Cheruvadi Travels", email: "cheruvadi@example.com", password: hash, mobile: "9000000021", role: "partner", createdAt: now, updatedAt: now },
  { _id: partnerUserIds[2], name: "Wander Priya", email: "priya@example.com", password: hash, mobile: "9000000022", role: "partner", createdAt: now, updatedAt: now },
];
await db.collection("users").insertMany(users);

/* ----------------------------- PARTNERS ----------------------------- */
const partnerIds = [oid(), oid(), oid()];
const partners = [
  { _id: partnerIds[0], user: partnerUserIds[0], businessName: "Sahal Voyages", slug: "sahal", partnerType: "Travel Influencer", status: "approved", defaultCommission: 1500, bio: "Curating offbeat journeys for my community.", contactEmail: "sahal@example.com", contactPhone: "9000000020", totalEarnings: 0, pendingEarnings: 0, paidEarnings: 0, socialLinks: [{ label: "Instagram", url: "https://instagram.com" }], createdAt: monthsAgo(5), updatedAt: now },
  { _id: partnerIds[1], user: partnerUserIds[1], businessName: "Cheruvadi Travels", slug: "cheruvadi-travels", partnerType: "Travel Agency", status: "approved", defaultCommission: 1000, bio: "Your trusted travel partner since 2010.", contactEmail: "cheruvadi@example.com", contactPhone: "9000000021", totalEarnings: 0, pendingEarnings: 0, paidEarnings: 0, socialLinks: [], createdAt: monthsAgo(4), updatedAt: now },
  { _id: partnerIds[2], user: partnerUserIds[2], businessName: "Wander With Priya", slug: "wander-priya", partnerType: "Community Leader", status: "pending", defaultCommission: 1200, bio: "Group trips for solo travelers.", contactEmail: "priya@example.com", contactPhone: "9000000022", totalEarnings: 0, pendingEarnings: 0, paidEarnings: 0, socialLinks: [], createdAt: monthsAgo(1), updatedAt: now },
];
await db.collection("partners").insertMany(partners);

/* ----------------------------- SETTINGS ----------------------------- */
await db.collection("settings").insertOne({
  key: "global", defaultCommission: 1000, platformFeePercent: 0, platformFeeFlat: 0,
  currency: "INR", minWithdrawal: 1000, createdAt: now, updatedAt: now,
});

/* -------------------------- DESTINATIONS -------------------------- */
const destinationDefs = [
  { title: "Goa", country: "India", countryCode: "IN", basePrice: 8999, image: "1512343879784-a960bf40e7f2", tags: ["beach", "nightlife"], featured: true, popular: true },
  { title: "Manali", country: "India", countryCode: "IN", basePrice: 11999, image: "1626621341517-bbf3d9990a23", tags: ["mountains", "trekking"], featured: true, popular: true },
  { title: "Kerala", country: "India", countryCode: "IN", basePrice: 14999, image: "1602216056096-3b40cc0c9944", tags: ["backwaters", "family"], featured: true, popular: true },
  { title: "Ladakh", country: "India", countryCode: "IN", basePrice: 22999, image: "1581793745862-99fde7fa73d2", tags: ["roadtrip", "adventure"], featured: true, popular: true },
  { title: "Andaman", country: "India", countryCode: "IN", basePrice: 26999, image: "1559494007-9f5847c49d94", tags: ["islands", "honeymoon"], featured: false, popular: true },
  { title: "Rishikesh", country: "India", countryCode: "IN", basePrice: 6999, image: "1591018653367-7c7c9f9a3a35", tags: ["rafting", "wellness"], featured: false, popular: true },
  { title: "Kashmir", country: "India", countryCode: "IN", basePrice: 18999, image: "1566837497312-7be4ebbd7e62", tags: ["snow", "family"], featured: true, popular: true },
  { title: "Meghalaya", country: "India", countryCode: "IN", basePrice: 17999, image: "1623598548755-cf0a84d9c9bb", tags: ["waterfalls", "nature"], featured: false, popular: true },
  { title: "Spiti", country: "India", countryCode: "IN", basePrice: 19999, image: "1605640840605-14ac1855827b", tags: ["offbeat", "monastery"], featured: false, popular: true },
  { title: "Coorg", country: "India", countryCode: "IN", basePrice: 9999, image: "1593693397690-362cb9666fc2", tags: ["coffee", "wellness"], featured: false, popular: true },
  { title: "Dubai", country: "United Arab Emirates", countryCode: "AE", basePrice: 499, image: "1512453979798-5ea266f8880c", tags: ["luxury", "shopping"], featured: true, popular: true },
  { title: "Bali", country: "Indonesia", countryCode: "ID", basePrice: 699, image: "1537996194471-e657df975ab4", tags: ["wellness", "honeymoon"], featured: true, popular: true },
  { title: "Singapore", country: "Singapore", countryCode: "SG", basePrice: 599, image: "1525625293386-3f8f99389edd", tags: ["family", "city"], featured: true, popular: true },
  { title: "Thailand", country: "Thailand", countryCode: "TH", basePrice: 549, image: "1508009603885-50cf7c579365", tags: ["beach", "group"], featured: false, popular: true },
  { title: "Maldives", country: "Maldives", countryCode: "MV", basePrice: 899, image: "1514282401047-d79a71a590e8", tags: ["honeymoon", "luxury"], featured: true, popular: true },
  { title: "Malaysia", country: "Malaysia", countryCode: "MY", basePrice: 449, image: "1596422846543-75c6fc197f07", tags: ["family", "city"], featured: false, popular: true },
  { title: "Vietnam", country: "Vietnam", countryCode: "VN", basePrice: 599, image: "1528127269322-539801943592", tags: ["culture", "solo"], featured: false, popular: true },
  { title: "Sri Lanka", country: "Sri Lanka", countryCode: "LK", basePrice: 399, image: "1586861635167-e5223aadc9fe", tags: ["beach", "spiritual"], featured: false, popular: true },
  { title: "Azerbaijan", country: "Azerbaijan", countryCode: "AZ", basePrice: 649, image: "1603466340270-41ae443a65a5", tags: ["culture", "luxury"], featured: false, popular: true },
  { title: "Georgia", country: "Georgia", countryCode: "GE", basePrice: 649, image: "1565008576549-57569a49371d", tags: ["mountains", "wine"], featured: false, popular: true },
];

const destinations = destinationDefs.map((d) => ({
  _id: oid(),
  title: d.title,
  description: `Curated ${d.title} packages with transparent pricing, verified stays and local experiences.`,
  images: [img(d.image)],
  videos: [],
  basePrice: d.basePrice,
  status: "active",
  featured: d.featured,
  tags: d.tags,
  popular: d.popular,
  country: d.country,
  countryCode: d.countryCode,
  createdAt: now,
  updatedAt: now,
}));
await db.collection("destinations").insertMany(destinations);

/* ---------------------------- OFFER CARDS ---------------------------- */
const offerCards = [
  { title: "Dubai summer flash deal", description: "Luxury stays, skyline views and guided city experiences with smooth Voibee support.", href: "/trips?destination=Dubai", ctaLabel: "Book Dubai", priceLabel: "From $499", image: "1512453979798-5ea266f8880c", country: "United Arab Emirates", countryCode: "AE", featured: true, sortOrder: 1, tags: ["dubai", "luxury"] },
  { title: "Bali honeymoon special", description: "Private villas, wellness experiences and island days curated for couples.", href: "/trips?destination=Bali", ctaLabel: "Explore Bali", priceLabel: "From $699", image: "1537996194471-e657df975ab4", country: "Indonesia", countryCode: "ID", featured: true, sortOrder: 2, tags: ["bali", "honeymoon"] },
  { title: "Kerala family holiday", description: "Backwaters, nature stays and relaxed family itineraries across Kerala.", href: "/trips?destination=Kerala", ctaLabel: "View Kerala", priceLabel: "From ₹14,999", image: "1602216056096-3b40cc0c9944", country: "India", countryCode: "IN", featured: false, sortOrder: 3, tags: ["kerala", "family"] },
  { title: "Varanasi festival escape", description: "A spiritual city break around river rituals, heritage walks and festive evenings.", href: "/trips?destination=Varanasi", ctaLabel: "See festival trips", priceLabel: "From ₹7,999", image: "1561361513-2d000a50f0dc", country: "India", countryCode: "IN", featured: false, sortOrder: 4, tags: ["festival", "spiritual"] },
];

await db.collection("offercards").insertMany(offerCards.map((offer) => ({
  _id: oid(),
  title: offer.title,
  description: offer.description,
  images: [img(offer.image)],
  videos: [],
  href: offer.href,
  ctaLabel: offer.ctaLabel,
  priceLabel: offer.priceLabel,
  status: "active",
  featured: offer.featured,
  sortOrder: offer.sortOrder,
  tags: offer.tags,
  country: offer.country,
  countryCode: offer.countryCode,
  createdAt: now,
  updatedAt: now,
})));

/* ----------------------------- TRIPS ----------------------------- */
const tripDefs = [
  { title: "Goa Beach Escape", destination: "Goa", country: "India", category: "Group", basePrice: 8999, seats: 30, days: 4, img: "1512343879784-a960bf40e7f2", featured: true, tags: ["beach", "nightlife"] },
  { title: "Manali Adventure Trek", destination: "Manali", country: "India", category: "Adventure", basePrice: 11999, seats: 25, days: 6, img: "1626621341517-bbf3d9990a23", featured: true, tags: ["trekking", "mountains"] },
  { title: "Kerala Backwaters Bliss", destination: "Kerala", country: "India", category: "Family", basePrice: 14999, seats: 20, days: 5, img: "1602216056096-3b40cc0c9944", featured: true, tags: ["houseboat", "nature"] },
  { title: "Ladakh Road Trip", destination: "Ladakh", country: "India", category: "Adventure", basePrice: 22999, seats: 16, days: 8, img: "1581793745862-99fde7fa73d2", featured: true, tags: ["bikes", "highaltitude"] },
  { title: "Andaman Island Getaway", destination: "Andaman", country: "India", category: "Honeymoon", basePrice: 26999, seats: 18, days: 6, img: "1559494007-9f5847c49d94", featured: false, tags: ["islands", "scuba"] },
  { title: "Rishikesh Yoga & Rafting", destination: "Rishikesh", country: "India", category: "Wellness & spa", basePrice: 6999, seats: 35, days: 3, img: "1591018653367-7c7c9f9a3a35", featured: false, tags: ["rafting", "yoga"] },
  { title: "Kashmir Paradise Tour", destination: "Kashmir", country: "India", category: "Family", basePrice: 18999, seats: 22, days: 6, img: "1566837497312-7be4ebbd7e62", featured: true, tags: ["snow", "shikara"] },
  { title: "Spiti Valley Expedition", destination: "Spiti", country: "India", category: "Adventure", basePrice: 19999, seats: 14, days: 7, img: "1605640840605-14ac1855827b", featured: false, tags: ["offbeat", "monastery"] },
  { title: "Meghalaya Waterfall Trails", destination: "Meghalaya", country: "India", category: "Adventure", basePrice: 17999, seats: 18, days: 6, img: "1623598548755-cf0a84d9c9bb", featured: false, tags: ["waterfalls", "nature"] },
  { title: "Coorg Wellness Retreat", destination: "Coorg", country: "India", category: "Wellness & spa", basePrice: 9999, seats: 16, days: 4, img: "1593693397690-362cb9666fc2", featured: false, tags: ["coffee", "spa"] },
  { title: "Dubai Luxury Break", destination: "Dubai", country: "United Arab Emirates", category: "Luxury", basePrice: 499, seats: 24, days: 5, img: "1512453979798-5ea266f8880c", featured: true, tags: ["shopping", "skyline"] },
  { title: "Bali Honeymoon Escape", destination: "Bali", country: "Indonesia", category: "Honeymoon", basePrice: 699, seats: 18, days: 6, img: "1537996194471-e657df975ab4", featured: true, tags: ["villas", "wellness"] },
  { title: "Singapore Family Fun", destination: "Singapore", country: "Singapore", category: "Family", basePrice: 599, seats: 26, days: 5, img: "1525625293386-3f8f99389edd", featured: true, tags: ["city", "themeparks"] },
  { title: "Thailand Island Group Trip", destination: "Thailand", country: "Thailand", category: "Group", basePrice: 549, seats: 30, days: 6, img: "1508009603885-50cf7c579365", featured: false, tags: ["beach", "nightlife"] },
  { title: "Maldives Water Villa Stay", destination: "Maldives", country: "Maldives", category: "Luxury", basePrice: 899, seats: 12, days: 5, img: "1514282401047-d79a71a590e8", featured: true, tags: ["islands", "honeymoon"] },
  { title: "Vietnam Solo Discovery", destination: "Vietnam", country: "Vietnam", category: "Solo", basePrice: 599, seats: 20, days: 7, img: "1528127269322-539801943592", featured: false, tags: ["culture", "food"] },
  { title: "Sri Lanka Spiritual Circuit", destination: "Sri Lanka", country: "Sri Lanka", category: "Spiritual", basePrice: 399, seats: 20, days: 5, img: "1586861635167-e5223aadc9fe", featured: false, tags: ["temples", "coast"] },
  { title: "Azerbaijan Festival Week", destination: "Azerbaijan", country: "Azerbaijan", category: "Festival", basePrice: 649, seats: 20, days: 6, img: "1603466340270-41ae443a65a5", featured: false, tags: ["culture", "festival"] },
];

const inclusions = ["Accommodation", "Daily breakfast & dinner", "All transfers", "Professional trip captain", "Sightseeing as per itinerary"];
const exclusions = ["Airfare / train tickets", "Personal expenses", "Anything not mentioned in inclusions"];

const trips = tripDefs.map((t, i) => {
  const start = daysFromNow(14 + i * 7);
  const itinerary = Array.from({ length: Math.min(t.days, 4) }, (_, d) => ({
    day: d + 1,
    title: d === 0 ? "Arrival & welcome" : `Day ${d + 1} exploration`,
    description: "Guided sightseeing, activities and leisure time with the group.",
  }));
  return {
    _id: oid(),
    title: t.title,
    slug: t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    destination: t.destination,
    description: `Experience the very best of ${t.destination} on this ${t.days}-day ${t.category.toLowerCase()} trip. Handpicked stays, local experiences and a seamless journey from start to finish.`,
    images: [img(t.img), img("1469474968028-56623f02e42e"), img("1488646953014-85cb44e25828")],
    videos: [],
    itinerary,
    inclusions,
    exclusions,
    basePrice: t.basePrice,
    totalSeats: t.seats,
    availableSeats: t.seats - Math.floor(Math.random() * 6),
    startDate: start,
    endDate: daysFromNow(14 + i * 7 + t.days),
    pickupLocation: t.destination + " Airport",
    category: t.category,
    country: t.country,
    status: "active",
    featured: t.featured,
    tags: t.tags,
    rating: 0,
    reviewCount: 0,
    createdAt: monthsAgo(5 - (i % 5)),
    updatedAt: now,
  };
});
await db.collection("trips").insertMany(trips);

/* ----------------------------- WHITE-LABEL LINKS ----------------------------- */
const partnerTrips = [];
const makePT = (partner, trip, commission) => {
  const id = oid();
  partnerTrips.push({
    _id: id, partner: partner._id, trip: trip._id,
    partnerSlug: partner.slug, tripSlug: trip.slug,
    commission, sellingPrice: trip.basePrice + commission,
    active: partner.status === "approved",
    clicks: 20 + Math.floor(Math.random() * 200),
    bookings: 0, createdAt: monthsAgo(4), updatedAt: now,
  });
  return id;
};
const sahalGoa = makePT(partners[0], trips[0], 1500);
const sahalManali = makePT(partners[0], trips[1], 2000);
const cherKerala = makePT(partners[1], trips[2], 1000);
const cherKashmir = makePT(partners[1], trips[6], 1500);
await db.collection("partnertrips").insertMany(partnerTrips);

/* ----------------------------- BOOKINGS + COMMISSIONS ----------------------------- */
const bookings = [];
const payments = [];
const commissions = [];
const earningsByPartner = {};

let counter = 1000;
function addBooking({ trip, traveler, partner, partnerTripId, seats, monthOffset }) {
  const base = trip.basePrice;
  const commission = partner
    ? partnerTrips.find((p) => String(p._id) === String(partnerTripId)).commission
    : 0;
  const sellingPrice = base + commission;
  const total = sellingPrice * seats;
  const partnerEarnings = commission * seats;
  const adminEarnings = base * seats;
  const created = monthsAgo(monthOffset);
  const bId = oid();
  const pId = oid();

  payments.push({
    _id: pId, booking: bId, razorpayOrderId: "order_demo_" + counter,
    razorpayPaymentId: "pay_demo_" + counter, amount: total, currency: "INR",
    status: "paid", method: "card", createdAt: created, updatedAt: created,
  });
  bookings.push({
    _id: bId, bookingNumber: "VOI-" + counter++,
    trip: trip._id, traveler: traveler, partner: partner ? partner._id : null,
    partnerTrip: partnerTripId || null,
    travelerDetails: { name: "Guest Traveler", email: "guest@example.com", mobile: "9000000099", travellers: seats },
    seats, basePrice: base, commission, platformFee: 0,
    sellingPrice, totalAmount: total, partnerEarnings, adminEarnings,
    status: monthOffset > 1 ? "completed" : "confirmed", paymentStatus: "paid",
    payment: pId, createdAt: created, updatedAt: created,
  });
  if (partner) {
    commissions.push({
      _id: oid(), booking: bId, partner: partner._id, trip: trip._id,
      amount: partnerEarnings, platformFee: 0, status: "pending",
      createdAt: created, updatedAt: created,
    });
    earningsByPartner[partner._id] = (earningsByPartner[partner._id] || 0) + partnerEarnings;
    const pt = partnerTrips.find((p) => String(p._id) === String(partnerTripId));
    if (pt) pt.bookings += 1;
  }
}

// Spread bookings across the last 6 months for nice charts.
addBooking({ trip: trips[0], traveler: travelerIds[0], partner: partners[0], partnerTripId: sahalGoa, seats: 2, monthOffset: 5 });
addBooking({ trip: trips[1], traveler: travelerIds[1], partner: partners[0], partnerTripId: sahalManali, seats: 1, monthOffset: 4 });
addBooking({ trip: trips[2], traveler: travelerIds[2], partner: partners[1], partnerTripId: cherKerala, seats: 2, monthOffset: 4 });
addBooking({ trip: trips[6], traveler: travelerIds[0], partner: partners[1], partnerTripId: cherKashmir, seats: 3, monthOffset: 3 });
addBooking({ trip: trips[0], traveler: travelerIds[1], partner: partners[0], partnerTripId: sahalGoa, seats: 4, monthOffset: 2 });
addBooking({ trip: trips[3], traveler: travelerIds[2], partner: null, seats: 1, monthOffset: 2 });
addBooking({ trip: trips[2], traveler: travelerIds[0], partner: partners[1], partnerTripId: cherKerala, seats: 2, monthOffset: 1 });
addBooking({ trip: trips[1], traveler: travelerIds[1], partner: partners[0], partnerTripId: sahalManali, seats: 2, monthOffset: 1 });
addBooking({ trip: trips[6], traveler: travelerIds[2], partner: partners[1], partnerTripId: cherKashmir, seats: 1, monthOffset: 0 });
addBooking({ trip: trips[4], traveler: travelerIds[0], partner: null, seats: 2, monthOffset: 0 });

await db.collection("bookings").insertMany(bookings);
await db.collection("payments").insertMany(payments);
if (commissions.length) await db.collection("commissions").insertMany(commissions);

// Update partner earnings + partnerTrip booking counts.
for (const [pid, amount] of Object.entries(earningsByPartner)) {
  await db.collection("partners").updateOne(
    { _id: new mongoose.Types.ObjectId(pid) },
    { $set: { totalEarnings: amount, pendingEarnings: amount } },
  );
}
for (const pt of partnerTrips) {
  await db.collection("partnertrips").updateOne({ _id: pt._id }, { $set: { bookings: pt.bookings } });
}

/* ----------------------------- REVIEWS ----------------------------- */
const reviews = [
  { _id: oid(), trip: trips[0]._id, user: travelerIds[0], rating: 5, comment: "Incredible trip, perfectly organized!", status: "published", createdAt: monthsAgo(4), updatedAt: now },
  { _id: oid(), trip: trips[0]._id, user: travelerIds[1], rating: 4, comment: "Great vibes, loved the beaches.", status: "published", createdAt: monthsAgo(2), updatedAt: now },
  { _id: oid(), trip: trips[2]._id, user: travelerIds[2], rating: 5, comment: "Backwaters were magical.", status: "published", createdAt: monthsAgo(3), updatedAt: now },
  { _id: oid(), trip: trips[6]._id, user: travelerIds[0], rating: 5, comment: "Kashmir is paradise. 10/10.", status: "published", createdAt: monthsAgo(1), updatedAt: now },
];
await db.collection("reviews").insertMany(reviews);
// Update trip ratings.
for (const t of [trips[0], trips[2], trips[6]]) {
  const rs = reviews.filter((r) => String(r.trip) === String(t._id));
  const avg = rs.reduce((a, r) => a + r.rating, 0) / rs.length;
  await db.collection("trips").updateOne({ _id: t._id }, { $set: { rating: Math.round(avg * 10) / 10, reviewCount: rs.length } });
}

/* ----------------------------- WISHLIST ----------------------------- */
await db.collection("wishlists").insertOne({
  _id: oid(), user: travelerIds[0], trips: [trips[3]._id, trips[4]._id], createdAt: now, updatedAt: now,
});

console.log(`✓ Seed complete:
  ${users.length} users  ·  ${partners.length} partners  ·  ${trips.length} trips
  ${partnerTrips.length} white-label links  ·  ${bookings.length} bookings  ·  ${reviews.length} reviews

  Login with password: ${PASSWORD}
   admin     → admin@voibee.com
   partner   → sahal@example.com  (try /p/sahal/goa-beach-escape)
   traveler  → aarav@example.com
`);

await mongoose.disconnect();
process.exit(0);
