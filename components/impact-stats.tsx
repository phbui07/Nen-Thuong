import Container from "@/components/container";
import { getDictionary } from "@/lib/i18n/server";

export default async function ImpactStats() {
  const t = await getDictionary();

  return (
    <section aria-labelledby="impact-title" className="bg-hero text-white">
      <Container className="px-4 py-12 md:px-12">
        <h2 id="impact-title" className="sr-only">
          {t.impact.title}
        </h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-8 min-[360px]:grid-cols-2 md:gap-y-10 lg:grid-cols-4">
          {t.impact.stats.map((stat) => (
            <div key={stat.label} className="flex min-w-0 flex-col gap-1 border-l-2 border-white/30 pl-4">
              <dt className="order-2 text-sm font-semibold uppercase tracking-wide text-white/90">{stat.label}</dt>
              {/* Four columns start at lg, where they're narrowest, so step down there */}
              <dd className="order-1 whitespace-nowrap text-2xl font-bold sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl">
                {stat.value}
              </dd>
              <dd className="order-3 text-sm leading-snug text-white/70">{stat.detail}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
