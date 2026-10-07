import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { RelationChip } from "@/components/Relations";
import SitePhoto from "@/components/SitePhoto";
import { siteById, siteName, storiesForSite, storiesForWork, workById, works } from "@/data/atlas";
import { coverFor } from "@/data/media";
import { LOCALES, hasLocale, tr } from "@/i18n/config";
import { fmt, getDictionary } from "@/i18n/dictionaries";
import { distanceM, formatDistance } from "@/lib/geo";
import { walkLength } from "@/lib/walks";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => works.map((w) => ({ lang, work: w.id })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/walks/[work]">): Promise<Metadata> {
  const { lang, work: id } = await params;
  const work = workById(id);
  if (!work || !hasLocale(lang)) return {};
  return { title: work.title, description: tr(work.subtitle, lang) };
}

export default async function WalkPage({ params }: PageProps<"/[lang]/walks/[work]">) {
  const { lang, work: id } = await params;
  const work = workById(id);
  if (!work || !hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const seq = storiesForWork(id).map((story) => ({ story, site: siteById(story.siteId)! }));
  const cover = coverFor(id);
  const next = works[(works.indexOf(work) + 1) % works.length];

  return (
    <>
      <Header />
      <main>
        <section className="grid md:min-h-[calc(100dvh-56px)] md:grid-cols-2">
          <div className="flex flex-col justify-between gap-10 px-4 py-10 md:px-8">
            <div className="flex justify-between">
              <Link href={`/${lang}/walks`} className="label link-underline">← {dict.walks.all}</Link>
              <span className="label text-mute">{work.index} / {String(works.length).padStart(2, "0")}</span>
            </div>
            <div className="rise">
              <p className="label text-mute">
                {dict.medium[work.medium]} — {work.creator}, {work.year}
              </p>
              <h1 className="display mt-4 text-[clamp(52px,7vw,120px)]">{work.title}</h1>
              <p className="display mt-3 text-[22px] text-mute italic">{tr(work.subtitle, lang)}</p>
              <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-ink-2">{tr(work.description, lang)}</p>
            </div>
            <div>
              <dl className="grid grid-cols-2 border-t hairline pt-5">
                <div>
                  <dt className="label text-mute">{dict.walks.stops}</dt>
                  <dd className="display text-[36px]">{String(seq.length).padStart(2, "0")}</dd>
                </div>
                <div>
                  <dt className="label text-mute">{dict.walks.distance}</dt>
                  <dd className="display text-[36px]">≈ {formatDistance(walkLength(seq.map((x) => x.site)) * 1.25, dict.units)}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href={`/${lang}/nearby?walk=${id}`} className="btn btn-solid">{dict.walks.onMap}</Link>
                <a href="#sequence" className="btn">{dict.walks.read}</a>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden bg-paper-2 md:aspect-auto">
            <Image src={cover.src} alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className={`object-cover ${cover.isArt ? "" : "photo"}`} />
          </div>
        </section>

        <section id="sequence" className="px-4 pt-20 md:px-8 md:pt-32">
          <h2 className="display mb-10 border-b border-ink pb-4 text-[clamp(36px,4vw,64px)]">{dict.walks.sequence}</h2>
          <ol>
            {seq.map(({ story, site }, i) => {
              const prev = seq[i - 1];
              const gap = prev && prev.site.id !== site.id ? distanceM([prev.site.lat, prev.site.lng], [site.lat, site.lng]) : 0;
              const href = `/${lang}/places/${site.id}${storiesForSite(site.id).length > 1 ? `#${work.id}` : ""}`;
              return (
                <li key={story.id}>
                  {prev && (
                    <div className={`flex items-center gap-4 py-4 md:pl-[16.66%] ${story.jump ? "text-accent" : "text-mute"}`}>
                      <span className={`h-10 border-l ${story.jump ? "border-dashed border-accent" : "border-line"}`} />
                      <span className="label">{gap ? fmt(dict.place.apart, { d: formatDistance(gap, dict.units) }) : "·"}</span>
                      {story.jump && <span className="text-[13px] text-ink-2"><span className="label text-accent">↯ {dict.place.jump}</span> — {tr(story.jump, lang)}</span>}
                    </div>
                  )}
                  <Link href={href} className="group grid gap-6 border-t hairline py-8 md:grid-cols-12 md:gap-8">
                    <span className="display text-[64px] leading-none md:col-span-2 md:text-[88px]">{String(story.order).padStart(2, "0")}</span>
                    <div className="relative aspect-[4/3] overflow-hidden bg-paper-2 md:col-span-3">
                      <SitePhoto siteId={site.id} sizes="(min-width: 768px) 25vw, 100vw" />
                    </div>
                    <div className="flex flex-col gap-3 md:col-span-7">
                      <p className="display text-[20px] text-accent italic">{tr(story.beat, lang)}</p>
                      <h3 className="display text-[clamp(28px,3vw,46px)] group-hover:underline">{siteName(site, lang)}</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {story.relations.map((r) => <RelationChip key={r} relation={r} locale={lang} />)}
                      </div>
                      <p className="text-[15px] leading-relaxed text-ink">{tr(story.hook, lang)}</p>
                      <div className="grid gap-4 border-t hairline pt-4 md:grid-cols-2">
                        <p>
                          <span className="label mb-1 block text-mute">{dict.walks.movement}</span>
                          <span className="text-[14px] leading-relaxed text-ink-2">{tr(story.consequence, lang)}</span>
                        </p>
                        <p>
                          <span className="label mb-1 block text-mute">{dict.walks.device}</span>
                          <span className="display text-[17px] italic">{tr(story.spatialFunction, lang)}</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <Link href={`/${lang}/walks/${next.id}`} className="group block px-4 py-24 md:px-8 md:py-32">
          <p className="label text-mute">{dict.walks.next} — {next.index}</p>
          <p className="display mt-4 text-[clamp(44px,7.5vw,128px)] transition-transform duration-700 group-hover:translate-x-3">
            {next.title} <span className="text-mute italic">→</span>
          </p>
        </Link>
      </main>
      <Footer locale={lang} />
    </>
  );
}
