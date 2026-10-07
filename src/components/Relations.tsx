import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import type { Confidence, Relation } from "@/data/types";

/** Which relation best summarises a story on a small card. Order = what a walker most wants to know. */
const PRIORITY: Relation[] = [
  "inferred",
  "constructed-continuity",
  "stand-in",
  "route",
  "filming-location",
  "named-in-work",
  "written-here",
  "lived-or-worked",
  "recalled-in-memoir",
  "inspiration",
  "narrative-setting",
];

export const leadRelation = (relations: Relation[]) => PRIORITY.find((r) => relations.includes(r)) ?? relations[0];

const UNCERTAIN = new Set<Relation>(["inferred", "constructed-continuity", "stand-in"]);

/** Every relation a story has, each with its plain-language meaning. Never merged into one "location" label. */
export function RelationList({ relations, locale }: { relations: Relation[]; locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <ul className="flex flex-col gap-2">
      {relations.map((r) => {
        const [label, meaning] = dict.relation[r];
        return (
          <li key={r} className="flex gap-3">
            <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 ${UNCERTAIN.has(r) ? "rounded-full border border-accent" : "rounded-full bg-ink"}`} />
            <span>
              <span className="label">{label}</span>
              <span className="block text-[13px] text-mute">{meaning}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function RelationChip({ relation, locale }: { relation: Relation; locale: Locale }) {
  const dict = getDictionary(locale);
  const uncertain = UNCERTAIN.has(relation);
  return (
    <span
      className={`label inline-block border px-1.5 py-0.5 text-[9px] ${uncertain ? "border-accent text-accent" : "border-ink/40 text-ink-2"}`}
    >
      {dict.relation[relation][0]}
    </span>
  );
}

const LEVEL: Record<Confidence, number> = { "very-high": 5, high: 4, "medium-high": 3, medium: 2, low: 1 };

export function ConfidenceMeter({ value, locale }: { value: Confidence; locale: Locale }) {
  const dict = getDictionary(locale);
  const n = LEVEL[value] ?? 0;
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex gap-0.5" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-2 w-3 ${i <= n ? (n <= 3 ? "bg-accent" : "bg-ink") : "bg-line"}`} />
        ))}
      </span>
      <span className="label">{dict.confidence[value]}</span>
    </span>
  );
}
