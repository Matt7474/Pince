import sanitizeHtml from "sanitize-html";

export function sanitizeInput(input: unknown): string | null {
	if (typeof input !== "string") return null;
	return sanitizeHtml(input, {
		allowedTags: [], // Aucune balise HTML autorisée
		allowedAttributes: {}, // Aucun attribut non plus
	});
}
