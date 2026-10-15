import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarCheck, Check, ChevronRight, Clock3, MapPin, ShieldCheck, Star, Ticket, UsersRound, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CurrencyPrice } from "@/components/currency/currency-price";
import { getActivityBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };
const fallbackImage = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const activity = await getActivityBySlug((await params).slug);
  return activity ? { title: activity.title, description: activity.shortDescription || activity.description.slice(0, 155) } : { title: "Activity not found" };
}

export default async function ActivityDetailPage({ params }: Props) {
  const activity = await getActivityBySlug((await params).slug);
  if (!activity) notFound();
  const type = typeof activity.type === "string" ? null : activity.type;
  const images = activity.images.length ? activity.images : [fallbackImage];
  const description = activity.description || activity.shortDescription;

  return <main className="min-h-screen bg-[#fffcf5] pb-12"><div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
    <nav className="mb-5 flex min-w-0 items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/activities" className="shrink-0 transition-colors hover:text-primary">Activities</Link><ChevronRight className="size-4 shrink-0" />{type ? <><Link href={`/activities?type=${type.slug}`} className="shrink-0 transition-colors hover:text-primary">{type.name}</Link><ChevronRight className="size-4 shrink-0" /></> : null}<span className="truncate text-foreground">{activity.title}</span></nav>
    <Link href="/activities" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" /> All activities</Link>

    <section className={images.length > 1 ? "grid overflow-hidden rounded-[28px] bg-slate-200 shadow-sm lg:grid-cols-[1.8fr_1fr]" : "overflow-hidden rounded-[28px] bg-slate-200 shadow-sm"}>
      <div className="relative min-h-[290px] sm:min-h-[430px] lg:min-h-[520px]"><Image src={images[0]} alt={activity.title} fill priority sizes="(max-width: 1280px) 100vw, 1150px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" /><div className="absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-3 sm:inset-x-6 sm:bottom-6"><div className="flex flex-wrap gap-2">{type ? <Badge variant="glass">{type.name}</Badge> : null}{activity.bestSelling ? <Badge variant="glass"><Star className="size-3 fill-current" /> Best seller</Badge> : null}</div>{images.length > 1 ? <span className="rounded-full bg-black/45 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">{images.length} photos</span> : null}</div></div>
      {images.length > 1 ? <div className="hidden grid-rows-2 gap-1 bg-white lg:grid">{images.slice(1, 3).map((image, index) => <div key={image} className="relative min-h-0"><Image src={image} alt={`${activity.title} view ${index + 2}`} fill sizes="400px" className="object-cover" /></div>)}</div> : null}
    </section>

    <section className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"><div className="min-w-0"><header className="border-b border-border pb-7"><p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{type?.name || "Experience"}</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">{activity.title}</h1><div className="mt-5 grid gap-3 sm:grid-cols-3"><QuickFact icon={<MapPin />} label="Location" value={`${activity.destination}, ${activity.country}`} /><QuickFact icon={<Clock3 />} label="Duration" value={activity.duration || "See ticket options"} /><QuickFact icon={<Star className="fill-amber-400 text-amber-400" />} label="Guest rating" value={activity.rating ? `${activity.rating.toFixed(1)} · ${activity.reviewCount || "New"} reviews` : "New experience"} /></div></header>
      <div className="space-y-8 py-8"><ContentSection title="About this experience"><p className="max-w-3xl text-base leading-8 text-muted-foreground">{description}</p></ContentSection>
        {activity.highlights.length ? <ContentSection title="Why you’ll love it"><ul className="grid gap-3 sm:grid-cols-2">{activity.highlights.map((item) => <li key={item} className="flex gap-3 rounded-xl bg-white p-4 text-sm leading-6 shadow-sm ring-1 ring-slate-900/5"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" /><span>{item}</span></li>)}</ul></ContentSection> : null}
        {(activity.inclusions.length || activity.exclusions.length) ? <div className="grid gap-5 md:grid-cols-2">{activity.inclusions.length ? <ContentSection title="Included"><List items={activity.inclusions} icon={<Check className="size-4 text-emerald-600" />} /></ContentSection> : null}{activity.exclusions.length ? <ContentSection title="Not included"><List items={activity.exclusions} icon={<X className="size-4 text-rose-500" />} /></ContentSection> : null}</div> : null}
        {(activity.importantInfo.length || activity.meetingPoint) ? <ContentSection title="Before you go"><div className="rounded-2xl bg-secondary/45 p-5">{activity.meetingPoint ? <p className="mb-4 flex gap-2 text-sm leading-6"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><span><strong className="text-foreground">Meeting point:</strong> {activity.meetingPoint}</span></p> : null}<List items={activity.importantInfo} icon={<Check className="size-4 text-primary" />} /></div></ContentSection> : null}
      </div></div>
      <aside className="sticky top-28 rounded-3xl border border-border bg-white p-6 shadow-[0_18px_50px_rgba(9,47,89,0.12)]"><p className="text-sm font-medium text-muted-foreground">From</p><p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950"><CurrencyPrice amount={activity.basePrice} /><span className="ml-1 text-sm font-medium text-muted-foreground">per person</span></p>{activity.originalPrice > activity.basePrice ? <p className="mt-1 text-sm text-muted-foreground"><span className="line-through"><CurrencyPrice amount={activity.originalPrice} /></span> <span className="ml-1 font-semibold text-emerald-700">Save {Math.round((1 - activity.basePrice / activity.originalPrice) * 100)}%</span></p> : null}<Button asChild size="lg" variant="gradient" className="mt-6 w-full rounded-xl"><Link href={`/activities/${activity.slug}/book`}>Choose date & guests <ChevronRight className="size-4" /></Link></Button><div className="mt-6 space-y-3 border-t border-border pt-5 text-sm text-muted-foreground"><p className="flex gap-3"><CalendarCheck className="size-5 shrink-0 text-primary" /><span><strong className="block text-foreground">Pick a date</strong>Choose when you want to go.</span></p><p className="flex gap-3"><UsersRound className="size-5 shrink-0 text-primary" /><span><strong className="block text-foreground">Add your guests</strong>Tell us who&apos;s coming along.</span></p><p className="flex gap-3"><Ticket className="size-5 shrink-0 text-primary" /><span><strong className="block text-foreground">We confirm availability</strong>No payment is taken on this page.</span></p></div></aside>
    </section>
  </div></main>;
}

function QuickFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="flex min-w-0 gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5"><span className="mt-0.5 shrink-0 text-primary">{icon}</span><span className="min-w-0"><span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span><span className="mt-1 block truncate text-sm font-semibold text-foreground" title={value}>{value}</span></span></div>; }
function ContentSection({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2 className="text-xl font-extrabold tracking-tight text-slate-950">{title}</h2><div className="mt-4">{children}</div></section>; }
function List({ items, icon }: { items: string[]; icon: React.ReactNode }) { return <ul className="space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6"><span className="mt-1 shrink-0">{icon}</span><span>{item}</span></li>)}</ul>; }
