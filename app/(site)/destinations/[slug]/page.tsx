import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { TripCard } from "@/components/trip/trip-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getDestinationLanding, getDestinations } from "@/lib/data";
import { destinationImage } from "@/lib/images";
import { formatINR, slugify } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.voibee.com";

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((destination) => ({ slug: slugify(destination.title) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getDestinationLanding(slug);
  if (!result) return { title: "Destination not found", robots: { index: false, follow: false } };
  const { destination, trips } = result;
  const title = `${destination.title} Tour Packages & Trips`;
  const description = destination.description?.slice(0, 155) || `Compare ${destination.title} tour packages, holiday trips, itineraries and prices from Voibee Holidays.`;
  return {
    title,
    description,
    keywords: [`${destination.title} packages`, `${destination.title} trip`, `${destination.title} tour package`, `${destination.title} holiday package`, ...destination.tags],
    alternates: { canonical: `/destinations/${slugify(destination.title)}` },
    openGraph: { title, description, url: `/destinations/${slugify(destination.title)}`, images: destination.images[0] ? [{ url: destination.images[0] }] : undefined },
    robots: { index: trips.length > 0, follow: true },
  };
}

export default async function DestinationLandingPage({ params }: Props) {
  const { slug } = await params;
  const result = await getDestinationLanding(slug);
  if (!result) notFound();
  const { destination, trips } = result;
  const canonical = `${appUrl}/destinations/${slugify(destination.title)}`;
  const startingPrice = trips.length ? Math.min(...trips.map((trip) => trip.basePrice)) : destination.basePrice;
  const faq = [
    { question: `How much does a ${destination.title} package cost?`, answer: `Voibee ${destination.title} packages currently start from ${formatINR(startingPrice)} per person. Final pricing depends on travel dates, accommodation and selected options.` },
    { question: `Can I customize my ${destination.title} trip?`, answer: `Yes. Select a package and share your preferred dates, group size and requirements for a customer-specific itinerary and quotation.` },
    { question: `What is included in ${destination.title} tour packages?`, answer: `Inclusions vary by package. Open any package below to review its itinerary, accommodation, activities, inclusions, exclusions and available options.` },
  ];
  const jsonLd = { "@context": "https://schema.org", "@graph": [
    { "@type": "CollectionPage", "@id": `${canonical}#page`, name: `${destination.title} Tour Packages`, description: destination.description, url: canonical, primaryImageOfPage: { "@type": "ImageObject", url: destination.images[0] || destinationImage(destination.title) }, mainEntity: { "@type": "ItemList", numberOfItems: trips.length, itemListElement: trips.map((trip, index) => ({ "@type": "ListItem", position: index + 1, url: `${appUrl}/trips/${trip.slug}`, name: trip.title })) } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: appUrl }, { "@type": "ListItem", position: 2, name: "Destinations", item: `${appUrl}/destinations` }, { "@type": "ListItem", position: 3, name: destination.title, item: canonical }] },
    { "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
  ] };

  return <main className="mx-auto max-w-7xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <header className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-20 text-white shadow-xl sm:px-10 lg:px-14">
      <Image src={destination.images[0] || destinationImage(destination.title)} alt={`${destination.title} tour packages`} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/58 to-slate-950/20" />
      <div className="relative max-w-3xl"><p className="flex items-center gap-2 text-sm font-semibold text-blue-200"><MapPin className="size-4" />{destination.country}</p><h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{destination.title} Tour Packages</h1><p className="mt-4 max-w-2xl text-base leading-7 text-white/85">{destination.description || `Discover curated ${destination.title} trips with transparent prices, detailed itineraries and flexible travel options.`}</p>{startingPrice > 0 ? <p className="mt-5 text-lg font-semibold">Packages from {formatINR(startingPrice)} per person</p> : null}</div>
    </header>

    <section aria-labelledby="packages-heading"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-primary">Available journeys</p><h2 id="packages-heading" className="mt-1 text-3xl font-bold">Best {destination.title} packages</h2><p className="mt-2 text-muted-foreground">Compare {trips.length} active {trips.length === 1 ? "package" : "packages"}, itineraries and prices.</p></div><Button asChild variant="outline"><Link href={`/trips?destination=${encodeURIComponent(destination.title)}`}>Filter packages <ArrowRight className="size-4" /></Link></Button></div>
      {trips.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{trips.map((trip) => <TripCard key={trip._id} trip={trip} />)}</div> : <EmptyState icon={MapPin} title={`No ${destination.title} packages currently available`} description="New packages will appear here after they are published." />}
    </section>

    <section aria-labelledby="faq-heading" className="rounded-2xl border border-border bg-secondary/30 p-6 sm:p-8"><h2 id="faq-heading" className="text-2xl font-bold">Planning a {destination.title} trip</h2><div className="mt-6 grid gap-6 lg:grid-cols-3">{faq.map((item) => <article key={item.question}><h3 className="font-semibold">{item.question}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.answer}</p></article>)}</div></section>
  </main>;
}
