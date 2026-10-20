"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/providers/language-provider";
import { Flame } from "lucide-react";
import GalleryContentImage from "./gallery-content";
import GalleryTab from "./gallery-tab";

interface GalleryProps {
  images: {
    url: string;
  }[];
  name: string;
}

export default function Gallery({ images, name }: GalleryProps) {
  const { t } = useLanguage();

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-cream">
        <Flame className="h-12 w-12 text-hero/30" />
      </div>
    );
  }

  // Tabs are keyed by position so repeated image URLs can't collide
  return (
    <Tabs defaultValue="0" className="w-full">
      {images.map((image, index) => (
        <TabsContent key={`${index}-${image.url}`} value={String(index)} className="mt-0">
          <GalleryContentImage url={image.url} alt={t.product.imageAlt(name, index + 1)} priority={index === 0} />
        </TabsContent>
      ))}
      {images.length > 1 && (
        <TabsList className="mt-3 h-auto w-full justify-start gap-3 overflow-x-auto bg-transparent p-1.5">
          {images.map((image, index) => (
            <TabsTrigger
              key={`${index}-${image.url}`}
              value={String(index)}
              aria-label={t.product.viewImage(index + 1)}
              className="rounded-xl p-0 opacity-70 ring-2 ring-transparent ring-offset-2 transition data-[state=active]:opacity-100 data-[state=active]:shadow-none data-[state=active]:ring-hero hover:opacity-100"
            >
              <GalleryTab url={image.url} />
            </TabsTrigger>
          ))}
        </TabsList>
      )}
    </Tabs>
  );
}
