"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const expenditureController_1 = require("../../../src/controllers/expenditureController");
const jwtToken_1 = require("../../../src/libs/jwtToken");
require("../../global-setup-jest");
const tokenPayload = {
    id: 3,
    email: "johnny@gmail.com",
};
const mockTocken = (0, jwtToken_1.generateToken)(tokenPayload);
(0, globals_1.describe)("testing createExpenditure from expenditureController", () => {
    (0, globals_1.test)("Valid data returns 201 with message Dépense créée", () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        // Simulation de l’objet Response d’Express avec les méthodes mockées
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Appel de la fonction à tester avec les objets simulés
        yield (0, expenditureController_1.createExpenditure)(request, response);
        // Vérification du code de réponse HTTP et du message renvoyé
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(201);
        (0, globals_1.expect)(response.json).toHaveBeenCalledWith({
            status: 201,
            message: "Dépense créée",
        });
    }));
    (0, globals_1.test)("Empty string for description returns 201 with message Dépense créée", () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        yield (0, expenditureController_1.createExpenditure)(request, response);
        // Vérification que la dépense est acceptée même sans description
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(201);
        (0, globals_1.expect)(response.json).toHaveBeenCalledWith({
            status: 201,
            message: "Dépense créée",
        });
    }));
});
