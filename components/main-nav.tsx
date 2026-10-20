"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/language-provider";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MainNavProps {
  className?: string;
  vertical?: boolean;
  signedIn: boolean;
}

export default function MainNav({ className, vertical = false, signedIn }: MainNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const routes = [
    { href: "/", label: t.nav.home, active: pathname === "/" },
    { href: "/menu", label: t.nav.products, active: pathname.startsWith("/menu") },
    { href: "/about", label: t.nav.about, active: pathname === "/about" },
    ...(signedIn ? [{ href: "/orders", label: t.nav.orders, active: pathname === "/orders" }] : []),
  ];

  return (
    <nav
      aria-label={t.nav.label}
      className={cn(vertical ? "flex flex-col gap-1" : "flex items-center gap-8", className)}
    >
      {routes.map((route) => (
        <Link
          href={route.href}
          key={route.href}
          aria-current={route.active ? "page" : undefined}
          className={cn(
            "text-base font-medium transition-colors",
            vertical
              ? "rounded-lg px-4 py-3 text-neutral-700 hover:bg-neutral-100"
              : "relative py-1 text-neutral-600 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-hero after:transition-transform hover:text-hero hover:after:scale-x-100",
            route.active &&
              (vertical
                ? "bg-hero/10 font-semibold text-hero hover:bg-hero/10"
                : "font-semibold text-hero after:scale-x-100")
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
