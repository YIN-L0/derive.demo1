import type { LatLng, Site } from "../types";
import type { Locale } from "@/i18n/config";

/**
 * Physical sites. Coordinates marked "atlas" come straight from the Spatial
 * Narrative Atlas; "editorial" ones were placed by us from OpenStreetMap
 * (Nominatim) because the atlas row had none. `precision` says how literally
 * the pin should be read — never manufacture precision the evidence lacks.
 */
export const sites: Site[] = [
  // ——— Before Sunset ———
  { id: "shakespeare-co-bucherie", name: "Shakespeare and Company", address: "37 rue de la Bûcherie", arrondissement: "5e", lat: 48.85259, lng: 2.34721, precision: "exact", coordSource: "atlas" },
  { id: "rue-saint-julien-le-pauvre", name: "Rue Saint-Julien-le-Pauvre", address: "Rue Saint-Julien-le-Pauvre", arrondissement: "5e", lat: 48.85231, lng: 2.34703, precision: "street", coordSource: "editorial" },
  { id: "rue-galande", name: "Rue Galande · Studio Galande", address: "around 56 rue Galande", arrondissement: "5e", lat: 48.85208, lng: 2.34661, precision: "street", coordSource: "atlas" },
  { id: "rue-des-jardins-saint-paul", name: "Rue des Jardins-Saint-Paul", address: "around 10 rue des Jardins-Saint-Paul", arrondissement: "4e", lat: 48.85308, lng: 2.36026, precision: "street", coordSource: "atlas" },
  { id: "rue-charlemagne", name: "Rue Charlemagne", address: "Rue Charlemagne", arrondissement: "4e", lat: 48.8542, lng: 2.3604, precision: "street", coordSource: "atlas" },
  { id: "rue-eginhard", name: "Rue Eginhard", address: "Rue Eginhard", arrondissement: "4e", lat: 48.85402, lng: 2.36178, precision: "street", coordSource: "editorial" },
  { id: "le-pure-cafe", name: "Le Pure Café", address: "14 rue Jean-Macé", arrondissement: "11e", lat: 48.85332, lng: 2.38317, precision: "exact", coordSource: "atlas" },
  { id: "coulee-verte", name: "Coulée verte René-Dumont", address: "Avenue Daumesnil section", arrondissement: "12e", lat: 48.84955, lng: 2.3728, precision: "zone", coordSource: "editorial" },
  { id: "quai-de-la-tournelle", name: "Quai de la Tournelle", address: "Quai de la Tournelle", arrondissement: "5e", lat: 48.85112, lng: 2.35242, precision: "street", coordSource: "atlas" },
  { id: "quai-henri-iv", name: "Quai Henri IV", address: "Quai Henri IV", arrondissement: "4e", lat: 48.84884, lng: 2.36194, precision: "street", coordSource: "atlas" },
  { id: "cour-etoile-dor", name: "Cour de l'Étoile d'Or", address: "off rue du Faubourg Saint-Antoine", arrondissement: "11e", lat: 48.85221, lng: 2.37494, precision: "zone", coordSource: "editorial" },

  // ——— The Sun Also Rises ———
  { id: "cafe-napolitain", name: "Café Napolitain", status: "gone", address: "1 boulevard des Capucines", arrondissement: "2e", lat: 48.87076, lng: 2.33391, precision: "exact", coordSource: "editorial" },
  { id: "bal-musette", name: "Bal musette", localName: { en: "The bal musette", zh: "那间舞厅（bal musette）", fr: "Le bal musette" }, status: "probable", address: "Rue de la Montagne-Sainte-Geneviève (door unknown)", arrondissement: "5e", lat: 48.8472, lng: 2.34855, precision: "street", coordSource: "editorial" },
  { id: "contrescarpe", name: "Place de la Contrescarpe", address: "Place de la Contrescarpe", arrondissement: "5e", lat: 48.84437, lng: 2.3495, precision: "exact", coordSource: "editorial" },
  { id: "hotel-de-crillon", name: "Hôtel de Crillon", address: "10 place de la Concorde", arrondissement: "8e", lat: 48.86762, lng: 2.32137, precision: "exact", coordSource: "editorial" },
  { id: "la-rotonde", name: "La Rotonde", address: "105 boulevard du Montparnasse", arrondissement: "6e", lat: 48.84236, lng: 2.32921, precision: "exact", coordSource: "editorial" },
  { id: "le-select", name: "Le Select", address: "99 boulevard du Montparnasse", arrondissement: "6e", lat: 48.84262, lng: 2.32839, precision: "exact", coordSource: "editorial" },
  { id: "le-dome", name: "Le Dôme", address: "108 boulevard du Montparnasse", arrondissement: "14e", lat: 48.84206, lng: 2.32883, precision: "exact", coordSource: "editorial" },
  { id: "dingo-bar", name: "Dingo Bar", status: "former", address: "10 rue Delambre", arrondissement: "14e", lat: 48.841792, lng: 2.328385, precision: "exact", coordSource: "atlas" },
  { id: "closerie-des-lilas", name: "La Closerie des Lilas", address: "171 boulevard du Montparnasse", arrondissement: "6e", lat: 48.84009, lng: 2.33597, precision: "exact", coordSource: "editorial" },
  { id: "madame-lecomte", name: "Madame Lecomte's", status: "probable", address: "probably 33 quai d'Anjou", arrondissement: "4e", lat: 48.85225, lng: 2.3575, precision: "exact", coordSource: "editorial" },
  { id: "night-walk-ch8", name: "Chapter 8 night walk", localName: { en: "The Chapter 8 night walk", zh: "第 8 章的夜行", fr: "La marche nocturne du chapitre 8" }, address: "Île Saint-Louis → Contrescarpe → Port-Royal → Montparnasse", arrondissement: "4e–6e", lat: 48.85061, lng: 2.35544, precision: "route", coordSource: "editorial" },

  // ——— A Moveable Feast ———
  { id: "cardinal-lemoine-74", name: "74 rue du Cardinal Lemoine", address: "74 rue du Cardinal Lemoine", arrondissement: "5e", lat: 48.84485, lng: 2.3496, precision: "exact", coordSource: "editorial" },
  { id: "rue-descartes", name: "Rue Descartes", localName: { en: "The rue Descartes writing room", zh: "Rue Descartes 的写作间", fr: "La chambre d'écriture de la rue Descartes" }, status: "probable", address: "Rue Descartes (room not public)", arrondissement: "5e", lat: 48.846, lng: 2.3489, precision: "zone", coordSource: "editorial" },
  { id: "shakespeare-co-odeon", name: "Shakespeare and Company (1921–41)", localName: { en: "Sylvia Beach's Shakespeare and Company", zh: "Sylvia Beach 的莎士比亚书店（旧址）", fr: "Le Shakespeare and Company de Sylvia Beach" }, status: "gone", address: "12 rue de l'Odéon", arrondissement: "6e", lat: 48.85092, lng: 2.33861, precision: "exact", coordSource: "editorial" },
  { id: "rue-de-fleurus-27", name: "27 rue de Fleurus", address: "27 rue de Fleurus", arrondissement: "6e", lat: 48.846986, lng: 2.329251, precision: "exact", coordSource: "atlas" },
  { id: "michauds", name: "Michaud's", status: "former", address: "corner of rue Jacob and rue des Saints-Pères", arrondissement: "6e", lat: 48.8556, lng: 2.3314, precision: "street", coordSource: "editorial" },
  { id: "notre-dame-des-champs-113", name: "113 rue Notre-Dame-des-Champs", address: "113 rue Notre-Dame-des-Champs", arrondissement: "6e", lat: 48.84087, lng: 2.33427, precision: "exact", coordSource: "editorial" },
  { id: "ritz-bar-hemingway", name: "Ritz Paris · Bar Hemingway", address: "15 place Vendôme", arrondissement: "1er", lat: 48.86795, lng: 2.3289, precision: "exact", coordSource: "editorial" },
];

