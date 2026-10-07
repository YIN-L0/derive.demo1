import "server-only";
import { type Locale, tr } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { NearbySite } from "@/lib/nearby";
import { siteCategories, siteName, sites, storiesForSite, workById } from "./atlas";
import { artworkFor, photoFor } from "./media";

/** Build the compact, single-language index the Nearby screen ranks on the client. */
export function nearbyIndex(locale: Locale): NearbySite[] {
  const dict = getDictionary(locale);
  return sites.map((site) => ({
    id: site.id,
    name: siteName(site, locale),
    ...(site.status ? { status: dict.status[site.status] } : {}),
    address: site.address,
    lat: site.lat,
    lng: site.lng,
    precision: site.precision,
    categories: siteCategories(site.id),
    image: photoFor(site.id)?.src ?? artworkFor(site.id)?.src,
    stories: storiesForSite(site.id).map((s) => {
      const work = workById(s.workId)!;
      return {
        id: s.id,
        workId: s.workId,
        workTitle: work.title,
        medium: dict.medium[work.medium],
        order: s.order,
        beat: tr(s.beat, locale),
        hook: tr(s.hook, locale),
        relations: s.relations,
        categories: s.categories,
        ...(s.path ? { path: s.path } : {}),
        ...(s.jump ? { jump: tr(s.jump, locale) } : {}),
      };
    }),
  }));
}
