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
exports.BudgetDatamapper = void 0;
const db_1 = require("../database/db");
const Budget_1 = require("../models/Budget");
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class BudgetDatamapper {
    // Trouve un budget spécifique par son ID et vérifie qu'il appartient bien à l'utilisateur.
    static findById(id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `SELECT * FROM "budget" WHERE id = $1 AND user_id = $2;`,
                values: [id, user_id],
            };
            const result = yield db_1.db.query(query);
            if (!result.rowCount) {
                return null;
            }
            return new Budget_1.Budget(result.rows[0]);
        });
    }
    // Trouve tous les budgets associés à un utilisateur.
    static findByUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `SELECT * FROM "budget" WHERE user_id = $1;`,
                values: [user_id],
            };
            const results = yield db_1.db.query(query);
            if (!results.rowCount) {
                return null;
            }
            return results.rows.map((row) => new Budget_1.Budget(row));
        });
    }
    // Crée un nouveau budget dans la base de données.
    static create(dataObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `
                INSERT INTO "budget" (name, warning_amount, allocated_amount, color, icon, user_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`,
                values: [
                    dataObj.name,
                    dataObj.warning_amount,
                    dataObj.allocated_amount,
                    dataObj.color || null,
                    dataObj.icon || null,
                    dataObj.user_id,
                ],
            };
            const result = yield db_1.db.query(query);
            if (!result.rowCount) {
                return null;
            }
            return new Budget_1.Budget(result.rows[0]);
        });
    }
    // Met à jour un budget existant.
    static update(dataObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `
                UPDATE "budget"
                SET
                    name = COALESCE($1, name),
                    warning_amount = COALESCE($2, warning_amount),                    
                    allocated_amount = COALESCE($3, allocated_amount),
                    color = COALESCE($4, color),
                    icon = COALESCE($5, icon)
                WHERE id = $6
                RETURNING *;`,
                values: [
                    dataObj.name || null,
                    dataObj.warning_amount || null,
                    dataObj.allocated_amount || null,
                    dataObj.color || null,
                    dataObj.icon || null,
                    dataObj.id,
                ],
            };
            const result = yield db_1.db.query(query);
            if (!result.rowCount) {
                return null;
            }
            return new Budget_1.Budget(result.rows[0]);
        });
    }
    // Supprime un budget de la base de données.
    static destroy(budget) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `DELETE FROM "budget" WHERE id = $1;`,
                values: [budget.id],
            };
            yield db_1.db.query(query);
            return true;
        });
    }
}
exports.BudgetDatamapper = BudgetDatamapper;
