import Container from "@/components/container";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/server";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default async function NotFound() {
  const t = await getDictionary();
  return (
    <Container className="px-4 py-16 md:px-12">
      <EmptyState
        icon={SearchX}
        title={t.status.notFoundTitle}
        description={t.status.notFoundText}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full bg-hero hover:bg-hero/90">
              <Link href="/">{t.status.backHome}</Link>
            </Button>
            <Button asChild variant={"outline"} className="rounded-full">
              <Link href="/menu">{t.cart.browse}</Link>
            </Button>
          </div>
        }
      />
    </Container>
  );
}
