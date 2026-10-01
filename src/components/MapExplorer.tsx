"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { places } from "@/data/places";
import { formatMinutes, routeById, routes } from "@/data/routes";
import type { Category } from "@/data/types";
import { useJournal } from "@/lib/store";
import { distanceKm, formatDistance } from "@/lib/geo";
import PlaceCard from "./PlaceCard";
import { PARIS_CENTER } from "./paris";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-paper-2">
      <span className="label animate-pulse text-mute">Loading Paris…</span>
    </div>
  ),
});

const FILTERS: { id: Category; label: string }[] = [
  { id: "film", label: "Film" },
  { id: "literature", label: "Literature" },
  { id: "art", label: "Art" },
  { id: "artist-life", label: "Artist life" },
];

type Locate = { state: "idle" | "locating" | "ok" | "far" | "denied"; pos?: [number, number]; km?: number };

export default function MapExplorer() {
  const params = useSearchParams();
  const [routeId, setRouteId] = useState<string | undefined>(params.get("route") ?? undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(params.get("place") ?? undefined);
  const [filters, setFilters] = useState<Set<Category>>(new Set());
  const [locate, setLocate] = useState<Locate>({ state: "idle" });
  const entries = useJournal((s) => s.entries);

  const route = routeId ? routeById(routeId) : undefined;
  const visited = useMemo(
    () => new Set(Object.values(entries).filter((e) => e.checkedInAt).map((e) => e.placeId)),
    [entries],
  );

  const visible = useMemo(
    () => (filters.size ? places.filter((p) => filters.has(p.category)) : places),
    [filters],
  );
  const selected = places.find((p) => p.id === selectedId);

  const sync = (r?: string, p?: string) => {
    const q = new URLSearchParams();
    if (r) q.set("route", r);
    if (p) q.set("place", p);
    window.history.replaceState(null, "", `/map${q.size ? `?${q}` : ""}`);
  };
  const chooseRoute = (id?: string) => {
    setRouteId(id);
    setSelectedId(undefined);
    sync(id);
  };
  const select = (id?: string) => {
    setSelectedId(id);
    sync(routeId, id);
  };
  const step = (dir: -1 | 1) => {
    if (!route || !selectedId) return;
    const i = route.stops.findIndex((s) => s.placeId === selectedId);
    const next = route.stops[(i + dir + route.stops.length) % route.stops.length];
    select(next.placeId);
  };

  const nearMe = () => {
    if (!("geolocation" in navigator)) return setLocate({ state: "denied" });
    setLocate({ state: "locating" });
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const pos: [number, number] = [p.coords.latitude, p.coords.longitude];
        const km = distanceKm(pos, PARIS_CENTER);
        setLocate(km > 25 ? { state: "far", km } : { state: "ok", pos });
      },
      () => setLocate({ state: "denied" }),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const nearest = useMemo(() => {
    if (locate.state !== "ok" || !locate.pos) return [];
    return places
      .map((p) => ({ p, d: distanceKm(locate.pos!, [p.lat, p.lng]) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 5);
  }, [locate]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col-reverse md:flex-row">
      {/* ——— Panel ——— */}
      <aside className="no-scrollbar h-[46dvh] shrink-0 overflow-y-auto border-t hairline bg-paper md:h-auto md:w-[380px] md:border-t-0 md:border-r">
        <div className="px-5 pt-6 pb-4 md:px-7">
          <p className="label text-mute">Paris — {places.length} places</p>
          <h1 className="display mt-2 text-[34px]">Choose a walk</h1>
        </div>

        <ul className="border-t hairline">
          <li>
            <button
              onClick={() => chooseRoute(undefined)}
              className={`flex w-full items-baseline gap-4 border-b hairline px-5 py-4 text-left md:px-7 ${!route ? "bg-ink text-paper" : "hover:bg-paper-2"}`}
            >
              <span className="label w-6 opacity-60">00</span>
              <span className="display flex-1 text-[22px]">All places</span>
              <span className="label opacity-60">{places.length}</span>
            </button>
          </li>
          {routes.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => chooseRoute(r.id)}
                className={`flex w-full items-baseline gap-4 border-b hairline px-5 py-4 text-left md:px-7 ${route?.id === r.id ? "bg-ink text-paper" : "hover:bg-paper-2"}`}
              >
                <span className="label w-6 opacity-60">{r.index}</span>
                <span className="flex-1">
                  <span className="display block text-[22px]">{r.title}</span>
                  <span className="label mt-1 block opacity-60">
                    {r.work.type} · {r.stops.length} stops · {formatMinutes(r.estimatedMinutes)}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-1.5 px-5 py-4 md:px-7">
          {FILTERS.map((f) => {
            const on = filters.has(f.id);
            return (
              <button
                key={f.id}
                onClick={() => {
                  const next = new Set(filters);
                  if (on) next.delete(f.id);
                  else next.add(f.id);
                  setFilters(next);
                }}
                className={`label border px-2.5 py-1.5 text-[9.5px] ${on ? "border-ink bg-ink text-paper" : "hairline"}`}
              >
                {f.label}
              </button>
            );
          })}
          <button onClick={nearMe} className="label ml-auto flex items-center gap-2 px-1 py-1.5 text-[9.5px]">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            {locate.state === "locating" ? "Locating…" : "Near me"}
          </button>
        </div>

        {locate.state === "far" && (
          <p className="mx-5 mb-4 border hairline p-3 text-mute md:mx-7">
            You&apos;re about {Math.round(locate.km!)} km from Paris. The map stays here — come find it in person.
          </p>
        )}
        {locate.state === "denied" && (
          <p className="mx-5 mb-4 border hairline p-3 text-mute md:mx-7">
            Location unavailable. Everything still works — just pick a walk.
          </p>
        )}
        {nearest.length > 0 && (
          <section className="px-5 pb-4 md:px-7">
            <h2 className="label mb-2 text-accent">Near you now</h2>
            <ul>
              {nearest.map(({ p, d }) => (
                <li key={p.id}>
                  <button onClick={() => select(p.id)} className="flex w-full justify-between border-b hairline py-2 text-left">
                    <span>{p.title}</span>
                    <span className="label text-mute">{formatDistance(d)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {route ? (
          <section className="px-5 pb-10 md:px-7">
            <p className="mb-5 text-[13.5px] leading-relaxed text-ink-2">{route.description}</p>
            <ol className="relative">
              {route.stops.map((s, i) => {
                const p = places.find((x) => x.id === s.placeId)!;
                const isSel = p.id === selectedId;
                return (
                  <li key={s.placeId} className="relative flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`pin shrink-0 ${isSel ? "is-active" : ""} ${visited.has(p.id) ? "is-visited" : ""}`}
                      >
                        {String(s.order).padStart(2, "0")}
                      </span>
                      {i < route.stops.length - 1 && <span className="w-px flex-1 border-l border-dashed border-ink/40" />}
                    </div>
                    <button onClick={() => select(p.id)} className="group mb-5 flex-1 text-left">
                      <span className="display block text-[15px] text-accent italic">{s.narrativeBeat}</span>
                      <span className="block text-[14px] group-hover:underline">{p.title}</span>
                      <span className="label mt-0.5 block text-mute">{p.address}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        ) : (
          <section className="px-5 pb-10 md:px-7">
            <ul>
              {visible.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => select(p.id)}
                    className={`flex w-full items-baseline justify-between gap-3 border-b hairline py-2.5 text-left ${p.id === selectedId ? "text-accent" : ""}`}
                  >
                    <span className="flex items-baseline gap-2">
                      {visited.has(p.id) && <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />}
                      {p.title}
                    </span>
                    <span className="label shrink-0 text-mute">{p.arrondissement}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>

      {/* ——— Map ——— */}
      <div className="relative min-h-0 flex-1">
        <MapView
          places={visible}
          route={route}
          selectedId={selectedId}
          visited={visited}
          userPos={locate.state === "ok" ? locate.pos : undefined}
          onSelect={select}
        />
        {route && (
          <div className="pointer-events-none absolute top-4 left-4 z-[500] hidden bg-paper/90 px-4 py-3 backdrop-blur md:block">
            <p className="label text-mute">{route.index} — {route.work.type}, {route.work.year}</p>
            <p className="display text-[44px] leading-none">{route.title}</p>
          </div>
        )}
      </div>

      {/* ——— Place card ——— */}
      {selected && (
        <div className="fixed inset-0 z-[1100] md:relative md:inset-auto md:z-auto md:w-[440px] md:shrink-0 md:border-l hairline">
          <PlaceCard
            key={selected.id}
            place={selected}
            route={route?.stops.some((s) => s.placeId === selected.id) ? route : undefined}
            onClose={() => select(undefined)}
            onStep={route?.stops.some((s) => s.placeId === selected.id) ? step : undefined}
          />
        </div>
      )}
    </div>
  );
}
