import { Router } from "express";
import * as budgetController from "../controllers/budgetController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { catchErrors } from "../middlewares/catchErrors";

const budgetRouter = Router();

budgetRouter.get(
	"/",
	authMiddleware,
	catchErrors(budgetController.getAllBudgets),
);

budgetRouter.get(
	"/:id",
	authMiddleware,
	catchErrors(budgetController.getBudgetById),
);
budgetRouter.patch(
	"/:id/position",
	authMiddleware,
	catchErrors(budgetController.updateBudgetPosition),
);

budgetRouter.post("/", authMiddleware, budgetController.createBudget);

budgetRouter.patch("/:id", authMiddleware, budgetController.updateBudget);

budgetRouter.delete("/:id", authMiddleware, budgetController.deleteBudget);

export { budgetRouter };
