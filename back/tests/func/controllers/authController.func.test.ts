import { describe, expect, jest, test } from "@jest/globals";
import {
	loginUser,
	registerUser,
} from "../../../src/controllers/authController";
import "../../auth-setup-jest";
import type { Request, Response } from "express";

describe("testing registerUser from authController", () => {
	test("Valid data (password: 2eTapaovnezdjnj) returns 201 with message: Utilisateur créé", async () => {
		// Configuration d'une requête avec des données valides
		const request = {
			body: {
				email: "test@oclock.io",
				password: "2eTapaovnezdjnj",
				first_name: "Jean",
				last_name: "Dupont",
			},
		} as Partial<Request>;

		// Mock de la réponse avec les méthodes status et json
		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Appel de la fonction registerUser
		await registerUser(request as Request, response as Response);

		// Vérification que le statut 201 est retourné
		expect(response.status).toHaveBeenCalledWith(201);

		// Vérification du message de succès
		expect(response.json).toHaveBeenCalledWith({
			status: 201,
			message: "Utilisateur créé",
		});
	});

	test("Valid data (password: XXX---111) returns 201 with message: Utilisateur créé", async () => {
		// Configuration d'une requête avec un mot de passe différent mais valide
		const request = {
			body: {
				email: "test@oclock.io",
				password: "XXX---111",
				first_name: "Jean",
				last_name: "Dupont",
			},
		} as Partial<Request>;

		// Mock de la réponse
		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Exécution de la fonction registerUser
		await registerUser(request as Request, response as Response);

		// Vérification du statut de succès
		expect(response.status).toHaveBeenCalledWith(201);

		// Vérification du message de réussite
		expect(response.json).toHaveBeenCalledWith({
			status: 201,
			message: "Utilisateur créé",
		});
	});

	test('Already existing email returns 409 with message: "Cet email est déjà utilisé!"', async () => {
		// Premier enregistrement pour créer l'utilisateur initial
		const firstRequest = {
			body: {
				email: "duplicate@test.io",
				password: "2eTapaovnezdjnj",
				first_name: "Jean",
				last_name: "Dupont",
			},
		} as Partial<Request>;

		// Mock de la première réponse
		const firstResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Création du premier utilisateur
		await registerUser(firstRequest as Request, firstResponse as Response);

		// Tentative d'enregistrement avec le même email
		const secondRequest = {
			body: {
				email: "duplicate@test.io", // Email identique
				password: "2eTapaovnezdjnj",
				first_name: "Jean",
				last_name: "Dupont",
			},
		} as Partial<Request>;

		// Mock de la seconde réponse
		const secondResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Tentative d'enregistrement avec l'email déjà utilisé
		await registerUser(secondRequest as Request, secondResponse as Response);

		// Vérification du statut d'erreur 409 (conflit)
		expect(secondResponse.status).toHaveBeenCalledWith(409);

		// Vérification du message d'erreur approprié
		expect(secondResponse.json).toHaveBeenCalledWith({
			status: 409,
			message: "Cet email est déjà utilisé!",
		});
	});

	test("Password under 8 characters returns 400", async () => {
		// Configuration d'une requête avec un mot de passe trop court
		const request = {
			body: {
				email: "test@oclock.io",
				password: "2eTapai", // 7 caractères seulement
				first_name: "Jean",
				last_name: "Dupont",
			},
		} as Partial<Request>;

		// Mock de la réponse
		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Exécution de la fonction avec un mot de passe invalide
		await registerUser(request as Request, response as Response);

		// Vérification du statut d'erreur 400 (bad request)
		expect(response.status).toHaveBeenCalledWith(400);
	});

	test("Password without upper-case character returns 400", async () => {
		// Configuration d'une requête avec un mot de passe sans majuscule
		const request = {
			body: {
				email: "test@oclock.io",
				password: "azertyuiop", // Que des minuscules
				first_name: "Jean",
				last_name: "Dupont",
			},
		} as Partial<Request>;

		// Mock de la réponse
		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Exécution avec un mot de passe sans majuscule
		await registerUser(request as Request, response as Response);

		// Vérification du statut d'erreur de validation
		expect(response.status).toHaveBeenCalledWith(400);
	});

	test("Password without number character returns 400", async () => {
		// Configuration d'une requête avec un mot de passe sans chiffre
		const request = {
			body: {
				email: "test@oclock.io",
				password: "AZertyuioP", // Lettres uniquement, pas de chiffre
				first_name: "Jean",
				last_name: "Dupont",
			},
		} as Partial<Request>;

		// Mock de la réponse
		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Exécution avec un mot de passe sans chiffre
		await registerUser(request as Request, response as Response);

		// Vérification du statut d'erreur de validation
		expect(response.status).toHaveBeenCalledWith(400);
	});

	test("Email format not valid returns 400", async () => {
		// Configuration d'une requête avec un email au format incorrect
		const request = {
			body: {
				email: "test@gmcom", // Format d'email invalide (manque .extension)
				password: "2eTapqqai",
				first_name: "Jean",
				last_name: "Dupont",
			},
		} as Partial<Request>;

		// Mock de la réponse
		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Exécution avec un email invalide
		await registerUser(request as Request, response as Response);

		// Vérification du statut d'erreur de validation
		expect(response.status).toHaveBeenCalledWith(400);
	});
});

