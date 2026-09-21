import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, MapPin, ShieldCheck } from "lucide-react";
import { ActivityBookingCard } from "@/components/activity/activity-booking-card";
import { getActivityBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const activity = await getActivityBySlug((await params).slug);
  return activity ? { title: `Book ${activity.title}`, description: `Choose a date and book ${activity.title}.` } : { title: "Activity not found" };
}

export default async function ActivityBookingPage({ params }: Props) {
  const activity = await getActivityBySlug((await params).slug);
  if (!activity) notFound();
  const image = activity.images[0] || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85";

  return <main className="min-h-screen bg-slate-50"><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
    <Link href={`/activities/${activity.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ChevronLeft className="size-4" />Back to activity details</Link>
    <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
        <div className="relative aspect-[16/9]"><Image src={image} alt={activity.title} fill priority className="object-cover" /></div>
        <div className="p-6 sm:p-8"><p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Complete your booking</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{activity.title}</h1><div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><MapPin className="size-4 text-primary" />{activity.destination}, {activity.country}</span>{activity.duration ? <span className="flex items-center gap-1.5"><Clock className="size-4 text-primary" />{activity.duration}</span> : null}</div><div className="mt-6 rounded-2xl bg-primary/5 p-4"><p className="flex items-start gap-2 text-sm leading-6"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" /><span>Your request is sent to the Voibee team. We confirm availability and payment instructions before the booking is finalized.</span></p></div></div>
      </section>
      <ActivityBookingCard activityId={activity._id} price={activity.basePrice} />
    </div>
  </div></main>;
}
