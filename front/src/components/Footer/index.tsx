import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ColorSwitcher from "../ColorSwitcher";
import LanguageSwitcher from "../LanguageSwitcher";
import { GetUserInfo } from "../../api/user";

interface UserInfoData {
	last_name: string;
	first_name: string;
	email: string;
}
export default function Footer() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	const [user, setUser] = useState<UserInfoData | null>(null);
	const [isLogin, setIsLogin] = useState(false);

	const publicPaths = [
		"/",
		"/login",
		"/register",
		"/NewPassword",
		"/cgu",
		"/cookies",
		"/mentions",
		"/instructions",
		"/aboutUs",
	];

	useEffect(() => {
		const token = sessionStorage.getItem("token");

		if (!token) {
			// Si pas de token et route privée on fait une redirection
			if (!publicPaths.includes(location.pathname)) {
				navigate("/login");
			}
			return;
		}

		const fetchUser = async () => {
			try {
				const data = await GetUserInfo();
				setUser(data);
				setIsLogin(true);
			} catch (error) {
				console.error(
					"Erreur lors de la récupération de l'utilisateur :",
					error,
				);
				// En cas de token invalide, on peut forcer la déconnexion
				sessionStorage.removeItem("token");
				navigate("/login");
			}
		};

		fetchUser();
	}, [location.pathname, navigate]);

	useEffect(() => {
		const savedColor = localStorage.getItem("color-secondary");
		if (savedColor) {
			document.documentElement.style.setProperty(
				"--color-secondary",
				savedColor,
			);
		}
	}, []);

	const [infosIsOpen, setInfosIsOpen] = useState(false);

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
			<div className="bg-[var(--color-secondary)] fixed bottom-0 w-full z-50 md:px-20 lg:px-40 xl:px-100 2xl:px-120">
				<div
					className={`max-w-full flex mx-10 pt-4 pb-4 ${
						isLogin && user ? "justify-between" : "justify-center"
					}`}
				>
					{isLogin && user && (
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
					)}

					{isLogin && user && (
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
					)}

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
					className="fixed inset-0 flex items-center justify-center z-51 sm:mx-20 md:mx-36"
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
								<p className=" mb-6 text-lg font-bold">
									{t("footer.informationTitle")}
								</p>
								<div className="max-w-full mr-3 mb-6 -mt-5 border-b-2 text-white " />

								<li className="mt-1">
									<Link
										to={"/instructions"}
										className="hover:text-[var(--color-highlight)]"
										onClick={() => setInfosIsOpen(false)}
									>
										{t("footer.instruction")}
									</Link>
								</li>
								<li className="mt-1">
									<Link
										to={"/mentions"}
										className="hover:text-[var(--color-highlight)]"
										onClick={() => setInfosIsOpen(false)}
									>
										{t("footer.legalNotice")}
									</Link>
								</li>
								<li className="mt-1">
									<Link
										to={"/cgu"}
										className="hover:text-[var(--color-highlight)]"
										onClick={() => setInfosIsOpen(false)}
									>
										{t("footer.termsOfUse")}
									</Link>
								</li>
								<li className="mt-1">
									<Link
										to={"/cookies"}
										className="text-white hover:text-[var(--color-highlight)]"
										onClick={() => setInfosIsOpen(false)}
									>
										{t("footer.privacyPolicy")}
									</Link>
								</li>
								<li className="mt-1">
									<Link
										to={"/aboutUs"}
										className="text-white hover:text-[var(--color-highlight)]"
										onClick={() => setInfosIsOpen(false)}
									>
										{t("footer.aboutUs")}
									</Link>
								</li>

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
								<p className="mt-3 -mb-4">{t("footer.languageChoice")}</p>
								<div>
									<LanguageSwitcher />
								</div>

								<p className="mt-2 -mb-3">{t("footer.themeChoice")}</p>
								<div>
									<ColorSwitcher />
								</div>
							</ul>

							<div className="text-white text-sm flex flex-col">
								<p className="text-center">{t("footer.copyrightNotice")}</p>
								<a
									href="https://cv.matt-dev.fr/"
									target="_blank"
									rel="noopener noreferrer"
									className="text-center cursor-pointer text-white hover:text-[var(--color-highlight)] bg-transparent border-none p-0 underline"
								>
									{t("footer.madeBy")}
								</a>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
