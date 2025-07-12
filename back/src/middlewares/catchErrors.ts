import type { Request, Response } from "express";

// * cette fonction exécute une méthode de controller dans un try catch, ce qui nous évite d'écrire les try catch dans toutes les méthodes
function catchErrors(controllerMethod: Function) {
	return async (req: Request, res: Response) => {
		try {
			await controllerMethod(req, res);
		} catch (error) {
			res.status(500).json({
				status: 500,
				message: "Une erreur serveur est survenue lors de l'opération",
			});
		}
	};
}

export { catchErrors };
