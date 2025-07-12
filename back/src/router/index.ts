import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { authRouter } from "./authRouter";
import { budgetRouter } from "./budgetRouter";
import { expenditureRouter } from "./expenditureRouter";
import { userRouter } from "./userRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/expenses", expenditureRouter);
router.use("/budgets", budgetRouter);
router.use("/users", userRouter);

const swaggerDocument = YAML.load("./src/swagger/swagger.yaml");
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export { router };
