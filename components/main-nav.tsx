"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  scrolled: boolean;
}

export default function MainNav({
  className,
  scrolled,
  ...props
}: MainNavProps) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: "/",
      label: "Trang Chủ",
      active: pathname === "/",
    },
    {
      href: "/menu",
      label: "Sản Phẩm",
      active: pathname === "/menu",
    },
    {
      href: "/orders",
      label: "Đơn Hàng",
      active: pathname === "/orders",
    },
    // {
    //   href: "/about",
    //   label: "About",
    //   active: pathname === "/about",
    // },
    // {
    //   href: "/contact",
    //   label: "Contact",
    //   active: pathname === "/contact",
    // },
  ];
  return (
    <div className="ml-auto">
      <nav
        className={cn(
          "flex items-center space-x-4 lg:space-x-12 pl-6",
          className
        )}
      >
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={cn(
              "text-base font-medium transition-colors hover:text-primary",
              route.active
                ? `${
                    scrolled
                      ? "text-hero font-bold"
                      : "text-black dark:text-white"
                  }`
                : `${scrolled ? "text-black" : "text-white"}`
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
