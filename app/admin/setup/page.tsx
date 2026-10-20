import Container from "@/components/container";
import { isAdmin } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db/client";
import { getDictionary } from "@/lib/i18n/server";
import { Database } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false } };

export default async function AdminSetupPage() {
  if (!(await isAdmin())) redirect("/admin/no-access");
  if (isDatabaseConfigured()) redirect("/admin");
  const t = await getDictionary();

  return (
    <Container className="px-4 py-16 md:px-12">
      <div className="mx-auto max-w-xl rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm md:p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-hero/10 text-hero">
          <Database className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-2xl font-bold text-neutral-800">{t.admin.setupTitle}</h1>
        <p className="mt-2 text-neutral-600">{t.admin.setupText}</p>
        <ol className="mt-6 space-y-3">
          {t.admin.setupSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm text-neutral-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-hero text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}
