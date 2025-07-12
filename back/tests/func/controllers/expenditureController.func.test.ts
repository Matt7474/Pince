import { describe, expect, jest, test } from "@jest/globals";
import type { Request, Response } from "express";
import { createExpenditure } from "../../../src/controllers/expenditureController";
import { generateToken } from "../../../src/libs/jwtToken";
import type { TokenPayloadType } from "../../../src/types/TokenPayloadType";
import "../global-setup-jest";

const tokenPayload: TokenPayloadType = {
	id: 3,
	email: "johnny@gmail.com",
};
const mockTocken = generateToken(tokenPayload);

describe("testing createExpenditure from expenditureController", () => {
	test("Valid data returns 201 with message Dépense créée", async () => {
		const request = {
			body: {
				budget_id: "6",
				description: "billet TGV",
				date: "2012-12-12T00:00:00.000Z",
				payment_method: "card",
				amount: 150,
			},
			token: mockTocken,
			//C'est le middleware d'authentification qui rajoute le token venant du front dans une clé "token"
			//Il transmet ensuite cette requête au controller
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await createExpenditure(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(201);
		expect(response.json).toHaveBeenCalledWith({
			status: 201,
			message: "Dépense créée",
		});
	});
	test("Empty string for description returns 201 with message Dépense créée", async () => {
		const request = {
			body: {
				budget_id: "6",
				description: "",
				date: "2012-12-12T00:00:00.000Z",
				payment_method: "card",
				amount: 20,
			},
			token: mockTocken,
			//C'est le middleware d'authentification qui rajoute le token venant du front dans une clé "token"
			//Il transmet ensuite cette requête au controller
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await createExpenditure(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(201);
		expect(response.json).toHaveBeenCalledWith({
			status: 201,
			message: "Dépense créée",
		});
	});
});
