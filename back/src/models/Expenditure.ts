import type { ExpenditureObject } from "../types/ModelTypes";
import { CoreModel } from "./CoreModel";

class Expenditure extends CoreModel {
	description: string | null;
	payment_method: string | null;
	amount: number;
	date: Date | null;
	user_id: number;
	budget_id: number;

	constructor(obj: ExpenditureObject) {
		super(obj);
		this.description = obj.description;
		this.payment_method = obj.payment_method;
		this.amount = obj.amount;
		this.date = obj.date;
		this.user_id = obj.user_id;
		this.budget_id = obj.budget_id;
	}
}

interface ExpenditureWithDetails {
	expenditure: Expenditure;
	budgetColor: string;
	budgetIcon: string;
}

export { Expenditure, type ExpenditureWithDetails };
