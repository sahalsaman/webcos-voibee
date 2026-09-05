"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { cn } from "@/lib/utils";

const FALLBACK =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=75";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const pics = images.length > 0 ? images : [FALLBACK];
  const visible = pics.slice(0, 4);
  const hiddenCount = Math.max(0, pics.length - visible.length);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (viewerIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setViewerIndex(null);
      if (event.key === "ArrowLeft") setViewerIndex((current) => current === null ? null : (current - 1 + pics.length) % pics.length);
      if (event.key === "ArrowRight") setViewerIndex((current) => current === null ? null : (current + 1) % pics.length);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [viewerIndex, pics.length]);

  return (
    <>
      <div
        className={cn(
          "overflow-hidden rounded-2xl sm:rounded-3xl",
          visible.length === 1
            ? "relative h-[260px] sm:h-[360px] lg:h-[390px]"
            : "grid gap-3 sm:grid-cols-[1.4fr_1fr] sm:grid-rows-2",
        )}
      >
        <button
          type="button"
          onClick={() => setViewerIndex(0)}
          className={cn(
            "group relative w-full overflow-hidden text-left",
            visible.length === 1
              ? "absolute inset-0"
              : "aspect-[16/10] sm:row-span-2 sm:aspect-auto sm:min-h-[380px]",
          )}
          aria-label={`View ${title} image 1`}
        >
          <Image
            src={visible[0]}
            alt={title}
            fill
            priority
            loading="eager"
            sizes={visible.length === 1 ? "100vw" : "(max-width: 640px) 100vw, 58vw"}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </button>

        {visible.length > 1 ? (
          <div
            className={cn(
              "hidden min-h-0 gap-3 sm:row-span-2 sm:grid",
              visible.length === 2 && "sm:grid-cols-1 sm:grid-rows-1",
              visible.length === 3 && "sm:grid-cols-1 sm:grid-rows-2",
              visible.length >= 4 && "sm:grid-cols-2 sm:grid-rows-2",
            )}
          >
            {visible.slice(1).map((src, index) => {
              const imageIndex = index + 1;
              const isOverflowTile = imageIndex === visible.length - 1 && hiddenCount > 0;
              return (
                <button
                  key={`${src}-${imageIndex}`}
                  type="button"
                  onClick={() => setViewerIndex(imageIndex)}
                  className={cn(
                    "group relative min-h-0 overflow-hidden",
                    visible.length >= 4 && index === 0 && "col-span-2",
                  )}
                  aria-label={isOverflowTile ? `View ${hiddenCount} more images` : `View ${title} image ${imageIndex + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${title} gallery image ${imageIndex + 1}`}
                    fill
                    sizes="(max-width: 1024px) 42vw, 22vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {isOverflowTile ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-950/55 text-lg font-extrabold text-white backdrop-blur-[1px]">
                      <span className="flex items-center gap-2 rounded-full border border-white/40 bg-slate-950/35 px-5 py-3 shadow-lg">
                        <Images className="size-5" />+{hiddenCount} images
                      </span>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}

        {pics.length > 1 ? (
          <div className="col-span-full flex gap-2 overflow-x-auto sm:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {pics.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setViewerIndex(index)}
                className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl"
                aria-label={`View ${title} image ${index + 1}`}
              >
                <Image src={src} alt="" fill sizes="112px" className="object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {viewerIndex !== null ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image gallery`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setViewerIndex(null);
          }}
        >
          <button
            type="button"
            onClick={() => setViewerIndex(null)}
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-7 sm:top-7"
            aria-label="Close image gallery"
          >
            <X className="size-6" />
          </button>

          <div className="relative h-[78vh] w-full max-w-6xl">
            <Image
              src={pics[viewerIndex]}
              alt={`${title} image ${viewerIndex + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {pics.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => setViewerIndex((viewerIndex - 1 + pics.length) % pics.length)}
                className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition hover:scale-105 sm:left-8 sm:size-14"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => setViewerIndex((viewerIndex + 1) % pics.length)}
                className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition hover:scale-105 sm:right-8 sm:size-14"
                aria-label="Next image"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-white">
            {viewerIndex + 1} / {pics.length}
          </div>
        </div>
      ) : null}
    </>
  );
}
