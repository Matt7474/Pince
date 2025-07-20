const API_URL = import.meta.env.PROD
	? "/api" // En production : même domaine
	: "http://localhost:3000"; // En développement : serveur séparé

export { API_URL };
