"use client";

import useCart from "@/hooks/use-carts";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ShoppingBag } from "lucide-react";

export default function CartActionButton() {
  const [mounted, setMounted] = useState(false);

  const cart = useCart();

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="ml-4 flex items-center justify-center gap-x-4">
      <Button className="rounded-full" onClick={() => router.push("/cart")}>
        <ShoppingBag className="w-4 h-4 text-white" />
        <span className="text-sm font-medium text-white ml-2">
          {cart.items.length}
        </span>
      </Button>
    </div>
  );
}
