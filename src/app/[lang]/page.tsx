import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SequenceDiagram from "@/components/SequenceDiagram";
import { storiesForWork, works } from "@/data/atlas";
import { allArtworks, coverFor } from "@/data/media";
import type { Relation } from "@/data/types";
import { hasLocale, tr } from "@/i18n/config";
import { fmt, getDictionary } from "@/i18n/dictionaries";

const LEGEND: Relation[] = ["named-in-work", "inferred", "lived-or-worked", "inspiration", "narrative-setting", "filming-location"];
const SEINE = { en: "Seine", zh: "塞纳河", fr: "Seine" } as const;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const h = dict.home;

  return (
    <>
      <Header tone="overlay" />
      <main>
        {/* ——— Hero ——— */}
        <section className="relative h-dvh min-h-[620px] overflow-hidden bg-ink text-white">
          <Image src="/img/site/quai-de-la-tournelle.jpg" alt="" fill priority sizes="100vw" className="photo object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/65" />
          <div className="relative flex h-full flex-col justify-between px-4 pt-24 pb-8 md:px-8">
            <p className="label rise">{h.kicker}</p>
            <div className="grid items-end gap-8 md:grid-cols-12">
              <h1 className="display rise text-[clamp(52px,10vw,160px)] md:col-span-8" style={{ animationDelay: "120ms" }}>
                {h.title[0]} <em className="italic">{h.title[1]}</em>
                <br />
                {h.title[2]}
              </h1>
              <div className="rise flex flex-col gap-5 md:col-span-4" style={{ animationDelay: "260ms" }}>
                <p className="max-w-sm text-[15px] leading-relaxed text-white/85">{h.lede}</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/${lang}/nearby`} className="btn border-white bg-white text-ink hover:bg-transparent hover:text-white">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#2563eb]" /> {h.ctaNearby}
                  </Link>
                  <Link href={`/${lang}/walks`} className="btn border-white/70 text-white hover:border-white hover:bg-white hover:text-ink">
                    {h.ctaWalks}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Idea ——— */}
        <section className="grid gap-8 px-4 py-24 md:grid-cols-12 md:px-8 md:py-36">
          <p className="label text-mute md:col-span-3">{h.ideaLabel}</p>
          <p className="display text-[clamp(26px,3.4vw,50px)] leading-[1.1] md:col-span-9">
            {h.idea} <span className="text-mute">{h.ideaMuted}</span> {h.ideaEnd}
          </p>
        </section>

        {/* ——— Walks ——— */}
        <section className="px-4 pb-24 md:px-8 md:pb-36">
          <div className="mb-8 flex items-end justify-between border-b hairline pb-4">
            <h2 className="label text-mute">{h.walksLabel}</h2>
            <Link href={`/${lang}/walks`} className="label link-underline">{h.viewAll}</Link>
          </div>
          <div className="grid gap-x-4 gap-y-12 md:grid-cols-3">
            {works.map((w) => {
              const cover = coverFor(w.id);
              return (
                <Link key={w.id} href={`/${lang}/walks/${w.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-paper-2">
                    <Image src={cover.src} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className={`photo-zoom object-cover ${cover.isArt ? "" : "photo"}`} />
                    <span className="label absolute top-3 left-3 bg-paper px-2 py-1">{w.index}</span>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="display text-[30px]">{w.title}</h3>
                      <p className="display mt-1 text-[16px] text-mute italic">{tr(w.subtitle, lang)}</p>
                    </div>
                    <span className="label shrink-0 pt-2 text-mute">{dict.medium[w.medium]}</span>
                  </div>
                  <p className="label mt-3 text-ink-2">
                    {w.creator} · {w.year} · {fmt(dict.walks.places, { n: storiesForWork(w.id).length })}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ——— Focus: the impossible walk ——— */}
        <section className="grid border-y hairline md:grid-cols-2">
          <div className="flex items-center bg-paper-2 px-4 py-10 md:px-12">
            <SequenceDiagram workId="before-sunset" labels={{ jump: dict.place.jump, seine: SEINE[lang] }} />
          </div>
          <div className="flex flex-col justify-between gap-10 px-4 py-14 md:px-12 md:py-16">
            <p className="label text-mute">{h.focusLabel} · Before Sunset, 2004</p>
            <div>
              <p className="display text-[clamp(40px,5vw,84px)]">
                {h.focusTitle[0]}
                <br />
                <em className="text-accent italic">{h.focusTitle[1]}</em> {h.focusTitle[2]}
              </p>
              <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-2">{h.focusBody}</p>
              <p className="label mt-6 flex items-center gap-3 text-accent">
                <svg width="40" height="6" aria-hidden><line x1="0" y1="3" x2="40" y2="3" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 6" strokeLinecap="round" /></svg>
                {dict.place.jump}
              </p>
            </div>
            <Link href={`/${lang}/nearby?walk=before-sunset`} className="btn btn-solid self-start">{h.focusCta}</Link>
          </div>
        </section>

        {/* ——— How to read a place ——— */}
        <section className="px-4 py-24 md:px-8 md:py-36">
          <div className="mb-10 grid gap-6 md:grid-cols-12">
            <p className="label text-mute md:col-span-3">{h.methodLabel}</p>
            <p className="display text-[clamp(24px,2.8vw,40px)] leading-[1.15] md:col-span-9">{h.methodBody}</p>
          </div>
          <ul className="grid gap-x-4 gap-y-8 md:grid-cols-3">
            {LEGEND.map((r) => (
              <li key={r} className="border-t border-ink pt-4">
                <p className={`label ${r === "inferred" ? "text-accent" : ""}`}>{dict.relation[r][0]}</p>
                <p className="mt-2 text-ink-2">{dict.relation[r][1]}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ——— Plates ——— */}
        <section className="border-t hairline pt-16 pb-24 md:pt-24 md:pb-36">
          <div className="mb-8 grid gap-4 px-4 md:grid-cols-12 md:px-8">
            <p className="label text-mute md:col-span-3">{h.platesLabel}</p>
            <p className="display text-[clamp(24px,3vw,44px)] leading-[1.12] md:col-span-9">
              {h.plates} <em className="text-mute italic">{h.platesMuted}</em>
            </p>
          </div>
          <div className="no-scrollbar flex snap-x items-end gap-6 overflow-x-auto px-4 md:gap-10 md:px-8">
            {allArtworks.map(([siteId, a]) => (
              <Link key={siteId} href={`/${lang}/places/${siteId}`} className="group shrink-0 snap-start">
                <div className="bg-paper-2 p-3 md:p-4">
                  <Image src={a.src} alt={`${a.title} — ${a.artist}, ${a.year}`} width={a.width} height={a.height} sizes="420px" className="h-[220px] w-auto max-w-none md:h-[300px]" />
                </div>
                <p className="display mt-3 max-w-[260px] text-[15px] italic group-hover:underline">{a.title}</p>
                <p className="label text-mute">{a.artist} · {a.year}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer locale={lang} />
    </>
  );
}
