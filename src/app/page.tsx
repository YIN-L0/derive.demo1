import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import { formatMinutes, routes } from "@/data/routes";
import { places } from "@/data/places";
import { allArtworks, coverArtFor, imageFor } from "@/lib/media";

const COVER: Record<string, string> = {
  "before-sunset": "bs-shakespeare",
  "moveable-feast": "mf-closerie",
  "sun-also-rises": "sr-select",
};

export default function Home() {
  const lookbook = places.filter((p) => imageFor(p.id));

  return (
    <>
      <Header tone="overlay" />
      <main>
        {/* ——— Hero ——— */}
        <section className="relative h-dvh min-h-[620px] overflow-hidden bg-ink text-white">
          <Image
            src="/img/bs-tournelle.jpg"
            alt="The Seine at Quai de la Tournelle"
            fill
            priority
            sizes="100vw"
            className="photo object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/60" />

          <div className="relative flex h-full flex-col justify-between px-4 pt-24 pb-8 md:px-8">
            <div className="rise flex justify-between">
              <span className="label">Collection 01 — Paris</span>
              <span className="label hidden md:inline">Autumn 2026</span>
            </div>

            <div className="grid items-end gap-8 md:grid-cols-12">
              <h1 className="display rise text-[clamp(56px,10.5vw,168px)] md:col-span-9" style={{ animationDelay: "120ms" }}>
                The city is
                <br />a <em className="italic">living</em> book.
              </h1>
              <div className="rise flex flex-col gap-5 md:col-span-3" style={{ animationDelay: "260ms" }}>
                <p className="max-w-xs text-[14px] leading-relaxed text-white/85">
                  The map that turns cities into living books, films, paintings and memories. Walk the real Paris of
                  <em className="display text-[16px]"> Before Sunset</em> and of Hemingway — stop by stop, scene by scene.
                </p>
                <div className="flex gap-2">
                  <Link href="/map" className="btn border-white bg-white text-ink hover:bg-transparent hover:text-white">
                    Explore Paris
                  </Link>
                  <Link href="/routes" className="btn border-white/70 text-white hover:border-white hover:bg-white hover:text-ink">
                    The walks
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ——— Statement ——— */}
        <section className="grid gap-8 px-4 py-24 md:grid-cols-12 md:px-8 md:py-36">
          <p className="label text-mute md:col-span-3">01 — The idea</p>
          <p className="display text-[clamp(28px,3.6vw,54px)] leading-[1.08] md:col-span-9">
            Every city is already annotated — by the films shot on its corners, the novels written in its cafés, the
            painters who starved in its attics. <span className="text-mute">Dérive puts those annotations back on the map,</span>{" "}
            so you can stand where Céline turned to Jesse, or sit where Hemingway wrote his first novel.
          </p>
        </section>

        {/* ——— The walks ——— */}
        <section className="px-4 pb-24 md:px-8 md:pb-36">
          <div className="mb-8 flex items-end justify-between border-b hairline pb-4">
            <h2 className="display text-[clamp(36px,4vw,64px)]">The walks</h2>
            <Link href="/routes" className="label link-underline">View all</Link>
          </div>
          <div className="grid gap-x-4 gap-y-12 md:grid-cols-3">
            {routes.map((r, i) => (
              <Link key={r.id} href={`/routes/${r.id}`} className="group rise block" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="relative aspect-[3/4] overflow-hidden bg-paper-2">
                  {coverArtFor(r.id) ? (
                    <Image
                      src={coverArtFor(r.id)!.image}
                      alt={`${coverArtFor(r.id)!.title} — ${coverArtFor(r.id)!.artist}`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="photo-zoom object-cover transition-transform duration-[1200ms]"
                    />
                  ) : (
                    <Photo id={COVER[r.id]} alt={r.title} sizes="(min-width: 768px) 33vw, 100vw" />
                  )}
                  <span className="label absolute top-3 left-3 bg-paper px-2 py-1">{r.index}</span>
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="display text-[30px]">{r.title}</h3>
                    <p className="display mt-1 text-[16px] text-mute italic">{r.subtitle}</p>
                  </div>
                  <span className="label shrink-0 pt-2 text-mute">{r.work.type}</span>
                </div>
                <p className="label mt-4 flex gap-4 text-ink-2">
                  <span>{r.stops.length} stops</span>
                  <span>{r.distanceKm} km</span>
                  <span>{formatMinutes(r.estimatedMinutes)}</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ——— Feature: Before Sunset ——— */}
        <section className="grid border-y hairline md:grid-cols-2">
          <div className="group relative aspect-square overflow-hidden md:aspect-auto md:min-h-[720px]">
            <Photo id="bs-coulee-verte" alt="Coulée verte René-Dumont" sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
          <div className="flex flex-col justify-between gap-12 px-4 py-14 md:px-12 md:py-16">
            <p className="label text-mute">02 — In focus · Before Sunset, 2004</p>
            <div>
              <p className="display text-[clamp(44px,5.5vw,92px)]">
                80 minutes
                <br />
                <em className="text-mute italic">on screen.</em>
                <br />
                2h30 on foot.
              </p>
              <p className="mt-8 max-w-md text-[14px] leading-relaxed text-ink-2">
                Linklater filmed Jesse and Céline&apos;s afternoon in near real time, on real streets. Eight stops take you from
                the bookshop on the Left Bank, up onto a garden built on an old viaduct, down to the river, and into a
                quiet courtyard where the film ends.
              </p>
            </div>
            <div className="grid grid-cols-3 border-t hairline pt-5">
              {[
                ["08", "Stops"],
                ["8.4", "Kilometres"],
                ["04", "Arrondissements"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="display text-[40px]">{n}</p>
                  <p className="label text-mute">{l}</p>
                </div>
              ))}
            </div>
            <Link href="/map?route=before-sunset" className="btn btn-solid self-start">
              Walk it on the map
            </Link>
          </div>
        </section>

        {/* ——— How it works ——— */}
        <section className="px-4 py-24 md:px-8 md:py-36">
          <p className="label mb-10 text-mute">03 — How it works</p>
          <div className="grid gap-10 md:grid-cols-3 md:gap-4">
            {[
              ["Choose a walk", "A film, a novel, a life. Each walk is an ordered sequence of real places and the story beat that happened there."],
              ["Open the place", "Tap a pin to read the scene, why it matters, and where the information comes from. No long quotes — original notes."],
              ["Keep a journal", "Check in when you arrive. Save what moved you. Write a line. Your journal stays on your device."],
            ].map(([t, d], i) => (
              <div key={t} className="border-t border-ink pt-5">
                <p className="display text-[64px] leading-none">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mt-6 text-[26px]">{t}</h3>
                <p className="mt-3 max-w-sm text-ink-2">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ——— Lookbook strip ——— */}
        <section className="pb-24 md:pb-36">
          <div className="mb-6 flex items-end justify-between px-4 md:px-8">
            <h2 className="display text-[clamp(36px,4vw,64px)]">
              {places.length} places, <em className="italic text-mute">one city</em>
            </h2>
            <Link href="/map" className="label link-underline hidden md:inline">Open the map</Link>
          </div>
          <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 md:px-8">
            {lookbook.map((p, i) => (
              <Link key={p.id} href={`/map?place=${p.id}`} className="group w-[62vw] shrink-0 snap-start md:w-[22vw]">
                <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
                  <Photo id={p.id} alt={p.title} sizes="(min-width: 768px) 22vw, 62vw" />
                </div>
                <div className="mt-3 flex justify-between gap-3">
                  <span className="text-[13px]">{p.title}</span>
                  <span className="label shrink-0 text-mute">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="display text-[14px] text-mute italic">{p.works[0].title}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ——— Plates ——— */}
        <section className="border-t hairline pt-16 pb-24 md:pt-24 md:pb-36">
          <div className="mb-8 grid gap-4 px-4 md:grid-cols-12 md:px-8">
            <p className="label text-mute md:col-span-3">04 — The plates</p>
            <p className="display text-[clamp(26px,3vw,44px)] leading-[1.1] md:col-span-9">
              Each literary stop is paired with a painting or photograph from its own years —{" "}
              <em className="italic text-mute">Atget&apos;s streets, Cézanne&apos;s landscapes, Marquet&apos;s river.</em>
            </p>
          </div>
          <div className="no-scrollbar flex snap-x items-end gap-6 overflow-x-auto px-4 md:gap-10 md:px-8">
            {allArtworks.map(([placeId, a]) => (
              <Link key={placeId} href={`/map?place=${placeId}`} className="group shrink-0 snap-start">
                <div className="bg-paper-2 p-3 md:p-4">
                  <Image
                    src={a.image}
                    alt={`${a.title} — ${a.artist}, ${a.year}`}
                    width={a.width}
                    height={a.height}
                    sizes="420px"
                    className="h-[220px] w-auto max-w-none md:h-[300px]"
                  />
                </div>
                <p className="display mt-3 max-w-[260px] text-[15px] italic group-hover:underline">{a.title}</p>
                <p className="label text-mute">
                  {a.artist} · {a.year}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ——— Community teaser ——— */}
        <section className="mx-4 mb-24 grid items-end gap-8 bg-ink px-6 py-16 text-paper md:mx-8 md:grid-cols-12 md:px-12 md:py-24">
          <div className="md:col-span-8">
            <p className="label text-paper/60">05 — Coming next</p>
            <p className="display mt-6 text-[clamp(34px,4.4vw,72px)]">
              Walks written by critics, locals and <em className="italic">the people who remember.</em>
            </p>
          </div>
          <div className="flex flex-col gap-4 md:col-span-4">
            <p className="text-paper/70">
              First in review: James Baldwin&apos;s Saint-Germain — proposed by a contributor, checked against sources
              before it goes live.
            </p>
            <Link href="/community" className="btn self-start border-paper text-paper hover:bg-paper hover:text-ink">
              Community preview
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
