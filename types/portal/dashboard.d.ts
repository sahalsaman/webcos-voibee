
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { UserDTO } from "@/types";
export declare function getAdminStats(): Promise<{
    destinations: number;
    activeDestinations: number;
    trips: number;
    activeTrips: number;
    bookings: number;
    partners: number;
    travelers: number;
    revenue: any;
    adminRevenue: any;
}>;
export declare function getAdminCharts(): Promise<{
    trend: {
        month: string;
        bookings: any;
        revenue: any;
    }[];
    topTrips: any[];
    topPartners: {
        name: string;
        earnings: number;
    }[];
}>;
export declare function getRecentBookings(limit?: number): Promise<any[]>;
export declare function listAdminTrips(): Promise<any[]>;
export declare function listAdminBookableTrips(): Promise<any[]>;
export declare function getAdminTripById(id: string): Promise<any>;
export declare function listAdminOfferCards(): Promise<any[]>;
export declare function getAdminOfferCardById(id: string): Promise<any>;
export declare function listAdminDestinations(): Promise<any[]>;
export declare function listAdminActivityTypes(): Promise<any[]>;
export declare function listAdminActivities(): Promise<any[]>;
export declare function listAdminActivityBookings(): Promise<any[]>;
export declare function getAdminDestinationById(id: string): Promise<any>;
export declare function listAdminTravelers(): Promise<UserDTO[]>;
export declare function getAdminFinanceSummary(): Promise<{
    totals: any;
    paymentsByStatus: any[];
    commissionsByStatus: any[];
    recentPayments: any[];
}>;
export declare function listAdminEarnings(): Promise<any[]>;
export declare function listAdminEmployees(): Promise<any[]>;
export declare function getAdminEmployeeById(id: string): Promise<any>;
export declare function listAdminBookings(): Promise<any[]>;
export declare function listAdminPartners(): Promise<any[]>;
export declare function listAdminSuppliers(): Promise<any[]>;
export declare function getAdminSupplierById(id: string): Promise<any>;
export declare function listAdminCampaigns(): Promise<{
    leadCount: any;
}[]>;
export declare function listAdminPayroll(): Promise<any[]>;
export declare function listAdminQuotations(): Promise<any[]>;
export declare function listAdminLeads(campaignId?: string): Promise<any[]>;
export declare function listAdminVisas(): Promise<any[]>;
export declare function listAdminTickets(): Promise<any[]>;
export declare function listAdminHotelReservations(): Promise<any[]>;
export declare function listAdminExpenses(): Promise<any[]>;
export declare function listAdminInvoices(): Promise<any[]>;
export declare function listAdminReputation(): Promise<any[]>;
export declare function getAdminReputationSummary(): Promise<{
    total: number;
    unresolved: number;
    negative: number;
    averageRating: number;
}>;
export declare function listAdminAttendance(): Promise<any[]>;
export declare function listAttendanceRegularizations(): Promise<any[]>;
export declare function listAdminPerformanceReviews(): Promise<any[]>;
export declare function listAdminLeaveRequests(): Promise<any[]>;
export declare function listAdminHrTasks(): Promise<any[]>;
export declare function getPartnerByUser(userId: string): Promise<any>;
export declare function getPartnerStats(partnerId: string): Promise<{
    bookings: number;
    activeLinks: number;
    clicks: any;
    conversion: number;
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
}>;
export declare function getPartnerEarningsChart(partnerId: string): Promise<{
    month: string;
    earnings: any;
}[]>;
export declare function getPartnerLinks(partnerId: string): Promise<any[]>;
export declare function getPartnerBookings(partnerId: string): Promise<any[]>;
export declare function getPartnerCommissions(partnerId: string): Promise<any[]>;
/** Active packages a partner can resell, annotated with whether a link exists. */
export declare function getResellableTrips(partnerId: string): Promise<{
    existingCommission: any;
    _id: string;
}[]>;
export declare function getTravelerBookings(userId: string): Promise<any[]>;
export declare function getTravelerWishlist(userId: string): Promise<unknown[]>;
