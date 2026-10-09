import type { Text } from "@/i18n/config";

/**
 * DEMO DATA. Every person, walk and note below is invented to show what the
 * Community module will look like. Nobody here is a real user.
 *
 * Avatars are crops of public-domain painted portraits (see AVATAR_CREDITS),
 * never photographs of real people.
 */

export type Member = {
  id: string;
  name: string;
  avatar: string;
  role: Text;
  base: Text;
  /** One-line self-introduction, in the member's own voice. */
  bio: Text;
  followers: string;
  walks: number;
  places: number;
};

export const members: Member[] = [
  {
    id: "lea",
    name: "Léa Vasseur",
    avatar: "hebuterne",
    role: { en: "Film programmer", zh: "电影策展人", fr: "Programmatrice de cinéma" },
    base: { en: "Paris 11e", zh: "巴黎 11 区", fr: "Paris 11e" },
    bio: {
      en: "I programme a repertory cinema and walk home through whatever we screened.",
      zh: "我给一家老片影院排片，然后沿着当晚放的那部电影走回家。",
      fr: "Je programme un cinéma de répertoire et je rentre à pied par le film du soir.",
    },
    followers: "2.4k",
    walks: 6,
    places: 41,
  },
  {
    id: "omar",
    name: "Omar Benali",
    avatar: "gris",
    role: { en: "Bookseller", zh: "书店店主", fr: "Libraire" },
    base: { en: "Paris 5e", zh: "巴黎 5 区", fr: "Paris 5e" },
    bio: {
      en: "Thirty years behind a counter on rue des Écoles. I know which doors the writers actually used.",
      zh: "在 Rue des Écoles 的柜台后面站了三十年，我知道作家们真正走的是哪扇门。",
      fr: "Trente ans derrière un comptoir rue des Écoles. Je sais quelles portes les écrivains poussaient vraiment.",
    },
    followers: "980",
    walks: 4,
    places: 27,
  },
  {
    id: "hana",
    name: "Hana Kim",
    avatar: "nahyesok",
    role: { en: "Illustrator", zh: "插画师", fr: "Illustratrice" },
    base: { en: "Seoul · Paris", zh: "首尔 · 巴黎", fr: "Séoul · Paris" },
    bio: {
      en: "I draw the café tables other people only photograph.",
      zh: "别人只是拍下来的咖啡桌，我把它们画下来。",
      fr: "Je dessine les tables de café que les autres se contentent de photographier.",
    },
    followers: "5.1k",
    walks: 3,
    places: 19,
  },
  {
    id: "aissatou",
    name: "Aïssatou Diallo",
    avatar: "aicha",
    role: { en: "Literary translator", zh: "文学译者", fr: "Traductrice littéraire" },
    base: { en: "Paris 18e", zh: "巴黎 18 区", fr: "Paris 18e" },
    bio: {
      en: "I translate Baldwin into French, and I check every address he mentions on foot.",
      zh: "我把鲍德温译成法语，他提到的每一个地址我都亲自走去核对。",
      fr: "Je traduis Baldwin en français, et je vérifie à pied chaque adresse qu'il mentionne.",
    },
    followers: "1.7k",
    walks: 2,
    places: 14,
  },
  {
    id: "tomas",
    name: "Tomás Rey",
    avatar: "soutine",
    role: { en: "Painter", zh: "画家", fr: "Peintre" },
    base: { en: "Montparnasse", zh: "蒙帕纳斯", fr: "Montparnasse" },
    bio: {
      en: "My studio is two streets from where Soutine starved. The rent has changed, the light hasn't.",
      zh: "我的画室离苏丁挨饿的地方只隔两条街。房租变了，光线没变。",
      fr: "Mon atelier est à deux rues de là où Soutine crevait de faim. Le loyer a changé, pas la lumière.",
    },
    followers: "3.3k",
    walks: 5,
    places: 33,
  },
  {
    id: "yuki",
    name: "Yuki Morita",
    avatar: "kuroda",
    role: { en: "Art historian", zh: "艺术史学者", fr: "Historienne de l'art" },
    base: { en: "Tokyo · Paris", zh: "东京 · 巴黎", fr: "Tokyo · Paris" },
    bio: {
      en: "I follow the Japanese painters who came to Paris in the 1920s, one atelier at a time.",
      zh: "我追寻 1920 年代来到巴黎的日本画家，一间画室一间画室地走。",
      fr: "Je suis les peintres japonais venus à Paris dans les années 1920, un atelier après l'autre.",
    },
    followers: "860",
    walks: 2,
    places: 22,
  },
  {
    id: "clara",
    name: "Clara Weiss",
    avatar: "modersohn",
    role: { en: "Photographer", zh: "摄影师", fr: "Photographe" },
    base: { en: "Berlin · Paris", zh: "柏林 · 巴黎", fr: "Berlin · Paris" },
    bio: {
      en: "I rephotograph Atget's streets from the exact spot, a century later.",
      zh: "一个世纪之后，我站在 Atget 当年的位置，把他拍过的街道再拍一遍。",
      fr: "Je rephotographie les rues d'Atget depuis l'endroit exact, un siècle plus tard.",
    },
    followers: "4.2k",
    walks: 4,
    places: 58,
  },
  {
    id: "jonas",
    name: "Jonas Lindqvist",
    avatar: "schiele",
    role: { en: "Screenwriter", zh: "编剧", fr: "Scénariste" },
    base: { en: "Stockholm", zh: "斯德哥尔摩", fr: "Stockholm" },
    bio: {
      en: "I time film walks with a stopwatch to find out where the edit lied.",
      zh: "我拿着秒表走电影里的路线，看剪辑在哪里撒了谎。",
      fr: "Je chronomètre les marches de cinéma pour trouver où le montage a menti.",
    },
    followers: "1.2k",
    walks: 3,
    places: 16,
  },
];

