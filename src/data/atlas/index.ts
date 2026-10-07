import type { Text } from "@/i18n/config";
import type { Category, Confidence, Relation, Site, Story, WorkId } from "../types";
import atlas from "./atlas.json";
import { editorial } from "./editorial";
import { french } from "./fr";
import { paths, siteName, sites } from "./sites";
import { works, workById } from "./works";

type Bilingual = { en: string; zh: string };
type AtlasStory = {
  id: string;
  siteId: string;
  workId: string;
  order: number;
  place: string;
  relations: string[];
  confidence: string;
  sourceTier: string;
  anchor: string;
  sources: string[];
  text: Record<string, Bilingual>;
};

const WORK_MEDIUM: Record<WorkId, "film" | "novel" | "memoir"> = Object.fromEntries(
  works.map((w) => [w.id, w.medium]),
) as Record<WorkId, "film" | "novel" | "memoir">;

/** Filter categories follow from the kind of link, not from a single hand-picked label. */
function categoriesFor(workId: WorkId, relations: Relation[], extra: Category[] = []): Category[] {
  const out = new Set<Category>(extra);
  if (WORK_MEDIUM[workId] === "film") out.add("film");
  else if (relations.some((r) => ["named-in-work", "inferred", "route", "recalled-in-memoir"].includes(r))) out.add("literature");
  if (relations.some((r) => ["lived-or-worked", "written-here", "inspiration"].includes(r))) out.add("artist");
  return [...out];
}

function build(raw: AtlasStory): Story {
  const ed = editorial[raw.id];
  if (!ed) throw new Error(`No editorial entry for story ${raw.id}`);
  const fr = french[raw.id] ?? {};
  const t = (key: string, frKey: keyof typeof fr = key as keyof typeof fr): Text => {
    const cell = raw.text[key] ?? { en: "", zh: "" };
    const zhFill = ed.zh?.[key as "when" | "mention" | "people"];
    return { en: cell.en, zh: cell.zh || zhFill || "", fr: fr[frKey] ?? "" };
  };
  const workId = raw.workId as WorkId;
  const relations = raw.relations as Relation[];

  return {
    id: raw.id,
    siteId: raw.siteId,
    workId,
    order: raw.order,
    placeLabel: raw.place,
    relations,
    categories: categoriesFor(workId, relations, ed.extraCategories),
    hook: ed.hook,
    beat: t("routeNode", "beat"),
    happened: t("happened"),
    consequence: t("consequence"),
    when: t("when"),
    people: t("people"),
    anchor: raw.anchor,
    thenNow: t("thenNow"),
    practical: t("practical"),
    biography: t("biography"),
    why: t("why"),
    spatialFunction: t("spatialFunction"),
    inspiration: t("inspiration"),
    related: t("related"),
    evidence: {
      relationText: { ...t("relationship"), fr: "" },
      mention: t("mention"),
      chain: t("evidenceChain", "chain"),
      tier: raw.sourceTier,
      confidence: raw.confidence as Confidence,
      sources: raw.sources,
    },
    uncertainty: ed.uncertainty,
    jump: ed.jump,
    path: paths[raw.id],
  };
}

export const stories: Story[] = (atlas.stories as AtlasStory[]).map(build);
export { siteName, sites, works, workById };

const siteIndex = new Map(sites.map((s) => [s.id, s]));
export const siteById = (id: string): Site | undefined => siteIndex.get(id);
export const storyById = (id: string) => stories.find((s) => s.id === id);
export const storiesForSite = (siteId: string) => stories.filter((s) => s.siteId === siteId);
export const storiesForWork = (workId: string) =>
  stories.filter((s) => s.workId === workId).sort((a, b) => a.order - b.order);

/** Categories of a site = union of its stories' categories. */
export const siteCategories = (siteId: string): Category[] => [
  ...new Set(storiesForSite(siteId).flatMap((s) => s.categories)),
];

/** Previous / next story in the same work. The order is the story's, not the map's. */
export function neighbours(story: Story) {
  const seq = storiesForWork(story.workId);
  const i = seq.findIndex((s) => s.id === story.id);
  return { previous: seq[i - 1], next: seq[i + 1], index: i, total: seq.length };
}

export const ontology = atlas.ontology as Record<string, Bilingual>[];
export const sourceRegistry = atlas.sourceRegistry as Record<string, Bilingual>[];

// Fail the build loudly if the atlas and the site table drift apart.
for (const s of stories) {
  if (!siteIndex.has(s.siteId)) throw new Error(`Story ${s.id} points at unknown site ${s.siteId}`);
}
