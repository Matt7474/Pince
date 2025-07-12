import { db } from "../database/db";
import { Budget } from "../models/Budget";
import type { BudgetObject } from "../types/ModelTypes";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
class BudgetDatamapper {
	// Trouve un budget spécifique par son ID et vérifie qu'il appartient bien à l'utilisateur.
	static async findById(id: number, user_id: number): Promise<Budget | null> {
		const query = {
			text: `SELECT * FROM "budget" WHERE id = $1 AND user_id = $2;`,
			values: [id, user_id],
		};

		const result = await db.query(query);

		if (!result.rowCount) {
			return null;
		}

		return new Budget(result.rows[0]);
	}

	// Trouve tous les budgets associés à un utilisateur.
	static async findByUser(user_id: number): Promise<Budget[] | null> {
		const query = {
			text: `SELECT * FROM "budget" WHERE user_id = $1;`,
			values: [user_id],
		};

		const results = await db.query(query);

		if (!results.rowCount) {
			return null;
		}

		return results.rows.map((row) => new Budget(row));
	}

	// Crée un nouveau budget dans la base de données.
	static async create(dataObj: BudgetObject): Promise<Budget | null> {
		const query = {
			text: `
                INSERT INTO "budget" (name, warning_amount, allocated_amount, color, icon, user_id)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;`,
			values: [
				dataObj.name,
				dataObj.warning_amount,
				dataObj.allocated_amount,
				dataObj.color || null,
				dataObj.icon || null,
				dataObj.user_id,
			],
		};

		const result = await db.query(query);

		if (!result.rowCount) {
			return null;
		}

		return new Budget(result.rows[0]);
	}

	// Met à jour un budget existant.
	static async update(dataObj: Partial<BudgetObject>): Promise<Budget | null> {
		const query = {
			text: `
                UPDATE "budget"
                SET
                    name = COALESCE($1, name),
                    warning_amount = COALESCE($2, warning_amount),                    
                    allocated_amount = COALESCE($3, allocated_amount),
                    color = COALESCE($4, color),
                    icon = COALESCE($5, icon)
                WHERE id = $6
                RETURNING *;`,
			values: [
				dataObj.name || null,
				dataObj.warning_amount || null,
				dataObj.allocated_amount || null,
				dataObj.color || null,
				dataObj.icon || null,
				dataObj.id,
			],
		};

		const result = await db.query(query);

		if (!result.rowCount) {
			return null;
		}

		return new Budget(result.rows[0]);
	}

	// Supprime un budget de la base de données.
	static async destroy(budget: Budget): Promise<boolean> {
		const query = {
			text: `DELETE FROM "budget" WHERE id = $1;`,
			values: [budget.id],
		};

		await db.query(query);

		return true;
	}
}

export { BudgetDatamapper };
