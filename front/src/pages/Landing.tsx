import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
	const words = ["ECONOMISEZ", "VOYAGEZ", "PROFITEZ"];
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const token = sessionStorage.getItem("authToken");

	useEffect(() => {
		async function loadTheme() {
			try {
				const res = await fetch("/api/users/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await res.json();
				if (data.theme) {
					document.documentElement.style.setProperty(
						"--color-secondary",
						data.theme,
					);
				}
			} catch (err) {
				console.error(err);
			}
		}
		loadTheme();
	}, []);

	useEffect(() => {
		if (currentWordIndex < words.length) {
			const timer = setTimeout(() => {
				setCurrentWordIndex((prev) => prev + 1);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [currentWordIndex]);

	return (
		<div className="flex flex-col items-center">
			<div className="relative bg-[url('/island.png')] rounded-3xl bg-cover bg-center w-90 h-140 mt-11 shadow-md overflow-hidden">
				{/* Texte centré au 1/8 de l'image */}
				<div className="absolute top-7 left-1/2 transform -translate-x-1/2 text-center w-full">
					<p className="text-3xl text-white font-bold drop-shadow-lg">
						AVEC LA PINCE
					</p>
				</div>
				<div className="absolute top-1/8 w-full text-center flex flex-col gap-1">
					{words.slice(0, currentWordIndex).map((word) => (
						<p
							key={word}
							className="text-3xl text-white font-bold drop-shadow-lg animate-fade-in"
						>
							{word}
						</p>
					))}
				</div>
			</div>

			<Link
				to="/login"
				className="btn bg-[var(--color-secondary)]! text-white text-xl flex justify-self-center font-semibold mt-11 p-2 pt-1 px-4 rounded-lg transition hover:opacity-90 cursor-pointer"
			>
				Se connecter
			</Link>
		</div>
	);
}
