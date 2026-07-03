import { connectDB } from "@/lib/db";
import { ok, fail, handleError, currentUser } from "@/lib/api";
import "@/models";
import Wishlist from "@/models/Wishlist";

/** Traveler: toggle a trip in their wishlist. */
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return fail("Please log in", 401);

    const { tripId } = await request.json();
    if (!tripId) return fail("Trip is required", 400);

    await connectDB();
    const wl = await Wishlist.findOne({ user: user.id });

    if (!wl) {
      await Wishlist.create({ user: user.id, trips: [tripId] });
      return ok({ saved: true });
    }

    const exists = wl.trips.some((t: unknown) => String(t) === tripId);
    if (exists) {
      wl.trips = wl.trips.filter((t: unknown) => String(t) !== tripId);
    } else {
      wl.trips.push(tripId);
    }
    await wl.save();
    return ok({ saved: !exists });
  } catch (err) {
    return handleError(err);
  }
}
