"use client";

import useCart from "@/hooks/use-carts";
import useMounted from "@/hooks/use-mounted";
import { useLanguage } from "@/providers/language-provider";
import Link from "next/link";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";

export default function CartActionButton() {
  const mounted = useMounted();
  const { t } = useLanguage();
  const itemCount = useCart((state) => state.items.reduce((total, item) => total + (item.qty ?? 1), 0));
  // The cart lives in localStorage, so show 0 until it's loaded on the client
  const count = mounted ? itemCount : 0;

  return (
    <Button asChild className="h-9 rounded-full px-3">
      <Link href="/cart" aria-label={t.nav.cart(count)}>
        <ShoppingBag className="h-4 w-4 text-white" />
        <span className="ml-1.5 min-w-[1ch] text-sm font-medium tabular-nums text-white">{count}</span>
      </Link>
    </Button>
  );
}
