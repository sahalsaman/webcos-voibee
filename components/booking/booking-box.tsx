"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Minus, Plus, ShieldCheck, Loader2, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatINR, formatDate } from "@/lib/utils";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

interface BookingBoxProps {
  tripId: string;
  slug: string;
  pricePerPerson: number; // selling price shown to traveler
  availableSeats: number;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  partnerSlug?: string;
}

export function BookingBox({
  tripId,
  slug,
  pricePerPerson,
  availableSeats,
  startDate,
  endDate,
  pickupLocation,
  partnerSlug,
}: BookingBoxProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    mobile: "",
    notes: "",
  });

  const soldOut = availableSeats <= 0;
  const maxSeats = Math.min(availableSeats, 20);
  const total = pricePerPerson * seats;

  function setField(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleBook() {
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/trips/${slug}`)}`);
      return;
    }
    if (!form.name || !form.email || !/^[6-9]\d{9}$/.test(form.mobile)) {
      toast.error("Please enter your name, email and a valid 10-digit mobile.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId,
          partnerSlug,
          seats,
          travelerDetails: { ...form, travellers: seats },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Could not create booking");
      }

      const { bookingId, razorpayOrderId, amount, keyId, mock } = data.data;

      // Demo mode: Razorpay not configured server-side -> confirm directly.
      if (mock) {
        await confirm({ bookingId, mock: true });
        return;
      }

      const ready = await loadRazorpay();
      if (!ready) throw new Error("Failed to load payment gateway");

      const rzp = new window.Razorpay!({
        key: keyId,
        amount: amount * 100,
        currency: "INR",
        name: "Voibee",
        description: "Trip booking",
        order_id: razorpayOrderId,
        prefill: { name: form.name, email: form.email, contact: form.mobile },
        theme: { color: "#0060E6" },
        handler: async (resp: Record<string, string>) => {
          await confirm({
            bookingId,
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          });
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.message("Payment cancelled. Your booking is on hold.");
          },
        },
      });
      rzp.open();
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  async function confirm(payload: Record<string, unknown>) {
    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Verification failed");
      toast.success("Booking confirmed! 🎉");
      router.push(`/traveler/bookings?success=${data.data.bookingNumber}`);
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 shadow-lg">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-2xl font-bold">{formatINR(pricePerPerson)}</span>
          <span className="text-sm text-muted-foreground"> /person</span>
        </div>
        {!soldOut ? (
          <span className="text-xs font-medium text-success">
            {availableSeats} seats left
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <Calendar className="size-4 text-primary" />
          {formatDate(startDate)} → {formatDate(endDate)}
        </p>
        {pickupLocation ? (
          <p className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" /> Pickup: {pickupLocation}
          </p>
        ) : null}
      </div>

      {soldOut ? (
        <Button disabled className="mt-5 w-full" size="lg">
          Sold Out
        </Button>
      ) : (
        <>
          <div className="mt-5 space-y-3">
            <div>
              <Label className="mb-1.5 block">Travellers</Label>
              <div className="flex items-center justify-between rounded-lg border border-border p-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats((s) => Math.max(1, s - 1))}
                  disabled={seats <= 1}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="text-lg font-semibold">{seats}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setSeats((s) => Math.min(maxSeats, s + 1))}
                  disabled={seats >= maxSeats}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              <div>
                <Label htmlFor="bk-name" className="mb-1 block">Full name</Label>
                <Input
                  id="bk-name"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="bk-email" className="mb-1 block">Email</Label>
                  <Input
                    id="bk-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="bk-mobile" className="mb-1 block">Mobile</Label>
                  <Input
                    id="bk-mobile"
                    value={form.mobile}
                    onChange={(e) => setField("mobile", e.target.value)}
                    placeholder="10-digit"
                    maxLength={10}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="bk-notes" className="mb-1 block">Notes (optional)</Label>
                <Textarea
                  id="bk-notes"
                  value={form.notes}
                  onChange={(e) => setField("notes", e.target.value)}
                  placeholder="Any special requirements?"
                  className="min-h-16"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {formatINR(pricePerPerson)} × {seats}
              </span>
              <span>{formatINR(total)}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <Button
            onClick={handleBook}
            disabled={loading}
            variant="gradient"
            size="lg"
            className="mt-4 w-full"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? "Processing…" : "Book Now"}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-success" /> Secure payment via
            Razorpay
          </p>
        </>
      )}
    </div>
  );
}
