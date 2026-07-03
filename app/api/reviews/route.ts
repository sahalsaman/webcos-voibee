import { connectDB } from "@/lib/db";
import { ok, fail, handleError, currentUser } from "@/lib/api";
import "@/models";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";

/** Traveler: post or update a review for a trip they've booked. */
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return fail("Please log in to review", 401);

    const { tripId, rating, comment } = await request.json();
    if (!tripId || !rating || rating < 1 || rating > 5) {
      return fail("A rating between 1 and 5 is required", 400);
    }

    await connectDB();

    // Only travelers who actually booked may review.
    const booked = await Booking.exists({
      trip: tripId,
      traveler: user.id,
      paymentStatus: "paid",
    });
    if (!booked) return fail("You can only review trips you've booked", 403);

    await Review.findOneAndUpdate(
      { trip: tripId, user: user.id },
      { rating, comment: comment ?? "", status: "published" },
      { upsert: true, new: true },
    );

    // Recompute aggregate rating.
    const agg = await Review.aggregate([
      { $match: { trip: (await Trip.findById(tripId))?._id, status: "published" } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    const { avg = 0, count = 0 } = agg[0] ?? {};
    await Trip.updateOne(
      { _id: tripId },
      { rating: Math.round(avg * 10) / 10, reviewCount: count },
    );

    return ok({ rating: Math.round(avg * 10) / 10, reviewCount: count });
  } catch (err) {
    return handleError(err);
  }
}
