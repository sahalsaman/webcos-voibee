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
import { COUNTRY_OPTIONS, OFFER_CARD_STATUSES } from "@/lib/constants";
import type { OfferCardDTO } from "@/types";

export function OfferCardForm({ offer, onSaved, onCancel }: { offer?: OfferCardDTO; onSaved?: () => void; onCancel?: () => void }) {
  const router = useRouter();
  const editing = Boolean(offer);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: offer?.title ?? "",
    description: offer?.description ?? "",
    href: offer?.href ?? "/trips",
    ctaLabel: offer?.ctaLabel ?? "View packages",
    priceLabel: offer?.priceLabel ?? "",
    status: offer?.status ?? "active",
    featured: offer?.featured ?? false,
    sortOrder: offer?.sortOrder ?? 0,
    country: offer?.country ?? "India",
    countryCode: offer?.countryCode ?? "IN",
    images: (offer?.images ?? []).join("\n"),
    tags: (offer?.tags ?? []).join(", "),
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
      href: form.href || "/trips",
      ctaLabel: form.ctaLabel || "View packages",
      priceLabel: form.priceLabel,
      status: form.status,
      featured: form.featured,
      sortOrder: Number(form.sortOrder) || 0,
      country: form.country || "India",
      countryCode: (form.countryCode || "IN").toUpperCase(),
      images: lines(form.images),
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      videos: [],
    };

    try {
      const res = await fetch(editing ? `/api/admin/offers/${offer!._id}` : "/api/admin/offers", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Save failed");
      toast.success(editing ? "Offer card updated" : "Offer card created");
      if (onSaved) onSaved();
      else router.push("/admin/settings?section=offers");
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
            <Label className="mb-1.5 block">Offer title <span className="text-destructive">*</span></Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Description</Label>
            <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="min-h-24" />
          </div>
          <div>
            <Label className="mb-1.5 block">Link</Label>
            <Input value={form.href} onChange={(e) => set("href", e.target.value)} placeholder="/trips?destination=Dubai" />
          </div>
          <div>
            <Label className="mb-1.5 block">Button label</Label>
            <Input value={form.ctaLabel} onChange={(e) => set("ctaLabel", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Price label</Label>
            <Input value={form.priceLabel} onChange={(e) => set("priceLabel", e.target.value)} placeholder="₹8,999 or $499" />
          </div>
          <div>
            <Label className="mb-1.5 block">Sort order</Label>
            <Input type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", Number(e.target.value))} />
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
            <Label className="mb-1.5 block">Status</Label>
            <Select value={form.status} onChange={(e) => set("status", e.target.value as typeof form.status)}>
              {OFFER_CARD_STATUSES.map((status) => (
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
              Featured offer
            </label>
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Image URLs (one per line) <span className="text-destructive">*</span></Label>
            <Textarea value={form.images} onChange={(e) => set("images", e.target.value)} className="min-h-24 font-mono text-xs" required />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="summer, Dubai, family" />
          </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-5 -mb-5 flex flex-col-reverse gap-2 border-t border-border bg-background/95 px-5 py-4 backdrop-blur sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onCancel ?? (() => router.push("/admin/settings?section=offers"))}>
          Cancel
        </Button>
        <Button type="submit" variant="gradient" className="w-full sm:w-auto" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {editing ? "Save offer" : "Create offer"}
        </Button>
      </div>
    </form>
  );
}
