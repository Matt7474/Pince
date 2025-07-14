// src/api/user.ts
const API_URL = import.meta.env.VITE_API_URL;
function getAuthToken(): string | null {
	return sessionStorage.getItem("token");
}

interface UserData {
	last_name: string;
	first_name: string;
	email: string;
}
export async function UpdateUser(userData: UserData) {
	const token = getAuthToken();
	const res = await fetch(`${API_URL}/users/me`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(userData),
	});

	if (!res.ok) {
		const text = await res.text();
		console.error("Erreur backend:", res.status, text);
		const error = new Error(text || "Erreur de modification du profil");
		(error as any).status = res.status;
		throw error;
	}

	const data = await res.json();
	return data;
}

type UpdatePasswordPayload = {
	current_password: string;
	new_password: string;
};
export async function UpdateUserPassword(data: UpdatePasswordPayload) {
	const token = sessionStorage.getItem("token");
	const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me/password`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const error = await res.json();
		throw new Error(
			error.message || "Erreur lors du changement de mot de passe.",
		);
	}

	return await res.json();
}

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
