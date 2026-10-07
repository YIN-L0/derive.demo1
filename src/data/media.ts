import type { Text } from "@/i18n/config";
import credits from "./media.credits.json";

type Credit = { author?: string; license: string; source: string };

export type Photo = Credit & { src: string };

export type Artwork = Credit & {
  src: string;
  width: number;
  height: number;
  title: string;
  artist: string;
  year: string;
  medium: Text;
  /** Why this image sits with this place — written by Dérive. */
  note: Text;
};

const photoCredits = credits.photos as Record<string, Credit>;
const artCredits = credits.art as Record<string, Credit & { width: number; height: number }>;

/** Contemporary photograph of the site (Wikimedia Commons). */
export const photoFor = (siteId: string): Photo | undefined =>
  photoCredits[siteId] ? { src: `/img/site/${siteId}.jpg`, ...photoCredits[siteId] } : undefined;

const PHOTO: Text = { en: "Photograph", zh: "摄影", fr: "Photographie" };
const OIL: Text = { en: "Oil on canvas", zh: "布面油画", fr: "Huile sur toile" };
const POSTCARD: Text = { en: "Postcard", zh: "明信片", fr: "Carte postale" };

const ART: Record<string, Omit<Artwork, keyof Credit | "src" | "width" | "height">> = {
  "cafe-napolitain": {
    title: "Boulevard des Capucines",
    artist: "Claude Monet",
    year: "1873–74",
    medium: OIL,
    note: {
      en: "The boulevard of the vanished Napolitain, seen from above: the crowds and carriages Jake watches from his terrace.",
      zh: "从高处看已消失的 Napolitain 所在的大道：正是 Jake 在露台上看着的那些人群和马车。",
      fr: "Le boulevard du Napolitain disparu, vu d'en haut : la foule et les voitures que Jake regarde depuis sa terrasse.",
    },
  },
  "bal-musette": {
    title: "À Sainte-Geneviève, 46 rue de la Montagne-Sainte-Geneviève",
    artist: "Eugène Atget",
    year: "1911",
    medium: PHOTO,
    note: {
      en: "A shopfront on the dance hall's street, fifteen years before the novel. Not proof of the venue, just the street as it looked.",
      zh: "小说之前十五年，舞厅所在街道上的一个门面。这不是舞厅的证据，只是这条街当年的样子。",
      fr: "Une devanture de la rue du bal, quinze ans avant le roman. Pas une preuve de l'établissement : seulement la rue telle qu'elle était.",
    },
  },
  contrescarpe: {
    title: "Rue Mouffetard",
    artist: "Eugène Atget",
    year: "1925",
    medium: PHOTO,
    note: {
      en: "The market street below the square, photographed the year Jake and Brett's taxi goes down it.",
      zh: "广场下方的市场街，拍摄于 Jake 和 Brett 的出租车驶过它的那一年。",
      fr: "La rue commerçante sous la place, photographiée l'année où le taxi de Jake et Brett la descend.",
    },
  },
  "hotel-de-crillon": {
    title: "Place de la Concorde",
    artist: "Jean-François Raffaëlli",
    year: "1898",
    medium: OIL,
    note: {
      en: "The square outside the hotel where Jake waits for Brett.",
      zh: "Jake 等待 Brett 的那家酒店门外的广场。",
      fr: "La place devant l'hôtel où Jake attend Brett.",
    },
  },
  "la-rotonde": {
    title: "Café de la Rotonde",
    artist: "Agence Rol",
    year: "1924",
    medium: PHOTO,
    note: {
      en: "The Rotonde's terrace in 1924, the year before the novel is set.",
      zh: "1924 年的 Rotonde 露台，小说故事发生的前一年。",
      fr: "La terrasse de la Rotonde en 1924, un an avant l'époque du roman.",
    },
  },
  "le-dome": {
    title: "Paris Montparnasse : Café du Dôme",
    artist: "Postcard, A. Leconte",
    year: "c. 1920s",
    medium: POSTCARD,
    note: {
      en: "The terrace Frances crosses the boulevard to reach.",
      zh: "Frances 穿过大道走向的那个露台。",
      fr: "La terrasse que Frances rejoint en traversant le boulevard.",
    },
  },
  "dingo-bar": {
    title: "F. Scott Fitzgerald",
    artist: "Publicity photograph",
    year: "c. 1921",
    medium: PHOTO,
    note: {
      en: "The writer Hemingway first met at this bar in 1925.",
      zh: "1925 年海明威在这间酒吧第一次见到的作家。",
      fr: "L'écrivain qu'Hemingway rencontra pour la première fois dans ce bar en 1925.",
    },
  },
  "closerie-des-lilas": {
    title: "La Closerie des Lilas",
    artist: "Postcard",
    year: "1909",
    medium: POSTCARD,
    note: {
      en: "The terrace under the trees, fifteen years before he wrote there.",
      zh: "树下的露台，比他在这里写作早了十五年。",
      fr: "La terrasse sous les arbres, quinze ans avant qu'il n'y écrive.",
    },
  },
  "madame-lecomte": {
    title: "Quai d'Anjou, 6 h du matin",
    artist: "Eugène Atget",
    year: "1924",
    medium: PHOTO,
    note: {
      en: "The quay of the probable restaurant at dawn, a year before Jake and Bill come to dinner.",
      zh: "那家很可能的餐馆所在的河岸，黎明时分，在 Jake 和 Bill 来吃晚饭的前一年。",
      fr: "Le quai du restaurant probable à l'aube, un an avant le dîner de Jake et Bill.",
    },
  },
  "cardinal-lemoine-74": {
    title: "Passport photograph",
    artist: "U.S. government",
    year: "1923",
    medium: PHOTO,
    note: {
      en: "Hemingway at twenty-four, while he lived at this address.",
      zh: "二十四岁的海明威，当时他就住在这个地址。",
      fr: "Hemingway à vingt-quatre ans, quand il vivait à cette adresse.",
    },
  },
  "rue-descartes": {
    title: "Rue Descartes",
    artist: "Eugène Atget",
    year: "1925",
    medium: PHOTO,
    note: {
      en: "The street of the writing room, in the years he climbed to it each morning.",
      zh: "写作间所在的街道，正是他每天早上爬楼上去的那些年。",
      fr: "La rue de la chambre d'écriture, à l'époque où il y montait chaque matin.",
    },
  },
  "shakespeare-co-odeon": {
    title: "Sylvia Beach at Shakespeare and Company",
    artist: "Unknown",
    year: "1920",
    medium: PHOTO,
    note: {
      en: "The bookseller who lent him books before he could pay for them.",
      zh: "在他还付不起钱时就把书借给他的书商。",
      fr: "La libraire qui lui prêtait des livres avant qu'il puisse les payer.",
    },
  },
  "rue-de-fleurus-27": {
    title: "Portrait of Gertrude Stein",
    artist: "Félix Vallotton",
    year: "1907",
    medium: OIL,
    note: {
      en: "Stein, painted in the years her salon made this address famous.",
      zh: "斯坦因的画像，画于她的沙龙让这个地址出名的那些年。",
      fr: "Stein, peinte à l'époque où son salon rendit cette adresse célèbre.",
    },
  },
  "notre-dame-des-champs-113": {
    title: "Ernest, Hadley and Bumby",
    artist: "Unknown",
    year: "1926",
    medium: PHOTO,
    note: {
      en: "The family who lived above the sawmill, photographed in Schruns, Austria, the year the marriage ended.",
      zh: "住在锯木厂楼上的一家人，摄于奥地利施伦斯，也是这段婚姻结束的那一年。",
      fr: "La famille qui vivait au-dessus de la scierie, photographiée à Schruns, en Autriche, l'année où le mariage prit fin.",
    },
  },
};

