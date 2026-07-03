"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { TRIP_CATEGORIES, TRIP_STATUSES } from "@/lib/constants";
import type { TripDTO } from "@/types";

type ItineraryItem = { day: number; title: string; description: string };

function toDateInput(d?: string) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

export function TripForm({ trip }: { trip?: TripDTO }) {
  const router = useRouter();
  const editing = Boolean(trip);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: trip?.title ?? "",
    destination: trip?.destination ?? "",
    description: trip?.description ?? "",
    basePrice: trip?.basePrice ?? 0,
    totalSeats: trip?.totalSeats ?? 0,
    availableSeats: trip?.availableSeats ?? 0,
    startDate: toDateInput(trip?.startDate),
    endDate: toDateInput(trip?.endDate),
    pickupLocation: trip?.pickupLocation ?? "",
    category: trip?.category ?? "Group",
    status: trip?.status ?? "draft",
    featured: trip?.featured ?? false,
    images: (trip?.images ?? []).join("\n"),
    inclusions: (trip?.inclusions ?? []).join("\n"),
    exclusions: (trip?.exclusions ?? []).join("\n"),
    tags: (trip?.tags ?? []).join(", "),
  });
  const [itinerary, setItinerary] = useState<ItineraryItem[]>(
    trip?.itinerary?.length
      ? trip.itinerary
      : [{ day: 1, title: "", description: "" }],
  );

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: form.title,
      destination: form.destination,
      description: form.description,
      basePrice: Number(form.basePrice),
      totalSeats: Number(form.totalSeats),
      availableSeats: Number(form.availableSeats) || Number(form.totalSeats),
      startDate: form.startDate,
      endDate: form.endDate,
      pickupLocation: form.pickupLocation,
      category: form.category,
      status: form.status,
      featured: form.featured,
      images: lines(form.images),
      inclusions: lines(form.inclusions),
      exclusions: lines(form.exclusions),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      itinerary: itinerary
        .filter((i) => i.title)
        .map((i, idx) => ({ ...i, day: idx + 1 })),
    };

    try {
      const res = await fetch(
        editing ? `/api/trips/${trip!._id}` : "/api/trips",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Save failed");
      toast.success(editing ? "Trip updated" : "Trip created");
      router.push("/admin/trips");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Trip name</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">Destination</Label>
            <Input value={form.destination} onChange={(e) => set("destination", e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">Pickup location</Label>
            <Input value={form.pickupLocation} onChange={(e) => set("pickupLocation", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="min-h-28"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
          <div>
            <Label className="mb-1.5 block">Base price (₹)</Label>
            <Input type="number" min={0} value={form.basePrice} onChange={(e) => set("basePrice", Number(e.target.value))} required />
          </div>
          <div>
            <Label className="mb-1.5 block">Total seats</Label>
            <Input type="number" min={0} value={form.totalSeats} onChange={(e) => set("totalSeats", Number(e.target.value))} />
          </div>
          <div>
            <Label className="mb-1.5 block">Available seats</Label>
            <Input type="number" min={0} value={form.availableSeats} onChange={(e) => set("availableSeats", Number(e.target.value))} />
          </div>
          <div>
            <Label className="mb-1.5 block">Start date</Label>
            <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">End date</Label>
            <Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">Category</Label>
            <Select value={form.category} onChange={(e) => set("category", e.target.value as typeof form.category)}>
              {TRIP_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block">Status</Label>
            <Select value={form.status} onChange={(e) => set("status", e.target.value as typeof form.status)}>
              {TRIP_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Featured trip
            </label>
          </div>
          <div>
            <Label className="mb-1.5 block">Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="adventure, trekking" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <Label className="mb-1.5 block">Image URLs (one per line)</Label>
            <Textarea
              value={form.images}
              onChange={(e) => set("images", e.target.value)}
              className="min-h-24 font-mono text-xs"
              placeholder="https://res.cloudinary.com/...&#10;https://images.unsplash.com/..."
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Paste Cloudinary/Unsplash URLs. (Cloudinary upload widget can be wired via the configured preset.)
            </p>
          </div>
          <div>
            <Label className="mb-1.5 block">Inclusions (one per line)</Label>
            <Textarea value={form.inclusions} onChange={(e) => set("inclusions", e.target.value)} className="min-h-28" />
          </div>
          <div>
            <Label className="mb-1.5 block">Exclusions (one per line)</Label>
            <Textarea value={form.exclusions} onChange={(e) => set("exclusions", e.target.value)} className="min-h-28" />
          </div>
        </CardContent>
      </Card>

      {/* Itinerary */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <Label>Itinerary</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setItinerary((it) => [...it, { day: it.length + 1, title: "", description: "" }])
              }
            >
              <Plus className="size-4" /> Add day
            </Button>
          </div>
          {itinerary.map((item, i) => (
            <div key={i} className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-[80px_1fr_auto]">
              <div className="flex items-center justify-center rounded-md bg-secondary font-semibold">
                Day {i + 1}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Title (e.g. Arrival & local sightseeing)"
                  value={item.title}
                  onChange={(e) =>
                    setItinerary((it) => it.map((x, idx) => (idx === i ? { ...x, title: e.target.value } : x)))
                  }
                />
                <Textarea
                  placeholder="Details"
                  value={item.description}
                  onChange={(e) =>
                    setItinerary((it) => it.map((x, idx) => (idx === i ? { ...x, description: e.target.value } : x)))
                  }
                  className="min-h-16"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setItinerary((it) => it.filter((_, idx) => idx !== i))}
                disabled={itinerary.length === 1}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="gradient" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {editing ? "Save changes" : "Create trip"}
        </Button>
      </div>
    </form>
  );
}
