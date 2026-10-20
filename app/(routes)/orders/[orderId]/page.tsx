import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import { formatPrice } from "@/components/convert";
import EmptyState from "@/components/empty-state";
import OrderStatusBadges from "@/components/order-status-badges";
import { Button } from "@/components/ui/button";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getOrder, markPaidByStripeSession } from "@/lib/db/orders";
import { readSafely } from "@/lib/db/safe";
import { getStoreSettings } from "@/lib/db/settings";
import { getDictionary } from "@/lib/i18n/server";
import { getStripe, isStripeConfigured, vietQrImageUrl } from "@/lib/payments";
import { CircleCheck, Flame, Info, Package } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CopyButton from "./components/copy-button";
import PayByCardButton from "./components/pay-by-card-button";

export const revalidate = 0;

interface OrderPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ placed?: string; cancelled?: string; session_id?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.meta.order };
}

export default async function OrderPage({ params, searchParams }: OrderPageProps) {
  const [{ orderId }, query, t, user, admin] = await Promise.all([
    params,
    searchParams,
    getDictionary(),
    getCurrentUser(),
    isAdmin(),
  ]);
  let order = await readSafely(`order ${orderId}`, () => getOrder(orderId), null);

  // Customers only see their own orders; admins can see any
  if (!order || (order.userId !== user?.id && !admin)) {
    return (
      <Container className="px-4 py-16 md:px-12">
        <EmptyState
          icon={Package}
          title={t.orders.notFoundTitle}
          description={t.orders.notFoundText}
          action={
            <Button asChild className="rounded-full bg-hero hover:bg-hero/90">
              <Link href="/orders">{t.orders.title}</Link>
            </Button>
          }
        />
      </Container>
    );
  }

  // Back from Stripe: confirm the payment directly, so it works even without the webhook
  if (
    order.paymentMethod === "stripe" &&
    !order.isPaid &&
    query.session_id &&
    query.session_id === order.stripeSessionId &&
    isStripeConfigured()
  ) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(query.session_id);
      if (session.payment_status === "paid") {
        await markPaidByStripeSession(session.id);
        order = { ...order, isPaid: true };
      }
    } catch (error) {
      console.error("Could not confirm the Stripe payment:", error);
    }
  }

  const settings =
    order.paymentMethod === "bank_transfer" && !order.isPaid
      ? await readSafely("store settings", getStoreSettings, null)
      : null;
  const itemCount = order.items.reduce((total, item) => total + item.qty, 0);
  const placedOn = new Date(order.createdAt).toLocaleDateString(t.locale, { day: "numeric", month: "long", year: "numeric" });
  const justPlaced = query.placed === "1" || Boolean(query.session_id);

  return (
    <Container className="px-4 pb-16 pt-8 md:px-12">
      <Breadcrumbs
        label={t.breadcrumb.label}
        items={[
          { label: t.breadcrumb.home, href: "/" },
          { label: t.breadcrumb.orders, href: "/orders" },
          { label: order.code },
        ]}
      />

      {justPlaced && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
          <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">{t.orders.thanks}</p>
            <p className="text-sm">{t.orders.thanksText}</p>
          </div>
        </div>
      )}
      {query.cancelled === "1" && !order.isPaid && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-orange-50 p-4 text-orange-800">
          <Info className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm">{t.checkout.cancelled}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">{t.orders.detailTitle(order.code)}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.orders.placedOn(placedOn)}</p>
        </div>
        <OrderStatusBadges order={order} t={t} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <section className="space-y-4 lg:col-span-7">
          <h2 className="text-lg font-semibold text-neutral-800">{t.orders.payment}</h2>
          <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm md:p-6">
            <p className="font-medium text-neutral-800">{t.checkout.methods[order.paymentMethod].title}</p>
            {order.isPaid ? (
              <p className="mt-2 flex items-start gap-2 text-sm text-emerald-700">
                <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />
                {t.orders.paidText}
              </p>
            ) : order.paymentMethod === "bank_transfer" && settings ? (
              <div className="mt-4 space-y-5">
                <div>
                  <p className="font-semibold text-neutral-800">{t.orders.bankTitle}</p>
                  <p className="mt-1 text-sm text-neutral-600">{t.orders.bankText}</p>
                </div>
                <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
                  {/* Dynamic QR from VietQR (external SVG), so next/image isn't used */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vietQrImageUrl(settings, order.total, order.code)}
                    alt={t.orders.qrAlt}
                    width={480}
                    height={600}
                    className="mx-auto w-full max-w-[260px] rounded-xl border border-neutral-100 bg-white"
                  />
                  <dl className="space-y-3 text-sm">
                    {[
                      { label: t.orders.bank, value: settings.bankName || settings.bankBin, copy: false },
                      { label: t.orders.accountNumber, value: settings.accountNumber, copy: true },
                      { label: t.orders.accountName, value: settings.accountName, copy: false },
                      { label: t.orders.amount, value: formatPrice(order.total, t.locale), copyValue: String(order.total), copy: true },
                      { label: t.orders.transferNote, value: order.code, copy: true, strong: true },
                    ].map((row) => (
                      <div key={row.label} className="rounded-xl bg-cream px-4 py-2.5">
                        <dt className="text-xs text-muted-foreground">{row.label}</dt>
                        <dd className="flex items-center justify-between gap-2">
                          <span className={row.strong ? "text-base font-bold text-hero" : "font-semibold text-neutral-800"}>
                            {row.value}
                          </span>
                          {row.copy && <CopyButton value={row.copyValue ?? row.value} label={row.label} />}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ) : order.paymentMethod === "stripe" ? (
              <div className="mt-3 space-y-3">
                <p className="text-sm text-neutral-600">{t.orders.cardUnpaid}</p>
                {isStripeConfigured() && <PayByCardButton orderId={order.id} />}
              </div>
            ) : (
              <p className="mt-2 text-sm text-neutral-600">{t.orders.codText}</p>
            )}
          </div>

          <h2 className="pt-4 text-lg font-semibold text-neutral-800">{t.orders.deliverTo}</h2>
          <div className="rounded-2xl border border-neutral-100 bg-white p-5 text-sm shadow-sm md:p-6">
            <p className="font-semibold text-neutral-800">{order.customerName}</p>
            <p className="text-neutral-600">{order.phone}</p>
            <p className="mt-2 whitespace-pre-line text-neutral-600">{order.address}</p>
            {order.note && <p className="mt-2 whitespace-pre-line italic text-neutral-500">{order.note}</p>}
          </div>
        </section>

        <aside className="space-y-4 rounded-2xl bg-cream p-6 lg:sticky lg:top-24 lg:col-span-5">
          <h2 className="text-lg font-semibold text-neutral-800">{t.cart.summary}</h2>
          <ul className="space-y-3">
            {order.items.map((item, index) => (
              <li key={`${index}-${item.name}`} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-contain p-1" />
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
          <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="font-semibold text-neutral-800">
              {t.cart.total} <span className="font-normal text-muted-foreground">({t.orders.items(itemCount)})</span>
            </span>
            <span className="whitespace-nowrap text-2xl font-bold text-neutral-900">{formatPrice(order.total, t.locale)}</span>
          </div>
        </aside>
      </div>
    </Container>
  );
}