/** A public-domain painting or period photograph paired with a site. */
export const artworkFor = (siteId: string): Artwork | undefined => {
  const meta = ART[siteId];
  const credit = artCredits[siteId];
  return meta && credit ? { ...meta, ...credit, src: `/img/art/${siteId}.jpg` } : undefined;
};

export const allArtworks = Object.keys(ART)
  .map((id) => [id, artworkFor(id)] as const)
  .filter((e): e is readonly [string, Artwork] => !!e[1]);

export const allPhotos = Object.keys(photoCredits).map((id) => [id, photoFor(id)!] as const);

/** Route covers: literary walks lead with a period image, the film walk with a photograph. */
export const coverFor = (workId: string): { src: string; isArt: boolean } => {
  if (workId === "sun-also-rises") return { src: "/img/art/madame-lecomte.jpg", isArt: true };
  if (workId === "moveable-feast") return { src: "/img/art/closerie-des-lilas.jpg", isArt: true };
  if (workId === "of-human-bondage") return { src: "/img/site/closerie-des-lilas.jpg", isArt: false };
  if (workId === "razors-edge" || workId === "tropic-of-cancer") return { src: "/img/site/le-dome.jpg", isArt: false };
  if (workId === "good-morning-midnight") return { src: "/img/site/le-select.jpg", isArt: false };
  if (workId === "education-sentimentale") return { src: "/img/site/quai-de-la-tournelle.jpg", isArt: false };
  return { src: "/img/site/shakespeare-co-bucherie.jpg", isArt: false };
};
