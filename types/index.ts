import type {
  Role,
  TripStatus,
  TripCategory,
  PartnerStatus,
  PartnerType,
  BookingStatus,
  PaymentStatus,
  CommissionStatus,
} from "@/lib/constants";

/** Plain (serialized) shapes returned to client components. */

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface TripDTO {
  _id: string;
  title: string;
  slug: string;
  destination: string;
  description: string;
  images: string[];
  videos: string[];
  itinerary: ItineraryItem[];
  inclusions: string[];
  exclusions: string[];
  basePrice: number;
  totalSeats: number;
  availableSeats: number;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  category: TripCategory;
  status: TripStatus;
  featured: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface UserDTO {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: Role;
  image?: string;
}

export interface PartnerDTO {
  _id: string;
  user: string | UserDTO;
  businessName: string;
  slug: string;
  partnerType: PartnerType;
  logo?: string;
  bannerImage?: string;
  profileImage?: string;
  bio?: string;
  socialLinks?: { label: string; url: string }[];
  contactEmail?: string;
  contactPhone?: string;
  status: PartnerStatus;
  defaultCommission: number;
  totalEarnings: number;
  pendingEarnings: number;
}

export interface PartnerTripDTO {
  _id: string;
  partner: string | PartnerDTO;
  trip: string | TripDTO;
  partnerSlug: string;
  tripSlug: string;
  commission: number;
  sellingPrice: number;
  active: boolean;
  clicks: number;
  bookings: number;
}

export interface BookingDTO {
  _id: string;
  bookingNumber: string;
  trip: string | TripDTO;
  traveler: string | UserDTO;
  partner?: string | PartnerDTO | null;
  travelerDetails: {
    name: string;
    email: string;
    mobile: string;
    travellers: number;
    notes?: string;
  };
  seats: number;
  basePrice: number;
  commission: number;
  platformFee: number;
  sellingPrice: number;
  totalAmount: number;
  partnerEarnings: number;
  adminEarnings: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface CommissionDTO {
  _id: string;
  booking: string;
  partner: string;
  trip: string;
  amount: number;
  platformFee: number;
  status: CommissionStatus;
  createdAt: string;
}

export interface ReviewDTO {
  _id: string;
  trip: string;
  user: UserDTO;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
