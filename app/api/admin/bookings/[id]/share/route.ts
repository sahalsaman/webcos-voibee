import { randomBytes } from "node:crypto";
import { connectDB } from "@/lib/db";
import { fail, handleError, ok, requireApiRole } from "@/lib/api";
import "@/models";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";

type Context = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Context) {
  try {
    await requireApiRole(["admin"]);
    await connectDB();
    const { id } = await params;
    const booking = await Booking.findById(id);
    if (!booking) return fail("Booking not found", 404);

    let payment = booking.payment ? await Payment.findById(booking.payment) : null;
    const existingNotes = payment?.notes && typeof payment.notes === "object" ? payment.notes : {};
    const confirmationToken = existingNotes.confirmationToken || randomBytes(24).toString("hex");

    if (payment) {
      payment.notes = { ...existingNotes, confirmationToken };
      await payment.save();
    } else {
      payment = await Payment.create({
        booking: booking._id,
        amount: booking.totalAmount,
        currency: "INR",
        status: booking.paymentStatus,
        notes: { confirmationToken, generatedForSharing: true },
      });
      booking.payment = payment._id;
      await booking.save();
    }

    const query = new URLSearchParams({ booking: booking.bookingNumber, token: confirmationToken });
    return ok({ path: `/booking-success?${query.toString()}` });
  } catch (error) {
    return handleError(error);
  }
}
