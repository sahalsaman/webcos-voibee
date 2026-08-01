import { Skeleton } from "@/components/ui/skeleton";

function DestinationCardSkeleton({ index }: { index: number }) {
  return (
    <div key={index} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

function DestinationSectionSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <DestinationCardSkeleton key={index} index={index} />
        ))}
      </div>
    </section>
  );
}

export default function DestinationsLoading() {
  return (
    <main>
      <section className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Skeleton className="mb-4 h-7 w-40 rounded-full" />
            <Skeleton className="h-11 w-64" />
            <Skeleton className="mt-3 h-5 w-full max-w-xl" />
            <Skeleton className="mt-2 h-5 w-72" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Skeleton className="h-7 w-36 rounded-full" />
              <Skeleton className="h-7 w-44 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        <DestinationSectionSkeleton cards={4} />
        <DestinationSectionSkeleton cards={4} />
      </section>
    </main>
  );
}
