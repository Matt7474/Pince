import { changeLanguage } from "i18next";
import i18next from "i18next";
import { useState } from "react";

const flags = [
	{ code: "fr", src: "/flag-france.svg", alt: "flag france" },
	{ code: "en", src: "/flag-uk.svg", alt: "flag united kingdom" },
	{ code: "es", src: "/flag-spain.svg", alt: "flag spanish" },
	{ code: "pl", src: "/flag-poland.svg", alt: "flag poland" },
	{ code: "de", src: "/flag-deutschland.svg", alt: "flag deutschland" },
	{ code: "it", src: "/flag-italy.svg", alt: "flag italy" },
	{ code: "pt", src: "/flag-portugal.svg", alt: "flag portugal" },
	{ code: "ja", src: "/flag-japan.svg", alt: "flag japan" },
	{ code: "cn", src: "/flag-china.svg", alt: "flag china" },
];

export default function LanguageSwitcher() {
	const currentLangIndex = flags.findIndex((f) => f.code === i18next.language);

	const [index, setIndex] = useState(
		currentLangIndex >= 0 ? currentLangIndex : 0,
	);

	const previousImgIndex = (index - 1 + flags.length) % flags.length;
	const nextImgIndex = (index + 1) % flags.length;

	const handleSwitch = (newIndex: number) => {
		setIndex(newIndex);
		changeLanguage(flags[newIndex].code);
	};

	return (
		<div className="flex items-center gap-4 mt-4 transition-all duration-300">
			<button
				type="button"
				onClick={() => handleSwitch(previousImgIndex)}
				className="text-xl cursor-pointer"
			>
				❮
			</button>

			<img
				key={previousImgIndex}
				src={flags[previousImgIndex].src}
				alt={flags[previousImgIndex].alt}
				className="w-5 h-5 object-contain opacity-60 transition-transform duration-300 hover:scale-110"
			/>

			<img
				key={index}
				src={flags[index].src}
				alt={flags[index].alt}
				className="w-8 h-8 object-contain transition-transform duration-300 transform scale-100 hover:scale-110"
			/>

			<img
				key={nextImgIndex}
				src={flags[nextImgIndex].src}
				alt={flags[nextImgIndex].alt}
				className="w-5 h-5 object-contain opacity-60 transition-transform duration-300 hover:scale-110"
			/>

			<button
				type="button"
				onClick={() => handleSwitch(nextImgIndex)}
				className="text-xl cursor-pointer"
			>
				❯
			</button>
		</div>
	);
}
