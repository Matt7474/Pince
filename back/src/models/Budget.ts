import type { BudgetObject } from "../types/ModelTypes";
import { CoreModel } from "./CoreModel";

class Budget extends CoreModel {
	name: string;
	warning_amount: number;
	spent_amount: number;
	allocated_amount: number;
	color?: string;
	icon?: string;
	user_id: number;
	id: any;

	constructor(obj: BudgetObject) {
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

export { Budget };
