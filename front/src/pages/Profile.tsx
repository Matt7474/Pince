import { useEffect, useId, useState } from "react";

export default function Profile() {
	const API_URL = import.meta.env.VITE_API_URL;
	const [editMode, setEditMode] = useState(false);
	const [isOpenDelete, setIsOpenDelete] = useState(false);

	const [user, setUser] = useState<User | null>(null);
	const [, setLoading] = useState(true);
	const [, setError] = useState<string | null>(null);

	type User = {
		id: number;
		last_name: string;
		first_name: string;
		email: string;
		password: string;
	};

	// Pour stocker temporairement les valeurs modifiables
	const [tempData, setTempData] = useState({
		last_name: "",
		first_name: "",
		email: "",
		password: "",
	});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = sessionStorage.getItem("token");

				if (!token) {
					throw new Error("Aucun token trouvé. Veuillez vous connecter.");
				}

				const res = await fetch(`${API_URL}/users/me`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

				if (!res.ok) {
					const errorData = await res.json();
					throw new Error(
						errorData.message || "Erreur lors du chargement du profil.",
					);
				}

				const data: User = await res.json();

				setUser(data);
				// Initialiser tempData avec les données de l'utilisateur
				setTempData({
					last_name: data.last_name || "",
					first_name: data.first_name || "",
					email: data.email || "",
					password: "", // On ne pré-remplit pas le mot de passe pour des raisons de sécurité
				});
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("Une erreur inattendue est survenue.");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	// useId pour accessibilité
	const lastnameId = useId();
	const firstnameId = useId();
	const emailId = useId();
	const passwordId = useId();

	const handleChange = (e: any) => {
		e.preventDefault();
		const { name, value } = e.target;
		setTempData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		// Ici vous pourriez ajouter l'appel API pour sauvegarder les modifications
		// Puis mettre à jour l'état user avec les nouvelles données
		setUser((prev) =>
			prev
				? {
						...prev,
						last_name: tempData.last_name,
						first_name: tempData.first_name,
						email: tempData.email,
						// Ne pas mettre à jour le password dans l'affichage
					}
				: null,
		);
		setEditMode(false);
	};

	const handleCancel = () => {
		// Réinitialise les données temporaires avec les vraies valeurs de l'utilisateur
		if (user) {
			setTempData({
				last_name: user.last_name || "",
				first_name: user.first_name || "",
				email: user.email || "",
				password: "",
			});
		}
		setEditMode(false);
	};

	const handleDelete = () => {
		console.log("handleDelete");
	};

	return (
		<div className="flex-grow flex flex-col items-center mt-20 w-[90%] mx-auto sm:max-w-80 ">
			<div className="p-6 bg-[var(--color-primary)] rounded-xl shadow-md w-full flex flex-col">
				<div className="flex justify-between">
					<h2 className="text-2xl font-bold mb-4">Mon profil</h2>
					<button
						type="button"
						onClick={() => setEditMode(true)}
						aria-label="Activer le mode édition"
					>
						<img
							src="/pen.svg"
							alt="icon modification"
							className="w-9 mb-4 hover:cursor-pointer"
						/>
					</button>
				</div>

				<div className="space-y-4 ">
					<div>
						<label
							className="block text-sm font-medium text-gray-700"
							htmlFor={lastnameId}
						>
							Nom
						</label>
						<input
							type="text"
							id={lastnameId}
							name="last_name"
							value={editMode ? tempData.last_name : user?.last_name || ""}
							onChange={handleChange}
							disabled={!editMode}
							className="my-input mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium text-gray-700"
							htmlFor={firstnameId}
						>
							Prénom
						</label>
						<input
							type="text"
							id={firstnameId}
							name="first_name"
							value={editMode ? tempData.first_name : user?.first_name || ""}
							onChange={handleChange}
							disabled={!editMode}
							className="my-input mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
						/>
					</div>

					<div>
						<label
							className="block text-sm font-medium text-gray-700"
							htmlFor={emailId}
						>
							Email
						</label>
						<input
							type="email"
							id={emailId}
							name="email"
							value={editMode ? tempData.email : user?.email || ""}
							onChange={handleChange}
							disabled={!editMode}
							className="my-input mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
						/>
					</div>

					{editMode && (
						<div>
							<label
								className="block text-sm font-medium text-gray-700"
								htmlFor={passwordId}
							>
								Mot de passe
							</label>
							<input
								type="password"
								id={passwordId}
								name="password"
								value={tempData.password}
								onChange={handleChange}
								placeholder="Nouveau mot de passe"
								className="my-input mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
							/>
						</div>
					)}
				</div>

				<div className="mt-6 flex justify-around -mb-2">
					{editMode ? (
						<div className="flex justify-between mb-4 w-full">
							<button
								type="button"
								onClick={handleCancel}
								className="px-4 py-2 mb-4 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 cursor-pointer"
							>
								Annuler
							</button>
							<button
								type="button"
								onClick={handleSave}
								className="px-4 py-2 mb-4 bg-[var(--color-secondary)] text-white rounded hover:opacity-90 cursor-pointer"
							>
								Sauvegarder
							</button>
							<button type="button">
								<img
									src="/trash.svg"
									alt="icone poubelle"
									className=" w-8 cursor-pointer"
									onClick={() => setIsOpenDelete(true)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											setIsOpenDelete(true);
										}
									}}
								/>
							</button>
						</div>
					) : (
						""
					)}
					{/* Modal de confirmation de suppresion avec DaisyUI */}
					{isOpenDelete && (
						<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
							<div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full relative border-2 border-red-600">
								{/* Icône d'alerte */}
								<div className="flex justify-center mb-3">
									<img
										src="/warning.svg"
										alt="Attention"
										className="w-12 h-12"
									/>
								</div>

								<h2 className="text-xl font-bold text-center text-red-600">
									Suppression du compte
								</h2>

								<p className="text-gray-700 mt-3 text-center">
									Cette action est <strong>irréversible</strong>. Elle
									supprimera définitivement vos budgets, dépenses et données
									personnelles.
								</p>

								<p className="text-gray-700 mt-2 text-center">
									Êtes-vous sûr de vouloir continuer ?
								</p>

								<div className="flex justify-center mt-6 gap-4">
									<button
										type="button"
										className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition cursor-pointer"
										onClick={handleDelete}
									>
										Supprimer définitivement
									</button>

									<button
										type="button"
										className="px-4 py-2  bg-gray-300 text-gray-800  hover:bg-gray-400 font-semibold rounded transition cursor-pointer"
										onClick={() => setIsOpenDelete(false)}
									>
										Annuler
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
