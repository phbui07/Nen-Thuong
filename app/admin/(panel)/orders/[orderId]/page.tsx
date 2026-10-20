import OrderUpdateForm from "@/components/admin/order-update-form";
import { formatPrice } from "@/components/convert";
import OrderStatusBadges from "@/components/order-status-badges";
import { requireAdminPage } from "@/lib/admin-guard";
import { getOrder } from "@/lib/db/orders";
import { getDictionary } from "@/lib/i18n/server";
import { ArrowLeft, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function AdminOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  await requireAdminPage();
  const { orderId } = await params;
  const [t, order] = await Promise.all([getDictionary(), getOrder(orderId)]);
  if (!order) notFound();
  const a = t.admin.orders;

  return (
    <div className="space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-hero">
        <ArrowLeft className="h-4 w-4" />
        {a.back}
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">{t.orders.detailTitle(order.code)}</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleString(t.locale)} · {t.checkout.methods[order.paymentMethod].title}
          </p>
        </div>
        <OrderStatusBadges order={order} t={t} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-8">
          <section className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-neutral-800">{a.items}</h3>
            <ul className="mt-4 divide-y divide-neutral-100">
              {order.items.map((item, index) => (
                <li key={`${index}-${item.name}`} className="flex items-center gap-3 py-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt="" fill sizes="48px" className="object-contain p-1" />
                    ) : (
                      <Flame className="absolute inset-0 m-auto h-5 w-5 text-hero/30" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-neutral-800">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.qty} × {formatPrice(item.price, t.locale)}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold">{formatPrice(item.price * item.qty, t.locale)}</p>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
              <span className="font-semibold text-neutral-800">{t.cart.total}</span>
              <span className="whitespace-nowrap text-xl font-bold text-neutral-900">{formatPrice(order.total, t.locale)}</span>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-100 bg-white p-5 text-sm shadow-sm">
            <h3 className="font-semibold text-neutral-800">{a.customer}</h3>
            <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: t.checkout.name, value: order.customerName },
                { label: t.checkout.phone, value: order.phone },
                { label: "Email", value: order.email || "—" },
                { label: t.checkout.address, value: order.address },
                ...(order.note ? [{ label: a.note, value: order.note }] : []),
              ].map((row) => (
                <div key={row.label} className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{row.label}</dt>
                  <dd className="whitespace-pre-line break-words font-medium text-neutral-800">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div className="lg:sticky lg:top-24 lg:col-span-4">
          <OrderUpdateForm orderId={order.id} status={order.status} isPaid={order.isPaid} />
        </div>
      </div>
    </div>
  );
}
