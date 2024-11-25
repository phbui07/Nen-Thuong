"use client";

import { formatNumber } from "@/components/convert";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-carts";
import { cn } from "@/lib/utils";
import { Products } from "@/types-db";
import {
  CookingPot,
  ShoppingCart,
  Soup,
  SquareActivity,
  Utensils,
} from "lucide-react";
import { useState } from "react";

interface InfoProps {
  product: Products;
}

export default function Info({ product }: InfoProps) {
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const handleQty = (num: number) => {
    setQty(num);
    cart.updateItemQuantity(product.id, num);
  };

  const addToCart = (data: Products) => {
    cart.addItem({ ...data, qty: qty });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-neutral-800">{product.name}</h1>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-base text-left text-neutral-600">
          {product.description}
        </p>
      </div>
      <div className="w-full flex items-center justify-start gap-2 flex-wrap px-2 mt-8">
        {product.category && (
          <div className="rounded-md bg-emerald-500/10 px-3 py-2 textb-ase font-semibold capitalize flex items-center gap-2">
            <Soup className="h-5 w-5" />
            {product.category}
          </div>

        )}
        {product.origin && (
          <div className="rounded-md bg-emerald-500/10 px-3 py-2 textb-ase font-semibold capitalize flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            {product.origin}
          </div>
        )}
        {product.size && (
          <div className="rounded-md bg-emerald-500/10 px-3 py-2 textb-ase font-semibold capitalize flex items-center gap-2">
            <SquareActivity className="h-5 w-5" />
            {product.size}
          </div>
        )}
      </div>
      <div className="w-full grid grid-cols-4 my-12">
        <div className="col-span-1 space-y-8">
          <p className="text-lg font-semibold text-neutral-700">Price</p>
          <p className="text-lg font-semibold text-neutral-700">Serves</p>
        </div>
        <div className="col-span-3 space-y-8">
          <p className="text-xl font-semibold text-neutral-700">
          {formatNumber(product.price || 0)}đ
          </p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={cn(
                  "w-8 h-8 cursor-pointer rounded-full flex items-center justify-center border border-hero",
                  qty === num
                    ? "bg-hero shadow-md text-white"
                    : "bg-transparent shadow-none"
                )}
                onClick={() => handleQty(num)}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button
        onClick={() => addToCart(product)}
        className="w-full py-6 text-xl font-semibold hover:bg-hero hover:text-white flex items-center justify-center gap-3 "
      >
        Add to cart <ShoppingCart className="w-4 h-4" />
      </Button>
    </div>
  );
}
