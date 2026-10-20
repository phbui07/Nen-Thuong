import AdminNav from "@/components/admin/admin-nav";
import Container from "@/components/container";
import { requireAdminPage } from "@/lib/admin-guard";
import { getDictionary } from "@/lib/i18n/server";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.meta.admin, robots: { index: false } };
}

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  const t = await getDictionary();

  return (
    <Container className="px-4 pb-16 pt-8 md:px-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-neutral-800">{t.admin.title}</h1>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-hero"
        >
          {t.admin.viewStore}
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
      <AdminNav className="mt-5" />
      <div className="mt-8">{children}</div>
    </Container>
  );
}