export const memberById = (id: string) => members.find((m) => m.id === id);

export type WalkStatus = "published" | "review" | "sources";

export type CommunityWalk = {
  id: string;
  by: string;
  title: Text;
  pitch: Text;
  stops: number;
  minutes: number;
  status: WalkStatus;
  saves: number;
};

export const communityWalks: CommunityWalk[] = [
  {
    id: "baldwin",
    by: "aissatou",
    title: { en: "Baldwin's Saint-Germain", zh: "鲍德温的圣日耳曼", fr: "Le Saint-Germain de Baldwin" },
    pitch: {
      en: "From the café he walked into off the boat train to the hotel that took him in during his first hard year.",
      zh: "从他下了船运列车就走进去的那家咖啡馆，到在最艰难的第一年收留他的旅馆。",
      fr: "Du café où il entra en descendant du train-paquebot à l'hôtel qui l'accueillit pendant sa première année difficile.",
    },
    stops: 3,
    minutes: 35,
    status: "review",
    saves: 212,
  },
  {
    id: "rohmer",
    by: "lea",
    title: { en: "Rohmer's Paris, in daylight", zh: "白天的侯麦巴黎", fr: "Le Paris de Rohmer, en plein jour" },
    pitch: {
      en: "Six films, nine corners, and the one bakery every Rohmer character seems to pass.",
      zh: "六部电影，九个街角，还有每个侯麦角色似乎都会路过的那家面包店。",
      fr: "Six films, neuf coins de rue, et la boulangerie devant laquelle tous ses personnages semblent passer.",
    },
    stops: 9,
    minutes: 110,
    status: "published",
    saves: 1340,
  },
  {
    id: "atget",
    by: "clara",
    title: { en: "Standing where Atget stood", zh: "站在 Atget 站过的地方", fr: "Là où se tenait Atget" },
    pitch: {
      en: "Twelve tripod positions in the 5th, matched frame for frame against the 1920s prints.",
      zh: "第 5 区的十二个三脚架位置，逐张对照 1920 年代的原片。",
      fr: "Douze emplacements de trépied dans le 5e, comparés image par image aux tirages des années 1920.",
    },
    stops: 12,
    minutes: 95,
    status: "published",
    saves: 870,
  },
  {
    id: "ateliers",
    by: "tomas",
    title: { en: "Montparnasse ateliers", zh: "蒙帕纳斯的画室", fr: "Les ateliers de Montparnasse" },
    pitch: {
      en: "The studio courtyards behind the famous cafés: where the painting actually happened.",
      zh: "著名咖啡馆背后的画室院落：画真正诞生的地方。",
      fr: "Les cours d'ateliers derrière les cafés célèbres : là où la peinture se faisait vraiment.",
    },
    stops: 7,
    minutes: 70,
    status: "sources",
    saves: 455,
  },
];

