"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface OfferSlide {
  title: string;
  description: string;
  image: string;
  href: string;
  price?: string;
  ctaLabel?: string;
}

export function OfferCarousel({ offers }: { offers: OfferSlide[] }) {
  const slides = useMemo(() => offers.slice(0, 4), [offers]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  function move(direction: -1 | 1) {
    setActive((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {slides.map((offer) => (
            <Link
              key={offer.title}
              href={offer.href}
              className="relative block min-w-full overflow-hidden"
            >
              <div className="relative min-h-[220px] sm:min-h-[260px]">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
                <div className="relative z-10 flex min-h-[220px] max-w-2xl flex-col justify-center px-5 py-8 text-white sm:min-h-[260px] sm:px-8 lg:px-10">
                  <Badge variant="glass" className="mb-4 w-fit text-white">
                    Limited offer
                  </Badge>
                  <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl">
                    {offer.title}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-white/85 sm:text-base">
                    {offer.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {offer.price ? (
                      <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-950 shadow-sm">
                        {offer.price}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-2 text-sm font-semibold">
                      {offer.ctaLabel ?? "View trips"} <ArrowRight className="size-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {slides.length > 1 ? (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute left-3 top-1/2 size-9 -translate-y-1/2 rounded-full bg-background/85"
              onClick={() => move(-1)}
              aria-label="Previous offer"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute right-3 top-1/2 size-9 -translate-y-1/2 rounded-full bg-background/85"
              onClick={() => move(1)}
              aria-label="Next offer"
            >
              <ChevronRight className="size-4" />
            </Button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((offer, index) => (
                <button
                  key={offer.title}
                  type="button"
                  className={`h-2 rounded-full transition-all ${
                    index === active ? "w-7 bg-white" : "w-2 bg-white/55"
                  }`}
                  onClick={() => setActive(index)}
                  aria-label={`Show offer ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
