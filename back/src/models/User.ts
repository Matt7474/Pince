import type { UserObject } from "../types/ModelTypes";
import { CoreModel } from "./CoreModel";

class User extends CoreModel {
	email: string;
	password: string;
	last_name: string | null;
	first_name: string | null;
	total_budget: number;
	total_expenses: number;
	theme?: string | null;

	constructor(obj: UserObject) {
		super(obj);
		this.email = obj.email;
		this.password = obj.password;
		this.last_name = obj.last_name;
		this.first_name = obj.first_name;
		this.total_budget = obj.total_budget;
		this.total_expenses = obj.total_expenses;
		this.theme = obj.theme ?? null;
	}
}

export { User };
