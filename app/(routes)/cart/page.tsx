import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import { getDictionary } from "@/lib/i18n/server";
import type { Metadata } from "next";
import CartContent from "./components/cart-content";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.meta.cart };
}

export default async function CartPage() {
  const t = await getDictionary();

  return (
    <Container className="px-4 pb-16 pt-8 md:px-12">
      <Breadcrumbs
        label={t.breadcrumb.label}
        items={[
          { label: t.breadcrumb.home, href: "/" },
          { label: t.breadcrumb.products, href: "/menu" },
          { label: t.breadcrumb.cart },
        ]}
      />
      <CartContent />
    </Container>
  );
}
