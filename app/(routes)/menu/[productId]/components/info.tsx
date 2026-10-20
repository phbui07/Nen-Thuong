"use client";

import { formatPrice } from "@/components/convert";
import QuantityPicker from "@/components/quantity-picker";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-carts";
import { useLanguage } from "@/providers/language-provider";
import { Products } from "@/types-db";
import { HandHeart, MapPin, Ruler, ShoppingCart, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface InfoProps {
  product: Products;
}

export default function Info({ product }: InfoProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const addItem = useCart((state) => state.addItem);

  const details = [
    { icon: Tag, label: t.product.category, value: product.category },
    { icon: Ruler, label: t.product.size, value: product.size },
    { icon: MapPin, label: t.product.origin, value: product.origin },
  ].filter((detail) => detail.value);

  const addToCart = () => {
    addItem({ ...product, qty });
    toast.success(t.cart.added(product.name));
  };

  const buyNow = () => {
    addItem({ ...product, qty });
    router.push("/cart");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-neutral-800 md:text-4xl">{product.name}</h1>
        <p className="text-2xl font-semibold text-hero">{formatPrice(product.price, t.locale)}</p>
      </div>
      {product.description && <p className="text-base leading-relaxed text-neutral-600">{product.description}</p>}

      {details.length > 0 && (
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl bg-cream px-4 py-3">
              <Icon className="h-5 w-5 shrink-0 text-hero" />
              <div className="min-w-0">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="truncate font-semibold capitalize text-neutral-800">{value}</dd>
              </div>
            </div>
          ))}
        </dl>
      )}

      <div className="flex items-center gap-4">
        <span className="font-medium text-neutral-700">{t.product.quantity}</span>
        <QuantityPicker value={qty} onChange={setQty} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" onClick={addToCart} className="flex-1 rounded-full bg-hero text-base hover:bg-hero/90">
          <ShoppingCart className="mr-2 h-4 w-4" />
          {t.product.addToCart}
        </Button>
        <Button size="lg" variant={"outline"} onClick={buyNow} className="flex-1 rounded-full text-base">
          {t.product.buyNow}
        </Button>
      </div>

      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <HandHeart className="mt-0.5 h-4 w-4 shrink-0 text-hero" />
        {t.product.donationNote}
      </p>
    </div>
  );
}
