"use client";

import Image from "next/image";

interface GalleryTabProps {
  url: string;
}

export default function GalleryTab({ url }: GalleryTabProps) {
  return (
    <div className="w-24 h-24 aspect-square rounded-md overflow-hidden relative">
      <Image
        src={url}
        alt={url}
        className="w-full h-full object-contain"
        fill
      />
    </div>
  );
}