/** A proposed walk shown in detail, to demonstrate source-backed review. */
export type SubmissionStop = { n: string; title: string; address: string; note: Text; verified: boolean };

export const submission: { walkId: string; sources: number; confidence: number; stops: SubmissionStop[] } = {
  walkId: "baldwin",
  sources: 5,
  confidence: 4,
  stops: [
    {
      n: "01",
      title: "Les Deux Magots",
      address: "6 place Saint-Germain-des-Prés",
      note: {
        en: "Where Baldwin is said to have gone straight from the boat train on arriving in November 1948.",
        zh: "据说 1948 年 11 月鲍德温一到巴黎，下了船运列车就直接来了这里。",
        fr: "Là où Baldwin se serait rendu directement en descendant du train-paquebot, en novembre 1948.",
      },
      verified: true,
    },
    {
      n: "02",
      title: "Café de Flore",
      address: "172 boulevard Saint-Germain",
      note: {
        en: "The upstairs tables where he worked on his first novel through the winter.",
        zh: "楼上的桌子：他在这里度过冬天，写他的第一部小说。",
        fr: "Les tables de l'étage où il travailla tout l'hiver à son premier roman.",
      },
      verified: true,
    },
    {
      n: "03",
      title: "Hôtel Verneuil",
      address: "8 rue de Verneuil",
      note: {
        en: "The hotel that took him in during his first hard year in the city.",
        zh: "在他来到这座城市最艰难的第一年里收留他的旅馆。",
        fr: "L'hôtel qui l'accueillit pendant sa première année difficile dans la ville.",
      },
      verified: false,
    },
  ],
};

/** Notes left at places that exist in the atlas, so each links to a real place page. */
export type Activity = { by: string; siteId: string; when: Text; note: Text };

export const activity: Activity[] = [
  {
    by: "jonas",
    siteId: "rue-des-jardins-saint-paul",
    when: { en: "2 hours ago", zh: "2 小时前", fr: "il y a 2 heures" },
    note: {
      en: "Timed it. From rue Galande to here is eleven minutes at their pace. On screen it takes one cut.",
      zh: "我掐了表。按他们的步速，从 Rue Galande 走到这里要十一分钟。银幕上只用了一次剪辑。",
      fr: "J'ai chronométré. De la rue Galande jusqu'ici, onze minutes à leur allure. À l'écran, une seule coupe.",
    },
  },
  {
    by: "hana",
    siteId: "le-select",
    when: { en: "Yesterday", zh: "昨天", fr: "Hier" },
    note: {
      en: "Third table from the door, facing the mirror. Drew the same waiter twice without him noticing.",
      zh: "进门第三张桌子，正对着镜子。同一位侍者我画了两遍，他都没发现。",
      fr: "Troisième table depuis la porte, face au miroir. J'ai dessiné deux fois le même serveur sans qu'il le remarque.",
    },
  },
  {
    by: "omar",
    siteId: "shakespeare-co-odeon",
    when: { en: "2 days ago", zh: "2 天前", fr: "il y a 2 jours" },
    note: {
      en: "Tourists queue at the other shop by the river. The plaque here usually has the pavement to itself.",
      zh: "游客都在河边另一家店门口排队。这里的纪念牌前，人行道上通常一个人也没有。",
      fr: "Les touristes font la queue devant l'autre librairie, près du fleuve. Ici, la plaque a d'ordinaire le trottoir pour elle seule.",
    },
  },
  {
    by: "clara",
    siteId: "madame-lecomte",
    when: { en: "4 days ago", zh: "4 天前", fr: "il y a 4 jours" },
    note: {
      en: "Six in the morning, like Atget. The quay is empty and the light comes up the river exactly as in his print.",
      zh: "和 Atget 一样，早上六点来。河岸空无一人，光线沿着河面升起，和他那张照片里一模一样。",
      fr: "Six heures du matin, comme Atget. Le quai est vide et la lumière remonte le fleuve exactement comme sur son tirage.",
    },
  },
  {
    by: "lea",
    siteId: "coulee-verte",
    when: { en: "Last week", zh: "上周", fr: "La semaine dernière" },
    note: {
      en: "Walk it east to west and you get the film's light. The other way round, the sun is in your eyes.",
      zh: "从东往西走，才是电影里的光线。反过来走，太阳正对着眼睛。",
      fr: "Marchez d'est en ouest et vous aurez la lumière du film. Dans l'autre sens, le soleil est dans les yeux.",
    },
  },
];

