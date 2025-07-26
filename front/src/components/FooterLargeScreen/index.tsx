import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { updateUserTheme } from "../../api/user";
import LanguageSwitcher from "../LanguageSwitcher";

export default function FooterLargeScreen() {
	const { t } = useTranslation();
	const colors = [
		"#AF0808", // rouge
		"#BB5858", // rouge clair / brique
		"#E30285", // rose / fuchsia
		"#704466", // prune
		"#6B62EA", // violet
		"#2777D3", // bleu
		"#06846F", // turquoise
		"#4A6D8C", // bleu-gris doux
		"#2F4F4F", // bleu pétrole / gris foncé
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
						<h2 className="">{t("footer.informationTitle")}</h2>
						<div className="max-w-full mt-1 border-b-2 text-white " />
						<div className="mt-1 flex flex-col">
							<Link
								to={"/instructions"}
								className="cursor-pointer mt-0.5 hover:text-[var(--color-highlight)]"
							>
								{t("footer.instruction")}
							</Link>
							<Link
								to={"/mentions"}
								className="cursor-pointer mt-0.5 hover:text-[var(--color-highlight)]"
							>
								{t("footer.legalNotice")}
							</Link>
							<Link
								to={"/cgu"}
								className="cursor-pointer mt-0.5 hover:text-[var(--color-highlight)]"
							>
								{t("footer.termsOfUse")}
							</Link>
							<Link
								to={"/cookies"}
								className="cursor-pointer mt-0.5 hover:text-[var(--color-highlight)]"
							>
								{t("footer.privacyPolicy")}
							</Link>
						</div>
					</div>
					<div>
						<div className="text-right">
							<h2>{t("footer.aboutUsTitle")}</h2>
							<div className="max-w-full mt-1 border-b-2 text-white " />
							<div className="mt-1">
								<Link
									to={"/aboutUs"}
									className="cursor-pointer hover:text-[var(--color-highlight)]"
								>
									{t("footer.aboutUsDescription")}
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
							<div className="flex ">
								<div className="mt-2 ml-3 flex">
									<label htmlFor="color-select" className="mr-2 ">
										{t("footer.themeChoice")}
									</label>
									{/** biome-ignore lint/nursery/useUniqueElementIds: <explanation> */}
									<select
										id="color-select"
										className="mt-3 border border-white rounded px-1 py-1 text-sm h-5 w-8 cursor-pointer"
										onChange={(e) => handleColorClick(e.target.value)}
									>
										{colors.map((color) => (
											<option
												key={color}
												value={color}
												style={{
													backgroundColor: color,
													// color: "transparent",
													height: "24px",
													border: "5px",
													borderColor: "black",
												}}
											></option>
										))}
									</select>
								</div>
							</div>
							<p className="mt-2 -mb-4">{t("footer.languageChoice")}</p>
							<div className="flex justify-end">
								<LanguageSwitcher />
							</div>
						</div>
					</div>
				</div>
				<div className="text-white text-sm -mt-10 my-3">
					<p className="text-center">{t("footer.copyrightNotice")}</p>
					<a
						href="https://cv.matt-dev.fr/"
						target="_blank"
						rel="noopener noreferrer"
						className="flex justify-center -mt-1 -mb-2 cursor-pointer text-white hover:text-[var(--color-highlight)] bg-transparent border-none p-0 underline"
					>
						{t("footer.madeBy")}
					</a>
				</div>
				{/* </div> */}
			</div>
		</>
	);
}
