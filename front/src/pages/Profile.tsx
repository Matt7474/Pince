import { useEffect, useId, useState } from "react";
import { UpdateUser, UpdateUserPassword } from "../api/user";
import ConfirmModal from "../components/Modals/ConfirmModal/index";

export default function Profile() {
	const API_URL = import.meta.env.VITE_API_URL;

	const [editMode, setEditMode] = useState(false);
	const [isOpenDelete, setIsOpenDelete] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [confirmText, setConfirmText] = useState("");

	const [passwordData, setPasswordData] = useState<PasswordData>({
		oldPassword: "",
		newPassword: "",
	});
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [passwordMatchError, setPasswordMatchError] = useState(false);

	const lastnameId = useId();
	const firstnameId = useId();
	const emailId = useId();
	const oldPasswordId = useId();
	const newPasswordId = useId();
	const confirmNewPasswordId = useId();

	type User = {
		id: number;
		last_name: string;
		first_name: string;
		email: string;
		password: string;
	};

	type PasswordData = {
		oldPassword: string;
		newPassword: string;
	};

	const [tempData, setTempData] = useState({
		last_name: "",
		first_name: "",
		email: "",
	});

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const token = sessionStorage.getItem("token");
				if (!token)
					throw new Error("Aucun token trouvé. Veuillez vous connecter.");

				const res = await fetch(`${API_URL}/users/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (!res.ok) {
					const errorData = await res.json();
					throw new Error(
						errorData.message || "Erreur lors du chargement du profil.",
					);
				}

				const data: User = await res.json();
				setUser(data);
				setTempData({
					last_name: data.last_name || "",
					first_name: data.first_name || "",
					email: data.email || "",
				});
			} catch (err) {
				if (err instanceof Error) setError(err.message);
				else setError("Une erreur inattendue est survenue.");
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setTempData((prev) => ({ ...prev, [name]: value }));
	};

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = async () => {
		try {
			setLoading(true);
			setError(null);

			if (passwordData.newPassword !== passwordConfirm) {
				setPasswordMatchError(true);
				return;
			} else {
				setPasswordMatchError(false);
			}

			const updatedUser = await UpdateUser({
				last_name: tempData.last_name,
				first_name: tempData.first_name,
				email: tempData.email,
			});

			if (passwordData.oldPassword && passwordData.newPassword) {
				await UpdateUserPassword({
					current_password: passwordData.oldPassword,
					new_password: passwordData.newPassword,
				});
			}

			setUser(updatedUser);
			setPasswordData({ oldPassword: "", newPassword: "" });
			setPasswordConfirm("");
			setEditMode(false);
			setConfirmText("Modifications enregistrées avec succès");
			setTimeout(() => setConfirmText(""), 2000); // cache automatiquement
		} catch (err) {
			if (err instanceof Error) setError(err.message);
			else setError("Erreur inconnue");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		if (user) {
			setTempData({
				last_name: user.last_name || "",
				first_name: user.first_name || "",
				email: user.email || "",
			});
		}
		setPasswordData({ oldPassword: "", newPassword: "" });
		setPasswordConfirm("");
		setPasswordMatchError(false);
		setEditMode(false);
	};

	const handleDelete = () => {
		console.log("handleDelete");
	};

	return (
		<div className="flex-grow flex flex-col items-center mt-20 w-[90%] mx-auto sm:max-w-80">
			<div className="p-6 bg-[var(--color-primary)] rounded-xl shadow-md w-full flex flex-col">
				<div className="flex justify-between">
					<h2 className="text-2xl font-bold mb-4">Mon profil</h2>

					{error && (
						<p className="text-red-600 font-semibold mb-4 text-center">
							{error}
						</p>
					)}

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
						<div className="border-t border-gray-400 pt-3">
							<div>
								<label
									className="block text-sm font-medium text-gray-700"
									htmlFor={oldPasswordId}
								>
									Ancien mot de passe
								</label>
								<input
									type="password"
									id={oldPasswordId}
									name="oldPassword"
									value={passwordData.oldPassword}
									onChange={handlePasswordChange}
									placeholder="Ancien mot de passe"
									className="my-input mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
								/>
							</div>

							<div>
								<label
									className="block text-sm font-medium text-gray-700 mt-3"
									htmlFor={newPasswordId}
								>
									Nouveau mot de passe
								</label>
								<input
									type="password"
									id={newPasswordId}
									name="newPassword"
									value={passwordData.newPassword}
									onChange={handlePasswordChange}
									placeholder="Nouveau mot de passe"
									className="my-input mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
								/>
							</div>

							<div>
								<label
									className="block text-sm font-medium text-gray-700 mt-3"
									htmlFor={confirmNewPasswordId}
								>
									Confirmation du nouveau mot de passe
								</label>
								<input
									type="password"
									id={confirmNewPasswordId}
									value={passwordConfirm}
									onChange={(e) => setPasswordConfirm(e.target.value)}
									placeholder="Confirmer le mot de passe"
									className="my-input mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]"
								/>
							</div>

							{passwordMatchError && (
								<p className="text-red-600 font-semibold ">
									Les nouveaux mots de passe ne correspondent pas.
								</p>
							)}
						</div>
					)}
					{confirmText && <ConfirmModal confirmText={confirmText} />}
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
