import { PackageCardSkeleton } from "@/components/trip/package-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

function ServiceSkeleton() {
  return <div className="flex min-w-16 flex-col items-center gap-2"><Skeleton className="size-11 rounded-xl" /><Skeleton className="h-3 w-14" /></div>;
}

function ItineraryDaySkeleton({ expanded = false }: { expanded?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex min-h-[80px] items-center gap-4 bg-primary px-5 py-4 sm:px-6">
        <Skeleton className="size-12 shrink-0 rounded-xl bg-white/85" />
        <div className="flex-1"><Skeleton className="h-3 w-14 bg-white/35" /><Skeleton className="mt-2 h-5 w-48 max-w-[70%] bg-white/55" /></div>
        <Skeleton className="size-5 rounded-full bg-white/40" />
      </div>
      {expanded ? (
        <div className="space-y-4 p-4 sm:p-6">
          <div className="rounded-xl bg-secondary/35 p-4"><div className="flex items-center gap-3"><Skeleton className="size-9 rounded-lg" /><Skeleton className="h-5 w-24" /></div><Skeleton className="mt-4 h-4 w-full" /><Skeleton className="mt-2 h-4 w-4/5" /></div>
          <div className="rounded-xl bg-secondary/35 p-4"><div className="flex items-center gap-3"><Skeleton className="size-9 rounded-lg" /><Skeleton className="h-5 w-20" /></div><div className="mt-4 flex gap-2"><Skeleton className="h-8 w-24 rounded-full" /><Skeleton className="h-8 w-20 rounded-full" /></div></div>
        </div>
      ) : null}
    </div>
  );
}

export default function PackageDetailLoading() {
  return (
    <main className="min-h-screen bg-white" aria-label="Loading package details" aria-busy="true">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-[260px] w-full rounded-2xl sm:h-[360px] sm:rounded-3xl lg:h-[390px]" />

        <section className="py-7 sm:py-9">
          <div className="flex gap-2"><Skeleton className="h-6 w-24 rounded-full" /><Skeleton className="h-6 w-28 rounded-full" /></div>
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex-1"><Skeleton className="h-9 w-2/3 max-w-xl sm:h-10" /><div className="mt-3 flex flex-wrap gap-4"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-32" /></div></div>
            <Skeleton className="hidden h-[82px] w-24 rounded-2xl sm:block" />
          </div>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-4 sm:gap-x-10">{Array.from({ length: 6 }).map((_, index) => <ServiceSkeleton key={index} />)}</div>
        </section>

        <div className="sticky top-16 z-20 mb-9 flex min-h-[58px] items-center justify-between gap-4 border-y border-border bg-white/95 py-2">
          <div className="flex gap-4"><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-20" /></div>
          <div className="hidden gap-2 sm:flex"><Skeleton className="h-9 w-24 rounded-lg" /><Skeleton className="h-9 w-28 rounded-lg" /></div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-10">
            <section><Skeleton className="h-6 w-24" /><div className="mt-3 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-[94%]" /><Skeleton className="h-4 w-3/4" /></div><div className="mt-4 flex gap-2"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="h-6 w-24 rounded-full" /></div></section>

            <section>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-2 h-8 w-52" />
              <div className="mt-6 space-y-6"><ItineraryDaySkeleton expanded /><ItineraryDaySkeleton /><ItineraryDaySkeleton /></div>
            </section>

            <section className="grid gap-6 rounded-2xl border border-border/70 p-5 sm:grid-cols-2 sm:p-6">
              {Array.from({ length: 2 }).map((_, column) => <div key={column}><Skeleton className="h-6 w-36" /><div className="mt-4 space-y-3">{Array.from({ length: 4 }).map((__, row) => <div key={row} className="flex gap-2"><Skeleton className="size-4 shrink-0 rounded-full" /><Skeleton className="h-4 flex-1" /></div>)}</div></div>)}
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-primary/15 bg-white p-5 shadow-lg shadow-primary/5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-8 w-44" />
            <div className="mt-3 flex items-center gap-2"><Skeleton className="size-4 rounded-full" /><Skeleton className="h-4 w-56 max-w-[80%]" /></div>
            <Skeleton className="mt-5 h-12 w-full rounded-lg" />
            <div className="mt-3 flex justify-center gap-2"><Skeleton className="size-3.5 rounded-full" /><Skeleton className="h-3 w-52 max-w-[80%]" /></div>
          </aside>
        </div>

        <section className="mt-16">
          <Skeleton className="h-8 w-52" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }).map((_, index) => <PackageCardSkeleton key={index} />)}</div>
        </section>
      </div>
    </main>
  );
}
