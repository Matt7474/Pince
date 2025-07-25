export interface CoreObject {
	id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface UserObject extends CoreObject {
	theme: null;
	email: string;
	password: string;
	first_name: string | null;
	last_name: string | null;
	total_budget: number;
	total_expenses: number;
}

export interface ExpenditureObject extends CoreObject {
	description: string | null;
	payment_method: string | null;
	amount: number;
	date: Date | null;
	user_id: number;
	budget_id: number;
}

export interface BudgetObject extends CoreObject {
	name: string | null;
	warning_amount: number;
	spent_amount: number;
	allocated_amount: number;
	color: string | null;
	icon: string | null;
	user_id: number;
}
