import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Photo from "@/components/Photo";
import { coverArtFor } from "@/lib/media";
import { formatMinutes, routes } from "@/data/routes";

export const metadata: Metadata = { title: "Routes — DÉRIVE" };

export default function RoutesPage() {
  return (
    <>
      <Header />
      <main className="px-4 md:px-8">
        <section className="flex flex-col gap-4 py-16 md:flex-row md:items-end md:justify-between md:py-24">
          <h1 className="display text-[clamp(56px,9vw,150px)]">Walks</h1>
          <p className="max-w-sm text-ink-2">
            Three sequences of real places in Paris, each following one work in the order its story unfolds. One film,
            one memoir, one novel.
          </p>
        </section>

        <ul className="border-t border-ink">
          {routes.map((r) => (
            <li key={r.id} className="border-b hairline">
              <Link href={`/routes/${r.id}`} className="group grid items-center gap-6 py-8 md:grid-cols-12 md:py-10">
                <span className="label text-mute md:col-span-1">{r.index}</span>
                <div className="md:col-span-5">
                  <h2 className="display text-[clamp(40px,5vw,80px)] transition-transform duration-500 group-hover:translate-x-2">
                    {r.title}
                  </h2>
                  <p className="display mt-2 text-[18px] text-mute italic">{r.subtitle}</p>
                </div>
                <div className="label flex flex-col gap-1 text-ink-2 md:col-span-3">
                  <span>{r.work.type} · {r.work.creator} · {r.work.year}</span>
                  <span className="text-mute">
                    {r.stops.length} stops · {r.distanceKm} km · {formatMinutes(r.estimatedMinutes)}
                  </span>
                </div>
                <div className="relative hidden aspect-[4/3] overflow-hidden md:col-span-3 md:block">
                  {coverArtFor(r.id) ? (
                    <Image src={coverArtFor(r.id)!.image} alt={coverArtFor(r.id)!.title} fill sizes="25vw" className="object-cover" />
                  ) : (
                    <Photo id={r.stops[0].placeId} alt={r.title} sizes="25vw" />
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="h-24" />
      </main>
      <Footer />
    </>
  );
}
