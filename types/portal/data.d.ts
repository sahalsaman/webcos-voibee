
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TripDTO, PartnerDTO, ReviewDTO, DestinationDTO, OfferCardDTO, ActivityDTO, ActivityTypeDTO } from "@/types";
export declare function isIndiaCountry(code?: string): boolean;
export declare function getActivityTypes(): Promise<ActivityTypeDTO[]>;
export declare function getActivities(filters?: {
    q?: string;
    type?: string;
    seasonal?: boolean;
    bestSelling?: boolean;
    limit?: number;
}): Promise<ActivityDTO[]>;
export declare function getActivityBySlug(slug: string): Promise<ActivityDTO | null>;
export declare function getDestinations(countryCode?: string): Promise<DestinationDTO[]>;
export declare function getHomeDestinations(countryCode?: string): Promise<{
    domestic: DestinationDTO[];
    international: DestinationDTO[];
}>;
export declare function getDestinationLanding(slug: string): Promise<{
    destination: DestinationDTO | {
        _id: any;
        title: any;
        description: string;
        images: any;
        basePrice: number;
        status: "active";
        featured: boolean;
        tags: never[];
        popular: boolean;
        country: any;
        countryCode: string;
        createdAt: string;
    };
    trips: TripDTO[];
} | null>;
export declare function getOfferCards(countryCode?: string, limit?: number): Promise<OfferCardDTO[]>;
export interface TripFilters {
    q?: string;
    destination?: string;
    country?: string;
    category?: string;
    categories?: readonly string[];
    excludeCategories?: readonly string[];
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: "newest" | "price-asc" | "price-desc" | "rating";
    page?: number;
    pageSize?: number;
}
export declare function getTripCategoryCounts(filters?: TripFilters): Promise<Record<string, number>>;
export declare function getTrips(filters?: TripFilters): Promise<{
    items: TripDTO[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}>;
export declare function getFeaturedTrips(limit?: number): Promise<TripDTO[]>;
export declare function getTripsByCategory(category: string, limit?: number): Promise<TripDTO[]>;
export declare function getTripBySlug(slug: string): Promise<TripDTO | null>;
export declare function getRelatedTrips(tripId: string, destination: string, limit?: number): Promise<TripDTO[]>;
export declare function getReviewsForTrip(tripId: string): Promise<ReviewDTO[]>;
export declare function getPartnerBySlug(slug: string): Promise<PartnerDTO | null>;
/** Resolve a white-label listing for /p/<partnerSlug>/<tripSlug>. */
export declare function getWhiteLabelTrip(partnerSlug: string, tripSlug: string): Promise<{
    _id: string;
    trip: TripDTO;
    partner: PartnerDTO;
    commission: number;
    sellingPrice: number;
    active: boolean;
} | null>;
/** Partner storefront for /p/<partnerSlug>, listing selected trips. */
export declare function getPartnerStorefront(partnerSlug: string): Promise<{
    partner: PartnerDTO;
    links: {
        _id: string;
        tripSlug: string;
        commission: number;
        sellingPrice: number;
        active: boolean;
        clicks: number;
        bookings: number;
        trip: TripDTO | null;
    }[];
} | null>;
/** Fire-and-forget click counter for white-label links. */
export declare function trackPartnerTripClick(partnerSlug: string, tripSlug: string): Promise<void>;
export declare function getHomeStats(): Promise<{
    trips: number;
    partners: number;
    bookings: number;
    travelers: number;
}>;
