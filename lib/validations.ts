import { z } from "zod";
import {
  TRIP_CATEGORIES,
  TRIP_STATUSES,
  OFFER_CARD_STATUSES,
  EVENT_STATUSES,
  BOOKING_STATUSES,
  PAYMENT_STATUSES,
  PARTNER_TYPES,
  DESTINATION_STATUSES,
  EMPLOYEE_STATUSES,
  ADMIN_PORTAL_PAGE_KEYS,
} from "@/lib/constants";

const mobile = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const travelerRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  mobile,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const partnerRegisterSchema = travelerRegisterSchema.extend({
  businessName: z.string().trim().min(2, "Business name is required"),
  partnerType: z.enum(PARTNER_TYPES).optional(),
  profileImage: z.string().url().optional().or(z.literal("")),
  socialLinks: z
    .array(z.object({ label: z.string(), url: z.string().url() }))
    .optional(),
});

export const adminPartnerInviteSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  mobile,
  password: z.string().min(6, "Password must be at least 6 characters"),
  businessName: z.string().trim().min(2, "Business name is required"),
  partnerType: z.enum(PARTNER_TYPES).default("Travel Agency"),
  status: z.enum(["pending", "approved"]).default("approved"),
  defaultCommission: z.number().nonnegative().default(1000),
});

export const adminTravelerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email"),
  mobile,
});

export const tripSchema = z.object({
  title: z.string().trim().min(3),
  destination: z.string().trim().min(2),
  country: z.string().trim().default("India"),
  description: z.string().default(""),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  itinerary: z
    .array(
      z.object({
        day: z.number().int().positive(),
        title: z.string(),
        description: z.string().default(""),
      }),
    )
    .default([]),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  packageOptions: z
    .array(
      z.object({
        label: z.string().trim().min(1),
        price: z.number().nonnegative(),
      }),
    )
    .max(1, "One package can have only one duration and one price")
    .default([]),
  holidayPackage: z.boolean().default(true),
  holidayGroup: z.string().trim().default(""),
  basePrice: z.number().nonnegative(),
  totalSeats: z.number().int().nonnegative().default(0),
  availableSeats: z.number().int().nonnegative().default(0),
  startDate: z.string(),
  endDate: z.string(),
  pickupLocation: z.string().default(""),
  category: z.enum(TRIP_CATEGORIES).default("Holiday Package"),
  status: z.enum(TRIP_STATUSES).default("draft"),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const destinationSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().default(""),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  basePrice: z.number().nonnegative().default(0),
  status: z.enum(DESTINATION_STATUSES).default("active"),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  popular: z.boolean().default(false),
  country: z.string().trim().default("India"),
  countryCode: z.string().trim().length(2).default("IN"),
});

export const employeeSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().email(),
  mobile: z.string().trim().optional().or(z.literal("")),
  designation: z.string().trim().min(2),
  department: z.string().trim().default("Operations"),
  status: z.enum(EMPLOYEE_STATUSES).default("active"),
  salary: z.number().nonnegative().default(0),
  joinedAt: z.string().optional().or(z.literal("")),
  portalAccess: z.boolean().default(false),
  portalPassword: z.string().optional().or(z.literal("")),
  portalPages: z.array(z.enum(ADMIN_PORTAL_PAGE_KEYS)).default([]),
  notes: z.string().default(""),
}).superRefine((data, ctx) => {
  if (data.portalAccess && data.portalPages.length === 0) {
    ctx.addIssue({ code: "custom", path: ["portalPages"], message: "Select at least one portal page" });
  }
  if (data.portalPassword && data.portalPassword.length < 6) {
    ctx.addIssue({ code: "custom", path: ["portalPassword"], message: "Password must be at least 6 characters" });
  }
});

export const offerCardSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().default(""),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  href: z.string().trim().min(1).default("/packages"),
  ctaLabel: z.string().trim().default("View packages"),
  priceLabel: z.string().trim().default(""),
  status: z.enum(OFFER_CARD_STATUSES).default("active"),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  tags: z.array(z.string()).default([]),
  country: z.string().trim().default("India"),
  countryCode: z.string().trim().length(2).default("IN"),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2),
  description: z.string().default(""),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  venue: z.string().trim().default(""),
  city: z.string().trim().min(2),
  country: z.string().trim().default("India"),
  countryCode: z.string().trim().length(2).default("IN"),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim().optional().or(z.literal("")),
  priceLabel: z.string().trim().default(""),
  href: z.string().trim().min(1).default("/packages"),
  ctaLabel: z.string().trim().default("Explore packages"),
  status: z.enum(EVENT_STATUSES).default("active"),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  tags: z.array(z.string()).default([]),
});

export const whiteLabelSchema = z.object({
  tripId: z.string().min(1),
  commission: z.number().nonnegative(),
});

export const adminManualBookingSchema = z.object({
  tripId: z.string().min(1),
  seats: z.number().int().positive().max(50),
  status: z.enum(BOOKING_STATUSES).default("confirmed"),
  paymentStatus: z.enum(PAYMENT_STATUSES).default("paid"),
  travelerDetails: z.object({
    name: z.string().trim().min(2),
    email: z.string().email(),
    mobile,
    travellers: z.number().int().positive().default(1),
    notes: z.string().optional(),
  }),
});

export const adminBookingTravelerSchema = z.object({
  travelerDetails: z.object({
    name: z.string().trim().min(2),
    email: z.string().email(),
    mobile,
    travellers: z.number().int().positive().default(1),
    notes: z.string().optional(),
  }),
});

export const bookingSchema = z.object({
  tripId: z.string().min(1),
  partnerSlug: z.string().optional(),
  seats: z.number().int().positive().max(50),
  travelerDetails: z.object({
    name: z.string().trim().min(2),
    email: z.string().email(),
    mobile,
    travellers: z.number().int().positive(),
    notes: z.string().optional(),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type TravelerRegisterInput = z.infer<typeof travelerRegisterSchema>;
export type PartnerRegisterInput = z.infer<typeof partnerRegisterSchema>;
export type AdminPartnerInviteInput = z.infer<typeof adminPartnerInviteSchema>;
export type AdminTravelerInput = z.infer<typeof adminTravelerSchema>;
export type AdminBookingTravelerInput = z.infer<typeof adminBookingTravelerSchema>;
export type TripInput = z.infer<typeof tripSchema>;
export type DestinationInput = z.infer<typeof destinationSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
