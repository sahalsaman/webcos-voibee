import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PackageCardSkeleton({ view = "grid" }: { view?: "grid" | "list" }) {
  return (
    <div className={cn(
      "flex h-full overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm",
      view === "list" ? "flex-col sm:flex-row" : "flex-col",
    )}>
      <div className={cn("relative aspect-[4/3] overflow-hidden", view === "list" && "sm:aspect-auto sm:min-h-64 sm:w-[38%] sm:shrink-0")}>
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full bg-white/55" />
          <Skeleton className="h-6 w-16 rounded-full bg-white/55" />
        </div>
        <Skeleton className="absolute bottom-3 right-3 h-6 w-14 rounded-full bg-white/55" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2"><Skeleton className="size-3.5 rounded-full" /><Skeleton className="h-3 w-24" /></div>
        <Skeleton className="mt-2 h-5 w-4/5" />
        <Skeleton className="mt-1.5 h-5 w-3/5" />
        <div className="mt-3 flex gap-4"><Skeleton className="h-3.5 w-20" /><Skeleton className="h-3.5 w-24" /></div>
        <div className="mt-3 flex gap-2">{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="size-8 rounded-lg" />)}</div>
        <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
          <div><Skeleton className="h-3 w-20" /><Skeleton className="mt-2 h-5 w-32" /></div>
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}
