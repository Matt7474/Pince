import { Router } from "express";
import { authRouter } from "./authRouter";
import { budgetRouter } from "./budgetRouter";
import { expenditureRouter } from "./expenditureRouter";
import { userRouter } from "./userRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/expenses", expenditureRouter);
router.use("/budgets", budgetRouter);
router.use("/users", userRouter);

export { router };
