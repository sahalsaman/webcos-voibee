import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function PackageCardSkeleton({ view = "grid" }: { view?: "grid" | "list" }) {
  return (
    <div className={cn(
      "flex h-full flex-col overflow-hidden rounded-[30px] border border-slate-200 bg-white p-3 shadow-[0_12px_34px_rgba(15,23,42,0.08)]",
      view === "list" && "sm:grid sm:grid-cols-[minmax(280px,0.78fr)_minmax(0,1.22fr)]",
    )}>
      <div className={cn("relative aspect-[4/3] overflow-hidden rounded-[23px]", view === "list" && "sm:aspect-auto sm:min-h-full")}>
        <Skeleton className="absolute inset-0 rounded-[23px]" />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <Skeleton className="h-6 w-24 rounded-full bg-white/60" />
          <Skeleton className="size-10 rounded-full bg-white/60" />
        </div>
        <Skeleton className="absolute bottom-3 right-3 h-6 w-14 rounded-full bg-white/60" />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4 sm:px-3 sm:pb-3">
        <div className="flex items-center justify-between gap-3"><Skeleton className="h-3 w-28" /><Skeleton className="h-3 w-16" /></div>
        <Skeleton className="mt-3 h-6 w-4/5" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1.5 h-4 w-3/4" />
        <div className="mt-3 flex gap-2">{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="size-8 rounded-lg" />)}</div>
        <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-3">
          {Array.from({ length: 3 }).map((_, index) => <div key={index} className="flex flex-col items-center gap-1.5 px-2"><Skeleton className="h-4 w-12" /><Skeleton className="h-2.5 w-10" /></div>)}
        </div>
        <div className="mt-3 flex justify-between"><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-20" /></div>
        <Skeleton className="mt-3 h-11 w-full rounded-full" />
      </div>
    </div>
  );
}
