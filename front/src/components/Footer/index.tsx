import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { updateUserTheme } from "../../api/user";

export default function Footer() {
	// Modification de la couleur secondaire et persistance dans le localStorage
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

	useEffect(() => {
		const savedColor = localStorage.getItem("color-secondary");
		if (savedColor) {
			document.documentElement.style.setProperty(
				"--color-secondary",
				savedColor,
			);
		}
	}, []);

	const handleColorClick = async (color: string) => {
		document.documentElement.style.setProperty("--color-secondary", color);
		localStorage.setItem("color-secondary", color);

		try {
			await updateUserTheme(color);
		} catch (error) {
			console.error("Erreur lors de la sauvegarde du thème :", error);
		}
	};

	const [infosIsOpen, setInfosIsOpen] = useState(false);
	const location = useLocation();

	// Déduction du menu actif selon l'URL
	const pathname = location.pathname;
	const activeMenu = pathname.includes("/budget")
		? "budget"
		: ["/homepage", "/home"].includes(pathname)
			? "home"
			: "other";

	// Fermeture modale via touche Echap
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && infosIsOpen) {
				setInfosIsOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [infosIsOpen]);

	// Permet d'avoir l'indicateur "info" dans les pages suivantes
	const isInfosPage = [
		"/mode-emploi",
		"/mentions",
		"/cgu",
		"/cookies",
		"/aboutUs",
	].includes(pathname);

	return (
		<>
			<div className="bg-[var(--color-secondary)] fixed bottom-0 w-full z-21 md:px-20 lg:px-40 xl:px-100 2xl:px-120">
				<div className="max-w-full flex justify-between mx-10 pt-4 pb-4">
					<Link
						onClick={() => setInfosIsOpen(false)}
						to="/homepage"
						className={`flex flex-col items-center text-xl font-semibold text-white pb-1 ${
							activeMenu === "home"
								? "border-b-4 border-[var(--color-highlight)]"
								: ""
						}`}
					>
						<img
							src="/home.svg"
							alt="icone accueil"
							className="w-9 mt-0.5 mb-1"
						/>
					</Link>

					<Link
						onClick={() => setInfosIsOpen(false)}
						to="/budgets"
						className={`flex flex-col items-center text-xl font-semibold text-white pb-1 ${
							activeMenu === "budget"
								? "border-b-4 border-[var(--color-highlight)]"
								: ""
						}`}
					>
						<img src="/budget.svg" alt="icone budget" className="w-7 mb-1" />
					</Link>

					<Link
						to="#"
						onClick={() => {
							setInfosIsOpen((prev) => !prev);
						}}
						className={`flex flex-col items-center text-xl font-semibold text-white pb-1 ${
							infosIsOpen || isInfosPage
								? "border-b-4 border-[var(--color-highlight)]"
								: ""
						}`}
					>
						<img src="/infos.svg" alt="icone infos" className="w-9 mb-1" />
					</Link>
				</div>
			</div>

			{/* Modale Infos */}
			{infosIsOpen && (
				// biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
				<div
					className="fixed inset-0 flex items-center justify-center z-20 sm:mx-20 md:mx-36"
					onClick={() => setInfosIsOpen(false)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") setInfosIsOpen(false);
					}}
				>
					<div
						className="bg-[var(--color-secondary)] rounded-2xl shadow-[0_6px_10px] w-9/10 sm:w-3/4 lg:w-2/3 xl:w-4/7 2xl:w-2/7 p-1"
						role="dialog"
						tabIndex={-1}
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
							}
						}}
					>
						{/* contenu Modale */}
						<div>
							<ul className="pl-3 py-6 text-white font-semibold text-start leading-5">
								<p className=" mb-6 text-lg font-bold">INFORMATIONS</p>
								<div className="max-w-full mr-3 mb-6 -mt-5 border-b-2 text-white " />

								<li className="">
									<Link
										to={"/instructions"}
										className="hover:text-[var(--color-highlight)]"
										onClick={() => setInfosIsOpen(false)}
									>
										Mode d'emploi
									</Link>
								</li>
								<li className="">
									<Link
										to={"/mentions"}
										className="hover:text-[var(--color-highlight)]"
										onClick={() => setInfosIsOpen(false)}
									>
										Mentions légales
									</Link>
								</li>
								<li className="">
									<Link
										to={"/cgu"}
										className="hover:text-[var(--color-highlight)]"
										onClick={() => setInfosIsOpen(false)}
									>
										Conditions générales d'utilisation
									</Link>
								</li>
								<li className="">
									<Link
										to={"/cookies"}
										className="text-white hover:text-[var(--color-highlight)]"
										onClick={() => setInfosIsOpen(false)}
									>
										Politique de confidentialité
									</Link>
								</li>
								<p className="flex  mb-1">
									<Link
										to={"/aboutUs"}
										className="text-white hover:text-[var(--color-highlight)]"
										onClick={() => setInfosIsOpen(false)}
									>
										Qui sommes-nous ?
									</Link>
								</p>

								<div className="flex w-24 mb-1 mt-2 gap-2">
									<a
										href="https://linkedin.com/in/matthieu-dimier-a51539290"
										target="_blank"
										rel="noopener noreferrer"
									>
										<img
											src="/linkedin.svg"
											alt="logo linkedin"
											className="bg-gray-200 rounded-sm"
										/>
									</a>
									<a
										href="https://github.com/Matt7474"
										target="_blank"
										rel="noopener noreferrer"
									>
										<img
											src="/github.svg"
											alt="logo github"
											className="bg-gray-200 rounded-sm "
										/>
									</a>
									<a
										href="mailto:dimier.matt.dev@gmail.com?subject=Contact%20depuis%20le%20site%20la%20pince&body=Bonjour Matthieu,"
										aria-label="Envoyer un mail"
									>
										<img
											src="/gmail.svg"
											alt="logo gmail"
											className="bg-gray-200 rounded-sm"
										/>
									</a>
								</div>
								<div>
									<p className="mt-3 -mb-2">Choix du thème</p>
									<div className="flex mt-3 gap-2">
										{colors.map((color) => (
											<button
												type="button"
												key={color}
												className="w-5 h-5 border-1 cursor-pointer border-black rounded-4xl"
												style={{ backgroundColor: color }}
												onClick={() => handleColorClick(color)}
												title={`Changer en ${color}`}
											></button>
										))}
									</div>
								</div>
							</ul>

							<div className="text-white text-sm flex flex-col">
								<p className="text-center">
									© Copyright 2025 - Tous droits réservés
								</p>
								<a
									href="https://cv.matt-dev.fr/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-center cursor-pointer text-white hover:text-[var(--color-highlight)] bg-transparent border-none p-0 underline"
								>
									Réalisé par Matt-dev.fr
								</a>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
