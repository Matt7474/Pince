import type { Budget, ModifBudget, NewBudget } from "../types/Budget";

// Import de l'URL et on va chercher le token stocké dans le session storage pour le transmettre dans le header
const API_URL = import.meta.env.VITE_API_URL;
const token = sessionStorage.getItem("authToken");

//
// Methode fetch qui recupere les budgets
export async function fetchBudget(): Promise<Budget[]> {
	const token = sessionStorage.getItem("token");
	console.log("🔑 Token utilisé :", token);
	console.log("🌐 Appel à :", `${API_URL}/budgets/`);

	const res = await fetch(`${API_URL}/budgets/`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) throw new Error(`Erreur ${res.status}}`);

	try {
		const json = await res.json();
		console.log("✅ JSON parsé :", json);
		return json.data;
	} catch (err) {
		throw new Error("❌ Réponse du serveur non JSON");
	}
}

// Methode fetch qui recupere 1 budget par son id
export async function fetchBudgetById(id: number): Promise<Budget> {
	const token = sessionStorage.getItem("token");

	const res = await fetch(`${API_URL}/budgets/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) throw new Error(`Erreur ${res.status}`);

	try {
		const json = await res.json();
		console.log("✅ JSON parsé :", json);

		// Assure-toi que c’est bien un seul budget
		return json.data;
	} catch (err) {
		throw new Error("❌ Réponse du serveur non JSON");
	}
}

// Methode fetch qui recupere la position des budgets
export async function updateBudgetPosition(budgetId: number, position: number) {
	const res = await fetch(`${API_URL}/budgets/${budgetId}/position`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ position }),
	});

	if (!res.ok) {
		throw new Error("Erreur lors de la mise à jour de la position");
	}
}

//
// Methode fetch qui ajoute un nouveau budget
export async function AddBudget(newBudget: NewBudget) {
	console.log("token avant le Addbudget", token);

	const res = await fetch(`${API_URL}/budgets/`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,

			"Content-Type": "application/json",
		},
		body: JSON.stringify(newBudget),
	});
	if (!res.ok) throw new Error("Erreur lors de l'ajout du budget");
	return res.json();
}

//
// Methode fetch qui modifie un budget
console.log("token avant update budget", token);

export async function updateBudget(budget: ModifBudget, id: number) {
	const res = await fetch(`${API_URL}/budgets/${id}/`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(budget),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		console.error("Erreur API :", err);
		throw new Error("Erreur lors de la mise à jour du budget");
	}

	return res.json();
}

//
// Methode fetch qui supprime un budget par son id
export async function DeleteBudget(id: number) {
	const res = await fetch(`${API_URL}/budgets/${id}/`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
	if (!res.ok) throw new Error("Erreur lors de la suppression du budget");

	return;
}
