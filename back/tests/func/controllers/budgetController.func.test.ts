import { describe, expect, jest, test } from "@jest/globals";
import {
	createBudget,
	deleteBudget,
} from "../../../src/controllers/budgetController";
import { generateToken } from "../../../src/libs/jwtToken";
import type { TokenPayloadType } from "../../../src/types/TokenPayloadType";
import "../../global-setup-jest";
import type { Request, Response } from "express";

const tokenPayload: TokenPayloadType = {
	id: 1,
	email: "martin.fretto@gmail.com",
};

const mockTocken = generateToken(tokenPayload);

// Tests du contrôleur createBudget
describe("testing createBudget from budgetController", () => {
	test("Valid data returns 201", async () => {
		// Données valides envoyées dans la requête
		const request = {
			body: {
				name: "voyages",
				warning_amount: 600,
				allocated_amount: 700,
				color: "#ffffff",
				icon: "/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg",
			},
			token: mockTocken, // Clé ajoutée par le middleware d'authentification
		} as Partial<Request>;

		// Création de l’objet de réponse avec des fonctions simulées
		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Appel du contrôleur avec la requête et la réponse simulées
		await createBudget(request as Request, response as Response);

		// Vérification du code de réponse attendu
		expect(response.status).toHaveBeenCalledWith(201);
	});

	test("Warning_amount over allocated_amount returns 400 with message", async () => {
		// Données avec montant d'alerte égal au montant alloué
		const request = {
			body: {
				name: "voyages",
				warning_amount: 700,
				allocated_amount: 700,
				color: "#ffffff",
				icon: "/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg",
			},
			token: mockTocken,
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await createBudget(request as Request, response as Response);

		// Vérification du code de réponse et du message d'erreur retournés
		expect(response.status).toHaveBeenCalledWith(400);
		expect(response.json).toHaveBeenCalledWith({
			message: "Le montant d'alerte doit être inférieur au montant alloué.",
		});
	});

	test("Empty string for name returns 400", async () => {
		// Données avec un nom vide
		const request = {
			body: {
				name: "",
				warning_amount: 600,
				allocated_amount: 700,
				color: "#ffffff",
				icon: "/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg",
			},
			token: mockTocken,
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await createBudget(request as Request, response as Response);

		// Vérification du code de réponse attendu
		expect(response.status).toHaveBeenCalledWith(400);
	});

	test("Negative number for amount returns 400", async () => {
		// Données avec un montant négatif
		const request = {
			body: {
				name: "",
				warning_amount: -600,
				allocated_amount: 700,
				color: "#ffffff",
				icon: "/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg",
			},
			token: mockTocken,
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await createBudget(request as Request, response as Response);

		expect(response.status).toHaveBeenCalledWith(400);
	});

	test('Decimal number with "." is valid and returns 201', async () => {
		// Données avec un montant décimal valide
		const request = {
			body: {
				name: "voyages",
				warning_amount: 600.5,
				allocated_amount: 700,
				color: "#ffffff",
				icon: "/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg",
			},
			token: mockTocken,
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await createBudget(request as Request, response as Response);

		expect(response.status).toHaveBeenCalledWith(201);
	});

	test("Empty string for color and icon is valid and returns 201", async () => {
		// Données avec des valeurs vides pour color et icon
		const request = {
			body: {
				name: "voyages",
				warning_amount: 600,
				allocated_amount: 700,
				color: "",
				icon: "",
			},
			token: mockTocken,
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await createBudget(request as Request, response as Response);

		expect(response.status).toHaveBeenCalledWith(201);
	});
});

// Tests du contrôleur deleteBudget
describe("testing deleteBudget from budgetController", () => {
	test("Deleting a budget not belonging to user returns 404 with message", async () => {
		// Requête avec un identifiant de budget non associé à l'utilisateur
		const request = {
			params: {
				id: "50",
			},
			token: mockTocken,
		} as Partial<Request>;

		// Simulation de la réponse Express avec des fonctions imbriquées
		const jsonMock = jest.fn();
		const statusMock = jest.fn(() => ({ json: jsonMock }));

		const response = {
			status: statusMock,
		} as unknown as Response;

		await deleteBudget(request as Request, response as Response);

		expect(statusMock).toHaveBeenCalledWith(404);
		expect(jsonMock).toHaveBeenCalledWith({
			status: 404,
			message: "Le budget que vous souhaitez supprimer n'existe pas.",
		});
	});

	test("Deleting a user's own budget returns 204", async () => {
		// Requête avec un identifiant de budget valide appartenant à l'utilisateur
		const request = {
			params: {
				id: "1",
			},
			token: mockTocken,
		} as Partial<Request>;

		const jsonMock = jest.fn();
		const statusMock = jest.fn(() => ({ json: jsonMock }));

		const response = {
			status: statusMock,
		} as unknown as Response;

		await deleteBudget(request as Request, response as Response);

		expect(statusMock).toHaveBeenCalledWith(204);
		expect(jsonMock).toHaveBeenCalledWith({
			status: 204,
			message: "Budget supprimé avec succès",
		});
	});
});
