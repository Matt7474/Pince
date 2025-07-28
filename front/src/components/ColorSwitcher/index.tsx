import { useState } from "react";
import { updateUserTheme } from "../../api/user";

const colors = [
	"#AF0808", // rouge
	"#BB5858", // rouge clair / brique
	"#E30285", // rose / fuchsia
	"#704466", // prune
	"#6B62EA", // violet
	"#2777D3", // bleu
	"#4A6D8C", // bleu-gris doux
	"#2F4F4F", // bleu pétrole / gris foncé
	"#06846F", // turquoise
	"#2A8442", // vert
	"#667C4F", // vert kaki
	"#A67E2E", // moutarde
];

export default function ColorSwitcher() {
	const [index, setIndex] = useState(0);

	const handlePrev = () => {
		const newIndex = (index - 1 + colors.length) % colors.length;
		setIndex(newIndex);
	};

	const handleNext = () => {
		const newIndex = (index + 1) % colors.length;
		setIndex(newIndex);
	};

	const handleColorClick = async (color: string) => {
		document.documentElement.style.setProperty("--color-secondary", color);
		localStorage.setItem("color-secondary", color);

		try {
			await updateUserTheme(color);
		} catch (error) {
			console.error("Erreur lors de la sauvegarde du thème :", error);
		}
	};

	return (
		<div className="flex items-center gap-5 mt-4">
			<button
				type="button"
				onClick={handlePrev}
				className="text-xl cursor-pointer"
			>
				❮
			</button>
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
			<div
				className="rounded-4xl border w-5 h-5"
				style={{ backgroundColor: colors[index] }}
				onClick={() => handleColorClick(colors[index])}
			></div>
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
