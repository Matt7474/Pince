import argon2 from "argon2";
import type { Response } from "express";
import { db } from "../database/db";
import { UserDatamapper } from "../datamappers/UserDatamapper";
import { getUserIdInToken } from "../libs/jwtToken";
import type { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export async function getUserInfo(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const user_id = getUserIdInToken(req);
	const user = await UserDatamapper.findById(user_id);

	if (!user) {
		res.status(404).json({ status: 404, message: "Utilisateur introuvable." });
		return;
	}

	res.status(200).json({
		id: user.id,
		email: user.email,
		first_name: user.first_name,
		last_name: user.last_name,
		total_budget: user.total_budget,
		total_expenses: user.total_expenses,
		created_at: user.created_at,
		updated_at: user.updated_at,
	});
}

export async function updateUserProfile(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const user_id = getUserIdInToken(req);
	const { email, first_name, last_name } = req.body;

	const updatedUser = await UserDatamapper.update({
		id: user_id,
		email,
		first_name,
		last_name,
	});

	if (!updatedUser) {
		res.status(500).json({
			status: 500,
			message: "Erreur lors de la mise à jour du profil.",
		});
		return;
	}

	res.status(200).json({
		id: updatedUser.id,
		email: updatedUser.email,
		first_name: updatedUser.first_name,
		last_name: updatedUser.last_name,
	});
}

export async function updatePassword(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const user_id = getUserIdInToken(req);
	const { current_password, new_password } = req.body;

	const user = await UserDatamapper.findById(user_id);

	if (!user) {
		res.status(404).json({ status: 404, message: "Utilisateur introuvable." });
		return;
	}

	// Vérification du mot de passe actuel avec argon2
	const passwordMatches = await argon2.verify(user.password, current_password);
	if (!passwordMatches) {
		res
			.status(400)
			.json({ status: 400, message: "Mot de passe actuel incorrect." });
		return;
	}

	// Hashage du nouveau mot de passe avec argon2
	const hashedPassword = await argon2.hash(new_password);
	const updatedUser = await UserDatamapper.update({
		id: user.id,
		password: hashedPassword,
	});

	if (!updatedUser) {
		res.status(500).json({
			status: 500,
			message: "Erreur lors de la modification du mot de passe.",
		});
		return;
	}

	res.status(200).json({ success: true });
}

export async function updateTheme(req: AuthenticatedRequest, res: Response) {
	console.log("tentative de changement de theme");

	if (!req.user || !req.user.id) {
		return res.status(401).json({ error: "User not authenticated" });
	}

	const userId = req.user.id;
	console.log(userId);

	const { theme } = req.body;

	console.log(typeof theme);

	if (typeof theme !== "string") {
		return res.status(400).json({ error: "Theme invalid" });
	}

	try {
		await db.query(
			`UPDATE users SET theme = $1, updated_at = NOW() WHERE id = $2`,
			[theme, userId],
		);
		res.status(200).json({ message: "Theme updated" });
	} catch (error) {
		console.error("Error updating theme:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

export async function deleteUser(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const user_id = getUserIdInToken(req);
	const user = await UserDatamapper.findById(user_id);

	if (!user) {
		res.status(404).json({ status: 404, message: "Utilisateur introuvable." });
		return;
	}

	const isDeleted = await UserDatamapper.delete(user);

	if (!isDeleted) {
		res.status(500).json({
			status: 500,
			message: "Erreur lors de la suppression du compte utilisateur.",
		});
		return;
	}

	res.status(200).json({ success: true });
}
