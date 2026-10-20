"use client";

import { Products } from "@/types-db";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Flame, Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import useCart from "@/hooks/use-carts";
import useMounted from "@/hooks/use-mounted";
import useWishlist from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { formatPrice } from "./convert";

interface PopularContentProps {
  data: Products;
  // For cards in the first row, whose photo is what the page shows first
  priority?: boolean;
}

export default function PopularContent({ data, priority = false }: PopularContentProps) {
  const { t } = useLanguage();
  const mounted = useMounted();
  const addItem = useCart((state) => state.addItem);
  const liked = useWishlist((state) => state.ids.includes(data.id));
  const toggleLike = useWishlist((state) => state.toggle);
  // Favorites live in localStorage, so only show them once mounted
  const isLiked = mounted && liked;

  const href = `/menu/${data.id}`;
  const image = data.images?.[0]?.url;
  const tags = [data.category, data.size].filter(Boolean);

  const addToCart = () => {
    addItem({ ...data, qty: 1 });
    toast.success(t.cart.added(data.name));
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-cream">
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-contain p-4 transition duration-500 group-hover:scale-105"
          />
        ) : (
          <Flame className="absolute inset-0 m-auto h-10 w-10 text-hero/30" />
        )}
      </div>

      <button
        type="button"
        onClick={() => toggleLike(data.id)}
        aria-pressed={isLiked}
        aria-label={isLiked ? t.products.unlike(data.name) : t.products.like(data.name)}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero"
      >
        <Heart className={cn("h-4 w-4 transition-colors", isLiked ? "fill-red-500 text-red-500" : "text-neutral-600")} />
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-hero/5 px-2.5 py-0.5 text-xs font-medium capitalize text-hero">
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="line-clamp-1 text-base font-semibold text-neutral-800 transition-colors group-hover:text-hero">
          {/* Stretched link: the whole card opens the product */}
          <Link href={href} className="after:absolute after:inset-0 after:content-['']">
            {data.name}
          </Link>
        </h3>
        {data.description && <p className="line-clamp-2 text-sm text-muted-foreground">{data.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-base font-bold text-neutral-900 sm:text-lg">{formatPrice(data.price, t.locale)}</span>
          <Button
            size="sm"
            onClick={addToCart}
            aria-label={t.products.addLabel(data.name)}
            className="relative z-10 rounded-full bg-hero px-3 hover:bg-hero/90"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-1.5 hidden sm:inline">{t.products.add}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
