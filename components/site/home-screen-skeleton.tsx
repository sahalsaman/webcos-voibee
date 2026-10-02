import { Skeleton } from "@/components/ui/skeleton";

export function HomeScreenSkeleton() {
  return (
    <main className="min-h-screen bg-white" aria-label="Loading home page" aria-busy="true">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative h-[360px] overflow-hidden rounded-[32px] bg-slate-200 sm:h-[430px]">
          <Skeleton className="absolute inset-0 rounded-none bg-slate-200" />
          <div className="relative flex h-full max-w-xl flex-col justify-center p-7 sm:p-12">
            <Skeleton className="h-5 w-32 bg-white/70" />
            <Skeleton className="mt-5 h-11 w-full max-w-md bg-white/80 sm:h-14" />
            <Skeleton className="mt-3 h-5 w-4/5 bg-white/70" />
            <div className="mt-8 flex rounded-2xl bg-white/90 p-3 shadow-lg">
              <Skeleton className="h-12 flex-1 bg-slate-200" />
              <Skeleton className="ml-3 size-12 shrink-0 rounded-xl bg-slate-300" />
            </div>
          </div>
        </section>
        <section className="mt-12">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-3 h-5 w-full max-w-xl" />
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="aspect-[4/3] rounded-2xl" />)}
          </div>
        </section>
        <section className="mt-14">
          <Skeleton className="h-8 w-72" />
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-[360px] rounded-3xl" />)}
          </div>
        </section>
      </div>
    </main>
  );
}
