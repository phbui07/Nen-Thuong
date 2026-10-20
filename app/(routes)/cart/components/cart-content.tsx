"use client";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-carts";
import { Eraser } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CartItem from "./cart-item";
import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { formatNumber } from "@/components/convert";

interface CartContentProps {
  userId: string | null;
}

const url = `${process.env.NEXT_PUBLIC_API_URL}/checkout`;

export default function CartContent({ userId }: CartContentProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const cart = useCart();
  const { removeAll } = cart;
  const searchParams = useSearchParams();
  const totalPrice = cart.items.reduce((total, item) => {
    return total + Number(item.price * item.qty);
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
      toast.error("Checkout failed, please try again later");
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment Completed");
      removeAll();
    }
    if (searchParams.get("cancel")) {
      toast.error("Something went wrong try again later");
    }
  }, [searchParams, removeAll]);

  // The cart is persisted in localStorage, so render it only on the client
  // to avoid a hydration mismatch with the server-rendered (empty) cart.
  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="w-full flex items-center justify-between gap-4">
        <h2 className="text-3xl font-semibold text-neutral-700">Cart Items</h2>
        <Button onClick={cart.removeAll} variant={"destructive"}>
          Clear <Eraser className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div className="w-full lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8">
        <div className="col-span-8">
          {cart.items.length === 0 && (
            <div className="w-full items-center flex justify-center">
              <p className="text-3xl text-neutral-600 font-semibold">
                No items added to cart
              </p>
            </div>
          )}
          <div className="w-full space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="col-span-4 space-y-8">
          <Box className="flex-col items-start justify-start gap-2 shadow-lg rounded-lg space-y-2 p-3 bg-slate-50">
            <h2 className="text-lg text-neutral-700 font-semibold">
              Order Summary
            </h2>
            <Separator />
            <Box className="flex-col space-y-2">
              <div className="flex items-center justify-between w-full px-4 whitespace-nowrap text-muted-foreground">
                <p className="text-black font-bold text-base">Total</p>
                <p className="text-2xl font-semibold text-black">
                {formatNumber(totalPrice || 0)}đ
                </p>
              </div>
            </Box>
          </Box>
          <Box className="flex-col items-start justify-start gap-2 shadow-lg rounded-lg p-3 space-y-2 bg-slate-50">
            <h2 className="text-lg text-neutral-700 font-semibold">
              Payment
            </h2>
            <Separator />
            <Button
              className="w-full"
              onClick={onCheckOut}
              disabled={loading || cart.items.length === 0}
            >
              Checkout
            </Button>
          </Box>
        </div>
      </div>
    </>
  );
}
