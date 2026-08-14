import { Schema, model, models, type InferSchemaType } from "mongoose";
import { EVENT_STATUSES } from "@/lib/constants";

const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    venue: { type: String, default: "" },
    city: { type: String, required: true, trim: true },
    country: { type: String, default: "India" },
    countryCode: { type: String, default: "IN", index: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, default: null },
    priceLabel: { type: String, default: "" },
    href: { type: String, default: "/packages" },
    ctaLabel: { type: String, default: "Explore packages" },
    status: { type: String, enum: EVENT_STATUSES, default: "active", index: true },
    featured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true },
);

EventSchema.index({ title: "text", description: "text", city: "text", venue: "text", tags: "text" });

export type EventDoc = InferSchemaType<typeof EventSchema> & { _id: string };

export default models.Event || model("Event", EventSchema);
