"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";

type TravellerPreview = { count: number; avatars: Array<{ name: string; image?: string }> };

export function JoinedTravellers({ tripId, compact = false }: { tripId: string; compact?: boolean }) {
  const { status } = useSession();
  const [preview, setPreview] = useState<TravellerPreview | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    let mounted = true;
    fetch(`/api/group-trips/${encodeURIComponent(tripId)}/travellers`)
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (mounted && payload?.success && payload.data?.count > 0) setPreview(payload.data);
      })
      .catch(() => undefined);
    return () => { mounted = false; };
  }, [status, tripId]);

  if (status !== "authenticated" || !preview) return null;

  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "rounded-2xl border border-primary/15 bg-primary/[0.04] px-4 py-3"}`} aria-label={`${preview.count} travellers have joined this group trip`}>
      <div className="flex -space-x-2" aria-hidden="true">
        {preview.avatars.map((traveller, index) => <span key={`${traveller.name}-${index}`} className="rounded-full ring-2 ring-white"><Avatar src={traveller.image} name={traveller.name} size={compact ? 26 : 34} /></span>)}
      </div>
      <p className={`${compact ? "text-xs" : "text-sm"} font-bold text-slate-700`}><span className="text-primary">{preview.count}</span> {preview.count === 1 ? "traveller has" : "travellers have"} joined</p>
    </div>
  );
}
