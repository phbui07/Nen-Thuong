"use client";

import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";
import { Orders } from "@/types-db";
import { Package } from "lucide-react";
import Link from "next/link";
import OrderItem from "./order-item";

interface PageContentProps {
  orders: Orders[];
}

export default function PageContent({ orders }: PageContentProps) {
  const { t } = useLanguage();

  if (orders.length == 0) {
    return (
      <EmptyState
        className="mt-6"
        icon={Package}
        title={t.orders.emptyTitle}
        description={t.orders.emptyText}
        action={
          <Button asChild className="rounded-full bg-hero hover:bg-hero/90">
            <Link href="/menu">{t.orders.browse}</Link>
          </Button>
        }
      />
    );
  }
  return (
    <ul className="mt-6 space-y-4">
      {orders.map((order) => (
        <li key={order.id}>
          <OrderItem order={order} />
        </li>
      ))}
    </ul>
  );
}
