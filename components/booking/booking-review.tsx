"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Phone, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/components/currency/currency-provider";
import type { BookingDraft } from "@/components/booking/booking-box";
import { appConfig } from "@/app/app,config";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type TripSummary = {
  _id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  image: string;
  basePrice: number;
};

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function BookingReview({ hasActivities, trip }: { hasActivities: boolean; trip: TripSummary }) {
  const router = useRouter();
  const { formatCurrency, currency } = useCurrency();
  const [loading, setLoading] = useState<"online" | "offline" | null>(null);
  const storedDraft = useSyncExternalStore(
    () => () => undefined,
    () => sessionStorage.getItem("voibee-booking-draft"),
    () => null,
  );
  const draft = useMemo(() => {
    try {
      const value = storedDraft ? (JSON.parse(storedDraft) as BookingDraft) : null;
      return value?.slug === trip.slug && value.tripId === trip._id ? value : null;
    } catch {
      return null;
    }
  }, [storedDraft, trip._id, trip.slug]);

  async function createBooking(mode: "online" | "offline") {
    if (!draft) return;
    setLoading(mode);

    try {
      const activityAmount = (draft.selectedActivities ?? []).reduce((total, activity) => total + activity.basePrice * activity.adultTickets + (activity.childPrice ?? activity.basePrice) * activity.childTickets, 0);
      const activityRequest = draft.selectedActivities?.length
        ? `Activities: ${draft.selectedActivities.map((activity) => `${activity.title} (${activity.activityDate}; ${activity.adultTickets} adult, ${activity.childTickets} child)`).join("; ")}.`
        : undefined;
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: draft.tripId,
          partnerSlug: draft.partnerSlug,
          bookingMode: mode,
          seats: draft.seats,
          activityAmount,
          travelStartDate: draft.travelStartDate,
          travelEndDate: draft.travelEndDate,
          travelerDetails: {
            name: draft.name,
            email: draft.email,
            mobile: draft.mobile,
            travellers: draft.seats,
            departureCity: draft.departureCity,
            adults: draft.adults,
            childrenWithBed: draft.childrenWithBed,
            childrenWithoutBed: draft.childrenWithoutBed,
            infants: draft.infants,
            notes: activityRequest,
          },
          travelCompliance: draft.travelCompliance,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not create booking");

      const data = result.data as Record<string, string | number | boolean>;
      if (mode === "offline") return finish(String(data.bookingNumber), String(data.confirmationToken));
      if (data.mock) return confirm({ bookingId: data.bookingId, confirmationToken: data.confirmationToken, mock: true });

      const ready = await loadRazorpay();
      if (!ready) throw new Error("Could not load Razorpay");
      const razorpay = new window.Razorpay!({
        key: data.keyId,
        amount: Number(data.amount) * 100,
        currency: "INR",
        name: appConfig.appName,
        description: trip.title,
        order_id: data.razorpayOrderId,
        prefill: { name: draft.name, email: draft.email, contact: draft.mobile },
        theme: { color: "#0D4884" },
        handler: (payment: Record<string, string>) => void confirm({ bookingId: data.bookingId, confirmationToken: data.confirmationToken, ...payment }),
        modal: { ondismiss: () => { setLoading(null); toast.message("Payment cancelled. Your unpaid booking is saved."); } },
      });
      razorpay.open();
    } catch (error) {
      toast.error((error as Error).message);
      setLoading(null);
    }
  }

  async function confirm(payload: Record<string, unknown>) {
    const response = await fetch("/api/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      setLoading(null);
      return toast.error(result.message || "Payment verification failed");
    }
    finish(result.data.bookingNumber, String(payload.confirmationToken));
  }

  function finish(bookingNumber: string, token: string) {
    sessionStorage.removeItem("voibee-booking-draft");
    router.push(`/booking-success?booking=${encodeURIComponent(bookingNumber)}&token=${encodeURIComponent(token)}`);
  }

  if (!draft) {
    return <main className="min-h-[65vh] bg-white px-4 py-16"><div className="mx-auto max-w-xl rounded-3xl border border-border p-8 text-center"><h1 className="text-2xl font-extrabold">Booking details not found</h1><p className="mt-2 text-muted-foreground">Return to the package and enter your traveler details again.</p><Button asChild className="mt-6"><Link href={`/packages/${trip.slug}`}>Back to package</Link></Button></div></main>;
  }

  const activitiesUrl = `/booking-review/activities?package=${encodeURIComponent(trip.slug)}`;
  const selectedActivities = draft.selectedActivities ?? [];
  const activityAmount = selectedActivities.reduce((total, activity) => total + activity.basePrice * activity.adultTickets + (activity.childPrice ?? activity.basePrice) * activity.childTickets, 0);
  const bookingTotal = draft.totalAmount + activityAmount;

  return <main className="min-h-screen bg-slate-50/60 px-4 py-10 sm:px-6"><div className="mx-auto max-w-5xl"><div className="mb-7"><p className="text-sm font-bold uppercase tracking-wider text-primary">Final step</p><h1 className="mt-1 text-3xl font-extrabold text-slate-950">Review your booking</h1></div><div className="grid gap-6 lg:grid-cols-[1fr_340px]"><div className="space-y-6"><article className="rounded-3xl border border-border bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-primary">Lead traveler</p><p className="mt-3 font-bold">{draft.name}</p><p className="text-sm text-muted-foreground">{draft.email} · {draft.mobile}</p></article>{hasActivities ? <article className="rounded-3xl border border-border bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">Things to do</p><h2 className="mt-1 text-xl font-extrabold">Add activities</h2></div><Button asChild variant="outline"><Link href={activitiesUrl}><Plus className="size-4" />Add activities</Link></Button></div>{selectedActivities.length ? <ul className="mt-5 space-y-2">{selectedActivities.map((activity) => <li key={activity._id} className="flex justify-between gap-3 rounded-xl bg-secondary/60 p-3 text-sm"><span><b>{activity.title}</b><span className="block text-xs text-muted-foreground">{activity.activityDate}</span></span><span>{activity.adultTickets + activity.childTickets} ticket(s)</span></li>)}</ul> : null}</article> : null}</div><aside className="h-fit rounded-3xl border border-primary/15 bg-white p-6 shadow-lg"><h2 className="text-lg font-extrabold">Price details</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Package {formatCurrency(draft.pricePerPerson)} × {draft.seats}</span><b>{formatCurrency(draft.totalAmount)}</b></div>{selectedActivities.length ? <><p className="pt-2 font-bold">Activities</p>{selectedActivities.map((activity) => <div key={activity._id} className="flex justify-between gap-3"><span>{activity.title} · {formatCurrency(activity.basePrice)} × {activity.adultTickets + activity.childTickets}</span><b>{formatCurrency(activity.basePrice * activity.adultTickets + (activity.childPrice ?? activity.basePrice) * activity.childTickets)}</b></div>)}</> : null}<div className="flex justify-between border-t border-border pt-4 text-lg"><span className="font-bold">Total</span><span className="font-extrabold text-primary">{formatCurrency(bookingTotal)}</span></div></div>{currency !== "INR" ? <p className="mt-3 text-xs text-muted-foreground">Displayed in {currency}. Online payment is processed in INR.</p> : null}<div className="mt-6 space-y-3"><Button size="lg" className="w-full" disabled={loading !== null} onClick={() => void createBooking("online")}>{loading === "online" ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}Pay Online</Button><Button variant="outline" size="lg" className="w-full" disabled={loading !== null} onClick={() => void createBooking("offline")}>{loading === "offline" ? <Loader2 className="size-4 animate-spin" /> : <Phone className="size-4" />}Confirm & Pay Offline</Button></div></aside></div></div></main>;
}
