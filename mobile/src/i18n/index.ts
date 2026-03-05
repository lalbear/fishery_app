/**
 * i18n Internationalization Configuration
 * Multi-language support for rural Indian farmers
 */

import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import en from './locales/en.json';
import hi from './locales/hi.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
};

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lng: string | readonly string[] | undefined) => void | undefined) => {
    try {
      const savedLanguage = await AsyncStorage.getItem('@fishing_god_language');
      if (savedLanguage) {
        callback(savedLanguage);
        return savedLanguage;
      }
    } catch (e) { }
    const defaultLng = Localization.getLocales()[0]?.languageCode || 'en';
    callback(defaultLng);
    return defaultLng;
  },
  init: () => { },
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('@fishing_god_language', lng);
    } catch (e) { }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;