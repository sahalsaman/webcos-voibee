"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/home/search-bar";
import { cn } from "@/lib/utils";

export interface OfferSlide {
  title: string;
  description: string;
  image: string;
  href: string;
  price?: string;
  ctaLabel?: string;
}

export function OfferCarousel({ offers }: { offers: OfferSlide[] }) {
  const slides = useMemo(() => offers.slice(0, 6), [offers]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  function move(direction: -1 | 1) {
    setActive((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <section
      className="mx-auto max-w-[1440px] px-3 pb-8 pt-4 sm:px-5 sm:pt-6 lg:px-8"
      aria-roledescription="carousel"
      aria-label="Featured travel banners"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="relative min-h-[clamp(540px,calc(100svh-140px),680px)] overflow-hidden rounded-[26px] bg-slate-950 shadow-2xl shadow-slate-900/15">
        {slides.map((offer, index) => {
          const visible = index === active;

          return (
            <article
              key={`${offer.title}-${index}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                visible ? "z-10 opacity-100" : "pointer-events-none opacity-0",
              )}
              aria-hidden={!visible}
            >
              <Image
                src={offer.image}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/82 via-slate-950/50 to-slate-950/12" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/15" />

              <div className="relative mx-auto flex min-h-[clamp(540px,calc(100svh-140px),680px)] max-w-7xl items-center px-6 pb-36 pt-14 sm:px-10 sm:pb-40 lg:px-16 lg:pb-44">
                <div className="max-w-2xl text-white">
                  <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-blue-200 sm:text-sm">
                    Curated journeys by Voibee
                  </p>
                  <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
                    {offer.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-xl sm:leading-8">
                    {offer.description}
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Button asChild size="lg" className="rounded-full bg-white px-6 text-slate-950 shadow-lg hover:bg-blue-50">
                      <Link href={offer.href} tabIndex={visible ? 0 : -1}>
                        {offer.ctaLabel ?? "Explore packages"}
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                    {offer.price ? (
                      <span className="rounded-full border border-white/25 bg-black/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
                        {offer.price}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <div className="absolute inset-x-4 bottom-7 z-30 mx-auto max-w-4xl sm:bottom-9">
          <SearchBar />
        </div>

        {slides.length > 1 ? (
          <>
            {/* <button type="button" className="absolute left-3 top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-md transition hover:bg-white hover:text-slate-950 sm:left-5" onClick={() => move(-1)} aria-label="Previous banner">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" className="absolute right-3 top-1/2 z-30 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/20 text-white backdrop-blur-md transition hover:bg-white hover:text-slate-950 sm:right-5" onClick={() => move(1)} aria-label="Next banner">
              <ChevronRight className="size-5" />
            </button> */}
            <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-2 sm:bottom-4">
              {slides.map((offer, index) => (
                <button
                  key={`${offer.title}-dot`}
                  type="button"
                  className={cn("h-1.5 rounded-full shadow-sm transition-all", index === active ? "w-8 bg-white" : "w-2 bg-white/55 hover:bg-white/80")}
                  onClick={() => setActive(index)}
                  aria-label={`Show banner ${index + 1}`}
                  aria-current={index === active ? "true" : undefined}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
