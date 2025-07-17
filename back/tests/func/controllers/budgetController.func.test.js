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
const budgetController_1 = require("../../../src/controllers/budgetController");
const jwtToken_1 = require("../../../src/libs/jwtToken");
require("../../global-setup-jest");
const tokenPayload = {
    id: 1,
    email: "martin.fretto@gmail.com",
};
const mockTocken = (0, jwtToken_1.generateToken)(tokenPayload);
// Tests du contrôleur createBudget
(0, globals_1.describe)("testing createBudget from budgetController", () => {
    (0, globals_1.test)("Valid data returns 201", () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        // Création de l’objet de réponse avec des fonctions simulées
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Appel du contrôleur avec la requête et la réponse simulées
        yield (0, budgetController_1.createBudget)(request, response);
        // Vérification du code de réponse attendu
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(201);
    }));
    (0, globals_1.test)("Warning_amount over allocated_amount returns 400 with message", () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        yield (0, budgetController_1.createBudget)(request, response);
        // Vérification du code de réponse et du message d'erreur retournés
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(response.json).toHaveBeenCalledWith({
            message: "Le montant d'alerte doit être inférieur au montant alloué.",
        });
    }));
    (0, globals_1.test)("Empty string for name returns 400", () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        yield (0, budgetController_1.createBudget)(request, response);
        // Vérification du code de réponse attendu
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
    }));
    (0, globals_1.test)("Negative number for amount returns 400", () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        yield (0, budgetController_1.createBudget)(request, response);
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
    }));
    (0, globals_1.test)('Decimal number with "." is valid and returns 201', () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        yield (0, budgetController_1.createBudget)(request, response);
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(201);
    }));
    (0, globals_1.test)("Empty string for color and icon is valid and returns 201", () => __awaiter(void 0, void 0, void 0, function* () {
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
        };
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        yield (0, budgetController_1.createBudget)(request, response);
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(201);
    }));
});
// Tests du contrôleur deleteBudget
(0, globals_1.describe)("testing deleteBudget from budgetController", () => {
    (0, globals_1.test)("Deleting a budget not belonging to user returns 404 with message", () => __awaiter(void 0, void 0, void 0, function* () {
        // Requête avec un identifiant de budget non associé à l'utilisateur
        const request = {
            params: {
                id: "50",
            },
            token: mockTocken,
        };
        // Simulation de la réponse Express avec des fonctions imbriquées
        const jsonMock = globals_1.jest.fn();
        const statusMock = globals_1.jest.fn(() => ({ json: jsonMock }));
        const response = {
            status: statusMock,
        };
        yield (0, budgetController_1.deleteBudget)(request, response);
        (0, globals_1.expect)(statusMock).toHaveBeenCalledWith(404);
        (0, globals_1.expect)(jsonMock).toHaveBeenCalledWith({
            status: 404,
            message: "Le budget que vous souhaitez supprimer n'existe pas.",
        });
    }));
    (0, globals_1.test)("Deleting a user's own budget returns 204", () => __awaiter(void 0, void 0, void 0, function* () {
        // Requête avec un identifiant de budget valide appartenant à l'utilisateur
        const request = {
            params: {
                id: "1",
            },
            token: mockTocken,
        };
        const jsonMock = globals_1.jest.fn();
        const statusMock = globals_1.jest.fn(() => ({ json: jsonMock }));
        const response = {
            status: statusMock,
        };
        yield (0, budgetController_1.deleteBudget)(request, response);
        (0, globals_1.expect)(statusMock).toHaveBeenCalledWith(204);
        (0, globals_1.expect)(jsonMock).toHaveBeenCalledWith({
            status: 204,
            message: "Budget supprimé avec succès",
        });
    }));
});
