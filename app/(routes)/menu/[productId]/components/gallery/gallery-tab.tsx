"use client";

import Image from "next/image";

interface GalleryTabProps {
  url: string;
}

// Decorative thumbnail; the tab trigger carries the accessible label
export default function GalleryTab({ url }: GalleryTabProps) {
  return (
    <div className="relative aspect-square h-20 w-20 overflow-hidden rounded-xl bg-cream md:h-24 md:w-24">
      {/* Lower quality also gives thumbnails their own URL, so Next.js doesn't mistake
          them for the (priority) main photo when checking what loads first */}
      <Image src={url} alt="" className="object-contain p-1.5" fill sizes="96px" quality={60} />
    </div>
  );
}
