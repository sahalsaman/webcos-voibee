"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRY_OPTIONS, EVENT_STATUSES } from "@/lib/constants";
import type { EventDTO } from "@/types";

function dateValue(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function EventForm({ event, onSaved, onCancel }: { event?: EventDTO; onSaved?: () => void; onCancel?: () => void }) {
  const router = useRouter();
  const editing = Boolean(event);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: event?.title ?? "",
    description: event?.description ?? "",
    venue: event?.venue ?? "",
    city: event?.city ?? "",
    country: event?.country ?? "India",
    countryCode: event?.countryCode ?? "IN",
    startDate: dateValue(event?.startDate),
    endDate: dateValue(event?.endDate),
    priceLabel: event?.priceLabel ?? "",
    href: event?.href ?? "/packages",
    ctaLabel: event?.ctaLabel ?? "Explore packages",
    status: event?.status ?? "active",
    featured: event?.featured ?? false,
    sortOrder: event?.sortOrder ?? 0,
    images: (event?.images ?? []).join("\n"),
    tags: (event?.tags ?? []).join(", "),
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onCountryChange(value: string) {
    const [code, name] = value.split("|");
    setForm((current) => ({ ...current, countryCode: code, country: name }));
  }

  function lines(value: string) {
    return value.split("\n").map((x) => x.trim()).filter(Boolean);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      venue: form.venue,
      city: form.city,
      country: form.country || "India",
      countryCode: (form.countryCode || "IN").toUpperCase(),
      startDate: form.startDate,
      endDate: form.endDate || undefined,
      priceLabel: form.priceLabel,
      href: form.href || "/packages",
      ctaLabel: form.ctaLabel || "Explore packages",
      status: form.status,
      featured: form.featured,
      sortOrder: Number(form.sortOrder) || 0,
      images: lines(form.images),
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    };

    try {
      const res = await fetch(editing ? `/api/admin/events/${event!._id}` : "/api/admin/events", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Save failed");
      toast.success(editing ? "Event updated" : "Event created");
      if (onSaved) onSaved();
      else router.push("/admin/inventory/events");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid items-start gap-x-4 gap-y-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Event title <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="min-h-28" />
          </div>
          <div>
            <Label className="mb-1.5 block">Venue</Label>
            <Input value={form.venue} onChange={(e) => set("venue", e.target.value)} placeholder="Festival ground, beach, stadium" />
          </div>
          <div>
            <Label className="mb-1.5 block">City / place <span className="text-destructive">*</span></Label>
            <Input value={form.city} onChange={(e) => set("city", e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">Country</Label>
            <Select value={`${form.countryCode}|${form.country}`} onChange={(e) => onCountryChange(e.target.value)}>
              {COUNTRY_OPTIONS.map((country) => (
                <option key={country.code} value={`${country.code}|${country.name}`}>{country.name} ({country.code})</option>
              ))}
            </Select>
          </div>
          <div>
            <Label className="mb-1.5 block">Country code</Label>
            <Input value={form.countryCode} readOnly />
          </div>
          <div>
            <Label className="mb-1.5 block">Start date <span className="text-destructive">*</span></Label>
            <Input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} required />
          </div>
          <div>
            <Label className="mb-1.5 block">End date</Label>
            <Input type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Price label</Label>
            <Input value={form.priceLabel} onChange={(e) => set("priceLabel", e.target.value)} placeholder="Free entry, From ₹4,999" />
          </div>
          <div>
            <Label className="mb-1.5 block">Link</Label>
            <Input value={form.href} onChange={(e) => set("href", e.target.value)} placeholder="/packages?category=Festival" />
          </div>
          <div>
            <Label className="mb-1.5 block">Button label</Label>
            <Input value={form.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Sort order</Label>
            <Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
          </div>
          <div>
            <Label className="mb-1.5 block">Status</Label>
            <Select value={form.status} onChange={(e) => set("status", e.target.value as typeof form.status)}>
              {EVENT_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
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
              Highlight event
            </label>
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Image URLs (one per line)</Label>
            <Textarea value={form.images} onChange={(e) => set("images", e.target.value)} className="min-h-24 font-mono text-xs" />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="festival, music, kerala, beach" />
          </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-5 -mb-5 flex flex-col-reverse gap-2 border-t border-border bg-background/95 px-5 py-4 backdrop-blur sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onCancel ?? (() => router.push("/admin/inventory/events"))}>
          Cancel
        </Button>
        <Button type="submit" variant="gradient" className="w-full sm:w-auto" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {editing ? "Save event" : "Create event"}
        </Button>
      </div>
    </form>
  );
}
