import { Router } from "express";
import * as expenditureController from "../controllers/expenditureController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { catchErrors } from "../middlewares/catchErrors";

const expenditureRouter = Router();

expenditureRouter.get(
	"/",
	authMiddleware,
	catchErrors(expenditureController.getAllExpenditures),
);

expenditureRouter.get(
	"/:expenditure_id",
	authMiddleware,
	catchErrors(expenditureController.getOneExpenditure),
);

expenditureRouter.post(
	"/",
	authMiddleware,
	catchErrors(expenditureController.createExpenditure),
);

expenditureRouter.patch(
	"/:expenditure_id",
	authMiddleware,
	catchErrors(expenditureController.updateExpenditure),
);

expenditureRouter.delete(
	"/:expenditure_id",
	authMiddleware,
	catchErrors(expenditureController.deleteExpenditure),
);

export { expenditureRouter };
