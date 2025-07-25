import argon2 from "argon2";
import type { Request, Response } from "express";
import { UserDatamapper } from "../datamappers/UserDatamapper";
import { generateToken } from "../libs/jwtToken";
import { sanitizeInput } from "../libs/sanitize";
import { loginSchema, registerSchema } from "../libs/validationSchemas";
import type { UserObject } from "../types/ModelTypes";

// export async function registerUser(req: Request, res: Response) {
// 	//Récupération des données du formulaire
// 	const { email, password, first_name, last_name } = req.body;

// 	// Validation des champs requis
// 	if (!email || !password || !first_name || !last_name) {
// 		return res.status(400).json({
// 			status: 400,
// 			message:
// 				"Tous les champs sont obligatoires (email, password, first_name, last_name)",
// 		});
// 	}

// 	//Vérification de la validité des données, réponse 400 avec un message personnalisé en cas d'échec
// 	const { error } = registerSchema.validate({
// 		email,
// 		password,
// 		first_name,
// 		last_name,
// 	});

// 	if (error) {
// 		res.status(400).json({
// 			status: 400,
// 			message: error.details.map((detail) => detail.message).join(" "),
// 		});
// 		return;
// 	}

// 	// On vérifie si un utilisateur avec cet email existe déjà
// 	const sameEmailUser = await UserDatamapper.findByEmail(email);

// 	if (sameEmailUser) {
// 		res
// 			.status(409)
// 			.json({ status: 409, message: "Cet email est déjà utilisé!" });
// 		return;
// 	}

// 	const hashedPassword: string = await argon2.hash(password);

// 	if (hashedPassword === "error") {
// 		res.status(500).json({
// 			status: 500,
// 			message: "Une erreur est survenue lors du hashage votre mot de passe!",
// 		});
// 		return;
// 	}

// 	const userData: UserObject = {
// 		email: email,
// 		password: hashedPassword,
// 		first_name: first_name ? first_name : null,
// 		last_name: last_name ? last_name : null,
// 		total_budget: 0,
// 		total_expenses: 0,
// 		theme: null,
// 	};

// 	const newUser = await UserDatamapper.create(userData);
// 	//On vérifie bien qu'il n'y a pas eu d'erreur lors de l'insertion en BDD
// 	if (newUser) {
// 		res.status(201).json({ status: 201, message: "Utilisateur créé" });
// 		return;
// 	} else {
// 		res.status(500).json({
// 			status: 500,
// 			message: "Une erreur est survenue lors de la création de l'utilisateur",
// 		});
// 		return;
// 	}
// }

export async function registerUser(req: Request, res: Response) {
	try {
		const { email, password } = req.body;

		const first_name = sanitizeInput(req.body.first_name);
		const last_name = sanitizeInput(req.body.last_name);

		const _warning_amount = req.body.warning_amount;
		const _allocated_amount = req.body.allocated_amount;

		// Validation des champs requis
		if (!email || !password || !first_name || !last_name) {
			return res.status(400).json({
				status: 400,
				message:
					"Tous les champs sont obligatoires (email, password, first_name, last_name)",
			});
		}

		// Vérification de la validité via Joi
		const { error } = registerSchema.validate({
			email,
			password,
			first_name,
			last_name,
		});

		if (error) {
			return res.status(400).json({
				status: 400,
				message: error.details.map((detail) => detail.message).join(" "),
			});
		}

		// Vérifie si email déjà pris
		const sameEmailUser = await UserDatamapper.findByEmail(email);
		if (sameEmailUser) {
			return res.status(409).json({
				status: 409,
				message: "Cet email est déjà utilisé!",
			});
		}

		// Hash du mot de passe
		const hashedPassword = await argon2.hash(password);
		if (!hashedPassword) {
			return res.status(500).json({
				status: 500,
				message: "Erreur lors du hashage du mot de passe",
			});
		}

		// Création du nouvel utilisateur
		const userData: UserObject = {
			email,
			password: hashedPassword,
			first_name: first_name || null,
			last_name: last_name || null,
			total_budget: 0,
			total_expenses: 0,
			theme: null,
		};

		const newUser = await UserDatamapper.create(userData);
		if (!newUser) {
			return res.status(500).json({
				status: 500,
				message: "Une erreur est survenue lors de la création de l'utilisateur",
			});
		}

		return res.status(201).json({ status: 201, message: "Utilisateur créé" });
	} catch (err) {
		console.error("Erreur inattendue dans registerUser:", err);
		return res.status(500).json({
			status: 500,
			message: "Erreur interne du serveur",
		});
	}
}

export async function loginUser(req: Request, res: Response): Promise<void> {
	const { email, password } = req.body;

	// Validation
	const { error } = loginSchema.validate({ email, password });
	if (error) {
		res.status(400).json({
			message: "Validation échouée !",
			details: error.details.map((detail) => detail.message),
		});
		return; // Important de return ici
	}

	const user = await UserDatamapper.findByEmail(email);
	if (!user) {
		res.status(401).json({
			status: 401,
			message: "Il y a une erreur dans vos identifiants",
		});
		return;
	}

	const correctPassword = await argon2.verify(user?.password, password);
	if (typeof correctPassword === "boolean") {
		if (!correctPassword) {
			res.status(401).json({
				status: 401,
				message: "Il y a une erreur dans vos identifiants",
			});
			return;
		}
	} else {
		res.status(500).json({
			status: 500,
			message:
				"Une erreur est survenue lors de la vérification du mot de passe",
		});
		return;
	}

	if (typeof user.id !== "number" || typeof user.email !== "string") {
		res.status(500).json({
			status: 500,
			message: "Les données utilisateur sont invalides",
		});
		return;
	}

	const tokenPayload = {
		id: user.id,
		email: user.email,
	};
	const jwtToken = generateToken(tokenPayload);

	// Nouvelle réponse avec token + user (dont theme)
	res.status(201).json({
		status: 201,
		message: "token généré",
		token: jwtToken,
		user: {
			id: user.id,
			email: user.email,
			theme: user.theme ?? null, // envoi le thème si défini
		},
	});
	return;
}
