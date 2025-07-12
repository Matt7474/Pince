import type { Request, Response } from "express";
import { BudgetDatamapper } from "../datamappers/BudgetDatamapper";
import { getUserIdInToken } from "../libs/jwtToken";
import { budgetSchema } from "../libs/validationSchemas";
import type { BudgetObject } from "../types/ModelTypes";
import { db } from "../database/db";

interface AuthenticatedRequest extends Request {
	token?: string;
}

export async function getAllBudgets(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const user_id_for_db = getUserIdInToken(req);

	const budgets = await BudgetDatamapper.findByUser(user_id_for_db);

	res.status(200).json({
		status: 200,
		data: budgets ?? [],
	});
}

export async function getBudgetById(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const { id } = req.params;
	const user_id_for_db = getUserIdInToken(req);
	const budget_id_for_db = Number(id);

	const budget = await BudgetDatamapper.findById(
		budget_id_for_db,
		user_id_for_db,
	);

	if (budget) {
		res.status(200).json({ status: 200, data: budget });
		return;
	} else {
		res
			.status(404)
			.json({ status: 404, message: "Ce budget est introuvable." });
		return;
	}
}

export async function updateBudgetPosition(req: Request, res: Response) {
	const budgetId = Number(req.params.id);
	const { position } = req.body;

	if (typeof position !== "number") {
		return res.status(400).json({ error: "Position doit être un nombre" });
	}

	try {
		// Met à jour uniquement la position
		await db.query(
			`UPDATE budget SET position = $1, updated_at = NOW() WHERE id = $2`,
			[position, budgetId],
		);

		res.status(200).json({ message: "Position mise à jour" });
	} catch (error) {
		console.error("Erreur update position:", error);
		res.status(500).json({ error: "Erreur serveur" });
	}
}

export async function createBudget(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const user_id_for_db = getUserIdInToken(req);

	const { name, warning_amount, allocated_amount, color, icon } = req.body;
	const warning_amount_for_db =
		typeof warning_amount === "string"
			? Number(warning_amount.replace(",", "."))
			: warning_amount;

	const allocated_amount_for_db =
		typeof allocated_amount === "string"
			? Number(allocated_amount.replace(",", "."))
			: allocated_amount;

	if (warning_amount_for_db >= allocated_amount_for_db) {
		res.status(400).json({
			message: "Le montant d'alerte doit être inférieur au montant alloué .",
		});
		return;
	}

	const { error } = budgetSchema.validate({
		name,
		warning_amount_for_db,
		allocated_amount_for_db,
		color,
		icon,
	});
	if (error) {
		res.status(400).json({
			message: "Validation échouée.",
			details: error.details.map((detail) => detail.message),
		});
		return;
	}

	const budgetData: BudgetObject = {
		name,
		warning_amount: warning_amount_for_db,
		spent_amount: 0,
		allocated_amount: allocated_amount_for_db,
		color: color || null,
		icon: icon || null,
		user_id: user_id_for_db,
	};

	const newBudget = await BudgetDatamapper.create(budgetData);

	if (newBudget) {
		res.status(201).json({
			status: 201,
			message: "Budget créé avec succès.",
			data: newBudget,
		});
		return;
	} else {
		res.status(500).json({
			status: 500,
			message: "Une erreur est survenue lors de la création du budget.",
		});
		return;
	}
}

export async function updateBudget(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const { id } = req.params;
	const user_id_for_db = getUserIdInToken(req);
	const budget_id_for_db = Number(id);

	const { name, warning_amount, allocated_amount, color, icon } = req.body;

	const budget = await BudgetDatamapper.findById(
		budget_id_for_db,
		user_id_for_db,
	);

	if (!budget) {
		res
			.status(404)
			.json({ status: 404, message: "Ce budget est introuvable." });
		return;
	}

	if (warning_amount >= allocated_amount) {
		res.status(400).json({
			message: "Le montant d'alerte  doit être inférieur au montant alloué .",
		});
		return;
	}

	const { error } = budgetSchema.validate({ name, color, icon });
	if (error) {
		res.status(400).json({
			message: "Validation échouée.",
			details: error.details.map((detail) => detail.message),
		});
		return;
	}

	const updateData: Partial<BudgetObject> = {
		id: budget.id,
		name: name || budget.name,
		warning_amount: warning_amount ?? budget.warning_amount,
		spent_amount: budget.spent_amount,
		allocated_amount: allocated_amount ?? budget.allocated_amount,
		color: color || budget.color,
		icon: icon || budget.icon,
	};

	const updatedBudget = await BudgetDatamapper.update(updateData);

	if (updatedBudget) {
		res.status(200).json({
			status: 200,
			message: "Budget modifié avec succès.",
			data: updatedBudget,
		});
		return;
	} else {
		res.status(500).json({
			status: 500,
			message: "Une erreur est survenue lors de la modification du budget.",
		});
		return;
	}
}

export async function deleteBudget(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const { id } = req.params;
	const user_id_for_db = getUserIdInToken(req);
	const budget_id_for_db = Number(id);

	const budget = await BudgetDatamapper.findById(
		budget_id_for_db,
		user_id_for_db,
	);

	if (!budget) {
		res.status(404).json({
			status: 404,
			message: "Le budget que vous souhaitez supprimer n'existe pas.",
		});
		return;
	}

	const deleted = await BudgetDatamapper.destroy(budget);

	if (deleted) {
		res.status(200).json({
			status: 200,
			message: "Budget supprimé avec succès",
		});
		return;
	} else {
		res.status(500).json({
			status: 500,
			message: "Une erreur est survenue lors de la suppression du budget.",
		});
		return;
	}
}
