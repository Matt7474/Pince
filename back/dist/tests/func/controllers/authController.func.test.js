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
const authController_1 = require("../../../src/controllers/authController");
require("../../auth-setup-jest");
(0, globals_1.describe)("testing registerUser from authController", () => {
    (0, globals_1.test)("Valid data (password: 2eTapaovnezdjnj) returns 201 with message: Utilisateur créé", () => __awaiter(void 0, void 0, void 0, function* () {
        // Configuration d'une requête avec des données valides
        const request = {
            body: {
                email: "test@oclock.io",
                password: "2eTapaovnezdjnj",
                first_name: "Jean",
                last_name: "Dupont",
            },
        };
        // Mock de la réponse avec les méthodes status et json
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Appel de la fonction registerUser
        yield (0, authController_1.registerUser)(request, response);
        // Vérification que le statut 201 est retourné
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(201);
        // Vérification du message de succès
        (0, globals_1.expect)(response.json).toHaveBeenCalledWith({
            status: 201,
            message: "Utilisateur créé",
        });
    }));
    (0, globals_1.test)("Valid data (password: XXX---111) returns 201 with message: Utilisateur créé", () => __awaiter(void 0, void 0, void 0, function* () {
        // Configuration d'une requête avec un mot de passe différent mais valide
        const request = {
            body: {
                email: "test@oclock.io",
                password: "XXX---111",
                first_name: "Jean",
                last_name: "Dupont",
            },
        };
        // Mock de la réponse
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Exécution de la fonction registerUser
        yield (0, authController_1.registerUser)(request, response);
        // Vérification du statut de succès
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(201);
        // Vérification du message de réussite
        (0, globals_1.expect)(response.json).toHaveBeenCalledWith({
            status: 201,
            message: "Utilisateur créé",
        });
    }));
    (0, globals_1.test)('Already existing email returns 409 with message: "Cet email est déjà utilisé!"', () => __awaiter(void 0, void 0, void 0, function* () {
        // Premier enregistrement pour créer l'utilisateur initial
        const firstRequest = {
            body: {
                email: "duplicate@test.io",
                password: "2eTapaovnezdjnj",
                first_name: "Jean",
                last_name: "Dupont",
            },
        };
        // Mock de la première réponse
        const firstResponse = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Création du premier utilisateur
        yield (0, authController_1.registerUser)(firstRequest, firstResponse);
        // Tentative d'enregistrement avec le même email
        const secondRequest = {
            body: {
                email: "duplicate@test.io", // Email identique
                password: "2eTapaovnezdjnj",
                first_name: "Jean",
                last_name: "Dupont",
            },
        };
        // Mock de la seconde réponse
        const secondResponse = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Tentative d'enregistrement avec l'email déjà utilisé
        yield (0, authController_1.registerUser)(secondRequest, secondResponse);
        // Vérification du statut d'erreur 409 (conflit)
        (0, globals_1.expect)(secondResponse.status).toHaveBeenCalledWith(409);
        // Vérification du message d'erreur approprié
        (0, globals_1.expect)(secondResponse.json).toHaveBeenCalledWith({
            status: 409,
            message: "Cet email est déjà utilisé!",
        });
    }));
    (0, globals_1.test)("Password under 8 characters returns 400", () => __awaiter(void 0, void 0, void 0, function* () {
        // Configuration d'une requête avec un mot de passe trop court
        const request = {
            body: {
                email: "test@oclock.io",
                password: "2eTapai", // 7 caractères seulement
                first_name: "Jean",
                last_name: "Dupont",
            },
        };
        // Mock de la réponse
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Exécution de la fonction avec un mot de passe invalide
        yield (0, authController_1.registerUser)(request, response);
        // Vérification du statut d'erreur 400 (bad request)
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
    }));
    (0, globals_1.test)("Password without upper-case character returns 400", () => __awaiter(void 0, void 0, void 0, function* () {
        // Configuration d'une requête avec un mot de passe sans majuscule
        const request = {
            body: {
                email: "test@oclock.io",
                password: "azertyuiop", // Que des minuscules
                first_name: "Jean",
                last_name: "Dupont",
            },
        };
        // Mock de la réponse
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Exécution avec un mot de passe sans majuscule
        yield (0, authController_1.registerUser)(request, response);
        // Vérification du statut d'erreur de validation
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
    }));
    (0, globals_1.test)("Password without number character returns 400", () => __awaiter(void 0, void 0, void 0, function* () {
        // Configuration d'une requête avec un mot de passe sans chiffre
        const request = {
            body: {
                email: "test@oclock.io",
                password: "AZertyuioP", // Lettres uniquement, pas de chiffre
                first_name: "Jean",
                last_name: "Dupont",
            },
        };
        // Mock de la réponse
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Exécution avec un mot de passe sans chiffre
        yield (0, authController_1.registerUser)(request, response);
        // Vérification du statut d'erreur de validation
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
    }));
    (0, globals_1.test)("Email format not valid returns 400", () => __awaiter(void 0, void 0, void 0, function* () {
        // Configuration d'une requête avec un email au format incorrect
        const request = {
            body: {
                email: "test@gmcom", // Format d'email invalide (manque .extension)
                password: "2eTapqqai",
                first_name: "Jean",
                last_name: "Dupont",
            },
        };
        // Mock de la réponse
        const response = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Exécution avec un email invalide
        yield (0, authController_1.registerUser)(request, response);
        // Vérification du statut d'erreur de validation
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
    }));
});
(0, globals_1.describe)("testing loginUser from authController", () => {
    (0, globals_1.test)("Wrong password returns 401 with message: Il y a une erreur dans vos identifiants", () => __awaiter(void 0, void 0, void 0, function* () {
        // Enregistrement initial d'un utilisateur
        const registerRequest = {
            body: {
                email: "d.matt7@hotmail.io",
                password: "1Azertyuiop",
                first_name: "Test",
                last_name: "User",
            },
        };
        // Mock pour l'enregistrement
        const registerResponse = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Création de l'utilisateur
        yield (0, authController_1.registerUser)(registerRequest, registerResponse);
        // Tentative de connexion avec un mot de passe incorrect
        const loginRequest = {
            body: {
                email: "d.matt7@hotmail.io",
                password: "2eTapaovnezdjnj", // Mot de passe différent de celui enregistré
            },
        };
        // Mock pour la tentative de connexion
        const loginResponse = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Tentative de connexion avec des identifiants incorrects
        yield (0, authController_1.loginUser)(loginRequest, loginResponse);
        // Vérification du statut d'erreur 401 (non autorisé)
        (0, globals_1.expect)(loginResponse.status).toHaveBeenCalledWith(401);
        // Vérification du message d'erreur d'authentification
        (0, globals_1.expect)(loginResponse.json).toHaveBeenCalledWith({
            status: 401,
            message: "Il y a une erreur dans vos identifiants",
        });
    }));
    (0, globals_1.test)("Correct email and password returns 201 with a token", () => __awaiter(void 0, void 0, void 0, function* () {
        // Enregistrement initial d'un utilisateur
        const registerRequest = {
            body: {
                email: "test@example.com",
                password: "1Azertyuiop",
                first_name: "bob",
                last_name: "morane",
            },
        };
        // Mock pour l'enregistrement
        const registerResponse = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        // Création de l'utilisateur
        yield (0, authController_1.registerUser)(registerRequest, registerResponse);
        // Tentative de connexion avec les bons identifiants
        const loginRequest = {
            body: {
                email: "test@example.com",
                password: "1Azertyuiop", // Mot de passe correct
            },
        };
        // Configuration des mocks pour la réponse de connexion
        const jsonMock = globals_1.jest.fn();
        const statusMock = globals_1.jest.fn().mockReturnValue({ json: jsonMock });
        const loginResponse = {
            status: statusMock,
        };
        // Tentative de connexion avec les bons identifiants
        yield (0, authController_1.loginUser)(loginRequest, loginResponse);
        // Vérification que le statut 201 (succès) a été appelé
        (0, globals_1.expect)(statusMock).toHaveBeenCalledWith(201);
        // Vérification que la méthode json a été appelée
        (0, globals_1.expect)(jsonMock).toHaveBeenCalled();
        // Récupération des données de la réponse
        const responseData = jsonMock.mock.calls[0][0];
        // Vérification de la présence du token
        (0, globals_1.expect)(responseData.token).toBeDefined();
        // Vérification que le token est une chaîne de caractères
        (0, globals_1.expect)(typeof responseData.token).toBe("string");
    }));
});
