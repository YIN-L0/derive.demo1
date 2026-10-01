import type { Route } from "./types";

export const routes: Route[] = [
  {
    id: "before-sunset",
    index: "01",
    title: "Before Sunset",
    subtitle: "Eighty minutes, one afternoon",
    city: "Paris",
    description:
      "Nine years after one night in Vienna, Jesse and Céline meet again in a Left Bank bookshop, with only the time before his flight. Linklater shot the film on location, in long unbroken walking takes. This route follows them in order — from the shop, across the river, to a courtyard in the Faubourg Saint-Antoine.",
    work: { title: "Before Sunset", creator: "Richard Linklater", year: "2004", type: "Film" },
    themeTags: ["Film", "Romance", "Real time", "Left Bank → Bastille"],
    estimatedMinutes: 150,
    distanceKm: 8.4,
    stops: [
      { placeId: "bs-shakespeare", order: 1, narrativeBeat: "Recognition" },
      { placeId: "bs-saint-julien", order: 2, narrativeBeat: "The first steps" },
      { placeId: "bs-jardins-saint-paul", order: 3, narrativeBeat: "Who she became" },
      { placeId: "bs-pure-cafe", order: 4, narrativeBeat: "Sitting still" },
      { placeId: "bs-coulee-verte", order: 5, narrativeBeat: "Above the city" },
      { placeId: "bs-tournelle", order: 6, narrativeBeat: "On the water" },
      { placeId: "bs-henri-iv", order: 7, narrativeBeat: "The car" },
      { placeId: "bs-etoile-dor", order: 8, narrativeBeat: "The waltz" },
    ],
  },
  {
    id: "moveable-feast",
    index: "02",
    title: "A Moveable Feast",
    subtitle: "Hemingway, very poor and very happy",
    city: "Paris",
    description:
      "Paris in the early 1920s, as Hemingway remembered it forty years later: cold rooms, good cafés, borrowed books and the paintings he looked at on an empty stomach. A walk from the Contrescarpe to Montparnasse through the addresses where he learned to write.",
    work: { title: "A Moveable Feast", creator: "Ernest Hemingway", year: "1964", type: "Memoir" },
    themeTags: ["Artist life", "Memoir", "Latin Quarter → Montparnasse"],
    estimatedMinutes: 90,
    distanceKm: 3.8,
    stops: [
      { placeId: "mf-contrescarpe", order: 1, narrativeBeat: "Cold rain, the square" },
      { placeId: "mf-cardinal-lemoine", order: 2, narrativeBeat: "Home, above the dance hall" },
      { placeId: "mf-descartes", order: 3, narrativeBeat: "One true sentence" },
      { placeId: "mf-saint-michel", order: 4, narrativeBeat: "A good café" },
      { placeId: "mf-odeon", order: 5, narrativeBeat: "Books on trust" },
      { placeId: "mf-luxembourg", order: 6, narrativeBeat: "Hunger and Cézanne" },
      { placeId: "mf-fleurus", order: 7, narrativeBeat: "A lost generation" },
      { placeId: "mf-notre-dame-des-champs", order: 8, narrativeBeat: "The sawmill" },
      { placeId: "mf-closerie", order: 9, narrativeBeat: "Where the novel was written" },
    ],
  },
  {
    id: "sun-also-rises",
    index: "03",
    title: "The Sun Also Rises",
    subtitle: "Jake, Brett and the Paris chapters",
    city: "Paris",
    description:
      "Hemingway's first novel, written in the cafés of Montparnasse and set in them. Jake Barnes, Lady Brett Ashley and their circle move between dance halls, bars and hotel lobbies before leaving for Pamplona. The stops follow the novel's Paris chapters in order.",
    work: { title: "The Sun Also Rises", creator: "Ernest Hemingway", year: "1926", type: "Novel" },
    themeTags: ["Fiction", "Lost Generation", "Best by bike"],
    estimatedMinutes: 180,
    distanceKm: 9.6,
    stops: [
      { placeId: "sr-negre-toulouse", order: 1, narrativeBeat: "Dinner at Lavigne's" },
      { placeId: "sr-bal-musette", order: 2, narrativeBeat: "Brett walks in" },
      { placeId: "sr-select", order: 3, narrativeBeat: "After the taxi" },
      { placeId: "sr-dingo", order: 4, narrativeBeat: "The Montparnasse circuit" },
      { placeId: "sr-crillon", order: 5, narrativeBeat: "She does not come" },
      { placeId: "mf-closerie", order: 6, narrativeBeat: "Back to the Lilas" },
      { placeId: "sr-lecomte", order: 7, narrativeBeat: "Dinner on the island" },
      { placeId: "mf-contrescarpe", order: 8, narrativeBeat: "The night walk ends" },
    ],
  },
];

export const routeById = (id: string) => routes.find((r) => r.id === id);

export const formatMinutes = (m: number) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h ? `${h}h${min ? String(min).padStart(2, "0") : ""}` : `${min} min`;
};
