import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Journal, { type JournalSite } from "@/components/Journal";
import { siteName, sites, storiesForSite, storiesForWork, workById, works } from "@/data/atlas";
import { artworkFor, photoFor } from "@/data/media";
import { hasLocale, tr } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/journal">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).journal.title } : {};
}

export default async function JournalPage({ params }: PageProps<"/[lang]/journal">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const index: JournalSite[] = sites.map((s) => {
    const st = storiesForSite(s.id);
    return {
      id: s.id,
      name: siteName(s, lang),
      works: [...new Set(st.map((x) => workById(x.workId)!.title))],
      hook: st[0] ? tr(st[0].hook, lang) : "",
      image: photoFor(s.id)?.src ?? artworkFor(s.id)?.src,
    };
  });
  const walks = works.map((w) => ({ id: w.id, title: w.title, siteIds: storiesForWork(w.id).map((s) => s.siteId) }));

  return (
    <>
      <Header />
      <Journal sites={index} walks={walks} />
      <Footer locale={lang} />
    </>
  );
}
