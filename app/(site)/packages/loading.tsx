import { PackageCardSkeleton } from "@/components/trip/package-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function PackagesLoading() {
  return (
    <main className="min-h-screen bg-white" aria-label="Loading tour packages" aria-busy="true">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="relative mb-18 rounded-[28px] bg-slate-200 px-6 py-16 shadow-xl sm:px-10 lg:px-12">
          <div className="relative mx-auto max-w-3xl text-center">
            <Skeleton className="mx-auto h-10 w-64 max-w-full bg-slate-300 sm:h-12 sm:w-80" />
            <div className="mt-7 flex rounded-2xl bg-white/90 p-3 shadow-lg">
              <Skeleton className="h-12 flex-1 bg-slate-200" />
              <Skeleton className="ml-3 size-12 shrink-0 rounded-xl bg-slate-300" />
            </div>
          </div>
          <div className="absolute left-6 right-6 z-40 mt-5 rounded-2xl bg-white/95 p-2 shadow-md sm:left-10 sm:right-10 lg:left-12 lg:right-12">
            <div className="flex gap-2 overflow-hidden sm:gap-3">
              {Array.from({ length: 8 }).map((_, index) => <div key={index} className="flex min-h-[84px] w-[92px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl sm:w-[108px]"><Skeleton className="size-10 rounded-xl" /><Skeleton className="h-3 w-16" /></div>)}
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
        </section>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <PackageCardSkeleton key={index} />)}
        </div>
      </div>
    </main>
  );
}
