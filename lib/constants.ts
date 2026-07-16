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
export const DESTINATION_STATUSES = ["active", "inactive"] as const;
export const OFFER_CARD_STATUSES = ["active", "inactive"] as const;
export const EMPLOYEE_STATUSES = ["active", "inactive"] as const;
export type TripStatus = (typeof TRIP_STATUSES)[number];
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

export const COUNTRY_OPTIONS = [
  { name: "India", code: "IN", currency: "INR", symbol: "₹" },
  { name: "United Arab Emirates", code: "AE", currency: "AED", symbol: "د.إ" },
  { name: "Indonesia", code: "ID", currency: "IDR", symbol: "Rp" },
  { name: "Maldives", code: "MV", currency: "MVR", symbol: "Rf" },
  { name: "Singapore", code: "SG", currency: "SGD", symbol: "S$" },
  { name: "Thailand", code: "TH", currency: "THB", symbol: "฿" },
  { name: "Malaysia", code: "MY", currency: "MYR", symbol: "RM" },
  { name: "Vietnam", code: "VN", currency: "VND", symbol: "₫" },
  { name: "Sri Lanka", code: "LK", currency: "LKR", symbol: "Rs" },
  { name: "Azerbaijan", code: "AZ", currency: "AZN", symbol: "₼" },
  { name: "Georgia", code: "GE", currency: "GEL", symbol: "₾" },
  { name: "Turkey", code: "TR", currency: "TRY", symbol: "₺" },
  { name: "Japan", code: "JP", currency: "JPY", symbol: "¥" },
  { name: "France", code: "FR", currency: "EUR", symbol: "€" },
] as const;
export type CountryOption = (typeof COUNTRY_OPTIONS)[number];

export const TRIP_CATEGORIES = [
  "Adventure",
  "Honeymoon",
  "Family",
  "Group",
  "Solo",
  "Luxury",
  "Wellness & spa",
  "Spiritual",
  "Festival",
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
