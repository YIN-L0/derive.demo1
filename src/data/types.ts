import type { Text } from "@/i18n/config";

/* ───────────────────────────────────────────────────────────────────────────
   Dérive's model keeps three things apart:

   Site   — a physical place in Paris you can walk to (one pin on the map).
   Work   — a film, novel or memoir.
   Story  — one work's relationship to one site: what happens there, how the
            work refers to it, and how sure we are. A site can carry several
            stories (La Closerie des Lilas is both a café named in The Sun Also
            Rises and the room where Hemingway wrote it).

   Story fields are labelled by epistemic kind so the UI can present them
   differently: FACT (source-grounded), EVIDENCE (how we know), and
   READING (editorial interpretation).
   ─────────────────────────────────────────────────────────────────────────── */

export type WorkId = "before-sunset" | "sun-also-rises" | "moveable-feast"
  | "of-human-bondage" | "razors-edge" | "good-morning-midnight"
  | "tropic-of-cancer" | "education-sentimentale";
export type Medium = "film" | "novel" | "memoir";
export type Category = "film" | "literature" | "art" | "artist";

/**
 * How a story relates to its site. A story can have several.
 * These must never be collapsed into a generic "location".
 */
export type Relation =
  | "filming-location" // the camera physically stood here
  | "narrative-setting" // the film's story takes place here
  | "constructed-continuity" // the edit joins non-adjacent streets
  | "stand-in" // a real place filmed to play a fictional one
  | "named-in-work" // the text names this real place
  | "inferred" // identification proposed from clues / historical evidence
  | "lived-or-worked" // the author actually lived, worked or spent documented time here
  | "written-here" // composition place
  | "inspiration" // a documented real event/place that fed the work
  | "recalled-in-memoir" // remembered decades later, reconstructed
  | "route"; // a sequence of streets rather than a point

export type Confidence = "very-high" | "high" | "medium-high" | "medium" | "low";

/** How precisely the map position represents the place. */
export type Precision = "exact" | "street" | "zone" | "route";

export type LatLng = [number, number];

export type Site = {
  id: string;
  /** Proper name, used in every language. */
  name: string;
  /** For descriptive names ("The Chapter 8 night walk") that need translating. */
  localName?: Partial<Text>;
  /** What survives today: "gone" = demolished/closed, "former" = another business now, "probable" = identification not certain. */
  status?: "gone" | "former" | "probable";
  address: string;
  arrondissement: string;
  lat: number;
  lng: number;
  precision: Precision;
  /** "atlas" = coordinates supplied by the research dataset; "editorial" = placed by us. */
  coordSource: "atlas" | "editorial";
};

export type Work = {
  id: WorkId;
  index: string;
  title: string;
  creator: string;
  year: string;
  medium: Medium;
  subtitle: Text;
  description: Text;
};

export type Story = {
  id: string;
  siteId: string;
  workId: WorkId;
  /** Position in the work's story sequence (1-based). */
  order: number;
  /** The atlas's own name for the place in this work, e.g. "Madame Lecomte's / probable Au Rendez-vous des Mariniers". */
  placeLabel: string;
  relations: Relation[];
  categories: Category[];

  /** READING — one sentence written to make someone want to walk there. */
  hook: Text;
  /** Title of this story beat, e.g. "First impossible geographic jump". */
  beat: Text;

  // FACT — source-grounded
  happened: Text;
  consequence: Text;
  when: Text;
  people: Text;
  /** Short quotation or paraphrase in the work's own language; never translated. */
  anchor: string;
  thenNow: Text;
  practical: Text;
  biography: Text;

  // READING — interpretation, kept visibly separate
  why: Text;
  spatialFunction: Text;
  inspiration: Text;
  related: Text;

  // EVIDENCE
  evidence: {
    relationText: Text;
    mention: Text;
    chain: Text;
    tier: string;
    confidence: Confidence;
    sources: string[];
  };
  /** Shown prominently when the identification or position is not certain. */
  uncertainty?: Text;
  /** Set on a story whose arrival from the previous beat is impossible on foot. */
  jump?: Text;
  /** For route stories: the walked line, in order. */
  path?: LatLng[];
};
