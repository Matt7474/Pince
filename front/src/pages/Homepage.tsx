import { useEffect, useState } from "react";
// import { fetchBudget } from "../api/budget";
// import { fetchExpenses } from "../api/expense";
import { fetchBudget } from "../api/budget";
import { fetchExpenses } from "../api/expense";
import Donut_homepage from "../components/Donut_homepage/Index";
import Last_expenses from "../components/Last_ expenses";
import type { Budget } from "../types/Budget";
import type { Expense } from "../types/Expenses";

export default function Homepage() {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [expenses, setExpenses] = useState<Expense[] | null>(null);

	useEffect(() => {
		const getData = async () => {
			try {
				const budgetsData: Budget[] = await fetchBudget();

				setBudgets(budgetsData);
			} catch (err) {
				console.error("❌ Erreur lors du chargement des budgets :", err);
			}

			try {
				const expensesData: Expense[] = await fetchExpenses();
				setExpenses(expensesData);
			} catch (err) {
				console.error("❌ Erreur lors du chargement des dépenses :", err);
			}
		};

		getData();
	}, []);

	console.log(budgets);

	return (
		<>
			{/* div className="mb-1 grid-cols-1 justify-self-center sm:max-w-90 md:max-w-120"> */}
			<div className="w-full flex justify-center">
				<div className="w-full max-w-[480px]">
					<div className="bg-[var(--color-primary)] rounded-3xl w-full mt-4 flex flex-col justify-center shadow-md ">
						<div className="z-1 relative ">
							<Donut_homepage budgets={budgets} />
							{/* Rond blanc dans le donut */}
							{/* <div className="bg-white h-50 w-50 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-8 pointer-events-none  z-[-1] "></div> */}
						</div>
					</div>
					<div className="bg-[var(--color-primary)] rounded-3xl mt-4 -mb-1 pb-3 shadow-md ">
						<Last_expenses expenses={expenses} budgets={budgets} />
					</div>
				</div>
			</div>
		</>
	);
}
