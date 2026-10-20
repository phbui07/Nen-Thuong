"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import { LayoutDashboard, Package, Receipt, Ruler, Settings, Tags } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav({ className }: { className?: string }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const items = [
    { href: "/admin", label: t.admin.nav.dashboard, icon: LayoutDashboard },
    { href: "/admin/orders", label: t.admin.nav.orders, icon: Receipt },
    { href: "/admin/products", label: t.admin.nav.products, icon: Package },
    { href: "/admin/categories", label: t.admin.nav.categories, icon: Tags },
    { href: "/admin/sizes", label: t.admin.nav.sizes, icon: Ruler },
    { href: "/admin/settings", label: t.admin.nav.settings, icon: Settings },
  ];

  return (
    <nav aria-label={t.admin.title} className={cn("-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0", className)}>
      <ul className="flex w-max gap-1 rounded-full bg-cream p-1 md:w-auto md:flex-wrap">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "bg-white text-hero shadow-sm" : "text-neutral-600 hover:text-hero"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
