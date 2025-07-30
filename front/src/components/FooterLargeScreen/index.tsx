import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ColorSwitcher from "../ColorSwitcher";
import LanguageSwitcher from "../LanguageSwitcher";

export default function FooterLargeScreen() {
	const { t } = useTranslation();

	useEffect(() => {
		const savedColor = localStorage.getItem("color-secondary");
		if (savedColor) {
			document.documentElement.style.setProperty(
				"--color-secondary",
				savedColor,
			);
		}
	}, []);

	return (
		<>
			<div className="bg-[var(--color-secondary)] fixed bottom-0 w-full z-50 text-sm leading-tight xl:px-40 xl:text-lg 2xl:px-100 overflow-hidden">
				<div className="flex text-white font-semibold justify-between my-4 gap-8">
					<div>
						<h2 className="">{t("footer.informationTitle")}</h2>
						<div className="max-w-full mt-1 border-b-2 text-white " />
						<div className="mt-1 flex flex-col">
							<Link
								to={"/instructions"}
								className="cursor-pointer mt-0.5 xl:mt-1 hover:text-[var(--color-highlight)]"
							>
								{t("footer.instruction")}
							</Link>
							<Link
								to={"/mentions"}
								className="cursor-pointer mt-0.5 xl:mt-1 hover:text-[var(--color-highlight)]"
							>
								{t("footer.legalNotice")}
							</Link>
							<Link
								to={"/cgu"}
								className="cursor-pointer mt-0.5 xl:mt-1 hover:text-[var(--color-highlight)]"
							>
								{t("footer.termsOfUse")}
							</Link>
							<Link
								to={"/cookies"}
								className="cursor-pointer mt-0.5 xl:mt-1 hover:text-[var(--color-highlight)]"
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
							<div className="flex justify-self-end w-25 mb-1 mt-1 xl:my-1.5 gap-2">
								<a
									href="https://linkedin.com/in/matthieu-dimier-a51539290"
									target="_blank"
									rel="noopener noreferrer"
								>
									<img
										src="/linkedin.svg"
										alt="logo linkedin"
										className="w-8 h-8 bg-gray-200 rounded-sm cursor-pointer"
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
										className="w-8 h-8 bg-gray-200 rounded-sm cursor-pointer"
									/>
								</a>
								<a
									href="mailto:dimier.matt.dev@gmail.com?subject=Contact%20depuis%20le%20site%20la%20pince&body=Bonjour Matthieu,"
									aria-label="Envoyer un mail"
								>
									<img
										src="/gmail.svg"
										alt="logo gmail"
										className="w-8 h-8 bg-gray-200 rounded-sm cursor-pointer"
									/>
								</a>
							</div>

							<div className="flex gap-4 justify-between">
								<p className="mt-1 -mb-4">{t("footer.languageChoice")} :</p>
								<div className="-mt-4">
									<LanguageSwitcher />
								</div>
							</div>
							<div className="flex gap-4 justify-between">
								<p className="mt-1.5 -mb-4">{t("footer.themeChoice")} :</p>
								<div className="-mt-3 cursor-pointer">
									<ColorSwitcher />
								</div>
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
