import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      "Add New Doc": "Add new doc",
      "Add Button": "Add",
      "Document Name": "Doc Name",
      "Document URL": "Doc URL",
    },
  },
  it: {
    translation: {
      "Add New Doc": "Aggiungi un nuovo documento",
      "Add Button": "Aggiungi",
      "Document Name": "Nome del documento",
      "Document URL": "Doc URL",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
