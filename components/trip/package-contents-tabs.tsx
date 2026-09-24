"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export function PackageContentsTabs({ inclusions, exclusions }: { inclusions: string[]; exclusions: string[] }) {
  const [tab, setTab] = useState<"inclusion" | "exclusion">(inclusions.length ? "inclusion" : "exclusion");
  const items = tab === "inclusion" ? inclusions : exclusions;
  const isInclusion = tab === "inclusion";

  return (
    <section className="scroll-mt-32">
      <div className="sticky top-16 z-20 mb-6 flex items-center border-y border-border bg-white/95 py-2 backdrop-blur">
        <nav className="flex items-center gap-1" aria-label="Package inclusions and exclusions" role="tablist">
          <button type="button" role="tab" onClick={() => setTab("inclusion")} aria-selected={isInclusion} className={`border-b-2 px-3 py-3 text-sm sm:px-4 ${isInclusion ? "border-primary font-bold text-primary" : "border-transparent font-semibold text-slate-600 hover:text-primary"}`}>Inclusion</button>
          <button type="button" role="tab" onClick={() => setTab("exclusion")} aria-selected={!isInclusion} className={`border-b-2 px-3 py-3 text-sm sm:px-4 ${!isInclusion ? "border-primary font-bold text-primary" : "border-transparent font-semibold text-slate-600 hover:text-primary"}`}>Exclusion</button>
        </nav>
      </div>
      <div className="rounded-2xl border border-border/70 p-5 sm:p-6">
        <h2 className="mb-4 text-xl font-semibold">{isInclusion ? "Package inclusions" : "Package exclusions"}</h2>
        {items.length ? <ul className="space-y-3">{items.map((item, index) => <li key={`${item}-${index}`} className="flex items-start gap-2 text-sm leading-6"><span className="mt-1 shrink-0">{isInclusion ? <CheckCircle2 className="size-4 text-success" /> : <XCircle className="size-4 text-destructive" />}</span><span>{item}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">No {isInclusion ? "inclusions" : "exclusions"} have been added for this package.</p>}
      </div>
    </section>
  );
}
