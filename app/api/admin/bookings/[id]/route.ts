import { connectDB } from "@/lib/db";
import { ok, fail, handleError, requireApiRole } from "@/lib/api";
import { adminBookingTravelerSchema } from "@/lib/validations";
import "@/models";
import Booking from "@/models/Booking";
import User from "@/models/User";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  try {
    await requireApiRole(["admin"]);
    const { id } = await params;
    const data = adminBookingTravelerSchema.parse(await request.json());
    await connectDB();

    const booking = await Booking.findById(id);
    if (!booking) return fail("Booking not found", 404);

    const travelerEmail = data.travelerDetails.email.toLowerCase();
    const existingTraveler = await User.findOne({ email: travelerEmail });
    if (existingTraveler && existingTraveler.role !== "traveler") {
      return fail("This email already belongs to an admin or partner account", 409);
    }

    const traveler = await User.findOneAndUpdate(
      { email: travelerEmail },
      {
        $setOnInsert: {
          email: travelerEmail,
          role: "traveler",
        },
        $set: {
          name: data.travelerDetails.name,
          mobile: data.travelerDetails.mobile,
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );

    booking.traveler = traveler._id;
    booking.travelerDetails = {
      ...data.travelerDetails,
      email: travelerEmail,
    };
    await booking.save();

    return ok({ id: String(booking._id), bookingNumber: booking.bookingNumber });
  } catch (err) {
    return handleError(err);
  }
}
