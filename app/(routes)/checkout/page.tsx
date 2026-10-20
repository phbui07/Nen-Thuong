import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import { getCurrentUser } from "@/lib/auth";
import { readSafely } from "@/lib/db/safe";
import { getStoreSettings } from "@/lib/db/settings";
import { getDictionary } from "@/lib/i18n/server";
import { availablePaymentMethods } from "@/lib/payments";
import type { PaymentMethod } from "@/types-db";
import type { Metadata } from "next";
import CheckoutForm from "./components/checkout-form";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.meta.checkout };
}

export default async function CheckoutPage() {
  const [t, user, methods] = await Promise.all([
    getDictionary(),
    getCurrentUser(),
    readSafely("payment methods", async () => availablePaymentMethods(await getStoreSettings()), [] as PaymentMethod[]),
  ]);

  return (
    <Container className="px-4 pb-16 pt-8 md:px-12">
      <Breadcrumbs
        label={t.breadcrumb.label}
        items={[
          { label: t.breadcrumb.home, href: "/" },
          { label: t.breadcrumb.cart, href: "/cart" },
          { label: t.checkout.title },
        ]}
      />
      <h1 className="mt-6 text-3xl font-bold text-neutral-800">{t.checkout.title}</h1>
      <CheckoutForm methods={methods} defaultName={user?.name ?? ""} />
    </Container>
  );
}
