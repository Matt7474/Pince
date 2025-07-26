import React, { Suspense, useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AddBudget, DeleteBudget, updateBudget } from "../../../api/budget";
import type { Budget } from "../../../types/Budget";

const MyEmojiPicker = React.lazy(() => import("../../MyEmojiPicker"));

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	budget: Budget | null;
	mode: "create" | "edit";
	onConfirmMessage: (text: string) => void;
	onBudgetCreated: () => void;
	onBudgetUpdated: (updatedBudget: Budget) => void; // Avec paramètre
	onBudgetDeleted: (budgetId: number) => void;
};

export default function BudgetModal({
	isOpen,
	onClose,
	budget,
	mode,
	onConfirmMessage,
	onBudgetCreated,
	onBudgetUpdated,
	onBudgetDeleted,
}: ModalProps) {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const isEdit = mode === "edit";

	const budgetNameId = useId();
	const [budgetName, setBudgetName] = useState("");
	const budgetColorId = useId();
	const [budgetColor, setBudgetcolor] = useState("#A5D8FF");
	const warningAmountId = useId();
	const [warningAmount, setWarningAmount] = useState<number | "">("");
	const allocatedAmountId = useId();
	const [allocatedAmount, setAllocatedAmount] = useState<number | "">("");
	const emojiPickerId = useId();
	const [selectedEmoji, setSelectedEmoji] = useState<string>("");
	const [isOpenDelete, setIsOpenDelete] = useState(false);
	const [emojiError, setEmojiError] = useState<string | null>(null);
	const [amountError, setAmountError] = useState<string | null>(null);

	// Permet de pré-remplir les champs en mode "edit"
	useEffect(() => {
		if (isEdit && budget) {
			setBudgetName(budget.name);
			setBudgetcolor(budget.color);
			setWarningAmount(budget.warning_amount);
			setAllocatedAmount(budget.allocated_amount);
			setSelectedEmoji(budget.icon);
		}
	}, [isEdit, budget]);

	// Validation des montants
	useEffect(() => {
		if (allocatedAmount !== "" && warningAmount !== "") {
			const allocated = Number(allocatedAmount);
			const warning = Number(warningAmount);

			if (allocated <= warning) {
				setAmountError(t("budgetsModal.alertAmountGreater"));
			} else {
				setAmountError(null);
			}
		} else {
			setAmountError(null);
		}
	}, [allocatedAmount, warningAmount, t]);

	// Appel au backend lors du submit
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Vérification de la présence de l'émoji
		if (!selectedEmoji) {
			setEmojiError(t("budgetsModal.selectEmoji"));
			return;
		} else {
			setEmojiError(null);
		}

		// Vérification que tous les champs sont remplis
		if (
			!budgetName ||
			!budgetColor ||
			!allocatedAmount ||
			!warningAmount ||
			!selectedEmoji
		) {
			alert(t("budgetsModal.fillAllFields"));
			return;
		}

		// Vérification de la validation des montants
		if (amountError) {
			return; // Empêche la soumission si il y a une erreur
		}

		// Prépare l'objet budget à envoyer
		const budgetToSend = {
			name: budgetName.trim(),
			allocated_amount: Number(allocatedAmount),
			warning_amount: Number(warningAmount),
			color: budgetColor,
			icon: selectedEmoji,
		};

		console.log("📦 Données du budget à envoyer:", budgetToSend);

		try {
			if (isEdit && budget?.id) {
				const updatedBudget = await updateBudget(budgetToSend, budget.id);

				onConfirmMessage(
					`${t("budgetsModal.budgetModifiedStart")}${budgetName}${t("budgetsModal.budgetModifiedEnd")}`,
				);

				onBudgetUpdated(updatedBudget); // Passez le budget mis à jour
			} else {
				await AddBudget(budgetToSend);
				onConfirmMessage(
					`${t("budgetsModal.budgetModifiedStart")}${budgetName}${t("budgetsModal.budgetCreatedEnd")}`,
				);
				onBudgetCreated();
			}

			onClose(); // ferme la modale
		} catch (error) {
			console.error("❌ Erreur lors de la soumission :", error);
			if (error instanceof Error) {
				alert(`${t("budgetsModal.error")} : ${error.message}`);
			} else {
				alert(t("budgetsModal.errorUnknown"));
			}
		}
	};

	// Suppression d'un budget avec confirmation
	const handleDelete = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!budget || !budget.id) {
			alert(t("budgetsModal.errorUndefinedBudget"));
			return;
		}

		try {
			await DeleteBudget(budget.id);

			// ✅ Notifie le parent
			onBudgetDeleted(budget.id);
			setIsOpenDelete(false);

			// Ferme la modale
			onClose();

			// Redirige vers la page des budgets avec un message flash
			navigate("/budgets", {
				state: {
					confirmTextDelete: `${t("budgetsModal.budgetModifiedStart")}${budgetName}${t("budgetsModal.budgetDeletedEnd")}`,
				},
			});
		} catch (error) {
			console.error("Erreur lors de la suppression du budget :", error);
			alert(t("budgetsModal.errorDeletingBudget"));
		}
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 z-50"
			// onClick={onClose}
		>
			<div
				className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 w-96 relative mt-7"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
				tabIndex={-1} // non focusable au clavier
				role="dialog" // élément non interactif
			>
				{/* Bouton fermeture */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
				>
					<img
						src="/close.svg"
						alt={t("expensesModal.closeButton")}
						className="w-5 h-5 cursor-pointer"
					/>
				</button>

				<h2 className="text-md font-semibold mb-6 text-black text-center">
					{isEdit
						? `${t("budgetsModal.editBudgetTitle")} ${budget?.name}`
						: t("budgetsModal.createBudgetTitle")}
				</h2>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-4"
					autoComplete="off"
				>
					<div className="relative">
						<div className="flex gap-3 mb-5">
							{/* Nom du budget */}
							<div className="flex flex-col w-1/2">
								<label
									htmlFor={budgetNameId}
									className="mb-1 ml-2 text-sm font-medium text-gray-700"
								>
									{t("budgetsModal.budgetNameLabel")}
								</label>
								<input
									type="text"
									id={budgetNameId}
									className="validator rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] input-neutral input h-8"
									value={budgetName}
									onChange={(e) => setBudgetName(e.target.value)}
									required
								/>
							</div>

							{/* Couleur du budget */}
							<div className="flex flex-col w-1/2">
								<label
									className="mb-1 ml-2 text-sm font-medium text-gray-700"
									htmlFor={budgetColorId}
								>
									{t("budgetsModal.budgetColorLabel")}
								</label>
								<input
									id={budgetColorId}
									type="color"
									value={budgetColor}
									onChange={(e) => setBudgetcolor(e.target.value)}
									className="validator rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] input-neutral input h-8 p-1 cursor-pointer"
									required
								/>
							</div>
						</div>

						<div className="flex gap-3 mb-2">
							{/* Montant alloué */}
							<div className="flex flex-col w-1/2">
								<label
									className="mb-1 ml-2 text-sm font-medium text-gray-700"
									htmlFor={allocatedAmountId}
								>
									{t("budgetsModal.allocatedAmountLabel")}
								</label>
								<input
									id={allocatedAmountId}
									type="number"
									value={allocatedAmount}
									onChange={(e) => setAllocatedAmount(Number(e.target.value))}
									className={`validator rounded-lg border focus:outline-none focus:ring-2 input-neutral input h-8 ${
										amountError
											? "border-red-500 focus:ring-red-500"
											: "border-gray-300 focus:ring-[var(--color-secondary)]"
									}`}
									required
								/>
							</div>
							{/* Seuil d'alerte */}
							<div className="flex flex-col w-1/2">
								<label
									htmlFor={warningAmountId}
									className="mb-1 ml-2 text-sm font-medium text-gray-700"
								>
									{t("budgetsModal.alertAmountLabel")}
								</label>
								<input
									type="number"
									id={warningAmountId}
									name="warningAmount"
									className={`validator rounded-lg border focus:outline-none focus:ring-2 input-neutral input h-8 ${
										amountError
											? "border-red-500 focus:ring-red-500"
											: "border-gray-300 focus:ring-[var(--color-secondary)]"
									}`}
									value={warningAmount}
									onChange={(e) => setWarningAmount(Number(e.target.value))}
									required
								/>
							</div>
						</div>

						{/* Message d'erreur pour les montants */}
						{amountError && (
							<p className="text-red-500 text-sm mb-3 text-center">
								{amountError}
							</p>
						)}

						{/* Icônes en grille */}
						<div className="mb-5">
							<div className="flex flex-col relative">
								<label
									htmlFor={emojiPickerId}
									className="mb-1 ml-2 text-sm font-medium text-gray-700"
								>
									{t("budgetsModal.budgetIconLabel")}
								</label>
							</div>
							<div
								id={emojiPickerId}
								className="border border-gray-300 h-[150px] overflow-y-auto w-9/10 rounded-lg flex justify-self-center min-w-full px-3.5 text-xl"
							>
								<Suspense fallback={<div>{t("budgetsModal.loading")}</div>}>
									<MyEmojiPicker
										onSelect={(emoji) => setSelectedEmoji(emoji)}
									/>
								</Suspense>
							</div>
							<div className="mt-4 text-center">
								<p className="text-sm text-gray-700 mb-1">
									{t("budgetsModal.selectedEmojiLabel")}
								</p>
								<div className="text-3xl">{selectedEmoji}</div>
							</div>
						</div>
						{emojiError && (
							<p className="text-red-500 text-sm mt-2 text-center">
								{emojiError}
							</p>
						)}

						{isEdit && (
							<button type="button">
								<img
									src="/trash.svg"
									alt={t("budgetsModal.trashIconLabel")}
									className="absolute w-8 right-0 bottom-1 cursor-pointer"
									onClick={() => setIsOpenDelete(true)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											setIsOpenDelete(true);
										}
									}}
								/>
							</button>
						)}
						<div className="flex justify-center mt-5">
							<button
								type="submit"
								className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded hover:opacity-90 flex justify-self-center mt-4 focus:ring-[var(--color-secondary)] cursor-pointer"
							>
								{isEdit ? t("budgetsModal.edit") : t("budgetsModal.create")}
							</button>
						</div>
						{/* Modal de confirmation avec DaisyUI */}
						<div
							className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${isOpenDelete ? "block" : "hidden"}`}
						>
							<div className="modal modal-open">
								<div className="modal-box">
									<h2 className="text-xl font-bold text-center">
										{t("budgetsModal.deleteConfirmation")}
										{budget?.name} ?
									</h2>
									<div className="flex justify-center mt-4 gap-4">
										<button
											type="button"
											className="btn btn-success"
											onClick={handleDelete}
										>
											{t("budgetsModal.confirmButton")}
										</button>
										<button
											type="button"
											className="btn btn-error ml-2"
											onClick={() => setIsOpenDelete(false)}
										>
											{t("budgetsModal.cancelButton")}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
