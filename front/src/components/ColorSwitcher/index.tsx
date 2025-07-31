import { useState, useEffect } from "react";
import { updateUserTheme } from "../../api/user";

const colors = [
	"#06846F",
	"#AF0808",
	"#BB5858",
	"#E30285",
	"#704466",
	"#6B62EA",
	"#2777D3",
	"#4A6D8C",
	"#2F4F4F",
	"#2A8442",
	"#667C4F",
	"#A67E2E",
];

export default function ColorSwitcher() {
	const storedColor = localStorage.getItem("color-secondary");

	const initialIndex = storedColor
		? colors.findIndex((c) => c === storedColor)
		: -1;

	const [index, setIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

	useEffect(() => {
		document.documentElement.style.setProperty(
			"--color-secondary",
			colors[index],
		);
	}, [index]);

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
				onClick={() => {
					const newIndex = (index - 1 + colors.length) % colors.length;
					setIndex(newIndex);
					handleColorClick(colors[newIndex]);
				}}
				className="text-xl cursor-pointer"
			>
				❮
			</button>

			{/* Couleur précédente */}
			<div
				className="rounded-4xl border w-4 h-4 opacity-60"
				style={{
					backgroundColor: colors[(index - 1 + colors.length) % colors.length],
				}}
			></div>

			{/* Couleur actuelle */}
			<div
				className="rounded-4xl border w-6 h-6 xl:w-5 xl:h-5"
				style={{ backgroundColor: colors[index] }}
			></div>

			{/* Couleur suivante */}
			<div
				className="rounded-4xl border w-4 h-4 opacity-60"
				style={{ backgroundColor: colors[(index + 1) % colors.length] }}
			></div>

			<button
				type="button"
				onClick={() => {
					const newIndex = (index + 1) % colors.length;
					setIndex(newIndex);
					handleColorClick(colors[newIndex]);
				}}
				className="text-xl cursor-pointer"
			>
				❯
			</button>
		</div>
	);
}
