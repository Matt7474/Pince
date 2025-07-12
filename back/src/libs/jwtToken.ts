import jwt from "jsonwebtoken";
import type { AuthenticatedRequest } from "../types/AuthenticatedRequest";
import type { TokenPayloadType } from "../types/TokenPayloadType";

export function generateToken(tokenPayload: TokenPayloadType): string {
	const token = jwt.sign(
		{
			user: {
				email: tokenPayload.email,
				id: tokenPayload.id,
			},
		},
		process.env.JWT_SECRET!,
		{
			expiresIn: "120m",
		},
	);
	return token as string;
}

export function verifyJwtToken(token: string) {
	try {
		return jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);
	} catch (error) {
		console.error(error);
		return null;
	}
}

export function getUserIdInToken(req: AuthenticatedRequest): number {
	const decoded = jwt.verify(
		req.token!,
		process.env.JWT_SECRET as jwt.Secret,
	) as jwt.JwtPayload;
	const user_id = decoded.user.id;
	const user_id_for_db = Number(user_id);
	return user_id_for_db;
}
