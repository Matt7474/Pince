/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { useEffect, useState } from "react";
import { fetchBudget } from "../api/budget";
import { fetchExpenses } from "../api/expense";
import Donut_homepage from "../components/Donut_homepage/Index";
import Last_expenses from "../components/Last_expenses";
import type { Budget } from "../types/Budget";
import type { Expense } from "../types/Expenses";
import ConfirmModal from "../components/Modals/ConfirmModal";
export default function Homepage() {
	const [budgets, setBudgets] = useState<Budget[]>([]);
	const [expenses, setExpenses] = useState<Expense[] | null>(null);
	const [confirmMessage, setConfirmMessage] = useState<string | null>(null);
	const [budgetsVersion, setBudgetsVersion] = useState(0);

	// Fonction pour charger les données
	const loadData = async () => {
		// Vérifier que le token existe avant de faire les appels
		const token = sessionStorage.getItem("authToken");
		if (!token) {
			console.log("Pas de token, on attend...");
			return;
		}

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
			if (
				err instanceof Error &&
				err.message.includes("Erreur lors du chargement des dépenses")
			) {
				setExpenses([]);
			} else {
				console.error("Erreur lors du chargement des dépenses:", err);
				setExpenses([]);
			}
		}
	};

	// Chargement initial des données avec retry
	useEffect(() => {
		const tryLoadData = () => {
			const token = sessionStorage.getItem("authToken");
			if (token) {
				loadData();
			} else {
				// Si pas de token, on réessaie après 100ms
				setTimeout(tryLoadData, 200);
			}
		};

		tryLoadData();
	}, []);

	// Fonction callback pour rafraîchir les données
	const handleExpenseUpdate = () => {
		loadData();
		setBudgetsVersion((prev) => prev + 1); // force un re-render du Donut
	};
	useEffect(() => {
		if (confirmMessage) {
			const timeout = setTimeout(() => {
				setConfirmMessage(""); // reset après 2 sec
			}, 2000);
			return () => clearTimeout(timeout);
		}
	}, [confirmMessage]);
	return (
		<>
			<div className="w-full flex justify-center xl:pb-29">
				<div className="w-full max-w-[480px]">
					<div className="bg-[var(--color-primary)] rounded-3xl w-full mt-4 flex flex-col justify-center shadow-md ">
						<div className="z-[1] mt-2">
							<Donut_homepage budgets={budgets} key={budgetsVersion} />
						</div>
					</div>
					<div className="bg-[var(--color-primary)] rounded-3xl mt-4 -mb-1 pb-3 shadow-md ">
						<Last_expenses
							expenses={expenses}
							budgets={budgets}
							onExpenseUpdate={handleExpenseUpdate}
							onConfirmMessage={setConfirmMessage}
						/>
					</div>
				</div>
			</div>
			{confirmMessage && <ConfirmModal confirmText={confirmMessage} />}
		</>
	);
}
