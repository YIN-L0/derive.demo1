import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import LangSwitch from "./LangSwitch";

export default function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <footer className="border-t hairline px-4 pt-14 pb-safe md:px-8">
      <div className="grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="display text-4xl tracking-[0.3em]">DÉRIVE</p>
          <p className="mt-4 max-w-sm text-mute">{dict.brand.definition}</p>
        </div>
        <div className="flex flex-col gap-2">
          <p className="label mb-2 text-mute">{dict.footer.explore}</p>
          <Link href={`/${locale}/nearby`} className="label">{dict.nav.nearby}</Link>
          <Link href={`/${locale}/walks`} className="label">{dict.nav.walks}</Link>
          <Link href={`/${locale}/journal`} className="label">{dict.nav.journal}</Link>
        </div>
        <div className="flex flex-col gap-2">
          <p className="label mb-2 text-mute">{dict.footer.info}</p>
          <Link href={`/${locale}/sources`} className="label">{dict.nav.sources}</Link>
          <p className="label mt-4 mb-1 text-mute">{dict.footer.language}</p>
          <LangSwitch />
        </div>
      </div>
      <div className="mt-16 flex flex-wrap justify-between gap-4 pb-4 text-mute">
        <span className="label">© 2026 Dérive · {dict.brand.edition}</span>
        <span className="label">{dict.footer.demo}</span>
      </div>
    </footer>
  );
}
