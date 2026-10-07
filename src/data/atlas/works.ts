import type { Work } from "../types";

export const works: Work[] = [
  {
    id: "before-sunset",
    index: "01",
    title: "Before Sunset",
    creator: "Richard Linklater",
    year: "2004",
    medium: "film",
    subtitle: {
      en: "One conversation, edited into an impossible walk",
      zh: "一场对话，被剪成一段不可能的步行",
      fr: "Une conversation, montée en une marche impossible",
    },
    description: {
      en: "Nine years after one night in Vienna, Jesse and Céline meet again in a Left Bank bookshop with only the time before his flight. The film plays almost in real time and looks like one continuous walk, but its Paris is assembled: it cuts across the Seine and across the 11th arrondissement without missing a sentence. This walk follows the story's order and shows where the city was quietly rearranged.",
      zh: "维也纳那一夜的九年之后，Jesse 与 Céline 在左岸一家书店重逢，只剩下他登机前的这点时间。电影几乎是实时推进的，看起来像一段不间断的步行，但它的巴黎是拼接出来的：一句话还没说完，画面已经跨过了塞纳河，又跨过了整个 11 区。这条路线按故事顺序展开，也标出城市在哪里被悄悄重新排列。",
      fr: "Neuf ans après une nuit à Vienne, Jesse et Céline se retrouvent dans une librairie de la rive gauche, avec pour seul temps celui qui précède son vol. Le film se déroule presque en temps réel et ressemble à une seule marche continue, mais son Paris est monté : il franchit la Seine, puis le 11e arrondissement, sans perdre une phrase. Ce parcours suit l'ordre du récit et montre où la ville a été discrètement réarrangée.",
    },
  },
  {
    id: "sun-also-rises",
    index: "02",
    title: "The Sun Also Rises",
    creator: "Ernest Hemingway",
    year: "1926",
    medium: "novel",
    subtitle: {
      en: "Jake, Brett and the Paris chapters",
      zh: "Jake、Brett 与巴黎的那些章节",
      fr: "Jake, Brett et les chapitres parisiens",
    },
    description: {
      en: "Hemingway's first novel names its Paris precisely: cafés, a dance hall, a hotel bar, and in Chapter 8 a night walk you can still follow street by street. Jake Barnes, wounded in the war, and Lady Brett Ashley circle each other through Montparnasse before the group leaves for Pamplona. The stops follow the novel's Paris chapters in order.",
      zh: "海明威的第一部长篇把它的巴黎写得非常精确：咖啡馆、舞厅、酒店酒吧，还有第 8 章那段至今仍能逐街走完的夜行。在战争中受伤的 Jake Barnes 和 Brett Ashley 夫人在蒙帕纳斯彼此兜转，直到一行人动身去潘普洛纳。站点按小说巴黎部分的章节顺序排列。",
      fr: "Le premier roman d'Hemingway nomme son Paris avec précision : des cafés, un bal, un bar d'hôtel et, au chapitre 8, une marche nocturne que l'on peut encore suivre rue par rue. Jake Barnes, blessé à la guerre, et Lady Brett Ashley tournent l'un autour de l'autre à Montparnasse avant que le groupe ne parte pour Pampelune. Les étapes suivent l'ordre des chapitres parisiens.",
    },
  },
  {
    id: "moveable-feast",
    index: "03",
    title: "A Moveable Feast",
    creator: "Ernest Hemingway",
    year: "1964",
    medium: "memoir",
    subtitle: {
      en: "Paris remembered, poor and young",
      zh: "被回忆的巴黎：贫穷，年轻",
      fr: "Paris remémoré, pauvre et jeune",
    },
    description: {
      en: "Written decades later and published after Hemingway's death, the memoir returns to the early 1920s: a cold flat, a rented writing room, borrowed books, Gertrude Stein's salon, cafés used as offices. These are places he really lived and worked, filtered through memory, so the atlas marks where details were reconstructed rather than documented.",
      zh: "这部回忆录写于几十年后，在海明威去世后出版，回到了 1920 年代初：寒冷的公寓、租来的写作间、借来的书、斯坦因的沙龙、被当作办公室的咖啡馆。这些都是他真正生活和工作过的地方，但经过了记忆的过滤，所以地图集会标出哪些细节是重建的，而不是有文献记载的。",
      fr: "Écrits des décennies plus tard et publiés après la mort d'Hemingway, ces mémoires reviennent au début des années 1920 : un appartement froid, une chambre louée pour écrire, des livres empruntés, le salon de Gertrude Stein, des cafés servant de bureau. Ce sont des lieux où il a réellement vécu et travaillé, filtrés par la mémoire ; l'atlas signale donc les détails reconstitués plutôt que documentés.",
    },
  },
];

export const workById = (id: string) => works.find((w) => w.id === id);