/**
 * Walked lines for route stories, traced from the street names in the text.
 * These are sketches along named streets, not GPS traces.
 */
export const paths: Record<string, LatLng[]> = {
  // Ch. 4: the taxi passes the Contrescarpe and descends rue Mouffetard.
  "sar-taxi": [
    [48.84437, 2.3495],
    [48.8431, 2.34965],
    [48.84195, 2.34975],
    [48.8408, 2.35005],
    [48.83993, 2.3505],
  ],
  // Ch. 8: off the island, up through the Contrescarpe, along rue du Pot de Fer,
  // south on rue Saint-Jacques past Val-de-Grâce, to Port-Royal and Montparnasse.
  "sar-night-walk": [
    [48.85225, 2.3575],
    [48.85061, 2.35544],
    [48.8494, 2.3528],
    [48.84485, 2.3496],
    [48.84437, 2.3495],
    [48.8429, 2.3478],
    [48.8427, 2.3463],
    [48.842, 2.3436],
    [48.8406, 2.3421],
    [48.8393, 2.3392],
    [48.84009, 2.33597],
    [48.84262, 2.32839],
  ],
};

/** The name to show in a given language. */
export const siteName = (site: Pick<Site, "name" | "localName">, locale: Locale) => site.localName?.[locale] || site.localName?.en || site.name;
