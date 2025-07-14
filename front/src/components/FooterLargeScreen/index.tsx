import { useEffect } from "react";
import { Link } from "react-router-dom";
import { updateUserTheme } from "../../api/user";

export default function FooterLargeScreen() {
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

	return (
		<>
			{/* bg-[var(--color-secondary)]  */}
			<div className="bg-[var(--color-secondary)] fixed bottom-0 w-full z-21 text-sm leading-tight xl:px-40 xl:text-md 2xl:px-80">
				<div className="flex text-white font-semibold justify-around my-4 ">
					<div>
						<h2 className="">INFORMATIONS</h2>
						<div className="max-w-full mt-1 border-b-2 text-white mr-32.5" />
						<div className="mt-1 flex flex-col">
							<Link
								to={"/instructions"}
								className="cursor-pointer mt-0.5 hover:text-[var(--color-highlight)]"
							>
								Mode d'emploi
							</Link>
							<Link
								to={"/mentions"}
								className="cursor-pointer mt-0.5 hover:text-[var(--color-highlight)]"
							>
								Mentions légales
							</Link>
							<Link
								to={"/cgu"}
								className="cursor-pointer mt-0.5 hover:text-[var(--color-highlight)]"
							>
								Conditions générales d'utilisations
							</Link>
							<Link
								to={"/cookies"}
								className="cursor-pointer mt-0.5 hover:text-[var(--color-highlight)]"
							>
								Politique de confidentialité
							</Link>
						</div>
					</div>
					<div>
						<div className="text-right">
							<h2>A PROPOS DE NOUS</h2>
							<div className="max-w-full mt-1 border-b-2 text-white " />
							<div className="mt-1">
								<Link
									to={"/aboutUs"}
									className="cursor-pointer hover:text-[var(--color-highlight)]"
								>
									Qui sommes-nous ?
								</Link>
							</div>
							<div className="flex justify-self-end w-22 mb-1 mt-1 gap-2">
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
							<div className="">
								<p className="mt-1 -mb-2">Choix du thème</p>
								<div className="grid-cols-6 grid mt-3 gap-2">
									{colors.map((color) => (
										<button
											type="button"
											key={color}
											className="w-4 h-4 border-1 cursor-pointer border-black rounded-4xl"
											style={{ backgroundColor: color }}
											onClick={() => handleColorClick(color)}
											title={`Changer en ${color}`}
										></button>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="text-white text-sm -mt-10 my-3">
					<p className="text-center">© Copyright 2025 - Tous droits réservés</p>
					<a
						href="https://cv.matt-dev.fr/"
						target="_blank"
						rel="noopener noreferrer"
						className="flex justify-center -mt-1 -mb-2 cursor-pointer text-white hover:text-[var(--color-highlight)] bg-transparent border-none p-0 underline"
						// onClick={(e) => {
						// 	const confirmed = window.confirm(
						// 		"Vous allez être redirigé vers un site externe (cv.matt-dev.fr). Voulez-vous continuer ?",
						// 	);
						// 	if (!confirmed) {
						// 		e.preventDefault();
						// 	}
						// }}
					>
						Réalisé par Matt-dev.fr
					</a>
				</div>
				{/* </div> */}
			</div>
		</>
	);
}
