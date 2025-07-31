import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/auth";

export default function NewPassword() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [newPassword, setNewPassword] = useState("");
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [isSamePass, setIsSamePass] = useState(false);
	const [isInvalidPassword, setIsInvalidPassword] = useState(false);
	const [isInvalidToken, setIsInvalidToken] = useState(false);
	const [isUserNotFound, setIsUserNotFound] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [, setDebugInfo] = useState<any>(null);

	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	useEffect(() => {
		if (token) {
			try {
				const parts = token.split(".");
				if (parts.length === 3) {
					const payload = JSON.parse(atob(parts[1]));

					setDebugInfo({ tokenPayload: payload, tokenLength: token.length });
				}
			} catch (e) {
				console.log("Erreur décodage token:", e);
				setDebugInfo({
					error: "Token invalide",
					tokenLength: token?.length || 0,
				});
			}
		}
	}, [token]);

	// Conditions de validation du mot de passe
	const hasUpperCase = /[A-Z]/.test(newPassword);
	const hasNumber = /\d/.test(newPassword);
	const hasMinLength = newPassword.length >= 8;

	// Fonction pour afficher ✔ ou ✘ avec couleur
	const icon = (isValid: boolean) => (
		<span
			className={isValid ? "!text-green-600 pr-0.5" : "text-red-600 pr-0.5"}
		>
			{isValid ? "✔" : "✘"}
		</span>
	);

	const resetErrors = () => {
		setIsSamePass(false);
		setIsInvalidPassword(false);
		setIsInvalidToken(false);
		setIsUserNotFound(false);
		setErrorMessage("");
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		// Réinitialisation des messages d'erreur
		resetErrors();

		try {
			// Vérification du token côté client
			if (!token) {
				setIsInvalidToken(true);
				setErrorMessage(t("newPassword.missingToken"));
				return;
			}

			// Vérification des mots de passe
			if (newPassword !== confirmNewPassword) {
				setIsSamePass(true);
				return;
			}

			// Vérification des règles de sécurité
			if (!hasMinLength || !hasUpperCase || !hasNumber) {
				setIsInvalidPassword(true);
				return;
			}

			// Envoi de la requête
			await resetPassword(newPassword, token);

			// Succès - nettoyer les tokens existants et rediriger
			localStorage.removeItem("token"); // ou votre clé de token
			localStorage.removeItem("refreshToken"); // si vous en avez un
			sessionStorage.clear(); // nettoyer la session

			navigate("/login", {
				state: {
					message: t("newPassword.resetSuccess"),
				},
			});
		} catch (error: any) {
			console.error("Erreur lors du reset:", error);

			// Afficher les infos de debug si disponibles
			if (error.debug) {
				setDebugInfo(error.debug);
			}

			const errorMsg = error.message?.toLowerCase() || "";

			if (errorMsg.includes("utilisateur non trouvé")) {
				setIsUserNotFound(true);
				setErrorMessage(t("newPassword.userNotFoundFromLink"));
			} else if (
				errorMsg.includes("token invalide") ||
				errorMsg.includes("token")
			) {
				setIsInvalidToken(true);
				setErrorMessage(t("newPassword.invalidOrExpiredLink"));
			} else if (errorMsg.includes("expiré")) {
				setIsInvalidToken(true);
				setErrorMessage(t("newPassword.linkExpiredRetry"));
			} else {
				setErrorMessage(error.message || "Une erreur est survenue.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="w-full flex justify-center mt-6">
				<div className="w-full max-w-[400px] px-4 flex flex-col ">
					<div className="p-6 bg-[var(--color-primary)] rounded-xl shadow-md w-full flex flex-col ">
						<h2 className="text-2xl font-bold flex justify-center mb-7">
							{t("newPassword.chooseNewPassword")}
						</h2>

						<form
							onSubmit={handleSubmit}
							method="POST"
							className="flex flex-col gap-4"
						>
							{/* Champ Nouveau Mot de passe d'utilisateur */}
							<div className="flex flex-col ">
								<p className="mb-1 text-sm font-medium text-gray-700 ml-1">
									{t("newPassword.newPasswordLabel")}
								</p>
								<label className="input validator rounded-lg">
									<svg
										className="h-[1em] opacity-50"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<g
											strokeLinejoin="round"
											strokeLinecap="round"
											strokeWidth="2.5"
											fill="none"
											stroke="currentColor"
										>
											<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
											<circle
												cx="16.5"
												cy="7.5"
												r=".5"
												fill="currentColor"
											></circle>
										</g>
										<title>logo mot de passe</title>
									</svg>
									<input
										type="password"
										name="password"
										autoComplete="new-password"
										required
										placeholder={t("login.passwordLabel")}
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										minLength={8}
										pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
										title={t("login.passwordInstruction")}
										disabled={isLoading}
									/>
								</label>
								<div className="flex  -mt-1">
									<ul className="mt-2 text-sm leading-tight w-full">
										<div className="flex flex-col justify-between">
											<p className=" text-[12px]">
												{icon(hasMinLength)}
												{t("register.passwordMinLength")}
											</p>
											<p className=" text-[12px]">
												{icon(hasUpperCase)}
												{t("register.passwordUppercase")}
											</p>
											<p className="flex text-[12px]">
												{icon(hasNumber)}
												{t("register.passwordDigit")}
											</p>
										</div>
									</ul>
								</div>
							</div>

							{/* Champ Confirmation Mot de passe */}
							<div className="flex flex-col ">
								<p className="mb-1 text-sm font-medium text-gray-700 ml-1">
									{t("newPassword.confirmPasswordLabel")}
								</p>
								<label className="input validator rounded-lg">
									<svg
										className="h-[1em] opacity-50"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
									>
										<g
											strokeLinejoin="round"
											strokeLinecap="round"
											strokeWidth="2.5"
											fill="none"
											stroke="currentColor"
										>
											<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
											<circle
												cx="16.5"
												cy="7.5"
												r=".5"
												fill="currentColor"
											></circle>
										</g>
										<title>logo mot de passe</title>
									</svg>
									<input
										type="password"
										name="confirmPassword"
										autoComplete="new-password"
										required
										placeholder="Confirmez le mot de passe"
										value={confirmNewPassword}
										onChange={(e) => setConfirmNewPassword(e.target.value)}
										minLength={8}
										disabled={isLoading}
									/>
								</label>
							</div>

							<div className="flex justify-center mt-3">
								<button
									type="submit"
									disabled={isLoading}
									className="w-fit bg-[var(--color-secondary)] text-white font-semibold py-2 px-4 rounded transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoading ? "Traitement..." : "Confirmer"}
								</button>
							</div>

							{/* Messages d'erreur */}
							{isSamePass && (
								<p className="text-red-500 text-sm text-center">
									{t("newPassword.passwordsDoNotMatch")}
								</p>
							)}

							{isInvalidPassword && (
								<p className="text-red-500 text-sm text-center">
									{t("newPassword.passwordInvalid")}
								</p>
							)}

							{isInvalidToken && (
								<div className="text-red-600 text-sm text-center">
									<p>{t("newPassword.linkInvalid")}</p>
									<p>{t("newPassword.restartRecovery")}</p>
								</div>
							)}

							{isUserNotFound && (
								<div className="text-red-600 text-sm text-center">
									<p>{t("newPassword.userNotFound")}</p>
									<p>{t("newPassword.linkDoesNotMatch")}</p>
								</div>
							)}

							{errorMessage &&
								!isSamePass &&
								!isInvalidPassword &&
								!isInvalidToken &&
								!isUserNotFound && (
									<p className="text-red-500 text-sm text-center">
										{errorMessage}
									</p>
								)}
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
