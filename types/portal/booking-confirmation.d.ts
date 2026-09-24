
import type { ItineraryItem } from "@/types";
export interface BookingConfirmation {
    _id: string;
    bookingNumber: string;
    travelerDetails: {
        name: string;
        email: string;
        mobile: string;
        travellers: number;
        departureCity?: string;
        adults?: number;
        childrenWithBed?: number;
        childrenWithoutBed?: number;
        infants?: number;
        notes?: string;
    };
    seats: number;
    travelStartDate: string;
    travelEndDate: string;
    sellingPrice: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
    trip: {
        title: string;
        slug: string;
        destination: string;
        country: string;
        pickupLocation?: string;
        images: string[];
        itinerary: ItineraryItem[];
    };
    payment?: {
        razorpayOrderId?: string;
        razorpayPaymentId?: string;
        method?: string;
        currency?: string;
        notes?: {
            confirmationToken?: string;
        };
    };
}
export declare function getAuthorizedBookingConfirmation(reference: string, token?: string): Promise<BookingConfirmation | null>;
