import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import MapExplorer from "@/components/MapExplorer";

export const metadata: Metadata = { title: "Map — DÉRIVE" };

export default function MapPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <Header />
      <Suspense fallback={<div className="flex-1 bg-paper-2" />}>
        <MapExplorer />
      </Suspense>
    </div>
  );
}
