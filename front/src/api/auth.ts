const API_URL = import.meta.env.VITE_API_URL;

interface RegisterData {
	last_name: string;
	first_name: string;
	email: string;
	password: string;
}
export async function registerUser(userData: RegisterData) {
	const res = await fetch(`${API_URL}/auth/register`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
		mode: "cors",
	});

	if (!res.ok) {
		const errorData = await res.json();
		const error = new Error("Erreur lors de l'inscription");
		(error as any).response = {
			status: res.status,
			message: errorData.message,
		};

		throw error;
	}

	const data = await res.json();
	console.log("Réponse API:", data);
	return data;
}

interface LoginData {
	email: string;
	password: string;
}
export async function loginUser(userData: LoginData) {
	const res = await fetch(`${API_URL}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(userData),
	});

	if (!res.ok) {
		const text = await res.text();
		console.error("Erreur backend:", res.status, text);
		const error = new Error(text || "Erreur de connexion");
		(error as any).status = res.status;
		throw error;
	}

	const data = await res.json();
	console.log("data", data);

	sessionStorage.setItem("token", data.token);

	// Appliquer le thème si dispo
	if (data.user?.theme) {
		document.documentElement.style.setProperty(
			"--color-secondary",
			data.user.theme,
		);
		localStorage.setItem("color-secondary", data.user.theme);
	}

	console.log("Réponse API:", data);
	console.log("token recu au login", data.token);

	return data;
}

export async function ResetPass(userData: LoginData) {
	const res = await fetch(
		`${API_URL}/auth/reset-password-request
`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		},
	);

	if (!res.ok) throw new Error("Erreur de connexion");
	const data = await res.json();
	return data;
}
