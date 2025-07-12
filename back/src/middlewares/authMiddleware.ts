import type { NextFunction, Response } from "express";
import { verifyJwtToken } from "../libs/jwtToken";
import type { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import type { TokenPayloadType } from "../types/TokenPayloadType";

export const authMiddleware = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers?.authorization?.split("Bearer ")[1];
	console.log("token: ", token);

	if (!token) {
		res.status(401).json({
			status: 401,
			message: "Cette route n'est pas accessible sans token",
		});
		return;
	}

	const decodedToken = verifyJwtToken(token);
	console.log("Decoded token:", decodedToken);

	// TypeScript ne sait pas encore ce qu'est decodedToken (string | object)
	if (!decodedToken || typeof decodedToken === "string") {
		res.status(401).json({ status: 401, message: "Le token n'est pas valide" });
		return;
	}

	// Ici, on peut maintenant dire à TypeScript : c'est bien un TokenPayloadType
	const user = decodedToken as TokenPayloadType;

	if (
		typeof decodedToken !== "object" ||
		!("user" in decodedToken) ||
		typeof decodedToken.user !== "object" ||
		typeof decodedToken.user.id !== "number"
	) {
		res.status(401).json({ status: 401, message: "Token mal formé" });
		return;
	}

	req.token = token;
	req.user = {
		id: decodedToken.user.id,
		token,
	};

	next();
};
