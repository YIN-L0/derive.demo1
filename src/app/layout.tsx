import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter_Tight } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import StoreHydrator from "@/components/StoreHydrator";

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

export const metadata: Metadata = {
  title: "DÉRIVE — Paris",
  description:
    "The map that turns cities into living books, films, paintings and memories. Walk Before Sunset and Hemingway's Paris.",
};

export const viewport: Viewport = {
  themeColor: "#f4f3ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bodoni.variable} ${inter.variable} antialiased`}>
      <body className="min-h-dvh">
        <StoreHydrator />
        {children}
      </body>
    </html>
  );
}
