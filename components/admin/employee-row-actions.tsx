"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmployeeRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function onDelete() {
    if (!confirm("Delete this employee?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/employees/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");
      toast.success("Employee deleted");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild variant="ghost" size="icon" aria-label="Edit employee">
        <Link href={`/admin/employees/${id}/edit`}><Pencil className="size-4" /></Link>
      </Button>
      <Button variant="ghost" size="icon" aria-label="Delete employee" onClick={onDelete} disabled={deleting}>
        {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4 text-destructive" />}
      </Button>
    </div>
  );
}
