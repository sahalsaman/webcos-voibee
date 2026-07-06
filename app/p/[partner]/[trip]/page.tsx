import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Compass,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Gallery } from "@/components/trip/gallery";
import { BookingBox } from "@/components/booking/booking-box";
import { ThemeToggle } from "@/components/theme-toggle";
import { getWhiteLabelTrip, trackPartnerTripClick } from "@/lib/data";
import { tripDuration } from "@/lib/utils";

type Props = { params: Promise<{ partner: string; trip: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { partner, trip } = await params;
  const wl = await getWhiteLabelTrip(partner, trip);
  if (!wl) return { title: "Trip not found" };
  return {
    title: `${wl.trip.title} · ${wl.partner.businessName}`,
    description: wl.trip.description?.slice(0, 160),
    openGraph: {
      title: `${wl.trip.title} — by ${wl.partner.businessName}`,
      description: wl.trip.description?.slice(0, 160),
      images: wl.trip.images?.[0] ? [{ url: wl.trip.images[0] }] : undefined,
    },
  };
}

const BANNER_FALLBACK =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=70";

export default async function WhiteLabelTripPage({ params }: Props) {
  const { partner, trip } = await params;
  const wl = await getWhiteLabelTrip(partner, trip);
  if (!wl) notFound();

  // Non-blocking click tracking.
  trackPartnerTripClick(partner, trip);

  const { partner: biz, trip: t, sellingPrice, commission } = wl;
  const { label: duration } = tripDuration(t.startDate, t.endDate);
  const price = sellingPrice || t.basePrice + commission;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Partner-branded header */}
      <header className="sticky top-0 z-50 glass border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {biz.logo || biz.profileImage ? (
              <Avatar src={biz.logo || biz.profileImage} name={biz.businessName} size={40} />
            ) : (
              <span className="flex size-10 items-center justify-center rounded-xl bg-brand-gradient font-bold text-white">
                {biz.businessName.charAt(0)}
              </span>
            )}
            <div>
              <p className="font-bold leading-tight">{biz.businessName}</p>
              <p className="text-xs text-muted-foreground">{biz.partnerType}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Banner */}
      <div className="relative h-44 w-full sm:h-56">
        <Image
          src={biz.bannerImage || BANNER_FALLBACK}
          alt={biz.businessName}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      <main className="mx-auto -mt-10 w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{t.category}</Badge>
            <Badge variant="glass">
              <Globe className="size-3" /> Curated by {biz.businessName}
            </Badge>
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{t.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-4 text-primary" /> {t.destination}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-4 text-primary" /> {duration}
            </span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            <Gallery images={t.images} title={t.title} />

            <section>
              <h2 className="mb-3 text-xl font-semibold">Overview</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                {t.description || "Detailed overview coming soon."}
              </p>
            </section>

            {t.itinerary?.length ? (
              <section>
                <h2 className="mb-4 text-xl font-semibold">Itinerary</h2>
                <ol className="relative space-y-6 border-l-2 border-border pl-6">
                  {t.itinerary.map((item) => (
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

            <section className="grid gap-6 sm:grid-cols-2">
              <div>
                <h2 className="mb-3 text-xl font-semibold">What&apos;s included</h2>
                <ul className="space-y-2">
                  {(t.inclusions.length ? t.inclusions : ["Details coming soon"]).map(
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
                  {(t.exclusions.length ? t.exclusions : ["—"]).map((exc, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                      {exc}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <aside>
            <BookingBox
              tripId={t._id}
              slug={t.slug}
              pricePerPerson={price}
              availableSeats={t.availableSeats}
              startDate={t.startDate}
              endDate={t.endDate}
              pickupLocation={t.pickupLocation}
              partnerSlug={partner}
            />
          </aside>
        </div>
      </main>

      {/* Powered by Voibee */}
      <footer className="mt-16 border-t border-border bg-card py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {biz.businessName}</p>
          <Link href="/" className="flex items-center gap-1.5 font-medium hover:text-foreground">
            <Compass className="size-4 text-primary" /> Powered by Voibee
          </Link>
        </div>
      </footer>
    </div>
  );
}
