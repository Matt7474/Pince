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
exports.getAllExpenditures = getAllExpenditures;
exports.getOneExpenditure = getOneExpenditure;
exports.createExpenditure = createExpenditure;
exports.deleteExpenditure = deleteExpenditure;
exports.updateExpenditure = updateExpenditure;
const ExpenditureDatamapper_1 = require("../datamappers/ExpenditureDatamapper");
const jwtToken_1 = require("../libs/jwtToken");
const validationSchemas_1 = require("../libs/validationSchemas");
function getAllExpenditures(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //budget_id sera undefined (ou null) dans la requête pour le dashboard"
        //budget_id aura une valeur dans la requête pour les dépenses"
        const { budgetId } = req.query;
        //On récupère l'id de l'utilisateur dans le token
        const user_id_for_db = (0, jwtToken_1.getUserIdInToken)(req);
        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
        let expenditures;
        if (budgetId) {
            const budget_id_for_db = Number(budgetId);
            expenditures = yield ExpenditureDatamapper_1.ExpenditureDatamapper.findByBudget(budget_id_for_db, user_id_for_db);
        }
        else {
            expenditures =
                yield ExpenditureDatamapper_1.ExpenditureDatamapper.findAllWithIconAndColor(user_id_for_db);
        }
        if (expenditures === null || expenditures === void 0 ? void 0 : expenditures.length) {
            res.status(200).json({ status: 200, data: expenditures });
            return;
        }
        else {
            res.status(404).json({ status: 404, message: "Aucune dépense" });
            return;
        }
    });
}
function getOneExpenditure(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //le budget_id se trouve dans le endpoint (route paramétrée) "/expenses"
        const { expenditure_id } = req.params;
        //on convertit ce qui doit être convertit
        //Ce qui vient du token est de la route est au format string, on veut des number
        const expenditure_id_for_db = Number(expenditure_id);
        //On récupère l'id de l'utilisateur dans le token
        const user_id_for_db = (0, jwtToken_1.getUserIdInToken)(req);
        const expenditure = yield ExpenditureDatamapper_1.ExpenditureDatamapper.findById(expenditure_id_for_db, user_id_for_db);
        if (expenditure) {
            res.status(200).json({ status: 200, data: expenditure });
            return;
        }
        else {
            res
                .status(404)
                .json({ status: 404, message: "Cette dépense est introuvable" });
            return;
        }
    });
}
function createExpenditure(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //On récupère l'id de l'utilisateur dans le token
        const user_id_for_db = (0, jwtToken_1.getUserIdInToken)(req);
        //le reste est dans le body
        const { budget_id, description, payment_method, amount, date } = req.body;
        const amount_for_db = typeof amount === "string" ? Number(amount.replace(",", ".")) : amount;
        const budget_id_for_db = Number(budget_id);
        let date_for_db;
        if (date) {
            date_for_db = new Date(date);
        }
        else {
            date_for_db = null;
        }
        //Vérification de la validité du montant, réponse 400 avec un message personnalisé en cas d'échec
        const { error } = validationSchemas_1.amountSchema.validate(amount_for_db);
        if (error) {
            res.status(400).json({
                message: "Validation échouée !",
                details: error.details.map((detail) => detail.message),
            });
            return;
        }
        const expenditureData = {
            description: description ? description : null,
            payment_method: payment_method ? payment_method : null,
            amount: amount_for_db,
            date: date_for_db,
            budget_id: budget_id_for_db,
            user_id: user_id_for_db,
        };
        console.log("ExpenditureData:", expenditureData);
        const newExpenditure = yield ExpenditureDatamapper_1.ExpenditureDatamapper.create(expenditureData);
        if (newExpenditure) {
            res.status(201).json({ status: 201, message: "Dépense créée" });
            return;
        }
        else {
            res.status(500).json({
                status: 500,
                message: "Une erreur est survenue lors de l'enregistrement' de la dépense",
            });
            return;
        }
    });
}
function deleteExpenditure(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { expenditure_id } = req.params;
        const expenditure_id_for_db = Number(expenditure_id);
        //On récupère l'id de l'utilisateur dans le token
        const user_id_for_db = (0, jwtToken_1.getUserIdInToken)(req);
        const expenditure = yield ExpenditureDatamapper_1.ExpenditureDatamapper.findById(expenditure_id_for_db, user_id_for_db);
        if (expenditure) {
            yield ExpenditureDatamapper_1.ExpenditureDatamapper.destroy(expenditure);
            res.status(200).json({ status: 200, message: "Dépense supprimée" });
            return;
        }
        else {
            res.status(404).json({
                status: 404,
                message: "Le dépense que vous voulez supprimer n'existe pas!",
            });
            return;
        }
    });
}
function updateExpenditure(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { expenditure_id } = req.params;
        const expenditure_id_for_db = Number(expenditure_id);
        //On récupère l'id de l'utilisateur dans le token
        const user_id_for_db = (0, jwtToken_1.getUserIdInToken)(req);
        console.log("USERID?: ", user_id_for_db);
        const expenditure = yield ExpenditureDatamapper_1.ExpenditureDatamapper.findById(expenditure_id_for_db, user_id_for_db);
        const { description, payment_method, amount, date } = req.body;
        console.log("REQUEST BODY: description, payment_method, amount, date ", description, payment_method, amount, date);
        const amount_for_db = typeof amount === "string" ? Number(amount.replace(",", ".")) : amount;
        //Vérification de la validité du montant, réponse 400 avec un message personnalisé en cas d'échec
        const { error } = validationSchemas_1.amountSchema.validate(amount_for_db);
        if (error) {
            res.status(400).json({
                message: "Validation échouée !",
                details: error.details.map((detail) => detail.message),
            });
            return;
        }
        let date_for_db;
        if (date) {
            date_for_db = new Date(date);
        }
        else {
            date_for_db = null;
        }
        if (expenditure) {
            const expenditureData = {
                id: expenditure.id,
                description: description ? description : null,
                payment_method: payment_method ? payment_method : null,
                amount: amount_for_db,
                date: date_for_db,
                budget_id: expenditure.budget_id,
                user_id: expenditure.user_id,
            };
            const updatedExpenditure = yield ExpenditureDatamapper_1.ExpenditureDatamapper.update(expenditureData);
            res.status(201).json({
                status: 200,
                message: "dépense modifiée",
                data: updatedExpenditure,
            });
            return;
        }
        else {
            res
                .status(404)
                .json({ status: 404, message: "Cette dépense est introuvable" });
            return;
        }
    });
}
