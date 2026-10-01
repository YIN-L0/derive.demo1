export type Category = "film" | "literature" | "art" | "artist-life" | "partner";

export type Work = {
  title: string;
  creator?: string;
  year?: string;
  type: string;
};

export type Place = {
  id: string;
  title: string;
  address: string;
  arrondissement: string;
  lat: number;
  lng: number;
  city: string;
  category: Category;
  works: Work[];
  /** What happens here — the scene, in one or two original sentences. */
  context: string;
  /** Why it matters to the story or the life. */
  storyImpact: string;
  sourceLabel?: string;
  routeIds: string[];
  tags: string[];
};

export type RouteStop = {
  placeId: string;
  order: number;
  narrativeBeat: string;
};

export type Route = {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  city: string;
  description: string;
  work: Work;
  themeTags: string[];
  estimatedMinutes: number;
  distanceKm: number;
  stops: RouteStop[];
};
