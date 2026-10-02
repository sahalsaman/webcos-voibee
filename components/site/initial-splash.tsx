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
          src="/voibee-global-travel-experts.png"
          alt="Voibee Global Travel Experts"
          width={280}
          height={135}
          priority
          className="h-auto w-56 sm:w-64"
        />
        <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary">
          <Loader2 className="size-5 animate-spin" />
          Preparing your next journey
        </div>
      </div>
    </div>
  );
}
