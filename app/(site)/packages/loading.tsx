import { PackageCardSkeleton } from "@/components/trip/package-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PackagesLoading() {
  return (
    <main className="min-h-screen bg-white" aria-label="Loading tour packages" aria-busy="true">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="relative mb-8 overflow-hidden rounded-[28px] bg-slate-200 px-6 py-16 shadow-xl sm:px-10 lg:px-12">
          <div className="relative mx-auto max-w-3xl text-center">
            <Skeleton className="mx-auto h-10 w-64 max-w-full bg-slate-300 sm:h-12 sm:w-80" />
            <div className="mt-7 flex rounded-2xl bg-white/90 p-3 shadow-lg">
              <Skeleton className="h-12 flex-1 bg-slate-200" />
              <Skeleton className="ml-3 size-12 shrink-0 rounded-xl bg-slate-300" />
            </div>
          </div>
        </header>

        <section className="mb-8" aria-label="Loading package filters">
          <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <div className="grid grid-cols-2 gap-2"><Skeleton className="h-10" /><Skeleton className="h-10" /></div>
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <div className="flex items-center gap-2"><Skeleton className="h-10 flex-1" /><Skeleton className="h-3 w-3" /><Skeleton className="h-10 flex-1" /></div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:col-span-2 lg:flex-nowrap lg:justify-end">
              <div className="flex items-center gap-2"><Skeleton className="size-5" /><Skeleton className="h-4 w-16" /></div>
              <Skeleton className="hidden h-8 w-px rounded-none lg:block" />
              <Skeleton className="h-12 min-w-[280px] flex-1 rounded-xl lg:max-w-[280px]" />
              <Skeleton className="h-12 w-[86px] rounded-xl" />
            </div>
          </div>
          <div className="relative mt-5 flex h-[58px] items-center gap-5 overflow-hidden rounded-2xl border border-border/70 bg-secondary/35 px-12 shadow-sm">
            <Skeleton className="absolute left-1 size-9 rounded-full" />
            {Array.from({ length: 7 }).map((_, index) => <Skeleton key={index} className="h-4 w-28 shrink-0" />)}
            <Skeleton className="absolute right-1 size-9 rounded-full" />
          </div>
        </section>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <PackageCardSkeleton key={index} />)}
        </div>
      </div>
    </main>
  );
}
