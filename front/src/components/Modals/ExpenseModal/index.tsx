import { useEffect, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { addExpense, DeleteExpense, updateExpense } from "../../../api/expense";
import type {
	Expense,
	NewExpense,
	UpdateExpense,
} from "../../../types/Expenses";

type Budget = {
	id: number;
	name: string;
	allocated_amount: number;
	spent_amount: number;
};

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	budget?: Budget | null; // null si création
	budgetName?: string;
	mode: "create" | "edit";
	expense?: Expense | null;
	onExpenseUpdate?: () => void; // Callback pour notifier le parent
};

export default function ExpenseModal({
	onClose,
	budget,
	mode,
	expense,
	isOpen,
	onExpenseUpdate,
}: ModalProps) {
	const { t } = useTranslation();
	const isEdit = mode === "edit";
	const devise = t("devise.title");

	const descriptionId = useId();
	const [description, setDescription] = useState("");
	const amountId = useId();
	const [amount, setAmount] = useState("");
	const dateId = useId();
	const [date, setDate] = useState("");
	// const paymentMethodId = useId();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [isOpenDelete, setIsOpenDelete] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		// Construire l'objet dépense à envoyer
		const expenseData = {
			description,
			amount: Number(amount),
			date,
			payment_method: "cash",
			budget_id: budget?.id ?? 0,
		};

		try {
			if (mode === "edit" && expense) {
				// Mode édition : on update
				await updateExpense(expense.id, expenseData as UpdateExpense);
			} else if (mode === "create" && budget) {
				// Mode création : on ajoute
				await addExpense(expenseData as NewExpense, budget.id);
			} else {
				throw new Error("Données du formulaire invalides");
			}

			// Notifier le parent que la dépense a été mise à jour
			if (onExpenseUpdate) {
				onExpenseUpdate();
			}

			// Fermer la modale
			onClose();
		} catch (err: any) {
			setError(err.message || "Erreur inconnue");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const html = document.documentElement;

		if (isOpen) {
			document.body.classList.add("modal-open");
			html.classList.add("modal-open");
		} else {
			document.body.classList.remove("modal-open");
			html.classList.remove("modal-open");
		}

		return () => {
			document.body.classList.remove("modal-open");
			html.classList.remove("modal-open");
		};
	}, [isOpen]);

	// Fonction qui permet de convertir une date ISO en date locale
	// En dehors du composant
	function getLocalDateString(dateStr: string): string {
		const date = new Date(dateStr);
		const offsetDate = new Date(
			date.getTime() - date.getTimezoneOffset() * 60000,
		);
		return offsetDate.toISOString().split("T")[0];
	}

	// Permet de pré-remplir les champs en mode edition
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isEdit && expense) {
			setDescription(expense.description);
			setAmount(expense.amount.toString());
			setDate(getLocalDateString(expense.date));
		} else {
			// mode create : on vide les champs
			setDescription("");
			setAmount("");
			const today = new Date().toISOString().split("T")[0];
			setDate(today);
		}
	}, [expense, isEdit]);

	// Suppression d'une dépense avec confirmation
	const handleDelete = async () => {
		if (!expense) return;

		try {
			await DeleteExpense(expense.id); // Appelle l’API

			if (onExpenseUpdate) {
				onExpenseUpdate(); // Re-notifie le parent (ex: pour recharger la liste)
			}

			setIsOpenDelete(false); // Ferme la modale de confirmation
			onClose(); // Ferme la modale principale
		} catch (err: any) {
			setError(err.message || t("expensesModal.errorAmountTooHigh"));
		}
	};

	return (
		<>
			<div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 z-50">
				<div
					className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 w-96 relative "
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					tabIndex={-1} // non focusable au clavier
					role="dialog" // élément non interactif
				>
					{/* Bouton fermeture */}
					<button
						type="button"
						onClick={onClose}
						className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
					>
						<img
							src="/close.svg"
							alt={t("expensesModal.closeButton")}
							className="w-5 h-5"
						/>
					</button>

					<h2 className="text-md font-semibold mb-6 text-black text-center">
						{isEdit ? (
							<>
								{t("expensesModal.editExpenseTitle")} : {expense?.description}{" "}
								<br />
								{t("expensesModal.budgetPrefix")} {budget?.name}
							</>
						) : (
							<>
								{t("expensesModal.addExpenseToBudget")} {budget?.name} <br />
								{t("expensesModal.expenseAddedToBudget")} {budget?.name}
							</>
						)}
					</h2>

					{error && (
						<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
							{error}
						</div>
					)}

					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
						autoComplete="off"
					>
						<div className="relative">
							<div className="">
								{/* Description de la dépense */}
								<div>
									<label
										htmlFor={descriptionId}
										className="mb-1 ml-2 text-sm font-medium text-gray-700"
									>
										{t("expensesModal.expenseDescription")}
									</label>
									<textarea
										id={descriptionId}
										className="validator rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] input-neutral input resize-none w-full h-20 p-2"
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										maxLength={50}
										rows={2}
										required
										disabled={loading}
									/>
									<p className="text-xs text-gray-500 text-right mt-1">
										{description.length}/50
										{t("expensesModal.charCount")}
									</p>
								</div>

								<div className="flex gap-3 mt-4">
									{/* Montant de la dépense */}
									<div className="relative w-1/2">
										<label
											htmlFor={amountId}
											className="mb-1 ml-2 text-sm font-medium text-gray-700"
										>
											{t("expensesModal.expenseAmount")}
										</label>
										<input
											type="number"
											id={amountId}
											className="validator rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] input-neutral input h-8 mb-4 pl-7"
											value={amount}
											onChange={(e) => setAmount(e.target.value)}
											required
											disabled={loading}
											min="0"
											step="0.01"
										/>
										<img
											src={`/${t("devise.title")}.svg`}
											alt={t("devise.title")}
											className="absolute w-3.5 -mt-5.5 left-2 mr-3 opacity-80 z-20"
										/>
									</div>
									{/* Date de la dépense */}
									<div className="  w-1/2">
										<label
											htmlFor={dateId}
											className="mb-1 ml-2 text-sm font-medium text-gray-700"
										>
											{t("expensesModal.expenseDate")}
										</label>
										<input
											type="date"
											id={dateId}
											className="validator rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] input-neutral input h-8 mb-4"
											value={date}
											onChange={(e) => setDate(e.target.value)}
											required
											disabled={loading}
										/>
									</div>
								</div>
							</div>

							{isEdit && (
								<button type="button">
									<img
										src="/trash.svg"
										alt={t("budgetsModal.trashIconLabel")}
										className="absolute w-8 right-0 mt-5.5 cursor-pointer"
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
									className="px-4 mb-1 py-2 bg-[var(--color-secondary)] text-white rounded hover:opacity-90 flex justify-self-center mt-4 focus:ring-[var(--color-secondary)] cursor-pointer disabled:opacity-50"
									disabled={loading}
								>
									{loading
										? t("expensesModal.loading")
										: isEdit
											? t("expensesModal.editExpenseTitle")
											: t("expensesModal.createExpenseTitle")}
								</button>
							</div>

							{/* Modal de confirmation de suppresion avec DaisyUI */}
							<div
								className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${isOpenDelete ? "block" : "hidden"}`}
							>
								<div className="modal modal-open">
									<div className="modal-box">
										<h2 className="text-xl font-bold text-center">
											{t("budgetsModal.confirmDeleteExpense")} : <br />"
											{description}" ?
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
		</>
	);
}
