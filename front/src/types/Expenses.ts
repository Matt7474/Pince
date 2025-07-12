export type Expense = {
	id: number;
	description: string;
	date: string;
	amount: number;
	budget_id: number;
	budgetColor?: string;
	budgetIcon?: string;
};

export interface NewExpense {
	description: string;
	payment_method: string;
	amount: number;
	date: string;
	budget_id: number;
}

export interface UpdateExpense {
	description: string;
	payment_method: string;
	amount: number;
	date: string;
}
