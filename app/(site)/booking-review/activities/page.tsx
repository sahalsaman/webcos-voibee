import { notFound } from "next/navigation";
import { ActivityPicker } from "@/components/booking/activity-picker";
import { getActivities, getTripBySlug } from "@/lib/data";

export default async function BookingActivitiesPage({ searchParams }: { searchParams: Promise<{ package?: string }> }) {
  const slug = (await searchParams).package;
  if (!slug) notFound();
  const [trip, allActivities] = await Promise.all([getTripBySlug(slug), getActivities({ limit: 100 })]);
  if (!trip) notFound();
  const activities = allActivities.filter((activity) => activity.country.trim().toLowerCase() === trip.country.trim().toLowerCase()).map((activity) => ({ _id: activity._id, title: activity.title, basePrice: activity.basePrice, image: activity.images[0] || "", duration: activity.duration, destination: activity.destination, country: activity.country, shortDescription: activity.shortDescription }));
  return <ActivityPicker packageSlug={trip.slug} activities={activities} />;
}
