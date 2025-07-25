import type { Request, Response } from "express";
import { ExpenditureDatamapper } from "../datamappers/ExpenditureDatamapper";
import { getUserIdInToken } from "../libs/jwtToken";
import { sanitizeInput } from "../libs/sanitize";
import { amountSchema } from "../libs/validationSchemas";
import type { ExpenditureObject } from "../types/ModelTypes";

interface AuthenticatedRequest extends Request {
	token?: string;
}

export async function getAllExpenditures(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	//budget_id sera undefined (ou null) dans la requête pour le dashboard"
	//budget_id aura une valeur dans la requête pour les dépenses"
	const { budgetId } = req.query;

	//On récupère l'id de l'utilisateur dans le token
	const user_id_for_db = getUserIdInToken(req);

	// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
	let expenditures;

	if (budgetId) {
		const budget_id_for_db = Number(budgetId);
		expenditures = await ExpenditureDatamapper.findByBudget(
			budget_id_for_db,
			user_id_for_db,
		);
	} else {
		expenditures =
			await ExpenditureDatamapper.findAllWithIconAndColor(user_id_for_db);
	}

	if (expenditures?.length) {
		res.status(200).json({ status: 200, data: expenditures });
		return;
	} else {
		res.status(404).json({ status: 404, message: "Aucune dépense" });
		return;
	}
}

export async function getOneExpenditure(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	//le budget_id se trouve dans le endpoint (route paramétrée) "/expenses"
	const { expenditure_id } = req.params;
	//on convertit ce qui doit être convertit
	//Ce qui vient du token est de la route est au format string, on veut des number
	const expenditure_id_for_db = Number(expenditure_id);

	//On récupère l'id de l'utilisateur dans le token
	const user_id_for_db = getUserIdInToken(req);

	const expenditure = await ExpenditureDatamapper.findById(
		expenditure_id_for_db,
		user_id_for_db,
	);

	if (expenditure) {
		res.status(200).json({ status: 200, data: expenditure });
		return;
	} else {
		res
			.status(404)
			.json({ status: 404, message: "Cette dépense est introuvable" });
		return;
	}
}

export async function createExpenditure(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const user_id_for_db = getUserIdInToken(req);

	// Sanitize les entrées
	const description = sanitizeInput(req.body.description);
	const payment_method = sanitizeInput(req.body.payment_method);
	const amount = req.body.amount;
	const budget_id = req.body.budget_id;
	const date = req.body.date;

	const amount_for_db =
		typeof amount === "string" ? Number(amount.replace(",", ".")) : amount;

	const budget_id_for_db = Number(budget_id);

	const date_for_db: Date | null = date ? new Date(date) : null;

	const { error } = amountSchema.validate(amount_for_db);
	if (error) {
		res.status(400).json({
			message: "Validation échouée !",
			details: error.details.map((detail) => detail.message),
		});
		return;
	}

	const expenditureData: ExpenditureObject = {
		description,
		payment_method,
		amount: amount_for_db,
		date: date_for_db,
		budget_id: budget_id_for_db,
		user_id: user_id_for_db,
	};

	console.log("ExpenditureData:", expenditureData);

	try {
		const _newExpenditure = await ExpenditureDatamapper.create(expenditureData);

		res.status(201).json({ status: 201, message: "Dépense créée" });
	} catch (_err) {
		res.status(500).json({
			status: 500,
			message: "Une erreur est survenue lors de l'enregistrement de la dépense",
		});
	}
}

export async function deleteExpenditure(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const { expenditure_id } = req.params;
	const expenditure_id_for_db = Number(expenditure_id);

	//On récupère l'id de l'utilisateur dans le token
	const user_id_for_db = getUserIdInToken(req);

	const expenditure = await ExpenditureDatamapper.findById(
		expenditure_id_for_db,
		user_id_for_db,
	);

	if (expenditure) {
		await ExpenditureDatamapper.destroy(expenditure);
		res.status(200).json({ status: 200, message: "Dépense supprimée" });
		return;
	} else {
		res.status(404).json({
			status: 404,
			message: "Le dépense que vous voulez supprimer n'existe pas!",
		});
		return;
	}
}

export async function updateExpenditure(
	req: AuthenticatedRequest,
	res: Response,
): Promise<void> {
	const { expenditure_id } = req.params;
	const expenditure_id_for_db = Number(expenditure_id);

	//On récupère l'id de l'utilisateur dans le token
	const user_id_for_db = getUserIdInToken(req);
	console.log("USERID?: ", user_id_for_db);

	const expenditure = await ExpenditureDatamapper.findById(
		expenditure_id_for_db,
		user_id_for_db,
	);

	const description = sanitizeInput(req.body.description);
	const payment_method = sanitizeInput(req.body.payment_method);
	const amount = req.body.amount;
	const date = req.body.date;
	console.log(
		"REQUEST BODY: description, payment_method, amount, date ",
		description,
		payment_method,
		amount,
		date,
	);

	const amount_for_db =
		typeof amount === "string" ? Number(amount.replace(",", ".")) : amount;

	//Vérification de la validité du montant, réponse 400 avec un message personnalisé en cas d'échec
	const { error } = amountSchema.validate(amount_for_db);
	if (error) {
		res.status(400).json({
			message: "Validation échouée !",
			details: error.details.map((detail) => detail.message),
		});
		return;
	}

	let date_for_db: Date | null;
	if (date) {
		date_for_db = new Date(date);
	} else {
		date_for_db = null;
	}

	if (expenditure) {
		const expenditureData: ExpenditureObject = {
			id: expenditure.id,
			description: description ? description : null,
			payment_method: payment_method ? payment_method : null,
			amount: amount_for_db,
			date: date_for_db,
			budget_id: expenditure.budget_id,
			user_id: expenditure.user_id,
		};

		const updatedExpenditure =
			await ExpenditureDatamapper.update(expenditureData);
		res.status(201).json({
			status: 200,
			message: "dépense modifiée",
			data: updatedExpenditure,
		});
		return;
	} else {
		res
			.status(404)
			.json({ status: 404, message: "Cette dépense est introuvable" });
		return;
	}
}
