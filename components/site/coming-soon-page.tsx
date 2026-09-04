import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComingSoonPage({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-72px)] items-center overflow-hidden px-4 py-16 sm:px-6">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-sky-50 via-background to-indigo-50 dark:from-sky-950/30 dark:via-background dark:to-indigo-950/20" />
      <div className="absolute left-1/2 top-1/2 -z-10 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

      <section className="mx-auto w-full max-w-3xl rounded-[32px] border border-border/70 bg-card/85 px-6 py-14 text-center shadow-2xl shadow-primary/10 backdrop-blur-xl sm:px-12 sm:py-16">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-sky-400 text-primary-foreground shadow-xl shadow-primary/25">
          <Icon className="size-10" />
        </div>
        <p className="mt-7 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">
          <Sparkles className="size-4" /> {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl">Coming Soon</h1>
        <h2 className="mt-4 text-xl font-bold sm:text-2xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="gradient" size="lg"><Link href="/packages">Explore holidays</Link></Button>
          <Button asChild variant="outline" size="lg"><Link href="/"><ArrowLeft className="size-4" />Back to home</Link></Button>
        </div>
      </section>
    </main>
  );
}
