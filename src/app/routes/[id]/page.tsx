import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Photo from "@/components/Photo";
import { formatMinutes, routeById, routes } from "@/data/routes";
import { placeById } from "@/data/places";

export function generateStaticParams() {
  return routes.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: PageProps<"/routes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const route = routeById(id);
  return { title: route ? `${route.title} — DÉRIVE` : "Route — DÉRIVE", description: route?.description };
}

export default async function RoutePage({ params }: PageProps<"/routes/[id]">) {
  const { id } = await params;
  const route = routeById(id);
  if (!route) notFound();

  const stops = route.stops.map((s) => ({ ...s, place: placeById(s.placeId)! }));
  const next = routes[(routes.indexOf(route) + 1) % routes.length];

  return (
    <>
      <Header />
      <main>
        {/* ——— Cover ——— */}
        <section className="grid md:min-h-[calc(100dvh-56px)] md:grid-cols-2">
          <div className="flex flex-col justify-between gap-10 px-4 py-12 md:px-8 md:py-10">
            <div className="flex justify-between">
              <Link href="/routes" className="label link-underline">← All walks</Link>
              <span className="label text-mute">{route.index} / {String(routes.length).padStart(2, "0")}</span>
            </div>
            <div className="rise">
              <p className="label text-mute">
                {route.work.type} — {route.work.creator}, {route.work.year}
              </p>
              <h1 className="display mt-4 text-[clamp(56px,7.5vw,128px)]">{route.title}</h1>
              <p className="display mt-3 text-[22px] text-mute italic">{route.subtitle}</p>
              <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-ink-2">{route.description}</p>
            </div>
            <div>
              <dl className="grid grid-cols-3 border-t hairline pt-5">
                <div>
                  <dt className="label text-mute">Stops</dt>
                  <dd className="display text-[36px]">{String(route.stops.length).padStart(2, "0")}</dd>
                </div>
                <div>
                  <dt className="label text-mute">Distance</dt>
                  <dd className="display text-[36px]">{route.distanceKm} km</dd>
                </div>
                <div>
                  <dt className="label text-mute">Walking</dt>
                  <dd className="display text-[36px]">{formatMinutes(route.estimatedMinutes)}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href={`/map?route=${route.id}`} className="btn btn-solid">Walk it on the map</Link>
                <a href="#stops" className="btn">Read the sequence</a>
              </div>
            </div>
          </div>
          <div className="group relative aspect-[4/5] overflow-hidden bg-paper-2 md:aspect-auto">
            <Photo id={stops[0].placeId} alt={stops[0].place.title} priority sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        </section>

        {/* ——— Sequence ——— */}
        <section id="stops" className="px-4 pt-24 md:px-8 md:pt-36">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-4">
            <h2 className="display text-[clamp(36px,4vw,64px)]">The sequence</h2>
            <div className="flex flex-wrap gap-1.5">
              {route.themeTags.map((t) => (
                <span key={t} className="label border hairline px-2 py-1 text-[9.5px]">{t}</span>
              ))}
            </div>
          </div>

          <ol>
            {stops.map((s, i) => (
              <li key={s.placeId} className="grid gap-6 border-b hairline py-12 md:grid-cols-12 md:gap-8 md:py-16">
                <div className="md:col-span-2">
                  <span className="display text-[72px] leading-none md:text-[96px]">{String(s.order).padStart(2, "0")}</span>
                </div>
                <div className={`group relative aspect-[4/5] overflow-hidden bg-paper-2 md:col-span-4 ${i % 2 ? "md:order-last" : ""}`}>
                  <Photo id={s.placeId} alt={s.place.title} sizes="(min-width: 768px) 33vw, 100vw" />
                </div>
                <div className="flex flex-col gap-5 md:col-span-6">
                  <p className="display text-[22px] text-accent italic">{s.narrativeBeat}</p>
                  <h3 className="display text-[clamp(32px,3.2vw,52px)]">{s.place.title}</h3>
                  <p className="label text-mute">{s.place.address} · {s.place.arrondissement}</p>
                  <div className="grid gap-6 border-t hairline pt-5 md:grid-cols-2">
                    <div>
                      <h4 className="label mb-2 text-mute">The scene</h4>
                      <p className="leading-relaxed text-ink-2">{s.place.context}</p>
                    </div>
                    <div>
                      <h4 className="label mb-2 text-mute">Why it matters</h4>
                      <p className="leading-relaxed text-ink-2">{s.place.storyImpact}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="label text-mute">Source — {s.place.sourceLabel}</span>
                    <Link href={`/map?route=${route.id}&place=${s.placeId}`} className="label link-underline">
                      Open on map →
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ——— Next ——— */}
        <Link href={`/routes/${next.id}`} className="group block px-4 py-24 md:px-8 md:py-36">
          <p className="label text-mute">Next walk — {next.index}</p>
          <p className="display mt-4 text-[clamp(48px,8vw,140px)] transition-transform duration-700 group-hover:translate-x-3">
            {next.title} <span className="italic text-mute">→</span>
          </p>
        </Link>
      </main>
      <Footer />
    </>
  );
}
