import { randomBytes } from "crypto";
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
import User from "@/models/User";
import { getSettings } from "@/models/Settings";
import { isCustomDateTripCategory } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    const body = bookingSchema.parse(await request.json());
    await connectDB();

    const trip = await Trip.findById(body.tripId);
    if (!trip || trip.status !== "active") {
      return fail("This package is not available for booking", 404);
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

    const bookingNumber = shortId("VOI-");
    const confirmationToken = randomBytes(24).toString("hex");
    const travelerDetails = {
      ...body.travelerDetails,
      email: body.travelerDetails.email.toLowerCase(),
      travellers: body.travelerDetails.travellers || body.seats,
    };
    const customDate = trip.holidayPackage ?? isCustomDateTripCategory(trip.category);
    if (customDate && (!body.travelStartDate || !body.travelEndDate)) {
      return fail("Travel start and end dates are required for this package", 422);
    }
    const travelStartDate = customDate ? new Date(body.travelStartDate!) : new Date(trip.startDate);
    const travelEndDate = customDate ? new Date(body.travelEndDate!) : new Date(trip.endDate);
    if (travelEndDate < travelStartDate) return fail("Travel end date must be on or after start date", 422);

    let travelerId: string;
    if (user?.role === "traveler") {
      const traveler = await User.findByIdAndUpdate(
        user.id,
        {
          $set: {
            name: travelerDetails.name,
            mobile: travelerDetails.mobile,
          },
        },
        { returnDocument: "after" },
      );
      travelerId = String(traveler?._id ?? user.id);
    } else {
      const traveler = await User.findOneAndUpdate(
        { email: travelerDetails.email },
        {
          $setOnInsert: {
            email: travelerDetails.email,
            role: "traveler",
          },
          $set: {
            name: travelerDetails.name,
            mobile: travelerDetails.mobile,
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );
      travelerId = String(traveler._id);
    }

    const booking = await Booking.create({
      bookingNumber,
      trip: trip._id,
      traveler: travelerId,
      partner: partnerId,
      partnerTrip: partnerTripId,
      travelerDetails,
      seats: body.seats,
      travelStartDate,
      travelEndDate,
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
      try {
        const order = await createOrder(breakdown.travelerPays, bookingNumber);
        if (order?.id) {
          const payment = await Payment.create({
            booking: booking._id,
            razorpayOrderId: order.id,
            amount: breakdown.travelerPays,
            status: "created",
            notes: { confirmationToken },
          });
          booking.payment = payment._id;
          await booking.save();

          return ok({
            bookingId: String(booking._id),
            bookingNumber,
            amount: breakdown.travelerPays,
            razorpayOrderId: order.id,
            keyId: publicKeyId,
            confirmationToken,
            mock: false,
          });
        }
      } catch (gatewayError) {
        console.warn("[booking] Razorpay order creation failed; using mock payment", gatewayError);
      }
    }

    // Demo mode — no gateway configured, or gateway authentication failed.
    const payment = await Payment.create({
      booking: booking._id,
      amount: breakdown.travelerPays,
      status: "created",
      notes: { mock: true, confirmationToken },
    });
    booking.payment = payment._id;
    await booking.save();

    return ok({
      bookingId: String(booking._id),
      bookingNumber,
      amount: breakdown.travelerPays,
      confirmationToken,
      mock: true,
    });
  } catch (err) {
    return handleError(err);
  }
}
