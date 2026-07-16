import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Gallery } from "@/components/trip/gallery";
import { TripCard } from "@/components/trip/trip-card";
import { BookingBox } from "@/components/booking/booking-box";
import {
  getTripBySlug,
  getReviewsForTrip,
  getRelatedTrips,
} from "@/lib/data";
import { formatDate, tripDuration } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return { title: "Trip not found" };
  return {
    title: trip.title,
    description: trip.description?.slice(0, 160),
    openGraph: {
      title: trip.title,
      description: trip.description?.slice(0, 160),
      images: trip.images?.[0] ? [{ url: trip.images[0] }] : undefined,
    },
  };
}

export default async function TripDetailPage({ params }: Props) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) notFound();

  const [reviews, related] = await Promise.all([
    getReviewsForTrip(trip._id),
    getRelatedTrips(trip._id, trip.destination, 3),
  ]);

  const { label: duration } = tripDuration(trip.startDate, trip.endDate);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.title,
    description: trip.description,
    image: trip.images,
    touristType: trip.category,
    offers: {
      "@type": "Offer",
      price: trip.basePrice,
      priceCurrency: "INR",
      availability:
        trip.availableSeats > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
    ...(trip.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: trip.rating,
            reviewCount: trip.reviewCount,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{trip.category}</Badge>
          {trip.featured ? <Badge variant="accent">Featured</Badge> : null}
        </div>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{trip.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-4 text-primary" /> {trip.destination}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4 text-primary" /> {duration}
          </span>
          {trip.rating > 0 ? (
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-warning text-warning" />
              {trip.rating.toFixed(1)} ({trip.reviewCount} reviews)
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left column */}
        <div className="space-y-10">
          <Gallery images={trip.images} title={trip.title} />

          {/* Overview */}
          <section>
            <h2 className="mb-3 text-xl font-semibold">Overview</h2>
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {trip.description || "Detailed overview coming soon."}
            </p>
            {trip.tags?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {trip.tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    <Tag className="size-3" /> {t}
                  </Badge>
                ))}
              </div>
            ) : null}
          </section>

          {/* Itinerary */}
          {trip.itinerary?.length ? (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Itinerary</h2>
              <ol className="relative space-y-6 border-l-2 border-border pl-6">
                {trip.itinerary.map((item) => (
                  <li key={item.day} className="relative">
                    <span className="absolute -left-[31px] flex size-6 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                      {item.day}
                    </span>
                    <h3 className="font-semibold">
                      Day {item.day}: {item.title}
                    </h3>
                    {item.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {/* Inclusions / Exclusions */}
          <section className="grid gap-6 sm:grid-cols-2">
            <div>
              <h2 className="mb-3 text-xl font-semibold">What&apos;s included</h2>
              <ul className="space-y-2">
                {(trip.inclusions.length ? trip.inclusions : ["Details coming soon"]).map(
                  (inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                      {inc}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h2 className="mb-3 text-xl font-semibold">Not included</h2>
              <ul className="space-y-2">
                {(trip.exclusions.length ? trip.exclusions : ["—"]).map((exc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    {exc}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">
              Reviews {reviews.length ? `(${reviews.length})` : ""}
            </h2>
            {reviews.length ? (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={r.user?.image} name={r.user?.name ?? "Traveler"} size={36} />
                      <div>
                        <p className="text-sm font-semibold">
                          {r.user?.name ?? "Traveler"}
                        </p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-3.5 ${
                                i < r.rating
                                  ? "fill-warning text-warning"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {formatDate(r.createdAt)}
                      </span>
                    </div>
                    {r.comment ? (
                      <p className="mt-3 text-sm text-muted-foreground">{r.comment}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No reviews yet — be the first to travel and review this trip!
              </p>
            )}
          </section>
        </div>

        {/* Right column — booking */}
        <aside>
          <BookingBox
            tripId={trip._id}
            slug={trip.slug}
            pricePerPerson={trip.basePrice}
            availableSeats={trip.availableSeats}
            startDate={trip.startDate}
            endDate={trip.endDate}
            pickupLocation={trip.pickupLocation}
          />
        </aside>
      </div>

      {/* Related */}
      {related.length ? (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">You may also like</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <TripCard key={t._id} trip={t} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
