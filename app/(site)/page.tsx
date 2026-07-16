import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  ShieldCheck,
  Wallet,
  Headphones,
  ArrowRight,
  Quote,
  Star,
  Mountain,
  Heart,
  Users,
  UserRound,
  Gem,
  Leaf,
  Sparkles,
  Flower2,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TripCard } from "@/components/trip/trip-card";
import { SearchBar } from "@/components/home/search-bar";
import { OfferCarousel, type OfferSlide } from "@/components/home/offer-carousel";
import { getFeaturedTrips, getHomeDestinations, getOfferCards, isIndiaCountry } from "@/lib/data";
import { destinationImage } from "@/lib/images";
import { formatCurrencyForCountry } from "@/lib/utils";
import { TRIP_CATEGORIES } from "@/lib/constants";
import type { DestinationDTO, OfferCardDTO } from "@/types";

// Re-fetch featured trips from the DB at most once a minute.
export const revalidate = 60;

const HERO_BG =
  "/hero-bg.png";

const WHY = [
  {
    icon: ShieldCheck,
    title: "Curated & verified trips",
    desc: "Every package is operated by vetted teams with transparent itineraries and pricing.",
  },
  {
    icon: Wallet,
    title: "Simple, secure booking",
    desc: "Reserve your seat with transparent pricing, clear inclusions and secure payments.",
  },
  {
    icon: Headphones,
    title: "Support that travels",
    desc: "Real humans before, during and after your journey across every destination.",
  },
];

const TESTIMONIALS = [
  {
    name: "Aarav Mehta",
    role: "Traveler · Manali",
    text: "Booking was effortless and the trip exceeded expectations. The itinerary was clear, comfortable and exactly what we wanted.",
  },
  {
    name: "Neha Iyer",
    role: "Traveler · Goa",
    text: "The whole trip felt smooth from the first search to the final day. Loved having support whenever we needed it.",
  },
  {
    name: "Sara Khan",
    role: "Traveler · Dubai",
    text: "Voibee made comparing packages easy, and the booking details were transparent before we paid.",
  },
];

const TRIP_THEME_DETAILS = [
  { name: "Adventure", icon: Mountain },
  { name: "Honeymoon", icon: Heart },
  { name: "Family", icon: Users },
  { name: "Group", icon: Sparkles },
  { name: "Solo", icon: UserRound },
  { name: "Luxury", icon: Gem },
  { name: "Wellness & spa", icon: Leaf },
  { name: "Spiritual", icon: Flower2 },
  { name: "Festival", icon: PartyPopper },
] satisfies Array<{
  name: (typeof TRIP_CATEGORIES)[number];
  icon: typeof Compass;
}>;

