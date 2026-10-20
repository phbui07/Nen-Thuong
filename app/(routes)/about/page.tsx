import Breadcrumbs from "@/components/breadcrumbs";
import Container from "@/components/container";
import FacebookIcon from "@/components/facebook-icon";
import ImpactStats from "@/components/impact-stats";
import PhotoGallery from "@/components/photo-gallery";
import SectionHeading from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/server";
import { FACEBOOK_URL } from "@/lib/links";
import teamPhoto from "@/public/img/story/team.jpg";
import boothSchoolPhoto from "@/public/img/story/booth-school.jpg";
import boothSalePhoto from "@/public/img/story/booth-sale.jpg";
import audiencePhoto from "@/public/img/story/visit-audience.jpg";
import storytellingPhoto from "@/public/img/story/visit-storytelling.jpg";
import friendsPhoto from "@/public/img/story/visit-friends.jpg";
import gamesPhoto from "@/public/img/story/visit-games.jpg";
import conversationPhoto from "@/public/img/story/visit-conversation.jpg";
import { Flame, HandHeart, Quote, Store } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.meta.about, description: t.about.lead };
}

const stepIcons = [Flame, Store, HandHeart];

export default async function AboutPage() {
  const t = await getDictionary();

  // Desktop: a 2x2 feature photo, the portrait photo two rows tall, then a row of three
  const gallery = [
    { src: audiencePhoto, ...t.photos.audience, className: "col-span-2 md:row-span-2" },
    { src: friendsPhoto, ...t.photos.friends, className: "md:row-span-2", imageClassName: "object-[center_30%]" },
    { src: storytellingPhoto, ...t.photos.storytelling },
    { src: gamesPhoto, ...t.photos.games },
    { src: conversationPhoto, ...t.photos.conversation },
  ];

  return (
    <>
      <Container className="px-4 pb-16 pt-8 md:px-12">
        <Breadcrumbs
          label={t.breadcrumb.label}
          items={[{ label: t.breadcrumb.home, href: "/" }, { label: t.breadcrumb.about }]}
        />
        <section className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-hero">{t.about.eyebrow}</p>
            <h1 className="text-4xl font-bold text-neutral-800 md:text-5xl">{t.about.title}</h1>
            <p className="text-lg leading-relaxed text-neutral-600">{t.about.lead}</p>
          </div>
          <figure className="relative">
            <div className="relative aspect-[3/2] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={teamPhoto}
                alt={t.photos.team.alt}
                fill
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="absolute -bottom-4 left-6 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-md">
              {t.photos.team.caption}
            </figcaption>
          </figure>
        </section>
      </Container>

      <ImpactStats />

      <Container className="px-4 md:px-12">
        <section className="py-16 md:py-20">
          <SectionHeading align="center" eyebrow={t.about.howEyebrow} title={t.about.howTitle} />
          <ol className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
            {t.about.steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <li key={step.title} className="relative rounded-2xl bg-white p-6 shadow-lg">
                  <span className="absolute right-6 top-5 text-4xl font-bold text-hero/10">0{index + 1}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-hero/10">
                    <Icon className="h-6 w-6 text-hero" />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-neutral-800">{step.title}</h3>
                  <p className="mt-2 leading-relaxed text-neutral-500">{step.text}</p>
                </li>
              );
            })}
          </ol>
        </section>
      </Container>

      <section className="bg-cream">
        <Container className="grid grid-cols-1 items-center gap-10 px-4 py-16 md:px-12 md:py-20 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow={t.about.boothEyebrow} title={t.about.boothTitle} description={t.about.boothText} />
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:col-span-3">
            {[
              { src: boothSchoolPhoto, ...t.photos.boothSchool },
              { src: boothSalePhoto, ...t.photos.boothSale },
            ].map((photo) => (
              <figure key={photo.caption} className="space-y-2">
                <div className="relative aspect-square overflow-hidden rounded-2xl shadow-md">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="text-center text-sm text-neutral-500">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <Container className="px-4 md:px-12">
        <section className="py-16 md:py-20">
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-12 text-white md:px-14 md:py-16">
            <Quote className="absolute -right-4 -top-4 h-40 w-40 text-white/5" aria-hidden />
            <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-3 lg:gap-10">
              <div className="space-y-4 lg:col-span-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">{t.about.seriesEyebrow}</p>
                <h2 className="text-3xl font-bold md:text-4xl">“{t.about.seriesTitle}”</h2>
                <p className="text-lg leading-relaxed text-white/80">{t.about.seriesText}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-6 text-center">
                <p className="whitespace-nowrap text-4xl font-bold md:text-5xl">{t.about.seriesStat}</p>
                <p className="mt-2 text-sm uppercase tracking-wide text-white/70">{t.about.seriesStatLabel}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-20">
          <SectionHeading eyebrow={t.about.galleryEyebrow} title={t.about.galleryTitle} description={t.about.galleryText} />
          <PhotoGallery photos={gallery} className="mt-8" />
        </section>

        <section className="mb-16 flex flex-col items-center gap-5 rounded-3xl bg-hero/5 px-6 py-12 text-center md:mb-20">
          <h2 className="text-3xl font-bold text-neutral-800">{t.about.ctaTitle}</h2>
          <p className="max-w-xl text-neutral-600">{t.about.ctaText}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild size="lg" className="rounded-full bg-hero px-8 hover:bg-hero/90">
              <Link href="/menu">{t.about.ctaShop}</Link>
            </Button>
            <Button asChild size="lg" variant={"outline"} className="rounded-full px-8">
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                <FacebookIcon className="mr-2 h-4 w-4" />
                {t.about.ctaFollow}
              </a>
            </Button>
          </div>
        </section>
      </Container>
    </>
  );
}
