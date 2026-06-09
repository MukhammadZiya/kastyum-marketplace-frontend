import { useEffect, useRef, useState } from "react";
import { flagEmoji, LOCALE_REGION } from "../i18n/localeFlags";
import { useI18nActions, useI18nState, useT } from "../i18n";
import type { Locale } from "../i18n/types";

const LOCALES: { value: Locale; labelKey: string }[] = [
  { value: "uz", labelKey: "common.localeNameUz" },
  { value: "ru", labelKey: "common.localeNameRu" },
  { value: "kk", labelKey: "common.localeNameKk" },
  { value: "en", labelKey: "common.localeNameEn" },
];

export function AdminLanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { locale } = useI18nState();
  const { setLocale } = useI18nActions();
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const currentFlag = flagEmoji(LOCALE_REGION[locale]);

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-[22px] leading-none shadow-sm transition hover:border-[#FDA4AF] hover:bg-[#FFF1F2]"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("common.ariaLanguageMenu")}
      >
        <span aria-hidden className="select-none">
          {currentFlag}
        </span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t("common.ariaLanguageMenu")}
          className="absolute right-0 z-[10000] mt-2 min-w-[11rem] rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-xl"
        >
          {LOCALES.map(({ value, labelKey }) => (
            <li key={value} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={locale === value}
                onClick={() => {
                  setLocale(value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-bold transition sm:text-[14px] ${
                  locale === value
                    ? "bg-[#FFF1F2] text-[#BE123C]"
                    : "text-slate-900 hover:bg-[#FAFAFB]"
                }`}
              >
                <span className="text-lg leading-none select-none" aria-hidden>
                  {flagEmoji(LOCALE_REGION[value])}
                </span>
                {t(labelKey)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
