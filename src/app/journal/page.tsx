import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Journal from "@/components/Journal";

export const metadata: Metadata = { title: "Journal — DÉRIVE" };

export default function JournalPage() {
  return (
    <>
      <Header />
      <Journal />
      <Footer />
    </>
  );
}
