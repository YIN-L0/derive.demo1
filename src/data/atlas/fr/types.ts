/** French translations of the atlas text fields. Missing keys fall back to English in the UI. */
export type FrenchStory = Partial<
  Record<
    | "beat"
    | "when"
    | "people"
    | "mention"
    | "happened"
    | "consequence"
    | "spatialFunction"
    | "why"
    | "thenNow"
    | "practical"
    | "biography"
    | "inspiration"
    | "related"
    | "chain",
    string
  >
>;
