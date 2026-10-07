import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { siteById, storiesForWork, works } from "@/data/atlas";
import { coverFor } from "@/data/media";
import { hasLocale, tr } from "@/i18n/config";
import { fmt, getDictionary } from "@/i18n/dictionaries";
import { formatDistance } from "@/lib/geo";
import { walkLength } from "@/lib/walks";

export async function generateMetadata({ params }: PageProps<"/[lang]/walks">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).walks.title } : {};
}

export default async function WalksPage({ params }: PageProps<"/[lang]/walks">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <Header />
      <main className="px-4 md:px-8">
        <section className="flex flex-col gap-4 py-16 md:flex-row md:items-end md:justify-between md:py-24">
          <h1 className="display text-[clamp(56px,9vw,150px)]">{dict.walks.title}</h1>
          <p className="max-w-md text-ink-2">{dict.walks.intro}</p>
        </section>
        <ul className="border-t border-ink">
          {works.map((w) => {
            const seq = storiesForWork(w.id);
            const cover = coverFor(w.id);
            return (
              <li key={w.id} className="border-b hairline">
                <Link href={`/${lang}/walks/${w.id}`} className="group grid items-center gap-6 py-8 md:grid-cols-12 md:py-10">
                  <span className="label text-mute md:col-span-1">{w.index}</span>
                  <div className="md:col-span-5">
                    <h2 className="display text-[clamp(40px,5vw,80px)] transition-transform duration-500 group-hover:translate-x-2">{w.title}</h2>
                    <p className="display mt-2 text-[18px] text-mute italic">{tr(w.subtitle, lang)}</p>
                  </div>
                  <div className="label flex flex-col gap-1 text-ink-2 md:col-span-3">
                    <span>
                      {dict.medium[w.medium]} · {w.creator} · {w.year}
                    </span>
                    <span className="text-mute">
                      {fmt(dict.walks.places, { n: seq.length })} · {formatDistance(walkLength(seq.map((s) => siteById(s.siteId)!)), dict.units)}
                    </span>
                  </div>
                  <div className="relative hidden aspect-[4/3] overflow-hidden md:col-span-3 md:block">
                    <Image src={cover.src} alt="" fill sizes="25vw" className={`object-cover ${cover.isArt ? "" : "photo"}`} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="h-24" />
      </main>
      <Footer locale={lang} />
    </>
  );
}
