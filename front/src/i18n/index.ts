import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import fr from "./locales/fr.json";
import en from "./locales/en.json";
import es from "./locales/es.json";

i18n
	.use(LanguageDetector) // détecte automatiquement localStorage, navigateur, etc.
	.use(initReactI18next)
	.init({
		resources: {
			fr: { translation: fr },
			en: { translation: en },
			es: { translation: es },
		},
		fallbackLng: "fr",
		interpolation: {
			escapeValue: false, // sécurité inutile dans React
		},
		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
		},
	});

export default i18n;
