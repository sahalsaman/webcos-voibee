import { Schema, model, models, type InferSchemaType } from "mongoose";
import { PACKAGE_SERVICES, TRIP_STATUSES, TRIP_CATEGORIES } from "@/lib/constants";

const ItinerarySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    transports: {
      type: [{ title: { type: String, required: true, trim: true }, description: { type: String, default: "" }, _id: false }],
      default: [],
    },
    hotels: {
      type: [{ name: { type: String, required: true, trim: true }, description: { type: String, default: "" }, image: { type: String, default: "" }, _id: false }],
      default: [],
    },
    meals: { type: [String], enum: ["breakfast", "lunch", "dinner"], default: [] },
    sightseeing: {
      type: [{ name: { type: String, required: true, trim: true }, description: { type: String, default: "" }, image: { type: String, default: "" }, _id: false }],
      default: [],
    },
  },
  { _id: false },
);

const TripSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    destination: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    itinerary: { type: [ItinerarySchema], default: [] },
    inclusions: { type: [String], default: [] },
    includedServices: { type: [String], enum: PACKAGE_SERVICES, default: [] },
    exclusions: { type: [String], default: [] },
    holidayPackage: { type: Boolean, default: true, index: true },
    basePrice: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, required: true, min: 1, default: 1 },
    totalSeats: { type: Number, default: 0, min: 0 },
    availableSeats: { type: Number, default: 0, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pickupLocation: { type: String, default: "" },
    departureCities: { type: [String], default: [] },
    category: { type: String, enum: TRIP_CATEGORIES, default: "Holiday Package", index: true },
    status: { type: String, enum: TRIP_STATUSES, default: "draft", index: true },
    featured: { type: Boolean, default: false, index: true },
    tags: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    country: { type: String, default: "India" },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Full-text search across the fields used by the search bar.
TripSchema.index({ title: "text", destination: "text", description: "text", tags: "text" });

export type TripDoc = InferSchemaType<typeof TripSchema> & { _id: string };

export default models.Trip || model("Trip", TripSchema);
