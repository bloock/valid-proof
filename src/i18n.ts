import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n
  // i18next-http-backend
  // loads translations from your server
  // https://github.com/i18next/i18next-http-backend
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    supportedLngs: ["en"],
    fallbackLng: "en",
    nonExplicitSupportedLngs: true,
    backend: {
      allowMultiLoading: false,
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
