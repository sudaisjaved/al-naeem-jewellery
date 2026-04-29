import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/index.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [langCode, setLangCode] = useState('en');

  const t = translations[langCode];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = t.lang;
    root.dir = t.dir;
    root.setAttribute('data-theme', t.theme);
  }, [t]);

  return (
    <LanguageContext.Provider value={{ langCode, setLangCode, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
