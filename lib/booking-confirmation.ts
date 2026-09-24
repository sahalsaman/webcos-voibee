import { portalCall } from "@/lib/portal-client";
import type * as Contract from "@/types/portal/booking-confirmation";
export type { BookingConfirmation } from "@/types/portal/booking-confirmation";
export const getAuthorizedBookingConfirmation = (...args: Parameters<typeof Contract.getAuthorizedBookingConfirmation>): ReturnType<typeof Contract.getAuthorizedBookingConfirmation> => portalCall("getAuthorizedBookingConfirmation", args);
