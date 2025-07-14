import { useState } from "react";
import { Link } from "react-router-dom";
import type { Budget } from "../../types/Budget";
import type { Expense } from "../../types/Expenses";
import ExpenseModal from "../Modals/ExpenseModal";

type LastExpensesProps = {
	budgets: Budget[];
	expenses: Expense[] | null;
	onExpenseUpdate?: () => void; // Nouveau prop pour le callback
};

export default function Last_expenses({
	expenses,
	budgets,
	onExpenseUpdate,
}: LastExpensesProps) {
	if (!expenses || expenses.length === 0) {
		return (
			<div className="py-3 flex flex-col justify-center">
				<p className="text-center mb-3">Aucunes dépenses à afficher</p>

				{budgets && budgets.length > 0 && (
					<Link
						className="text-center underline font-semibold text-[var(--color-secondary)]"
						to={"/budgets/"}
					>
						Créer ma première dépense
					</Link>
				)}
			</div>
		);
	}

	console.log("Budget reçus dans Last_expenses :", budgets);
	console.log("Dépenses reçus dans Last_expenses :", expenses);
	const [disabledBudgets, setDisabledBudgets] = useState<number[]>([]);
	const [disableAll, setDisableAll] = useState(false);

	const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
	const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

	const openExpenseModal = (expense: Expense) => {
		setSelectedExpense(expense);
		setIsExpenseModalOpen(true);
	};

	// Activer / désactiver un seul budget
	const toggleBudget = (id: number): void => {
		setDisabledBudgets((prev: number[]) =>
			prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
		);
	};

	// Désactiver / réactiver tous les budgets
	const handleClick = () => {
		const newState = !disableAll;
		setDisableAll(newState);
		setDisabledBudgets(newState ? budgets.map((budget) => budget.id) : []);
	};

	// Recuperation du budget correspondant a la dépense
	const selectedBudget = selectedExpense
		? budgets.find((budget) => budget.id === selectedExpense.budget_id) || null
		: null;

	return (
		<>
			<div className="">
				<div className="flex justify-between mx-4 pt-3">
					<h3 className="font-semibold text-lg">Mes dernières dépenses</h3>

					<div className="mt-1.5">
						<label className="text-[11px] cursor-pointer flex items-center gap-2">
							{disableAll ? "Réactiver tout" : "Désactiver tout"}
							<input
								type="checkbox"
								className="checkbox checkbox-secondary w-4 h-4 p-0.5!"
								checked={!disableAll}
								onChange={handleClick}
							/>
						</label>
					</div>
				</div>

				{/* icônes des budgets */}
				<div className="flex flex-col justify-center ">
					<div className="flex mx-4 mt-4 gap-2 justify-center flex-wrap">
						{budgets.map((budget) => {
							const isDisabled = disabledBudgets.includes(budget.id);

							return (
								<div key={budget.id} className="flex items-center ">
									<button
										type="button"
										className="w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer"
										style={{
											backgroundColor: isDisabled ? "#ccc" : budget.color,
											backgroundImage: isDisabled
												? "repeating-linear-gradient(130deg, #ccc, #ccc 5px, #aaa 2px, #aaa 10px)"
												: "none",
										}}
										onClick={() => toggleBudget(budget.id)}
									>
										<span
											className="text-xl"
											role="img"
											aria-label={budget.name}
										>
											{budget.icon}
										</span>
									</button>
								</div>
							);
						})}
					</div>

					{/* tableau scrollable */}
					<div className="max-h-96 overflow-y-auto mx-3 mt-6 border-2 rounded-2xl border-gray-400">
						<table className="w-full text-left border-separate border-spacing-y-2 py-1.5">
							<tbody>
								{expenses
									.filter((exp) => !disabledBudgets.includes(exp.budget_id))
									.map((exp) => {
										const budget = budgets.find((b) => b.id === exp.budget_id);

										return (
											<tr
												key={exp.id}
												className="cursor-pointer hover:bg-gray-100 transition "
											>
												<td colSpan={3}>
													<div className="border-b border-gray-300 mr-2 items-center pb-2 ">
														<button
															type="button"
															onClick={() => openExpenseModal(exp)}
															className="flex justify-between items-center gap-1 w-full cursor-pointer"
														>
															<div className="flex w-ful">
																<div
																	className="max-w-8 max-h-8 mx-2 border rounded-full p-1 flex items-center justify-center"
																	style={{
																		backgroundColor: budget?.color || "#ccc",
																	}}
																>
																	<span
																		className="text-xl -mt-0.5"
																		role="img"
																		aria-label={budget?.name}
																	>
																		{budget?.icon}
																	</span>
																</div>

																<div className="flex flex-col justify-self-start">
																	<span className="font-semibold text-[14px] text-left leading-tight mb-1">
																		{exp.description}
																	</span>
																	<span className="italic text-[12px] text-left text-gray-400">
																		{new Date(exp.date).toLocaleDateString()}
																	</span>
																</div>
															</div>

															<div className="flex justify-end mr-2 w-2/10 ">
																<span className="font-semibold text-[14px]">
																	{exp.amount} €
																</span>
															</div>
														</button>
													</div>
												</td>
											</tr>
										);
									})}
							</tbody>
						</table>
						{isExpenseModalOpen && selectedExpense && (
							<ExpenseModal
								isOpen={isExpenseModalOpen}
								onClose={() => setIsExpenseModalOpen(false)}
								expense={selectedExpense}
								budget={selectedBudget}
								mode="edit"
								onExpenseUpdate={onExpenseUpdate} // Passer le callback au modal
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
