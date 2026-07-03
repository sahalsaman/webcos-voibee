"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const FALLBACK =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=75";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const pics = images.length > 0 ? images : [FALLBACK];
  const [active, setActive] = useState(0);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
        <Image
          src={pics[active]}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
      </div>
      {pics.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {pics.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition",
                i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
