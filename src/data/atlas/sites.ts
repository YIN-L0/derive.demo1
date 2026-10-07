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
  // ——— Independently reviewed literary additions (see research/review/web-integration.json) ———
  {"id": "boulevard-du-montparnasse", "name": "boulevard du Montparnasse", "address": "boulevard du Montparnasse", "arrondissement": "6e–14e–15e", "lat": 48.84278, "lng": 2.32722, "precision": "street", "coordSource": "atlas"},
  {"id": "avenue-de-l-observatoire", "name": "avenue de l'Observatoire", "address": "avenue de l'Observatoire", "arrondissement": "5e–6e–14e", "lat": 48.8402906, "lng": 2.3367436, "precision": "street", "coordSource": "atlas"},
  {"id": "jardin-du-luxembourg", "name": "jardin du Luxembourg", "address": "jardin du Luxembourg", "arrondissement": "6e", "lat": 48.846944444, "lng": 2.337222222, "precision": "zone", "coordSource": "atlas"},
  {"id": "bal-bullier", "name": "Bal Bullier", "address": "Bal Bullier", "arrondissement": "Paris", "lat": 48.84027778, "lng": 2.33763889, "precision": "exact", "coordSource": "atlas", "status": "gone"},
  {"id": "rue-campagne-premiere", "name": "rue Campagne-Première", "address": "rue Campagne-Première", "arrondissement": "14e", "lat": 48.8399, "lng": 2.33281, "precision": "street", "coordSource": "atlas"},
  {"id": "boulevard-raspail", "name": "boulevard Raspail", "address": "boulevard Raspail", "arrondissement": "6e–7e–14e", "lat": 48.845824, "lng": 2.328597, "precision": "street", "coordSource": "atlas"},
  {"id": "lion-de-belfort-paris", "name": "Lion de Belfort (place Denfert-Rochereau)", "address": "Lion de Belfort (place Denfert-Rochereau)", "arrondissement": "14e", "lat": 48.8344, "lng": 2.33245, "precision": "exact", "coordSource": "atlas"},
  {"id": "musee-du-louvre", "name": "Musée du Louvre", "address": "Musée du Louvre", "arrondissement": "Paris", "lat": 48.861111111, "lng": 2.335833333, "precision": "zone", "coordSource": "atlas"},
  {"id": "theatre-de-l-odeon", "name": "théâtre de l'Odéon", "address": "2 rue Corneille", "arrondissement": "6e", "lat": 48.8495, "lng": 2.33875, "precision": "exact", "coordSource": "atlas"},
  {"id": "opera-comique", "name": "théâtre national de l'Opéra-Comique", "address": "1 Place Boieldieu, 75002 Paris, France", "arrondissement": "Paris", "lat": 48.870861111, "lng": 2.337511111, "precision": "exact", "coordSource": "atlas"},
  {"id": "gaite-montparnasse", "name": "théâtre de la Gaîté-Montparnasse", "address": "théâtre de la Gaîté-Montparnasse", "arrondissement": "14e", "lat": 48.8393, "lng": 2.32306, "precision": "exact", "coordSource": "atlas"},
  {"id": "quai-des-grands-augustins", "name": "quai des Grands-Augustins", "address": "quai des Grands-Augustins", "arrondissement": "6e", "lat": 48.8548, "lng": 2.34218, "precision": "street", "coordSource": "atlas"},
  {"id": "hotel-drouot", "name": "Hôtel Drouot", "address": "9, rue Drouot 75009 Paris", "arrondissement": "9e", "lat": 48.87277778, "lng": 2.34055556, "precision": "exact", "coordSource": "atlas"},
  {"id": "musee-de-cluny", "name": "musée de Cluny", "address": "musée de Cluny", "arrondissement": "5e", "lat": 48.850555555, "lng": 2.343333333, "precision": "zone", "coordSource": "atlas"},
  {"id": "boulevard-saint-michel", "name": "boulevard Saint-Michel", "address": "boulevard Saint-Michel", "arrondissement": "Paris", "lat": 48.846686, "lng": 2.340428, "precision": "street", "coordSource": "atlas"},
  {"id": "moulin-rouge", "name": "Moulin-Rouge", "address": "Moulin-Rouge", "arrondissement": "18e", "lat": 48.884167, "lng": 2.332222, "precision": "exact", "coordSource": "atlas"},
  {"id": "folies-bergere", "name": "Folies Bergère", "address": "Folies Bergère", "arrondissement": "9e", "lat": 48.87416667, "lng": 2.345, "precision": "exact", "coordSource": "atlas"},
  {"id": "place-de-la-concorde", "name": "place de la Concorde", "address": "place de la Concorde", "arrondissement": "Paris", "lat": 48.8656331, "lng": 2.3212357, "precision": "zone", "coordSource": "atlas"},
  {"id": "quartier-latin", "name": "quartier latin", "address": "quartier latin", "arrondissement": "Paris", "lat": 48.85, "lng": 2.3425, "precision": "zone", "coordSource": "atlas"},
  {"id": "rue-saint-guillaume", "name": "rue Saint-Guillaume", "address": "rue Saint-Guillaume", "arrondissement": "7e", "lat": 48.8543408, "lng": 2.3285545, "precision": "street", "coordSource": "atlas"},
  {"id": "pont-saint-michel", "name": "pont Saint-Michel", "address": "pont Saint-Michel", "arrondissement": "4e–6e", "lat": 48.854167, "lng": 2.344722, "precision": "exact", "coordSource": "atlas"},
  {"id": "gare-du-nord", "name": "Paris-Nord", "address": "Paris-Nord", "arrondissement": "Paris", "lat": 48.881111111, "lng": 2.355277777, "precision": "exact", "coordSource": "atlas"},
  {"id": "maxims", "name": "Maxim's", "address": "Maxim's", "arrondissement": "8e", "lat": 48.867305555, "lng": 2.322222222, "precision": "exact", "coordSource": "atlas"},
  {"id": "rue-de-lappe", "name": "rue de Lappe", "address": "rue de Lappe", "arrondissement": "11e", "lat": 48.8536, "lng": 2.37297, "precision": "street", "coordSource": "atlas"},
  {"id": "place-des-vosges", "name": "place des Vosges", "address": "place des Vosges", "arrondissement": "3e–4e", "lat": 48.855555555, "lng": 2.365555555, "precision": "zone", "coordSource": "atlas"},
  {"id": "gare-saint-lazare", "name": "Paris-Saint-Lazare", "address": "13 Rue d'Amsterdam", "arrondissement": "8e", "lat": 48.876944444, "lng": 2.324444444, "precision": "exact", "coordSource": "atlas"},
  {"id": "jardin-des-tuileries", "name": "jardin des Tuileries", "address": "jardin des Tuileries", "arrondissement": "1er", "lat": 48.863888888, "lng": 2.326111111, "precision": "zone", "coordSource": "atlas"},
  {"id": "place-saint-sulpice", "name": "place Saint-Sulpice", "address": "place Saint-Sulpice", "arrondissement": "6e", "lat": 48.850833333, "lng": 2.333333333, "precision": "zone", "coordSource": "atlas"},
  {"id": "rue-bonaparte", "name": "rue Bonaparte", "address": "rue Bonaparte", "arrondissement": "Paris", "lat": 48.85305556, "lng": 2.33305556, "precision": "street", "coordSource": "atlas"},
  {"id": "rue-du-chateau", "name": "rue du Château", "address": "rue du Château", "arrondissement": "14e", "lat": 48.8336, "lng": 2.32333, "precision": "street", "coordSource": "atlas"},
  {"id": "quai-saint-bernard", "name": "quai Saint-Bernard", "address": "quai Saint-Bernard", "arrondissement": "5e", "lat": 48.8471, "lng": 2.36048, "precision": "street", "coordSource": "atlas"},
  {"id": "boulevard-montmartre", "name": "boulevard Montmartre", "address": "boulevard Montmartre", "arrondissement": "2e–9e", "lat": 48.871667, "lng": 2.341389, "precision": "street", "coordSource": "atlas"},
  {"id": "rue-de-choiseul", "name": "rue de Choiseul", "address": "rue de Choiseul", "arrondissement": "2e", "lat": 48.8706, "lng": 2.33597, "precision": "street", "coordSource": "atlas"},
  {"id": "quai-aux-fleurs", "name": "quai aux Fleurs", "address": "quai aux Fleurs", "arrondissement": "4e", "lat": 48.8542, "lng": 2.35161, "precision": "street", "coordSource": "atlas"},
  {"id": "rue-victor-masse", "name": "rue Victor-Massé", "address": "rue Victor-Massé", "arrondissement": "9e", "lat": 48.8807, "lng": 2.33884, "precision": "street", "coordSource": "atlas"},
  {"id": "rue-d-anjou", "name": "rue d'Anjou", "address": "rue d'Anjou", "arrondissement": "8e", "lat": 48.8726, "lng": 2.32213, "precision": "street", "coordSource": "atlas"},
  {"id": "rue-de-paradis", "name": "rue de Paradis", "address": "rue de Paradis", "arrondissement": "Paris", "lat": 48.87519, "lng": 2.35147, "precision": "street", "coordSource": "atlas"},
  {"id": "rue-tronchet", "name": "rue Tronchet", "address": "rue Tronchet", "arrondissement": "8e–9e", "lat": 48.8722, "lng": 2.32606, "precision": "street", "coordSource": "atlas"},
  {"id": "rue-de-fleurus", "name": "rue de Fleurus", "address": "rue de Fleurus", "arrondissement": "6e", "lat": 48.847, "lng": 2.32925, "precision": "street", "coordSource": "atlas"},
  {"id": "cafe-anglais", "name": "café Anglais", "address": "café Anglais", "arrondissement": "2e", "lat": 48.87127222, "lng": 2.33744722, "precision": "exact", "coordSource": "atlas", "status": "gone"},
  {"id": "cafe-tortoni-paris", "name": "café Tortoni de Paris", "address": "café Tortoni de Paris", "arrondissement": "9e", "lat": 48.87162, "lng": 2.336917, "precision": "exact", "coordSource": "atlas", "status": "gone"},
  {"id": "champ-de-mars", "name": "Champ-de-Mars", "address": "Champ-de-Mars", "arrondissement": "7e", "lat": 48.85613, "lng": 2.29803, "precision": "zone", "coordSource": "atlas"},
  {"id": "rue-coq-heron", "name": "rue Coq-Héron", "address": "rue Coq-Héron", "arrondissement": "1er", "lat": 48.8642, "lng": 2.34201, "precision": "street", "coordSource": "atlas"},
  {"id": "place-du-pantheon", "name": "place du Panthéon", "address": "place du Panthéon", "arrondissement": "5e", "lat": 48.846446, "lng": 2.345077, "precision": "zone", "coordSource": "atlas"},
  {"id": "palais-royal", "name": "Palais-Royal", "address": "Palais-Royal", "arrondissement": "Paris", "lat": 48.863333333, "lng": 2.336944444, "precision": "exact", "coordSource": "atlas"},
  {"id": "boulevard-des-capucines", "name": "boulevard des Capucines", "address": "boulevard des Capucines", "arrondissement": "2e–9e", "lat": 48.870445, "lng": 2.331049, "precision": "street", "coordSource": "atlas"},
  {"id": "cimetiere-du-pere-lachaise", "name": "cimetière du Père-Lachaise", "address": "16, rue du Repos 75020 Paris", "arrondissement": "20e", "lat": 48.861111111, "lng": 2.394166666, "precision": "zone", "coordSource": "atlas"},
  {"id": "quai-de-montebello", "name": "quai de Montebello", "address": "quai de Montebello", "arrondissement": "5e", "lat": 48.8518, "lng": 2.34937, "precision": "street", "coordSource": "atlas"},
  {"id": "pont-neuf", "name": "pont Neuf", "address": "pont Neuf", "arrondissement": "6e", "lat": 48.8575, "lng": 2.341666666, "precision": "exact", "coordSource": "atlas"},
  {"id": "rue-saint-honore", "name": "rue Saint-Honoré", "address": "rue Saint-Honoré", "arrondissement": "1er–8e", "lat": 48.864722222, "lng": 2.332222222, "precision": "street", "coordSource": "atlas"},
  {"id": "rue-croix-des-petits-champs", "name": "rue Croix-des-Petits-Champs", "address": "rue Croix-des-Petits-Champs", "arrondissement": "1er", "lat": 48.8625, "lng": 2.3393, "precision": "street", "coordSource": "atlas"},
  {"id": "rue-du-bouloi", "name": "rue du Bouloi", "address": "rue du Bouloi", "arrondissement": "1er", "lat": 48.8638, "lng": 2.3413, "precision": "street", "coordSource": "atlas"},
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
