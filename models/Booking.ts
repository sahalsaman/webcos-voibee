import { Schema, model, models, type InferSchemaType } from "mongoose";
import { BOOKING_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

const TravelerDetailsSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    travellers: { type: Number, default: 1, min: 1 },
    notes: String,
  },
  { _id: false },
);

const BookingSchema = new Schema(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    trip: { type: Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
    traveler: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    // Set when booked through a white-label link; null for direct bookings.
    partner: { type: Schema.Types.ObjectId, ref: "Partner", default: null, index: true },
    partnerTrip: { type: Schema.Types.ObjectId, ref: "PartnerTrip", default: null },

    travelerDetails: { type: TravelerDetailsSchema, required: true },
    seats: { type: Number, required: true, min: 1 },

    // Pricing snapshot at time of booking (per seat unless noted).
    basePrice: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    platformFee: { type: Number, default: 0 }, // total
    sellingPrice: { type: Number, required: true }, // per seat
    totalAmount: { type: Number, required: true }, // traveler pays (total)
    partnerEarnings: { type: Number, default: 0 }, // total
    adminEarnings: { type: Number, default: 0 }, // total

    status: { type: String, enum: BOOKING_STATUSES, default: "pending", index: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "created", index: true },
    payment: { type: Schema.Types.ObjectId, ref: "Payment", default: null },
  },
  { timestamps: true },
);

export type BookingDoc = InferSchemaType<typeof BookingSchema> & { _id: string };

export default models.Booking || model("Booking", BookingSchema);
