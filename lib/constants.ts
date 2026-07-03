/** Shared enums & option lists used by models, forms and UI. */

export const ROLES = ["admin", "partner", "traveler"] as const;
export type Role = (typeof ROLES)[number];

export const PARTNER_TYPES = [
  "Travel Agency",
  "Travel Influencer",
  "Tour Promoter",
  "Community Leader",
  "Trip Coordinator",
] as const;
export type PartnerType = (typeof PARTNER_TYPES)[number];

export const PARTNER_STATUSES = ["pending", "approved", "suspended"] as const;
export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export const TRIP_STATUSES = ["draft", "active", "inactive", "soldout"] as const;
export type TripStatus = (typeof TRIP_STATUSES)[number];

export const TRIP_CATEGORIES = [
  "Aug 2026",
  "Sep 2026",
  "Oct 2026",
  "Nov 2026",
  "Dec 2026",
  "Jan 2027",
  "Feb 2027",
  "Mar 2027",
] as const;
export type TripCategory = (typeof TRIP_CATEGORIES)[number];

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "created",
  "paid",
  "failed",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const COMMISSION_STATUSES = ["pending", "payable", "paid"] as const;
export type CommissionStatus = (typeof COMMISSION_STATUSES)[number];

export const NOTIFICATION_TYPES = [
  "registration",
  "booking",
  "payment",
  "reminder",
  "payout",
  "system",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

/** Settings singleton defaults (platform fee is configurable). */
export const DEFAULT_SETTINGS = {
  defaultCommission: 1000, // suggested partner commission (INR)
  platformFeePercent: 0, // % of partner commission retained by platform
  platformFeeFlat: 0, // flat INR per booking retained by platform
  currency: "INR",
  minWithdrawal: 1000,
};

export const POPULAR_DESTINATIONS = [
  "Goa",
  "Manali",
  "Kerala",
  "Ladakh",
  "Andaman",
  "Rishikesh",
  "Kashmir",
  "Meghalaya",
  "Spiti",
  "Coorg",
] as const;
