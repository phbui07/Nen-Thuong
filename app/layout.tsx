import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { viVN } from "@clerk/localizations";
import Header from "@/components/header";
import { auth } from "@clerk/nextjs/server";
import Footer from "@/components/footer";
import ToastProvider from "@/providers/toast-provider";
import LanguageProvider from "@/providers/language-provider";
import { getLanguage } from "@/lib/i18n/server";
import { dictionaries } from "@/lib/i18n/dictionaries";

// Be Vietnam Pro covers every Vietnamese diacritic.
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = dictionaries[await getLanguage()];
  return {
    title: { default: meta.title, template: "%s | Nến Thương" },
    description: meta.description,
    icons: { icon: "/img/logo.jpg" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ userId }, language] = await Promise.all([auth(), getLanguage()]);
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      localization={language === "vi" ? viVN : undefined}
      appearance={{ variables: { colorPrimary: "#942828" } }}
    >
      {/* Lets Next.js turn smooth scrolling off during route changes */}
      <html lang={language} data-scroll-behavior="smooth">
        <body className={cn("flex min-h-screen flex-col bg-background font-sans antialiased", beVietnamPro.variable)}>
          <LanguageProvider language={language}>
            <ToastProvider />
            <Header userId={userId} />
            <main className="flex-1">{children}</main>
            <Footer />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
