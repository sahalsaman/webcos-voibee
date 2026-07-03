import { connectDB } from "@/lib/db";
import { ok, fail, handleError, currentUser } from "@/lib/api";
import { verifySignature, razorpayConfigured } from "@/lib/razorpay";
import "@/models";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import Trip from "@/models/Trip";
import Partner from "@/models/Partner";
import PartnerTrip from "@/models/PartnerTrip";
import Commission from "@/models/Commission";
import Notification from "@/models/Notification";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return fail("Authentication required", 401);

    const body = await request.json();
    const { bookingId } = body as { bookingId?: string };
    if (!bookingId) return fail("Missing booking reference", 400);

    await connectDB();
    const booking = await Booking.findById(bookingId);
    if (!booking) return fail("Booking not found", 404);
    if (String(booking.traveler) !== user.id) return fail("Forbidden", 403);

    // Idempotent: already confirmed → return success.
    if (booking.paymentStatus === "paid") {
      return ok({ bookingNumber: booking.bookingNumber, alreadyConfirmed: true });
    }

    const payment = await Payment.findById(booking.payment);

    // Verify the gateway signature unless we're in demo (mock) mode.
    const isMock = body.mock === true || !razorpayConfigured;
    if (!isMock) {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
      const valid =
        razorpay_order_id &&
        razorpay_payment_id &&
        razorpay_signature &&
        verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      if (!valid) {
        if (payment) {
          payment.status = "failed";
          await payment.save();
        }
        booking.paymentStatus = "failed";
        await booking.save();
        return fail("Payment verification failed", 400);
      }
      if (payment) {
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
      }
    }

    if (payment) {
      payment.status = "paid";
      await payment.save();
    }

    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    await booking.save();

    // Decrement seats atomically (best effort — never oversell silently).
    await Trip.updateOne(
      { _id: booking.trip, availableSeats: { $gte: booking.seats } },
      { $inc: { availableSeats: -booking.seats } },
    );

    // Partner commission ledger + earnings.
    if (booking.partner && booking.partnerEarnings > 0) {
      await Commission.updateOne(
        { booking: booking._id },
        {
          $setOnInsert: {
            booking: booking._id,
            partner: booking.partner,
            trip: booking.trip,
            amount: booking.partnerEarnings,
            platformFee: booking.platformFee,
            status: "pending",
          },
        },
        { upsert: true },
      );
      await Partner.updateOne(
        { _id: booking.partner },
        {
          $inc: {
            totalEarnings: booking.partnerEarnings,
            pendingEarnings: booking.partnerEarnings,
          },
        },
      );
      if (booking.partnerTrip) {
        await PartnerTrip.updateOne(
          { _id: booking.partnerTrip },
          { $inc: { bookings: 1 } },
        );
      }
    }

    // Notifications (in-app).
    const trip = await Trip.findById(booking.trip).select("title").lean<{ title: string }>();
    await Notification.create({
      user: booking.traveler,
      type: "booking",
      title: "Booking confirmed 🎉",
      message: `Your booking ${booking.bookingNumber} for "${trip?.title ?? "your trip"}" is confirmed.`,
    });

    return ok({ bookingNumber: booking.bookingNumber });
  } catch (err) {
    return handleError(err);
  }
}
