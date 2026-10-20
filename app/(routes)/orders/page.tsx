import getOrders from "@/actions/get-orders";
import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import { getDictionary } from "@/lib/i18n/server";
import { getUserId } from "@/lib/auth";
import type { Metadata } from "next";
import PageContent from "./components/page-content";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.meta.orders };
}

export default async function OrderPage() {
  const [userId, t] = await Promise.all([getUserId(), getDictionary()]);
  const orders = userId ? await getOrders(userId) : [];

  return (
    <Container className="px-4 pb-16 pt-8 md:px-12">
      <Breadcrumbs
        label={t.breadcrumb.label}
        items={[{ label: t.breadcrumb.home, href: "/" }, { label: t.breadcrumb.orders }]}
      />
      <h1 className="mt-6 text-3xl font-bold text-neutral-800">{t.orders.title}</h1>
      <PageContent orders={orders} />
    </Container>
  );
}
