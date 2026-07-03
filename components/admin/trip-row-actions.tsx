"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TripRowActions({ id, slug }: { id: string; slug: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this trip? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/trips/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      toast.success("Trip deleted");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="ghost" size="icon" aria-label="View">
        <Link href={`/trips/${slug}`} target="_blank">
          <ExternalLink className="size-4" />
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon" aria-label="Edit">
        <Link href={`/admin/trips/${id}/edit`}>
          <Pencil className="size-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" aria-label="Delete" onClick={onDelete} disabled={deleting}>
        {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4 text-destructive" />}
      </Button>
    </div>
  );
}
