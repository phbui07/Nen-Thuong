"use client";

import { formatPrice } from "@/components/convert";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/use-carts";
import useMounted from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import type { PaymentMethod } from "@/types-db";
import { Banknote, CreditCard, Flame, Landmark, Loader2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import { placeOrder } from "../actions";

const methodIcons: Record<PaymentMethod, typeof Landmark> = {
  bank_transfer: Landmark,
  cod: Banknote,
  stripe: CreditCard,
};

interface CheckoutFormProps {
  methods: PaymentMethod[];
  defaultName: string;
}

export default function CheckoutForm({ methods, defaultName }: CheckoutFormProps) {
  const { t } = useLanguage();
  const mounted = useMounted();
  const router = useRouter();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(methods[0]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const itemCount = items.reduce((total, item) => total + (item.qty ?? 1), 0);
  const total = items.reduce((sum, item) => sum + item.price * (item.qty ?? 1), 0);

  if (!mounted) {
    return <div className="mt-6 h-96 animate-pulse rounded-2xl bg-cream" aria-hidden />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        className="mt-6"
        icon={ShoppingBag}
        title={t.cart.emptyTitle}
        description={t.cart.emptyText}
        action={
          <Button asChild className="rounded-full bg-hero hover:bg-hero/90">
            <Link href="/menu">{t.cart.browse}</Link>
          </Button>
        }
      />
    );
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    startTransition(async () => {
      const result = await placeOrder({
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        address: String(form.get("address") ?? ""),
        note: String(form.get("note") ?? ""),
        paymentMethod: paymentMethod as PaymentMethod,
        items: items.map((item) => ({ productId: item.id, qty: item.qty ?? 1 })),
      });
      if (!result.ok) {
        const message = t.checkout.errors[result.error] ?? t.checkout.errors.failed;
        setError(message);
        toast.error(message);
        return;
      }
      removeAll();
      // Clear any earlier error toast so it doesn't follow the customer to the order page
      toast.dismiss();
      // Card payments continue on Stripe's own page
      if (/^https?:\/\//.test(result.redirectUrl)) {
        window.location.href = result.redirectUrl;
      } else {
        router.push(result.redirectUrl);
      }
    });
  };

  return (
    <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
      <div className="space-y-8 lg:col-span-7">
        <fieldset className="space-y-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm md:p-6">
          <legend className="sr-only">{t.checkout.delivery}</legend>
          <h2 className="text-lg font-semibold text-neutral-800">{t.checkout.delivery}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-neutral-700">{t.checkout.name}</span>
              <Input name="name" defaultValue={defaultName} autoComplete="name" required minLength={2} maxLength={100} />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-neutral-700">{t.checkout.phone}</span>
              <Input name="phone" type="tel" inputMode="tel" autoComplete="tel" required minLength={9} maxLength={20} />
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-neutral-700">{t.checkout.address}</span>
            <Textarea
              name="address"
              autoComplete="street-address"
              placeholder={t.checkout.addressPlaceholder}
              required
              minLength={5}
              maxLength={300}
              className="min-h-[80px]"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-neutral-700">{t.checkout.note}</span>
            <Textarea name="note" maxLength={500} className="min-h-[64px]" />
          </label>
        </fieldset>

        <fieldset className="space-y-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm md:p-6">
          <legend className="sr-only">{t.checkout.payment}</legend>
          <h2 className="text-lg font-semibold text-neutral-800">{t.checkout.payment}</h2>
          {methods.length === 0 ? (
            <p className="rounded-xl bg-cream p-4 text-sm text-neutral-600">{t.checkout.noMethods}</p>
          ) : (
            <div className="grid gap-3">
              {methods.map((method) => {
                const Icon = methodIcons[method];
                const selected = paymentMethod === method;
                return (
                  <label
                    key={method}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors",
                      selected ? "border-hero bg-hero/5" : "border-neutral-200 hover:border-hero/50"
                    )}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={selected}
                      onChange={() => setPaymentMethod(method)}
                      className="h-4 w-4 accent-hero"
                    />
                    <Icon className={cn("h-5 w-5 shrink-0", selected ? "text-hero" : "text-neutral-500")} />
                    <span className="min-w-0">
                      <span className="block font-medium text-neutral-800">{t.checkout.methods[method].title}</span>
                      <span className="block text-sm text-muted-foreground">{t.checkout.methods[method].text}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </fieldset>
      </div>

      <aside className="space-y-4 rounded-2xl bg-cream p-6 lg:sticky lg:top-24 lg:col-span-5">
        <h2 className="text-lg font-semibold text-neutral-800">{t.cart.summary}</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white">
                {item.images?.[0]?.url ? (
                  <Image src={item.images[0].url} alt="" fill sizes="56px" className="object-contain p-1" />
                ) : (
                  <Flame className="absolute inset-0 m-auto h-5 w-5 text-hero/30" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium text-neutral-800">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.qty ?? 1} × {formatPrice(item.price, t.locale)}
                </p>
              </div>
              <p className="whitespace-nowrap text-sm font-semibold">{formatPrice(item.price * (item.qty ?? 1), t.locale)}</p>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{t.cart.subtotal(itemCount)}</span>
          <span className="whitespace-nowrap">{formatPrice(total, t.locale)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-neutral-800">{t.cart.total}</span>
          <span className="whitespace-nowrap text-2xl font-bold text-neutral-900">{formatPrice(total, t.locale)}</span>
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={isPending || methods.length === 0}
          className="w-full rounded-full bg-hero text-base hover:bg-hero/90"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? t.checkout.placing : t.checkout.placeOrder}
        </Button>
        <Button asChild variant={"ghost"} className="w-full rounded-full text-muted-foreground">
          <Link href="/cart">{t.checkout.backToCart}</Link>
        </Button>
      </aside>
    </form>
  );
}
