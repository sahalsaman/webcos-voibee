import { connectDB } from "@/lib/db";
import { ok, fail, handleError, requireApiRole } from "@/lib/api";
import { adminManualBookingSchema } from "@/lib/validations";
import { shortId } from "@/lib/utils";
import "@/models";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import Trip from "@/models/Trip";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await requireApiRole(["admin"]);
    const body = adminManualBookingSchema.parse(await request.json());
    await connectDB();

    const trip = await Trip.findById(body.tripId);
    if (!trip || trip.status !== "active") return fail("This trip is not available for booking", 404);
    if (trip.availableSeats < body.seats) {
      return fail(`Only ${trip.availableSeats} seat(s) left`, 409);
    }

    const traveler = await User.findOneAndUpdate(
      { email: body.travelerDetails.email.toLowerCase() },
      {
        $setOnInsert: {
          name: body.travelerDetails.name,
          email: body.travelerDetails.email.toLowerCase(),
          mobile: body.travelerDetails.mobile,
          role: "traveler",
        },
        $set: {
          mobile: body.travelerDetails.mobile,
        },
      },
      { upsert: true, new: true },
    );

    const totalAmount = trip.basePrice * body.seats;
    const bookingNumber = shortId("VOI-");

    const booking = await Booking.create({
      bookingNumber,
      trip: trip._id,
      traveler: traveler._id,
      travelerDetails: {
        ...body.travelerDetails,
        travellers: body.travelerDetails.travellers || body.seats,
      },
      seats: body.seats,
      basePrice: trip.basePrice,
      commission: 0,
      platformFee: 0,
      sellingPrice: trip.basePrice,
      totalAmount,
      partnerEarnings: 0,
      adminEarnings: totalAmount,
      status: body.status,
      paymentStatus: body.paymentStatus,
    });

    if (["created", "paid", "failed", "refunded"].includes(body.paymentStatus)) {
      const payment = await Payment.create({
        booking: booking._id,
        amount: totalAmount,
        currency: "INR",
        status: body.paymentStatus,
        notes: { manual: true },
      });
      booking.payment = payment._id;
      await booking.save();
    }

    trip.availableSeats = Math.max(0, trip.availableSeats - body.seats);
    await trip.save();

    return ok({ id: String(booking._id), bookingNumber }, 201);
  } catch (err) {
    return handleError(err);
  }
}
