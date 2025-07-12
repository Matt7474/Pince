// src/api/user.ts
const API_URL = import.meta.env.VITE_API_URL;

export async function updateUserTheme(color: string): Promise<void> {
	const token = sessionStorage.getItem("token");

	if (!token) {
		throw new Error("Aucun token trouvé.");
	}

	const res = await fetch(`${API_URL}/users/theme`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ theme: color }),
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(errorText || "Erreur lors de la mise à jour du thème.");
	}
}
