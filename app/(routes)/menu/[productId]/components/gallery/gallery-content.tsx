"use client";

import Image from "next/image";

interface GalleryContentImageProps {
  url: string;
  alt: string;
  priority?: boolean;
}

export default function GalleryContentImage({ url, alt, priority = false }: GalleryContentImageProps) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream">
      <Image
        src={url}
        alt={alt}
        className="object-contain p-6 animate-in fade-in duration-300"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </div>
  );
}
