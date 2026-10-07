import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ontology, siteById, siteName, sourceRegistry } from "@/data/atlas";
import { allArtworks, allPhotos } from "@/data/media";
import { type Locale, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export async function generateMetadata({ params }: PageProps<"/[lang]/sources">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: getDictionary(lang).sources.title } : {};
}

// The atlas's method sheets exist in English and Chinese; French is ours, keyed by the English concept.
const FR_ONTOLOGY: Record<string, [string, string, string]> = {
  "Textual place": ["Lieu textuel", "L'œuvre nomme explicitement le lieu réel. Ne jamais le rétrograder en « déduit ».", "Le Select dans Le soleil se lève aussi"],
  "Inferred place": ["Lieu déduit", "Le texte donne assez d'indices pour proposer une identification réelle, sans la nommer explicitement.", "Madame Lecomte's ≈ probablement 33 quai d'Anjou"],
  "Biographical place": ["Lieu biographique", "L'auteur ou l'artiste y a réellement vécu, travaillé, rencontré des gens ou passé un temps documenté.", "74 rue du Cardinal-Lemoine"],
  "Inspiration place": ["Lieu d'inspiration", "Un fait ou un lieu réel documenté nourrit plausiblement l'œuvre. À distinguer de l'occurrence dans le texte.", "Le Dingo Bar comme histoire biographique Hemingway–Fitzgerald"],
  "Adaptation / filming location": ["Adaptation / lieu de tournage", "Là où une adaptation ou un film a été physiquement tourné. Ne jamais le confondre avec l'adresse fictive du récit.", "La cour où a été filmé l'appartement de Céline"],
  "Textual / dialogue anchor": ["Ancrage textuel / dialogue", "Une courte phrase, fondée sur la source, qui prouve le lien entre le lieu et l'œuvre. Citations brèves.", "« I… went over to the Dingo. »"],
  "Narrative consequence": ["Conséquence narrative", "Ce qui change parce que la scène a lieu : relation, savoir, destination, conflit ou décision.", "Brett et Mike se joignent au voyage en Espagne"],
  "Spatial function": ["Fonction spatiale", "Ce que la géométrie du lieu fait à l'histoire : seuil, couloir, plaque tournante, enclos, saut, itinéraire.", "Le Select = poste d'aiguillage social"],
  "Evidence rule": ["Règle de preuve", "Les champs factuels doivent être sourcés. L'interprétation peut être littéraire, mais ne peut pas inventer d'événements.", "Texte original > archive officielle > recherche > reconstitution spécialisée > source touristique ou amateur"],
  "Uncertainty rule": ["Règle d'incertitude", "« Inconnu » ou « probable » sont des réponses finales valables. Ne jamais fabriquer de précision pour compléter une carte.", "La devanture exacte du bal musette reste non résolue"],
  "Untapped Cities status": ["Statut d'Untapped Cities", "Source de repérage, ni œuvre originale ni vérité de terrain. Sert à générer des candidats revérifiés ailleurs.", "The Hemingway Map of Paris"],
};
const FR_REGISTRY: Record<string, [string, string]> = {
  "Primary film / primary literary text": ["Intrigue, formulation, itinéraire, lieux nommés", "Le plus fiable pour ce que l'œuvre contient réellement"],
  "Film France / CNC": ["Confirmation officielle française des lieux de tournage", "Élevée"],
  "Wikisource / public-domain text": ["Vérification chapitre par chapitre du Soleil se lève aussi", "Texte original"],
  "Paris Atlas": ["Adresses historiques, biographies et gestion de l'incertitude, affirmation par affirmation", "Source secondaire solide ; conserver les incertitudes qu'elle signale"],
  "Hemingway Society": ["Recherche biographique et contexte d'archives", "Grande valeur scientifique"],
  "Shakespeare and Company official history": ["Distingue la boutique d'origine de Sylvia Beach de son successeur moderne", "Source institutionnelle officielle"],
  "Untapped Cities — Hemingway Map": ["Repérage de candidats et inspiration de parcours", "Utile pour le repérage ; ancien article de voyage, pas une vérité de terrain"],
  "Movie-Locations / Movieloci / Framepin": ["Reconstitution des lieux de Before Sunset", "Sources secondaires spécialisées utiles ; à recouper avec le film"],
  "Current venue / City of Paris sites": ["Accès et informations actuelles", "Fiable pour le fonctionnement actuel ; dynamique, à actualiser"],
};

