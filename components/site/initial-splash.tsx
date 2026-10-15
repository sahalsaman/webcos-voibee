"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const travelMoments = [
  "/theme-honeymoon.webp",
  "/theme-family.webp",
  "/theme-group.webp",
  "/theme-wellness.webp",
  "/theme-spiritual.webp",
  "/theme-festival.webp",
];

function DestinationMarquee() {
  const moments = [...travelMoments, ...travelMoments];

  return (
    <div className="relative mt-7 w-screen max-w-[38rem] overflow-hidden" aria-hidden="true">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#fffdf8] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#fffdf8] to-transparent" />
      <div className="splash-destination-marquee flex w-max gap-3 pr-3 motion-reduce:animate-none">
        {moments.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative h-18 w-26 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-secondary shadow-md shadow-primary/10"
          >
            <Image src={image} alt="" fill sizes="104px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function InitialSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center bg-[#fffdf8] px-4" role="status" aria-label="Opening Voibee Holidays">
      <div className="flex w-full flex-col items-center text-center">
        <Image
          src="/voibee-logo-with-tahline.png"
          alt="Voibee Global Travel Experts"
          width={360}
          height={155}
          priority
          unoptimized
          sizes="(max-width: 639px) 78vw, 320px"
          className="h-auto w-[min(78vw,20rem)]"
        />
        <DestinationMarquee />
        {/* <div className="mt-4 flex flex-col items-center gap-2" aria-live="polite">
          <p className="text-sm font-bold text-primary">Loading your travel inspiration</p>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="splash-loading-dot size-1.5 rounded-full bg-accent" />
            <span className="splash-loading-dot size-1.5 rounded-full bg-accent [animation-delay:150ms]" />
            <span className="splash-loading-dot size-1.5 rounded-full bg-accent [animation-delay:300ms]" />
          </div>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-primary/10" aria-hidden="true">
            <div className="splash-loading-line h-full rounded-full bg-brand-gradient motion-reduce:animate-none" />
          </div>
        </div> */}
      </div>
    </div>
  );
}
