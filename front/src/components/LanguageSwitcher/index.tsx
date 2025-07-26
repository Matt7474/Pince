import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<div className="flex gap-2 mt-4">
			<button
				type="button"
				onClick={() => changeLanguage("fr")}
				className={`rounded-lg cursor-pointer`}
			>
				<img src="/flag-france.svg" alt="drapeau français" className="w-8" />
			</button>
			<button
				type="button"
				onClick={() => changeLanguage("en")}
				className={`rounded-lg cursor-pointer`}
			>
				<img src="/flag-uk.svg" alt="flag uk" className="w-8" />
			</button>
			<button
				type="button"
				onClick={() => changeLanguage("es")}
				className={`rounded-lg cursor-pointer`}
			>
				<img src="/flag-spain.svg" alt="flag spain" className="w-8" />
			</button>
		</div>
	);
}
