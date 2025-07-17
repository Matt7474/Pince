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
exports.getUserInfo = getUserInfo;
exports.updateUserProfile = updateUserProfile;
exports.updatePassword = updatePassword;
exports.updateTheme = updateTheme;
exports.deleteUser = deleteUser;
const argon2_1 = __importDefault(require("argon2"));
const db_1 = require("../database/db");
const UserDatamapper_1 = require("../datamappers/UserDatamapper");
const jwtToken_1 = require("../libs/jwtToken");
function getUserInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = (0, jwtToken_1.getUserIdInToken)(req);
        const user = yield UserDatamapper_1.UserDatamapper.findById(user_id);
        if (!user) {
            res.status(404).json({ status: 404, message: "Utilisateur introuvable." });
            return;
        }
        res.status(200).json({
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            total_budget: user.total_budget,
            total_expenses: user.total_expenses,
            created_at: user.created_at,
            updated_at: user.updated_at,
        });
    });
}
function updateUserProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = (0, jwtToken_1.getUserIdInToken)(req);
        const { email, first_name, last_name } = req.body;
        const updatedUser = yield UserDatamapper_1.UserDatamapper.update({
            id: user_id,
            email,
            first_name,
            last_name,
        });
        if (!updatedUser) {
            res.status(500).json({
                status: 500,
                message: "Erreur lors de la mise à jour du profil.",
            });
            return;
        }
        res.status(200).json({
            id: updatedUser.id,
            email: updatedUser.email,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
        });
    });
}
function updatePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = (0, jwtToken_1.getUserIdInToken)(req);
        const { current_password, new_password } = req.body;
        const user = yield UserDatamapper_1.UserDatamapper.findById(user_id);
        if (!user) {
            res.status(404).json({ status: 404, message: "Utilisateur introuvable." });
            return;
        }
        // Vérification du mot de passe actuel avec argon2
        const passwordMatches = yield argon2_1.default.verify(user.password, current_password);
        if (!passwordMatches) {
            res
                .status(400)
                .json({ status: 400, message: "Mot de passe actuel incorrect." });
            return;
        }
        // Hashage du nouveau mot de passe avec argon2
        const hashedPassword = yield argon2_1.default.hash(new_password);
        const updatedUser = yield UserDatamapper_1.UserDatamapper.update({
            id: user.id,
            password: hashedPassword,
        });
        if (!updatedUser) {
            res.status(500).json({
                status: 500,
                message: "Erreur lors de la modification du mot de passe.",
            });
            return;
        }
        res.status(200).json({ success: true });
    });
}
function updateTheme(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("tentative de changement de theme");
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const userId = req.user.id;
        console.log(userId);
        const { theme } = req.body;
        console.log(typeof theme);
        if (typeof theme !== "string") {
            return res.status(400).json({ error: "Theme invalid" });
        }
        try {
            yield db_1.db.query(`UPDATE users SET theme = $1, updated_at = NOW() WHERE id = $2`, [theme, userId]);
            res.status(200).json({ message: "Theme updated" });
        }
        catch (error) {
            console.error("Error updating theme:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id = (0, jwtToken_1.getUserIdInToken)(req);
        const user = yield UserDatamapper_1.UserDatamapper.findById(user_id);
        if (!user) {
            res.status(404).json({ status: 404, message: "Utilisateur introuvable." });
            return;
        }
        const isDeleted = yield UserDatamapper_1.UserDatamapper.delete(user);
        if (!isDeleted) {
            res.status(500).json({
                status: 500,
                message: "Erreur lors de la suppression du compte utilisateur.",
            });
            return;
        }
        res.status(200).json({ success: true });
    });
}
