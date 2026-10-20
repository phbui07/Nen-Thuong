import Container from "@/components/container";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/server";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default async function ProductNotFound() {
  const t = await getDictionary();
  return (
    <Container className="px-4 py-16 md:px-12">
      <EmptyState
        icon={SearchX}
        title={t.product.notFoundTitle}
        description={t.product.notFoundText}
        action={
          <Button asChild className="rounded-full bg-hero hover:bg-hero/90">
            <Link href="/menu">{t.product.backToProducts}</Link>
          </Button>
        }
      />
    </Container>
  );
}
