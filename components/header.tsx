"use client";

import { cn } from "@/lib/utils";
import Container from "@/components/container";
import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import MainNav from "./main-nav";
import CartActionButton from "./cart-action";
import LanguageToggle from "./language-toggle";

interface HeaderProps {
  userId: string | null;
}

export default function Header({ userId }: HeaderProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu after navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      {/* Reserves the fixed header's height */}
      <div className="h-16" aria-hidden />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300",
          (scrolled || menuOpen) && "shadow-md"
        )}
      >
        <Container>
          <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-6 lg:px-12">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 text-base font-bold uppercase text-neutral-800 sm:text-lg md:text-xl"
            >
              <Image src="/img/logo.jpg" alt="" width={36} height={36} className="shrink-0 rounded-full" priority />
              {/* Shrinks on very narrow phones instead of pushing the buttons off-screen */}
              <span className="truncate">Nến Thương</span>
            </Link>

            <MainNav className="ml-auto hidden lg:flex" signedIn={!!userId} />

            <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2 lg:ml-6">
              <LanguageToggle />
              <CartActionButton />
              {userId ? (
                <UserButton />
              ) : (
                <div className="hidden items-center gap-2 lg:flex">
                  <Button
                    asChild
                    variant={"outline"}
                    className="h-9 bg-white text-black duration-300 hover:bg-black hover:text-white"
                  >
                    <Link href={"/sign-in"}>{t.nav.signIn}</Link>
                  </Button>
                  <Button asChild className="h-9 bg-black text-white duration-300 hover:bg-hero">
                    <Link href={"/sign-up"}>{t.nav.signUp}</Link>
                  </Button>
                </div>
              )}
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-100 lg:hidden"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </Container>

        {menuOpen && (
          <div
            id="mobile-menu"
            className="border-t bg-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 lg:hidden"
          >
            <div className="space-y-4 px-4 py-4">
              <MainNav vertical signedIn={!!userId} />
              {!userId && (
                <div className="grid grid-cols-2 gap-2 border-t pt-4">
                  <Button asChild variant={"outline"} className="rounded-full">
                    <Link href={"/sign-in"}>{t.nav.signIn}</Link>
                  </Button>
                  <Button asChild className="rounded-full bg-hero hover:bg-hero/90">
                    <Link href={"/sign-up"}>{t.nav.signUp}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
