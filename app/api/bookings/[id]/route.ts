import { connectDB } from "@/lib/db";
import { ok, fail, handleError, requireApiRole } from "@/lib/api";
import { BOOKING_STATUSES, isCustomDateTripCategory } from "@/lib/constants";
import "@/models";
import Booking from "@/models/Booking";
import Trip from "@/models/Trip";
import Partner from "@/models/Partner";
import Commission from "@/models/Commission";

type Ctx = { params: Promise<{ id: string }> };

/** Admin: update a booking's operational status. */
export async function PATCH(request: Request, { params }: Ctx) {
  try {
    await requireApiRole(["admin"]);
    const { id } = await params;
    const { status } = await request.json();
    if (!BOOKING_STATUSES.includes(status)) return fail("Invalid status", 400);

    await connectDB();
    const booking = await Booking.findById(id);
    if (!booking) return fail("Booking not found", 404);
    if (booking.status === "cancelled" && status !== "cancelled") {
      return fail("A cancelled booking cannot be reopened. Create a new booking to reserve inventory.", 409);
    }

    const wasActive = booking.status !== "cancelled";
    booking.status = status;
    await booking.save();

    // Cancelling a previously active booking: restore seats & reverse earnings.
    if (status === "cancelled" && wasActive) {
      const trip = await Trip.findById(booking.trip).select("category holidayPackage");
      const customDate = trip?.holidayPackage ?? isCustomDateTripCategory(trip?.category);
      if (!customDate) {
        await Trip.updateOne(
          { _id: booking.trip },
          { $inc: { availableSeats: booking.seats } },
        );
      }
      if (booking.partner && booking.partnerEarnings > 0) {
        await Partner.updateOne(
          { _id: booking.partner },
          {
            $inc: {
              pendingEarnings: -booking.partnerEarnings,
              totalEarnings: -booking.partnerEarnings,
            },
          },
        );
        await Commission.deleteOne({ booking: booking._id });
      }
    }

    return ok({ id: String(booking._id), status });
  } catch (err) {
    return handleError(err);
  }
}
