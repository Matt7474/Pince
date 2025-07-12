import { describe, expect, jest, test } from "@jest/globals";
import {
	createBudget,
	deleteBudget,
} from "../../../src/controllers/budgetController";
import { createExpenditure } from "../../../src/controllers/expenditureController";
import { generateToken } from "../../../src/libs/jwtToken";
import type { TokenPayloadType } from "../../../src/types/TokenPayloadType";
import "../global-setup-jest";
import type { Request, Response } from "express";

const tokenPayload: TokenPayloadType = {
	id: 2,
	email: "bobby@gmail.com",
};
const mockTocken = generateToken(tokenPayload);

describe("testing createBudget from budgetController", () => {
	test("Valid data returns 201", async () => {
		const request = {
			body: {
				name: "voyages",
				warning_amount: 600,
				allocated_amount: 700,
				color: "#ffffff",
				icon: "/src/assets/icons/aquarium-dolphin-fish-svgrepo-com.svg",
			},
			token: mockTocken,
			//C'est le middleware d'authentification qui rajoute le token venant du front dans une clé "token"
			//Il transmet ensuite cette requête au controller
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await createBudget(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(201);
	});

	test("Warning_amount over allocated_amount data returns 201 with message Le montant d'alerte  doit être inférieur au montant alloué .", async () => {
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
		expect(response.status).toHaveBeenCalledWith(400);
		expect(response.json).toHaveBeenCalledWith({
			message: "Le montant d'alerte  doit être inférieur au montant alloué .",
		});
	});
	test("Empty string for name returns 400", async () => {
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
		expect(response.status).toHaveBeenCalledWith(400);
	});
	test("Negative number for amount returns 400", async () => {
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
	test("empty string for color and icon is valid and returns 201", async () => {
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

describe("testing deleteBudget from budgetController", () => {
	test("Delete budget that don't belong to user returns 404 with message Le budget que vous souhaitez supprimer n'existe pas.", async () => {
		const request = {
			params: {
				id: "1",
			},
			token: mockTocken,
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await deleteBudget(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(404);
		expect(response.json).toHaveBeenCalledWith({
			status: 404,
			message: "Le budget que vous souhaitez supprimer n'existe pas.",
		});
	});

	test("Delete budget that belong to user returns 204", async () => {
		const request = {
			params: {
				id: "3",
			},
			token: mockTocken,
		} as Partial<Request>;

		const sendMock = jest.fn();
		const statusMock = jest.fn(() => ({ send: sendMock }));

		const response = {
			status: statusMock,
		} as unknown as Response;

		await deleteBudget(request as Request, response as Response);
		expect(statusMock).toHaveBeenCalledWith(204);
		expect(sendMock).toHaveBeenCalled();
	});
});
