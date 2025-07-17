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
exports.UserDatamapper = void 0;
const db_1 = require("../database/db");
const User_1 = require("../models/User");
// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class UserDatamapper {
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: "SELECT * FROM users WHERE email = $1",
                values: [email],
            };
            const results = yield db_1.db.query(query);
            if (!results.rowCount) {
                return null;
            }
            const user = new User_1.User(results.rows[0]);
            return user;
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: "SELECT * FROM users WHERE id = $1;",
                values: [id],
            };
            const results = yield db_1.db.query(query);
            if ((results === null || results === void 0 ? void 0 : results.rowCount) && results.rowCount > 0) {
                return new User_1.User(results.rows[0]);
            }
            return null;
        });
    }
    static create(dataObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `
                INSERT INTO users (first_name, last_name, email, password, total_budget, total_expenses)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`,
                values: [
                    dataObj.first_name,
                    dataObj.last_name,
                    dataObj.email,
                    dataObj.password,
                    dataObj.total_budget,
                    dataObj.total_expenses,
                ],
            };
            const result = yield db_1.db.query(query);
            if (!result.rowCount) {
                return null;
            }
            const user = new User_1.User(result.rows[0]);
            return user;
        });
    }
    static update(dataObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                text: `
                UPDATE users
                SET
                    first_name = COALESCE($1, first_name),
                    last_name = COALESCE($2, last_name),
                    email = COALESCE($3, email),
                    password = COALESCE($4, password)
                WHERE id = $5
                RETURNING *;`,
                values: [
                    dataObj.first_name || null,
                    dataObj.last_name || null,
                    dataObj.email || null,
                    dataObj.password || null,
                    dataObj.id,
                ],
            };
            const result = yield db_1.db.query(query);
            if (!result.rowCount) {
                return null;
            }
            return new User_1.User(result.rows[0]);
        });
    }
    static delete(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {
                    text: `DELETE FROM users WHERE id = $1;`,
                    values: [user.id],
                };
                yield db_1.db.query(query);
                return true;
            }
            catch (error) {
                console.error("Erreur dans delete :", error);
                return false;
            }
        });
    }
}
exports.UserDatamapper = UserDatamapper;