/** Page copy. Kept here so the Community module is self-contained. */
export const copy = {
  banner: {
    en: "Preview. Sample profiles and content, not real users.",
    zh: "预览。示例资料与内容，并非真实用户。",
    fr: "Aperçu. Profils et contenus d'exemple, pas de vrais utilisateurs.",
  },
  title: { en: "Community", zh: "社区", fr: "Communauté" },
  intro: {
    en: "Walks proposed by programmers, booksellers, translators and painters who know a street better than any guidebook. Every submission carries its sources and is reviewed before it reaches the map.",
    zh: "由策展人、书店店主、译者和画家提出的路线，他们比任何导览手册都更了解一条街。每一条投稿都附有来源，经过审核后才会出现在地图上。",
    fr: "Des parcours proposés par des programmateurs, des libraires, des traductrices et des peintres qui connaissent une rue mieux que n'importe quel guide. Chaque proposition est sourcée et relue avant d'arriver sur la carte.",
  },
  members: { en: "People", zh: "成员", fr: "Membres" },
  followers: { en: "followers", zh: "关注者", fr: "abonnés" },
  walksN: { en: "walks", zh: "条路线", fr: "parcours" },
  placesN: { en: "places", zh: "个地点", fr: "lieux" },
  follow: { en: "Follow", zh: "关注", fr: "Suivre" },
  walks: { en: "Walks from the community", zh: "社区路线", fr: "Parcours de la communauté" },
  by: { en: "by", zh: "作者", fr: "par" },
  stops: { en: "stops", zh: "站", fr: "étapes" },
  min: { en: "min", zh: "分钟", fr: "min" },
  saves: { en: "saves", zh: "次收藏", fr: "enregistrements" },
  status: {
    published: { en: "Published", zh: "已发布", fr: "Publié" },
    review: { en: "In review", zh: "审核中", fr: "En relecture" },
    sources: { en: "Needs sources", zh: "待补来源", fr: "Sources à compléter" },
  },
  notes: { en: "Left at a place", zh: "留在地点上的笔记", fr: "Laissé sur place" },
  at: { en: "at", zh: "在", fr: "à" },
  reviewLabel: { en: "How review works", zh: "审核如何进行", fr: "Comment fonctionne la relecture" },
  reviewTitle: { en: "A proposal, stop by stop", zh: "一条投稿，逐站审核", fr: "Une proposition, étape par étape" },
  reviewBody: {
    en: "Each stop is checked against its sources. A stop with only one source is held back until a second confirms it. Nothing is published as certain when it is only probable.",
    zh: "每一站都要对照来源核实。只有一个来源的站点会先保留，等第二个来源确认。只是“很可能”的内容，不会被当作确定的事实发布。",
    fr: "Chaque étape est confrontée à ses sources. Une étape qui n'en a qu'une est retenue jusqu'à ce qu'une seconde la confirme. Rien n'est publié comme certain quand ce n'est que probable.",
  },
  submittedBy: { en: "Submitted by", zh: "投稿人", fr: "Proposé par" },
  sourcesAttached: { en: "Sources attached", zh: "附带来源", fr: "Sources jointes" },
  confidence: { en: "Confidence", zh: "置信度", fr: "Fiabilité" },
  high: { en: "High", zh: "高", fr: "Élevée" },
  awaiting: { en: "Awaiting editor", zh: "等待编辑", fr: "En attente de relecture" },
  statusLabel: { en: "Status", zh: "状态", fr: "Statut" },
  verified: { en: "Verified", zh: "已核实", fr: "Vérifié" },
  needsSecond: { en: "Needs a second source", zh: "需要第二个来源", fr: "Deuxième source requise" },
  cta: { en: "Know a street that belongs in a book?", zh: "你知道哪条街属于一本书吗？", fr: "Vous connaissez une rue qui a sa place dans un livre ?" },
  ctaMuted: { en: "Submissions open with the beta.", zh: "投稿将随测试版开放。", fr: "Les propositions ouvriront avec la bêta." },
  ctaButton: { en: "Back to Nearby", zh: "回到附近", fr: "Retour à proximité" },
  avatars: {
    en: "Avatars are details of public-domain portraits, not photographs of real people:",
    zh: "头像取自公有领域的肖像画局部，并非真实人物的照片：",
    fr: "Les avatars sont des détails de portraits du domaine public, pas des photographies de personnes réelles :",
  },
} satisfies Record<string, Text | Record<string, Text>>;

