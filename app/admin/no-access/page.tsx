import Container from "@/components/container";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n/server";
import { SignOutButton } from "@clerk/nextjs";
import { ShieldAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false } };

export default async function AdminNoAccessPage() {
  if (await isAdmin()) redirect("/admin");
  const [t, user] = await Promise.all([getDictionary(), getCurrentUser()]);

  return (
    <Container className="px-4 py-16 md:px-12">
      <EmptyState
        icon={ShieldAlert}
        title={t.admin.noAccessTitle}
        description={t.admin.noAccessText(user?.email ?? "")}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <SignOutButton redirectUrl="/sign-in?redirect_url=/admin">
              <Button className="rounded-full bg-hero hover:bg-hero/90">{t.admin.signOut}</Button>
            </SignOutButton>
            <Button asChild variant={"outline"} className="rounded-full">
              <Link href="/">{t.status.backHome}</Link>
            </Button>
          </div>
        }
      />
    </Container>
  );
}
