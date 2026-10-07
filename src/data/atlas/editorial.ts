import type { Text } from "@/i18n/config";
import type { Category } from "../types";

/**
 * Dérive's editorial layer over the atlas. Everything here is labelled as
 * editorial in the UI; facts stay in atlas.json.
 *
 * hook         — one sentence for the Nearby card, drawn only from facts in the atlas row.
 * uncertainty  — a visible caveat when the identification or position is not certain.
 * jump         — the arrival from the previous beat is impossible on foot (only where the atlas documents it).
 * zh           — Chinese for cells the ZH workbook left in English.
 * extraCategories — filter categories the relation types alone don't capture.
 */
type Editorial = {
  hook: Text;
  uncertainty?: Text;
  jump?: Text;
  zh?: Partial<Record<"when" | "mention" | "people", string>>;
  extraCategories?: Category[];
};

export const editorial: Record<string, Editorial> = {
  /* ————————————————————————— Before Sunset ————————————————————————— */
  "bs-shakespeare": {
    hook: {
      en: "The novel Jesse wrote to preserve one night in Vienna is exactly what brings Céline back through this door.",
      zh: "Jesse 为了保存维也纳那一夜而写的小说，恰恰把 Céline 带回了这扇门里。",
      fr: "Le roman que Jesse a écrit pour conserver une nuit à Vienne est précisément ce qui ramène Céline par cette porte.",
    },
  },
  "bs-saint-julien": {
    hook: {
      en: "The first steps outside the bookshop: walking lets them talk without having to look at each other.",
      zh: "走出书店的头几步：边走边说，他们就不必一直看着对方。",
      fr: "Les premiers pas hors de la librairie : marcher leur permet de parler sans avoir à se regarder.",
    },
  },
  "bs-galande": {
    hook: {
      en: "Here the missed date in Vienna is finally explained: not rejection, but a grandmother's funeral.",
      zh: "在这条街上，维也纳那次失约终于真相大白：不是拒绝，而是一场祖母的葬礼。",
      fr: "Ici, le rendez-vous manqué de Vienne trouve enfin son explication : pas un refus, mais les obsèques d'une grand-mère.",
    },
  },
  "bs-jardins-saint-paul": {
    hook: {
      en: "The conversation appears continuous here, but the film has secretly jumped across the Seine.",
      zh: "对话在这里看似从未中断，可电影已经悄悄跳过了塞纳河。",
      fr: "Ici, la conversation semble continue, mais le film a discrètement sauté par-dessus la Seine.",
    },
    jump: {
      en: "The film cuts from the Left Bank to the Marais without breaking the conversation.",
      zh: "电影没有打断对话，就从左岸切到了玛黑区。",
      fr: "Le film passe de la rive gauche au Marais sans interrompre la conversation.",
    },
  },
  "bs-charlemagne": {
    hook: {
      en: "Romance gives way to adulthood: Céline talks about her environmental work, and Jesse meets the woman instead of the memory.",
      zh: "浪漫让位于成年：Céline 谈起她的环保工作，Jesse 见到的是眼前这个女人，而不是记忆里的女孩。",
      fr: "La romance cède la place à l'âge adulte : Céline parle de son travail pour l'environnement, et Jesse rencontre la femme plutôt que le souvenir.",
    },
  },
  "bs-eginhard": {
    hook: {
      en: "A lane so narrow the conversation narrows with it, just before the film's second leap across Paris.",
      zh: "一条窄到对话也随之收紧的小巷，紧接着，电影第二次跃过半个巴黎。",
      fr: "Une ruelle si étroite que la conversation se resserre avec elle, juste avant le deuxième saut du film à travers Paris.",
    },
  },
  "bs-pure-cafe": {
    hook: {
      en: "The only time they sit down, and the lives they might have shared start to feel real.",
      zh: "他们唯一一次坐下来，那段本可能共度的人生开始变得具体。",
      fr: "La seule fois qu'ils s'assoient, et les vies qu'ils auraient pu partager deviennent tangibles.",
    },
    jump: {
      en: "From the Marais the film leaps east into the 11th arrondissement, a distance the conversation could never have covered on foot.",
      zh: "电影从玛黑区直接跳到东边的 11 区，这段距离，那场对话不可能步行走完。",
      fr: "Depuis le Marais, le film saute vers l'est jusque dans le 11e arrondissement, une distance que la conversation n'aurait jamais pu couvrir à pied.",
    },
  },
  "bs-coulee-verte": {
    hook: {
      en: "A garden built on an old railway viaduct, where the talk rises above the traffic and can only move forward.",
      zh: "建在旧铁路高架上的花园步道：对话升到车流之上，只能一直向前。",
      fr: "Un jardin posé sur un ancien viaduc ferroviaire, où la conversation s'élève au-dessus de la circulation et ne peut qu'avancer.",
    },
  },
  "bs-tournelle": {
    hook: {
      en: "They stop choosing streets and let the Seine carry them. The river becomes the clock on his flight.",
      zh: "他们不再挑选街道，任由塞纳河带着走。河流变成了他航班的倒计时。",
      fr: "Ils cessent de choisir les rues et se laissent porter par la Seine. Le fleuve devient l'horloge de son vol.",
    },
  },
  "bs-henri-iv": {
    hook: {
      en: "Getting off the boat, Jesse chooses to spend time he doesn't have: chance becomes a decision.",
      zh: "下船时，Jesse 选择花掉他并没有的时间：偶然变成了决定。",
      fr: "En descendant du bateau, Jesse choisit de dépenser un temps qu'il n'a pas : le hasard devient une décision.",
    },
  },
  "bs-etoile-dor": {
    hook: {
      en: "The courtyard that plays Céline's home, where the film ends with a waltz and a plane he will probably miss.",
      zh: "扮演 Céline 住所的院子：电影在一支华尔兹和一班他多半会错过的飞机中结束。",
      fr: "La cour qui joue le domicile de Céline, où le film s'achève sur une valse et un avion qu'il va sans doute manquer.",
    },
    uncertainty: {
      en: "This is where Céline's apartment was filmed, not the home address the story gives her. The two are different places. The courtyard is private: approach from outside only.",
      zh: "这里是 Céline 公寓的拍摄地，而不是故事里她的住址，两者并不是同一个地方。院子属于私人住宅，请只在外面看。",
      fr: "C'est ici qu'a été filmé l'appartement de Céline, pas l'adresse que lui donne le récit : ce sont deux lieux différents. La cour est privée : à approcher de l'extérieur seulement.",
    },
  },

  /* ————————————————————————— The Sun Also Rises ————————————————————————— */
  "sar-napolitain": {
    hook: {
      en: "The café has vanished, but this is where Jake watches the boulevard darken before the night that leads him to Brett.",
      zh: "这家咖啡馆早已消失，但正是在这里，Jake 看着大道暗下来，那一夜最终把他引向 Brett。",
      fr: "Le café a disparu, mais c'est ici que Jake regarde le boulevard s'assombrir, avant la nuit qui le mènera à Brett.",
    },
  },
  "sar-bal-musette": {
    hook: {
      en: "Somewhere on this steep street was the dance hall where Brett makes her entrance. Nobody knows which door.",
      zh: "这条陡街上的某个地方，就是 Brett 登场的那间舞厅。没人知道是哪一扇门。",
      fr: "Quelque part dans cette rue en pente se trouvait le bal où Brett fait son entrée. Personne ne sait derrière quelle porte.",
    },
    uncertainty: {
      en: "The novel names the street but not the dance hall. The exact venue is unresolved, so the pin marks the street, not a storefront.",
      zh: "小说写出了街名，却没有写舞厅的名字。具体是哪一家至今没有定论，所以地图上标的是这条街，而不是某个门面。",
      fr: "Le roman nomme la rue mais pas le bal. L'établissement exact reste inconnu : le repère indique la rue, pas une devanture.",
    },
  },
  "sar-taxi": {
    hook: {
      en: "The taxi ride down rue Mouffetard where Jake and Brett kiss, and the novel's central impossibility becomes clear.",
      zh: "沿 Mouffetard 街而下的那段出租车路程：Jake 和 Brett 接吻，小说核心的那份不可能随之清晰。",
      fr: "La course en taxi le long de la rue Mouffetard où Jake et Brett s'embrassent, et où l'impossibilité au cœur du roman devient claire.",
    },
  },
  "sar-crillon": {
    hook: {
      en: "Jake waits here at five o'clock, writing letters on the hotel's fine paper. Brett never comes.",
      zh: "五点钟，Jake 在这里等着，用酒店的精美信纸写信。Brett 始终没有来。",
      fr: "Jake attend ici à cinq heures, écrivant des lettres sur le beau papier de l'hôtel. Brett ne vient jamais.",
    },
  },
  "sar-rotonde": {
    hook: {
      en: "Jake asks for the Select; the taxi drops him at the Rotonde anyway, as if Montparnasse had only one address.",
      zh: "Jake 说要去 Select，出租车却还是把他放在了 Rotonde，仿佛蒙帕纳斯只有这一个地址。",
      fr: "Jake demande le Select ; le taxi le dépose quand même à la Rotonde, comme si Montparnasse n'avait qu'une adresse.",
    },
  },
  "sar-select": {
    hook: {
      en: "Opened in 1923 and still trading: the terrace the whole novel keeps coming back to, same name, same address.",
      zh: "1923 年开业，至今仍在营业：整部小说一再回到的那个露台，同样的名字，同样的地址。",
      fr: "Ouvert en 1923 et toujours en activité : la terrasse à laquelle tout le roman revient, même nom, même adresse.",
    },
  },
  "sar-dome": {
    hook: {
      en: "To speak privately, Frances only has to cross the boulevard. In café society, intimacy is one terrace away.",
      zh: "想私下说话，Frances 只需走过这条大道。在咖啡馆社会里，私密只隔一个露台。",
      fr: "Pour parler en privé, Frances n'a qu'à traverser le boulevard. Dans la société des cafés, l'intimité est à une terrasse de distance.",
    },
  },
  "sar-dingo": {
    hook: {
      en: "In the novel, it's where Jake finds Brett and Mike. In life, it's where Hemingway first met F. Scott Fitzgerald, in 1925.",
      zh: "在小说里，Jake 在这里找到了 Brett 和 Mike。在现实中，海明威 1925 年在这里第一次见到菲茨杰拉德。",
      fr: "Dans le roman, Jake y retrouve Brett et Mike. Dans la vie, c'est ici qu'Hemingway a rencontré F. Scott Fitzgerald, en 1925.",
    },
    uncertainty: {
      en: "The Hemingway–Fitzgerald meeting here is documented, but it is not proof that it inspired the novel's scene. The original bar no longer exists in its old form.",
      zh: "海明威与菲茨杰拉德在这里相识是有据可查的，但这并不能证明它启发了小说中的这一场景。原来的酒吧也已不复旧貌。",
      fr: "La rencontre Hemingway–Fitzgerald ici est documentée, mais elle ne prouve pas qu'elle ait inspiré la scène du roman. Le bar d'origine n'existe plus sous sa forme ancienne.",
    },
  },
  "sar-closerie": {
    hook: {
      en: "Jake drinks here in the novel, and Hemingway sat here writing the novel. You can stand inside the book and beside its making.",
      zh: "小说里 Jake 在这里喝酒，而海明威正是坐在这里写下这部小说。你可以同时站在书里和书的诞生处。",
      fr: "Jake y boit dans le roman, et Hemingway s'y asseyait pour l'écrire. On se tient à la fois dans le livre et à côté de sa fabrication.",
    },
  },
  "sar-lecomte": {
    hook: {
      en: "A 'hidden' restaurant ruined by being recommended to Americans: the novel's sharpest joke about literary tourism.",
      zh: "一家因为被推荐给美国人而不再“隐秘”的餐馆：小说对文学旅游最尖锐的一个玩笑。",
      fr: "Un restaurant « secret » gâché pour avoir été recommandé aux Américains : la plaisanterie la plus mordante du roman sur le tourisme littéraire.",
    },
    uncertainty: {
      en: "Probable historical identification. The novel never names the business; research links Madame Lecomte's to Au Rendez-vous des Mariniers at 33 quai d'Anjou, which closed in 1953. The building is private.",
      zh: "很可能的历史对应。小说从未写出店名；研究把 Madame Lecomte's 对应到 33 quai d'Anjou 的 Au Rendez-vous des Mariniers，该店已于 1953 年关闭。建筑为私人产业。",
      fr: "Identification historique probable. Le roman ne nomme jamais l'établissement ; la recherche rapproche Madame Lecomte's d'Au Rendez-vous des Mariniers, 33 quai d'Anjou, fermé en 1953. L'immeuble est privé.",
    },
    zh: { mention: "餐馆在书中明确出现；真实身份为推断" },
  },
  "sar-night-walk": {
    hook: {
      en: "A paragraph you can literally walk: Jake and Bill's route after dinner, named street by street.",
      zh: "一段真的可以走完的文字：晚饭后 Jake 和 Bill 的路线，一条街一条街都写了名字。",
      fr: "Un paragraphe que l'on peut littéralement parcourir : le trajet de Jake et Bill après le dîner, nommé rue par rue.",
    },
    uncertainty: {
      en: "The line on the map is traced from the street names in the text. It is a sketch of the route, not a record of exact steps.",
      zh: "地图上的线是根据原文中的街名画出来的，是路线示意，而不是精确的步行轨迹。",
      fr: "Le tracé sur la carte suit les noms de rues du texte. C'est une esquisse du parcours, pas un relevé exact des pas.",
    },
  },

  /* ————————————————————————— A Moveable Feast ————————————————————————— */
  "mf-contrescarpe": {
    hook: {
      en: "The memoir's Paris begins here, not in a famous café: cold wind, cheap drink and a square full of drinkers.",
      zh: "回忆录里的巴黎从这里开始，而不是某家名咖啡馆：冷风、廉价的酒，和满是醉汉的广场。",
      fr: "Le Paris des mémoires commence ici, pas dans un café célèbre : le vent froid, l'alcool bon marché et une place pleine de buveurs.",
    },
    zh: { when: "开篇章节《圣米歇尔广场上的一家好咖啡馆》／开篇的巴黎地理" },
  },
  "mf-cardinal-lemoine": {
    hook: {
      en: "Hemingway and Hadley's first flat, 1922–23: poor, cold, and remembered decades later as happiness.",
      zh: "海明威与 Hadley 的第一间公寓（1922–23）：贫穷、寒冷，几十年后却被回忆成幸福。",
      fr: "Le premier appartement d'Hemingway et Hadley, 1922–1923 : pauvre, froid, et remémoré des décennies plus tard comme le bonheur.",
    },
  },
  "mf-descartes": {
    hook: {
      en: "Every morning he left home to write in a rented room nearby. The discipline behind the legend has an address, roughly.",
      zh: "他每天早上走出家门，去附近租来的房间写作。传奇背后的自律有一个地址，只是大致的。",
      fr: "Chaque matin, il quittait son domicile pour écrire dans une chambre louée tout près. La discipline derrière la légende a une adresse, approximativement.",
    },
    uncertainty: {
      en: "Historically reconstructed zone. The room's exact building and interior are not confirmed, and it is not a public site.",
      zh: "这是历史重建的区域。写作间所在的具体建筑和室内都未能确认，也不对外开放。",
      fr: "Zone reconstituée historiquement. L'immeuble et l'intérieur exacts de la chambre ne sont pas confirmés, et le lieu n'est pas ouvert au public.",
    },
  },
  "mf-odeon": {
    hook: {
      en: "The original Shakespeare and Company, where Sylvia Beach lent books to a writer who couldn't yet afford them.",
      zh: "最初的莎士比亚书店：Sylvia Beach 把书借给一个还买不起书的作家。",
      fr: "Le Shakespeare and Company d'origine, où Sylvia Beach prêtait des livres à un écrivain qui ne pouvait pas encore se les offrir.",
    },
    zh: { when: "《莎士比亚书店》一章" },
  },
  "mf-fleurus": {
    hook: {
      en: "Gertrude Stein's salon, hung with modern art, and the source of the phrase 'a lost generation'.",
      zh: "斯坦因挂满现代艺术的沙龙，“迷惘的一代”这个说法就出自这里。",
      fr: "Le salon de Gertrude Stein, tapissé d'art moderne, et l'origine de l'expression « génération perdue ».",
    },
    zh: { when: "《斯坦因小姐的教导》与《迷惘的一代》两章" },
    extraCategories: ["art"],
  },
  "mf-closerie": {
    hook: {
      en: "Not a shrine but a desk rented one drink at a time: the café where the young Hemingway actually worked.",
      zh: "不是圣地，而是一杯饮料换来的一张书桌：年轻的海明威真正在这里工作过。",
      fr: "Pas un sanctuaire mais un bureau loué une consommation à la fois : le café où le jeune Hemingway travaillait vraiment.",
    },
  },
  "mf-michaud": {
    hook: {
      en: "A restaurant they could rarely afford, where they watched James Joyce dine with his family.",
      zh: "一家他们很少吃得起的餐馆，他们在这里看见詹姆斯·乔伊斯和家人用餐。",
      fr: "Un restaurant qu'ils pouvaient rarement s'offrir, où ils regardaient James Joyce dîner en famille.",
    },
    uncertainty: {
      en: "The restaurant's identity has changed. Treat the corner as a historical site; whatever trades there today is not Michaud's.",
      zh: "这家餐馆早已易主。请把这个街角当作历史地点，今天在这里营业的已不是 Michaud's。",
      fr: "L'établissement a changé d'identité. Considérez ce coin de rue comme un site historique : ce qui s'y trouve aujourd'hui n'est pas Michaud's.",
    },
    zh: { when: "关于饥饿与食物、以及与乔伊斯有关的段落" },
  },
  "mf-notre-dame-des-champs": {
    hook: {
      en: "The flat above a sawmill where The Sun Also Rises was finished, and where his first marriage came apart.",
      zh: "锯木厂楼上的公寓：《太阳照常升起》在这里完成，他的第一段婚姻也在这里破裂。",
      fr: "L'appartement au-dessus d'une scierie où Le soleil se lève aussi fut achevé, et où son premier mariage se défit.",
    },
  },
  "mf-ritz": {
    hook: {
      en: "The story goes that trunks of old notebooks left at the Ritz sent Hemingway back, decades later, to his poor Paris years.",
      zh: "据说，留在丽兹酒店的几箱旧笔记本，让几十年后的海明威重新回到了他贫穷的巴黎岁月。",
      fr: "On raconte que des malles de vieux carnets laissées au Ritz ont ramené Hemingway, des décennies plus tard, vers ses années pauvres à Paris.",
    },
  },
  "ohb-moulin-rouge": {
    "hook": {
      "en": "Philip’s earlier business trip to Paris as an articled clerk.",
      "zh": "作品在此段提到 the Moulin Rouge。",
      "fr": ""
    }
  },
  "ohb-folies-bergere": {
    "hook": {
      "en": "The novel names the Folies Bergeres in this passage.",
      "zh": "作品在此段提到 the Folies Bergeres。",
      "fr": ""
    }
  },
  "ohb-place-de-la-concorde": {
    "hook": {
      "en": "Early mornings on the business trip.",
      "zh": "作品在此段提到 Place de la Concorde。",
      "fr": ""
    }
  },
  "ohb-quartier-latin": {
    "hook": {
      "en": "The novel names the Latin Quarter in this passage.",
      "zh": "作品在此段提到 the Latin Quarter。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "ohb-lion-de-belfort-paris": {
    "hook": {
      "en": "Landmark Philip walks to on his way to Mrs. Otter.",
      "zh": "作品在此段提到 the Lion de Belfort。",
      "fr": ""
    }
  },
  "ohb-boulevard-raspail": {
    "hook": {
      "en": "Orientation for Mrs. Otter’s flat and, later, the shared studio; the streets themselves are unnamed.",
      "zh": "作品在此段提到 Boulevard Raspail。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "ohb-boulevard-du-montparnasse": {
    "hook": {
      "en": "Philip takes his first walk through the quarter after arriving to study art.",
      "zh": "作品在此段提到 Boulevard du Montparnasse。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "ohb-avenue-de-l-observatoire": {
    "hook": {
      "en": "Second leg of the first walk; Philip admires the vista.",
      "zh": "作品在此段提到 Avenue de l’Observatoire。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "ohb-jardin-du-luxembourg": {
    "hook": {
      "en": "End of the first walk; Philip watches the life of the gardens.",
      "zh": "作品在此段提到 the gardens of the Luxembourg。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "ohb-closerie-des-lilas": {
    "hook": {
      "en": "Evening café where Cronshaw holds court.",
      "zh": "作品在此段提到 La Closerie des Lilas。",
      "fr": ""
    }
  },
  "ohb-gaite-montparnasse": {
    "hook": {
      "en": "Music-hall recommended by Lawson; visited in ch. XLIX.",
      "zh": "作品在此段提到 the Gaite Montparnasse。",
      "fr": ""
    }
  },
  "ohb-musee-du-louvre": {
    "hook": {
      "en": "Repeated visits to the galleries.",
      "zh": "作品在此段提到 the Louvre。",
      "fr": ""
    }
  },
  "ohb-boulevard-saint-michel": {
    "hook": {
      "en": "Philip tries to buy Fanny Price lunch.",
      "zh": "作品在此段提到 Boulevard St. Michel。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "ohb-rue-campagne-premiere": {
    "hook": {
      "en": "Clutton’s studio, reported by rumour.",
      "zh": "作品在此段提到 Rue Campagne Premiere。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "ohb-opera-comique": {
    "hook": {
      "en": "The novel names the Opera Comique in this passage.",
      "zh": "作品在此段提到 the Opera Comique。",
      "fr": ""
    }
  },
  "ohb-theatre-de-l-odeon": {
    "hook": {
      "en": "The novel names the Odeon in this passage.",
      "zh": "作品在此段提到 the Odeon。",
      "fr": ""
    }
  },
  "ohb-bal-bullier": {
    "hook": {
      "en": "Dance hall visited by the students.",
      "zh": "作品在此段提到 the Bal Bullier。",
      "fr": ""
    }
  },
  "ohb-quai-des-grands-augustins": {
    "hook": {
      "en": "Cronshaw’s lodging as described by Lawson.",
      "zh": "作品在此段提到 Quai des Grands Augustins。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "ohb-hotel-drouot": {
    "hook": {
      "en": "Cronshaw’s hack journalism.",
      "zh": "作品在此段提到 the Hotel Drouot。",
      "fr": ""
    }
  },
  "ohb-musee-de-cluny": {
    "hook": {
      "en": "Cronshaw sends Philip to look at Persian carpets.",
      "zh": "作品在此段提到 the Cluny。",
      "fr": ""
    }
  },
  "rze-rue-saint-guillaume": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "rze-ritz-paris": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    },
    "uncertainty": {
      "en": "The novel names the Ritz bar. The existing pin represents the hotel; it does not establish the room or identify the historical bar with today’s Bar Hemingway.",
      "zh": "",
      "fr": ""
    }
  },
  "rze-le-dome": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "rze-jardin-du-luxembourg": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "rze-theatre-de-l-odeon": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "rze-gare-du-nord": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "rze-pont-saint-michel": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "rze-maxims": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "rze-le-select": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "rze-rue-de-lappe": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    },
    "uncertainty": {
      "en": "The street is named; the café’s identity and doorway are unresolved.",
      "zh": "",
      "fr": ""
    }
  },
  "gmm-boulevard-du-montparnasse": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    },
    "uncertainty": {
      "en": "Probable: supported by one university research account, not checked against a primary edition. This pin marks a street or district, not a specific café, hotel or continuous itinerary.",
      "zh": "",
      "fr": ""
    }
  },
  "gmm-quartier-latin": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    },
    "uncertainty": {
      "en": "Probable: supported by one university research account, not checked against a primary edition. This pin marks a street or district, not a specific café, hotel or continuous itinerary.",
      "zh": "",
      "fr": ""
    }
  },
  "toc-boulevard-du-montparnasse": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "toc-place-des-vosges": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "toc-gare-saint-lazare": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "toc-jardin-des-tuileries": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "toc-place-saint-sulpice": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "toc-rue-bonaparte": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "toc-le-select": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "toc-le-dome": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    }
  },
  "toc-rue-du-chateau": {
    "hook": {
      "en": "Read this stop alongside the source, then follow its place in the city.",
      "zh": "",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-quai-saint-bernard": {
    "hook": {
      "en": "15 September 1840: the steamer leaves Paris; Frédéric first sees Mme Arnoux on board.",
      "zh": "作品在此段提到 quai Saint-Bernard。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-boulevard-montmartre": {
    "hook": {
      "en": "Arnoux’s shop and newspaper office (a fictional business on a real boulevard).",
      "zh": "作品在此段提到 l'Art industriel, boulevard Montmartre。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-rue-d-anjou": {
    "hook": {
      "en": "The Dambreuse mansion.",
      "zh": "作品在此段提到 rue d'Anjou。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-rue-coq-heron": {
    "hook": {
      "en": "The coach yard where Frédéric arrives in Paris.",
      "zh": "作品在此段提到 rue Coq-Héron。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-jardin-des-tuileries": {
    "hook": {
      "en": "The novel names les Tuileries in this passage.",
      "zh": "作品在此段提到 les Tuileries。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-quai-aux-fleurs": {
    "hook": {
      "en": "Frédéric’s rooms, later shared with Deslauriers.",
      "zh": "作品在此段提到 quai Napoléon。",
      "fr": ""
    },
    "uncertainty": {
      "en": "Quai Napoléon covered today’s quai aux Fleurs and quai de la Corse. This pin is a representative point; Frédéric’s rooms are not located.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-rue-de-choiseul": {
    "hook": {
      "en": "The Arnoux household; the Thursday dinners.",
      "zh": "作品在此段提到 rue de Choiseul, 24 bis。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The novel gives 24 bis for the Arnoux household. This street pin does not locate that doorway and does not represent the commemorative plaque at number 13.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-quai-de-la-tournelle": {
    "hook": {
      "en": "The novel names quai de la Tournelle in this passage.",
      "zh": "作品在此段提到 quai de la Tournelle。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-quai-de-montebello": {
    "hook": {
      "en": "The novel names quai Montebello in this passage.",
      "zh": "作品在此段提到 quai Montebello。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-pont-neuf": {
    "hook": {
      "en": "The novel names pont Neuf in this passage.",
      "zh": "作品在此段提到 pont Neuf。",
      "fr": ""
    }
  },
  "eds-musee-du-louvre": {
    "hook": {
      "en": "The novel names le Louvre in this passage.",
      "zh": "作品在此段提到 le Louvre。",
      "fr": ""
    }
  },
  "eds-rue-saint-honore": {
    "hook": {
      "en": "The novel names rue Saint-Honoré in this passage.",
      "zh": "作品在此段提到 rue Saint-Honoré。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-rue-croix-des-petits-champs": {
    "hook": {
      "en": "The novel names rue Croix-des-Petits-Champs in this passage.",
      "zh": "作品在此段提到 rue Croix-des-Petits-Champs。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-rue-du-bouloi": {
    "hook": {
      "en": "The novel names rue du Bouloi in this passage.",
      "zh": "作品在此段提到 rue du Bouloi。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-rue-de-paradis": {
    "hook": {
      "en": "The Arnoux’s address in Part II (number \"Trente-sept\" given in the next line).",
      "zh": "作品在此段提到 rue Paradis-Poissonnière, 37。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The City’s historical street register maps rue Paradis-Poissonnière to rue de Paradis. The pin marks the street, not a verified modern number 37.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-cafe-anglais": {
    "hook": {
      "en": "The novel names le café Anglais in this passage.",
      "zh": "作品在此段提到 le café Anglais。",
      "fr": ""
    }
  },
  "eds-rue-victor-masse": {
    "hook": {
      "en": "Rosanette’s apartment; the costume ball.",
      "zh": "作品在此段提到 18, rue de Laval。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The City’s historical street register maps rue de Laval to rue Victor-Massé. No present-day doorway at number 18 has been verified.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-champ-de-mars": {
    "hook": {
      "en": "The races.",
      "zh": "作品在此段提到 le Champ de Mars。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-rue-tronchet": {
    "hook": {
      "en": "The rendezvous Mme Arnoux does not keep, 22 February 1848; Frédéric has rented a furnished apartment in the street.",
      "zh": "作品在此段提到 rue Tronchet。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-place-du-pantheon": {
    "hook": {
      "en": "The rendezvous for the 22 February 1848 demonstration, which Frédéric misses.",
      "zh": "作品在此段提到 place du Panthéon。",
      "fr": ""
    }
  },
  "eds-boulevard-des-capucines": {
    "hook": {
      "en": "The fusillade of 23 February 1848, reported.",
      "zh": "作品在此段提到 boulevard des Capucines。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-palais-royal": {
    "hook": {
      "en": "24 February 1848: the attack on the Château-d’Eau post.",
      "zh": "作品在此段提到 le Palais-Royal。",
      "fr": ""
    }
  },
  "eds-cimetiere-du-pere-lachaise": {
    "hook": {
      "en": "M. Dambreuse’s funeral.",
      "zh": "作品在此段提到 le Père-Lachaise。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The point represents the named street or area. No specific doorway or exact steps are established.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-rue-de-fleurus": {
    "hook": {
      "en": "Arnoux’s last Paris address as reported by Regimbart; earlier, the street of Regimbart’s mistress.",
      "zh": "作品在此段提到 rue de Fleurus。",
      "fr": ""
    },
    "uncertainty": {
      "en": "The text gives a street, not number 27. Gertrude Stein’s home is a separate site and is not this fictional address.",
      "zh": "",
      "fr": ""
    }
  },
  "eds-cafe-tortoni-paris": {
    "hook": {
      "en": "December 1851: Dussardier is killed on the steps.",
      "zh": "作品在此段提到 Tortoni。",
      "fr": ""
    }
  },
};
