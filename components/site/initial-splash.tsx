"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export function InitialSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center bg-[#fffdf8] px-4" role="status" aria-label="Opening Voibee Holidays">
      <div className="flex flex-col items-center text-center">
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
        <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
          <Loader2 className="size-5 animate-spin" />
          Preparing your next journey
        </div>
      </div>
    </div>
  );
}
