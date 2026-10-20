"use client";

import { formatPrice } from "@/components/convert";
import QuantityPicker from "@/components/quantity-picker";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-carts";
import { useLanguage } from "@/providers/language-provider";
import { Products } from "@/types-db";
import { Flame, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface CartItemProps {
  item: Products;
}

export default function CartItem({ item }: CartItemProps) {
  const { t } = useLanguage();
  const updateItemQuantity = useCart((state) => state.updateItemQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const qty = item.qty ?? 1;
  const image = item.images?.[0]?.url;
  const href = `/menu/${item.id}`;

  const remove = () => {
    removeItem(item.id);
    toast.success(t.cart.removed(item.name));
  };

  return (
    <div className="flex gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
      <Link href={href} tabIndex={-1} aria-hidden className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
        {image ? (
          <Image alt="" src={image} className="object-contain p-2" fill sizes="96px" />
        ) : (
          <Flame className="absolute inset-0 m-auto h-8 w-8 text-hero/30" />
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-semibold text-neutral-800 md:text-lg">
              <Link href={href} className="transition-colors hover:text-hero">
                {item.name}
              </Link>
            </h3>
            <p className="text-sm text-muted-foreground">
              {[item.category, item.size].filter(Boolean).join(" · ")}
            </p>
          </div>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={remove}
            aria-label={t.cart.remove(item.name)}
            className="h-9 w-9 shrink-0 text-muted-foreground hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <QuantityPicker value={qty} onChange={(value) => updateItemQuantity(item.id, value)} />
          <p className="font-semibold text-neutral-900">{formatPrice(item.price * qty, t.locale)}</p>
        </div>
      </div>
    </div>
  );
}
