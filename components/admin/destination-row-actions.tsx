"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EyeOff, Loader2, Pencil, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DestinationRowActions({ id, status, featured }: { id: string; status: string; featured: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function patch(payload: Record<string, unknown>, label: string) {
    setBusy(label);
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Update failed");
      toast.success("Destination updated");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function onDelete() {
    if (!confirm("Delete this destination?")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");
      toast.success("Destination deleted");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="ghost" size="icon" aria-label="Edit destination">
        <Link href={`/admin/destinations/${id}/edit`}><Pencil className="size-4" /></Link>
      </Button>
      <Button variant="ghost" size="icon" aria-label="Toggle highlight" onClick={() => patch({ featured: !featured }, "featured")} disabled={Boolean(busy)}>
        {busy === "featured" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className={featured ? "size-4 text-amber-500" : "size-4"} />}
      </Button>
      <Button variant="ghost" size="icon" aria-label="Toggle status" onClick={() => patch({ status: status === "active" ? "inactive" : "active" }, "status")} disabled={Boolean(busy)}>
        {busy === "status" ? <Loader2 className="size-4 animate-spin" /> : <EyeOff className="size-4" />}
      </Button>
      <Button variant="ghost" size="icon" aria-label="Delete destination" onClick={onDelete} disabled={Boolean(busy)}>
        {busy === "delete" ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4 text-destructive" />}
      </Button>
    </div>
  );
}