type SP = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function hrefWithCountry(path: string, country?: string) {
  const code = country?.toUpperCase();
  return code ? `${path}${path.includes("?") ? "&" : "?"}c=${encodeURIComponent(code)}` : path;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const country = str(sp.c)?.toUpperCase();
  const showDomestic = isIndiaCountry(country);
  const [featured, homeDestinations, offerCards] = await Promise.all([
    getFeaturedTrips(6),
    getHomeDestinations(country),
    getOfferCards(country, 4),
  ]);
  const heroDestinations = showDomestic
    ? [...homeDestinations.domestic.slice(0, 3), ...homeDestinations.international.slice(0, 3)]
    : homeDestinations.international.slice(0, 6);
  const offerDestinations = showDomestic
    ? [...homeDestinations.international, ...homeDestinations.domestic]
    : homeDestinations.international;
  const offers: OfferSlide[] = offerCards.length > 0
    ? offerCards.map((offer) => toOfferSlide(offer, country))
    : offerDestinations.slice(0, 4).map((d) => ({
      title: `${d.title} trip deals`,
      description: `Book curated ${d.title} packages with verified stays, flexible plans and smooth support.`,
      image: d.images[0] || destinationImage(d.title),
      href: hrefWithCountry(`/trips?destination=${encodeURIComponent(d.title)}`, country),
      price: `From ${formatCurrencyForCountry(d.basePrice, country)}`,
      ctaLabel: "View trips",
    }));

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src={HERO_BG} alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-24 text-center sm:px-6 lg:px-8 lg:pt-32">
          <Badge variant="glass" className="mx-auto mb-5 text-white">
            <Compass className="size-3.5" /> Your trip companion
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Discover unforgettable trips.{" "}
            <span className="text-gradient">Plan your trip with</span> VOIBEE
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
            Book curated getaways from trusted operators with clear itineraries,
            verified experiences and support from search to return.
          </p>

          <div className="mt-9">
            <SearchBar />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {heroDestinations.map((d) => (
              <Link key={d._id} href={hrefWithCountry(`/trips?destination=${encodeURIComponent(d.title)}`, country)}>
                <Badge variant="glass" className="border-white/25 bg-black/45 text-white shadow-sm hover:bg-black/60">
                  {d.title}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <OfferCarousel offers={offers} />

      {/* ---------------- Stats ---------------- */}
      {/* <section className="mx-auto -mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
        <Card className="glass">
          <CardContent className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4">
            {statCards.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-primary sm:text-3xl">
                  {formatCompact(s.value)}
                  {s.value > 0 ? "+" : ""}
                </p>
                <p className="text-xs text-muted-foreground sm:text-sm">{s.label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section> */}

      {/* ---------------- Popular destinations ---------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where to next"
          title={showDomestic ? "Domestic and international destinations" : "International destinations"}
          subtitle={
            showDomestic
              ? "Explore India favourites and easy international escapes loved by our community."
              : "Browse international getaways curated for travelers opening Voibee from outside India."
          }
        />
        <div className="space-y-12">
          {showDomestic ? (
            <DestinationGrid title="Domestic destinations" destinations={homeDestinations.domestic} country={country} />
          ) : null}
          <DestinationGrid title="International destinations" destinations={homeDestinations.international} country={country} />
        </div>
      </section>

      {/* ---------------- Trip themes ---------------- */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Browse by theme"
            title="Choose the trip mood that fits you"
          />
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
            {TRIP_THEME_DETAILS.map((theme) => {
              const Icon = theme.icon;

              return (
                <Link
                  key={theme.name}
                  href={hrefWithCountry(`/trips?category=${encodeURIComponent(theme.name)}`, country)}
                  className="group flex min-h-28 flex-col items-center justify-center rounded-xl border border-border bg-card p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-sm font-semibold leading-tight group-hover:text-primary">{theme.name}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Featured trips ---------------- */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <SectionHeading
              eyebrow="Featured"
              title="Trending trips this season"
              subtitle="Our most-loved packages, ready to book."
              align="left"
            />
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/trips">
                View all <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          {featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Compass}
              title="No trips published yet"
              description="Once the operator publishes trips (or you run the seed script), they'll appear here."
              action={
                <Button asChild variant="gradient">
                  <Link href="/trips">Browse trips</Link>
                </Button>
              }
            />
          )}
        </div>
      </section>

      {/* ---------------- Why Voibee ---------------- */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Voibee"
          title="Built for travelers who want every detail handled"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {WHY.map((f) => (
            <Card key={f.title} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-7">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="size-6" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Loved by" title="What our community says" />
          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-7">
                  <Quote className="size-7 text-primary/40" />
                  <p className="mt-3 text-sm leading-relaxed">{t.text}</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-brand-gradient font-semibold text-white">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                    <div className="ml-auto flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-4 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Your next adventure is one click away
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Join travelers discovering curated getaways, transparent pricing and
          support that stays with them throughout the journey.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="gradient">
            <Link href="/trips">
              Explore Trips <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle ? (
        <p
          className={`mt-2 text-muted-foreground ${align === "center" ? "mx-auto max-w-2xl" : ""
            }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function DestinationGrid({
  title,
  destinations,
  country,
}: {
  title: string;
  destinations: DestinationDTO[];
  country?: string;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button asChild variant="outline" size="sm">
          <Link href={hrefWithCountry("/trips", country)}>
            Explore <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {destinations.map((d) => (
          <Link
            key={d._id}
            href={hrefWithCountry(`/trips?destination=${encodeURIComponent(d.title)}`, country)}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl"
          >
            <Image
              src={d.images[0] || destinationImage(d.title)}
              alt={d.title}
              fill
              sizes="(max-width:768px) 50vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="block font-semibold">{d.title}</span>
              <span className="mt-1 block text-xs text-white/85">
                From {formatCurrencyForCountry(d.basePrice, country)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function toOfferSlide(offer: OfferCardDTO, country?: string): OfferSlide {
  return {
    title: offer.title,
    description: offer.description,
    image: offer.images[0] || destinationImage(offer.title),
    href: hrefWithCountry(offer.href || "/trips", country),
    price: offer.priceLabel || undefined,
    ctaLabel: offer.ctaLabel || "View trips",
  };
}
