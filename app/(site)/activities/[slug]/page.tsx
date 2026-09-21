import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronRight, Clock, MapPin, ShieldCheck, Star, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CurrencyPrice } from "@/components/currency/currency-price";
import { getActivityBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const activity = await getActivityBySlug((await params).slug); return activity ? { title: activity.title, description: activity.shortDescription || activity.description.slice(0, 155) } : { title: "Activity not found" }; }

export default async function ActivityDetailPage({ params }: Props) {
  const activity = await getActivityBySlug((await params).slug); if (!activity) notFound(); const type = typeof activity.type === "string" ? null : activity.type;
  const images = activity.images.length ? activity.images : ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85"];
  return <main className="min-h-screen bg-slate-50/60"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"><Link href="/activities">Activities</Link><ChevronRight className="size-4" />{type ? <Link href={`/activities?type=${type.slug}`}>{type.name}</Link> : null}{type ? <ChevronRight className="size-4" /> : null}<span>{activity.title}</span></nav>
    <section className="grid gap-3 overflow-hidden rounded-3xl lg:grid-cols-[2fr_1fr] lg:grid-rows-2"> <div className="relative min-h-[360px] lg:row-span-2 lg:min-h-[520px]"><Image src={images[0]} alt={activity.title} fill priority className="object-cover" /></div>{images.slice(1, 3).map((image, index) => <div key={image} className="relative hidden min-h-[250px] lg:block"><Image src={image} alt={`${activity.title} ${index + 2}`} fill className="object-cover" /></div>)}</section>
    <section className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]"><div className="space-y-8"><div><div className="flex flex-wrap gap-2">{type ? <Badge>{type.name}</Badge> : null}{activity.bestSelling ? <Badge variant="accent">Best seller</Badge> : null}</div><h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{activity.title}</h1><div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="size-4 text-primary" />{activity.destination}, {activity.country}</span>{activity.duration ? <span className="flex items-center gap-1"><Clock className="size-4 text-primary" />{activity.duration}</span> : null}{activity.rating ? <span className="flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" />{activity.rating.toFixed(1)} ({activity.reviewCount} reviews)</span> : null}</div><p className="mt-5 text-base leading-7 text-muted-foreground">{activity.description || activity.shortDescription}</p></div>
      {activity.highlights.length ? <Info title="Experience highlights"><ul className="grid gap-3 sm:grid-cols-2">{activity.highlights.map((item) => <li key={item} className="flex gap-2"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" /><span>{item}</span></li>)}</ul></Info> : null}
      <div className="grid gap-5 sm:grid-cols-2">{activity.inclusions.length ? <Info title="What’s included"><List items={activity.inclusions} icon={<Check className="size-4 text-emerald-600" />} /></Info> : null}{activity.exclusions.length ? <Info title="What’s not included"><List items={activity.exclusions} icon={<X className="size-4 text-rose-500" />} /></Info> : null}</div>
      {activity.importantInfo.length || activity.meetingPoint ? <Info title="Important information">{activity.meetingPoint ? <p className="mb-4"><strong>Meeting point:</strong> {activity.meetingPoint}</p> : null}<List items={activity.importantInfo} icon={<Check className="size-4 text-primary" />} /></Info> : null}
    </div><aside className="sticky top-28 rounded-2xl border border-border bg-white p-6 shadow-xl shadow-slate-900/10"><p className="text-sm text-muted-foreground">Starting from</p><p className="mt-1 text-3xl font-extrabold"><CurrencyPrice amount={activity.basePrice} /> <span className="text-sm font-normal text-muted-foreground">/ person</span></p><p className="mt-4 text-sm leading-6 text-muted-foreground">Choose your activity date and guest details on the next page. No payment is collected until availability is confirmed.</p><Button asChild size="lg" variant="gradient" className="mt-5 w-full"><Link href={`/activities/${activity.slug}/book`}>Book activity</Link></Button></aside></section>
  </div></main>;
}

function Info({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border bg-white p-6"><h2 className="mb-4 text-xl font-extrabold">{title}</h2>{children}</section>; }
function List({ items, icon }: { items: string[]; icon: React.ReactNode }) { return <ul className="space-y-3">{items.map((item) => <li key={item} className="flex gap-2 text-sm leading-6"><span className="mt-1">{icon}</span><span>{item}</span></li>)}</ul>; }