export const AVATAR_CREDITS: { avatar: string; label: string; source: string }[] = [
  { avatar: "hebuterne", label: "Amedeo Modigliani, Jeanne Hébuterne, 1919", source: "https://commons.wikimedia.org/wiki/File:Amedeo_Modigliani,_1919,_Jeanne_H%C3%A9buterne,_oil_on_canvas,_91.4_x_73_cm,_Metropolitan_Museum_of_Art.jpg" },
  { avatar: "gris", label: "Amedeo Modigliani, Portrait of Juan Gris, 1915", source: "https://commons.wikimedia.org/wiki/File:Amedeo_Modigliani_-_Portrait_of_Juan_Gris.jpg" },
  { avatar: "nahyesok", label: "Na Hye-sok, Self-Portrait, c. 1928", source: "https://commons.wikimedia.org/wiki/File:Self-Portrait_by_Na_Hye-sok,_c._1928.jpg" },
  { avatar: "aicha", label: "Félix Vallotton, Aïcha, 1922", source: "https://commons.wikimedia.org/wiki/File:F%C3%A9lix_Vallotton,_1922_-_A%C3%AFcha.jpg" },
  { avatar: "soutine", label: "Amedeo Modigliani, Chaim Soutine, 1917", source: "https://commons.wikimedia.org/wiki/File:Amedeo_Modigliani,_Chaim_Soutine,_1917,_NGA_46522.jpg" },
  { avatar: "kuroda", label: "Kuroda Seiki, Portrait of a Woman, 1898", source: "https://commons.wikimedia.org/wiki/File:Portrait_of_a_Woman_by_Kuroda_Seiki_(Kuroda_Kinenkan).jpg" },
  { avatar: "modersohn", label: "Paula Modersohn-Becker, Self-Portrait with Hat and Veil, c. 1906", source: "https://commons.wikimedia.org/wiki/File:Paula_Modersohn-Becker_-_Self-portrait_with_hat_and_veil_-_Google_Art_Project.jpg" },
  { avatar: "schiele", label: "Egon Schiele, Self-Portrait with Physalis, 1912", source: "https://commons.wikimedia.org/wiki/File:Egon_Schiele_-_Self-Portrait_with_Physalis_-_Google_Art_Project.jpg" },
];
