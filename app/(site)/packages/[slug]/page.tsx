import type { Metadata } from "next";
import Script from "next/script";
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
import { PackageServiceIcons, resolveIncludedServices } from "@/components/trip/package-service-icons";
import { DetailedItinerary } from "@/components/trip/detailed-itinerary";
import { PackageActions } from "@/components/trip/package-actions";
import {
  getTripBySlug,
  getReviewsForTrip,
  getRelatedTrips,
} from "@/lib/data";
import { isCustomDateTripCategory } from "@/lib/constants";
import { formatDate, tripDuration } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.voibee.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return { title: "Package not found" };
  return {
    title: `${trip.title} | ${trip.destination} Tour Package`,
    description: trip.description?.slice(0, 160),
    keywords: [trip.title, `${trip.destination} packages`, `${trip.destination} tour package`, `${trip.destination} holiday package`, trip.category, ...trip.tags],
    alternates: { canonical: `/packages/${trip.slug}` },
    openGraph: {
      type: "website",
      url: `/packages/${trip.slug}`,
      title: `${trip.title} | ${trip.destination} Tour Package`,
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

  const customDate = trip.holidayPackage ?? isCustomDateTripCategory(trip.category);
  const configuredDays = trip.durationDays || trip.itinerary.length;
  const { label: duration } = tripDuration(trip.startDate, trip.endDate, configuredDays);
  const scheduleLabel = duration;
  const includedServices = resolveIncludedServices(trip.includedServices, trip.inclusions);
  const hasInclusions = trip.inclusions.length > 0;
  const hasExclusions = trip.exclusions.length > 0;
  const hasInclusionDetails = hasInclusions || hasExclusions;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Product", "TouristTrip"],
        "@id": `${appUrl}/packages/${trip.slug}#package`,
        name: trip.title,
        description: trip.description,
        url: `${appUrl}/packages/${trip.slug}`,
        image: trip.images,
        category: "Travel Package",
        touristType: trip.category,
        brand: { "@type": "Brand", name: "Voibee Holidays" },
        hasPart: trip.itinerary.map((item) => ({ "@type": "TouristAttraction", name: `Day ${item.day}: ${item.title}`, description: item.description })),
        offers: {
          "@type": "Offer",
          url: `${appUrl}/packages/${trip.slug}`,
          price: trip.basePrice,
          priceCurrency: "INR",
          availability: customDate || trip.availableSeats > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        },
        ...(trip.reviewCount > 0 ? { aggregateRating: { "@type": "AggregateRating", ratingValue: trip.rating, reviewCount: trip.reviewCount } } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: appUrl },
          { "@type": "ListItem", position: 2, name: "Holiday Packages", item: `${appUrl}/packages` },
          { "@type": "ListItem", position: 3, name: trip.title, item: `${appUrl}/packages/${trip.slug}` },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-white">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Script
        id={`package-${slug}-jsonld`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Gallery images={trip.images} title={trip.title} />

      {/* Package summary */}
      <section id="summary" className="py-7 sm:py-9">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{scheduleLabel}</Badge>
          <Badge>{trip.category}</Badge>
          {trip.featured ? <Badge variant="accent">Featured</Badge> : null}
        </div>
        <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{trip.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-4 text-primary" /> {trip.destination}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-4 text-primary" /> {scheduleLabel}
          </span>
          {trip.rating > 0 ? (
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-warning text-warning" />
              {trip.rating.toFixed(1)} ({trip.reviewCount} reviews)
            </span>
          ) : null}
            </div>
          </div>
          {trip.rating > 0 ? <div className="hidden min-w-24 rounded-2xl border border-border bg-white p-3 text-center shadow-sm sm:block"><p className="text-xl font-extrabold">{trip.rating.toFixed(1)}</p><div className="my-1 flex justify-center"><Star className="size-4 fill-warning text-warning" /></div><p className="text-xs text-muted-foreground">{trip.reviewCount} reviews</p></div> : null}
        </div>
        {includedServices.length ? <PackageServiceIcons includedServices={includedServices} showcase className="mt-7" /> : null}
      </section>

      <div className="sticky top-16 z-20 mb-9 flex items-center justify-between gap-4 border-y border-border bg-white/95 py-2 backdrop-blur">
        <nav className="flex items-center gap-1 overflow-x-auto sm:gap-4" aria-label="Package sections">
          <a href="#itinerary" className="border-b-2 border-primary px-3 py-3 text-sm font-bold text-primary sm:px-4">Itinerary</a>
          {hasInclusionDetails ? <a href="#inclusions" className="border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-slate-600 hover:text-primary sm:px-4">Inclusions</a> : null}
          <a href="#summary" className="border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-slate-600 hover:text-primary sm:px-4">Summary</a>
        </nav>
        <div className="hidden sm:block"><PackageActions slug={trip.slug} title={trip.title} /></div>
      </div>
      <div className="mb-7 flex justify-end sm:hidden"><PackageActions slug={trip.slug} title={trip.title} /></div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-10">

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

          <section id="itinerary" className="scroll-mt-32">
            {trip.itinerary?.length ? <DetailedItinerary days={trip.itinerary} /> : null}
          </section>

          {/* Inclusions / Exclusions */}
          {hasInclusionDetails ? <section id="inclusions" className={`grid scroll-mt-32 gap-6 rounded-2xl border border-border/70 p-5 sm:p-6 ${hasInclusions && hasExclusions ? "sm:grid-cols-2" : ""}`}>
            {hasInclusions ? <div>
              <h2 className="mb-3 text-xl font-semibold">What&apos;s included</h2>
              <ul className="space-y-2">
                {trip.inclusions.map(
                  (inc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                      {inc}
                    </li>
                  ),
                )}
              </ul>
            </div> : null}
            {hasExclusions ? <div>
              <h2 className="mb-3 text-xl font-semibold">Not included</h2>
              <ul className="space-y-2">
                {trip.exclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                    {exc}
                  </li>
                ))}
              </ul>
            </div> : null}
          </section> : null}

          {/* Reviews */}
          {reviews.length ? <section>
            <h2 className="mb-4 text-xl font-semibold">
              Reviews ({reviews.length})
            </h2>
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
          </section> : null}
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
            country={trip.country}
            departureCities={trip.departureCities}
            durationDays={configuredDays}
            customDate={customDate}
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
    </main>
  );
}
