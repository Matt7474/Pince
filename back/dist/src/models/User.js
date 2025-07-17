"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const CoreModel_1 = require("./CoreModel");
class User extends CoreModel_1.CoreModel {
    constructor(obj) {
        var _a;
        super(obj);
        this.email = obj.email;
        this.password = obj.password;
        this.last_name = obj.last_name;
        this.first_name = obj.first_name;
        this.total_budget = obj.total_budget;
        this.total_expenses = obj.total_expenses;
        this.theme = (_a = obj.theme) !== null && _a !== void 0 ? _a : null;
    }
}
exports.User = User;
