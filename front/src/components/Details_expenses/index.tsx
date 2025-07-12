import { useState } from "react";
import { fake_budgets } from "../../fake_data/fake_budgets";
import type { Expense } from "../../types/Expenses";
import ExpenseModal from "../Modals/ExpenseModal";

type Props = {
	currentBudgetId?: number;
	expenses: Expense[];
	onEditExpense: (expense: Expense) => void;
};

export default function Details_expenses({
	currentBudgetId,
	expenses,
	onEditExpense,
}: Props) {
	const expensesForCurrentBudget = expenses.filter(
		(exp) => exp.budget_id === currentBudgetId,
	);

	const currentBudget = fake_budgets.find((b) => b.id === currentBudgetId);

	const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
	const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

	const openExpenseModal = (expense: Expense) => {
		onEditExpense(expense); // <- on appelle la fonction parent
	};

	return (
		<div>
			<div className="flex flex-col justify-center">
				<div className="h-56 overflow-y-auto mx-3 mt-6 border-2 rounded-2xl border-gray-400 lg:h-127">
					<table className="w-full text-left border-separate border-spacing-y-2 py-1.5">
						<tbody>
							{expensesForCurrentBudget.map((exp) => {
								const budget = fake_budgets.find((b) => b.id === exp.budget_id);

								return (
									<tr
										key={exp.id}
										className="cursor-pointer hover:bg-gray-100 transition"
									>
										<td colSpan={3}>
											<div className="border-b border-gray-300 mr-2 items-center pb-2">
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
															<img
																src={budget?.icon || "/budgetsLogo/default.svg"}
																alt={exp.description}
																className="w-full h-full p-1 object-contain overflow-hidden"
															/>
														</div>

														<div className="flex flex-col">
															<span className="font-semibold text-[14px] flex leading-tight text-left mb-1 ">
																{exp.description}
															</span>
															<span className="italic text-[12px] text-gray-400 text-left">
																{new Date(exp.date).toLocaleDateString()}
															</span>
														</div>
													</div>

													<div className="flex justify-end mr-2 w-3/10 ">
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

							{expensesForCurrentBudget.length === 0 && (
								<tr>
									<td colSpan={3} className="text-center text-gray-400 py-4">
										Aucune dépense pour ce budget.
									</td>
								</tr>
							)}
						</tbody>
					</table>
					{isExpenseModalOpen && selectedExpense && currentBudget && (
						<ExpenseModal
							isOpen={isExpenseModalOpen}
							onClose={() => setIsExpenseModalOpen(false)}
							expense={selectedExpense}
							mode="edit"
							budget={currentBudget}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
