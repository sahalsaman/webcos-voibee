import { connectDB } from "@/lib/db";
import { fail, handleError, ok, requireApiRole } from "@/lib/api";
import { isCustomDateTripCategory } from "@/lib/constants";
import { razorpayConfigured, refundPayment } from "@/lib/razorpay";
import "@/models";
import Booking from "@/models/Booking";
import Commission from "@/models/Commission";
import Partner from "@/models/Partner";
import Payment from "@/models/Payment";
import Trip from "@/models/Trip";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Ctx) {
  try {
    await requireApiRole(["admin"]);
    const { id } = await params;
    await connectDB();

    const booking = await Booking.findById(id);
    if (!booking) return fail("Booking not found", 404);
    if (booking.paymentStatus === "refunded") return ok({ alreadyRefunded: true });
    if (booking.paymentStatus !== "paid") return fail("Only a paid booking can be refunded", 409);

    const payment = booking.payment
      ? await Payment.findById(booking.payment)
      : await Payment.findOne({ booking: booking._id }).sort({ createdAt: -1 });
    if (!payment) return fail("Payment record not found", 404);

    let refundId = `manual-${booking.bookingNumber}`;
    if (razorpayConfigured) {
      if (!payment.razorpayPaymentId) return fail("Razorpay payment reference is missing", 409);
      const refund = await refundPayment(payment.razorpayPaymentId, Number(payment.amount));
      if (!refund?.id) return fail("Razorpay did not return a refund reference", 502);
      refundId = refund.id;
    }

    const wasActive = booking.status !== "cancelled";
    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    payment.status = "refunded";
    payment.refundId = refundId;
    payment.refundAmount = Number(payment.amount);
    await Promise.all([booking.save(), payment.save()]);

    if (wasActive) {
      const trip = await Trip.findById(booking.trip).select("category holidayPackage");
      const customDate = trip?.holidayPackage ?? isCustomDateTripCategory(trip?.category);
      if (!customDate) {
        await Trip.updateOne({ _id: booking.trip }, { $inc: { availableSeats: booking.seats } });
      }
      if (booking.partner && Number(booking.partnerEarnings) > 0) {
        const commission = await Commission.findOneAndDelete({ booking: booking._id });
        if (commission) {
          await Partner.updateOne(
            { _id: booking.partner },
            { $inc: { pendingEarnings: -booking.partnerEarnings, totalEarnings: -booking.partnerEarnings } },
          );
        }
      }
    }

    return ok({ refundId, alreadyRefunded: false });
  } catch (error) {
    return handleError(error);
  }
}
