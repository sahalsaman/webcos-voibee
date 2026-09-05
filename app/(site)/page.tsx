import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  ArrowRight,
  Star,
  Users,
  Camera,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TripCard } from "@/components/trip/trip-card";
import { SearchBar } from "@/components/home/search-bar";
import { OfferCarousel, type OfferSlide } from "@/components/home/offer-carousel";
import { getFeaturedTrips, getHomeDestinations, getOfferCards, isIndiaCountry } from "@/lib/data";
import { destinationImage } from "@/lib/images";
import { normalizePackageHref, withCountryParam as hrefWithCountry } from "@/lib/utils";
import type { TripCategory } from "@/lib/constants";
import type { OfferCardDTO } from "@/types";
import { DestinationSwitcher } from "@/components/site/destination-switcher";
import { DestinationCarousel } from "@/components/home/destination-carousel";
import { ThemeCarousel } from "@/components/home/theme-carousel";

// Re-fetch featured packages from the DB at most once a minute.
export const revalidate = 60;

const HERO_BG = "/hero-experience.png";

const WHY = [
  {
    image: "/why-authentic.png",
    title: "Enjoy authentic and unique packages you can't find anywhere else",
  },
  {
    image: "/why-verified.png",
    title: "Connect with verified package experts and travel buddies",
  },
  {
    image: "/why-community.png",
    title: "Become part of Voibee's growing Travel Buddy Community",
  },
] as const;

const TESTIMONIALS = [
  {
    name: "Aarav Mehta",
    role: "Traveler · Manali",
    date: "24 July, 2026",
    rating: "4.3/5",
    accent: "#0060e6",
    text: "Booking was effortless and the package exceeded expectations. The itinerary was clear, comfortable and exactly what we wanted.",
  },
  {
    name: "Neha Iyer",
    role: "Traveler · Goa",
    date: "24 July, 2026",
    rating: "4.8/5",
    accent: "#0284c7",
    text: "The whole package felt smooth from the first search to the final day. Loved having support whenever we needed it.",
  },
  {
    name: "Sara Khan",
    role: "Traveler · Dubai",
    date: "24 July, 2026",
    rating: "4.6/5",
    accent: "#2563eb",
    text: "Voibee made comparing packages easy, and the booking details were transparent before we paid.",
  },
] as const;

const TRUST_AVATARS = [
  { initials: "AR", className: "bg-[#1b335f]" },
  { initials: "NI", className: "bg-[#ef8f7b]" },
  { initials: "RM", className: "bg-[#0f8f83]" },
  { initials: "SK", className: "bg-[#f6b13f]" },
  { initials: "VP", className: "bg-[#263238]" },
  { initials: "MA", className: "bg-[#78a8ff]" },
];


const TRIP_THEME_DETAILS = [
  { name: "Holiday Package", image: destinationImage("Goa"), description: "Classic escapes" },
  { name: "Honeymoon", image: destinationImage("Maldives"), description: "Romantic getaways" },
  { name: "Family", image: destinationImage("Singapore"), description: "Fun for every age" },
  { name: "Group Trip", image: destinationImage("Ladakh"), description: "Better together" },
  { name: "Strangers", image: destinationImage("Rishikesh"), description: "Meet your travel tribe" },
  { name: "Wellness", image: destinationImage("Kerala"), description: "Rest and recharge" },
  { name: "Spiritual", image: destinationImage("Varanasi"), description: "Meaningful journeys" },
  { name: "Festival", image: destinationImage("Jaipur"), description: "Celebrate the world" },
] satisfies Array<{
  name: TripCategory;
  image: string;
  description: string;
}>;

type SP = Record<string, string | string[] | undefined>;

