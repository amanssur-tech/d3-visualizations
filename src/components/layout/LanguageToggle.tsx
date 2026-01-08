// src/components/layout/LanguageToggle.tsx
/**
 * LanguageToggle renders the compact EN/DE switcher used in the navbar.
 * It receives:
 * - activeLanguage: the current app language
 * - languages: array of supported languages
 * - translate: translation function
 * - onChange: callback to switch languages
 *
 * This keeps Navbar.tsx cleaner and separates language logic + UI.
 */

import type { SupportedLanguage } from '../../i18n/types';
import type { ReactElement } from 'react';

interface LanguageToggleProps {
  activeLanguage: SupportedLanguage;
  languages: SupportedLanguage[];
  translate: (key: string) => string;
  onChange: (lang: SupportedLanguage) => void;
}

const LanguageToggle = ({
  activeLanguage,
  languages,
  translate,
  onChange,
}: LanguageToggleProps): ReactElement => {
  return (
    // Tweak: pill styling + spacing of the language toggle container lives here.
    <fieldset className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1 text-xs font-semibold text-slate-600 shadow-sm shadow-slate-200/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:shadow-black/40">
      <legend className="sr-only">{translate('navbar.languageToggle.aria')}</legend>
      {languages.map((lang) => {
        const isActive = activeLanguage === lang;
        return (
          <button
            key={lang}
            type="button"
            onClick={() => !isActive && onChange(lang)}
            // Tweak: active/inactive button states—adjust colors, glow, or spacing here.
            className={`inline-flex items-center rounded-full px-3 py-1 transition-all duration-200 ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm shadow-cyan-500/25 ring-1 ring-cyan-200/60 dark:bg-neutral-900 dark:text-white dark:shadow-cyan-500/30 dark:ring-cyan-400/40'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            aria-pressed={isActive}
          >
            {/* Tweak: visible language labels (short codes) per locale. */}
            <span aria-hidden="true">
              {translate(lang === 'en' ? 'navbar.languageToggle.en' : 'navbar.languageToggle.de')}
            </span>
            {/* Tweak: accessible text for screen readers. */}
            <span className="sr-only">
              {translate(lang === 'en' ? 'common.languages.english' : 'common.languages.german')}
            </span>
          </button>
        );
      })}
    </fieldset>
  );
};

export default LanguageToggle;
