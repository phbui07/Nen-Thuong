"use client";

import Image from "next/image";

interface GalleryContentImageProps {
  url: string;
}

export default function GalleryContentImage({ url }: GalleryContentImageProps) {
  return (
    <div className="w-full h-full aspect-square sm:rounded-lg overflow-hidden relative">
      <Image
        src={url}
        alt={url}
        className="w-full h-full object-contain"
        fill
      />
    </div>
  );
}