describe("testing loginUser from authController", () => {
	test("Wrong password returns 401 with message: Il y a une erreur dans vos identifiants", async () => {
		// Enregistrement initial d'un utilisateur
		const registerRequest = {
			body: {
				email: "d.matt7@hotmail.io",
				password: "1Azertyuiop",
				first_name: "Test",
				last_name: "User",
			},
		} as Partial<Request>;

		// Mock pour l'enregistrement
		const registerResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Création de l'utilisateur
		await registerUser(
			registerRequest as Request,
			registerResponse as Response,
		);

		// Tentative de connexion avec un mot de passe incorrect
		const loginRequest = {
			body: {
				email: "d.matt7@hotmail.io",
				password: "2eTapaovnezdjnj", // Mot de passe différent de celui enregistré
			},
		} as Partial<Request>;

		// Mock pour la tentative de connexion
		const loginResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Tentative de connexion avec des identifiants incorrects
		await loginUser(loginRequest as Request, loginResponse as Response);

		// Vérification du statut d'erreur 401 (non autorisé)
		expect(loginResponse.status).toHaveBeenCalledWith(401);

		// Vérification du message d'erreur d'authentification
		expect(loginResponse.json).toHaveBeenCalledWith({
			status: 401,
			message: "Il y a une erreur dans vos identifiants",
		});
	});

	test("Correct email and password returns 201 with a token", async () => {
		// Enregistrement initial d'un utilisateur
		const registerRequest = {
			body: {
				email: "test@example.com",
				password: "1Azertyuiop",
				first_name: "bob",
				last_name: "morane",
			},
		} as Partial<Request>;

		// Mock pour l'enregistrement
		const registerResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Création de l'utilisateur
		await registerUser(
			registerRequest as Request,
			registerResponse as Response,
		);

		// Tentative de connexion avec les bons identifiants
		const loginRequest = {
			body: {
				email: "test@example.com",
				password: "1Azertyuiop", // Mot de passe correct
			},
		} as Partial<Request>;

		// Configuration des mocks pour la réponse de connexion
		const jsonMock = jest.fn();
		const statusMock = jest.fn().mockReturnValue({ json: jsonMock });

		const loginResponse = {
			status: statusMock,
		} as Partial<Response>;

		// Tentative de connexion avec les bons identifiants
		await loginUser(loginRequest as Request, loginResponse as Response);

		// Vérification que le statut 201 (succès) a été appelé
		expect(statusMock).toHaveBeenCalledWith(201);

		// Vérification que la méthode json a été appelée
		expect(jsonMock).toHaveBeenCalled();

		// Récupération des données de la réponse
		const responseData = jsonMock.mock.calls[0][0] as { token: string };

		// Vérification de la présence du token
		expect(responseData.token).toBeDefined();

		// Vérification que le token est une chaîne de caractères
		expect(typeof responseData.token).toBe("string");
	});
});
