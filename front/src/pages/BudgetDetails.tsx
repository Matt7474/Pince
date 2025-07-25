/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { fetchBudgetById } from "../api/budget";
import { fetchExpensesByBudget } from "../api/expense";
import Details_expenses from "../components/Details_expenses";
import Donut_budgets from "../components/Donut_budgets";
import Flag from "../components/Flag";
import BudgetModal from "../components/Modals/BudgetModal";
import ConfirmModal from "../components/Modals/ConfirmModal";
import ExpenseModal from "../components/Modals/ExpenseModal";
import type { Budget } from "../types/Budget";
import type { Expense } from "../types/Expenses";

export default function BudgetDetails() {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
	const [budget, setBudget] = useState<Budget | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
	const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
	const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
	const [confirmText, setConfirmText] = useState("");
	const [showConfirm, setShowConfirm] = useState(false);
	const [confirmKey, setConfirmKey] = useState(0);

	// Fonction pour recharger les données du budget
	const refreshBudget = async () => {
		if (!id) return;
		try {
			const data = await fetchBudgetById(Number(id));
			setBudget(data);
		} catch (error) {
			console.error("❌ Erreur lors du chargement du budget :", error);
		}
	};

	useEffect(() => {
		refreshBudget();
	}, [id]);

	// Fonction pour recharger les données des dépenses
	const refreshExpenses = async () => {
		if (budget?.id) {
			try {
				const data = await fetchExpensesByBudget(budget.id);
				setExpenses(data);
				setConfirmKey((prev) => prev + 1);
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
		}
	};

	useEffect(() => {
		if (budget?.id) {
			refreshExpenses();
		}
	}, [budget?.id]);
	useEffect(() => {
		if (id) {
			fetchBudgetById(Number(id))
				.then((data) => {
					setBudget(data);
					setLoading(false);
					refreshExpenses();
				})
				.catch((err) => {
					console.error(err);
					setError(t("budgetDetails.loadError"));
					setLoading(false);
				});
		}
	}, [id]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setIsSettingsModalOpen(false);
				setIsExpenseModalOpen(false);
				setSelectedBudget(null);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	// Callback appelé après l'ajout/modification d'une dépense
	const handleExpenseUpdate = () => {
		refreshBudget();
		refreshExpenses();
		setIsExpenseModalOpen(false);
		setSelectedBudget(null);
		setSelectedExpense(null);
		handleShowConfirm(t("budgetDetails.expenseUpdated"));
		setConfirmKey((prev) => prev + 1);
	};

	if (loading) return <p>{t("budgetDetails.loading")}</p>;
	if (error) return <p>{error}</p>;
	if (!budget) return <p>{t("budgetDetails.notFound")}</p>;

	const remainingBudget = budget.allocated_amount - budget.spent_amount;
	const warningAmount = budget.warning_amount;
	const spent_amount = Number(budget.spent_amount);
	const allocated_amount = budget.allocated_amount;

	const handleEditExpense = (expense: Expense) => {
		setSelectedExpense(expense);
		setIsExpenseModalOpen(true);
	};

	let fontColorSpent = "text-gray-500";
	if (remainingBudget <= 0) {
		fontColorSpent = "text-red-500";
	} else if (remainingBudget <= warningAmount) {
		fontColorSpent = "text-orange-400";
	}

	let flagColor: string | null = null;
	let flagText: string | null = null;
	if (spent_amount > allocated_amount) {
		flagColor = "bg-red-400";
		flagText = `⚠️ ${t("budgets.overBudget")}`;
	} else if (remainingBudget <= warningAmount) {
		flagColor = "bg-amber-400";
		flagText = `⚠️ ${t("budgets.alertThresholdReached")}`;
	}

	const handleShowConfirm = (text: string) => {
		setConfirmText(text);
		setShowConfirm(true);
		setTimeout(() => setShowConfirm(false), 9500);
	};

	return (
		<div className="flex flex-col w-full pt-6 items-center md:px-20 lg:px-40 xl:px-100 2xl:px-120">
			<div className="rounded-3xl pb-4 -mb-5 -mt-3 w-full  grid-cols-1 justify-self-center sm:max-w-110 md:max-w-120">
				<div className="m-2 rounded-3xl shadow-md bg-[var(--color-primary)] p-4 lg:h-244  overflow-hidden">
					<div className="flex relative justify-center mb-4">
						<div>
							{/* Flèche retour */}
							<Link to="/budgets" className="z-10 flex">
								<img
									src="/arrow.svg"
									alt={t("budgetDetails.backIconAlt")}
									className="w-8 absolute left-0 opacity-70 hover:opacity-100"
								/>
							</Link>
						</div>
						<div className="flex flex-col text-center font-semibold -mt-2">
							<p>{t("budgetDetails.title")}</p>
							{/* .charAt(0).toUpperCase() + exp.description.slice(1) rend la 1ere lettre majuscules */}
							<p className="yellowtail-regular text-3xl">
								{budget.name.charAt(0).toUpperCase() + budget.name.slice(1)}
							</p>
						</div>
					</div>
					<div className="relative">
						<span
							className="text-5xl absolute top-1/5 mt-25 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
							role="img"
							aria-label={budget?.name}
						>
							{budget?.icon}
						</span>

						<div className="absolute -top-10 -left-12.5">
							{/* 🔔 Indicateur d'alerte si applicable */}
							{flagText && (
								<Flag
									color={flagColor}
									text={flagText}
									width={11}
									height={1.5}
								/>
							)}
						</div>
					</div>
					<div className="relative flex flex-col items-center justify-center">
						{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
						<div
							onClick={() => {
								setSelectedBudget(budget);
								setIsSettingsModalOpen(true);
							}}
						>
							<Donut_budgets
								budget={budget}
								height={300}
								width={300}
								size={85}
								key={`${budget.spent_amount}-${budget.allocated_amount}-${budget.color}`}
								fontSizePersoSpent={"text-gray-500 text-xl font-semibold mt-12"}
								fontSizePersoRemaining={`${fontColorSpent} text-xl font-semibold`}
							/>
						</div>

						<button
							type="button"
							onClick={() => {
								setIsExpenseModalOpen(true);
								setSelectedBudget(budget);
							}}
							className="w-18 absolute bottom-2.5 left-1 opacity-90 hover:opacity-100 transition-opacity z-10 cursor-pointer"
						>
							<img
								src="/plus.svg"
								alt={t("budgetDetails.addButtonAlt")}
								className="w-7 opacity-70 hover:opacity-100 cursor-pointer"
							/>
							<div className="absolute -left-3">
								<p className="text-[14px] font-semibold opacity-90">
									{t("budgetDetails.addLabel")}
								</p>
								<p className="text-[14px] font-semibold opacity-90 -mt-1">
									{t("budgetDetails.expenseLabel")}
								</p>
							</div>
						</button>

						<button
							type="button"
							tabIndex={0}
							className="w-18 absolute -bottom-5 -right-5 opacity-90 hover:opacity-100 transition-opacity z-10 cursor-pointer"
							onClick={() => {
								setSelectedBudget(budget);
								setIsSettingsModalOpen(true);
							}}
						>
							<img
								src="/settings.svg"
								alt={t("budgetDetails.settingsButton")}
								className="opacity-70"
							/>
							<div className="absolute -left-1 -mt-7">
								<p className="text-[14px] font-semibold opacity-90">
									{t("budgetDetails.settingsLabel")}
								</p>
								<p className="text-[14px] font-semibold opacity-90 -mt-1">
									{t("budgetDetails.budgetLabel")}
								</p>
							</div>
						</button>
					</div>

					<h2 className="text-xl font-semibold mt-8 -mb-3 px-3 text-center">
						{t("budgetDetails.myExpensesTitle")}{" "}
						{budget.name.charAt(0).toUpperCase() + budget.name.slice(1)}
					</h2>

					<div className="-mx-3">
						<Details_expenses
							currentBudget={budget}
							expenses={expenses}
							onEditExpense={handleEditExpense}
							key={budget.spent_amount}
						/>
					</div>
				</div>
			</div>
			{isExpenseModalOpen && budget && (
				<ExpenseModal
					isOpen={isExpenseModalOpen}
					onClose={() => {
						setIsExpenseModalOpen(false);
						setSelectedExpense(null);
						setSelectedBudget(null);
					}}
					budget={budget}
					mode={selectedExpense ? "edit" : "create"}
					expense={selectedExpense}
					onExpenseUpdate={handleExpenseUpdate}
				/>
			)}
			{showConfirm && (
				<div className="fixed bottom-4 left-4 z-50">
					<ConfirmModal confirmText={confirmText} key={confirmKey} />
				</div>
			)}
			{isSettingsModalOpen && selectedBudget && (
				<BudgetModal
					isOpen={isSettingsModalOpen}
					onClose={() => {
						setIsSettingsModalOpen(false);
						setSelectedBudget(null);
					}}
					mode="edit"
					budget={selectedBudget}
					onConfirmMessage={(text: string) => handleShowConfirm(text)}
					onBudgetCreated={() => {}}
					onBudgetUpdated={() => {
						refreshBudget();
						setIsSettingsModalOpen(false);
					}}
					onBudgetDeleted={(id: number) => {
						// Optionnel: gérer suppression budget si besoin
						setIsSettingsModalOpen(false);
					}}
				/>
			)}
		</div>
	);
}
