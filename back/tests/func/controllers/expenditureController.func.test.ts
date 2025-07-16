import { describe, expect, jest, test } from "@jest/globals";
import type { Request, Response } from "express";
import { createExpenditure } from "../../../src/controllers/expenditureController";
import { generateToken } from "../../../src/libs/jwtToken";
import type { TokenPayloadType } from "../../../src/types/TokenPayloadType";
import "../../global-setup-jest";

const tokenPayload: TokenPayloadType = {
	id: 3,
	email: "johnny@gmail.com",
};
const mockTocken = generateToken(tokenPayload);

describe("testing createExpenditure from expenditureController", () => {
	test("Valid data returns 201 with message Dépense créée", async () => {
		// Données valides représentant une dépense typique
		const request = {
			body: {
				budget_id: "6",
				description: "billet TGV",
				date: "2012-12-12T00:00:00.000Z",
				payment_method: "card",
				amount: 150,
			},
			token: mockTocken, // Token injecté par le middleware d'authentification
		} as Partial<Request>;

		// Simulation de l’objet Response d’Express avec les méthodes mockées
		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		// Appel de la fonction à tester avec les objets simulés
		await createExpenditure(request as Request, response as Response);

		// Vérification du code de réponse HTTP et du message renvoyé
		expect(response.status).toHaveBeenCalledWith(201);
		expect(response.json).toHaveBeenCalledWith({
			status: 201,
			message: "Dépense créée",
		});
	});

	test("Empty string for description returns 201 with message Dépense créée", async () => {
		// Données où la description est une chaîne vide
		const request = {
			body: {
				budget_id: "6",
				description: "",
				date: "2012-12-12T00:00:00.000Z",
				payment_method: "card",
				amount: 20,
			},
			token: mockTocken, // Token injecté par le middleware d'authentification
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await createExpenditure(request as Request, response as Response);

		// Vérification que la dépense est acceptée même sans description
		expect(response.status).toHaveBeenCalledWith(201);
		expect(response.json).toHaveBeenCalledWith({
			status: 201,
			message: "Dépense créée",
		});
	});
});
