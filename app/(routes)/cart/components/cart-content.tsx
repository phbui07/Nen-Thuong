"use client";

import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-carts";
import useMounted from "@/hooks/use-mounted";
import { useLanguage } from "@/providers/language-provider";
import { Eraser, HandHeart, Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CartItem from "./cart-item";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { formatPrice } from "@/components/convert";

interface CartContentProps {
  userId: string | null;
}

const url = `${process.env.NEXT_PUBLIC_API_URL}/checkout`;

export default function CartContent({ userId }: CartContentProps) {
  const { t } = useLanguage();
  const mounted = useMounted();
  const [loading, setLoading] = useState(false);
  const cart = useCart();
  const { removeAll } = cart;
  const searchParams = useSearchParams();
  const itemCount = cart.items.reduce((total, item) => total + (item.qty ?? 1), 0);
  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price * (item.qty ?? 1));
  }, 0);

  const onCheckOut = async () => {
    try {
      setLoading(true);
      const response = await axios.post(url, {
        products: cart.items,
        userId,
      });

      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
      toast.error(t.cart.checkoutFailed);
      setLoading(false);
    }
  };

  const clearCart = () => {
    removeAll();
    toast.success(t.cart.cleared);
  };

  // Messages are keyed by id so React's double effects in development show them once
  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success(t.cart.paymentSuccess, { id: "payment-success" });
      removeAll();
    }
    if (searchParams.get("cancel")) {
      toast.error(t.cart.paymentCancelled, { id: "payment-cancel" });
    }
  }, [searchParams, removeAll, t]);

  // The cart is persisted in localStorage, so render it only on the client
  // to avoid a hydration mismatch with the server-rendered (empty) cart.
  if (!mounted) {
    return <div className="mt-6 h-64 animate-pulse rounded-2xl bg-cream" aria-hidden />;
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-neutral-800">{t.cart.title}</h1>
        {cart.items.length > 0 && (
          <Button onClick={clearCart} variant={"ghost"} className="text-muted-foreground hover:text-red-600">
            <Eraser className="mr-2 h-4 w-4" />
            {t.cart.clear}
          </Button>
        )}
      </div>

      {cart.items.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={ShoppingBag}
          title={t.cart.emptyTitle}
          description={t.cart.emptyText}
          action={
            <Button asChild className="rounded-full bg-hero hover:bg-hero/90">
              <Link href="/menu">{t.cart.browse}</Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <ul className="space-y-4 lg:col-span-8">
            {cart.items.map((item) => (
              <li key={item.id}>
                <CartItem item={item} />
              </li>
            ))}
          </ul>
          <aside className="space-y-4 rounded-2xl bg-cream p-6 lg:sticky lg:top-24 lg:col-span-4">
            <h2 className="text-lg font-semibold text-neutral-800">{t.cart.summary}</h2>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{t.cart.subtotal(itemCount)}</span>
              <span>{formatPrice(totalPrice, t.locale)}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-800">{t.cart.total}</span>
              <span className="text-2xl font-bold text-neutral-900">{formatPrice(totalPrice, t.locale)}</span>
            </div>
            <Button
              size="lg"
              className="w-full rounded-full bg-hero text-base hover:bg-hero/90"
              onClick={onCheckOut}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.cart.checkout}
            </Button>
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <HandHeart className="h-4 w-4 shrink-0 text-hero" />
              {t.product.donationNote}
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
