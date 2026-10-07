import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Bodoni_Moda, Inter_Tight, Noto_Serif_SC } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "../globals.css";
import StoreHydrator from "@/components/StoreHydrator";
import { HTML_LANG, LOCALES, hasLocale } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/client";
import { getDictionary } from "@/i18n/dictionaries";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

const inter = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// Chinese display serif. Google serves it in unicode-range slices, so pages
// without Chinese text never download it.
const notoSerifSC = Noto_Serif_SC({
  variable: "--font-serif-sc",
  weight: ["400", "500"],
  preload: false,
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: { default: "DÉRIVE — Paris", template: "%s — DÉRIVE" },
    description: dict.brand.tagline,
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [HTML_LANG[l], `/${l}`])) },
  };
}

export const viewport: Viewport = {
  themeColor: "#f4f3ef",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={HTML_LANG[lang]} className={`${bodoni.variable} ${inter.variable} ${notoSerifSC.variable} antialiased`}>
      <body className="min-h-dvh">
        <LocaleProvider locale={lang} dict={getDictionary(lang)}>
          <StoreHydrator />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
