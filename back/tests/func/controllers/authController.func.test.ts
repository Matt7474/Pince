import { describe, expect, jest, test } from "@jest/globals";
import {
	loginUser,
	registerUser,
} from "../../../src/controllers/authController";
import "../auth-setup-jest";
import type { Request, Response } from "express";

describe("testing registerUser from authController", () => {
	test("Valid data (password: 2eTapaovnezdjnj) returns 201 with message: Utilisateur créé", async () => {
		const request = {
			body: {
				email: "test@oclock.io",
				password: "2eTapaovnezdjnj",
			},
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await registerUser(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(201);
		expect(response.json).toHaveBeenCalledWith({
			status: 201,
			message: "Utilisateur créé",
		});
		//expect(response).toEqual({ status: 201, message: 'Utilisateur créé'})
	});
	test("Valid data (password: XXX---111) returns 201 with message: Utilisateur créé", async () => {
		const request = {
			body: {
				email: "test@oclock.io",
				password: "XXX---111",
			},
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await registerUser(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(201);
		expect(response.json).toHaveBeenCalledWith({
			status: 201,
			message: "Utilisateur créé",
		});
		//expect(response).toEqual({ status: 201, message: 'Utilisateur créé'})
	});
	test('Already existing email returns 409 with message:  "Cet email est déjà utilisé!', async () => {
		const request = {
			body: {
				email: "martin.fretto@gmail.com",
				password: "2eTapaovnezdjnj",
			},
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await registerUser(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(409);
		expect(response.json).toHaveBeenCalledWith({
			status: 409,
			message: "Cet email est déjà utilisé!",
		});
	});
	test("Password under 8 characters returns 400", async () => {
		const request = {
			body: {
				email: "test@oclock.io",
				password: "2eTapai",
			},
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;
		await registerUser(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(400);
	});
	test("Password without upper-case character returns 400", async () => {
		const request = {
			body: {
				email: "test@oclock.io",
				password: "azertyuiop",
			},
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;
		await registerUser(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(400);
	});
	test("Password without number character returns 400", async () => {
		const request = {
			body: {
				email: "test@oclock.io",
				password: "AZertyuioP",
			},
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;
		await registerUser(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(400);
	});
	test("Email format not valid returns 400", async () => {
		const request = {
			body: {
				email: "test@gmcom",
				password: "2eTapqqai",
			},
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;
		await registerUser(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(400);
	});
});
describe("testing registerUser from loginUser", () => {
	test("Wrong password returns 401 with message: Il y a une erreur dans vos identifiants", async () => {
		const request = {
			body: {
				email: "martin.fretto@gmail.com",
				password: "2eTapaovnezdjnj",
			},
		} as Partial<Request>;

		const response = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		} as Partial<Response>;

		await loginUser(request as Request, response as Response);
		expect(response.status).toHaveBeenCalledWith(401);
		expect(response.json).toHaveBeenCalledWith({
			status: 401,
			message: "Il y a une erreur dans vos identifiants",
		});
	});
	test("Correct email and password returns 201 with a token", async () => {
		const request = {
			body: {
				email: "martin.fretto@gmail.com",
				password: "1Azertyuiop",
			},
		} as Partial<Request>;

		const jsonMock = jest.fn();

		const response = {
			status: jest.fn().mockReturnValue({ json: jsonMock }),
		} as Partial<Response>;

		await loginUser(request as Request, response as Response);

		const responseData = jsonMock.mock.calls[0][0] as { token: string };

		expect(responseData.token).toBeDefined();
		expect(typeof responseData.token).toBe("string");
	});
});
