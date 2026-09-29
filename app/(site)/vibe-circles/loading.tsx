import { Skeleton } from "@/components/ui/skeleton";

function VibeCircleCardSkeleton() {
  return (
    <div className="min-w-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]"><Skeleton className="absolute inset-0 rounded-[22px]" /><div className="absolute inset-x-3 top-3 flex justify-between"><Skeleton className="h-6 w-24 rounded-full bg-white/60" /><Skeleton className="h-6 w-16 rounded-full bg-white/60" /></div><Skeleton className="absolute bottom-3 left-3 size-10 rounded-full bg-white/60" /><Skeleton className="absolute bottom-3 right-3 h-6 w-14 rounded-full bg-white/60" /></div>
      <div className="px-1 pt-3"><div className="flex justify-between"><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-10" /></div><Skeleton className="mt-3 h-5 w-full" /><Skeleton className="mt-2 h-5 w-3/4" /><Skeleton className="mt-4 h-4 w-32" /><div className="mt-4 flex justify-between"><Skeleton className="h-6 w-24" /><Skeleton className="h-4 w-20" /></div></div>
    </div>
  );
}

export default function VibeCirclesLoading() {
  return (
    <main className="min-h-screen bg-white" aria-label="Loading Voibee Vibe Circles" aria-busy="true">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="relative mb-8 overflow-hidden rounded-[28px] bg-slate-200 px-6 py-16 shadow-xl sm:px-10 lg:px-12">
          <div className="mx-auto max-w-3xl text-center"><Skeleton className="mx-auto h-10 w-72 sm:h-12 sm:w-96" /><Skeleton className="mx-auto mt-4 h-4 w-full max-w-xl" /><div className="mt-7 flex rounded-2xl bg-white/90 p-3 shadow-lg"><Skeleton className="h-12 flex-1" /><Skeleton className="ml-3 size-12 rounded-xl" /></div></div>
          <div className="mt-5 flex justify-center"><div className="flex max-w-full gap-2 overflow-hidden rounded-2xl bg-white/95 p-2 shadow-md sm:gap-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="flex min-h-[84px] w-[92px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl sm:w-[108px]"><Skeleton className="size-10 rounded-xl" /><Skeleton className="h-3 w-16" /></div>)}</div></div>
        </header>
        <section className="mb-8 grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div><div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div><div className="flex items-end gap-3 sm:col-span-2"><Skeleton className="h-12 flex-1" /><Skeleton className="h-12 w-24" /></div></section>
        <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <VibeCircleCardSkeleton key={index} />)}</div>
      </div>
    </main>
  );
}
