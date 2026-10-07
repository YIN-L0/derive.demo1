import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import NearbyExplorer from "@/components/NearbyExplorer";
import { works } from "@/data/atlas";
import { nearbyIndex } from "@/data/nearbyIndex";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: PageProps<"/[lang]/nearby">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).nearby.title } : {};
}

export default async function NearbyPage({ params }: PageProps<"/[lang]/nearby">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const walks = works.map((w) => ({ id: w.id, index: w.index, title: w.title, medium: dict.medium[w.medium] }));

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header />
      <Suspense fallback={<div className="flex-1 bg-paper-2" />}>
        <NearbyExplorer sites={nearbyIndex(lang)} walks={walks} />
      </Suspense>
    </div>
  );
}
