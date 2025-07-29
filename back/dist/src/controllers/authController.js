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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.resetPasswordRequest = resetPasswordRequest;
const argon2_1 = __importDefault(require("argon2"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const UserDatamapper_1 = require("../datamappers/UserDatamapper");
const jwtToken_1 = require("../libs/jwtToken");
const sanitize_1 = require("../libs/sanitize");
const validationSchemas_1 = require("../libs/validationSchemas");
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const first_name = (0, sanitize_1.sanitizeInput)(req.body.first_name);
            const last_name = (0, sanitize_1.sanitizeInput)(req.body.last_name);
            const _warning_amount = req.body.warning_amount;
            const _allocated_amount = req.body.allocated_amount;
            // Validation des champs requis
            if (!email || !password || !first_name || !last_name) {
                return res.status(400).json({
                    status: 400,
                    message: "Tous les champs sont obligatoires (email, password, first_name, last_name)",
                });
            }
            // Vérification de la validité via Joi
            const { error } = validationSchemas_1.registerSchema.validate({
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
            const sameEmailUser = yield UserDatamapper_1.UserDatamapper.findByEmail(email);
            if (sameEmailUser) {
                return res.status(409).json({
                    status: 409,
                    message: "Cet email est déjà utilisé!",
                });
            }
            // Hash du mot de passe
            const hashedPassword = yield argon2_1.default.hash(password);
            if (!hashedPassword) {
                return res.status(500).json({
                    status: 500,
                    message: "Erreur lors du hashage du mot de passe",
                });
            }
            // Création du nouvel utilisateur
            const userData = {
                email,
                password: hashedPassword,
                first_name: first_name || null,
                last_name: last_name || null,
                total_budget: 0,
                total_expenses: 0,
                theme: null,
            };
            const newUser = yield UserDatamapper_1.UserDatamapper.create(userData);
            if (!newUser) {
                return res.status(500).json({
                    status: 500,
                    message: "Une erreur est survenue lors de la création de l'utilisateur",
                });
            }
            return res.status(201).json({ status: 201, message: "Utilisateur créé" });
        }
        catch (err) {
            console.error("Erreur inattendue dans registerUser:", err);
            return res.status(500).json({
                status: 500,
                message: "Erreur interne du serveur",
            });
        }
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { email, password } = req.body;
        // Validation
        const { error } = validationSchemas_1.loginSchema.validate({ email, password });
        if (error) {
            res.status(400).json({
                message: "Validation échouée !",
                details: error.details.map((detail) => detail.message),
            });
            return; // Important de return ici
        }
        const user = yield UserDatamapper_1.UserDatamapper.findByEmail(email);
        if (!user) {
            res.status(401).json({
                status: 401,
                message: "Il y a une erreur dans vos identifiants",
            });
            return;
        }
        const correctPassword = yield argon2_1.default.verify(user === null || user === void 0 ? void 0 : user.password, password);
        if (typeof correctPassword === "boolean") {
            if (!correctPassword) {
                res.status(401).json({
                    status: 401,
                    message: "Il y a une erreur dans vos identifiants",
                });
                return;
            }
        }
        else {
            res.status(500).json({
                status: 500,
                message: "Une erreur est survenue lors de la vérification du mot de passe",
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
        const jwtToken = (0, jwtToken_1.generateToken)(tokenPayload);
        // Nouvelle réponse avec token + user (dont theme)
        res.status(201).json({
            status: 201,
            message: "token généré",
            token: jwtToken,
            user: {
                id: user.id,
                email: user.email,
                theme: (_a = user.theme) !== null && _a !== void 0 ? _a : null, // envoi le thème si défini
            },
        });
        return;
    });
}
function resetPasswordRequest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email } = req.body;
        const user = yield UserDatamapper_1.UserDatamapper.findByEmail(email);
        if (!user) {
            return res
                .status(200)
                .json({ message: "Si un compte existe, un lien a été envoyé." });
        }
        const tokenPayload = { email: user.email };
        const jwtToken = (0, jwtToken_1.generateToken)(tokenPayload);
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${jwtToken}`;
        // Configuration nodemailer
        const transporter = nodemailer_1.default.createTransport({
            host: "mail.pince.matt-dev.fr",
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
            yield transporter.sendMail(mailOptions);
            return res.status(201).json({
                status: 201,
                message: "Lien de réinitialisation envoyé par email",
            });
        }
        catch (error) {
            console.error("Erreur lors de l'envoi de l'email", error);
            return res.status(500).json({
                status: 500,
                message: "Erreur lors de l'envoi de l'email",
            });
        }
    });
}
