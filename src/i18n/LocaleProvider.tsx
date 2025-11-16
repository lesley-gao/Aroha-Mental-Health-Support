/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useState } from 'react';
import type { Locale, Messages } from './messages';
import { getMessages } from './messages';
import { getLanguage, setLanguage } from '../utils/storage';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof Messages) => string | string[];
};

export const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const saved = getLanguage() as Locale;
      if (saved) setLocaleState(saved);
    } catch {
      // ignore and keep default
    }
  }, []);

  const setLocale = (l: Locale) => {
    try {
      setLanguage(l);
    } catch {
      // ignore storage errors
    }
    setLocaleState(l);
  };

  const t = (key: keyof Messages): string | string[] => {
    const msgs = getMessages(locale);
    // Return the string or array if present, otherwise return the key as a fallback
    return msgs[key] ?? String(key);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
};

export default LocaleProvider;
