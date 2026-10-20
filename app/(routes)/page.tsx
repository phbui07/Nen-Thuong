import getProducts from "@/actions/get-products";
import Container from "@/components/container";
import EmptyState from "@/components/empty-state";
import ImpactStats from "@/components/impact-stats";
import PopularContent from "@/components/popular-content";
import SectionHeading from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getDictionary } from "@/lib/i18n/server";
import storytellingPhoto from "@/public/img/story/visit-storytelling.jpg";
import gamesPhoto from "@/public/img/story/visit-games.jpg";
import friendsPhoto from "@/public/img/story/visit-friends.jpg";
import { ArrowRight, Flame, HandHeart, HeartHandshake, PackageOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 0;

const pillarIcons = [HandHeart, Flame, HeartHandshake];

export default async function HomePage() {
  const [products, t] = await Promise.all([getProducts({ isFeatured: true }), getDictionary()]);

  return (
    <>
      {/* Red hero shape behind the transparent header (desktop only) */}
      <Image
        src="/img/hero.svg"
        alt=""
        width={1158}
        height={723}
        priority
        className="pointer-events-none absolute right-0 top-0 -z-10 hidden w-[60%] lg:block"
      />
      <Container className="px-4 md:px-12">
        <section className="grid grid-cols-1 items-center gap-8 py-10 md:py-16 lg:grid-cols-2">
          <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
            <p className="rounded-full border border-gray-300 px-5 py-1 text-sm text-neutral-500">{t.home.eyebrow}</p>
            <h1 className="text-4xl font-bold uppercase tracking-wide text-neutral-800 md:text-5xl">
              {t.home.titleStart}
              <span className="text-hero">{t.home.titleAccent}</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-neutral-500">{t.home.intro}</p>
            <div className="flex w-full flex-wrap items-center justify-center gap-4 pt-2 lg:w-auto lg:justify-start">
              <Button asChild size="lg" className="rounded-full bg-hero px-10 duration-300 hover:bg-hero/90">
                <Link href="/menu">{t.home.shopNow}</Link>
              </Button>
              <Button asChild size="lg" variant={"outline"} className="rounded-full px-10 duration-300">
                <Link href="/about">{t.home.learnMore}</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[280px] w-full sm:h-[360px] lg:h-[480px]">
            <Image
              src={"/img/bannner.png"}
              alt={t.home.heroImageAlt}
              className="object-contain"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </section>
      </Container>

      <ImpactStats />

      <Container className="px-4 md:px-12">
        <section className="py-16 md:py-20">
          <SectionHeading
            eyebrow={t.home.featuredEyebrow}
            title={t.home.featuredTitle}
            action={
              <Link
                href="/menu"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-hero hover:underline"
              >
                {t.home.viewAll}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
          {products.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {products.slice(0, 4).map((item) => (
                <PopularContent data={item} key={item.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              className="mt-8"
              icon={PackageOpen}
              title={t.products.emptyTitle}
              description={t.products.emptyText}
            />
          )}
        </section>

        <section id="mission" className="flex flex-col items-center py-12 md:py-16">
          <SectionHeading align="center" title={t.home.missionTitle} description={t.home.missionText} />
          <div className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {t.home.pillars.map((pillar, index) => {
              const Icon = pillarIcons[index];
              return (
                <Card
                  key={pillar.title}
                  className="flex flex-col items-center gap-4 rounded-2xl border-none p-6 py-10 text-center shadow-lg transition duration-300 hover:-translate-y-1"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-hero/10">
                    <Icon className="h-7 w-7 text-hero" />
                  </span>
                  <CardTitle>{pillar.title}</CardTitle>
                  <CardDescription className="leading-relaxed">{pillar.text}</CardDescription>
                </Card>
              );
            })}
          </div>
        </section>
      </Container>

      <section className="bg-cream">
        <Container className="grid grid-cols-1 items-center gap-10 px-4 py-16 md:px-12 md:py-20 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHeading
              eyebrow={t.home.journeyEyebrow}
              title={t.home.journeyTitle}
              description={t.home.journeyText}
            />
            <Button asChild size="lg" className="group rounded-full bg-hero px-8 hover:bg-hero/90">
              <Link href="/about">
                {t.home.journeyCta}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-3 md:gap-4">
            <div className="relative row-span-2 overflow-hidden rounded-2xl">
              <Image
                src={friendsPhoto}
                alt={t.photos.friends.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={storytellingPhoto}
                alt={t.photos.storytelling.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={gamesPhoto}
                alt={t.photos.games.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
