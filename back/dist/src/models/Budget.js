"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Budget = void 0;
const CoreModel_1 = require("./CoreModel");
class Budget extends CoreModel_1.CoreModel {
    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.warning_amount = obj.warning_amount;
        this.spent_amount = obj.spent_amount;
        this.allocated_amount = obj.allocated_amount;
        this.color = obj.color;
        this.icon = obj.icon;
        this.user_id = obj.user_id;
    }
}
exports.Budget = Budget;
