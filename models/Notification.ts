import { Schema, model, models, type InferSchemaType } from "mongoose";
import { NOTIFICATION_TYPES } from "@/lib/constants";

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPES, default: "system" },
    title: { type: String, required: true },
    message: { type: String, default: "" },
    channel: {
      type: String,
      enum: ["in-app", "email", "whatsapp"],
      default: "in-app",
    },
    read: { type: Boolean, default: false, index: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export type NotificationDoc = InferSchemaType<typeof NotificationSchema> & {
  _id: string;
};

export default models.Notification || model("Notification", NotificationSchema);
