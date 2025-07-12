import type { NextFunction, Request, Response } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
	res
		.status(404)
		.json({ status: 404, message: "Vous cherchez une page inexistante" });
	return;
};
