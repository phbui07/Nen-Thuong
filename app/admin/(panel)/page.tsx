import AdminOrdersList from "@/components/admin/admin-orders-list";
import { formatPrice } from "@/components/convert";
import { requireAdminPage } from "@/lib/admin-guard";
import { countProducts } from "@/lib/db/catalog";
import { listOrders, orderStats } from "@/lib/db/orders";
import { getDictionary } from "@/lib/i18n/server";
import { ArrowRight, Clock, Info, Package, Receipt, Wallet } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  await requireAdminPage();
  const [t, stats, products, recent] = await Promise.all([
    getDictionary(),
    orderStats(),
    countProducts(),
    listOrders({ limit: 5 }),
  ]);
  const d = t.admin.dashboard;
  const cards = [
    { label: d.revenue, value: formatPrice(stats.revenue, t.locale), icon: Wallet },
    { label: d.orders, value: String(stats.orders), icon: Receipt },
    { label: d.open, value: String(stats.open), icon: Clock },
    { label: d.products, value: String(products.active), icon: Package },
  ];

  return (
    <div className="space-y-10">
      <dl className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="h-4 w-4 text-hero" />
              {label}
            </dt>
            <dd className="mt-2 whitespace-nowrap text-2xl font-bold text-neutral-900">{value}</dd>
          </div>
        ))}
      </dl>

      {products.total === 0 && (
        <section className="rounded-2xl bg-hero/5 p-6">
          <h2 className="text-lg font-semibold text-neutral-800">{d.startTitle}</h2>
          <ol className="mt-4 space-y-2">
            {d.startSteps.map((step, index) => (
              <li key={step.href}>
                <Link href={step.href} className="group flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm transition hover:shadow-md">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hero text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-neutral-700">{step.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-neutral-800">{d.recentOrders}</h2>
          {stats.orders > 0 && (
            <Link href="/admin/orders" className="text-sm font-semibold text-hero hover:underline">
              {d.viewAll}
            </Link>
          )}
        </div>
        {stats.unpaid > 0 && (
          <p className="flex items-center gap-2 text-sm text-orange-700">
            <Info className="h-4 w-4" />
            {d.unpaid}: {stats.unpaid}
          </p>
        )}
        <AdminOrdersList orders={recent} t={t} />
      </section>
    </div>
  );
}