function str(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
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
  const offers: OfferSlide[] = offerCards.map((offer) => toOfferSlide(offer, country));

  return (
    <main className="min-h-screen bg-white">
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0">
          <Image
            src={HERO_BG}
            alt="Happy travelers exploring together"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/78 to-white/10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>
        <div className="relative mx-auto grid min-h-[600px] max-w-7xl items-center px-4 pb-12 pt-20 sm:min-h-[640px] sm:px-6 lg:min-h-[680px] lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.7fr)] lg:px-8 lg:pb-20 lg:pt-28">
          <div className="max-w-3xl">
           
            <h1 className="text-4xl font-extrabold leading-[1.04] text-foreground sm:text-5xl lg:text-7xl">
              Experience trips
              <span className="block text-gradient">with your VOIBEE</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Find curated trips, meet friendly travel buddies, and book verified experiences with support from search to return.
            </p>

            <div className="mt-9">
              <SearchBar />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {heroDestinations.map((d) => (
                <Link key={d._id} href={hrefWithCountry(`/packages?destination=${encodeURIComponent(d.title)}`, country)}>
                  <Badge variant="glass" className="border-primary/15 bg-card/90 shadow-sm hover:border-primary/35 hover:text-primary">
                    {d.title}
                  </Badge>
                </Link>
              ))}
            </div>

      <TrustReviewStrip />
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
        <DestinationSwitcher
          hasIndia={showDomestic && homeDestinations.domestic.length > 0}
          inline
          heading="Trending Holiday Destinations"
          india={<DestinationCarousel title="India destinations" destinations={homeDestinations.domestic} country={country} hideTitle />}
          global={<DestinationCarousel title="Global Escapes" destinations={homeDestinations.international} country={country} hideTitle />}
        />
      </section>

      {/* ---------------- Package themes ---------------- */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Find your kind of holiday</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Choose the trip mood that fits you</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">Pick a travel style and discover packages selected around the experience you want.</p>
          </div>
          <ThemeCarousel themes={TRIP_THEME_DETAILS} country={country} />
        </div>
      </section>

      {/* ---------------- Featured packages ---------------- */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4 [&>div]:mb-0">
            <SectionHeading
              title="Trending packages this season"
              subtitle="Our most-loved packages, ready to book."
              align="left"
            />
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/packages">
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
              title="No packages published yet"
              description="Once the operator publishes packages (or you run the seed script), they'll appear here."
              action={
                <Button asChild variant="gradient">
                  <Link href="/packages">Browse packages</Link>
                </Button>
              }
            />
          )}
        </div>
      </section>

      {/* ---------------- Moments ---------------- */}
      <section className="overflow-hidden bg-sky-50  px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="max-w-xl lg:pr-8">
            <SectionHeading
              eyebrow="Join our travel community"
              title="Moments from the road"
              description="Check out special moments from our travel buddies who share the same passion for adventures and expertly-designed packages."
              align="left"
              titleSize="lg"
            />
            
            <div className="mt-7 flex flex-wrap gap-3">
              <Button type="button" size="lg" variant="gradient" className="rounded-full px-6">
                <Camera className="size-5" /> Instagram
              </Button>
              <Button type="button" size="lg" variant="outline" className="rounded-full px-6">
                <Share2 className="size-5" /> Facebook
              </Button>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden sm:min-h-[520px] lg:min-h-[600px]">
            <Image
              src="/moments-road-collage.png"
              alt="Voibee travelers sharing adventure moments"
              fill
              sizes="(min-width: 1024px) 720px, 100vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* ---------------- Why Voibee ---------------- */}
      <section id="why" className=" px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
     
            <h2 className="mt-3 text-4xl font-black leading-tight text-foreground sm:text-5xl ">
              Why Voibee
            </h2>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-16">
            {WHY.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="relative size-44 overflow-hidden rounded-full bg-secondary shadow-2xl shadow-slate-950/10 ring-1 ring-border sm:size-52 lg:size-56">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 180px, (min-width: 640px) 160px, 140px"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-8 max-w-sm text-balance text-lg font-light leading-8 text-slate-700 dark:text-slate-200 sm:text-xl ">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="Loved by" title="What our community says" />
          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <article
                key={testimonial.name}
                className="relative flex min-h-[430px] flex-col overflow-hidden rounded-xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full"
                  style={{ backgroundColor: testimonial.accent }}
                />
                <p className="text-sm text-muted-foreground">
                  {testimonial.date}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <div className="flex gap-1.5 text-white">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className="flex size-6 items-center justify-center rounded-md"
                        style={{ backgroundColor: testimonial.accent }}
                      >
                        <Star className="size-3 fill-current" />
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-foreground/75">
                    {testimonial.rating}
                  </span>
                </div>
                <p className="mt-7 text-lg font-bold leading-8 text-foreground sm:text-xl ">
                  {testimonial.text}
                </p>
                <div className="mt-auto pt-8">
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Final CTA ---------------- */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-slate-950/10 lg:grid-cols-[1fr_420px]">
          <div className="p-8 sm:p-10 lg:p-12">
            <Badge variant="secondary" className="mb-5 w-fit">
              <Users className="size-3.5" /> Travel buddies are waiting
            </Badge>
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Start traveling together
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Join group packages, choose custom-date experiences, or plan your own escape with like-minded TripMates.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="gradient">
                <Link href={hrefWithCountry("/packages", country)}>
                  Join the community <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={hrefWithCountry("/destinations", country)}>
                  Explore destinations
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TrustReviewStrip() {
  return (
    <section className=" ">
      <div className=" grid  gap-12 px-4 py-5  lg:grid-cols-[1.15fr_0.95fr_auto] lg:items-center pt-16">
   
          <div>       
            <div className="flex -space-x-2.5">
            {TRUST_AVATARS.map((avatar) => (
              <span
                key={avatar.initials}
                className={`${avatar.className} flex size-6 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white shadow-sm sm:size-7`}
              >
                {avatar.initials}
              </span>
            ))}
          </div>
            <div className="flex items-center gap-1.5 text-warning">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-3 fill-current sm:size-4" />
              ))}
              <span className="ml-1.5 text-sm font-extrabold text-foreground sm:text-base">4.7/5.0</span>
            </div>
            <p className="mt-1 text-xs font-semibold text-foreground sm:text-xs">200,000+ active travellers worldwide</p>
          </div>

        <div>
          <div className="flex items-center gap-2">
            <Star className="size-5 fill-[#00b67a] text-[#00b67a]" />
            <span className="text-lg font-bold text-foreground">Trustpilot</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2.5">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index} className="flex size-5 items-center justify-center bg-[#00b67a] text-white sm:size-6">
                  <Star className="size-4 fill-current" />
                </span>
              ))}
            </div>
            <span className="text-sm font-extrabold text-foreground sm:text-base">4.5/5.0</span>
          </div>
          <p className="mt-1 text-xs font-semibold text-foreground sm:text-xs">100% happy travel buddies</p>
        </div>

        <div className="flex items-center gap-4 rounded-xl px-5 py-3 shadow-sm lg:min-w-[245px]">
          <span className="text-5xl font-extrabold leading-none">
            <span className="text-[#4285f4]">G</span>
          </span>
          <div>
            <p className="text-sm text-muted-foreground sm:text-base">Google Reviews</p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-foreground">4.8</span>
              <div className="flex text-[#ff5a1f]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  description,
  align = "center",
  titleSize="normal"
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?:string;
  align?: "center" | "left";
  titleSize?:string
}) {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : ""}`}>
      {eyebrow ? (
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`text-2xl font-bold sm:text-3xl ${titleSize==="lg"? "text-4xl font-bold sm:text-6xl mb-4":""}`}>{title}</h2>
      {subtitle ? (
        <p
          className={`mt-2 text-muted-foreground ${align === "center" ? "mx-auto max-w-2xl" : ""
            }`}
        >
          {subtitle}
        </p>
      ) : null}
       {description ? (
        <p
          className={`mt-2 text-lg ${align === "center" ? "mx-auto max-w-2xl" : ""
            }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

function toOfferSlide(offer: OfferCardDTO, country?: string): OfferSlide {
  return {
    title: offer.title,
    description: offer.description,
    image: offer.images[0] || destinationImage(offer.title),
    href: hrefWithCountry(normalizePackageHref(offer.href), country),
    price: offer.priceLabel || undefined,
    ctaLabel: offer.ctaLabel || "View packages",
  };
}
