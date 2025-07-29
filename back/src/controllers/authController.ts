import argon2 from "argon2";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { UserDatamapper } from "../datamappers/UserDatamapper";
import { generateToken } from "../libs/jwtToken";
import { sanitizeInput } from "../libs/sanitize";
import { loginSchema, registerSchema } from "../libs/validationSchemas";
import type { UserObject } from "../types/ModelTypes";

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

export async function resetPasswordRequest(req: Request, res: Response) {
	const { email } = req.body;

	const user = await UserDatamapper.findByEmail(email);
	if (!user) {
		return res
			.status(200)
			.json({ message: "Si un compte existe, un lien a été envoyé." });
	}

	const tokenPayload = { email: user.email };
	const jwtToken = generateToken(tokenPayload);

	const resetLink = `${process.env.FRONTEND_URL}/NewPassword?token=${jwtToken}`;

	// Configuration nodemailer
	const transporter = nodemailer.createTransport({
		host: "pince.matt-dev.fr",
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const mailOptions = {
		from: `"La Pince" <${process.env.EMAIL_USER}>`,
		to: user.email,
		subject: "Réinitialisation de votre mot de passe",
		text: `Bonjour, cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
		html: `<p>Bonjour,</p><p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p><a href="${resetLink}">${resetLink}</a>`,
	};

	try {
		await transporter.sendMail(mailOptions);
		return res.status(201).json({
			status: 201,
			message: "Lien de réinitialisation envoyé par email",
		});
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'email", error);
		return res.status(500).json({
			status: 500,
			message: "Erreur lors de l'envoi de l'email",
		});
	}
}

// export async function resetPassword(req: Request, res: Response) {
// 	try {
// 		const { token, newPassword } = req.body;

// 		if (!token || !newPassword) {
// 			return res
// 				.status(400)
// 				.json({ message: "Token ou mot de passe manquant." });
// 		}

// 		if (!process.env.JWT_SECRET) {
// 			throw new Error(
// 				"JWT_SECRET non défini dans les variables d'environnement",
// 			);
// 		}

// 		// Vérification et décodage du token
// 		console.log("Token reçu:", token);
// 		const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
// 			email: string;
// 		};
// 		console.log("Email décodé:", decoded.email);

// 		// Récupération de l'utilisateur
// 		const user = await UserDatamapper.findByEmail(decoded.email);
// 		console.log("Utilisateur trouvé:", user ? "Oui" : "Non");

// 		if (!user) {
// 			// Vérifiez si l'email existe vraiment en base
// 			console.log("Recherche d'utilisateur avec email:", decoded.email);
// 			return res.status(404).json({ message: "Utilisateur non trouvé." });
// 		}

// 		// ... reste du code
// 	} catch (error) {
// 		console.error("Erreur dans resetPassword:", error);
// 		if (error instanceof jwt.JsonWebTokenError) {
// 			return res.status(401).json({ message: "Token invalide." });
// 		}
// 		if (error instanceof jwt.TokenExpiredError) {
// 			return res.status(401).json({ message: "Token expiré." });
// 		}
// 		return res.status(500).json({ message: "Erreur serveur." });
// 	}
// }

export async function resetPassword(req: Request, res: Response) {
	try {
		const { token, newPassword } = req.body;

		const debugInfo: any = {
			tokenReceived: !!token,
			passwordReceived: !!newPassword,
			tokenLength: token?.length || 0,
		};

		if (!token || !newPassword) {
			return res.status(400).json({
				message: "Token ou mot de passe manquant.",
				debug: debugInfo,
			});
		}

		if (!process.env.JWT_SECRET) {
			return res.status(500).json({
				message: "Configuration serveur manquante",
				debug: debugInfo,
			});
		}

		try {
			// Décodage du token
			const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
				user: { email: string }; // ← CORRECTION ICI
				iat: number;
				exp: number;
			};

			// ← CORRECTION ICI : accéder à decoded.user.email
			const email = decoded.user.email;
			debugInfo.decodedEmail = email;
			debugInfo.tokenValid = true;
			debugInfo.decodedStructure = decoded; // pour debug

			// Recherche utilisateur
			const user = await UserDatamapper.findByEmail(email);
			debugInfo.userFound = !!user;
			debugInfo.searchedEmail = email;

			if (!user) {
				return res.status(404).json({
					message: "Utilisateur non trouvé.",
					debug: debugInfo,
				});
			}

			// Hash du nouveau mot de passe
			const hashedPassword = await argon2.hash(newPassword);

			if (!user.id) {
				return res.status(500).json({
					message: "Identifiant utilisateur manquant.",
					debug: { ...debugInfo, userId: user.id },
				});
			}

			// Mise à jour
			const updatedUser = await UserDatamapper.updatePassword({
				id: user.id,
				newHashedPassword: hashedPassword,
			});

			if (!updatedUser) {
				return res.status(500).json({
					message: "Erreur lors de la mise à jour.",
					debug: { ...debugInfo, updateResult: !!updatedUser },
				});
			}

			return res.status(200).json({
				message: "Mot de passe réinitialisé avec succès.",
			});
		} catch (jwtError) {
			debugInfo.tokenValid = false;
			debugInfo.jwtError =
				jwtError instanceof Error ? jwtError.message : "Unknown JWT error";

			return res.status(401).json({
				message: "Token invalide ou expiré.",
				debug: debugInfo,
			});
		}
	} catch (error) {
		return res.status(500).json({
			message: "Erreur serveur interne.",
			debug: {
				error: error instanceof Error ? error.message : "Unknown error",
			},
		});
	}
}
