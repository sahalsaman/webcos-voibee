import { z } from "zod";
import {
  TRIP_CATEGORIES,
  TRIP_STATUSES,
  PARTNER_TYPES,
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

export const tripSchema = z.object({
  title: z.string().trim().min(3),
  destination: z.string().trim().min(2),
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
  basePrice: z.number().nonnegative(),
  totalSeats: z.number().int().nonnegative().default(0),
  availableSeats: z.number().int().nonnegative().default(0),
  startDate: z.string(),
  endDate: z.string(),
  pickupLocation: z.string().default(""),
  category: z.enum(TRIP_CATEGORIES).default("Aug 2026"),
  status: z.enum(TRIP_STATUSES).default("draft"),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const whiteLabelSchema = z.object({
  tripId: z.string().min(1),
  commission: z.number().nonnegative(),
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
export type TripInput = z.infer<typeof tripSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
