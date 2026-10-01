import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Community — DÉRIVE" };

const CREATORS = [
  {
    initials: "LV",
    name: "Léa Vasseur",
    role: "Film programmer",
    walks: ["Rohmer's Paris, in daylight", "The Nouvelle Vague on foot"],
    followers: "2.4k",
  },
  {
    initials: "OB",
    name: "Omar Benali",
    role: "Bookseller, 5e",
    walks: ["Left Bank lending libraries", "Poets who died on Rue Descartes"],
    followers: "980",
  },
  {
    initials: "HK",
    name: "Hana Kim",
    role: "Illustrator",
    walks: ["Montparnasse ateliers", "Where the Impressionists ate"],
    followers: "5.1k",
  },
];

const SUBMISSION = [
  {
    n: "01",
    title: "Les Deux Magots",
    address: "6 Place Saint-Germain-des-Prés",
    note: "Where Baldwin is said to have gone straight from the boat train on arriving in November 1948.",
    status: "Verified",
  },
  {
    n: "02",
    title: "Café de Flore",
    address: "172 Boulevard Saint-Germain",
    note: "Upstairs tables where he worked on his first novel through the winter.",
    status: "Verified",
  },
  {
    n: "03",
    title: "Hôtel Verneuil",
    address: "8 Rue de Verneuil",
    note: "The hotel that took him in during his first hard year in the city.",
    status: "Needs second source",
  },
];

export default function CommunityPage() {
  return (
    <>
      <Header />
      <div className="border-b border-accent/40 bg-accent/10 px-4 py-2.5 text-center md:px-8">
        <span className="label text-accent">Preview — sample profiles and content, not real users</span>
      </div>
      <main className="px-4 md:px-8">
        <section className="grid gap-8 py-16 md:grid-cols-12 md:py-24">
          <h1 className="display text-[clamp(56px,9vw,150px)] md:col-span-8">Community</h1>
          <p className="self-end text-ink-2 md:col-span-4">
            Walks proposed by critics, booksellers and people who know a street better than any guidebook. Every
            submission carries its sources and is reviewed before it reaches the map.
          </p>
        </section>

        {/* ——— Creators ——— */}
        <section className="border-t border-ink pt-6">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="label">Creators</h2>
            <span className="label text-mute">Sample</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {CREATORS.map((c) => (
              <article key={c.name} className="flex flex-col border hairline p-6">
                <div className="flex items-start justify-between">
                  <span className="display flex h-16 w-16 items-center justify-center bg-ink text-[26px] text-paper">
                    {c.initials}
                  </span>
                  <button className="btn h-8 px-3 text-[9.5px]" disabled>
                    Follow
                  </button>
                </div>
                <h3 className="display mt-6 text-[30px]">{c.name}</h3>
                <p className="label text-mute">
                  {c.role} · {c.followers} followers
                </p>
                <ul className="mt-6 border-t hairline">
                  {c.walks.map((w) => (
                    <li key={w} className="display flex justify-between border-b hairline py-2.5 text-[17px] italic">
                      {w} <span className="not-italic text-mute">→</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ——— Contributor path ——— */}
        <section className="grid gap-10 py-24 md:grid-cols-12 md:py-36">
          <div className="md:col-span-5">
            <p className="label text-mute">Contributor path · in review</p>
            <h2 className="display mt-4 text-[clamp(40px,5vw,80px)]">
              Baldwin&apos;s <em className="italic">Saint-Germain</em>
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-ink-2">
              James Baldwin arrived in Paris in 1948 with forty dollars. This proposed walk traces his first years in
              the city, which he would later draw on for <em className="display text-[15px]">Giovanni&apos;s Room</em>.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-y-4 border-t hairline pt-5">
              <dt className="label text-mute">Submitted by</dt>
              <dd className="label">Sample contributor</dd>
              <dt className="label text-mute">Sources attached</dt>
              <dd className="label">5</dd>
              <dt className="label text-mute">Confidence</dt>
              <dd className="label flex items-center gap-2">
                <span className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`h-2 w-3 ${i <= 4 ? "bg-ink" : "bg-line"}`} />
                  ))}
                </span>
                High
              </dd>
              <dt className="label text-mute">Status</dt>
              <dd className="label text-accent">Awaiting editor</dd>
            </dl>
          </div>
          <ol className="md:col-span-7">
            {SUBMISSION.map((s) => (
              <li key={s.n} className="grid grid-cols-[auto_1fr] gap-6 border-b hairline py-6 first:border-t">
                <span className="display text-[44px] leading-none">{s.n}</span>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="display text-[26px]">{s.title}</h3>
                    <span
                      className={`label border px-2 py-0.5 text-[9px] ${
                        s.status === "Verified" ? "border-ink" : "border-accent text-accent"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <p className="label mt-1 text-mute">{s.address}</p>
                  <p className="mt-3 text-ink-2">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-24 flex flex-col items-start gap-6 border-t border-ink pt-10 md:flex-row md:items-end md:justify-between">
          <p className="display max-w-2xl text-[clamp(28px,3vw,44px)] leading-[1.1]">
            Know a street that belongs in a book? <em className="italic text-mute">Submissions open with the beta.</em>
          </p>
          <Link href="/map" className="btn btn-solid">Back to the map</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
