import { createContext, useContext, useCallback, ReactNode } from 'react';
import { translations, TranslationKey } from './translations';

interface I18nContextValue {
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const t = useCallback((key: TranslationKey) => {
    return translations.fr[key] || key;
  }, []);

  return (
    <I18nContext.Provider value={{ t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
