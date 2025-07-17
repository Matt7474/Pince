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
exports.getAllBudgets = getAllBudgets;
exports.getBudgetById = getBudgetById;
exports.updateBudgetPosition = updateBudgetPosition;
exports.createBudget = createBudget;
exports.updateBudget = updateBudget;
exports.deleteBudget = deleteBudget;
const db_1 = require("../database/db");
const BudgetDatamapper_1 = require("../datamappers/BudgetDatamapper");
const jwtToken_1 = require("../libs/jwtToken");
const validationSchemas_1 = require("../libs/validationSchemas");
function getAllBudgets(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id_for_db = (0, jwtToken_1.getUserIdInToken)(req);
        const budgets = yield BudgetDatamapper_1.BudgetDatamapper.findByUser(user_id_for_db);
        res.status(200).json({
            status: 200,
            data: budgets !== null && budgets !== void 0 ? budgets : [],
        });
    });
}
function getBudgetById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const user_id_for_db = (0, jwtToken_1.getUserIdInToken)(req);
        const budget_id_for_db = Number(id);
        const budget = yield BudgetDatamapper_1.BudgetDatamapper.findById(budget_id_for_db, user_id_for_db);
        if (budget) {
            res.status(200).json({ status: 200, data: budget });
            return;
        }
        else {
            res
                .status(404)
                .json({ status: 404, message: "Ce budget est introuvable." });
            return;
        }
    });
}
function updateBudgetPosition(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const budgetId = Number(req.params.id);
        const { position } = req.body;
        if (typeof position !== "number") {
            return res.status(400).json({ error: "Position doit être un nombre" });
        }
        try {
            // Met à jour uniquement la position
            yield db_1.db.query(`UPDATE budget SET position = $1, updated_at = NOW() WHERE id = $2`, [position, budgetId]);
            res.status(200).json({ message: "Position mise à jour" });
        }
        catch (error) {
            console.error("Erreur update position:", error);
            res.status(500).json({ error: "Erreur serveur" });
        }
    });
}
function createBudget(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_id_for_db = (0, jwtToken_1.getUserIdInToken)(req);
        const { name, warning_amount, allocated_amount, color, icon } = req.body;
        const warning_amount_for_db = typeof warning_amount === "string"
            ? Number(warning_amount.replace(",", "."))
            : warning_amount;
        const allocated_amount_for_db = typeof allocated_amount === "string"
            ? Number(allocated_amount.replace(",", "."))
            : allocated_amount;
        if (warning_amount_for_db >= allocated_amount_for_db) {
            res.status(400).json({
                message: "Le montant d'alerte doit être inférieur au montant alloué.",
            });
            return;
        }
        const { error } = validationSchemas_1.budgetSchema.validate({
            name,
            warning_amount_for_db,
            allocated_amount_for_db,
            color,
            icon,
        });
        if (error) {
            res.status(400).json({
                message: "Validation échouée.",
                details: error.details.map((detail) => detail.message),
            });
            return;
        }
        const budgetData = {
            name,
            warning_amount: warning_amount_for_db,
            spent_amount: 0,
            allocated_amount: allocated_amount_for_db,
            color: color || null,
            icon: icon || null,
            user_id: user_id_for_db,
        };
        const newBudget = yield BudgetDatamapper_1.BudgetDatamapper.create(budgetData);
        if (newBudget) {
            res.status(201).json({
                status: 201,
                message: "Budget créé avec succès.",
                data: newBudget,
            });
            return;
        }
        else {
            res.status(500).json({
                status: 500,
                message: "Une erreur est survenue lors de la création du budget.",
            });
            return;
        }
    });
}
function updateBudget(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const user_id_for_db = (0, jwtToken_1.getUserIdInToken)(req);
        const budget_id_for_db = Number(id);
        const { name, warning_amount, allocated_amount, color, icon } = req.body;
        const budget = yield BudgetDatamapper_1.BudgetDatamapper.findById(budget_id_for_db, user_id_for_db);
        if (!budget) {
            res
                .status(404)
                .json({ status: 404, message: "Ce budget est introuvable." });
            return;
        }
        if (warning_amount >= allocated_amount) {
            res.status(400).json({
                message: "Le montant d'alerte  doit être inférieur au montant alloué .",
            });
            return;
        }
        const { error } = validationSchemas_1.budgetSchema.validate({ name, color, icon });
        if (error) {
            res.status(400).json({
                message: "Validation échouée.",
                details: error.details.map((detail) => detail.message),
            });
            return;
        }
        const updateData = {
            id: budget.id,
            name: name || budget.name,
            warning_amount: warning_amount !== null && warning_amount !== void 0 ? warning_amount : budget.warning_amount,
            spent_amount: budget.spent_amount,
            allocated_amount: allocated_amount !== null && allocated_amount !== void 0 ? allocated_amount : budget.allocated_amount,
            color: color || budget.color,
            icon: icon || budget.icon,
        };
        const updatedBudget = yield BudgetDatamapper_1.BudgetDatamapper.update(updateData);
        if (updatedBudget) {
            res.status(200).json({
                status: 200,
                message: "Budget modifié avec succès.",
                data: updatedBudget,
            });
            return;
        }
        else {
            res.status(500).json({
                status: 500,
                message: "Une erreur est survenue lors de la modification du budget.",
            });
            return;
        }
    });
}
function deleteBudget(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const user_id_for_db = (0, jwtToken_1.getUserIdInToken)(req);
        const budget_id_for_db = Number(id);
        const budget = yield BudgetDatamapper_1.BudgetDatamapper.findById(budget_id_for_db, user_id_for_db);
        if (!budget) {
            res.status(404).json({
                status: 404,
                message: "Le budget que vous souhaitez supprimer n'existe pas.",
            });
            return;
        }
        const deleted = yield BudgetDatamapper_1.BudgetDatamapper.destroy(budget);
        if (deleted) {
            res.status(204).json({
                status: 204,
                message: "Budget supprimé avec succès",
            });
            return;
        }
        else {
            res.status(500).json({
                status: 500,
                message: "Une erreur est survenue lors de la suppression du budget.",
            });
            return;
        }
    });
}
