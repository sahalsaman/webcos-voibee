import { connectDB } from "@/lib/db";
import { ok, fail, handleError, currentUser } from "@/lib/api";
import { bookingSchema } from "@/lib/validations";
import { calculateCommission } from "@/lib/commission";
import { shortId } from "@/lib/utils";
import {
  createOrder,
  razorpayConfigured,
  publicKeyId,
} from "@/lib/razorpay";
import "@/models";
import Trip from "@/models/Trip";
import PartnerTrip from "@/models/PartnerTrip";
import Booking from "@/models/Booking";
import Payment from "@/models/Payment";
import { getSettings } from "@/models/Settings";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) return fail("Please log in to book a trip", 401);

    const body = bookingSchema.parse(await request.json());
    await connectDB();

    const trip = await Trip.findById(body.tripId);
    if (!trip || trip.status !== "active") {
      return fail("This trip is not available for booking", 404);
    }
    if (trip.availableSeats < body.seats) {
      return fail(`Only ${trip.availableSeats} seat(s) left`, 409);
    }

    // Resolve partner commission for white-label bookings.
    let commission = 0;
    let partnerId: string | null = null;
    let partnerTripId: string | null = null;
    if (body.partnerSlug) {
      const pt = await PartnerTrip.findOne({
        partnerSlug: body.partnerSlug,
        tripSlug: trip.slug,
        active: true,
      });
      if (pt) {
        commission = pt.commission;
        partnerId = String(pt.partner);
        partnerTripId = String(pt._id);
      }
    }

    const settings = await getSettings();
    const breakdown = calculateCommission({
      basePrice: trip.basePrice,
      commission,
      seats: body.seats,
      config: {
        platformFeePercent: settings.platformFeePercent,
        platformFeeFlat: settings.platformFeeFlat,
      },
    });

    const bookingNumber = shortId("TNX-");
    const booking = await Booking.create({
      bookingNumber,
      trip: trip._id,
      traveler: user.id,
      partner: partnerId,
      partnerTrip: partnerTripId,
      travelerDetails: body.travelerDetails,
      seats: body.seats,
      basePrice: breakdown.basePrice,
      commission: breakdown.commission,
      platformFee: breakdown.platformFee,
      sellingPrice: breakdown.sellingPrice,
      totalAmount: breakdown.travelerPays,
      partnerEarnings: breakdown.partnerEarns,
      adminEarnings: breakdown.adminReceives,
      status: "pending",
      paymentStatus: "created",
    });

    // Create the payment + Razorpay order (or fall back to demo mode).
    if (razorpayConfigured) {
      const order = await createOrder(breakdown.travelerPays, bookingNumber);
      const payment = await Payment.create({
        booking: booking._id,
        razorpayOrderId: order!.id,
        amount: breakdown.travelerPays,
        status: "created",
      });
      booking.payment = payment._id;
      await booking.save();

      return ok({
        bookingId: String(booking._id),
        bookingNumber,
        amount: breakdown.travelerPays,
        razorpayOrderId: order!.id,
        keyId: publicKeyId,
        mock: false,
      });
    }

    // Demo mode — no gateway configured.
    const payment = await Payment.create({
      booking: booking._id,
      amount: breakdown.travelerPays,
      status: "created",
      notes: { mock: true },
    });
    booking.payment = payment._id;
    await booking.save();

    return ok({
      bookingId: String(booking._id),
      bookingNumber,
      amount: breakdown.travelerPays,
      mock: true,
    });
  } catch (err) {
    return handleError(err);
  }
}
