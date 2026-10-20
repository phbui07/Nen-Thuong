"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { Orders } from "@/types-db";
import { Flame } from "lucide-react";
import Image from "next/image";

interface OrderItemProps {
  order: Orders;
}

const statusColors: Record<string, string> = {
  Delivering: "bg-yellow-50 text-yellow-700",
  Processing: "bg-orange-50 text-orange-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Canceled: "bg-red-50 text-red-700",
};

export default function OrderItem({ order }: OrderItemProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
      <div className="flex shrink-0 -space-x-3">
        {order.orderItems.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-white bg-cream"
          >
            {item.images?.[0]?.url ? (
              <Image src={item.images[0].url} alt={item.name} fill sizes="64px" className="object-contain p-1" />
            ) : (
              <Flame className="absolute inset-0 m-auto h-6 w-6 text-hero/30" />
            )}
          </div>
        ))}
      </div>

      <p className="min-w-0 flex-1 font-semibold text-neutral-700">
        {order.orderItems.map((item) => item.name).join(", ")}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            statusColors[order.order_status] ?? "bg-neutral-100 text-neutral-700"
          )}
        >
          {t.orders.statuses[order.order_status] ?? order.order_status}
        </span>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            order.isPaid ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          )}
        >
          {order.isPaid ? t.orders.paid : t.orders.unpaid}
        </span>
      </div>
    </div>
  );
}
