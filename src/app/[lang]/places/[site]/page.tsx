import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import ArtPlate from "@/components/ArtPlate";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { LiveDistance, PlaceActions } from "@/components/PlaceClient";
import { ConfidenceMeter, RelationChip, RelationList } from "@/components/Relations";
import SitePhoto from "@/components/SitePhoto";
import { neighbours, siteById, siteName, sites, storiesForSite, workById } from "@/data/atlas";
import { artworkFor, photoFor } from "@/data/media";
import type { Site, Story } from "@/data/types";
import { LOCALES, type Locale, type Text, hasLocale, isFallback, tr } from "@/i18n/config";
import { type Dictionary, fmt, getDictionary } from "@/i18n/dictionaries";
import { distanceM, formatDistance } from "@/lib/geo";

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => sites.map((s) => ({ lang, site: s.id })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/places/[site]">): Promise<Metadata> {
  const { lang, site: id } = await params;
  const site = siteById(id);
  if (!site || !hasLocale(lang)) return {};
  const first = storiesForSite(id)[0];
  return { title: siteName(site, lang), description: first ? tr(first.hook, lang) : undefined };
}

const between = (a: Site, b: Site) => distanceM([a.lat, a.lng], [b.lat, b.lng]);

export default async function PlacePage({ params }: PageProps<"/[lang]/places/[site]">) {
  const { lang, site: id } = await params;
  const site = siteById(id);
  if (!site || !hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const stories = storiesForSite(id);
  const art = artworkFor(id);
  const photo = photoFor(id);
  const nearbySites = sites
    .filter((s) => s.id !== id)
    .map((s) => ({ s, d: between(site, s) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main>
        {/* ——— Hero ——— */}
        <section className="md:grid md:min-h-[calc(100dvh-56px)] md:grid-cols-2">
          <div className="group relative aspect-[4/3] overflow-hidden bg-paper-2 md:sticky md:top-14 md:order-last md:aspect-auto md:h-[calc(100dvh-56px)]">
            <SitePhoto siteId={id} priority color sizes="(min-width: 768px) 50vw, 100vw" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3">
              <LiveDistance point={[site.lat, site.lng]} paths={stories.flatMap((s) => (s.path ? [s.path] : []))} />
              {photo && (
                <a href={photo.source} target="_blank" rel="noreferrer" className="text-[9px] text-white/80 drop-shadow">
                  {photo.author} · {photo.license}
                </a>
              )}
            </div>
          </div>

          <div className="px-4 pt-6 pb-16 md:px-10 md:pt-10">
            <div className="flex items-center justify-between">
              <Link href={`/${lang}/nearby?site=${id}`} className="label link-underline">
                ← {dict.place.back}
              </Link>
              <span className="label text-mute">{site.arrondissement}</span>
            </div>

            <h1 className="display rise mt-8 text-[clamp(40px,6vw,76px)]">{siteName(site, lang)}</h1>
            {site.status && (
              <p className="label mt-4 inline-block border border-accent px-2 py-1 text-[10px] text-accent">{dict.status[site.status]}</p>
            )}
            <p className="label mt-3 text-mute">
              {site.address}
              {site.precision !== "exact" && <span className="text-accent"> · {dict.precision[site.precision]}</span>}
            </p>

            {stories.length > 1 && (
              <nav className="mt-8 border-y hairline py-3">
                <p className="label mb-2 text-mute">{dict.place.readings}</p>
                <div className="flex flex-wrap gap-2">
                  {stories.map((s) => (
                    <a key={s.id} href={`#${s.workId}`} className="display border hairline px-3 py-1 text-[15px] italic hover:bg-paper-2">
                      {workById(s.workId)!.title}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            {stories.map((story) => (
              <StorySection key={story.id} story={story} site={site} locale={lang} dict={dict} />
            ))}

            {art && (
              <div className="mt-14 max-w-md">
                <ArtPlate art={art} locale={lang} />
              </div>
            )}

            <div className="mt-14 border-t border-ink pt-6">
              <PlaceActions siteId={id} />
            </div>

            {/* ——— Continue walking ——— */}
            <section className="mt-14">
              <h2 className="label mb-3 text-mute">{dict.place.alsoNearby}</h2>
              <ul className="border-t hairline">
                {nearbySites.map(({ s, d }) => {
                  const st = storiesForSite(s.id)[0];
                  return (
                    <li key={s.id} className="border-b hairline">
                      <Link href={`/${lang}/places/${s.id}`} className="group flex items-baseline justify-between gap-4 py-3">
                        <span className="min-w-0">
                          <span className="block group-hover:underline">{siteName(s, lang)}</span>
                          <span className="block truncate text-[13px] text-mute">{tr(st.hook, lang)}</span>
                        </span>
                        <span className="label shrink-0">{formatDistance(d, dict.units)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </section>
      </main>
      <Footer locale={lang} />
    </>
  );
}

/* ———————————————————————————————————————————————————————————————— */

function StorySection({ story, site, locale, dict }: { story: Story; site: Site; locale: Locale; dict: Dictionary }) {
  const work = workById(story.workId)!;
  const { previous, next, total } = neighbours(story);
  const t = (x: Text) => tr(x, locale);

  return (
    <article id={story.workId} className="mt-12 scroll-mt-20">
      {/* Work + beat */}
      <p className="label text-mute">
        {work.index} · {work.title} — {work.creator}, {work.year} · {dict.medium[work.medium]}
      </p>
      <p className="display mt-3 text-[20px] text-accent italic">
        {story.order}/{total} · {t(story.beat)}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {story.relations.map((r) => (
          <RelationChip key={r} relation={r} locale={locale} />
        ))}
      </div>

      {story.uncertainty && (
        <p className="mt-5 border-l-2 border-accent bg-accent/5 px-4 py-3 text-[14px] leading-relaxed text-ink-2">{t(story.uncertainty)}</p>
      )}

      {/* Lede — the editorial hook */}
      <p className="display mt-8 text-[clamp(22px,2.4vw,30px)] leading-[1.2]">{t(story.hook)}</p>

      {/* FACT */}
      <section className="mt-10">
        <h2 className="label mb-3">{dict.place.whatHappened}</h2>
        <p className="text-[16px] leading-relaxed text-ink">{t(story.happened)}</p>
        <h3 className="label mt-6 mb-2 text-mute">{dict.place.whatChanges}</h3>
        <p className="text-[15px] leading-relaxed text-ink-2">{t(story.consequence)}</p>
      </section>

      {/* READING */}
      <section className="mt-10">
        <h2 className="label mb-3 flex items-center gap-2">
          {dict.place.whyMatters}
          <span className="border hairline px-1.5 py-0.5 text-[9px] text-mute">{dict.place.reading}</span>
        </h2>
        <p className="text-[16px] leading-relaxed text-ink">{t(story.why)}</p>
        <p className="mt-6 border-t hairline pt-4">
          <span className="label block text-mute">{dict.place.role}</span>
          <span className="display mt-1 block text-[19px] italic">{t(story.spatialFunction)}</span>
        </p>
      </section>

      {/* Through the story */}
      <StoryPath story={story} site={site} previous={previous} next={next} locale={locale} dict={dict} />

      {/* Supporting layers */}
      <div className="mt-10 border-t border-ink">
        <Layer title={dict.place.inTheWork}>
          <Field label={dict.place.when} value={story.when} locale={locale} />
          <Field label={dict.place.people} value={story.people} locale={locale} />
          {story.anchor && (
            <div>
              <dt className="label mb-1 text-mute">{dict.place.anchor}</dt>
              <dd className="display text-[18px] italic" lang="en">{story.anchor}</dd>
            </div>
          )}
          <Field label={dict.place.mention} value={story.evidence.mention} locale={locale} />
        </Layer>
        <Layer title={dict.place.today}>
          <Field label={dict.place.thenNow} value={story.thenNow} locale={locale} />
          <Field label={dict.place.visiting} value={story.practical} locale={locale} />
          <div>
            <dt className="label mb-1 text-mute">{dict.place.address}</dt>
            <dd>{site.address}, {site.arrondissement}</dd>
          </div>
        </Layer>
        <Layer title={dict.place.history}>
          <Field label={dict.place.history} value={story.biography} locale={locale} />
          <Field label={dict.place.realLayer} value={story.inspiration} locale={locale} />
          <Field label={dict.place.related} value={story.related} locale={locale} />
        </Layer>
        <Layer title={dict.place.evidence}>
          <RelationList relations={story.relations} locale={locale} />
          <Field label={dict.place.relationText} value={story.evidence.relationText} locale={locale} />
          <Field label={dict.place.chain} value={story.evidence.chain} locale={locale} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <dt className="label mb-1 text-mute">{dict.place.confidence}</dt>
              <dd><ConfidenceMeter value={story.evidence.confidence} locale={locale} /></dd>
            </div>
            <div>
              <dt className="label mb-1 text-mute">{dict.place.tier}</dt>
              <dd className="label">{story.evidence.tier}</dd>
            </div>
          </div>
          <div>
            <dt className="label mb-1 text-mute">{dict.place.position}</dt>
            <dd className="text-[14px] text-ink-2">
              {dict.precision[site.precision]} · {dict.coordSource[site.coordSource]}
            </dd>
          </div>
          {story.evidence.sources.length > 0 && (
            <div>
              <dt className="label mb-1 text-mute">{dict.place.sources}</dt>
              <dd>
                <ul className="flex flex-col gap-1">
                  {story.evidence.sources.map((u) => (
                    <li key={u}>
                      <a href={u} target="_blank" rel="noreferrer" className="break-all text-[13px] text-ink-2 underline decoration-line underline-offset-2 hover:decoration-ink">
                        {u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </Layer>
      </div>
    </article>
  );
}

function StoryPath({ story, site, previous, next, locale, dict }: { story: Story; site: Site; previous?: Story; next?: Story; locale: Locale; dict: Dictionary }) {
  const step = (other: Story | undefined, dir: "previous" | "next") => {
    if (!other) return <p className="text-[14px] text-mute">{dir === "previous" ? dict.place.start : dict.place.end}</p>;
    const otherSite = siteById(other.siteId)!;
    const d = otherSite.id === site.id ? 0 : between(site, otherSite);
    // A jump belongs to the arrival: it sits on the later of the two stories.
    const jump = dir === "previous" ? story.jump : other.jump;
    return (
      <Link href={`/${locale}/places/${otherSite.id}${storiesForSite(otherSite.id).length > 1 ? `#${other.workId}` : ""}`} className="group block">
        <span className="label text-mute">
          {dir === "previous" ? `← ${dict.place.previous}` : `${dict.place.next} →`} · {other.order}
        </span>
        <span className="display mt-1 block text-[20px] leading-tight group-hover:underline">{siteName(otherSite, locale)}</span>
        <span className="mt-1 block text-[13px] text-ink-2 italic">{tr(other.beat, locale)}</span>
        {d > 0 && <span className="label mt-2 block text-mute">{fmt(dict.place.apart, { d: formatDistance(d, dict.units) })}</span>}
        {jump && (
          <span className="mt-2 block border-l-2 border-accent pl-3 text-[13px] leading-snug text-ink-2">
            <span className="label block text-accent">↯ {dict.place.jump}</span>
            {tr(jump, locale)}
          </span>
        )}
      </Link>
    );
  };

  return (
    <section className="mt-10">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="label">{dict.place.path}</h2>
        <Link href={`/${locale}/walks/${story.workId}`} className="label link-underline text-mute">
          {dict.place.openWalk} →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 border-y hairline py-5">
        {step(previous, "previous")}
        <div className="border-l hairline pl-4">{step(next, "next")}</div>
      </div>
    </section>
  );
}

function Layer({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group border-b hairline">
      <summary className="flex items-center justify-between py-4">
        <span className="label">{title}</span>
        <span className="chev text-xl leading-none font-light transition-transform">+</span>
      </summary>
      <dl className="flex flex-col gap-5 pb-6">{children}</dl>
    </details>
  );
}

function Field({ label, value, locale }: { label: string; value: Text; locale: Locale }) {
  const text = tr(value, locale);
  if (!text) return null;
  const fallback = isFallback(value, locale);
  return (
    <div>
      <dt className="label mb-1 text-mute">{label}</dt>
      <dd className="text-[15px] leading-relaxed text-ink-2" lang={fallback ? "en" : undefined}>
        {text}
        {fallback && <span className="label ml-2 text-[9px] text-mute">EN</span>}
      </dd>
    </div>
  );
}
