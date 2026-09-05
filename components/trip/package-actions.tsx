"use client";

import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PackageActions({ slug, title }: { slug: string; title: string }) {
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, text: `Explore ${title} with Voibee Holidays`, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Package link copied");
  }

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="ghost" onClick={() => void share()} className="text-primary"><Share2 className="size-4" />Share</Button>
      <span className="h-6 w-px bg-border" />
      <Button asChild variant="ghost" className="text-primary"><a href={`/api/packages/${encodeURIComponent(slug)}/pdf`} download><Download className="size-4" />Download</a></Button>
    </div>
  );
}
