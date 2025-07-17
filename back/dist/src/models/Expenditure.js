"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Expenditure = void 0;
const CoreModel_1 = require("./CoreModel");
class Expenditure extends CoreModel_1.CoreModel {
    constructor(obj) {
        super(obj);
        this.description = obj.description;
        this.payment_method = obj.payment_method;
        this.amount = obj.amount;
        this.date = obj.date;
        this.user_id = obj.user_id;
        this.budget_id = obj.budget_id;
    }
}
exports.Expenditure = Expenditure;
