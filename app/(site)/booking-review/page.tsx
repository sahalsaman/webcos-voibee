import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActivities, getTripBySlug } from "@/lib/data";
import { BookingReview } from "@/components/booking/booking-review";

export const metadata: Metadata = { title: "Review your booking", robots: { index: false, follow: false } };

export default async function BookingReviewPage({ searchParams }: { searchParams: Promise<{ package?: string }> }) {
  const slug = (await searchParams).package;
  if (!slug) notFound();
  const [trip, activities] = await Promise.all([getTripBySlug(slug), getActivities({ limit: 100 })]);
  if (!trip) notFound();
  const hasActivities = activities.some((activity) => activity.country.trim().toLowerCase() === trip.country.trim().toLowerCase());
  return <BookingReview hasActivities={hasActivities} trip={{ _id: trip._id, slug: trip.slug, title: trip.title, destination: trip.destination, country: trip.country, image: trip.images[0] || "", basePrice: trip.basePrice }} />;
}
