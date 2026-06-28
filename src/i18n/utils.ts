// Translation accessor — the resx ResourceManager equivalent. Give it the
// page's locale (Astro.currentLocale), get back a typed `t(key)`.
import { ui, defaultLang } from './ui';

// Valid keys = the keys of the canonical `en` block. Referencing anything else
// is a compile error, so the dictionary and its callers can't drift apart.
export type UiKey = keyof (typeof ui)[typeof defaultLang];

export function useTranslations(locale: string | undefined) {
  // Unknown/undefined locales (e.g. the default route, where currentLocale can
  // be undefined) resolve to the default language.
  const lang = (locale && locale in ui ? locale : defaultLang) as keyof typeof ui;
  return function t(key: UiKey): string {
    // Fall back to the canonical string if a locale is missing this key.
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}
