import { useState } from "react";
import type { Budget } from "../../types/Budget";
import type { Expense } from "../../types/Expenses";

type Props = {
	currentBudget: Budget;
	expenses: Expense[];
	onEditExpense: (expense: Expense) => void;
};

export default function Details_expenses({
	currentBudget,
	expenses,
	onEditExpense,
}: Props) {
	const expensesForCurrentBudget = expenses.filter(
		(exp) => exp.budget_id === currentBudget.id,
	);

	const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
	const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

	const openExpenseModal = (expense: Expense) => {
		onEditExpense(expense);
	};

	return (
		<div>
			<div className="flex flex-col justify-center">
				<div className="h-56 overflow-y-auto mx-3 mt-6 border-2 rounded-2xl border-gray-400 lg:h-127">
					<table className="w-full text-left border-separate border-spacing-y-2 py-1.5">
						<tbody>
							{expensesForCurrentBudget.map((exp) => (
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
															backgroundColor: currentBudget.color || "#ccc",
														}}
													>
														<span className="text-xl -mt-0.5">
															{currentBudget.icon || "💰"}
														</span>
													</div>

													<div className="flex flex-col">
														<span className="font-semibold text-[14px] flex leading-tight text-left mb-1 ">
															{/* .charAt(0).toUpperCase() + exp.description.slice(1) rend la 1ere lettre majuscules */}
															{exp.description.charAt(0).toUpperCase() +
																exp.description.slice(1)}
														</span>

														<span className="italic text-[12px] text-gray-400 text-left">
															{new Date(exp.date).toLocaleDateString()}
														</span>
													</div>
												</div>

												<div className="flex justify-end mr-2 w-3/10">
													<span className="font-semibold text-[14px]">
														{exp.amount} €
													</span>
												</div>
											</button>
										</div>
									</td>
								</tr>
							))}

							{expensesForCurrentBudget.length === 0 && (
								<tr>
									<td colSpan={3} className="text-center text-gray-400 py-4">
										Aucune dépense pour ce budget.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
