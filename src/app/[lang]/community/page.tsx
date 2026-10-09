import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { siteById, siteName, storiesForSite, workById } from "@/data/atlas";
import { AVATAR_CREDITS, activity, communityWalks, copy, memberById, members, submission, type Member } from "@/data/community";
import { type Locale, hasLocale, tr } from "@/i18n/config";

export async function generateMetadata({ params }: PageProps<"/[lang]/community">): Promise<Metadata> {
  const { lang } = await params;
  return hasLocale(lang) ? { title: tr(copy.title, lang), description: tr(copy.intro, lang) } : {};
}

function Avatar({ member, size }: { member: Member; size: number }) {
  return (
    <Image
      src={`/img/community/${member.avatar}.jpg`}
      alt=""
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}

const STATUS_STYLE = {
  published: "border-ink text-ink",
  review: "border-accent text-accent",
  sources: "border-accent text-accent",
} as const;

export default async function CommunityPage({ params }: PageProps<"/[lang]/community">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = (x: Record<Locale, string>) => tr(x, lang);
  const proposal = communityWalks.find((w) => w.id === submission.walkId)!;
  const proposer = memberById(proposal.by)!;

  return (
    <>
      <Header />
      <div className="border-b border-accent/40 bg-accent/10 px-4 py-2.5 text-center md:px-8">
        <span className="label text-accent">{t(copy.banner)}</span>
      </div>
      <main className="px-4 md:px-8">
        <section className="grid gap-8 py-16 md:grid-cols-12 md:py-24">
          <h1 className="display text-[clamp(56px,9vw,150px)] md:col-span-7">{t(copy.title)}</h1>
          <div className="self-end md:col-span-5">
            <div className="mb-5 flex -space-x-3">
              {members.slice(0, 6).map((m) => (
                <span key={m.id} className="rounded-full ring-2 ring-paper">
                  <Avatar member={m} size={44} />
                </span>
              ))}
            </div>
            <p className="text-[15px] leading-relaxed text-ink-2">{t(copy.intro)}</p>
          </div>
        </section>

        {/* ——— People ——— */}
        <section className="border-t border-ink pt-6">
          <h2 className="label mb-8">{t(copy.members)}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((m) => (
              <article key={m.id} className="flex flex-col border hairline p-5">
                <div className="flex items-start justify-between">
                  <Avatar member={m} size={72} />
                  <button className="btn h-8 px-3 text-[9.5px]" disabled>
                    {t(copy.follow)}
                  </button>
                </div>
                <h3 className="display mt-5 text-[26px] leading-tight">{m.name}</h3>
                <p className="label mt-1 text-mute">
                  {t(m.role)} · {t(m.base)}
                </p>
                <p className="display mt-4 flex-1 text-[17px] leading-snug italic">{t(m.bio)}</p>
                <p className="label mt-5 flex flex-wrap gap-x-3 gap-y-1 border-t hairline pt-3 text-ink-2">
                  <span>{m.followers} {t(copy.followers)}</span>
                  <span>{m.walks} {t(copy.walksN)}</span>
                  <span>{m.places} {t(copy.placesN)}</span>
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ——— Community walks ——— */}
        <section className="mt-24 border-t border-ink pt-6 md:mt-32">
          <h2 className="label mb-2">{t(copy.walks)}</h2>
          <ul>
            {communityWalks.map((w) => {
              const by = memberById(w.by)!;
              return (
                <li key={w.id} className="grid items-center gap-4 border-b hairline py-6 md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-6">
                    <h3 className="display text-[clamp(26px,3vw,40px)]">{t(w.title)}</h3>
                    <p className="mt-2 max-w-xl text-ink-2">{t(w.pitch)}</p>
                  </div>
                  <div className="flex items-center gap-3 md:col-span-3">
                    <Avatar member={by} size={36} />
                    <span>
                      <span className="label block text-mute">{t(copy.by)}</span>
                      <span>{by.name}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:col-span-3 md:justify-end">
                    <span className="label text-mute">
                      {w.stops} {t(copy.stops)} · {w.minutes} {t(copy.min)} · {w.saves.toLocaleString(lang)} {t(copy.saves)}
                    </span>
                    <span className={`label border px-2 py-0.5 text-[9px] ${STATUS_STYLE[w.status]}`}>{t(copy.status[w.status])}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ——— Notes left at places ——— */}
        <section className="mt-24 border-t border-ink pt-6 md:mt-32">
          <h2 className="label mb-8">{t(copy.notes)}</h2>
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {activity.map((a) => {
              const by = memberById(a.by)!;
              const site = siteById(a.siteId);
              if (!site) return null;
              const work = workById(storiesForSite(site.id)[0]?.workId ?? "");
              return (
                <article key={`${a.by}-${a.siteId}`} className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <Avatar member={by} size={40} />
                    <div>
                      <p>{by.name}</p>
                      <p className="label text-mute">{t(a.when)}</p>
                    </div>
                  </div>
                  <blockquote className="mt-4 flex-1 border-l-2 border-accent pl-4">
                    <p className="display text-[19px] leading-snug italic">{t(a.note)}</p>
                  </blockquote>
                  <Link href={`/${lang}/places/${site.id}`} className="group mt-4 flex items-baseline justify-between gap-3 border-t hairline pt-3">
                    <span className="group-hover:underline">
                      <span className="label text-mute">{t(copy.at)} </span>
                      {siteName(site, lang)}
                    </span>
                    {work && <span className="display shrink-0 text-[14px] text-mute italic">{work.title}</span>}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* ——— A proposal in review ——— */}
        <section className="mt-24 grid gap-10 border-t border-ink pt-6 md:mt-32 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="label text-mute">{t(copy.reviewLabel)}</p>
            <h2 className="display mt-4 text-[clamp(36px,4.5vw,68px)]">{t(proposal.title)}</h2>
            <p className="mt-5 max-w-md leading-relaxed text-ink-2">{t(copy.reviewBody)}</p>
            <dl className="mt-8 grid grid-cols-2 items-center gap-y-4 border-t hairline pt-5">
              <dt className="label text-mute">{t(copy.submittedBy)}</dt>
              <dd className="flex items-center gap-2">
                <Avatar member={proposer} size={28} /> {proposer.name}
              </dd>
              <dt className="label text-mute">{t(copy.sourcesAttached)}</dt>
              <dd className="label">{submission.sources}</dd>
              <dt className="label text-mute">{t(copy.confidence)}</dt>
              <dd className="label flex items-center gap-2">
                <span className="flex gap-0.5" aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className={`h-2 w-3 ${i <= submission.confidence ? "bg-ink" : "bg-line"}`} />
                  ))}
                </span>
                {t(copy.high)}
              </dd>
              <dt className="label text-mute">{t(copy.statusLabel)}</dt>
              <dd className="label text-accent">{t(copy.awaiting)}</dd>
            </dl>
          </div>
          <ol className="md:col-span-7">
            <li className="label border-b hairline pb-3 text-mute">{t(copy.reviewTitle)}</li>
            {submission.stops.map((s) => (
              <li key={s.n} className="grid grid-cols-[auto_1fr] gap-6 border-b hairline py-6">
                <span className="display text-[44px] leading-none">{s.n}</span>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="display text-[26px]">{s.title}</h3>
                    <span className={`label border px-2 py-0.5 text-[9px] ${s.verified ? "border-ink" : "border-accent text-accent"}`}>
                      {t(s.verified ? copy.verified : copy.needsSecond)}
                    </span>
                  </div>
                  <p className="label mt-1 text-mute">{s.address}</p>
                  <p className="mt-3 text-ink-2">{t(s.note)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-24 flex flex-col items-start gap-6 border-t border-ink pt-10 md:flex-row md:items-end md:justify-between">
          <p className="display max-w-2xl text-[clamp(28px,3vw,44px)] leading-[1.1]">
            {t(copy.cta)} <em className="text-mute italic">{t(copy.ctaMuted)}</em>
          </p>
          <Link href={`/${lang}/nearby`} className="btn btn-solid">{t(copy.ctaButton)}</Link>
        </section>

        <p className="mt-16 mb-24 max-w-3xl text-[12px] leading-relaxed text-mute">
          {t(copy.avatars)}{" "}
          {AVATAR_CREDITS.map((c, i) => (
            <span key={c.avatar}>
              <a href={c.source} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-2 hover:decoration-ink">
                {c.label}
              </a>
              {i < AVATAR_CREDITS.length - 1 ? "; " : "."}
            </span>
          ))}
        </p>
      </main>
      <Footer locale={lang} />
    </>
  );
}
