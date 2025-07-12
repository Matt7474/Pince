import { db } from "../database/db";
import type {
	Expenditure as ExpenditureType,
	ExpenditureWithDetails,
} from "../models/Expenditure";
import { Expenditure } from "../models/Expenditure";
import type { ExpenditureObject } from "../types/ModelTypes";

const ExpenditureDatamapper = {
	async findById(id: number, user_id: number): Promise<Expenditure | null> {
		const query = {
			text: `SELECT * FROM "expenditure" WHERE id = $1 AND user_id= $2;`,
			values: [id, user_id],
		};

		const results = await db.query(query);
		if (!results.rowCount) return null;

		return new Expenditure(results.rows[0]);
	},

	async findByBudget(
		budget_id: number,
		user_id: number,
	): Promise<Expenditure[] | null> {
		const query = {
			text: `SELECT * FROM "expenditure" WHERE budget_id= $1 and user_id= $2 ORDER BY date DESC;`,
			values: [budget_id, user_id],
		};

		const results = await db.query(query);
		if (!results.rowCount) return null;

		return results.rows.map((row) => new Expenditure(row));
	},

	async findAllWithIconAndColor(
		user_id: number,
	): Promise<ExpenditureWithDetails[] | null> {
		const query = {
			text: `SELECT expenditure.id, expenditure.budget_id, date, description, amount, budget.color, budget.icon
			       FROM expenditure
			       JOIN budget on budget.id = expenditure.budget_id
			       WHERE expenditure.user_id= $1
			       ORDER BY date DESC;`,
			values: [user_id],
		};

		const results = await db.query(query);
		if (!results.rowCount) return null;

		return results.rows.map((row) => ({
			expenditure: new Expenditure(row),
			budgetColor: row.color,
			budgetIcon: row.icon,
		}));
	},

	async create(dataObj: ExpenditureObject): Promise<Expenditure | null> {
		const query = {
			text: `
                INSERT INTO "expenditure" (description, payment_method, amount, date, user_id, budget_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`,
			values: [
				dataObj.description,
				dataObj.payment_method,
				dataObj.amount,
				dataObj.date,
				dataObj.user_id,
				dataObj.budget_id,
			],
		};

		const result = await db.query(query);
		if (!result.rowCount) return null;

		const expenditure = new Expenditure(result.rows[0]);
		await ExpenditureDatamapper.updateBudgetAndUserAfterExpenditure(
			expenditure.user_id,
			expenditure.budget_id,
		);

		return expenditure;
	},

	async update(dataObj: ExpenditureObject): Promise<Expenditure | null> {
		const query = {
			text: `
                UPDATE "expenditure" SET  
                description = $1,
                payment_method = $2,
                amount = $3,
                date = $4
                WHERE id = $5
                RETURNING *;`,
			values: [
				dataObj.description,
				dataObj.payment_method,
				dataObj.amount,
				dataObj.date,
				dataObj.id,
			],
		};

		const result = await db.query(query);

		await ExpenditureDatamapper.updateBudgetAndUserAfterExpenditure(
			dataObj.user_id,
			dataObj.budget_id,
		);

		if (!result.rowCount) return null;

		return new Expenditure(result.rows[0]);
	},

	async destroy(expenditure: Expenditure): Promise<void> {
		const query = {
			text: `DELETE FROM "expenditure" WHERE id = $1;`,
			values: [expenditure.id],
		};

		await db.query(query);

		await ExpenditureDatamapper.updateBudgetAndUserAfterExpenditure(
			expenditure.user_id,
			expenditure.budget_id,
		);
	},

	async updateBudgetAndUserAfterExpenditure(
		user_id: number,
		budget_id: number,
	): Promise<void> {
		try {
			const budgetQuery = {
				text: `
                UPDATE "budget" 
                SET spent_amount = (
                    SELECT COALESCE(SUM(amount), 0)
                    FROM expenditure
                    WHERE budget_id = $1
                )
                WHERE id = $1;`,
				values: [budget_id],
			};

			await db.query(budgetQuery);

			const userQuery = {
				text: `
                UPDATE "users" 
                SET total_expenses = (
                    SELECT COALESCE(SUM(amount), 0)
                    FROM expenditure
                    WHERE user_id = $1
                )
                WHERE id = $1;`,
				values: [user_id],
			};

			await db.query(userQuery);
		} catch (error) {
			console.error("Erreur dans updateBudgetAndUserAfterExpenditure :", error);
			throw error;
		}
	},
};

export { ExpenditureDatamapper };
