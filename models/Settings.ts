import { Schema, model, models, type InferSchemaType } from "mongoose";
import { DEFAULT_SETTINGS } from "@/lib/constants";

/** Platform-wide settings singleton (key: "global"). */
const SettingsSchema = new Schema(
  {
    key: { type: String, default: "global", unique: true, index: true },
    defaultCommission: { type: Number, default: DEFAULT_SETTINGS.defaultCommission },
    platformFeePercent: { type: Number, default: DEFAULT_SETTINGS.platformFeePercent },
    platformFeeFlat: { type: Number, default: DEFAULT_SETTINGS.platformFeeFlat },
    currency: { type: String, default: DEFAULT_SETTINGS.currency },
    minWithdrawal: { type: Number, default: DEFAULT_SETTINGS.minWithdrawal },
  },
  { timestamps: true },
);

export type SettingsDoc = InferSchemaType<typeof SettingsSchema> & {
  _id: string;
};

const Settings = models.Settings || model("Settings", SettingsSchema);

/** Get the settings singleton, creating it with defaults if absent. */
export async function getSettings() {
  const existing = await Settings.findOne({ key: "global" }).lean();
  if (existing) return existing;
  return (await Settings.create({ key: "global" })).toObject();
}

export default Settings;
