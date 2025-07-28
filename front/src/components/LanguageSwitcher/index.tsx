import { changeLanguage } from "i18next";
import { useState } from "react";

const flags = [
	{ code: "fr", src: "/flag-france.svg", alt: "Drapeau français" },
	{ code: "en", src: "/flag-uk.svg", alt: "Drapeau anglais" },
	{ code: "es", src: "/flag-spain.svg", alt: "Drapeau espagnol" },
	{ code: "pl", src: "/flag-poland.svg", alt: "Drapeau polonais" },
];

export default function LanguageSwitcher() {
	const [index, setIndex] = useState(0);

	const handlePrev = () => {
		const newIndex = (index - 1 + flags.length) % flags.length;
		setIndex(newIndex);
	};

	const handleNext = () => {
		const newIndex = (index + 1) % flags.length;
		setIndex(newIndex);
	};

	return (
		<div className="flex items-center gap-4 mt-4">
			<button
				type="button"
				onClick={handlePrev}
				className="text-xl cursor-pointer"
			>
				❮
			</button>
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<img
				src={flags[index].src}
				alt={flags[index].alt}
				className="w-7 h-7 object-contain block cursor-pointer"
				onClick={() => changeLanguage(flags[index].code)}
			/>
			<button
				type="button"
				onClick={handleNext}
				className="text-xl cursor-pointer"
			>
				❯
			</button>
		</div>
	);
}