type Cell = { en: string; zh: string };
const col = (row: Record<string, Cell>, i: number) => Object.values(row)[i] ?? { en: "", zh: "" };
const pick = (c: Cell, locale: Locale) => (locale === "zh" ? c.zh || c.en : c.en);

export default async function SourcesPage({ params }: PageProps<"/[lang]/sources">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <Header />
      <main className="px-4 md:px-8">
        <section className="grid gap-6 py-16 md:grid-cols-12 md:py-24">
          <h1 className="display text-[clamp(48px,7vw,110px)] md:col-span-7">{dict.sources.title}</h1>
          <p className="self-end text-[15px] leading-relaxed text-ink-2 md:col-span-5">{dict.sources.intro}</p>
        </section>

        <section className="grid gap-8 border-t border-ink py-8 md:grid-cols-12">
          <h2 className="label md:col-span-3">{dict.sources.ontology}</h2>
          <ul className="md:col-span-9">
            {ontology.map((row) => {
              const [concept, rule, example] = [col(row, 0), col(row, 1), col(row, 2)];
              const fr = FR_ONTOLOGY[concept.en];
              const [c, r, e] = lang === "fr" && fr ? fr : [pick(concept, lang), pick(rule, lang), pick(example, lang)];
              return (
                <li key={concept.en} className="grid gap-2 border-b hairline py-4 md:grid-cols-3 md:gap-6">
                  <span className="display text-[19px]">{c}</span>
                  <span className="text-[14px] leading-relaxed text-ink-2 md:col-span-2">
                    {r}
                    <span className="mt-1 block text-[13px] text-mute italic">{e}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="grid gap-8 border-t border-ink py-8 md:grid-cols-12">
          <h2 className="label md:col-span-3">{dict.sources.registry}</h2>
          <ul className="md:col-span-9">
            {sourceRegistry.map((row) => {
              const [source, use, rel] = [col(row, 0), col(row, 1), col(row, 2)];
              const fr = FR_REGISTRY[source.en];
              const name = lang === "zh" ? source.zh || source.en : source.en;
              const [u, r] = lang === "fr" && fr ? fr : [pick(use, lang), pick(rel, lang)];
              return (
                <li key={source.en} className="grid gap-2 border-b hairline py-4 md:grid-cols-3 md:gap-6">
                  <span>{name}</span>
                  <span className="text-[14px] text-ink-2">{u}</span>
                  <span className="text-[14px] text-mute">{r}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="grid gap-8 border-t border-ink py-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <h2 className="label">{dict.sources.photos}</h2>
            <p className="mt-3 text-mute">{dict.sources.photosNote}</p>
          </div>
          <ul className="md:col-span-9">
            {allPhotos.map(([id, p]) => (
              <li key={id} className="grid gap-1 border-b hairline py-3 md:grid-cols-3">
                <span>{siteName(siteById(id)!, lang)}</span>
                <span className="text-mute">{p.author}</span>
                <a href={p.source} target="_blank" rel="noreferrer" className="label link-underline justify-self-start text-mute md:justify-self-end">{p.license}</a>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-8 border-t border-ink py-8 md:grid-cols-12">
          <div className="md:col-span-3">
            <h2 className="label">{dict.sources.art}</h2>
            <p className="mt-3 text-mute">{dict.sources.artNote}</p>
          </div>
          <ul className="md:col-span-9">
            {allArtworks.map(([id, a]) => (
              <li key={id} className="grid gap-1 border-b hairline py-3 md:grid-cols-3">
                <span className="display text-[16px] italic">{a.title}</span>
                <span className="text-mute">{a.artist}, {a.year}</span>
                <a href={a.source} target="_blank" rel="noreferrer" className="label link-underline justify-self-start text-mute md:justify-self-end">{a.license}</a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mb-24 max-w-2xl space-y-3 pt-8 text-mute">
          <p>{dict.sources.map}</p>
          <p>{dict.sources.disclaimer}</p>
        </div>
      </main>
      <Footer locale={lang} />
    </>
  );
}
