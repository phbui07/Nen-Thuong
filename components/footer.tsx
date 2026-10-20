import Container from "@/components/container";
import FacebookIcon from "@/components/facebook-icon";
import { getDictionary } from "@/lib/i18n/server";
import { CONTACT_EMAIL, FACEBOOK_URL } from "@/lib/links";
import { Globe, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Footer() {
  const t = await getDictionary();
  const links = [
    { href: "/", label: t.nav.home },
    { href: "/menu", label: t.nav.products },
    { href: "/about", label: t.nav.about },
    { href: "/cart", label: t.breadcrumb.cart },
  ];

  return (
    <footer className="bg-hero text-white">
      <Container>
        <div className="grid w-full grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 md:px-12 lg:grid-cols-12">
          <div className="space-y-4 sm:col-span-2 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-bold uppercase">
              <Image src="/img/logo.jpg" alt="" width={44} height={44} className="rounded-full" />
              Nến Thương
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/80">{t.footer.tagline}</p>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <h2 className="text-lg font-semibold">{t.footer.explore}</h2>
            <ul className="space-y-2.5 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/80 transition-colors hover:text-white hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 lg:col-span-4">
            <h2 className="text-lg font-semibold">{t.footer.contact}</h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-white/80 transition-colors [overflow-wrap:anywhere] hover:text-white hover:underline"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white hover:underline"
                >
                  <FacebookIcon className="h-4 w-4 shrink-0" />
                  Facebook
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-white/80">
                <Globe className="h-4 w-4 shrink-0" />
                {t.footer.locations}
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/15 px-4 py-6 md:px-12">
          <p className="text-center text-xs text-white/70">
            &copy; {new Date().getFullYear()} Nến Thương. {t.footer.rights}
          </p>
        </div>
      </Container>
    </footer>
  );
}
