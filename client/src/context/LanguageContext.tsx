'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { arTranslations, type Language } from '@/locales/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  dir: 'ltr' | 'rtl';
  t: (keyOrText: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'En',
  setLanguage: () => {},
  isRTL: false,
  dir: 'ltr',
  t: (keyOrText: string, fallback?: string) => fallback || keyOrText,
});

const STORAGE_KEY = 'selam_language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('En');
  const [mounted, setMounted] = useState(false);

  // Sync document element attributes with active language
  const applyLanguageToDoc = useCallback((lang: Language) => {
    if (typeof document === 'undefined') return;
    const isArabic = lang === 'Ar';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';

    if (isArabic) {
      document.documentElement.classList.add('rtl-active');
      document.body.classList.add('rtl-active');
    } else {
      document.documentElement.classList.remove('rtl-active');
      document.body.classList.remove('rtl-active');
    }
  }, []);

  // Initialize from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === 'Ar' || saved === 'En') {
      setLanguageState(saved);
      applyLanguageToDoc(saved);
    } else {
      applyLanguageToDoc('En');
    }
  }, [applyLanguageToDoc]);

  const setLanguage = useCallback(
    (newLang: Language) => {
      setLanguageState(newLang);
      localStorage.setItem(STORAGE_KEY, newLang);
      applyLanguageToDoc(newLang);
    },
    [applyLanguageToDoc]
  );

  const isRTL = language === 'Ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const t = useCallback(
    (keyOrText: string, fallback?: string): string => {
      if (!keyOrText) return '';
      if (language === 'En') return fallback || keyOrText;

      const trimmed = keyOrText.trim();

      // Direct dictionary lookup
      if (arTranslations[keyOrText] !== undefined) {
        return arTranslations[keyOrText];
      }
      if (arTranslations[trimmed] !== undefined) {
        return arTranslations[trimmed];
      }

      // If fallback provided and contains Arabic translation
      if (fallback && fallback !== keyOrText) {
        return fallback;
      }

      return keyOrText;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
