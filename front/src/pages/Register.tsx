import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

export default function RegisterPage() {
	const navigate = useNavigate();
	const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ'-]{2,30}$/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	const [last_name, setLast_name] = useState("");
	const [lastNameTouched, setLastNameTouched] = useState(false);
	const isLastNameValid = nameRegex.test(last_name);

	const [first_name, setFirst_name] = useState("");
	const [firstNameTouched, setFirstNameTouched] = useState(false);
	const isFirstNameValid = nameRegex.test(first_name);

	const [email, setEmail] = useState("");
	const [emailTouched, setEmailTouched] = useState(false);
	const isEmailValid = emailRegex.test(email);

	const [password, setPassword] = useState("");

	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [isSamePass, setIsSamePass] = useState(false);

	const [, setIsEmailAlreadyExist] = useState(false);
	const [isInvalidPassword, setIsInvalidPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState(""); // Ajouter un état pour l'erreur
	// Conditions de validation du mot de passe
	const hasUpperCase = /[A-Z]/.test(password);
	const hasNumber = /\d/.test(password);
	const hasMinLength = password.length >= 8;

	// Fonction pour afficher ✔ ou ✘ avec couleur
	const icon = (isValid: boolean) => (
		<span
			className={isValid ? "!text-green-600 pr-0.5" : "text-red-600 pr-0.5"}
		>
			{isValid ? "✔" : "✘"}
		</span>
	);

	// Methode Fetch pour l'envoi des données à la bdd
	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();

		// Vérification des conditions du mot de passe
		if (!hasMinLength || !hasUpperCase || !hasNumber) {
			setIsInvalidPassword(true);
			// Return si les mots de passe ne respecte pas les conditions
			return;
		}
		setIsInvalidPassword(false);

		// Vérification si les mots de passe sont identiques
		if (password !== passwordConfirm) {
			setIsSamePass(true);
			// Return si les mots de passe ne correspondent pas
			return;
		}

		const userData = {
			last_name,
			first_name,
			email,
			password,
		};

		try {
			// Appeler la méthode pour enregistrer l'utilisateur
			await registerUser(userData);
			navigate("/login");
		} catch (err: unknown) {
			console.error("Erreur lors de l'enregistrement :", err);

			// Vérification de la réponse dans l'erreur
			if (typeof err === "object" && err && "response" in err) {
				const error = err as { response: { status: number } };
				const statusCode = error.response.status; // Loguer le code d'erreur

				// Gestion du message en fonction du code d'erreur
				if (statusCode === 409) {
					setErrorMessage("Cet email existe déjà.");
					setIsEmailAlreadyExist(true);
				} else if (statusCode === 400) {
					setErrorMessage("Le format de l'email est invalide.");
				} else {
					setErrorMessage("Une erreur inconnue est survenue.");
				}
			} else {
				setErrorMessage("Une erreur est survenue, veuillez réessayer.");
			}
		}
	};

	return (
		<div className="w-full flex justify-center mt-6">
			<div className="w-full max-w-[400px] px-4">
				<div className="p-6 bg-[var(--color-primary)] rounded-xl shadow-md w-full flex flex-col ">
					<h2 className="text-2xl font-bold flex justify-center mb-3">
						Création de compte
					</h2>

					{/* Formulaire d'enregistrement */}
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
						autoComplete="off"
					>
						{/* Input fictif pour berner les navigateurs chromium et forcer les champs email et mot de passe vidé  */}
						<div>
							<input
								type="text"
								name="fakeEmail"
								className="hidden"
								autoComplete="off"
							/>
							<input
								type="password"
								name="fakePass"
								className="hidden"
								autoComplete="new-password"
							/>
						</div>
						{/* Champ Nom d'utilisateur */}
						<div className="flex flex-col">
							<p className="mb-1 text-sm font-medium text-gray-700 ml-1">Nom</p>
							<label className="input validator rounded-lg !mb-0">
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
										<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
										<circle cx="12" cy="7" r="4"></circle>
									</g>
									<title>LastName</title>
								</svg>
								<input
									type="text"
									name="last_name"
									value={last_name}
									onChange={(e) => setLast_name(e.target.value)}
									onBlur={() => setLastNameTouched(true)}
									required
									placeholder="Nom"
									pattern="^[A-Za-zÀ-ÖØ-öø-ÿ'\-]+$"
									minLength={2}
									maxLength={30}
									title="Seules les lettres, les tirets et les apostrophes sont autorisés"
								/>
							</label>
							{lastNameTouched && !isLastNameValid && (
								<p className="validator-hint text-[12px] text-gray-500 mt-1 leading-tight">
									Doit contenir entre 2 et 30 caractères, Seules les lettres,
									les tirets et les apostrophes sont autorisés
								</p>
							)}
						</div>

						{/* Champ Prénom d'utilisateur */}
						<div className="flex flex-col ">
							<p className="mb-1 text-sm font-medium text-gray-700 ml-1">
								Prénom
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
										<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
										<circle cx="12" cy="7" r="4"></circle>
									</g>
									<title>FirstName</title>
								</svg>
								<input
									type="text"
									name="first_name"
									value={first_name}
									onChange={(e) => setFirst_name(e.target.value)}
									onBlur={() => setFirstNameTouched(true)}
									required
									placeholder="Prénom"
									pattern="^[A-Za-zÀ-ÖØ-öø-ÿ'\-]+$"
									minLength={2}
									maxLength={30}
									title="Seules les lettres, les tirets et les apostrophes sont autorisés"
								/>
							</label>
							{firstNameTouched && !isFirstNameValid && (
								<p className="validator-hint text-[12px] text-gray-500 mt-1 leading-tight">
									Doit contenir entre 2 et 30 caractères, Seules les lettres,
									les tirets et les apostrophes sont autorisés
								</p>
							)}
						</div>

						{/* Champ Email d'utilisateur */}
						<div className="flex flex-col">
							<p className="mb-1 text-sm font-medium text-gray-700 ml-1">
								Adresse Email
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
									onBlur={() => setEmailTouched(true)}
								/>
							</label>
							{emailTouched && !isEmailValid && (
								<p className="validator-hint text-[12px] text-gray-500 mt-1 leading-tight">
									Entrez une adresse email valide
								</p>
							)}
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
							{/* Liste des conditions */}
							<div className="flex  -mt-1">
								<ul className="mt-2 text-sm leading-tight w-full">
									<div className="flex flex-col justify-between">
										<p className=" text-[12px]">
											{icon(hasMinLength)}Minimum 8 caractères
										</p>
										<p className=" text-[12px]">
											{icon(hasUpperCase)}Minimum 1 majuscule
										</p>
										<p className="flex text-[12px]">
											{icon(hasNumber)}Minimum 1 chiffre
										</p>
									</div>
								</ul>
							</div>
						</div>

						{/* Champ confirmation du Mot de passe d'utilisateur */}
						<div className="flex flex-col mt-1">
							<p className="mb-1 text-sm font-medium text-gray-700 ml-1">
								Confirmation du mot de passe
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
									required
									placeholder="Password"
									value={passwordConfirm}
									onChange={(e) => setPasswordConfirm(e.target.value)}
									minLength={8}
									pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
									title="Le mot de passe doit comporter au moins 8 caractères, une
									majuscule et un chiffre."
								/>
							</label>

							{isSamePass && (
								<span className="text-red-500 text-md mt-1 -mb-4 self-center">
									Les mots de passe ne sont pas identiques
								</span>
							)}

							{/* Affichage du message d'erreur si le mot de passe est invalide */}
							{isInvalidPassword && (
								<span className="text-red-500 text-md self-center">
									Le mot de passe doit comporter au moins 8 caractères, une
									majuscule et un chiffre.
								</span>
							)}

							{/* Affichage du message d'erreur généré par l'API */}
							{errorMessage && (
								<span className="text-red-500 text-md self-center">
									{errorMessage}
								</span>
							)}
						</div>

						<div className="flex justify-center mt-3">
							<button
								type="submit"
								className="w-fit bg-[var(--color-secondary)] text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
							>
								S'enregistrer
							</button>
						</div>
					</form>
				</div>
				<div className="justify-self-center mt-1">
					Déjà un compte ?
					<Link
						to={"/login"}
						type="submit"
						className="text-[var(--color-secondary)] ml-2 font-semibold py-2 rounded-lg transition"
					>
						Se connecter
					</Link>
				</div>
			</div>
		</div>
	);
}
