import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  ShieldCheck,
  Wallet,
  Headphones,
  ArrowRight,
  Link2,
  TrendingUp,
  Quote,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { TripCard } from "@/components/trip/trip-card";
import { SearchBar } from "@/components/home/search-bar";
import { getFeaturedTrips, getHomeStats } from "@/lib/data";
import { destinationImage } from "@/lib/images";
import { POPULAR_DESTINATIONS } from "@/lib/constants";
import { formatCompact } from "@/lib/utils";

// Re-fetch featured trips & stats from the DB at most once a minute.
export const revalidate = 60;

const HERO_BG =
  "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80";

const WHY = [
  {
    icon: ShieldCheck,
    title: "Curated & verified trips",
    desc: "Every package is operated by vetted teams with transparent itineraries and pricing.",
  },
  {
    icon: Wallet,
    title: "Earn as a partner",
    desc: "Resell trips with your own commission via white-label links — no inventory, no risk.",
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
    text: "Booking was effortless and the trip exceeded expectations. The white-label page from my agency felt completely premium.",
  },
  {
    name: "Cheruvadi Travels",
    role: "Partner Agency",
    text: "We resell Tripnox packages to our community and earn solid commissions without managing logistics. Game changer.",
  },
  {
    name: "Sara Khan",
    role: "Travel Influencer",
    text: "I share my custom links with followers and track every booking and rupee earned from one clean dashboard.",
  },
];

export default async function HomePage() {
  const [featured, stats] = await Promise.all([
    getFeaturedTrips(6),
    getHomeStats(),
  ]);

  const statCards = [
    { label: "Curated trips", value: stats.trips },
    { label: "Partner businesses", value: stats.partners },
    { label: "Happy travelers", value: stats.travelers },
    { label: "Trips booked", value: stats.bookings },
  ];

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
            <Compass className="size-3.5" /> India&apos;s white-label travel marketplace
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            Discover unforgettable trips.{" "}
            <span className="text-gradient">Resell &amp; earn</span> with Tripnox.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-white/80 sm:text-lg">
            Book curated getaways from trusted operators — or become a partner and
            earn commissions reselling trips with your own branded links.
          </p>

          <div className="mt-9">
            <SearchBar />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {POPULAR_DESTINATIONS.slice(0, 6).map((d) => (
              <Link key={d} href={`/trips?destination=${d}`}>
                <Badge variant="glass" className="text-white hover:bg-white/20">
                  {d}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
          title="Popular destinations"
          subtitle="Handpicked places loved by our community of travelers."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {POPULAR_DESTINATIONS.slice(0, 10).map((d) => (
            <Link
              key={d}
              href={`/trips?destination=${d}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl"
            >
              <Image
                src={destinationImage(d)}
                alt={d}
                fill
                sizes="(max-width:768px) 50vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute bottom-3 left-3 font-semibold text-white">
                {d}
              </span>
            </Link>
          ))}
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

      {/* ---------------- Why Tripnox ---------------- */}
      <section id="why" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Tripnox"
          title="Built for travelers and the partners who power them"
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

      {/* ---------------- Partner program ---------------- */}
      <section id="partner" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-brand-gradient p-8 text-white sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <Badge variant="glass" className="mb-4 text-white">
                Partner Program
              </Badge>
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Turn your audience into income
              </h2>
              <p className="mt-3 max-w-lg text-white/85">
                Agencies, influencers and community leaders resell Tripnox trips
                with white-label pages, set their own commission and get paid for
                every booking.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/register?role=partner">
                    Become a Partner <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                >
                  <Link href="/trips">Explore trips</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: Link2, title: "White-label links", desc: "tripnox.com/p/your-brand/goa-trip" },
                { icon: Wallet, title: "Custom commission", desc: "Set your own margin per trip" },
                { icon: TrendingUp, title: "Live earnings", desc: "Track leads, bookings & payouts" },
                { icon: ShieldCheck, title: "Zero risk", desc: "No inventory, no upfront cost" },
              ].map((c) => (
                <div key={c.title} className="glass rounded-2xl p-5 text-white">
                  <c.icon className="mb-3 size-6" />
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-sm text-white/80">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
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
          Join thousands of travelers and partners building memories with Tripnox.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="gradient">
            <Link href="/trips">
              Explore Trips <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/register?role=partner">Become a Partner</Link>
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
          className={`mt-2 text-muted-foreground ${
            align === "center" ? "mx-auto max-w-2xl" : ""
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
