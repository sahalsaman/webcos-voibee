import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const travelerRegisterSchema = z.object({
  name: z.string().trim().min(2, "Name is too short"),
  email: z.string().email("Enter a valid email").optional(),
  mobile: z.string().trim().regex(/^\+?[1-9]\d{6,14}$/, "Enter a valid mobile number with country code"),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type TravelerRegisterInput = z.infer<typeof travelerRegisterSchema>;
