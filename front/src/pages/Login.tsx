import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

export default function Login() {
	const navigate = useNavigate();
	//
	// useId permet de générer un id unique a chaque utilisation du composant
	const emailId = useId();
	const [email, setEmail] = useState("");

	const [password, setPassword] = useState("");
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [, setIsErrorMessage] = useState(false);

	// Appel de loginUser pour faire l'appel fetch a l'API
	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		const userData = {
			email,
			password,
		};

		try {
			// Récupération des données et du token
			const data = await loginUser(userData);
			// Stockage du token
			sessionStorage.setItem("authToken", data.token);
			console.log("token :", data.token);
			// Vérifiez que navigate est appelé correctement
			navigate("/home"); // La redirection vers le dashboard
			// Rechargement de la page pour que le dashboard soit bien a jour apres le login
			window.location.reload();
		} catch (err: unknown) {
			console.error("Erreur lors de la connexion", err);
			// Vérification de la réponse dans l'erreur
			if (err instanceof Error) {
				const status = (err as any).status;
				const message = err.message;

				console.log("Code d'erreur :", status);
				console.log("Message d'erreur :", message);

				if (status === 401) {
					setErrorMessage("Email ou mot de passe incorrect.");
					setIsErrorMessage(true);
				} else if (status === 400) {
					setErrorMessage("Requête invalide.");
					setIsErrorMessage(true);
				} else {
					setErrorMessage(message);
					setIsErrorMessage(true);
				}
			} else {
				setErrorMessage("Une erreur inattendue est survenue.");
			}
		}
	};

	const handleSubmitAfterReset = (e: React.FormEvent) => {
		e.preventDefault();
		navigate("/");
		setIsChangePasswordOpen(false);
	};

	return (
		<>
			<div className="w-full flex justify-center mt-6">
				<div className="w-full max-w-[400px] px-4 flex flex-col ">
					<div className="p-6 bg-[var(--color-primary)] rounded-xl shadow-md w-full flex flex-col ">
						<h2 className="text-2xl font-bold flex justify-center mb-7">
							Connexion
						</h2>
						{/* <p className="text-center text-xl font-semibold mb-6">
						Page de connexion
					</p> */}

						<form
							onSubmit={handleSubmit}
							method="POST"
							className="flex flex-col gap-4"
						>
							{/* Champ Email d'utilisateur */}
							<div className="flex flex-col ">
								<p className="mb-1 text-sm font-medium text-gray-700 ml-1 ">
									Adresse Email
								</p>
								<label className="input validator rounded-lg ">
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
											<rect width="20" height="16" x="2" y="4" rx="2"></rect>
											<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
										</g>
										<title>email</title>
									</svg>
									<input
										name="email"
										type="email"
										autoComplete="off"
										placeholder="john.doe@email.com"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</label>
							</div>

							{/* Champ Mot de passe d'utilisateur */}
							<div className="flex flex-col ">
								<p className="mb-1 text-sm font-medium text-gray-700 ml-1">
									Mot de passe
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
										placeholder="Password"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										minLength={8}
										pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
										title="Le mot de passe doit comporter au moins 8 caractères, une
									majuscule et un chiffre."
									/>
								</label>
							</div>
							<div className="text-[12px] font-semibold text-[var(--color-secondary)] -mt-3 ml-1">
								<button
									type="button"
									onClick={() => setIsChangePasswordOpen(true)}
								>
									Mot de passe oublié ?
								</button>
							</div>

							<div className="flex justify-center mt-3">
								<button
									type="submit"
									className="w-fit bg-[var(--color-secondary)] text-white font-semibold py-2 px-4 rounded transition hover:opacity-90 cursor-pointer"
								>
									Se connecter
								</button>
							</div>
							<p className="text-center text-red-600">{errorMessage}</p>
						</form>
					</div>
					{isChangePasswordOpen && (
						<div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
							<div className="relative w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6 text-center flex flex-col">
								<h2 className="mb-6 text-xl font-semibold">
									REINITIALISATION DE MOT DE PASSE
								</h2>
								<p className="text-gray-700 mb-6">
									Veuillez saisir l'adresse email utilisée lors de votre compte
									enregistrement pour recevoir un lien de réinitialisation de
									mot de passe.
								</p>
								<form onSubmit={handleSubmitAfterReset}>
									<label htmlFor={emailId} className="text-transparent">
										email
									</label>
									<input
										type="email"
										id={emailId}
										name="email"
										placeholder="Votre email"
										className="input rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] justify-center"
									/>
									<div className="flex justify-center mt-6">
										<button
											type="submit"
											className="w-fit bg-[var(--color-secondary)] text-white font-semibold py-2 px-4 rounded transition cursor-pointer hover:opacity-90"
										>
											ENVOYER
										</button>
									</div>
								</form>
								{/* Bouton fermeture */}
								<button
									type="button"
									onClick={() => setIsChangePasswordOpen(false)}
									className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
								>
									<img src="/close.svg" alt="Fermer" className="w-5 h-5" />
								</button>
							</div>
						</div>
					)}
					<div className="text-center mt-2 ml-1">
						Pas de compte ?
						<Link
							to={"/register"}
							type="submit"
							className="text-[var(--color-secondary)] ml-2 font-semibold py-2 rounded-lg  transition"
						>
							S'enregistrer
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
