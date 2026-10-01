import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { allCredits } from "@/lib/media";
import { placeById } from "@/data/places";

export const metadata: Metadata = { title: "Sources & credits — DÉRIVE" };

const SOURCES = [
  ["Before Sunset locations, in order of appearance", "https://movie-locations.com/movies/b/Before-Sunset.php"],
  ["Hemingway's Paris — map and addresses", "https://www.untappedcities.com/the-hemingway-map-of-paris/"],
  ["Paris in The Sun Also Rises — addresses by chapter", "https://adequatica.substack.com/p/paris-in-hemingways-the-sun-also-rises"],
  ["Before Sunset — overview", "https://en.wikipedia.org/wiki/Before_Sunset"],
];

export default function CreditsPage() {
  return (
    <>
      <Header />
      <main className="px-4 md:px-8">
        <h1 className="display py-16 text-[clamp(48px,7vw,110px)] md:py-24">Sources & credits</h1>

        <section className="grid gap-8 border-t border-ink py-8 md:grid-cols-12">
          <h2 className="label md:col-span-3">Research</h2>
          <ul className="md:col-span-9">
            {SOURCES.map(([label, url]) => (
              <li key={url} className="flex flex-wrap justify-between gap-2 border-b hairline py-3">
                <span>{label}</span>
                <a href={url} target="_blank" rel="noreferrer" className="label link-underline text-mute">
                  {new URL(url).hostname}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-8 border-t border-ink py-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <h2 className="label">Photography</h2>
            <p className="mt-3 text-mute">Wikimedia Commons, shown in monochrome. Licences as listed.</p>
          </div>
          <ul className="md:col-span-9">
            {allCredits.map(([id, c]) => (
              <li key={id} className="grid gap-1 border-b hairline py-3 md:grid-cols-3">
                <span>{placeById(id)?.title}</span>
                <span className="text-mute">{c.author}</span>
                <a href={c.source} target="_blank" rel="noreferrer" className="label link-underline justify-self-start text-mute md:justify-self-end">
                  {c.license}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className="mb-24 max-w-xl pt-8 text-mute">
          All place summaries are original writing. Map data © OpenStreetMap contributors, vector tiles by OpenFreeMap, restyled for Dérive. Dérive is an
          independent demo with no affiliation to the films, books, estates or venues mentioned.
        </p>
      </main>
      <Footer />
    </>
  );
}
