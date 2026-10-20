"use client";

import { formatPrice } from "@/components/convert";
import OrderStatusBadges from "@/components/order-status-badges";
import { useLanguage } from "@/providers/language-provider";
import { Orders } from "@/types-db";
import { ChevronRight, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderItemProps {
  order: Orders;
}

export default function OrderItem({ order }: OrderItemProps) {
  const { t } = useLanguage();
  const placedOn = new Date(order.createdAt).toLocaleDateString(t.locale);
  const itemCount = order.items.reduce((total, item) => total + item.qty, 0);

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm transition hover:border-hero/30 hover:shadow-md md:flex-row md:items-center"
    >
      <div className="flex shrink-0 -space-x-3">
        {order.items.slice(0, 4).map((item, index) => (
          <div
            key={`${index}-${item.name}`}
            className="relative h-16 w-16 overflow-hidden rounded-xl border-2 border-white bg-cream"
          >
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt="" fill sizes="64px" className="object-contain p-1" />
            ) : (
              <Flame className="absolute inset-0 m-auto h-6 w-6 text-hero/30" />
            )}
          </div>
        ))}
      </div>

      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 font-semibold text-neutral-800">
          {order.code}
          <span className="whitespace-nowrap text-sm font-normal text-muted-foreground">{t.orders.placedOn(placedOn)}</span>
        </p>
        <p className="mt-1 line-clamp-1 text-sm text-neutral-600">{order.items.map((item) => item.name).join(", ")}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.orders.items(itemCount)} · <span className="font-semibold text-neutral-800">{formatPrice(order.total, t.locale)}</span>
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 md:justify-end">
        <OrderStatusBadges order={order} t={t} />
        <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
