import { BadgeCheck, ClipboardCheck, Headphones, ShieldCheck } from "lucide-react";

const checks = [
  { icon: BadgeCheck, title: "Verified properties", text: "Property identity and operational details reviewed by Voibee." },
  { icon: ClipboardCheck, title: "Quality checkpoints", text: "Stay details are checked against the published package itinerary." },
  { icon: Headphones, title: "Stay support", text: "Assistance is available if your confirmed stay differs from the itinerary." },
] as const;

export function SafeStay() {
  return (
    <section aria-labelledby="safe-stay-title" className="overflow-hidden rounded-2xl border border-primary/15 bg-primary/[0.035]">
      <div className="flex flex-col gap-4 border-b border-primary/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm"><ShieldCheck className="size-6" /></span>
          <div><p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Stay with confidence</p><h2 id="safe-stay-title" className="mt-1 text-2xl font-extrabold">SafeStay™ by Voibee</h2></div>
        </div>
        <span className="w-fit rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">Included with this package</span>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-3 sm:p-6">
        {checks.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3"><Icon className="mt-0.5 size-5 shrink-0 text-primary" /><div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p></div></div>)}
      </div>
    </section>
  );
}
