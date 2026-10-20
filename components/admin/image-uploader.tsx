"use client";

import { useLanguage } from "@/providers/language-provider";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

// Phone photos are often 3-8 MB; shrinking them keeps uploads fast and under
// Vercel's request limit. PNGs stay PNG so transparent backgrounds survive.
async function resizeImage(file: File): Promise<Blob> {
  const keepPng = file.type === "image/png";
  const maxSize = keepPng ? 1200 : 1600;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available");
  if (!keepPng) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, keepPng ? "image/png" : "image/jpeg", 0.85)
  );
  if (!blob) throw new Error("Could not encode the image");
  return blob;
}

async function uploadImage(file: File): Promise<string> {
  const blob = await resizeImage(file);
  const body = new FormData();
  body.append("file", new File([blob], file.name.replace(/\.\w+$/, "") + (blob.type === "image/png" ? ".png" : ".jpg"), { type: blob.type }));
  const res = await fetch("/api/admin/images", { method: "POST", body });
  if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
  const { url } = (await res.json()) as { url: string };
  return url;
}

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function ImageUploader({ images, onChange, onUploadingChange }: ImageUploaderProps) {
  const { t } = useLanguage();
  const p = t.admin.products;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  // Uploads finish in any order, so always append to the latest list
  const latest = useRef(images);
  latest.current = images;

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = [...files].filter((file) => file.type.startsWith("image/"));
    setUploading((count) => count + list.length);
    onUploadingChange?.(true);
    await Promise.all(
      list.map(async (file) => {
        try {
          const url = await uploadImage(file);
          latest.current = [...latest.current, url];
          onChange(latest.current);
        } catch (error) {
          console.error(error);
          toast.error(p.uploadFailed);
        } finally {
          setUploading((count) => count - 1);
        }
      })
    );
    onUploadingChange?.(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const move = (index: number, delta: number) => {
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {images.map((url, index) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-cream">
            <Image src={url} alt="" fill sizes="160px" className="object-contain p-1.5" />
            {index === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-full bg-hero px-2 py-0.5 text-[10px] font-semibold text-white">1</span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((image) => image !== url))}
              aria-label={p.removeImage}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={p.moveLeft}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm disabled:invisible"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === images.length - 1}
                aria-label={p.moveRight}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm disabled:invisible"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading > 0}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-neutral-300 text-center text-xs font-medium text-neutral-500 transition hover:border-hero hover:text-hero disabled:opacity-60"
        >
          {uploading > 0 ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
          <span className="px-2">{uploading > 0 ? p.uploading : p.upload}</span>
        </button>
      </div>
      <p className="text-xs text-muted-foreground">{p.imagesHint}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(event) => addFiles(event.target.files)}
      />
    </div>
  );
}
