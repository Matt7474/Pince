import { useEffect, useState } from "react";
import { fetchBudget } from "../api/budget";
import { fetchExpenses } from "../api/expense";
import Donut_homepage from "../components/Donut_homepage/Index";
import Last_expenses from "../components/Last_expenses";
import type { Budget } from "../types/Budget";
import type { Expense } from "../types/Expenses";

export default function Homepage() {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [expenses, setExpenses] = useState<Expense[] | null>(null);

	// Fonction pour charger les données
	const loadData = async () => {
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
			// On vérifie si c'est une erreur "pas de dépenses" pour ne pas la logger
			if (
				err instanceof Error &&
				err.message.includes("Erreur lors du chargement des dépenses")
			) {
				// C'est probablement une erreur "pas de dépenses", on met un tableau vide silencieusement
				setExpenses([]);
			} else {
				// Autre erreur, on la log
				console.error("Erreur lors du chargement des dépenses:", err);
				setExpenses([]);
			}
		}
	};

	// Chargement initial des données
	useEffect(() => {
		loadData();
	}, []);

	// Fonction callback pour rafraîchir les données
	const handleExpenseUpdate = () => {
		loadData();
	};

	console.log(budgets);

	return (
		<>
			<div className="w-full flex justify-center">
				<div className="w-full max-w-[480px]">
					<div className="bg-[var(--color-primary)] rounded-3xl w-full mt-4 flex flex-col justify-center shadow-md ">
						<div className="z-1 relative ">
							<Donut_homepage budgets={budgets} />
						</div>
					</div>
					<div className="bg-[var(--color-primary)] rounded-3xl mt-4 -mb-1 pb-3 shadow-md ">
						<Last_expenses
							expenses={expenses}
							budgets={budgets}
							onExpenseUpdate={handleExpenseUpdate}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
