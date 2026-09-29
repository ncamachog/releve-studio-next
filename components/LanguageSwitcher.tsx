"use client";

import { useTransition } from "react";
import { setLocale } from "@/app/locale-actions";
import { LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "./LocaleProvider";

export default function LanguageSwitcher() {
  const { locale, t } = useLocale();
  const [pending, start] = useTransition();

  const choose = (next: Locale) => {
    if (next === locale) return;
    start(() => setLocale(next));
  };

  return (
    <div className="r-lang" role="group" aria-label={t.ui.language} aria-busy={pending}>
      {LOCALES.map((l) => (
        <button key={l} type="button" lang={l} className={l === locale ? "is-active" : undefined} aria-pressed={l === locale} onClick={() => choose(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
