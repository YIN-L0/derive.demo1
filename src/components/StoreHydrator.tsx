"use client";

import { useEffect } from "react";
import { useJournal } from "@/lib/store";

/** Rehydrates localStorage after mount so server and client HTML match. */
export default function StoreHydrator() {
  useEffect(() => {
    useJournal.persist.rehydrate();
  }, []);
  return null;
}
