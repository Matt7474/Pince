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
exports.ExpenditureDatamapper = void 0;
const db_1 = require("../database/db");
const Expenditure_1 = require("../models/Expenditure");
const ExpenditureDatamapper = {
    findById(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `SELECT * FROM "expenditure" WHERE id = $1 AND user_id= $2;`,
                values: [id, user_id],
            };
            const results = yield db_1.db.query(query);
            if (!results.rowCount)
                return null;
            return new Expenditure_1.Expenditure(results.rows[0]);
        });
    },
    findByBudget(budget_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `SELECT * FROM "expenditure" WHERE budget_id= $1 and user_id= $2 ORDER BY date DESC;`,
                values: [budget_id, user_id],
            };
            const results = yield db_1.db.query(query);
            if (!results.rowCount)
                return null;
            return results.rows.map((row) => new Expenditure_1.Expenditure(row));
        });
    },
    findAllWithIconAndColor(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `SELECT expenditure.id, expenditure.budget_id, date, description, amount, budget.color, budget.icon
			       FROM expenditure
			       JOIN budget on budget.id = expenditure.budget_id
			       WHERE expenditure.user_id= $1
			       ORDER BY date DESC;`,
                values: [user_id],
            };
            const results = yield db_1.db.query(query);
            if (!results.rowCount)
                return null;
            return results.rows.map((row) => ({
                expenditure: new Expenditure_1.Expenditure(row),
                budgetColor: row.color,
                budgetIcon: row.icon,
            }));
        });
    },
    create(dataObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `
                INSERT INTO "expenditure" (description, payment_method, amount, date, user_id, budget_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`,
                values: [
                    dataObj.description,
                    dataObj.payment_method,
                    dataObj.amount,
                    dataObj.date,
                    dataObj.user_id,
                    dataObj.budget_id,
                ],
            };
            const result = yield db_1.db.query(query);
            if (!result.rowCount)
                return null;
            const expenditure = new Expenditure_1.Expenditure(result.rows[0]);
            yield ExpenditureDatamapper.updateBudgetAndUserAfterExpenditure(expenditure.user_id, expenditure.budget_id);
            return expenditure;
        });
    },
    update(dataObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `
                UPDATE "expenditure" SET  
                description = $1,
                payment_method = $2,
                amount = $3,
                date = $4
                WHERE id = $5
                RETURNING *;`,
                values: [
                    dataObj.description,
                    dataObj.payment_method,
                    dataObj.amount,
                    dataObj.date,
                    dataObj.id,
                ],
            };
            const result = yield db_1.db.query(query);
            yield ExpenditureDatamapper.updateBudgetAndUserAfterExpenditure(dataObj.user_id, dataObj.budget_id);
            if (!result.rowCount)
                return null;
            return new Expenditure_1.Expenditure(result.rows[0]);
        });
    },
    destroy(expenditure) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `DELETE FROM "expenditure" WHERE id = $1;`,
                values: [expenditure.id],
            };
            yield db_1.db.query(query);
            yield ExpenditureDatamapper.updateBudgetAndUserAfterExpenditure(expenditure.user_id, expenditure.budget_id);
        });
    },
    updateBudgetAndUserAfterExpenditure(user_id, budget_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const budgetQuery = {
                    text: `
                UPDATE "budget" 
                SET spent_amount = (
                    SELECT COALESCE(SUM(amount), 0)
                    FROM expenditure
                    WHERE budget_id = $1
                )
                WHERE id = $1;`,
                    values: [budget_id],
                };
                yield db_1.db.query(budgetQuery);
                const userQuery = {
                    text: `
                UPDATE "users" 
                SET total_expenses = (
                    SELECT COALESCE(SUM(amount), 0)
                    FROM expenditure
                    WHERE user_id = $1
                )
                WHERE id = $1;`,
                    values: [user_id],
                };
                yield db_1.db.query(userQuery);
            }
            catch (error) {
                console.error("Erreur dans updateBudgetAndUserAfterExpenditure :", error);
                throw error;
            }
        });
    },
};
exports.ExpenditureDatamapper = ExpenditureDatamapper;
