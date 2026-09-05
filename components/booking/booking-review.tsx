"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, CreditCard, Loader2, MapPin, Phone, Store, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatDate, formatINR } from "@/lib/utils";
import type { BookingDraft } from "@/components/booking/booking-box";
import { appConfig } from "@/app/app,config";

declare global { interface Window { Razorpay?: new (options: Record<string, unknown>) => { open: () => void }; } }
function loadRazorpay(): Promise<boolean> { return new Promise((resolve) => { if (window.Razorpay) return resolve(true); const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = () => resolve(true); script.onerror = () => resolve(false); document.body.appendChild(script); }); }

type TripSummary = { _id: string; slug: string; title: string; destination: string; country: string; image: string; basePrice: number };

export function BookingReview({ trip }: { trip: TripSummary }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"online" | "offline" | null>(null);
  const storedDraft = useSyncExternalStore(() => () => undefined, () => sessionStorage.getItem("voibee-booking-draft"), () => null);
  const draft = useMemo(() => { try { const value = storedDraft ? JSON.parse(storedDraft) as BookingDraft : null; return value?.slug === trip.slug && value.tripId === trip._id ? value : null; } catch { return null; } }, [storedDraft, trip._id, trip.slug]);

  async function createBooking(mode: "online" | "offline") {
    if (!draft) return;
    setLoading(mode);
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tripId: draft.tripId, partnerSlug: draft.partnerSlug, bookingMode: mode, seats: draft.seats, travelStartDate: draft.travelStartDate, travelEndDate: draft.travelEndDate, travelerDetails: { name: draft.name, email: draft.email, mobile: draft.mobile, travellers: draft.seats, departureCity: draft.departureCity, adults: draft.adults, childrenWithBed: draft.childrenWithBed, childrenWithoutBed: draft.childrenWithoutBed, infants: draft.infants } }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not create booking");
      const data = result.data as Record<string, string | number | boolean>;
      if (mode === "offline") return finish(String(data.bookingNumber), String(data.confirmationToken));
      if (data.mock) return confirm({ bookingId: data.bookingId, confirmationToken: data.confirmationToken, mock: true });
      const ready = await loadRazorpay(); if (!ready) throw new Error("Could not load Razorpay");
      const razorpay = new window.Razorpay!({ key: data.keyId, amount: Number(data.amount) * 100, currency: "INR", name: appConfig.appName, description: trip.title, order_id: data.razorpayOrderId, prefill: { name: draft.name, email: draft.email, contact: draft.mobile }, theme: { color: "#0060E6" }, handler: (payment: Record<string, string>) => void confirm({ bookingId: data.bookingId, confirmationToken: data.confirmationToken, ...payment }), modal: { ondismiss: () => { setLoading(null); toast.message("Payment cancelled. Your unpaid booking is saved."); } } });
      razorpay.open();
    } catch (error) { toast.error((error as Error).message); setLoading(null); }
  }
  async function confirm(payload: Record<string, unknown>) { const response = await fetch("/api/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const result = await response.json(); if (!response.ok || !result.success) { setLoading(null); return toast.error(result.message || "Payment verification failed"); } finish(result.data.bookingNumber, String(payload.confirmationToken)); }
  function finish(bookingNumber: string, token: string) { sessionStorage.removeItem("voibee-booking-draft"); router.push(`/booking-success?booking=${encodeURIComponent(bookingNumber)}&token=${encodeURIComponent(token)}`); }

  if (!draft) return <main className="min-h-[65vh] bg-white px-4 py-16"><div className="mx-auto max-w-xl rounded-3xl border border-border p-8 text-center"><h1 className="text-2xl font-extrabold">Booking details not found</h1><p className="mt-2 text-muted-foreground">Return to the package and enter your traveler details again.</p><Button asChild variant="gradient" className="mt-6"><Link href={`/packages/${trip.slug}`}>Back to package</Link></Button></div></main>;

  return <main className="min-h-screen bg-slate-50/60 px-4 py-10 sm:px-6"><div className="mx-auto max-w-5xl"><div className="mb-7"><p className="text-sm font-bold uppercase tracking-wider text-primary">Final step</p><h1 className="mt-1 text-3xl font-extrabold text-slate-950">Review your booking</h1><p className="mt-2 text-muted-foreground">Check your package, traveler and price details before choosing how to book.</p></div><div className="grid gap-6 lg:grid-cols-[1fr_340px]"><div className="space-y-6"><article className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">{trip.image ? <div className="relative h-60"><Image src={trip.image} alt={trip.title} fill sizes="(max-width: 1024px) 100vw, 650px" className="object-cover" /></div> : null}<div className="p-6"><p className="text-xs font-bold uppercase tracking-wider text-primary">Package details</p><h2 className="mt-1 text-2xl font-extrabold">{trip.title}</h2><div className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><p className="flex gap-2"><MapPin className="size-4 text-primary" />{trip.destination}, {trip.country}</p><p className="flex gap-2"><CalendarDays className="size-4 text-primary" />{formatDate(draft.travelStartDate)} – {formatDate(draft.travelEndDate)}</p><p className="flex gap-2"><Store className="size-4 text-primary" />Departure: {draft.departureCity}</p><p className="flex gap-2"><Users className="size-4 text-primary" />{draft.seats} travelers</p></div></div></article><article className="rounded-3xl border border-border bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-primary">Lead traveler</p><div className="mt-4 grid gap-4 sm:grid-cols-3"><div><p className="text-xs text-muted-foreground">Name</p><p className="font-bold">{draft.name}</p></div><div><p className="text-xs text-muted-foreground">Mobile</p><p className="font-bold">{draft.mobile}</p></div><div><p className="text-xs text-muted-foreground">Email</p><p className="break-all font-bold">{draft.email}</p></div></div><div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground"><span>{draft.adults} adult(s)</span><span>·</span><span>{draft.childrenWithBed + draft.childrenWithoutBed} child(ren)</span><span>·</span><span>{draft.infants} infant(s)</span></div></article></div><aside className="h-fit rounded-3xl border border-primary/15 bg-white p-6 shadow-lg shadow-primary/5"><h2 className="text-lg font-extrabold">Price details</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">{formatINR(draft.pricePerPerson)} × {draft.seats}</span><span>{formatINR(draft.totalAmount)}</span></div><div className="flex justify-between border-t border-border pt-4 text-lg"><span className="font-bold">Total</span><span className="font-extrabold text-primary">{formatINR(draft.totalAmount)}</span></div></div><div className="mt-6 space-y-3"><Button variant="gradient" size="lg" className="w-full" disabled={loading !== null} onClick={() => void createBooking("online")}>{loading === "online" ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}Book Online</Button><Button variant="outline" size="lg" className="w-full" disabled={loading !== null} onClick={() => void createBooking("offline")}>{loading === "offline" ? <Loader2 className="size-4 animate-spin" /> : <Phone className="size-4" />}Book Offline</Button></div><p className="mt-4 text-center text-xs leading-5 text-muted-foreground">Online booking opens Razorpay. Offline booking saves your request as not paid for the Voibee team to follow up.</p></aside></div></div></main>;
}
