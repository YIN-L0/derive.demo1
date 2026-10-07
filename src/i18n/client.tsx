"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries";

type I18n = { locale: Locale; dict: Dictionary };

const Ctx = createContext<I18n | null>(null);

/** The server picks the dictionary; client components read it from here. */
export function LocaleProvider({ locale, dict, children }: I18n & { children: ReactNode }) {
  return <Ctx.Provider value={{ locale, dict }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <LocaleProvider>");
  return v;
}
