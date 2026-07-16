"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BOOKING_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import { formatINR } from "@/lib/utils";

interface BookableTrip {
  _id: string;
  title: string;
  destination: string;
  basePrice: number;
  availableSeats: number;
  totalSeats: number;
}

export function ManualBookingDrawer({ trips }: { trips: BookableTrip[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tripId: trips[0]?._id ?? "",
    seats: 1,
    name: "",
    email: "",
    mobile: "",
    notes: "",
    status: "confirmed",
    paymentStatus: "paid",
  });

  const selectedTrip = useMemo(
    () => trips.find((trip) => trip._id === form.tripId),
    [form.tripId, trips],
  );
  const totalAmount = (selectedTrip?.basePrice ?? 0) * Number(form.seats || 0);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function close() {
    if (!loading) setOpen(false);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTrip) {
      toast.error("Select a trip");
      return;
    }
    if (form.seats > selectedTrip.availableSeats) {
      toast.error(`Only ${selectedTrip.availableSeats} seat(s) left`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: form.tripId,
          seats: Number(form.seats),
          status: form.status,
          paymentStatus: form.paymentStatus,
          travelerDetails: {
            name: form.name,
            email: form.email,
            mobile: form.mobile,
            travellers: Number(form.seats),
            notes: form.notes || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Booking failed");
      toast.success(`Booking ${data.data.bookingNumber} created`);
      setOpen(false);
      setForm({
        tripId: trips[0]?._id ?? "",
        seats: 1,
        name: "",
        email: "",
        mobile: "",
        notes: "",
        status: "confirmed",
        paymentStatus: "paid",
      });
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button type="button" variant="gradient" onClick={() => setOpen(true)}>
        <Plus className="size-4" /> Add Booking
      </Button>

      {open ? (
        <div className="fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            onClick={close}
            aria-label="Close manual booking form"
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-border bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-lg font-bold">Add manual booking</h2>
                <p className="text-sm text-muted-foreground">Create an offline/admin booking</p>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={close} aria-label="Close">
                <X className="size-5" />
              </Button>
            </div>

            <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                <div className="space-y-1.5">
                  <Label>Trip</Label>
                  <Select
                    value={form.tripId}
                    onChange={(e) => set("tripId", e.target.value)}
                    required
                  >
                    {trips.map((trip) => (
                      <option key={trip._id} value={trip._id}>
                        {trip.title} - {trip.destination} ({trip.availableSeats} seats)
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Seats</Label>
                    <Input
                      type="number"
                      min={1}
                      max={selectedTrip?.availableSeats || 1}
                      value={form.seats}
                      onChange={(e) => set("seats", Number(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Total amount</Label>
                    <Input value={formatINR(totalAmount)} readOnly />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Traveler name</Label>
                    <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mobile</Label>
                    <Input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="10 digit mobile" required />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Booking status</Label>
                    <Select value={form.status} onChange={(e) => set("status", e.target.value)}>
                      {BOOKING_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Payment status</Label>
                    <Select value={form.paymentStatus} onChange={(e) => set("paymentStatus", e.target.value)}>
                      {PAYMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Notes</Label>
                  <Textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} className="min-h-24" />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
                <Button type="button" variant="outline" onClick={close} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" disabled={loading || trips.length === 0}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                  Create booking
                </Button>
              </div>
            </form>
          </aside>
        </div>
      ) : null}
    </>
  );
}
