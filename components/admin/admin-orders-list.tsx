import { formatPrice } from "@/components/convert";
import OrderStatusBadges from "@/components/order-status-badges";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Orders } from "@/types-db";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface AdminOrdersListProps {
  orders: Orders[];
  t: Dictionary;
}

export default function AdminOrdersList({ orders, t }: AdminOrdersListProps) {
  if (orders.length === 0) {
    return <p className="rounded-2xl bg-cream p-6 text-center text-sm text-muted-foreground">{t.admin.orders.empty}</p>;
  }
  const columns = t.admin.orders.columns;

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm">
      {/* Column headings; rows stack into cards below lg */}
      <div className="hidden grid-cols-12 gap-4 border-b border-neutral-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid">
        <span className="col-span-2">{columns.code}</span>
        <span className="col-span-3">{columns.customer}</span>
        <span className="col-span-2 text-right">{columns.total}</span>
        <span className="col-span-2">{columns.payment}</span>
        <span className="col-span-3">{columns.status}</span>
      </div>
      <ul className="divide-y divide-neutral-100">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/admin/orders/${order.id}`}
              className="group grid grid-cols-1 gap-2 px-5 py-4 transition-colors hover:bg-cream/60 lg:grid-cols-12 lg:items-center lg:gap-4"
            >
              <div className="lg:col-span-2">
                <p className="font-semibold text-neutral-800">{order.code}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString(t.locale)}</p>
              </div>
              <div className="min-w-0 lg:col-span-3">
                <p className="truncate font-medium text-neutral-800">{order.customerName}</p>
                <p className="truncate text-xs text-muted-foreground">{order.phone}</p>
              </div>
              <p className="font-semibold text-neutral-900 lg:col-span-2 lg:text-right">{formatPrice(order.total, t.locale)}</p>
              <p className="text-sm text-neutral-600 lg:col-span-2">{t.checkout.methods[order.paymentMethod].title}</p>
              <div className="flex items-center justify-between gap-2 lg:col-span-3">
                <OrderStatusBadges order={order} t={t} />
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
