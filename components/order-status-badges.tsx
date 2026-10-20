import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";
import type { Orders } from "@/types-db";

const statusColors: Record<string, string> = {
  Processing: "bg-orange-50 text-orange-700",
  Delivering: "bg-yellow-50 text-yellow-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Canceled: "bg-red-50 text-red-700",
};

interface OrderStatusBadgesProps {
  order: Pick<Orders, "status" | "isPaid">;
  t: Dictionary;
  className?: string;
}

export default function OrderStatusBadges({ order, t, className }: OrderStatusBadgesProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span
        className={cn(
          "whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium",
          statusColors[order.status] ?? "bg-neutral-100 text-neutral-700"
        )}
      >
        {t.orders.statuses[order.status] ?? order.status}
      </span>
      <span
        className={cn(
          "whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium",
          order.isPaid ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        )}
      >
        {order.isPaid ? t.orders.paid : t.orders.unpaid}
      </span>
    </div>
  );
}
