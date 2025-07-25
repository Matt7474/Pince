import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetUserInfo } from "../../api/user";
import { useTranslation } from "react-i18next";

interface UserInfoData {
	last_name: string;
	first_name: string;
	email: string;
}
export default function Header() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [user, setUser] = useState<UserInfoData | null>(null);
	const [isLogin, setIsLogin] = useState(false);

	//
	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (!token) {
			// pas de token = pas connecté = pas de fetch
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
				// optionnel : on peut forcer une déconnexion ici si le token est pourri
				// sessionStorage.removeItem("token");
				// navigate("/login");
			}
		};

		fetchUser();
	}, []);

	const handleLogout = () => {
		console.log("deco");

		sessionStorage.removeItem("token");
		navigate("/login");
	};
	return (
		<>
			<div className="fixed top-0 left-0 w-full z-21 bg-white">
				<div className="flex justify-between mx-3 md:px-20 lg:px-40 xl:px-80 2xl:px-120">
					{/* logo + titre */}
					<Link to="/homepage" className="flex -ml-2 group relative">
						<img src="/logo-pince.svg" alt="logo du site" className="w-14" />
						<img
							src="/nom-pince.svg"
							alt="nom du site"
							className="-mt-5 w-22"
						/>
						<div className="absolute top-full -mt-6 px-2 py-1 bg-[var(--color-secondary)] text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
							{t("header.return")}

							<div className="absolute left-1/2 -top-1 w-2 h-2 bg-[var(--color-secondary)] rotate-45 -translate-x-1/2"></div>
						</div>
					</Link>

					{/* <p className="text-2xl font-semibold mt-3 -mr-22 text-transparent sm:text-black sm:-mr-0">
						Bienvenu xxx
					</p> */}
					{isLogin && user && (
						<p className="text-2xl font-semibold mt-4 -mr-22 text-transparent sm:text-black sm:-mr-0">
							{t("header.welcome")} {user.first_name}
						</p>
					)}

					<div className="flex gap-6 -mt-5">
						<div className="mt-10">{/*  */}</div>
						{/* icones de gestion de compte */}
						{/* budgets uniquement si ecran large */}
						<Link
							to="/budgets"
							className="w-7 -mr-0.5 group relative flex-col items-center hover:cursor-pointer hidden lg:flex"
						>
							<img
								src="/money-2.svg"
								alt="icone budget"
								className="mt-10 opacity-70 hover:opacity-100 hidden lg:block"
							/>
							<div className="absolute top-full -mt-6 px-2 py-1 bg-[var(--color-secondary)] text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 ">
								{t("header.budgets")}
								<div className="absolute left-1/2 -top-1 w-2 h-2 bg-[var(--color-secondary)] rotate-45 -translate-x-1/2"></div>
							</div>
						</Link>

						{/* profile */}
						<Link
							to="/profile"
							className="w-6.5 group relative flex flex-col items-center hover:cursor-pointer"
						>
							<img
								src="/profile.svg"
								alt="icone budget"
								className="mt-10 opacity-70 hover:opacity-100"
							/>
							<div className="absolute top-full -mt-6 px-2 py-1 bg-[var(--color-secondary)] text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
								{t("header.profile")}
								<div className="absolute left-1/2 -top-1 w-2 h-2 bg-[var(--color-secondary)] rotate-45 -translate-x-1/2"></div>
							</div>
						</Link>

						{/* logout */}
						<button
							type="button"
							onClick={handleLogout}
							className="w-6.5 group relative flex flex-col items-center hover:cursor-pointer"
						>
							<img
								src="/logout.svg"
								alt="icone budget"
								className="mt-10 opacity-70 hover:opacity-100"
							/>
							<div className="absolute top-full -mt-6 px-2 py-1 bg-[var(--color-secondary)] text-white text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
								{t("header.disconnect")}
								<div className="absolute left-1/2 -top-1 w-2 h-2 bg-[var(--color-secondary)] rotate-45 -translate-x-1/2"></div>
							</div>
						</button>
					</div>
				</div>
				{/* Barre de séparation */}
				<div className="max-w-full mx-3 -mt-5 border-b-2 text-[#8c8c8c]"></div>
			</div>
		</>
	);
}
