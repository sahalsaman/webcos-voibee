"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const splashWords = ["ESCAPE", "EXPLORE", "BELONG"];

export function InitialSplash() {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const onLoad = () => setPageReady(true);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    if (step >= splashWords.length) return;
    const timer = window.setTimeout(() => setStep((current) => current + 1), 520);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (step !== splashWords.length || !pageReady) return;
    const timer = window.setTimeout(() => setVisible(false), 480);
    return () => window.clearTimeout(timer);
  }, [pageReady, step]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center bg-[#fffdf8] px-4" role="status" aria-label="Opening Voibee Holidays">
      <div className="flex w-full flex-col items-center text-center">
        {step < splashWords.length ? <p key={splashWords[step]} className="splash-word-reveal text-4xl font-extrabold tracking-[0.22em] text-primary sm:text-5xl">{splashWords[step]}</p> : <Image
          src="/voibee-logo-with-tahline.png"
          alt="Voibee Global Travel Experts"
          width={360}
          height={155}
          priority
          unoptimized
          sizes="(max-width: 639px) 78vw, 320px"
          className={`h-auto w-[min(78vw,20rem)] ${pageReady ? "" : "splash-logo-breathe motion-reduce:animate-none"}`}
        />}
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
