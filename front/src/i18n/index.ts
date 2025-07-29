import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import i18n from "i18next";

import fr from "./locales/fr.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import pl from "./locales/pl.json";
import de from "./locales/de.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import ja from "./locales/ja.json";
import cn from "./locales/cn.json";

i18n
	.use(LanguageDetector) // détecte automatiquement localStorage, navigateur, etc.
	.use(initReactI18next)
	.init({
		resources: {
			fr: { translation: fr },
			en: { translation: en },
			es: { translation: es },
			pl: { translation: pl },
			de: { translation: de },
			it: { translation: it },
			pt: { translation: pt },
			ja: { translation: ja },
			cn: { translation: cn },
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
