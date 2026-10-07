"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Category, LatLng, Relation, WorkId } from "@/data/types";
import { useI18n } from "@/i18n/client";
import { fmt } from "@/i18n/dictionaries";
import { PARIS_CENTER, formatDistance, walkingMinutes } from "@/lib/geo";
import { useLocation } from "@/lib/location";
import { type NearbySite, type NearbyStory, type Ranked, rankSites, siteDistance, visibleSlice } from "@/lib/nearby";
import { useJournal } from "@/lib/store";
import type { CameraRequest, MapLine, MapPin } from "./MapView";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-paper-2" />,
});

const FILTERS: Category[] = ["film", "literature", "art", "artist"];

/** Which relation to show on a small card. Order = what a walker most needs to know first. */
const LEAD: Relation[] = ["inferred", "constructed-continuity", "stand-in", "route", "filming-location", "named-in-work", "written-here", "lived-or-worked", "recalled-in-memoir", "inspiration", "narrative-setting"];
const UNCERTAIN = new Set<Relation>(["inferred", "constructed-continuity", "stand-in"]);

type Walk = { id: WorkId; index: string; title: string; medium: string };
type Props = { sites: NearbySite[]; walks: Walk[] };

export default function NearbyExplorer({ sites, walks }: Props) {
  const { locale, dict } = useI18n();
  const params = useSearchParams();
  const [walkId, setWalkId] = useState<WorkId | undefined>((params.get("walk") as WorkId) ?? undefined);
  const [selectedId, setSelectedId] = useState<string | undefined>(params.get("site") ?? undefined);
  const [filters, setFilters] = useState<Set<Category>>(new Set());
  const [pages, setPages] = useState(1);
  // A shared link to a place or walk should show that first, not jump to the reader's position.
  const [following, setFollowing] = useState(!params.get("site") && !params.get("walk"));
  const [center, setCenter] = useState<LatLng>(PARIS_CENTER);
  const [camera, setCamera] = useState<CameraRequest>();
  // Distinguishes "you dragged the map" from "we moved it to show a place or walk".
  const [userPanned, setUserPanned] = useState(false);
  const nonce = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);

  const { status, fix, farKm, start, resume } = useLocation();
  const entries = useJournal((s) => s.entries);
  const live = status === "live" && !!fix;
  // Distances are from the walker when we have them, otherwise from where they are looking.
  const origin: LatLng = live ? fix!.position : center;

  useEffect(() => {
    resume();
  }, [resume]);

  const frame = useCallback((points: LatLng[], maxZoom?: number) => {
    nonce.current += 1;
    setCamera({ points, nonce: nonce.current, maxZoom });
  }, []);

  // Without a live fix, open on the whole atlas (or the chosen walk / place).
  const framed = useRef(false);
  useEffect(() => {
    if (framed.current || status === "idle" || status === "locating") return;
    if (live && following) return void (framed.current = true);
    framed.current = true;
    const sel = sites.find((s) => s.id === selectedId);
    const walkSites = walkId ? sites.filter((s) => s.stories.some((st) => st.workId === walkId)) : [];
    if (sel) frame([[sel.lat, sel.lng]], 16);
    else frame((walkSites.length ? walkSites : sites).map((s) => [s.lat, s.lng] as LatLng), 15);
  }, [status, live, following, sites, selectedId, walkId, frame]);

  const sync = (walk?: string, site?: string) => {
    const q = new URLSearchParams();
    if (walk) q.set("walk", walk);
    if (site) q.set("site", site);
    window.history.replaceState(null, "", `/${locale}/nearby${q.size ? `?${q}` : ""}`);
  };

  /* ——— What the list shows ——— */
  const ranked = useMemo(() => rankSites(sites, origin, filters), [sites, origin, filters]);
  const slice = useMemo(() => visibleSlice(ranked, pages), [ranked, pages]);

  const walkItems = useMemo(() => {
    if (!walkId) return [];
    return sites
      .flatMap((site) => site.stories.filter((s) => s.workId === walkId).map((story) => ({ site, story })))
      .sort((a, b) => a.story.order - b.story.order)
      .map((x) => ({ ...x, distance: siteDistance(origin, x.site) }));
  }, [sites, walkId, origin]);

  /* ——— What the map shows (always derived from the same lists) ——— */
  const { pins, lines } = useMemo(() => {
    if (walkId) {
      const pins: MapPin[] = walkItems.map(({ site, story }) => ({
        id: site.id, lat: site.lat, lng: site.lng, title: site.name, rank: story.order, visited: !!entries[site.id]?.checkedInAt,
      }));
      const lines: MapLine[] = [];
      walkItems.forEach(({ site, story }, i) => {
        if (story.path) lines.push({ id: `${story.id}-path`, siteId: site.id, points: story.path, kind: "route" });
        const prev = walkItems[i - 1];
        if (prev) lines.push({ id: `${story.id}-seq`, points: [[prev.site.lat, prev.site.lng], [site.lat, site.lng]], kind: story.jump ? "jump" : "sequence" });
      });
      return { pins, lines };
    }
    const rankOf = new Map(slice.items.map((r, i) => [r.site.id, i + 1]));
    const pins: MapPin[] = ranked.map(({ site }) => ({
      id: site.id, lat: site.lat, lng: site.lng, title: site.name, rank: rankOf.get(site.id), dim: !rankOf.has(site.id), visited: !!entries[site.id]?.checkedInAt,
    }));
    // A route is drawn only once its place is chosen: an unexplained line on the map just raises questions.
    const chosen = slice.items.find((r) => r.site.id === selectedId)?.site;
    const lines: MapLine[] = (chosen?.stories ?? [])
      .filter((s) => s.path)
      .map((s) => ({ id: s.id, siteId: chosen!.id, points: s.path!, kind: "route" as const }));
    return { pins, lines };
  }, [walkId, walkItems, ranked, slice, entries, selectedId]);

  /* ——— Interactions ——— */
  const selectFromList = (site: NearbySite) => {
    setSelectedId(site.id);
    sync(walkId, site.id);
    setFollowing(false);
    frame(live ? [fix!.position, [site.lat, site.lng]] : [[site.lat, site.lng]], 17);
  };
  const selectFromMap = (id: string) => {
    setSelectedId(id);
    sync(walkId, id);
    requestAnimationFrame(() =>
      listRef.current?.querySelector(`[data-site="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
    );
  };
  const chooseWalk = (id?: WorkId) => {
    setWalkId(id);
    setSelectedId(undefined);
    sync(id);
    listRef.current?.scrollTo({ top: 0 });
    if (id) {
      setFollowing(false);
      frame(sites.filter((s) => s.stories.some((st) => st.workId === id)).map((s) => [s.lat, s.lng] as LatLng), 16);
    }
  };
  const recentre = () => {
    if (status === "idle" || status === "denied" || status === "unavailable") start();
    setFollowing(true);
    setUserPanned(false);
  };

  const dist = (m: number) => formatDistance(m, dict.units);

  /* ——— Render ——— */
  const storyFor = (site: NearbySite): NearbyStory =>
    (walkId && site.stories.find((s) => s.workId === walkId)) ||
    site.stories.find((s) => filters.size === 0 || s.categories.some((c) => filters.has(c))) ||
    site.stories[0];

  const card = (site: NearbySite, distance: number, rank: number) => {
    const story = storyFor(site);
    const lead = LEAD.find((r) => story.relations.includes(r)) ?? story.relations[0];
    const works = [...new Set(site.stories.map((s) => s.workTitle))];
    const selected = site.id === selectedId;
    const href = `/${locale}/places/${site.id}${site.stories.length > 1 ? `?w=${story.workId}` : ""}`;
    return (
      <li key={site.id} data-site={site.id} className={`border-b hairline transition-colors ${selected ? "bg-paper-2" : ""}`}>
        <button onClick={() => selectFromList(site)} className="grid w-full grid-cols-[auto_1fr_64px] gap-x-4 px-4 pt-5 pb-4 text-left md:px-6">
          <span className={`pin-rank mt-0.5 ${selected ? "is-active" : ""} ${entries[site.id]?.checkedInAt ? "is-visited" : ""}`}>{rank}</span>
          <span className="min-w-0">
            <span className="label block truncate text-mute">
              {walkId ? story.beat : works.join(" · ")}
            </span>
            <span className="display mt-1 block text-[22px] leading-[1.05]">{site.name}</span>
            <span className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="label text-ink">
                {dist(distance)}
                {live && distance < 6000 && <span className="text-mute"> · {fmt(dict.units.minWalk, { n: walkingMinutes(distance) })}</span>}
              </span>
              {site.status && <span className="label text-[9px] text-accent">{site.status}</span>}
              {lead && (
                <span className={`label border px-1.5 py-0.5 text-[9px] ${UNCERTAIN.has(lead) ? "border-accent text-accent" : "border-ink/30 text-ink-2"}`}>
                  {dict.relation[lead][0]}
                </span>
              )}
            </span>
          </span>
          <span className="relative h-16 w-16 overflow-hidden bg-paper-2">
            {site.image && <Image src={site.image} alt="" fill sizes="64px" className="photo object-cover" />}
          </span>
          <span className="col-span-2 col-start-2 mt-3 text-[14px] leading-snug text-ink-2">{story.hook}</span>
        </button>
        {selected && (
          <div className="flex items-center justify-between gap-3 px-4 pb-4 md:px-6">
            <span className="label min-w-0 text-mute">{site.address}</span>
            <Link href={href} className="btn btn-solid h-9 shrink-0 whitespace-nowrap">
              {dict.nearby.readStory} →
            </Link>
          </div>
        )}
      </li>
    );
  };

  const statusLine = () => {
    if (status === "idle")
      return (
        <div className="flex items-center justify-between gap-4 border-b hairline bg-ink px-4 py-4 text-paper md:px-6">
          <p className="display text-[17px] leading-snug">{dict.nearby.prompt}</p>
          <button onClick={start} className="btn shrink-0 border-paper bg-paper text-ink hover:bg-transparent hover:text-paper">
            {dict.nearby.useLocation}
          </button>
        </div>
      );
    const msg =
      status === "locating" ? dict.nearby.locating
      : status === "far" ? fmt(dict.nearby.far, { km: Math.round(farKm ?? 0).toLocaleString(locale) })
      : status === "denied" ? dict.nearby.denied
      : status === "unavailable" ? dict.nearby.unavailable
      : status === "unsupported" ? dict.nearby.insecure
      : following ? `${dict.nearby.live} · ${fmt(dict.nearby.accuracy, { n: Math.round(fix?.accuracy ?? 0) })}`
      : userPanned ? dict.nearby.paused
      : `${dict.nearby.fromYou} · ${fmt(dict.nearby.accuracy, { n: Math.round(fix?.accuracy ?? 0) })}`;
    return (
      <p className={`label flex items-start gap-2 border-b hairline px-4 py-3 md:px-6 ${live ? "text-ink" : "text-mute"}`}>
        <span className={`mt-[3px] inline-block h-2 w-2 shrink-0 rounded-full ${live ? "bg-[#2563eb]" : status === "locating" ? "animate-pulse bg-mute" : "bg-line"}`} />
        <span className="normal-case tracking-normal text-[12px] leading-snug">{msg}</span>
      </p>
    );
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col md:flex-row-reverse">
      {/* ——— Map ——— */}
      <div className="relative h-[40dvh] shrink-0 md:h-auto md:flex-1">
        <MapView
          pins={pins}
          lines={lines}
          selectedId={selectedId}
          onSelect={selectFromMap}
          user={fix && (status === "live" || status === "far") ? { position: fix.position, accuracy: fix.accuracy } : undefined}
          following={following && live}
          onUserPan={() => {
            setFollowing(false);
            setUserPanned(true);
          }}
          onCenterChange={setCenter}
          camera={camera}
        />
        {/* Recentre / locate control — always in the same place, thumb-reachable */}
        {(!live || !following) && status !== "far" && status !== "unsupported" && (
          <button
            onClick={recentre}
            className="absolute bottom-4 left-4 z-[600] flex h-11 items-center gap-2 bg-paper px-4 shadow-[0_2px_10px_rgba(0,0,0,0.15)]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="8" cy="8" r="3" fill={live ? "#2563eb" : "none"} stroke={live ? "#2563eb" : "currentColor"} />
              <path d="M8 1v3M8 12v3M1 8h3M12 8h3" />
            </svg>
            <span className="label">{live ? dict.nearby.recenter : dict.nearby.useLocation}</span>
          </button>
        )}
        {!live && status !== "idle" && status !== "locating" && (
          // Without GPS, the map centre is the origin: mark it so the list makes sense.
          <span className="pointer-events-none absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 -translate-y-1/2 text-ink/60" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M11 0v8M11 14v8M0 11h8M14 11h8" /></svg>
          </span>
        )}
      </div>

      {/* ——— List ——— */}
      <div ref={listRef} className="no-scrollbar min-h-0 flex-1 overflow-y-auto border-t hairline bg-paper md:w-[440px] md:flex-none md:border-t-0 md:border-r">
        <div className="sticky top-0 z-10 bg-paper/95 backdrop-blur">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pt-4 pb-3 md:px-6">
            <button onClick={() => chooseWalk(undefined)} className={`label shrink-0 border px-3 py-2 ${!walkId ? "border-ink bg-ink text-paper" : "hairline"}`}>
              {dict.nearby.title}
            </button>
            {walks.map((w) => (
              <button key={w.id} onClick={() => chooseWalk(w.id)} className={`shrink-0 border px-3 py-1.5 text-left ${walkId === w.id ? "border-ink bg-ink text-paper" : "hairline"}`}>
                <span className="display text-[15px] italic">{w.title}</span>
              </button>
            ))}
          </div>
          {!walkId && (
            <div className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-3 md:px-6">
              {FILTERS.map((f) => {
                const on = filters.has(f);
                return (
                  <button
                    key={f}
                    onClick={() => {
                      const next = new Set(filters);
                      if (on) next.delete(f);
                      else next.add(f);
                      setFilters(next);
                      setPages(1);
                    }}
                    aria-pressed={on}
                    className={`label shrink-0 border px-2.5 py-1.5 text-[9.5px] ${on ? "border-ink bg-ink text-paper" : "hairline text-ink-2"}`}
                  >
                    {dict.category[f]}
                  </button>
                );
              })}
            </div>
          )}
          {statusLine()}
        </div>

        {walkId ? (
          <ol>
            {walkItems.map(({ site, story, distance }) => (
              <WalkConnector key={story.id} jump={story.jump} jumpLabel={dict.place.jump}>
                {card(site, distance, story.order)}
              </WalkConnector>
            ))}
            <li className="px-4 py-6 md:px-6">
              <Link href={`/${locale}/walks/${walkId}`} className="label link-underline">
                {dict.place.openWalk} →
              </Link>
            </li>
          </ol>
        ) : (
          <NearbyList
            slice={slice}
            renderCard={card}
            onMore={() => setPages((p) => p + 1)}
            labels={dict.nearby}
            artOnly={filters.size === 1 && filters.has("art")}
          />
        )}
      </div>
    </div>
  );
}

function WalkConnector({ jump, jumpLabel, children }: { jump?: string; jumpLabel: string; children: React.ReactNode }) {
  return (
    <>
      {jump && (
        <li className="flex gap-3 border-b hairline bg-accent/5 px-4 py-3 md:px-6">
          <span className="label shrink-0 text-accent">↯ {jumpLabel}</span>
          <span className="text-[13px] leading-snug text-ink-2">{jump}</span>
        </li>
      )}
      {children}
    </>
  );
}

function NearbyList({
  slice,
  renderCard,
  onMore,
  labels,
  artOnly,
}: {
  slice: ReturnType<typeof visibleSlice>;
  renderCard: (site: NearbySite, distance: number, rank: number) => React.ReactNode;
  onMore: () => void;
  labels: ReturnType<typeof useI18n>["dict"]["nearby"];
  artOnly: boolean;
}) {
  if (slice.items.length === 0) return <p className="px-4 py-10 text-mute md:px-6">{labels.empty}</p>;
  const firstFurther = slice.items.findIndex((r: Ranked) => r.distance > 2000);
  return (
    <>
      <p className="label px-4 pt-4 pb-1 text-mute md:px-6">{slice.noneWithin ? labels.noneWithin : labels.within}</p>
      {artOnly && <p className="px-4 pb-2 text-[13px] text-mute md:px-6">{labels.artThin}</p>}
      <ol>
        {slice.items.map((r, i) => (
          <FragmentWithDivider key={r.site.id} divider={!slice.noneWithin && i === firstFurther && i > 0} label={labels.further}>
            {renderCard(r.site, r.distance, i + 1)}
          </FragmentWithDivider>
        ))}
      </ol>
      {slice.hasMore && (
        <div className="px-4 py-6 pb-safe md:px-6">
          <button onClick={onMore} className="btn w-full">
            {labels.loadMore}
          </button>
        </div>
      )}
    </>
  );
}

function FragmentWithDivider({ divider, label, children }: { divider: boolean; label: string; children: React.ReactNode }) {
  return (
    <>
      {divider && <li className="label border-b hairline bg-paper-2 px-4 py-2 text-mute md:px-6">{label}</li>}
      {children}
    </>
  );
}
