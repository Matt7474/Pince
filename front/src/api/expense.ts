import type { Expense, NewExpense, UpdateExpense } from "../types/Expenses";

// Import de l'URL et on va chercher le token stocké dans le session storage pour le transmettre dans le header
const API_URL = import.meta.env.VITE_API_URL;
const token = sessionStorage.getItem("authToken");

//
// Methode fetch qui va chercher toutes les dépenses
export async function fetchExpenses(): Promise<Expense[]> {
	const res = await fetch(`${API_URL}/expenses/`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) throw new Error("Erreur lors du chargement des dépenses");
	const json = await res.json();
	// Tu aplatis ici les objets pour ne garder que expenditure + color + icon
	const flatExpenses: Expense[] = json.data.map((item: any) => ({
		...item.expenditure,
		budgetColor: item.budgetColor,
		budgetIcon: item.budgetIcon,
	}));
	return flatExpenses;
}

//
// Methode fetch qui va chercher les dépenses d'un budget
export async function fetchExpensesByBudget(budget: number) {
	console.log("budget n°", budget);
	const res = await fetch(`${API_URL}/expenses?budgetId=${budget}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) throw new Error("Erreur lors du chargement des dépenses");
	if (res.status === 404) {
		return []; // On retourne un tableau vide si pas de dépenses
	}
	const result = await res.json();
	return result.data;
}

//
// Methode fetch qui ajoute une dépense à un budget
export async function addExpense(
	newExpense: NewExpense,
	selectedBudget: number,
) {
	console.log("token avant le AddExpense", token);
	console.log("selectedBudget", selectedBudget);
	console.log("newExpense", newExpense);

	const res = await fetch(`${API_URL}/expenses`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newExpense),
	});
	if (!res.ok) throw new Error("Erreur lors de l'ajout de la dépense");
	return res.json();
}

//
// Methode fetch qui modifie une dépense d'un budget
console.log("token avant update dépense", token);

export async function updateExpense(
	expenseId: number,
	expenseToSend: UpdateExpense,
) {
	console.log("token avant le updateExpense", token);
	console.log("expenseId", expenseId);
	console.log("expenseToSend", expenseToSend);

	const res = await fetch(`${API_URL}/expenses/${expenseId}/`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
			Connection: "close", // Force HTTP/1.1
		},
		body: JSON.stringify(expenseToSend),
	});
	if (!res.ok) throw new Error("Erreur lors de l'ajout de la dépense");
	return res.json();
}

//
// Methode fetch qui supprime une dépense par son id
export async function DeleteExpense(expenseId: number) {
	const res = await fetch(`${API_URL}/expenses/${expenseId}/`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) throw new Error("Erreur lors de la suppression de la dépense");

	return;
}
