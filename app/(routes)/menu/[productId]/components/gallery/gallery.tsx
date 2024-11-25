"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GalleryContentImage from "./gallery-content";
import GalleryTab from "./gallery-tab";

interface GalleryProps {
  images: {
    url: string;
  }[];
}

export default function Gallery({ images }: GalleryProps) {
  return (
    <Tabs defaultValue={images[0].url} className="w-full">
      {images.map((tab) => (
        <TabsContent key={tab.url} value={tab.url.toString()}>
          <GalleryContentImage url={tab.url} />
        </TabsContent>
      ))}
      <TabsList className="bg-transparent w-full">
        {images.map((tab) => (
          <TabsTrigger key={tab.url} value={tab.url.toString()}>
            <GalleryTab url={tab.url} />
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
