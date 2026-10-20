"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export interface GalleryPhoto {
  src: StaticImageData;
  alt: string;
  caption: string;
  // Grid placement, e.g. "md:col-span-2"
  className?: string;
  // Crop position, e.g. "object-[center_25%]"
  imageClassName?: string;
}

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  className?: string;
}

export default function PhotoGallery({ photos, className }: PhotoGalleryProps) {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastOpened = useRef<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((index) => (index === null ? index : (index + delta + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (openIndex === null) {
      // Return focus to the photo that opened the viewer
      if (lastOpened.current !== null) triggerRefs.current[lastOpened.current]?.focus();
      return;
    }
    closeRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openIndex, close, step]);

  const open = (index: number) => {
    lastOpened.current = index;
    setOpenIndex(index);
  };

  const current = openIndex === null ? null : photos[openIndex];

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-3 md:gap-4", className)}>
        {photos.map((photo, index) => (
          <button
            key={photo.caption}
            ref={(element) => {
              triggerRefs.current[index] = element;
            }}
            type="button"
            onClick={() => open(index)}
            aria-label={t.gallery.open(photo.caption)}
            className={cn(
              "group relative aspect-[4/3] overflow-hidden rounded-2xl bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero focus-visible:ring-offset-2 md:aspect-auto",
              photo.className
            )}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 768px) 33vw, 50vw"
              className={cn("object-cover transition duration-500 group-hover:scale-105", photo.imageClassName)}
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-left text-sm font-medium text-white opacity-100 transition md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
              {photo.caption}
            </span>
          </button>
        ))}
      </div>

      {current && openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          className="fixed inset-0 z-[60] flex flex-col bg-black/90 animate-in fade-in duration-200"
          onClick={close}
        >
          <div className="flex items-center justify-between p-4 text-sm text-white/80">
            <span className="tabular-nums">
              {openIndex + 1} / {photos.length}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label={t.gallery.close}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex-1" onClick={(event) => event.stopPropagation()}>
            <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={t.gallery.previous}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t.gallery.next}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
          <p className="p-4 text-center text-sm text-white/90">{current.caption}</p>
        </div>
      )}
    </>
  );
}
