"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Clock3, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CurrencyPrice } from "@/components/currency/currency-price";
import type { BookingDraft, SelectedActivity } from "@/components/booking/booking-box";

type ActivityOption = SelectedActivity & { destination: string; country: string; shortDescription: string };

export function ActivityPicker({ packageSlug, activities }: { packageSlug: string; activities: ActivityOption[] }) {
  const storedDraft = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("voibee-booking-draft-change", onStoreChange);
      return () => window.removeEventListener("voibee-booking-draft-change", onStoreChange);
    },
    () => sessionStorage.getItem("voibee-booking-draft"),
    () => null,
  );
  const draft = useMemo(() => { try { const value = storedDraft ? JSON.parse(storedDraft) as BookingDraft : null; return value?.slug === packageSlug ? value : null; } catch { return null; } }, [packageSlug, storedDraft]);
  const selectedIds = new Set(draft?.selectedActivities?.map((activity) => activity._id) ?? []);

  function toggle(activity: ActivityOption) {
    if (!draft) return;
    const current = draft.selectedActivities ?? [];
    const selectedActivities = selectedIds.has(activity._id)
      ? current.filter((item) => item._id !== activity._id)
      : [...current, { _id: activity._id, title: activity.title, basePrice: activity.basePrice, image: activity.image, duration: activity.duration }];
    sessionStorage.setItem("voibee-booking-draft", JSON.stringify({ ...draft, selectedActivities }));
    window.dispatchEvent(new Event("voibee-booking-draft-change"));
  }

  if (!draft) return <main className="min-h-[65vh] bg-white px-4 py-16"><div className="mx-auto max-w-xl rounded-3xl border border-border p-8 text-center"><h1 className="text-2xl font-extrabold">Booking details not found</h1><p className="mt-2 text-muted-foreground">Return to your package and enter traveler details before adding activities.</p><Button asChild className="mt-6"><Link href={`/packages/${packageSlug}`}>Back to package</Link></Button></div></main>;

  return <main className="min-h-screen bg-slate-50/60 px-4 py-8 sm:px-6 sm:py-10"><div className="mx-auto max-w-3xl"><Link href={`/booking-review?package=${encodeURIComponent(packageSlug)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="size-4" />Back to booking review</Link><header className="mt-6"><p className="text-sm font-bold uppercase tracking-wider text-primary">Optional add-ons</p><h1 className="mt-1 text-3xl font-extrabold text-slate-950">Add activities to your trip</h1><p className="mt-2 max-w-2xl text-muted-foreground">Choose experiences available in your destination. These are saved as requests and confirmed by the Voibee team separately.</p></header>{activities.length ? <div className="mt-7 space-y-4">{activities.map((activity) => { const selected = selectedIds.has(activity._id); return <article key={activity._id} className="flex gap-4 rounded-2xl border border-border bg-white p-3 shadow-sm sm:p-4"><div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-secondary sm:size-32">{activity.image ? <Image src={activity.image} alt={activity.title} fill sizes="128px" className="object-cover" /> : null}</div><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><h2 className="font-extrabold text-slate-950">{activity.title}</h2><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3.5" />{activity.destination}, {activity.country}</p>{activity.duration ? <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{activity.duration}</p> : null}</div><Button type="button" variant={selected ? "secondary" : "outline"} className="shrink-0" onClick={() => toggle(activity)}>{selected ? <><Check className="size-4" />Added</> : <><Plus className="size-4" />Add</>}</Button></div>{activity.shortDescription ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{activity.shortDescription}</p> : null}<p className="mt-3 text-sm font-bold text-primary">From <CurrencyPrice amount={activity.basePrice} /> <span className="font-normal text-muted-foreground">per person</span></p></div></article>; })}</div> : <div className="mt-7 rounded-2xl border border-dashed border-border bg-white p-8 text-center text-muted-foreground">No activities are available for this destination right now.</div>}<div className="sticky bottom-4 mt-8"><Button asChild size="lg" variant="gradient" className="w-full shadow-lg"><Link href={`/booking-review?package=${encodeURIComponent(packageSlug)}`}>Continue with {selectedIds.size || "no"} activit{selectedIds.size === 1 ? "y" : "ies"}</Link></Button></div></div></main>;
}
