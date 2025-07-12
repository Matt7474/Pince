import { Navigate, Outlet } from "react-router-dom";

function isAuthenticated() {
	// Récupère le token depuis le sessionStorage
	const token = sessionStorage.getItem("token");
	// Si aucun token n'est trouvé, l'utilisateur n'est pas connecté
	if (!token) return false;

	try {
		// Oon prend le "payload" du token
		const [, payloadBase64] = token.split(".");

		// On décode le payload encodé en base64
		const payload = JSON.parse(atob(payloadBase64));

		// On recupere la propriété "exp" (expiration) du payload
		const exp = payload.exp;

		// Si la date d'expiration est dans le futur, le token est encore valide
		return exp * 1000 > Date.now();
	} catch {
		// En cas d'erreur l'utilisateur n'est pas authentifié
		return false;
	}
}

export default function PrivateRoute() {
	return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}
