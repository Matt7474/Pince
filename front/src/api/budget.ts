import type { Budget, ModifBudget, NewBudget } from "../types/Budget";

// Import de l'URL
const API_URL = import.meta.env.VITE_API_URL;

// Fonction utilitaire pour récupérer le token
function getAuthToken(): string | null {
	return sessionStorage.getItem("token");
}

// Methode fetch qui recupere les budgets
export async function fetchBudget(): Promise<Budget[]> {
	const token = getAuthToken();

	const res = await fetch(`${API_URL}/budgets/`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) throw new Error(`Erreur ${res.status}`);

	try {
		const json = await res.json();
		return json.data;
	} catch (_err) {
		throw new Error("❌ Réponse du serveur non JSON");
	}
}

// Methode fetch qui recupere 1 budget par son id
export async function fetchBudgetById(id: number): Promise<Budget> {
	const token = getAuthToken();

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
		return json.data;
	} catch (_err) {
		throw new Error("❌ Réponse du serveur non JSON");
	}
}

// Methode fetch qui recupere la position des budgets
export async function updateBudgetPosition(budgetId: number, position: number) {
	const token = getAuthToken();

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

// Methode fetch qui ajoute un nouveau budget
export async function AddBudget(newBudget: NewBudget) {
	const token = getAuthToken();
	const res = await fetch(`${API_URL}/budgets/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(newBudget),
	});

	if (!res.ok) {
		// Récupérer les détails de l'erreur
		const errorData = await res.json().catch(() => ({}));
		throw new Error(
			`Erreur lors de l'ajout du budget: ${errorData.message || res.statusText}`,
		);
	}

	return res.json();
}

// Methode fetch qui modifie un budget
export async function updateBudget(budget: ModifBudget, id: number) {
	const token = getAuthToken();
	const res = await fetch(`${API_URL}/budgets/${id}/`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(budget),
	});

	if (!res.ok) {
		const _err = await res.json().catch(() => ({}));
		throw new Error("Erreur lors de la mise à jour du budget");
	}

	return res.json();
}

// Methode fetch qui supprime un budget par son id
export async function DeleteBudget(id: number) {
	const token = getAuthToken();

	const res = await fetch(`${API_URL}/budgets/${id}/`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		const _errorData = await res.json().catch(() => ({}));
		throw new Error("Erreur lors de la suppression du budget");
	}
}
