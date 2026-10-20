import AdminOrdersList from "@/components/admin/admin-orders-list";
import { requireAdminPage } from "@/lib/admin-guard";
import { listOrders } from "@/lib/db/orders";
import { getDictionary } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES, type OrderStatus } from "@/types-db";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdminPage();
  const { status: rawStatus } = await searchParams;
  const status = ORDER_STATUSES.find((value) => value === rawStatus) as OrderStatus | undefined;
  const [t, orders] = await Promise.all([getDictionary(), listOrders({ status })]);
  const filters = [
    { label: t.admin.orders.all, href: "/admin/orders", active: !status },
    ...ORDER_STATUSES.map((value) => ({
      label: t.orders.statuses[value],
      href: `/admin/orders?status=${value}`,
      active: status === value,
    })),
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-neutral-800">{t.admin.orders.title}</h2>
      <nav aria-label={t.admin.orders.title} className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <ul className="flex w-max gap-2">
          {filters.map((filter) => (
            <li key={filter.href}>
              <Link
                href={filter.href}
                aria-current={filter.active ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  filter.active ? "border-hero bg-hero text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-hero hover:text-hero"
                )}
              >
                {filter.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <AdminOrdersList orders={orders} t={t} />
    </div>
  );
}
