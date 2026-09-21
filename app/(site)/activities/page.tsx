import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { ActivityCard } from "@/components/activity/activity-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { getActivities, getActivityTypes } from "@/lib/data";

export const metadata: Metadata = { title: "Activities & Experiences", description: "Book memorable activities and experiences with Voibee." };
type SP = Record<string, string | string[] | undefined>;
const str = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function ActivitiesPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams; const q = str(sp.q) ?? ""; const type = str(sp.type) ?? "";
  const [types, activities, seasonal, bestSelling] = await Promise.all([getActivityTypes(), getActivities({ q, type }), getActivities({ seasonal: true, limit: 8 }), getActivities({ bestSelling: true, limit: 12 })]);
  return <main className="bg-white">
    <section className="mx-auto max-w-[1440px] px-3 pb-10 pt-4 sm:px-5 lg:px-8">
      <div className="relative min-h-[560px] overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl">
        <Image src="https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=2000&q=85" alt="Activities around the world" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/50 to-slate-950/10" />
        <div className="relative flex min-h-[560px] items-center px-6 pb-32 sm:px-12 lg:px-16"><div className="max-w-2xl text-white"><p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-200">Things to do with Voibee</p><h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">Find experiences worth traveling for.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-white/85">Discover iconic attractions, outdoor adventures, family fun and unforgettable local experiences.</p></div></div>
        <form className="absolute inset-x-5 bottom-8 mx-auto flex max-w-4xl gap-2 rounded-2xl bg-white p-3 shadow-2xl" action="/activities"><label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-slate-50 px-4"><Search className="size-5 text-primary" /><span className="sr-only">Search activities</span><input name="q" defaultValue={q} placeholder="Search activity or destination" className="h-14 w-full bg-transparent text-base font-medium text-slate-900 outline-none placeholder:text-slate-400" /></label><Button type="submit" size="lg" className="h-14 rounded-xl px-6">Search activities</Button></form>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Heading title="Explore activity types" subtitle="Choose an experience style and start discovering." />{types.length ? <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{types.map((item) => <Link key={item._id} href={`/activities?type=${item.slug}`} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary"><Image src={item.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-4 text-white"><h3 className="text-lg font-extrabold">{item.name}</h3><p className="mt-1 line-clamp-2 text-xs text-white/75">{item.description}</p></div></Link>)}</div> : <EmptyState icon={Sparkles} title="Activity types are coming soon" />}</section>

    {(q || type) ? <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><Heading title="Search results" subtitle={`${activities.length} matching experiences`} action={<Button asChild variant="outline"><Link href="/activities">Clear search</Link></Button>} />{activities.length ? <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{activities.map((activity) => <ActivityCard key={activity._id} activity={activity} />)}</div> : <div className="mt-6"><EmptyState icon={Search} title="No matching activities" description="Try another activity name or destination." /></div>}</section> : null}

    <section className="bg-slate-50"><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><Heading title="Explore This Season’s Best Activities" subtitle="Handpicked seasonal activities, trending experiences and unforgettable adventures." />{seasonal.length ? <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{seasonal.map((activity) => <ActivityCard key={activity._id} activity={activity} />)}</div> : <EmptyState icon={Sparkles} title="Seasonal experiences are coming soon" />}</div></section>

    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><Heading title="Best-Selling Experiences Worldwide" subtitle="Traveler favorites across the world’s most exciting destinations." action={<Button asChild variant="outline"><Link href="/activities?q=experience">View all <ArrowRight className="size-4" /></Link></Button>} />{bestSelling.length ? <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{bestSelling.map((activity) => <ActivityCard key={activity._id} activity={activity} />)}</div> : <EmptyState icon={Sparkles} title="Best-selling experiences are coming soon" />}</section>
  </main>;
}

function Heading({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) { return <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-3xl font-extrabold tracking-tight text-slate-950">{title}</h2><p className="mt-2 text-muted-foreground">{subtitle}</p></div>{action}</div>; }
