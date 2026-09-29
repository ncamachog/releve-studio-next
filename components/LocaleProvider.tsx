"use client";

import { createContext, useContext } from "react";
import { getContent, type Content } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

const Ctx = createContext<{ locale: Locale; t: Content }>({ locale: "es", t: getContent("es") });

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Ctx.Provider value={{ locale, t: getContent(locale) }}>{children}</Ctx.Provider>;
}

/** Idioma y textos para componentes de cliente. */
export const useLocale = () => useContext(Ctx);
